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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.size-price-select': SharedSizePriceSelect;
      'shared.seo': SharedSeo;
      'shared.media': SharedMedia;
    }
  }
}
