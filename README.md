# Shopify Extensions

This repository contains two Shopify extensions:

1. Cart Transform Extension - For advanced cart manipulation and bundling
2. Age Verification Extension - For age verification during checkout

## Age Verification Extension

A Shopify checkout UI extension that adds age verification functionality to the checkout process.

### Features

- Adds an age verification step during checkout
- Customizable age requirement
- Real-time validation
- Seamless integration with Shopify checkout UI
- Prevents order completion if age verification fails

### Implementation

The extension is implemented as a Shopify checkout UI extension using React and the Shopify Extension API.

```jsx
// Example implementation
<Banner title="Age Verification Required">
  <TextField
    label="Please enter your age"
    type="number"
    onChange={handleAgeChange}
    error={ageError}
  />
</Banner>
```

## Cart Transform Extension

This extension provides advanced cart manipulation capabilities, including bundle creation and product expansion features.

### Features

#### 1. Bundle Creation (Merge Operation)

- Groups cart items with matching `bundleId` attributes
- Applies a 10% discount to bundled items
- Customizes the bundle title and image
- Uses a specific parent variant to represent the bundle

#### 2. Product Expansion (Expand Operation)

- Adds complementary products to non-bundled items
- Maintains original product pricing
- Adds a "Free Ski Wax" service to each eligible product
- Customizes the display title to show the included service

### Technical Details

#### Cart Line Attributes

- `_bundleId`: Used to identify items that should be grouped together in a bundle

#### Metafields

- `bundle_fee`: Stored on product variants to specify additional service costs
- Default value: 20 (if not specified)

#### Product Variants

- Bundle Parent: `gid://shopify/ProductVariant/44201558966467`
- Ski Wax Service: `gid://shopify/ProductVariant/43260340863171`

### GraphQL Schema

The extension uses the following data structure:

```graphql
query RunInput {
  cart {
    lines {
      id
      quantity
      bundleId: attribute(key: "_bundleId")
      cost {
        totalAmount {
          amount
        }
      }
      merchandise {
        ... on ProductVariant {
          id
          bundleFee: metafield(namespace: "custom", key: "bundle_fee")
          product {
            title
          }
        }
      }
    }
  }
}
```

### Operations

#### Merge Operation

Combines multiple cart items into a single bundle:

- Groups items by `bundleId`
- Applies a 10% discount
- Sets a custom title and image
- Preserves original quantities

#### Expand Operation

Adds complementary products to cart items:

- Maintains original product with its price
- Adds a "Free Ski Wax" service
- Customizes the title to show the included service
- Uses the `bundle_fee` metafield for service pricing

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the extensions:

```bash
npm run build
```

3. Deploy to Shopify:

```bash
npm run deploy
```

## Development

### Prerequisites

- Shopify CLI
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. Run the development server:

```bash
npm run dev
```

2. Test the functions:

```bash
npm run test
```

## Extension-Specific Limitations

### Cart Transform Extension

- Only one cart transform function can be installed per store
- Update operations are only available for Shopify Plus or Development stores
- Images must be hosted on Shopify's CDN
- Maximum of 150 expanded cart items supported

### Age Verification Extension

- Only works with Shopify Checkout UI extension points
- Must be configured per checkout locale
- Requires customer interaction during checkout

## Error Handling

### Cart Transform Extension

- Invalid product variants
- Missing bundle IDs
- Invalid quantities
- Custom product types

### Age Verification Extension

- Invalid age inputs
- Missing required fields
- Age requirement not met
- Browser compatibility issues

## Documentation

- [Cart Transform Functions](https://shopify.dev/docs/api/functions/reference/cart-transform)
- [Checkout UI Extensions](https://shopify.dev/docs/api/checkout-ui-extensions)
- [Shopify Functions](https://shopify.dev/docs/api/functions)
