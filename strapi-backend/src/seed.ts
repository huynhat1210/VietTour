import type { Core } from '@strapi/strapi';
import {
  SEED_DESTINATIONS,
  SEED_TESTIMONIALS,
  SEED_TOURS,
} from './data/seed-content';

const PUBLIC_ACTIONS = [
  'api::destination.destination.find',
  'api::destination.destination.findOne',
  'api::tour.tour.find',
  'api::tour.tour.findOne',
  'api::testimonial.testimonial.find',
  'api::testimonial.testimonial.findOne',
  'api::booking.booking.create',
  'api::contact.contact.create',
  'plugin::users-permissions.auth.register',
  'plugin::users-permissions.auth.callback',
  'plugin::users-permissions.auth.connect',
];

export async function setupPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  for (const action of PUBLIC_ACTIONS) {
    const existing = await strapi.db
      .query('plugin::users-permissions.permission')
      .findMany({ where: { action, role: publicRole.id } });

    if (existing.length === 0) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  }
}

const AUTHENTICATED_ACTIONS = [
  'plugin::users-permissions.user.me',
  'plugin::users-permissions.user.update',
  'api::booking.booking.find',
  'api::booking.booking.findOne',
  'api::booking.booking.updateStatus',
  'api::booking.booking.me',
  'api::booking.booking.listUsers',
  'api::booking.booking.updateUser',
  'api::booking.booking.deleteUser',
  'api::booking.booking.listRoles',
];

export async function setupAuthenticatedPermissions(strapi: Core.Strapi) {
  const rolesToSetup = ['authenticated', 'manager'];

  for (const roleType of rolesToSetup) {
    const role = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: roleType } });

    if (!role) continue;

    for (const action of AUTHENTICATED_ACTIONS) {
      const existing = await strapi.db
        .query('plugin::users-permissions.permission')
        .findMany({ where: { action, role: role.id } });

      if (existing.length === 0) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action, role: role.id },
        });
      }
    }
  }
}

async function syncDestinations(strapi: Core.Strapi) {
  const ids: Record<string, string> = {};

  for (const dest of SEED_DESTINATIONS) {
    const existing = await strapi.documents('api::destination.destination').findMany({
      filters: { slug: dest.slug },
      limit: 1,
    });

    if (existing.length > 0) {
      ids[dest.slug] = existing[0].documentId;
      continue;
    }

    const created = await strapi.documents('api::destination.destination').create({
      data: dest,
      status: 'published',
    });
    ids[dest.slug] = created.documentId;
    strapi.log.info(`+ Destination: ${dest.name}`);
  }

  return ids;
}

async function syncTours(
  strapi: Core.Strapi,
  destinationIds: Record<string, string>
) {
  const tourIds: Record<string, string> = {};

  for (const tour of SEED_TOURS) {
    const existing = await strapi.documents('api::tour.tour').findMany({
      filters: { slug: tour.slug },
      limit: 1,
    });

    if (existing.length > 0) {
      tourIds[tour.slug] = existing[0].documentId;
      continue;
    }

    const { destinationSlug, ...tourData } = tour;
    const destId = destinationIds[destinationSlug];

    if (!destId) {
      strapi.log.warn(`Skip tour "${tour.slug}": missing destination ${destinationSlug}`);
      continue;
    }

    const created = await strapi.documents('api::tour.tour').create({
      data: {
        ...tourData,
        destination: destId,
      },
      status: 'published',
    });
    tourIds[tour.slug] = created.documentId;
    strapi.log.info(`+ Tour: ${tour.title}`);
  }

  return tourIds;
}

async function syncTestimonials(
  strapi: Core.Strapi,
  tourIds: Record<string, string>
) {
  for (const testimonial of SEED_TESTIMONIALS) {
    const { tourSlug, ...data } = testimonial;
    const tourId = tourIds[tourSlug];
    if (!tourId) continue;

    const existing = await strapi.documents('api::testimonial.testimonial').findMany({
      filters: { name: data.name, content: data.content },
      limit: 1,
    });

    if (existing.length > 0) continue;

    await strapi.documents('api::testimonial.testimonial').create({
      data: { ...data, tour: tourId },
      status: 'published',
    });
    strapi.log.info(`+ Testimonial: ${data.name}`);
  }
}

export async function seedDatabase(strapi: Core.Strapi) {
  strapi.log.info('Syncing VietTour seed data...');

  const destinationIds = await syncDestinations(strapi);
  const tourIds = await syncTours(strapi, destinationIds);
  await syncTestimonials(strapi, tourIds);

  strapi.log.info(
    `VietTour sync done — ${SEED_DESTINATIONS.length} destinations, ${SEED_TOURS.length} tours`
  );
}
