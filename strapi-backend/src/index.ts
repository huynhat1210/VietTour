import type { Core } from '@strapi/strapi';
import { seedDatabase, setupAuthenticatedPermissions, setupPublicPermissions } from './seed';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Add a middleware to log Content-Manager booking PUT bodies and errors
    strapi.server.use(async (ctx: any, next: any) => {
      const isBookingUpdate =
        ctx.method === 'PUT' &&
        ctx.path &&
        ctx.path.includes('booking.booking');

      if (isBookingUpdate) {
        strapi.log.info('[Middleware] Booking PUT intercepted', {
          path: ctx.path,
          body: JSON.stringify(ctx.request.body),
        });
      }

      await next();

      if (isBookingUpdate && ctx.status >= 400) {
        strapi.log.error('[Middleware] Booking PUT failed', {
          status: ctx.status,
          path: ctx.path,
          responseBody: JSON.stringify(ctx.body),
        });
      }
    });
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setupPublicPermissions(strapi);
    await setupAuthenticatedPermissions(strapi);
    await seedDatabase(strapi);
  },
};
