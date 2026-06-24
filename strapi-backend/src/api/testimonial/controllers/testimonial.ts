import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::testimonial.testimonial', ({ strapi }) => ({
  async publish(ctx) {
    const { id } = ctx.params;
    try {
      const published = await strapi.documents('api::testimonial.testimonial').publish({
        documentId: id,
      });

      if (!published) {
        return ctx.notFound('Testimonial not found');
      }

      strapi.log.info(`[TestimonialCtrl] Published testimonial: ${id}`);
      return { data: published };
    } catch (error: any) {
      strapi.log.error('[TestimonialCtrl] publish error', error);
      return ctx.internalServerError('Failed to publish testimonial');
    }
  }
}));

