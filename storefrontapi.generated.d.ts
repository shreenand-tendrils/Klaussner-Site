/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'id' | 'createdAt' | 'updatedAt' | 'totalQuantity'
> & {
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  >;
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          merchandise: Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
            product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          merchandise: Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
            product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
    >;
  };
};

interface GeneratedQueryTypes {}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
