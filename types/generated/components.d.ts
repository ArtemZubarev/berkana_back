import type { Struct, Schema } from '@strapi/strapi';

export interface SharedSizePriceSelect extends Struct.ComponentSchema {
  collectionName: 'components_shared_size_price_selects';
  info: {
    displayName: 'Size/Price select';
    icon: 'alien';
    description: '';
  };
  attributes: {
    size: Schema.Attribute.String;
    price: Schema.Attribute.Integer;
    discount_price: Schema.Attribute.Integer;
    quantity: Schema.Attribute.Integer;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    name: 'Seo';
    icon: 'allergies';
    displayName: 'Seo';
    description: '';
  };
  attributes: {
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedOrderProduct extends Struct.ComponentSchema {
  collectionName: 'components_shared_order_products';
  info: {
    displayName: 'Order Product';
    icon: 'gift';
    description: '';
  };
  attributes: {
    name: Schema.Attribute.String;
    size: Schema.Attribute.String;
    price: Schema.Attribute.Integer;
    productId: Schema.Attribute.String;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedDelivery extends Struct.ComponentSchema {
  collectionName: 'components_shared_deliveries';
  info: {
    displayName: 'Delivery';
    icon: 'gift';
    description: '';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    street: Schema.Attribute.String & Schema.Attribute.Required;
    house: Schema.Attribute.String & Schema.Attribute.Required;
    apartment: Schema.Attribute.String;
    entrance: Schema.Attribute.String;
    floor: Schema.Attribute.String;
    domofon: Schema.Attribute.String;
    comment: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.size-price-select': SharedSizePriceSelect;
      'shared.seo': SharedSeo;
      'shared.order-product': SharedOrderProduct;
      'shared.media': SharedMedia;
      'shared.delivery': SharedDelivery;
    }
  }
}
