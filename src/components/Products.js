import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState} from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { Typography } from "@mui/material";
import Cart from './Cart'
import './Cart.css'
import {generateCartItemsFrom } from "./Cart"

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

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [cartItems, setCartItems]= useState([])
  const token= localStorage.getItem("token");
  const [eachProducts,setEachProducts]= useState([]);
  

  useEffect(() => {
    async function eachProducts() {
      const allData = await performAPICall();
      const cartFetch= await fetchCart(token)
      // console.log(cartFetch)
      const finalCart= await generateCartItemsFrom(cartFetch,allData);
      setCartItems(finalCart)
      // console.log("cart item====",cartItems)

    }
    eachProducts();
    
  }, []);


  // console.log(token)
  const performAPICall = async () => {
    try {
      setLoading(true);
      const resData = await axios.get(`${config.endpoint}/products`);
      setAllProducts(resData.data);
      setEachProducts(resData.data);//---------------------------==========================================
      setLoading(false);
      return resData.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        setAllProducts([])
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
      setLoading(false);
    }
  };

  const performSearch = async (text) => {
    try {
      const searching = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setAllProducts(searching.data);

    } catch (e) {
      if (e.response.status === 404) {
        setAllProducts("empty");
        // console.log(`error status ==> ${e.response.status},\nerror message ==> ${e.response.data.message}`)
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  let timer;
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      performSearch(event.target.value);
    }, debounceTimeout);
  };




const children= true;
  

  const fetchCart = async (token) => {
    if (!token) return;
    try {

      const cartData= await axios.get(`${config.endpoint}/cart`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data= await generateCartItemsFrom(cartData.data,allProducts)
      setCartItems(data)

      return cartData.data


    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };



  const isItemInCart = (items, productId) => {
    return items.findIndex((item) => item._id === productId) !== -1;
  };

  
  const addToCart = async (
    token,
    items,
    allProducts,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    if (!token){
      enqueueSnackbar("Login to add an item to the Cart",{variant:"warning"})
      return 
    }
    if(options.preventDuplicate && isItemInCart(items,productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", {variant: "warning",});
      return;
    }
    try{
      const postDataToCart= await axios.post(`${config.endpoint}/cart`,{productId,qty},{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });


      const everyProduct= eachProducts;
      const cartTotalItems= await generateCartItemsFrom(postDataToCart.data, everyProduct)
      



      setCartItems(cartTotalItems)
      enqueueSnackbar("Your cart has been successfully updated.",{variant:"success"})

    }
    catch(e){
      if(e.response && e.response.status===400){
        enqueueSnackbar(e.response.data.message,{variant:"error"})
      }else{
        enqueueSnackbar("Could not connect to the backend. Kindly try after sometimes.",{variant:"error"})
      }
      
    }
  };
  
  return (
    <div>
      {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      <Header
        children={children}
        performSearch={performSearch}
        debounceSearch={debounceSearch}
      />

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={(event)=>debounceSearch(event,500)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid container >
        <Grid item className="product-grid" xs={12} md={localStorage.token? 9 : 12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        
        {/* {console.log(loading)} */}
          <Box>
            <Grid container spacing={2} padding="1rem">
            {allProducts === "empty" ? (
              <Box className="loading">
                <SentimentDissatisfied />
                <Typography gutterBottom variant="p" component="div">
                  No products found
                </Typography>
              </Box>
            ) : loading ? (
              <Box className="loading">
                <CircularProgress color="success" />
                <Typography gutterBottom variant="p" component="div">
                  Loading Products...
                </Typography>
              </Box>
            
            ) : (
              allProducts.map((listProduct) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={listProduct._id}>
                    <ProductCard
                      product={listProduct}
                      handleAddToCart={async () => {
                        await addToCart(
                          token,
                          cartItems,
                          allProducts,
                          listProduct._id,
                          1,
                          { preventDuplicate: true }
                        );
                      }}
                    />
                  </Grid>
                );
              })
            )}
            </Grid>
          </Box>

        </Grid>
        {localStorage.token && 
        <Grid item className="product-grid" xs={12} md={localStorage.token? 3: 12 }>
          <Cart className="cart" 
            items={cartItems}
            products={allProducts} 
            handleQuantity={addToCart}/>
            
        </Grid>}
      </Grid>
 
      <Footer />
    </div>
  );
};

export default Products;
