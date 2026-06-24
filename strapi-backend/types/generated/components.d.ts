import type { Schema, Struct } from '@strapi/strapi';

export interface DestinationDetailsSpot extends Struct.ComponentSchema {
  collectionName: 'components_destination_details_spots';
  info: {
    description: '';
    displayName: 'spot';
    icon: 'map-pin';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'destination-details.spot': DestinationDetailsSpot;
    }
  }
}
