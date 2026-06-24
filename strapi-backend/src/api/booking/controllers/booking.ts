import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::booking.booking', ({ strapi }) => ({
  // Custom action to get logged in user profile with role
  async me(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const STRAPI_URL = process.env.PUBLIC_URL || 'http://localhost:1337';
    const userWithRole = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: ctx.state.user.documentId,
      populate: ['role', 'avatar'],
    }) as any;

    if (!userWithRole) {
      return ctx.notFound('User not found');
    }

    // Build avatar URL if exists
    let avatarUrl: string | undefined;
    if (userWithRole.avatar?.url) {
      avatarUrl = userWithRole.avatar.url.startsWith('http')
        ? userWithRole.avatar.url
        : `${STRAPI_URL}${userWithRole.avatar.url}`;
    }

    ctx.body = {
      id: userWithRole.id,
      documentId: userWithRole.documentId,
      username: userWithRole.username,
      email: userWithRole.email,
      fullName: userWithRole.fullName,
      phone: userWithRole.phone,
      avatar: avatarUrl,
      gender: userWithRole.gender,
      dateOfBirth: userWithRole.dateOfBirth,
      province: userWithRole.province,
      district: userWithRole.district,
      ward: userWithRole.ward,
      addressDetail: userWithRole.addressDetail,
      role: userWithRole.role ? {
        id: userWithRole.role.id,
        name: userWithRole.role.name,
        type: userWithRole.role.type,
      } : null,
    };
  },

  // Override find to restrict bookings listing
  async find(ctx) {
    if (!ctx.state.user) {
      if (ctx.state.auth) {
        return await super.find(ctx);
      }
      return ctx.unauthorized();
    }

    // Fetch user and populate their role
    const userWithRole = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: ctx.state.user.documentId,
      populate: ['role'],
    });

    const roleType = userWithRole?.role?.type;

    if (roleType === 'manager') {
      // Manager can view all bookings
      return await super.find(ctx);
    } else if (roleType === 'authenticated') {
      // Regular user can only view their own bookings
      ctx.query.filters = {
        ...(ctx.query.filters as any),
        email: ctx.state.user.email,
      };
      return await super.find(ctx);
    } else {
      return ctx.forbidden('You do not have permission to view bookings');
    }
  },

  // Override findOne to restrict single booking access
  async findOne(ctx) {
    if (!ctx.state.user) {
      if (ctx.state.auth) {
        return await super.findOne(ctx);
      }
      return ctx.unauthorized();
    }

    const { id } = ctx.params;

    // Fetch user and populate their role
    const userWithRole = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: ctx.state.user.documentId,
      populate: ['role'],
    });

    const roleType = userWithRole?.role?.type;

    if (roleType === 'manager') {
      // Manager can view any booking
      return await super.findOne(ctx);
    } else if (roleType === 'authenticated') {
      // Fetch the booking first to check ownership
      const booking = await strapi.documents('api::booking.booking').findOne({
        documentId: id,
      });

      if (!booking) {
        return ctx.notFound('Booking not found');
      }

      if (booking.email !== ctx.state.user.email) {
        return ctx.forbidden('You do not have permission to view this booking');
      }

      return await super.findOne(ctx);
    } else {
      return ctx.forbidden('You do not have permission to view this booking');
    }
  },

  // Custom action to update booking status only (Managers only)
  async updateStatus(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }

    // Fetch user and populate their role
    const userWithRole = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: ctx.state.user.documentId,
      populate: ['role'],
    });

    const roleType = userWithRole?.role?.type;

    if (roleType !== 'manager') {
      return ctx.forbidden('Only managers can update booking status');
    }

    const { id } = ctx.params;
    const { status } = ctx.request.body as { status?: string };

    const allowed = ['pending', 'confirmed', 'cancelled'];
    if (!status || !allowed.includes(status)) {
      return ctx.badRequest(`Status must be one of: ${allowed.join(', ')}`);
    }

    try {
      const updated = await strapi.documents('api::booking.booking').update({
        documentId: id,
        data: { bookingStatus: status } as any,
        fields: ['documentId', 'fullName', 'email', 'phone', 'tourDate', 'numberOfGuests', 'bookingStatus', 'message'],
        populate: ['tour'],
      });

      if (!updated) {
        return ctx.notFound('Booking not found');
      }

      strapi.log.info(`[BookingCtrl] Status updated: ${id} -> ${status}`);
      return { data: updated };
    } catch (error: any) {
      strapi.log.error('[BookingCtrl] updateStatus error', {
        message: error.message,
        details: JSON.stringify(error.details),
      });
      return ctx.internalServerError('Failed to update booking status');
    }
  },

  // Override update to prevent regular users from modifying bookings
  async update(ctx) {
    if (!ctx.state.user) {
      if (ctx.state.auth) {
        return await super.update(ctx);
      }
      return ctx.unauthorized();
    }

    // Fetch user and populate their role
    const userWithRole = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: ctx.state.user.documentId,
      populate: ['role'],
    });

    const roleType = userWithRole?.role?.type;

    if (roleType !== 'manager') {
      return ctx.forbidden('Only managers can update bookings');
    }

    const { id } = ctx.params;
    const body = ctx.request.body as any;

    strapi.log.info('[BookingCtrl] update called', {
      id,
      body: JSON.stringify(body),
    });

    try {
      const result = await super.update(ctx);
      return result;
    } catch (error: any) {
      strapi.log.error('[BookingCtrl] update error', {
        message: error.message,
        name: error.name,
        details: JSON.stringify(error.details),
        body: JSON.stringify(body),
      });
      throw error;
    }
  },

  // Override delete to prevent regular users from deleting bookings
  async delete(ctx) {
    if (!ctx.state.user) {
      if (ctx.state.auth) {
        return await super.delete(ctx);
      }
      return ctx.unauthorized();
    }

    // Fetch user and populate their role
    const userWithRole = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: ctx.state.user.documentId,
      populate: ['role'],
    });

    const roleType = userWithRole?.role?.type;

    if (roleType !== 'manager') {
      return ctx.forbidden('Only managers can delete bookings');
    }

    return await super.delete(ctx);
  },

  // Custom action to list all users (Managers only)
  async listUsers(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const userWithRole = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: ctx.state.user.documentId,
      populate: ['role'],
    });
    if (userWithRole?.role?.type !== 'manager') {
      return ctx.forbidden('Only managers can view the user list');
    }

    try {
      const users = await strapi.documents('plugin::users-permissions.user').findMany({
        populate: ['role', 'avatar'],
        sort: 'createdAt:desc',
      });
      return { data: users };
    } catch (error: any) {
      strapi.log.error('[BookingCtrl] listUsers error', error);
      return ctx.internalServerError('Failed to fetch users');
    }
  },

  // Custom action to update a user (Managers only)
  async updateUser(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const userWithRole = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: ctx.state.user.documentId,
      populate: ['role'],
    });
    if (userWithRole?.role?.type !== 'manager') {
      return ctx.forbidden('Only managers can update users');
    }

    const { id } = ctx.params;
    const body = ctx.request.body as any;

    try {
      const updated = await strapi.documents('plugin::users-permissions.user').update({
        documentId: id,
        data: body,
        populate: ['role', 'avatar'],
      });
      if (!updated) {
        return ctx.notFound('User not found');
      }
      return { data: updated };
    } catch (error: any) {
      strapi.log.error('[BookingCtrl] updateUser error', error);
      return ctx.badRequest(error.message || 'Failed to update user');
    }
  },

  // Custom action to delete a user (Managers only)
  async deleteUser(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const userWithRole = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: ctx.state.user.documentId,
      populate: ['role'],
    });
    if (userWithRole?.role?.type !== 'manager') {
      return ctx.forbidden('Only managers can delete users');
    }

    const { id } = ctx.params;

    try {
      const deleted = await strapi.documents('plugin::users-permissions.user').delete({
        documentId: id,
      });
      if (!deleted) {
        return ctx.notFound('User not found');
      }
      return { success: true, message: 'User deleted successfully' };
    } catch (error: any) {
      strapi.log.error('[BookingCtrl] deleteUser error', error);
      return ctx.internalServerError('Failed to delete user');
    }
  },

  // Custom action to list all roles (Managers only)
  async listRoles(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const userWithRole = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: ctx.state.user.documentId,
      populate: ['role'],
    });
    if (userWithRole?.role?.type !== 'manager') {
      return ctx.forbidden('Only managers can view roles');
    }

    try {
      const roles = await strapi.documents('plugin::users-permissions.role').findMany();
      return { data: roles };
    } catch (error: any) {
      strapi.log.error('[BookingCtrl] listRoles error', error);
      return ctx.internalServerError('Failed to fetch roles');
    }
  },
}));
