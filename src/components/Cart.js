import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData = [], productsData = []) => {
  const result = cartData.map((cartItem) => {
    const matchedProduct = productsData.filter(
      (product) => product._id === cartItem.productId
    )[0];
    return {
      ...matchedProduct,
      productId: cartItem.productId,
      qty: cartItem.qty,
    };
  });

  return result;
};



export const getTotalCartValue = (items = []) => {
  if (!items.length) return 0;
  const total = items
    .filter((item) => item.qty)
    .map((item) => item.cost * item.qty)
    .reduce((total, n) => total + n);
  return total;
};
export const getTotalItems = (items = []) => {
  let itemsCount = items.map((item) => {
    let count = 0;
    if (item.productId) count++;
    return count;
  });
  return itemsCount.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
};

const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};


const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  // console.log(handleQuantity(token,
  //   items,
  //   products))
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      {isReadOnly ? (
        <>
          <Box className="cart">
            {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

            {items.map((item,index) => (
              <Box key={item._id}>
                {item.qty > 0 ? (
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    padding="1rem"
                    key={item._id}
                  >
                    <Box className="image-container">
                      <img
                        // Add product image
                        src={item.image}
                        // Add product name as alt eext
                        alt={item.name}
                        width="100%"
                        height="100%"
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="6rem"
                      paddingX="1rem"
                    >
                      <div>{/* Add product name */ item.name}</div>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box padding="0.5rem" fontWeight="500">
                          Qty:{item.qty}
                        </Box>
                        <Box padding="0.5rem" fontWeight="700">
                          ${/* Add product cost */ item.cost}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : null}
              </Box>
            ))}
            <Box
              padding="1rem"
              display="flex"
              justifyContent="space-between"
              alignItems="center"

            >
              <Box color="#3C3C3C" alignSelf="center">
                Order total
              </Box>
              <Box
                color="#3C3C3C"
                fontWeight="700"
                fontSize="1.5rem"
                alignSelf="center"
                data-testid="cart-total"
              >
                ${getTotalCartValue(items)}
              </Box>
            </Box>
            
          </Box>
          <Box className="cart" padding="1rem">
              <Box
                justifyContent="space-between"
                alignItems="center"
                color="#3C3C3C"
                fontWeight="700"
                fontSize="1.5rem"
                paddingTop="0.5rem"
                
              >
                Order Details
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              
              >
                <Box paddingTop="0.5rem" color="#3C3C3C">
                  {" "}
                  Products{" "}
                </Box>
                <Box paddingTop="0.5rem"> {items.length} </Box>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box paddingTop="0.5rem" color="#3C3C3C">
                  {" "}
                  Subtotal{" "}
                </Box>
                <Box paddingTop="0.5rem"> ${getTotalCartValue(items)} </Box>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box paddingTop="0.5rem" color="#3C3C3C">
                  {" "}
                  Shipping Charges{" "}
                </Box>
                <Box paddingTop="0.5rem"> ${0} </Box>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                
              >
                <Box paddingTop="1rem" fontWeight="700" fontSize="1.2rem">
                  {" "}
                  Total{" "}
                </Box>
                <Box paddingTop="0.5rem" fontWeight="700">
                  ${getTotalCartValue(items)}{" "}
                </Box>
              </Box>
            </Box>
        </>
      ) : (
        <>
          <Box className="cart">
            {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

            {items.map((item) => (
              // {console.log(item)}
              <Box key={item._id}>
                {item.qty > 0 ? (
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    padding="1rem"
                    key={item._id}
                  >
                    <Box className="image-container">
                      <img
                        // Add product image
                        src={item.image}
                        // Add product name as alt eext
                        alt={item.name}
                        width="100%"
                        height="100%"
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="6rem"
                      paddingX="1rem"
                    >
                      <div>{/* Add product name */ item.name}</div>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <ItemQuantity
                          // Add required props by checking implementation
                          value={item.qty}
                          handleAdd={async () => {
                            await handleQuantity(
                              token,
                              items,
                              products,
                              item._id,
                              item.qty + 1
                            );
                          }}
                          handleDelete={async () => {
                            await handleQuantity(
                              token,
                              items,
                              products,
                              item._id,
                              item.qty - 1
                            );
                          }}
                          productId={item._id}
                        />
                        <Box padding="0.5rem" fontWeight="700">
                          ${/* Add product cost */ item.cost}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : null}
              </Box>
            ))}
            <Box
              padding="1rem"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box color="#3C3C3C" alignSelf="center">
                Order total
              </Box>
              <Box
                color="#3C3C3C"
                fontWeight="700"
                fontSize="1.5rem"
                alignSelf="center"
                data-testid="cart-total"
              >
                ${getTotalCartValue(items)}
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="flex-end"
              className="cart-footer"
            >
              <Button
                color="primary"
                variant="contained"
                startIcon={<ShoppingCart />}
                className="checkout-btn"
                onClick={() => history.push("/checkout")}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default Cart;
