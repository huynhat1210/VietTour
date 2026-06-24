import { factories } from '@strapi/strapi';

export default {
  routes: [
    // Custom endpoint to get logged in user with role
    {
      method: 'GET',
      path: '/users/me-with-role',
      handler: 'api::booking.booking.me',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Custom admin user management endpoints
    {
      method: 'GET',
      path: '/users-admin',
      handler: 'api::booking.booking.listUsers',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/users-admin/:id',
      handler: 'api::booking.booking.updateUser',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/users-admin/:id',
      handler: 'api::booking.booking.deleteUser',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/users-admin/roles',
      handler: 'api::booking.booking.listRoles',
      config: { policies: [], middlewares: [] },
    },
    // Custom status update route (JWT authenticated)
    {
      method: 'PUT',
      path: '/bookings/:id/status',
      handler: 'api::booking.booking.updateStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Core CRUD routes (manually listed to avoid spread issue)
    {
      method: 'GET',
      path: '/bookings',
      handler: 'api::booking.booking.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/bookings/:id',
      handler: 'api::booking.booking.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/bookings',
      handler: 'api::booking.booking.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/bookings/:id',
      handler: 'api::booking.booking.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/bookings/:id',
      handler: 'api::booking.booking.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
};
