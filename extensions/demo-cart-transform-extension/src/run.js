// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

//  "gid://shopify/ProductVariant/44201558966467"
//  "gid://shopify/ProductVariant/43260340863171"

/**
 * @type {FunctionRunResult}
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const groupedItems = {};
  input.cart.lines.forEach((line) => {
    const bundleId = line.bundleId;
    if (bundleId && bundleId.value) {
      if (!groupedItems[bundleId.value]) {
        groupedItems[bundleId.value] = [];
      }
      groupedItems[bundleId.value].push(line);
    }
  });

  const itemsWithNoBundleId = input.cart.lines.filter(
    (line) => !!line.bundleId?.value === false,
  );

  console.log("INPUT", input.cartTransform);

  return {
    operations: [
      ...Object.values(groupedItems).map((group) => {
        const mergeOperation = {
          merge: {
            cartLines: group.map((line) => {
              return {
                cartLineId: line.id,
                quantity: line.quantity,
              };
            }),
            parentVariantId: "gid://shopify/ProductVariant/44201558966467",
            title: "My Customized Title",
            price: {
              percentageDecrease: {
                value: 10,
              },
            },
            image: {
              url: "https://cdn.shopify.com/s/files/1/0645/8530/2211/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a.jpg?v=1713516567",
            },
          },
        };
        return mergeOperation;
      }),
      ...itemsWithNoBundleId.map((line) => {
        const expandOperation = {
          expand: {
            cartLineId: line.id,
            expandedCartItems: [
              {
                merchandiseId: line.merchandise.id,
                quantity: line.quantity,
                price: {
                  adjustment: {
                    fixedPricePerUnit: {
                      amount: line.cost.totalAmount.amount,
                    },
                  },
                },
              },
              {
                merchandiseId: "gid://shopify/ProductVariant/43260340863171",
                quantity: line.quantity,
                price: {
                  adjustment: {
                    fixedPricePerUnit: {
                      amount: line.merchandise.bundleFee?.value || 20,
                    },
                  },
                },
              },
            ],
            title: `${line.merchandise.product.title} + Free Ski Wax`,
          },
        };
        return expandOperation;
      }),
      /* {
        update: {
          cartLineId: input.cart.lines[0].id,
          title: "FAKE TITLE",
        },
      }, */
    ],
  };
}
