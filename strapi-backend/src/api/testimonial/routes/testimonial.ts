import { factories } from '@strapi/strapi';

export default {
  routes: [
    {
      method: 'PUT',
      path: '/testimonials-publish/:id',
      handler: 'api::testimonial.testimonial.publish',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/testimonials',
      handler: 'api::testimonial.testimonial.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/testimonials/:id',
      handler: 'api::testimonial.testimonial.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/testimonials',
      handler: 'api::testimonial.testimonial.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/testimonials/:id',
      handler: 'api::testimonial.testimonial.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/testimonials/:id',
      handler: 'api::testimonial.testimonial.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
};

