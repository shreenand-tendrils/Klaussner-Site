// app/lib/fragments.js

export const CART_QUERY_FRAGMENT = `#graphql
  fragment CartApiQuery on Cart {
    id
    createdAt
    updatedAt
    buyerIdentity {
      countryCode
      email
      phone
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
              altText
              width
              height
            }
            product {
              handle
              title
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    totalQuantity
  }
`;