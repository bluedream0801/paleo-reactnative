// a library to wrap and simplify api calls
import apisauce from "apisauce";
import * as momenttz from 'moment-timezone';
import { BASE_URL, ERRORS, CART_ERRORS } from "./ApiConstants";
import { AUTH } from "./ApiURIs";
import { TIMEZONE } from "../common/constants";
import helpers, { AppsFyler } from "../helpers";
const { getCartType } = helpers;
// import ReactDOM from 'react-dom'

// API reusable objects
const org = {};

// our "constructor"
export let nf_state = {};

nf_state.cart_actions_count = 0;

const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  return formData;
};
const convertFormData = (data) => {
  const form = new FormData();
  for (const key in data) {
    const value = data[key];
    if (Array.isArray(value)) {
      const arrayKey = `${key}`;
      value.forEach((v) => {
        form.append(arrayKey, v);
      });
    } else {
      form.append(key, value);
    }
  }
  return form;
};

const create = (baseURL = BASE_URL) => {

  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    headers: {
      "Content-Type": "application/json; multipart/form-data",
    },

    // 10 second timeout...
    timeout: 25e3,
  });

  api.addMonitor((response) => {
    console.log("API RESPONSE: ", response);
  });

  api.addResponseTransform((response) => {
    try {
      if (!response.ok) {
        const { problem } = response;
        if (!response.data) response.data = {};
        if (!response.data.data) response.data.data = {};
        response.data.error =
          response.data.message ||
          response.data.data.message ||
          ERRORS[problem] ||
          ERRORS.UNKNOWN_ERROR;
      }
    } catch (e) {
      response.data.error = ERRORS.UNKNOWN_ERROR;
    }
    console.log("TRANSFORMED response", response);

    return response;
  });

  const apis = {};

  const { LOGIN } = AUTH;

  apis.login = (params) => {
    console.log("params---", params);
    return api.post("login", params);
  };

  // Get latest drafts/completed carts
  apis.check_latest_carts = (
    contact_id,
    setCartData,
    updateCartId,
    setMealsCartData,
    updateStoredFields,
    extParams,
    operation = 'grocery_initial_cart_load'
  ) => {
    console.log('Check Latest Cart Start', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
    return apis
      .execute("ecom2.interface", "latest_carts", [contact_id], {}, () => {}, extParams)
      .then( async (response) => {

        console.log('checking_user_latest_carts',response);
        const {
          latest_draft_grocery_cart,
          latest_completed_grocery_cart,
          latest_draft_mealplan_cart,
          latest_completed_mealplan_cart,
        } = response;

        console.log('Grocery Cart Comparison',latest_draft_grocery_cart[0],latest_completed_grocery_cart[0],cartId);
        // alert(global.cartId +' - '+ global.mealsCartId);

        var newGroceryCartId = 0;
        if (typeof latest_draft_grocery_cart[0]!='undefined') {
          if
            (
              ((typeof latest_completed_grocery_cart[0]=='undefined') && // We have a draft cart and never completed any orders
                (latest_draft_grocery_cart[0] > global.cartId))  // Draft cart is bigger than whatever we have locally
              ||
              ((latest_draft_grocery_cart[0] > latest_completed_grocery_cart[0]) && // Draft cart is bigger than the latest completed cart
                (latest_draft_grocery_cart[0] > global.cartId)) // Draft cart is bigger than whatever we have locally
              ||
              ((latest_draft_grocery_cart[0] > latest_completed_grocery_cart[0]) && // Draft cart is bigger than the latest completed cart
                (latest_completed_grocery_cart[0] >= global.cartId))
            ) { // Current cart is checked out / in the past
            // Restore Cart
            newGroceryCartId = latest_draft_grocery_cart[0];
            console.log('Grocery-Restore Cart',newGroceryCartId)
            updateCartId(latest_draft_grocery_cart[0]);
          // In this scenario we can have a draft cart but we can ignore it because it is for sure an old one
          } else if (latest_completed_grocery_cart[0] >= global.cartId) { // We have a completed cart (but no new draft cart)
              // (typeof latest_completed_grocery_cart[0]!='undefined') // We don't have a completed cart created
              // Create Cart
             console.log('Grocery-Create cart 1');
             await apis.create_grocery_cart(extParams).then((res) => {
                newGroceryCartId = res;
                console.log('Newly created grocery cart',newGroceryCartId)
                updateCartId(res);
              });
          } else {
            // Do Nothing
             console.log('Grocery - Do Nothing 1');
          }
        } else if ((latest_completed_grocery_cart[0] >= global.cartId) ||
        ((typeof latest_draft_grocery_cart[0]=='undefined') && (typeof latest_completed_grocery_cart[0]=='undefined')))
        {
          // Create Cart
          console.log('Grocery-Create cart 2');
          await apis.create_grocery_cart(extParams).then((res) => {
            newGroceryCartId = res;
            console.log('Newly created grocery cart 2',newGroceryCartId)
            updateCartId(res);
          });
        } else {
          console.log('Grocery-Do Nothing 2');
        }

        console.log('Meal Cart Comparisonxxx',latest_draft_mealplan_cart[0],latest_completed_mealplan_cart[0],global.mealsCartId);

        var newMealCartId = 0;
        if (typeof latest_draft_mealplan_cart[0]!='undefined') {
          if (global.mealsCartId == null) {
            global.mealsCartId = 0;
          }
          if
            (
              ((typeof latest_completed_mealplan_cart[0]=='undefined') && // We have a draft cart and never completed any orders
                (latest_draft_mealplan_cart[0] > global.mealsCartId))  // Draft cart is bigger than whatever we have locally
              ||
              ((latest_draft_mealplan_cart[0] > latest_completed_mealplan_cart[0]) && // Draft cart is bigger than the latest completed cart
                (latest_draft_mealplan_cart[0] > global.mealsCartId)) // Draft cart is bigger than whatever we have locally
              ||
              ((latest_draft_mealplan_cart[0] > latest_completed_mealplan_cart[0]) && // Draft cart is bigger than the latest completed cart
                (latest_completed_mealplan_cart[0] >= global.mealsCartId))
            ) { // Current cart is checked out / in the past
            // Restore Cart
            console.log('Meal- Restore Cart',latest_draft_mealplan_cart[0]);
            newMealCartId = latest_draft_mealplan_cart[0];
            global.mealsCartId = latest_draft_mealplan_cart[0];
          // In this scenario we can have a draft cart but we can ignore it because it is for sure an old one
          } else if (latest_completed_mealplan_cart[0] >= global.mealsCartId) { // We have a completed cart (but no new draft cart)
              // (typeof latest_completed_mealplan_cart[0]!='undefined') // We don't have a completed cart created
              // Create Cart
              /*
             console.log('xxx-Create cart 1');
             await apis.create_meal_cart(extParams).then((res) => {
                newMealCartId = res;
                console.log('Newly created meal cart',newMealCartId)
                global.mealsCartId = res;
              });
              */
          } else {
            // Do Nothing
             console.log('Meal-Do Nothing 1');
          }
        } else if (latest_completed_mealplan_cart[0] >= global.mealsCartId) {
          // Create Cart
          /*
          console.log('xxx-Create cart 2');
          await apis.create_meal_cart(extParams).then((res) => {
            newMealCartId = res;
            console.log('Newly created meal cart',newMealCartId)
            global.mealsCartId = res;
          });
          */
        } else {
          console.log('Meal-Do Nothing 2');
        }

        console.log('Checking existing carts',global.cartId, global.mealsCartId);
        // alert(global.cartId +' - '+ global.mealsCartId);

        if (newGroceryCartId >0 && newMealCartId ==0) {
          console.log('Loading New/Restored Grocery Cart',newGroceryCartId);
          apis.grocery_cart_load(newGroceryCartId, setCartData, () => {}, updateStoredFields, extParams, operation);
        } else if (newGroceryCartId >0 && newMealCartId>0) {
          console.log('Loading New Combined Cart',newMealCartId, newGroceryCartId);
          apis.combined_cart_load(newMealCartId, newGroceryCartId, setMealsCartData, setCartData, updateStoredFields, operation);
        } else if (global.cartId && newMealCartId>0) {
          console.log('Loading Already Saved Grocery Cart and Restored Meal Cart',newMealCartId, global.cartId);
          apis.combined_cart_load(newMealCartId, global.cartId, setMealsCartData, setCartData, updateStoredFields, operation);
        } else if (global.cartId && !global.mealsCartId) {
          console.log('Loading Already Saved Grocery Cart',global.cartId);
          apis.grocery_cart_load(global.cartId, setCartData, () => {}, updateStoredFields, extParams, operation);
        } else if (global.cartId && global.mealsCartId) {
          console.log('Loading Already Saved Grocery Cart and Meal Cart',global.mealsCartId, global.cartId);
          apis.combined_cart_load(global.mealsCartId, global.cartId, setMealsCartData, setCartData ,updateStoredFields, operation);
        }
        
        console.log('Check Latest Cart End', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));

      })
      .catch((err) => {
        alert("Error: " + err);
      });
  };

  // Get latest drafts/completed carts
  apis.check_latest_carts_no_login = async (
    setCartData,
    updateCartId,
    setMealsCartData,
    updateStoredFields,
    extParams,
    operation = 'grocery_initial_cart_load'
  ) => {
    
    console.log('Check Latest Cart Start', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
    
    var newGroceryCartId = 0;
    var newMealCartId = 0;

    if (global.cartId == null) {
      console.log('Grocery-Create cart 1');
      await apis.create_grocery_cart(extParams).then((res) => {
        newGroceryCartId = res;
        console.log('Newly created grocery cart - NO LOGIN',newGroceryCartId)
        updateCartId(res);
      });
    }

    console.log('Checking existing carts when not logged in',global.cartId, global.mealsCartId);

    if (newGroceryCartId >0 && global.newMealCartId ==0) {
      console.log('Loading New/Restored Grocery Cart',newGroceryCartId);
      apis.grocery_cart_load(newGroceryCartId, setCartData, () => {}, updateStoredFields, extParams, operation);
    } else if (newGroceryCartId >0 && newMealCartId>0) {
      console.log('Loading New Combined Cart',newMealCartId, newGroceryCartId);
      apis.combined_cart_load(newMealCartId, newGroceryCartId, setMealsCartData, setCartData, updateStoredFields, operation);
    } else if (global.cartId && newMealCartId>0) {
      console.log('Loading Already Saved Grocery Cart and Restored Meal Cart',newMealCartId, global.cartId);
      apis.combined_cart_load(newMealCartId, global.cartId, setMealsCartData, setCartData, updateStoredFields, operation);
    } else if (global.cartId && !global.mealsCartId) {
      console.log('Loading Already Saved Grocery Cart',global.cartId);
      apis.grocery_cart_load(global.cartId, setCartData, () => {}, updateStoredFields, extParams, operation);
    } else if (global.cartId && global.mealsCartId) {
      console.log('Loading Already Saved Grocery Cart and Meal Cart',global.mealsCartId, global.cartId);
      apis.combined_cart_load(global.mealsCartId, global.cartId, setMealsCartData, setCartData, updateStoredFields, operation);
    }
    
    console.log('Check Latest Cart End', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
    
  };

  // Reat a Combined Cart
  apis.combined_cart_load = async (
    meal_cart_id,
    grocery_cart_id,
    setMealsCartData,
    setCartData,
    updateStoredFields = 'normal',
    operation = 'grocery_initial_cart_load'
  ) => {
    console.log('OPERATION',operation);
    console.log("Actions Pending Before Clearing Slots", nf_state.cart_actions_count);
    
    console.log('Combined Cart Load Start', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
    
    if (nf_state.cart_actions_count == 0) {
      
      if (operation == 'grocery_cart_checkout_load' || operation == 'grocery_slot_and_address_change_checkout'  || operation=="apply_voucher") {

        // if ( updateStoredFields == 'normal') {
          var cart_exists =  await apis.updateCombinedSlots(grocery_cart_id, meal_cart_id, operation);
        // } else {
          // var cart_exists = await apis.updateSlotsAll(cart_id,extParams); - Try not to use this as it uses way to many resources
        // }
      }      
      
      console.log('cart_exists',cart_exists);
      if (cart_exists == false) {
        console.log('Cart Does Not Exist');
      } else {
        console.log('Cart Exists');
        
        
          // Combined fields 
          // "amount_ship_combined",
          // "amount_voucher_combined",
          // "amount_credit_combined",
          // "amount_total_combined",
          
          
          // MEALPLAN ONLY FIELDS - USE AS NEEDED
          // TOTALS AND GENERAL
          /*
          // "date_delivery_slots",
          "ship_addresses_days", // added zone_id

          // Lines
          "lines.ship_address_id",
          "lines.ship_address_id.name",
          "lines.ship_address_id.address",
          "lines.ship_address_id.state",
          "lines.ship_address_id.zone_id",
          "lines.ship_address_id.postal_code",

          // Add the fields for BYO (if needed - Check with Jon for design)
          "lines.product_id.byo_plate_id", // null if not existing
          "lines.product_id.byo_plate_id.proteins.product_id.name",
          "lines.product_id.byo_plate_id.proteins.qty",
          "lines.product_id.byo_plate_id.sides.product_id.name",
          "lines.product_id.byo_plate_id.sides.qty",
          "lines.product_id.byo_plate_id.dressings.product_id.name",
          "lines.product_id.byo_plate_id.dressings.qty",
          "lines.product_id.byo_plate_id.premium_addons.product_id.name",
          "lines.product_id.byo_plate_id.premium_addons.qty",

          "lines.product_id.byo_salad_id", // null if not existing
          "lines.product_id.byo_salad_id.salad_mix.product_id.name",
          "lines.product_id.byo_salad_id.salad_mix.qty",
          "lines.product_id.byo_salad_id.proteins.product_id.name",
          "lines.product_id.byo_salad_id.proteins.qty",
          "lines.product_id.byo_salad_id.dressings.product_id.name",
          "lines.product_id.byo_salad_id.dressings.qty",
          "lines.product_id.byo_salad_id.premium_addons.product_id.name",
          "lines.product_id.byo_salad_id.premium_addons.qty",

          "lines.delivery_date",
          "lines.delivery_slot_id",
          "lines.delivery_slot_id.name",
        */
        
        
        // FROM GROCERY CART LOAD
        // Scenarios in which different fields might need to be reloaded (as we don't always need to re-read everything)
        
        
        // IN THE APP 
        // Fields that are required when: 
        // 1. Loading First Time / Homepage
        // 2. Market Page (when arriving on the market page, because we have the time selector) ... Do we really need this or are we doing it in the cart ?
        // 3. Any other page that might require the loading of the cart, beside the CART and CHECKOUT pages
        if (operation == 'grocery_initial_cart_load') {
          var fields = [
            // DELIVERY RELATED
            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
            
            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",
            
            // LINES
            "lines.product_id.id",
            // "lines.product_id.name",
            "lines.qty",
            "lines.total_qty",
            
            // For Mealplan
            "ship_addresses_days",
            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",
            
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",
            
            // LINES - Required for the cart in the Fresh Meals section
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",            
            "lines.amount",
            "lines.uom_id.name",

            // Add the fields for BYO (if needed - Check with Jon for design)
            "lines.product_id.byo_plate_id", // null if not existing
            "lines.product_id.byo_plate_id.proteins.product_id.name",
            "lines.product_id.byo_plate_id.proteins.qty",
            "lines.product_id.byo_plate_id.sides.product_id.name",
            "lines.product_id.byo_plate_id.sides.qty",
            "lines.product_id.byo_plate_id.dressings.product_id.name",
            "lines.product_id.byo_plate_id.dressings.qty",
            "lines.product_id.byo_plate_id.premium_addons.product_id.name",
            "lines.product_id.byo_plate_id.premium_addons.qty",

            "lines.product_id.byo_salad_id", // null if not existing
            "lines.product_id.byo_salad_id.salad_mix.product_id.name",
            "lines.product_id.byo_salad_id.salad_mix.qty",
            "lines.product_id.byo_salad_id.proteins.product_id.name",
            "lines.product_id.byo_salad_id.proteins.qty",
            "lines.product_id.byo_salad_id.dressings.product_id.name",
            "lines.product_id.byo_salad_id.dressings.qty",
            "lines.product_id.byo_salad_id.premium_addons.product_id.name",
            "lines.product_id.byo_salad_id.premium_addons.qty",
          ];
        }
        
        // 4. When Adding to Cart / Changing quantity  from Listings
        if (operation == 'grocery_add_to_cart_app') {
          var fields = [
            // LINES
            "lines.product_id.id",
            "lines.product_id.name",
            "lines.qty",
            "lines.total_qty",
          ];
        }
        
        // 5. When Adding to Cart / Changing quantity  from Listings (Mealplan)
        if (operation == 'mealcart_add_to_cart_app') {
          var fields = [
            // DELIVERY RELATED
            // LINES
            "lines.product_id.id",
            // "lines.product_id.name",
            "lines.qty",
            "lines.total_qty",
            
            // For Mealplan
            "ship_addresses_days",
            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            
            // LINES - Required for the cart in the Fresh Meals section
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",            
            "lines.amount",
            "lines.uom_id.name",

            // Add the fields for BYO (if needed - Check with Jon for design)
            "lines.product_id.byo_plate_id", // null if not existing
            "lines.product_id.byo_plate_id.proteins.product_id.name",
            "lines.product_id.byo_plate_id.proteins.qty",
            "lines.product_id.byo_plate_id.sides.product_id.name",
            "lines.product_id.byo_plate_id.sides.qty",
            "lines.product_id.byo_plate_id.dressings.product_id.name",
            "lines.product_id.byo_plate_id.dressings.qty",
            "lines.product_id.byo_plate_id.premium_addons.product_id.name",
            "lines.product_id.byo_plate_id.premium_addons.qty",

            "lines.product_id.byo_salad_id", // null if not existing
            "lines.product_id.byo_salad_id.salad_mix.product_id.name",
            "lines.product_id.byo_salad_id.salad_mix.qty",
            "lines.product_id.byo_salad_id.proteins.product_id.name",
            "lines.product_id.byo_salad_id.proteins.qty",
            "lines.product_id.byo_salad_id.dressings.product_id.name",
            "lines.product_id.byo_salad_id.dressings.qty",
            "lines.product_id.byo_salad_id.premium_addons.product_id.name",
            "lines.product_id.byo_salad_id.premium_addons.qty",
          ];
        }
        
        // 5. When changing a slot / delivery date from Homepage/Market etc.
        if (operation == 'grocery_slot_change_app') {
          var fields = [
            // DELIVERY RELATED
            // SLOTS
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
          ];
        }
        
        // 6. When changing a slot and Address / delivery date from Homepage/Market etc. 
        if (operation == 'grocery_slot_and_address_change_app') {
          var fields = [
            // DELIVERY RELATED
            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
            
            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",
          ];
        }
        
        // 7. When changing a slot / delivery date from Homepage/Market etc. (Mealplan)
        if (operation == 'meal_cart_update_delivery_app') {
          var fields = [
            // DELIVERY RELATED
            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
            
            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",
            
            // LINES
            "lines.product_id.id",
            "lines.qty",
            "lines.total_qty",
            
            // For Mealplan
            "ship_addresses_days",
            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",
            "lines.ship_address_id",
            "lines.ship_address_id.name",
          ];
        }        
        
        // CART
        // 8. When first arriving on the Cart Page
        if (operation == 'grocery_cart_cart_load') {
          var fields = [
            // TOTALS AND GENERAL
            "amount_items",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_ship",
            "free_ship_min_amount",
            "error",

            // New
            "amount_ship_combined",
            "amount_total_combined",

            // DELIVERY RELATED
            // ADDRESSES
            "ship_addresses", // added zone_id

            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",

            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now
            
            // For Mealplan
            // TOTALS AND GENERAL
            // "date_delivery_slots",
            "ship_addresses_days", // added zone_id

            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            // Add the fields for BYO (if needed - Check with Jon for design)
            "lines.product_id.byo_plate_id", // null if not existing
            "lines.product_id.byo_plate_id.proteins.product_id.name",
            "lines.product_id.byo_plate_id.proteins.qty",
            "lines.product_id.byo_plate_id.sides.product_id.name",
            "lines.product_id.byo_plate_id.sides.qty",
            "lines.product_id.byo_plate_id.dressings.product_id.name",
            "lines.product_id.byo_plate_id.dressings.qty",
            "lines.product_id.byo_plate_id.premium_addons.product_id.name",
            "lines.product_id.byo_plate_id.premium_addons.qty",

            "lines.product_id.byo_salad_id", // null if not existing
            "lines.product_id.byo_salad_id.salad_mix.product_id.name",
            "lines.product_id.byo_salad_id.salad_mix.qty",
            "lines.product_id.byo_salad_id.proteins.product_id.name",
            "lines.product_id.byo_salad_id.proteins.qty",
            "lines.product_id.byo_salad_id.dressings.product_id.name",
            "lines.product_id.byo_salad_id.dressings.qty",
            "lines.product_id.byo_salad_id.premium_addons.product_id.name",
            "lines.product_id.byo_salad_id.premium_addons.qty",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",

          ];
        }
        
        // 9. When modifying a quantity in Cart
        if (operation == 'grocery_add_to_cart_cart') {
          var fields = [
            // TOTALS AND GENERAL
            "amount_items",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_ship",
            "free_ship_min_amount",
            "error",

            // New
            "amount_ship_combined",
            "amount_total_combined",
            
            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl",
            
            // For Mealplan
            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            // Add the fields for BYO (if needed - Check with Jon for design)
            "lines.product_id.byo_plate_id", // null if not existing
            "lines.product_id.byo_plate_id.proteins.product_id.name",
            "lines.product_id.byo_plate_id.proteins.qty",
            "lines.product_id.byo_plate_id.sides.product_id.name",
            "lines.product_id.byo_plate_id.sides.qty",
            "lines.product_id.byo_plate_id.dressings.product_id.name",
            "lines.product_id.byo_plate_id.dressings.qty",
            "lines.product_id.byo_plate_id.premium_addons.product_id.name",
            "lines.product_id.byo_plate_id.premium_addons.qty",

            "lines.product_id.byo_salad_id", // null if not existing
            "lines.product_id.byo_salad_id.salad_mix.product_id.name",
            "lines.product_id.byo_salad_id.salad_mix.qty",
            "lines.product_id.byo_salad_id.proteins.product_id.name",
            "lines.product_id.byo_salad_id.proteins.qty",
            "lines.product_id.byo_salad_id.dressings.product_id.name",
            "lines.product_id.byo_salad_id.dressings.qty",
            "lines.product_id.byo_salad_id.premium_addons.product_id.name",
            "lines.product_id.byo_salad_id.premium_addons.qty",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",
          ];
        }
        
        // 10. When modifying a quantity in Cart (Mealplan)
        if (operation == 'mealcart_add_to_cart_cart') {
          var fields = [
            // TOTALS AND GENERAL
            "amount_items",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_ship",
            "free_ship_min_amount",
            "error",

            // New
            "amount_ship_combined",
            "amount_total_combined",
            
            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl",
            
            // For Mealplan
            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",
            
            // Add the fields for BYO (if needed - Check with Jon for design)
            "lines.product_id.byo_plate_id", // null if not existing
            "lines.product_id.byo_plate_id.proteins.product_id.name",
            "lines.product_id.byo_plate_id.proteins.qty",
            "lines.product_id.byo_plate_id.sides.product_id.name",
            "lines.product_id.byo_plate_id.sides.qty",
            "lines.product_id.byo_plate_id.dressings.product_id.name",
            "lines.product_id.byo_plate_id.dressings.qty",
            "lines.product_id.byo_plate_id.premium_addons.product_id.name",
            "lines.product_id.byo_plate_id.premium_addons.qty",

            "lines.product_id.byo_salad_id", // null if not existing
            "lines.product_id.byo_salad_id.salad_mix.product_id.name",
            "lines.product_id.byo_salad_id.salad_mix.qty",
            "lines.product_id.byo_salad_id.proteins.product_id.name",
            "lines.product_id.byo_salad_id.proteins.qty",
            "lines.product_id.byo_salad_id.dressings.product_id.name",
            "lines.product_id.byo_salad_id.dressings.qty",
            "lines.product_id.byo_salad_id.premium_addons.product_id.name",
            "lines.product_id.byo_salad_id.premium_addons.qty",
            
            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",
          ];
        }
                
        // 11. When deleting something from cart
        if (operation == 'delete_item') { 
          var fields = [
            // TOTALS AND GENERAL
            "amount_items",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_ship",
            "free_ship_min_amount",
            "error",
            
            "delivery_slots_from_now", 

            // New
            "amount_ship_combined",
            "amount_total_combined",
            
            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl",
            
            // For Mealplan
            "ship_addresses_days", // added zone_id

            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            // Add the fields for BYO (if needed - Check with Jon for design)
            "lines.product_id.byo_plate_id", // null if not existing
            "lines.product_id.byo_plate_id.proteins.product_id.name",
            "lines.product_id.byo_plate_id.proteins.qty",
            "lines.product_id.byo_plate_id.sides.product_id.name",
            "lines.product_id.byo_plate_id.sides.qty",
            "lines.product_id.byo_plate_id.dressings.product_id.name",
            "lines.product_id.byo_plate_id.dressings.qty",
            "lines.product_id.byo_plate_id.premium_addons.product_id.name",
            "lines.product_id.byo_plate_id.premium_addons.qty",

            "lines.product_id.byo_salad_id", // null if not existing
            "lines.product_id.byo_salad_id.salad_mix.product_id.name",
            "lines.product_id.byo_salad_id.salad_mix.qty",
            "lines.product_id.byo_salad_id.proteins.product_id.name",
            "lines.product_id.byo_salad_id.proteins.qty",
            "lines.product_id.byo_salad_id.dressings.product_id.name",
            "lines.product_id.byo_salad_id.dressings.qty",
            "lines.product_id.byo_salad_id.premium_addons.product_id.name",
            "lines.product_id.byo_salad_id.premium_addons.qty",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",
          ];
        }
                
        // 12. When adding an address - MIGHT NOT BE NEEDED ... REVIEW AFTERWARDS (because we reread the cart when arriving on the Cart page.)
        if (operation == 'grocery_change_slot_and_address_after_adding_address') {
          
        }
        
        // 13. When adding an address - MIGHT NOT BE NEEDED ... REVIEW AFTERWARDS (because we reread the cart when arriving on the Cart page.)
        if (operation == 'meal_cart_update_delivery_after_adding_address') {
          
        }
        
        // 14. Changing a slot in cart - This also updates the mealcart if it is combined so need to read both.
        if (operation == 'grocery_slot_change_cart') {
          var fields = [
            // TOTALS AND GENERAL
            "error",

            // DELIVERY RELATED
            // SLOTS
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
            
            // For Mealplan
            "ship_addresses_days", // added zone_id

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now
            
            // For Mealplan
            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            // Add the fields for BYO (if needed - Check with Jon for design)
            "lines.product_id.byo_plate_id", // null if not existing
            "lines.product_id.byo_plate_id.proteins.product_id.name",
            "lines.product_id.byo_plate_id.proteins.qty",
            "lines.product_id.byo_plate_id.sides.product_id.name",
            "lines.product_id.byo_plate_id.sides.qty",
            "lines.product_id.byo_plate_id.dressings.product_id.name",
            "lines.product_id.byo_plate_id.dressings.qty",
            "lines.product_id.byo_plate_id.premium_addons.product_id.name",
            "lines.product_id.byo_plate_id.premium_addons.qty",

            "lines.product_id.byo_salad_id", // null if not existing
            "lines.product_id.byo_salad_id.salad_mix.product_id.name",
            "lines.product_id.byo_salad_id.salad_mix.qty",
            "lines.product_id.byo_salad_id.proteins.product_id.name",
            "lines.product_id.byo_salad_id.proteins.qty",
            "lines.product_id.byo_salad_id.dressings.product_id.name",
            "lines.product_id.byo_salad_id.dressings.qty",
            "lines.product_id.byo_salad_id.premium_addons.product_id.name",
            "lines.product_id.byo_salad_id.premium_addons.qty",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",

          ];
        }
        
        // 15. Changing a slot in cart - This only applies on meal carts (otherwise it's handled by scenario no 14)
        if (operation == 'meal_cart_update_delivery_slot_cart') { // carefull as change_slot for grocery on checkout also makes it necessary for this to run (this actually only runs if we have a cart type meal or if there is no single day delivery)
          var fields = [
            // TOTALS AND GENERAL
            "error",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now
            
            // For Mealplan
            "ship_addresses_days", // added zone_id
            
            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            // Add the fields for BYO (if needed - Check with Jon for design)
            "lines.product_id.byo_plate_id", // null if not existing
            "lines.product_id.byo_plate_id.proteins.product_id.name",
            "lines.product_id.byo_plate_id.proteins.qty",
            "lines.product_id.byo_plate_id.sides.product_id.name",
            "lines.product_id.byo_plate_id.sides.qty",
            "lines.product_id.byo_plate_id.dressings.product_id.name",
            "lines.product_id.byo_plate_id.dressings.qty",
            "lines.product_id.byo_plate_id.premium_addons.product_id.name",
            "lines.product_id.byo_plate_id.premium_addons.qty",

            "lines.product_id.byo_salad_id", // null if not existing
            "lines.product_id.byo_salad_id.salad_mix.product_id.name",
            "lines.product_id.byo_salad_id.salad_mix.qty",
            "lines.product_id.byo_salad_id.proteins.product_id.name",
            "lines.product_id.byo_salad_id.proteins.qty",
            "lines.product_id.byo_salad_id.dressings.product_id.name",
            "lines.product_id.byo_salad_id.dressings.qty",
            "lines.product_id.byo_salad_id.premium_addons.product_id.name",
            "lines.product_id.byo_salad_id.premium_addons.qty",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",

          ];
        }
        
        // 16. When changing an address and slot in the cart (affects totals ... affects all fields)
        if (operation == 'grocery_slot_and_address_change_cart') {
          var fields = [
            // TOTALS AND GENERAL
            "amount_items",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_ship",
            "free_ship_min_amount",
            "error",

            // New
            "amount_ship_combined",
            "amount_total_combined",

            // DELIVERY RELATED
            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",

            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now
            
            // For Mealplan
            // TOTALS AND GENERAL
            "ship_addresses_days", // added zone_id

            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            // Add the fields for BYO (if needed - Check with Jon for design)
            "lines.product_id.byo_plate_id", // null if not existing
            "lines.product_id.byo_plate_id.proteins.product_id.name",
            "lines.product_id.byo_plate_id.proteins.qty",
            "lines.product_id.byo_plate_id.sides.product_id.name",
            "lines.product_id.byo_plate_id.sides.qty",
            "lines.product_id.byo_plate_id.dressings.product_id.name",
            "lines.product_id.byo_plate_id.dressings.qty",
            "lines.product_id.byo_plate_id.premium_addons.product_id.name",
            "lines.product_id.byo_plate_id.premium_addons.qty",

            "lines.product_id.byo_salad_id", // null if not existing
            "lines.product_id.byo_salad_id.salad_mix.product_id.name",
            "lines.product_id.byo_salad_id.salad_mix.qty",
            "lines.product_id.byo_salad_id.proteins.product_id.name",
            "lines.product_id.byo_salad_id.proteins.qty",
            "lines.product_id.byo_salad_id.dressings.product_id.name",
            "lines.product_id.byo_salad_id.dressings.qty",
            "lines.product_id.byo_salad_id.premium_addons.product_id.name",
            "lines.product_id.byo_salad_id.premium_addons.qty",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",

          ];
        }
        
        // 17. When changing an address in the cart (MEALPLAN)
        if (operation == 'meal_cart_update_delivery_address_cart') { 
          var fields = [
            // TOTALS AND GENERAL
            "amount_items",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_ship",
            "free_ship_min_amount",
            "error",

            // New
            "amount_ship_combined",
            "amount_total_combined",

            // DELIVERY RELATED
            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",

            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now
            
            // For Mealplan
            // TOTALS AND GENERAL
            "ship_addresses_days", // added zone_id

            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            // Add the fields for BYO (if needed - Check with Jon for design)
            "lines.product_id.byo_plate_id", // null if not existing
            "lines.product_id.byo_plate_id.proteins.product_id.name",
            "lines.product_id.byo_plate_id.proteins.qty",
            "lines.product_id.byo_plate_id.sides.product_id.name",
            "lines.product_id.byo_plate_id.sides.qty",
            "lines.product_id.byo_plate_id.dressings.product_id.name",
            "lines.product_id.byo_plate_id.dressings.qty",
            "lines.product_id.byo_plate_id.premium_addons.product_id.name",
            "lines.product_id.byo_plate_id.premium_addons.qty",

            "lines.product_id.byo_salad_id", // null if not existing
            "lines.product_id.byo_salad_id.salad_mix.product_id.name",
            "lines.product_id.byo_salad_id.salad_mix.qty",
            "lines.product_id.byo_salad_id.proteins.product_id.name",
            "lines.product_id.byo_salad_id.proteins.qty",
            "lines.product_id.byo_salad_id.dressings.product_id.name",
            "lines.product_id.byo_salad_id.dressings.qty",
            "lines.product_id.byo_salad_id.premium_addons.product_id.name",
            "lines.product_id.byo_salad_id.premium_addons.qty",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",

          ];
        }
        
        // CHECKOUT
        // 18. Whn arriving on the Checkout Page
        if (operation == 'grocery_cart_checkout_load') {
          var fields = [
            // TOTALS AND GENERAL
            "amount_credit",
            "amount_items",
            "amount_pay",
            "amount_subtotal",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_voucher",
            "amount_ship",
            "credit_remain",
            // "plr_same_date", - NOT USED IN APP FOR NOW
            "voucher_id.code",
            "voucher_id.description",
            "voucher_error_message",
            "voucher_error_message_combined",
            "free_ship_min_amount",
            "error",
            "comments",
            "pay_method_id",

            // New (not sure if needed here ... )
            "amount_ship_combined",
            "amount_voucher_combined",
            "amount_credit_combined",
            "amount_total_combined",

            // DELIVERY RELATED
            // ADDRESSES
            "ship_addresses", // added zone_id

            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",

            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            // "lines.product_id.code",  - NOT USED IN APP FOR NOW
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now

            // Added for cards
            "card_token_id.mask_card",
            "card_token_id.exp_month",
            "card_token_id.exp_year",
            "card_token_id.token",
            "card_token_id.cvv",
            
            // For Mealplan
            // TOTALS AND GENERAL
            // "date_delivery_slots",
            "ship_addresses_days", // added zone_id

            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",

          ];
        }
        
        // 19. Changing Grocery Slot on Checkout Page (Affects both carts)
        if (operation == 'grocery_slot_change_checkout') {
          var fields = [
            // TOTALS AND GENERAL
            "error",
            
            // SLOTS 
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now
            
            // For Mealplan
            "ship_addresses_days", // added zone_id
            
            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",

          ];
        }        
        
        // 20. Changing Meal Slot on Checkout Page  (Affects only Mealplan Cart)
        if (operation == 'meal_cart_update_delivery_slot_checkout') {
          var fields = [
            // TOTALS AND GENERAL
            "error",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now
            
            // For Mealplan
            "ship_addresses_days", // added zone_id
            
            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",

          ];
        }
        
        // 21. Changing Grocery Slot and Address on Checkout Page
        if (operation == 'grocery_slot_and_address_change_checkout') {
          var fields = [
            // TOTALS AND GENERAL
            "amount_credit",
            "amount_items",
            "amount_pay",
            "amount_subtotal",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_voucher",
            "amount_ship",
            "credit_remain",
            "free_ship_min_amount",
            "error",

            // New (not sure if needed here ... )
            "amount_ship_combined",
            "amount_voucher_combined",
            "amount_credit_combined",
            "amount_total_combined",

            // DELIVERY RELATED
            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",

            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now
            
            // For Mealplan
            // TOTALS AND GENERAL
            "ship_addresses_days", // added zone_id

            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",

          ];
        }
        
        // 22. Changing Meal Address on Checkout Page
        if (operation == 'meal_cart_update_delivery_address_checkout') {
           var fields = [
            // TOTALS AND GENERAL
            "error",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now
            
            // For Mealplan
            "ship_addresses_days", // added zone_id
            
            // Lines
            "lines.ship_address_id",
            "lines.ship_address_id.name",
            "lines.ship_address_id.address",
            "lines.ship_address_id.state",
            "lines.ship_address_id.zone_id",
            "lines.ship_address_id.postal_code",

            "lines.delivery_date",
            "lines.delivery_slot_id",
            "lines.delivery_slot_id.name",
          ];
        }
        
        // 23. Changing Comment on Checkout Page        
        if (operation == 'change_comment') { 
          var fields = [
            "comments",
          ];
        }
        
        // 24. Changing Payment on Checkout Page        
        if (operation == 'change_payment') { 
          var fields = [
            "pay_method_id",
          ];
        }
        
        // 25. Applying Voucher  
        if (operation == 'apply_voucher') { 
          var fields = [
            // TOTALS AND GENERAL
            "amount_credit",
            "amount_items",
            "amount_pay",
            "amount_subtotal",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_voucher",
            "amount_ship",
            "credit_remain",
            // "plr_same_date", - NOT USED IN APP FOR NOW
            "voucher_id.code",
            "voucher_id.description",
            "voucher_error_message",
            "voucher_error_message_combined",
            "free_ship_min_amount",
            "error",

            // New (not sure if needed here ... )
            "amount_ship_combined",
            "amount_voucher_combined",
            "amount_credit_combined",
            "amount_total_combined",

          ];
        }
        
        // MEALPLAN ONLY FIELDS - USE AS NEEDED
        // TOTALS AND GENERAL
        /*
          // "date_delivery_slots",
          "ship_addresses_days", // added zone_id

          // Lines
          "lines.ship_address_id",
          "lines.ship_address_id.name",
          "lines.ship_address_id.address",
          "lines.ship_address_id.state",
          "lines.ship_address_id.zone_id",
          "lines.ship_address_id.postal_code",

          // Add the fields for BYO (if needed - Check with Jon for design)
          "lines.product_id.byo_plate_id", // null if not existing
          "lines.product_id.byo_plate_id.proteins.product_id.name",
          "lines.product_id.byo_plate_id.proteins.qty",
          "lines.product_id.byo_plate_id.sides.product_id.name",
          "lines.product_id.byo_plate_id.sides.qty",
          "lines.product_id.byo_plate_id.dressings.product_id.name",
          "lines.product_id.byo_plate_id.dressings.qty",
          "lines.product_id.byo_plate_id.premium_addons.product_id.name",
          "lines.product_id.byo_plate_id.premium_addons.qty",

          "lines.product_id.byo_salad_id", // null if not existing
          "lines.product_id.byo_salad_id.salad_mix.product_id.name",
          "lines.product_id.byo_salad_id.salad_mix.qty",
          "lines.product_id.byo_salad_id.proteins.product_id.name",
          "lines.product_id.byo_salad_id.proteins.qty",
          "lines.product_id.byo_salad_id.dressings.product_id.name",
          "lines.product_id.byo_salad_id.dressings.qty",
          "lines.product_id.byo_salad_id.premium_addons.product_id.name",
          "lines.product_id.byo_salad_id.premium_addons.qty",

          "lines.delivery_date",
          "lines.delivery_slot_id",
          "lines.delivery_slot_id.name",
        */
        
        
        // ALL FIELDS
        /*
        var fields = [
          // TOTALS AND GENERAL
          "amount_credit",
          "amount_items",
          "amount_total",
          "amount_tax",
          "amount_subtotal",
          "amount_ship",
          "amount_voucher",
          "amount_pay",
          "amount_total_noship",
          // "amount_total_order", - NOT USED IN APP
          // "customer_id", - NOT USED IN APP
          "credit_remain",
          // "date_delivery_slots",
          "error",
          // "plr_same_date",  - NOT USED IN APP FOR NOW

          // Lines
          "lines.ship_address_id",
          "lines.ship_address_id.name",
          "lines.ship_address_id.address",
          // "lines.ship_address_id.address2",
          // "lines.ship_address_id.mobile",
          // "lines.ship_address_id.coords",
          "lines.ship_address_id.state",
          "lines.ship_address_id.zone_id",
          "lines.ship_address_id.postal_code",
          // "lines.ship_address_id.soi",
          // "lines.ship_address_id.bldg_name",
          // "lines.ship_address_id.unit_no",
          // "lines.ship_address_id.instructions_messenger",
          "lines.product_id.name",
          "lines.product_id.ecom_short_title",
          "lines.product_id.image",
          // "lines.product_id.code",
          "lines.error", //We might need this.

          // Add the fields for BYO (if needed - Check with Jon for design)
          "lines.product_id.byo_plate_id", // null if not existing
          "lines.product_id.byo_plate_id.proteins.product_id.name",
          "lines.product_id.byo_plate_id.proteins.qty",
          "lines.product_id.byo_plate_id.sides.product_id.name",
          "lines.product_id.byo_plate_id.sides.qty",
          "lines.product_id.byo_plate_id.dressings.product_id.name",
          "lines.product_id.byo_plate_id.dressings.qty",
          "lines.product_id.byo_plate_id.premium_addons.product_id.name",
          "lines.product_id.byo_plate_id.premium_addons.qty",

          "lines.product_id.byo_salad_id", // null if not existing
          "lines.product_id.byo_salad_id.salad_mix.product_id.name",
          "lines.product_id.byo_salad_id.salad_mix.qty",
          "lines.product_id.byo_salad_id.proteins.product_id.name",
          "lines.product_id.byo_salad_id.proteins.qty",
          "lines.product_id.byo_salad_id.dressings.product_id.name",
          "lines.product_id.byo_salad_id.dressings.qty",
          "lines.product_id.byo_salad_id.premium_addons.product_id.name",
          "lines.product_id.byo_salad_id.premium_addons.qty",

          "lines.product_id.categ_id",
          "lines.qty",
          "lines.unit_price",
          "lines.uom_id.name",
          "lines.amount",
          "lines.delivery_date",
          "lines.delivery_slot_id",
          "lines.delivery_slot_id.name",

          "ship_addresses_days", // added zone_id
          "voucher_id.code",
          "voucher_id.description",
          "voucher_error_message",
          "voucher_error_message_combined",

          // GROCERY ONLY FIELDS
          // Only one of the bellow should be used
          "ship_address_id",
          "ship_address_id.name",
          "ship_address_id.address",
          // "ship_address_id.address2",
          // "ship_address_id.mobile",
          // "ship_address_id.coords",
          "ship_address_id.state",
          "ship_address_id.zone_id",
          "ship_address_id.postal_code",
          // "ship_address_id.soi",
          // "ship_address_id.bldg_name",
          //"ship_address_id.unit_no",
          // "ship_address_id.instructions_messenger",

          "delivery_date",
          "delivery_slots_from_now",
          "delivery_slot_id",
          "delivery_slot_id.name",
          "ship_addresses", // added zone_id
          "ship_address_id",
          "free_ship_min_amount",
          "lines.product_id.stock_qty_avail",
          "lines.product_id.ecom_no_order_unavail",
          "lines.product_id.sale_max_qty",
          "lines.product_id.sale_qty_multiple",
          "lines.qty_avail",
          "lines.total_qty",
          "lines.lot_id",
          "lines.lot_id.weight",

          // New
          "amount_ship_combined",
          "amount_voucher_combined",
          "amount_credit_combined",
          
          "amount_total_combined",

          "comments",
          "pay_method_id",

          "lines.product_id.zones_excl",// Added for app only for now

           // Added for cards
          "card_token_id",
          "card_token_id.mask_card",
          "card_token_id.exp_month",
          "card_token_id.exp_year",
          "card_token_id.token",
          "card_token_id.cvv",
        ];
        */
        
        // FROM GROCERY
        /*
        var fields = [
          // TOTALS AND GENERAL
          "amount_credit",
          "amount_items",
          "amount_pay",
          "amount_subtotal",
          "amount_total",
          "amount_tax",
          "amount_total_noship",
          // "amount_total_order", - NOT USED IN APP FOR NOW
          // "customer_id", - NOT USED IN APP FOR NOW
          "amount_voucher",
          "amount_ship",
          "credit_remain",
          // "plr_same_date", - NOT USED IN APP FOR NOW
          "voucher_id.code",
          "voucher_id.description",
          "voucher_error_message",
          "voucher_error_message_combined",
          "free_ship_min_amount",
          "error",
          "comments",
          "pay_method_id",

          // New (not sure if needed here ... )
          "amount_ship_combined",
          "amount_voucher_combined",
          "amount_credit_combined",

          // DELIVERY RELATED
          // ADDRESSES
          "ship_addresses", // added zone_id

          "ship_address_id",
          "ship_address_id.name",
          "ship_address_id.address",
          // "ship_address_id.address2",  - NOT USED IN APP FOR NOW
          // "ship_address_id.mobile",  - NOT USED IN APP FOR NOW
          // "ship_address_id.coords",  - NOT USED IN APP FOR NOW
          "ship_address_id.state",
          "ship_address_id.zone_id",
          "ship_address_id.postal_code",
          // "ship_address_id.soi",  - NOT USED IN APP FOR NOW
          // "ship_address_id.bldg_name",  - NOT USED IN APP FOR NOW
          // "ship_address_id.unit_no",  - NOT USED IN APP FOR NOW
          // "ship_address_id.instructions_messenger",  - NOT USED IN APP FOR NOW

          // SLOTS
          "delivery_slots_from_now",
          "delivery_date",
          "delivery_slot_id",
          "delivery_slot_id.name",

          // LINES
          "lines.product_id.name",
          "lines.product_id.ecom_short_title",
          "lines.product_id.image",
          // "lines.product_id.code",  - NOT USED IN APP FOR NOW
          "lines.product_id.stock_qty_avail",
          "lines.product_id.ecom_no_order_unavail",
          "lines.product_id.sale_max_qty",
          "lines.product_id.sale_qty_multiple",
          "lines.product_id.categ_id",
          "lines.qty",
          "lines.qty_avail",
          "lines.total_qty",
          "lines.unit_price",
          "lines.amount",
          "lines.uom_id.name",
          "lines.lot_id",
          "lines.lot_id.weight",
          "lines.error",
          "lines.product_id.zones_excl", // Added for app only for now

          // Added for cards
          "card_token_id.mask_card",
          "card_token_id.exp_month",
          "card_token_id.exp_year",
          "card_token_id.token",
          "card_token_id.cvv",

        ];
        */
        
        if (nf_state.cart_actions_count == 0) {
          return apis.execute("ecom2.cart","read_path",[[meal_cart_id, grocery_cart_id], fields],{},() => {}).then((res) => {
            console.log("Actions Pending After Loading Cart", nf_state.cart_actions_count);
            console.log("combined cart data", res);
            // Optimize batching setState's togheter in the future
            // ReactDOM.unstable_batchedUpdates(() => {
              if (nf_state.cart_actions_count == 0) {
                
                // IN THE APP 
                // Fields that are required when: 
                // 1. Loading First Time / Homepage
                // 2. Market Page (when arriving on the market page, because we have the time selector) ... Do we really need this or are we doing it in the cart ?
                // 3. Any other page that might require the loading of the cart, beside the CART and CHECKOUT pages
                if (operation == 'grocery_initial_cart_load') {
                  console.log('Setting grocery cart details from combined');
                  setCartData(res[1]);
                  console.log('Setting meal cart details from combined');
                  setMealsCartData(res[0]);
                }
                
                // 4. When Adding to Cart / Changing quantity  from Listings
                if (operation == 'grocery_add_to_cart_app') {
                  setCartData(currValue => ({
                     ...currValue,
                     lines: res[1].lines
                  }))
                }
                
                // 5. When Adding to Cart / Changing quantity  from Listings (Mealplan)
                if (operation == 'mealcart_add_to_cart_app') {
                  setMealsCartData(currValue => ({
                     ...currValue,
                     lines: res[0].lines,
                     ship_addresses_days: res[0].ship_addresses_days
                  }))
                }
                
                // 5. When changing a slot / delivery date from Homepage/Market etc.
                if (operation == 'grocery_slot_change_app') {
                  setCartData(currValue => ({
                     ...currValue,
                     delivery_date: res[1].delivery_date,
                     delivery_slot_id: res[1].delivery_slot_id,
                  }))
                }
                
                // 6. When changing a slot and Address / delivery date from Homepage/Market etc. 
                if (operation == 'grocery_slot_and_address_change_app') {
                  setCartData(currValue => ({
                     ...currValue,
                     delivery_date: res[1].delivery_date,
                     delivery_slot_id: res[1].delivery_slot_id,
                     ship_address_id: res[1].ship_address_id,
                  }))
                }
                
                // 7. When changing a slot / delivery date from Homepage/Market etc. (Mealplan)
                if (operation == 'meal_cart_update_delivery_app') {
                    setCartData(currValue => ({
                     ...currValue,
                       delivery_date: res[1].delivery_date,
                       delivery_slot_id: res[1].delivery_slot_id,
                       ship_address_id: res[1].ship_address_id,
                    }))
                    
                    setMealsCartData(currValue => ({
                       ...currValue,
                       lines: res[0].lines,
                       ship_addresses_days: res[0].ship_addresses_days
                    }))
                }
                
                // CART
                // 8. When first arriving on the Cart Page
                if (operation == 'grocery_cart_cart_load') {
                  console.log('Setting grocery cart details from combined');
                  setCartData(res[1]);
                  console.log('Setting meal cart details from combined');
                  setMealsCartData(res[0]);
                }
                
                // 9. When modifying a quantity in Cart
                if (operation == 'grocery_add_to_cart_cart') {
                  setCartData(currValue => ({
                     ...currValue,
                     amount_items: res[1].amount_items,
                     amount_total: res[1].amount_total,
                     amount_tax: res[1].amount_tax,
                     amount_total_noship: res[1].amount_total_noship,
                     amount_ship: res[1].amount_ship,
                     free_ship_min_amount: res[1].free_ship_min_amount,
                     error: res[1].error,
                     amount_ship_combined: res[1].amount_ship_combined,
                     lines: res[1].lines
                  }))
                  
                  setMealsCartData(currValue => ({
                     ...currValue,
                     amount_items: res[0].amount_items,
                     amount_total: res[0].amount_total,
                     amount_tax: res[0].amount_tax,
                     amount_total_noship: res[0].amount_total_noship,
                     amount_ship: res[0].amount_ship,
                     error: res[0].error,
                     amount_total_combined: res[0].amount_total_combined
                  }))
                }
                
                // 10. When modifying a quantity in Cart (Mealplan)
                if (operation == 'mealcart_add_to_cart_cart') {
                  setCartData(currValue => ({
                     ...currValue,
                     amount_items: res[1].amount_items,
                     amount_total: res[1].amount_total,
                     amount_tax: res[1].amount_tax,
                     amount_total_noship: res[1].amount_total_noship,
                     amount_ship: res[1].amount_ship,
                     free_ship_min_amount: res[1].free_ship_min_amount,
                     error: res[1].error,
                     amount_ship_combined: res[1].amount_ship_combined
                  }))
                  
                  setMealsCartData(currValue => ({
                     ...currValue,
                     amount_items: res[0].amount_items,
                     amount_total: res[0].amount_total,
                     amount_tax: res[0].amount_tax,
                     amount_total_noship: res[0].amount_total_noship,
                     amount_ship: res[0].amount_ship,
                     error: res[0].error,
                     amount_total_combined: res[0].amount_total_combined,
                     lines: res[0].lines
                  }))
                }
                        
                // 11. When deleting something from cart
                if (operation == 'delete_item') { 
                  setCartData(currValue => ({
                     ...currValue,
                     amount_items: res[1].amount_items,
                     amount_total: res[1].amount_total,
                     amount_tax: res[1].amount_tax,
                     amount_total_noship: res[1].amount_total_noship,
                     amount_ship: res[1].amount_ship,
                     free_ship_min_amount: res[1].free_ship_min_amount,
                     error: res[1].error,
                     delivery_slots_from_now: res[0].delivery_slots_from_now,
                     amount_ship_combined: res[1].amount_ship_combined,
                     lines: res[1].lines
                  }))
                  
                  setMealsCartData(currValue => ({
                     ...currValue,
                     amount_items: res[0].amount_items,
                     amount_total: res[0].amount_total,
                     amount_tax: res[0].amount_tax,
                     amount_total_noship: res[0].amount_total_noship,
                     amount_ship: res[0].amount_ship,
                     error: res[0].error,
                     amount_total_combined: res[0].amount_total_combined,
                     lines: res[0].lines,
                     ship_addresses_days: res[0].ship_addresses_days
                  }))
                }
                        
                // 12. When adding an address - MIGHT NOT BE NEEDED ... REVIEW AFTERWARDS (because we reread the cart when arriving on the Cart page.)
                if (operation == 'grocery_change_slot_and_address_after_adding_address') {
                  
                }
                
                // 13. When adding an address - MIGHT NOT BE NEEDED ... REVIEW AFTERWARDS (because we reread the cart when arriving on the Cart page.)
                if (operation == 'meal_cart_update_delivery_after_adding_address') {
                  
                }
                
                // 14. Changing a slot in cart - This also updates the mealcart if it is combined so need to read both.
                if (operation == 'grocery_slot_change_cart') {
                  setCartData(currValue => ({
                   ...currValue,
                     delivery_date: res[1].delivery_date,
                     delivery_slot_id: res[1].delivery_slot_id
                  }))
                  
                  setMealsCartData(currValue => ({
                     ...currValue,
                     lines: res[0].lines,
                     ship_addresses_days: res[0].ship_addresses_days
                  }))
                }
                
                // 15. Changing a slot in cart - This only applies on meal carts (otherwise it's handled by scenario no 14)
                if (operation == 'meal_cart_update_delivery_slot_cart') { // carefull as change_slot for grocery on checkout also makes it necessary for this to run (this actually only runs if we have a cart type meal or if there is no single day delivery)
                  setMealsCartData(currValue => ({
                     ...currValue,
                     lines: res[0].lines,
                     ship_addresses_days: res[0].ship_addresses_days
                  }))
                }
                
                // 16. When changing an address and slot in the cart (affects totals ... affects all fields)
                if (operation == 'grocery_slot_and_address_change_cart') {
                  setCartData(currValue => ({
                     ...currValue,
                     amount_items: res[1].amount_items,
                     amount_total: res[1].amount_total,
                     amount_tax: res[1].amount_tax,
                     amount_total_noship: res[1].amount_total_noship,
                     amount_ship: res[1].amount_ship,
                     free_ship_min_amount: res[1].free_ship_min_amount,
                     error: res[1].error,
                     amount_ship_combined: res[1].amount_ship_combined,
                     delivery_date: res[1].delivery_date,
                     delivery_slot_id: res[1].delivery_slot_id,
                     ship_address_id: res[1].ship_address_id,
                     delivery_slots_from_now: res[1].delivery_slots_from_now
                  }))
                  
                  setMealsCartData(currValue => ({
                     ...currValue,
                     amount_items: res[0].amount_items,
                     amount_total: res[0].amount_total,
                     amount_tax: res[0].amount_tax,
                     amount_total_noship: res[0].amount_total_noship,
                     amount_ship: res[0].amount_ship,
                     error: res[0].error,
                     amount_total_combined: res[0].amount_total_combined,
                     lines: res[0].lines,
                     ship_addresses_days: res[0].ship_addresses_days
                  }))
                }
                
                // 17. When changing an address in the cart (MEALPLAN)
                if (operation == 'meal_cart_update_delivery_address_cart') { 
                  setCartData(currValue => ({
                     ...currValue,
                     amount_items: res[1].amount_items,
                     amount_total: res[1].amount_total,
                     amount_tax: res[1].amount_tax,
                     amount_total_noship: res[1].amount_total_noship,
                     amount_ship: res[1].amount_ship,
                     free_ship_min_amount: res[1].free_ship_min_amount,
                     error: res[1].error,
                     amount_ship_combined: res[1].amount_ship_combined,
                     delivery_date: res[1].delivery_date,
                     delivery_slot_id: res[1].delivery_slot_id,
                     ship_address_id: res[1].ship_address_id,
                     delivery_slots_from_now: res[1].delivery_slots_from_now
                  }))
                  
                  setMealsCartData(currValue => ({
                     ...currValue,
                     amount_items: res[0].amount_items,
                     amount_total: res[0].amount_total,
                     amount_tax: res[0].amount_tax,
                     amount_total_noship: res[0].amount_total_noship,
                     amount_ship: res[0].amount_ship,
                     error: res[0].error,
                     amount_total_combined: res[0].amount_total_combined,
                     lines: res[0].lines,
                     ship_addresses_days: res[0].ship_addresses_days
                  }))
                }
                
                // CHECKOUT
                // 18. Whn arriving on the Checkout Page
                if (operation == 'grocery_cart_checkout_load') {
                  console.log('Setting grocery cart details from combined');
                  setCartData(res[1]);
                  console.log('Setting meal cart details from combined');
                  setMealsCartData(res[0]);
                }
                
                // 19. Changing Grocery Slot on Checkout Page (Affects both carts)
                if (operation == 'grocery_slot_change_checkout') {
                  setCartData(currValue => ({
                   ...currValue,
                     delivery_date: res[1].delivery_date,
                     delivery_slot_id: res[1].delivery_slot_id
                  }))
                  
                  setMealsCartData(currValue => ({
                     ...currValue,
                     lines: res[0].lines,
                     ship_addresses_days: res[0].ship_addresses_days
                  }))
                }
                
                // 20. Changing Meal Slot on Checkout Page  (Affects only Mealplan Cart)
                if (operation == 'meal_cart_update_delivery_slot_checkout') {
                  setMealsCartData(currValue => ({
                     ...currValue,
                     lines: res[0].lines,
                     ship_addresses_days: res[0].ship_addresses_days
                  }))
                }
                
                // 21. Changing Grocery Slot and Address on Checkout Page
                if (operation == 'grocery_slot_and_address_change_checkout') {
                  
                    setCartData(currValue => ({
                       ...currValue,
                       amount_items: res[1].amount_items,
                       amount_total: res[1].amount_total,
                       amount_tax: res[1].amount_tax,
                       amount_total_noship: res[1].amount_total_noship,
                       amount_ship: res[1].amount_ship,
                       free_ship_min_amount: res[1].free_ship_min_amount,
                       error: res[1].error,
                       amount_ship_combined: res[1].amount_ship_combined,
                       delivery_date: res[1].delivery_date,
                       delivery_slot_id: res[1].delivery_slot_id,
                       ship_address_id: res[1].ship_address_id,
                       // Added
                       amount_credit: res[1].amount_credit,
                       amount_pay: res[1].amount_pay,
                       amount_voucher: res[1].amount_voucher,
                       credit_remain: res[1].credit_remain,
                       amount_voucher_combined: res[1].amount_voucher_combined,
                       amount_credit_combined: res[1].amount_credit_combined,
                       delivery_slots_from_now: res[1].delivery_slots_from_now
                    }))
                    
                    setMealsCartData(currValue => ({
                       ...currValue,
                       amount_items: res[0].amount_items,
                       amount_total: res[0].amount_total,
                       amount_tax: res[0].amount_tax,
                       amount_total_noship: res[0].amount_total_noship,
                       amount_ship: res[0].amount_ship,
                       error: res[0].error,
                       amount_total_combined: res[0].amount_total_combined,
                       lines: res[0].lines,
                       ship_addresses_days: res[0].ship_addresses_days, 
                       // Added
                       amount_credit: res[0].amount_credit,
                       amount_pay: res[0].amount_pay,
                       amount_voucher: res[0].amount_voucher,
                       credit_remain: res[0].credit_remain,
                       amount_voucher_combined: res[0].amount_voucher_combined,
                       amount_credit_combined: res[0].amount_credit_combined,
                    }))
                }
                
                // 22. Changing Meal Address on Checkout Page
                if (operation == 'meal_cart_update_delivery_address_checkout') {
                  setMealsCartData(currValue => ({
                     ...currValue,
                     lines: res[0].lines,
                     ship_addresses_days: res[0].ship_addresses_days
                  }))
                }
                
                // 23. Changing Comment on Checkout Page        
                if (operation == 'change_comment') { 
                  setCartData(currValue => ({
                     ...currValue,
                     comments: res[1].comments,
                  }))
                  setMealsCartData(currValue => ({
                     ...currValue,
                     comments: res[0].comments,
                  }))
                }
                
                // 24. Changing Payment on Checkout Page        
                if (operation == 'change_payment') { 
                  setCartData(currValue => ({
                     ...currValue,
                     pay_method_id: res[1].pay_method_id,
                  }))
                  setMealsCartData(currValue => ({
                     ...currValue,
                     pay_method_id: res[0].pay_method_id,
                  }))
                }
                
                // 25. Applying Voucher  
                if (operation == 'apply_voucher') { 
                  setCartData(currValue => ({
                     ...currValue,
                     amount_items: res[1].amount_items,
                     amount_total: res[1].amount_total,
                     amount_tax: res[1].amount_tax,
                     amount_total_noship: res[1].amount_total_noship,
                     amount_ship: res[1].amount_ship,
                     free_ship_min_amount: res[1].free_ship_min_amount,
                     error: res[1].error,
                     amount_ship_combined: res[1].amount_ship_combined,
                     // Added
                     amount_credit: res[1].amount_credit,
                     amount_pay: res[1].amount_pay,
                     amount_voucher: res[1].amount_voucher,
                     credit_remain: res[1].credit_remain,
                     amount_voucher_combined: res[1].amount_voucher_combined,
                     amount_credit_combined: res[1].amount_credit_combined,
                     voucher_id: res[1].voucher_id,
                     voucher_error_message: res[1].voucher_error_message,
                     voucher_error_message_combined: res[1].voucher_error_message_combined,
                  }))
                      
                  setMealsCartData(currValue => ({
                     ...currValue,
                     amount_items: res[0].amount_items,
                     amount_total: res[0].amount_total,
                     amount_tax: res[0].amount_tax,
                     amount_total_noship: res[0].amount_total_noship,
                     amount_ship: res[0].amount_ship,
                     error: res[0].error,
                     amount_total_combined: res[0].amount_total_combined,
                     // Added
                     amount_credit: res[0].amount_credit,
                     amount_pay: res[0].amount_pay,
                     amount_voucher: res[0].amount_voucher,
                     credit_remain: res[0].credit_remain,
                     amount_voucher_combined: res[0].amount_voucher_combined,
                     amount_credit_combined: res[0].amount_credit_combined,
                     voucher_id: res[0].voucher_id,
                     voucher_error_message: res[0].voucher_error_message,
                     voucher_error_message_combined: res[0].voucher_error_message_combined,
                     
                  }))
                }
                
                console.log('Combined Cart Load End', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
                
                // console.log('Setting grocery cart details from combined');
                // setCartData(res[1]);
                // console.log('Setting meal cart details from combined');
                // setMealsCartData(res[0]);
              }
            // })
          }).catch((err) => {
            console.log("err---", err);
          });
        }
      }
    }
  };

  // Load Mealplan Cart
  apis.meal_cart_load = async (
    cart_id,
    setCartData,
    setIsAnyApiLoading
  ) => {
    console.log("Actions Pending Before Clearing Slots", nf_state.cart_actions_count);
    
    console.log('Meal Cart Load Start', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
    
    if (nf_state.cart_actions_count == 0) {
      var cart_exists =  await apis.updateMealsSlots(cart_id);
      console.log('cart_exists',cart_exists);
      if (cart_exists == false) {
        console.log('Cart Does Not Exist');
      } else {
        console.log('Cart Exists');

        var fields = [
          // TOTALS AND GENERAL
          "amount_credit",
          "amount_items",
          "amount_total",
          "amount_tax",
          "amount_subtotal",
          "amount_ship",
          "amount_voucher",
          "amount_pay",
          "amount_total_noship",
          // "amount_total_order", - NOT USED IN APP FOR NOW
          // "customer_id", - NOT USED IN APP FOR NOW
          "credit_remain",
          // "date_delivery_slots",
          "error",
          // "plr_same_date",  - NOT USED IN APP FOR NOW
          "ship_addresses_days", // added zone_id
          "voucher_id.code",
          "voucher_id.description",
          "voucher_error_message",
          "voucher_error_message_combined",
          "comments",
          "pay_method_id",

          // New (not sure if needed here ... )
          "amount_ship_combined",
          "amount_voucher_combined",
          "amount_credit_combined",

          // LINES
          "lines.ship_address_id",
          "lines.ship_address_id.name",
          "lines.ship_address_id.address",
          // "lines.ship_address_id.address2",  - NOT USED IN APP FOR NOW
          // "lines.ship_address_id.mobile",  - NOT USED IN APP FOR NOW
          // "lines.ship_address_id.coords",  - NOT USED IN APP FOR NOW
          "lines.ship_address_id.state",
          "lines.ship_address_id.zone_id",
          "lines.ship_address_id.postal_code",
          // "lines.ship_address_id.soi",  - NOT USED IN APP FOR NOW
          // "lines.ship_address_id.bldg_name",  - NOT USED IN APP FOR NOW
          // "lines.ship_address_id.unit_no",  - NOT USED IN APP FOR NOW
          // "lines.ship_address_id.instructions_messenger",  - NOT USED IN APP FOR NOW
          "lines.product_id.name",
          "lines.product_id.ecom_short_title",
          "lines.product_id.image",
          // "lines.product_id.code",  - NOT USED IN APP FOR NOW
          "lines.product_id.categ_id",
          "lines.qty",
          "lines.unit_price",
          "lines.uom_id.name",
          "lines.amount",
          "lines.delivery_date",
          "lines.delivery_slot_id",
          "lines.delivery_slot_id.name",

          // Add the fields for BYO (if needed - Check with Jon for design)   - NOT USED IN APP FOR NOW
          /*
          */
          "lines.product_id.byo_plate_id", // null if not existing
          "lines.product_id.byo_plate_id.proteins.product_id.name",
          "lines.product_id.byo_plate_id.proteins.qty",
          "lines.product_id.byo_plate_id.sides.product_id.name",
          "lines.product_id.byo_plate_id.sides.qty",
          "lines.product_id.byo_plate_id.dressings.product_id.name",
          "lines.product_id.byo_plate_id.dressings.qty",
          "lines.product_id.byo_plate_id.premium_addons.product_id.name",
          "lines.product_id.byo_plate_id.premium_addons.qty",

          "lines.product_id.byo_salad_id", // null if not existing
          "lines.product_id.byo_salad_id.salad_mix.product_id.name",
          "lines.product_id.byo_salad_id.salad_mix.qty",
          "lines.product_id.byo_salad_id.proteins.product_id.name",
          "lines.product_id.byo_salad_id.proteins.qty",
          "lines.product_id.byo_salad_id.dressings.product_id.name",
          "lines.product_id.byo_salad_id.dressings.qty",
          "lines.product_id.byo_salad_id.premium_addons.product_id.name",
          "lines.product_id.byo_salad_id.premium_addons.qty",

           // Added for cards
          "card_token_id.mask_card",
          "card_token_id.exp_month",
          "card_token_id.exp_year",
          "card_token_id.token",
          "card_token_id.cvv",
        ];

        console.log("Actions Pending Before Loading Cart", nf_state.cart_actions_count);
        if (nf_state.cart_actions_count == 0) {
          apis.execute("ecom2.cart","read_path",[[cart_id], fields], {}, setIsAnyApiLoading).then((res) => {
            console.log("Actions Pending After Loading Cart", nf_state.cart_actions_count);

            console.log("meal cart data --", res);
            // Avoid refreshes if the user added other items to cart in the meantime
            if (nf_state.cart_actions_count == 0) {
              setCartData(res[0]);
            }
            
            console.log('Meal Cart Load End', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
            
          }).catch((err) => {
            // upload_action("meal_cart_load",err);
            // alert("Error: "+err);
            console.log("err---", err);
          });
        }
      }
    }
  };

  // Add to cart for Mealplan
  apis.meal_cart_set_qty_simple = async (
    due_date,
    prod_id,
    qty,
    address_id = 0,
    slot_id = 0,
    setMealsCartData,
    setCartData,
    cartType,
    setIsAnyApiLoading,
    extParams,
    operation = 'mealcart_add_to_cart_app'
  ) => {
    
    console.log('Meal Cart Add To Cart Start', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
    
    // console.log('Action to do 1',nf_state.cart_actions_count);
    nf_state.cart_actions_count = nf_state.cart_actions_count + 1;
    // console.log('Action to do 2',nf_state.cart_actions_count);

    /*wait until the cart is created*/
    let cardId = global.mealsCartId;
    if (!cardId) {
      cardId = await create_meal_cart(extParams);
      global.mealsCartId = cardId;
    }
    console.log(cardId);
    /*wait until the cart is created END*/
    // nf_state.meal_item_is_adding = true;

    var cart_id = cardId;
    var ids = cart_id ? [cart_id] : null;
    var ctx = {
      cart_type: "meal",
      // "campaign_ref": get_cookie("campaign_ref")
    };

    if (address_id != 0 && slot_id != 0) {
      var vals = [ids, due_date, prod_id, qty, address_id, slot_id];
    } else {
      var vals = [ids, due_date, prod_id, qty];
    }
    console.log("Adding product_id to cart_id", prod_id, cart_id, vals);

    AppsFyler.logEvent('add_to_cart_meal', {

    });

    // await execute("ecom2.cart", "set_date_qty", [ids,due_date,prod_id,qty], {context:ctx}).then(res=>{ // set_date_qty_lucian OLD ONE
    return apis.execute("ecom2.cart","set_date_qty2",vals, { context: ctx }, setIsAnyApiLoading, extParams).then((res) => {
      // set_date_qty_lucian  // with address and slot
      // setCartData(res)

      // console.log('Action to do 3',nf_state.cart_actions_count);
      nf_state.cart_actions_count = nf_state.cart_actions_count - 1;
      // console.log('Action to do 4',nf_state.cart_actions_count);

      console.log("meals array--", res);
      // if (res.message) {
        // alert(res.message); // Removed in order to not show the error when removing items from the mealplan page - Figure out though why
      // } else {
        // Only load the cart when there are no other actions to be done.
        if (nf_state.cart_actions_count == 0) {
          console.log('Action to do 5 - Loading the cart');
          // Adjustment for issue with setState not actually setting it fast enough
          apis.loadCart('yes',cartType,setCartData,setMealsCartData,extParams,operation);
        } else {
          console.log("Action to do 6 - still have actions pending");
        }
        
        console.log('Meal Cart Add To Cart End', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
      // }
    })
    .catch((err) => {
      // upload_action("meal_cart_set_qty_simple",err);
      // nf_state.meal_item_is_adding = false;
      alert("Error: " + err);
    });
  };

  // Load Grocery Cart
  apis.grocery_cart_load = async (
    cart_id,
    setCartData,
    setIsAnyApiLoading,
    updateStoredFields = 'normal',
    extParams,
    operation = 'grocery_initial_cart_load'
  ) => {
    
    console.log('Grocery Cart Load Start', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
    
    console.log('OPERATION',operation, extParams);
    console.log("Actions Pending Before Clearing Slots", nf_state.cart_actions_count);
    if (nf_state.cart_actions_count == 0) {
      if ( operation == 'grocery_cart_checkout_load' || operation=="apply_voucher") {
        // if ( updateStoredFields == 'normal') {
          var cart_exists = await apis.updateSlots(cart_id,extParams, operation);
        // } else {
          // var cart_exists = await apis.updateSlotsAll(cart_id,extParams); - Try not to use this as it uses way to many resources
        // }
      }
      console.log('cart_exists',cart_exists);
      if (cart_exists == false) {
        console.log('Cart Does Not Exist');
      } else {
        console.log('Cart Exists');

        var cart_id = cart_id || null;
        if (!cart_id) {
          // console.warn("Missing cart ID");
          return;
        }
        
        // Scenarios in which different fields might need to be reloaded (as we don't always need to re-read everything)
        
        // IN THE APP 
        // Fields that are required when: 
        // 1. Loading First Time / Homepage
        // 2. Market Page (when arriving on the market page, because we have the time selector) ... Do we really need this or are we doing it in the cart ?
        // 3. Any other page that might require the loading of the cart, beside the CART and CHECKOUT pages
        if (operation == 'grocery_initial_cart_load') {
          
          /*
          var fields = [
            // TOTALS AND GENERAL
            "amount_credit",
            "amount_items",
            "amount_pay",
            "amount_subtotal",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            // "amount_total_order", - NOT USED IN APP FOR NOW
            // "customer_id", - NOT USED IN APP FOR NOW
            "amount_voucher",
            "amount_ship",
            "credit_remain",
            // "plr_same_date", - NOT USED IN APP FOR NOW
            "voucher_id.code",
            "voucher_id.description",
            "voucher_error_message",
            "voucher_error_message_combined",
            "free_ship_min_amount",
            "error",
            "comments",
            "pay_method_id",

            // New (not sure if needed here ... )
            "amount_ship_combined",
            "amount_voucher_combined",
            "amount_credit_combined",

            // DELIVERY RELATED
            // ADDRESSES
            "ship_addresses", // added zone_id

            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            // "ship_address_id.address2",  - NOT USED IN APP FOR NOW
            // "ship_address_id.mobile",  - NOT USED IN APP FOR NOW
            // "ship_address_id.coords",  - NOT USED IN APP FOR NOW
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",
            // "ship_address_id.soi",  - NOT USED IN APP FOR NOW
            // "ship_address_id.bldg_name",  - NOT USED IN APP FOR NOW
            // "ship_address_id.unit_no",  - NOT USED IN APP FOR NOW
            // "ship_address_id.instructions_messenger",  - NOT USED IN APP FOR NOW

            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            // "lines.product_id.code",  - NOT USED IN APP FOR NOW
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now

            // Added for cards
            "card_token_id.mask_card",
            "card_token_id.exp_month",
            "card_token_id.exp_year",
            "card_token_id.token",
            "card_token_id.cvv",

          ];
          */
          
         
          var fields = [
            // DELIVERY RELATED
            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
            
            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",
            // LINES
            "lines.product_id.id",
            "lines.product_id.name",
            "lines.qty",
            "lines.total_qty",
          ];
           /*
          */
        }
        
        // 4. When Adding to Cart / Changing quantity  from Listings
        if (operation == 'grocery_add_to_cart_app') {
          var fields = [
            // LINES
            "lines.product_id.id",
            "lines.product_id.name",
            "lines.qty",
            "lines.total_qty",
          ];
        }
        
        // 5. When changing a slot / delivery date from Homepage/Market etc.
        if (operation == 'grocery_slot_change_app') {
          var fields = [
            // DELIVERY RELATED
            // SLOTS
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
          ];
        }
        
        // 6. When changing a slot and Address / delivery date from Homepage/Market etc. 
        if (operation == 'grocery_slot_and_address_change_app') {
          var fields = [
            // DELIVERY RELATED
            // SLOTS
            "delivery_slots_from_now", 
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
            
            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",
          ];
        }       
        
        // CART
        // 8. When first arriving on the Cart Page
        if (operation == 'grocery_cart_cart_load') {
          var fields = [
            // TOTALS AND GENERAL
            "amount_items",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_ship",
            "free_ship_min_amount",
            "error",

            // DELIVERY RELATED
            // ADDRESSES
            "ship_addresses", // added zone_id

            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",

            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now

          ];
        }
        
        // 9. When modifying a quantity in Cart
        if (operation == 'grocery_add_to_cart_cart') {
          var fields = [
            // TOTALS AND GENERAL
            "amount_items",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_ship",
            "free_ship_min_amount",
            "error",
            
            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl",
          ];
        }
                
        // 11. When deleting something from cart
        if (operation == 'delete_item') { 
          var fields = [
            // TOTALS AND GENERAL
            "amount_items",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_ship",
            "free_ship_min_amount",
            "error",
            
            "delivery_slots_from_now", 
            
            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl",
          ];
        }
                
        // 12. When adding an address - MIGHT NOT BE NEEDED ... REVIEW AFTERWARDS (because we reread the cart when arriving on the Cart page.)
        if (operation == 'grocery_change_slot_and_address_after_adding_address') {
          
        }
        
        // 14. Changing a slot in cart - This also updates the mealcart if it is combined so need to read both.
        if (operation == 'grocery_slot_change_cart') {
          var fields = [
            // TOTALS AND GENERAL
            "error",

            // DELIVERY RELATED
            // SLOTS
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
          ];
        }
                
        // 16. When changing an address and slot in the cart (affects totals ... affects all fields)
        if (operation == 'grocery_slot_and_address_change_cart') {
          var fields = [
            // TOTALS AND GENERAL
            "amount_items",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_ship",
            "free_ship_min_amount",
            "error",
            
            // DELIVERY RELATED
            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
            
            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",
            

          ];
        }
        
        // CHECKOUT
        // 18. Whn arriving on the Checkout Page
        if (operation == 'grocery_cart_checkout_load') {
          var fields = [
            // TOTALS AND GENERAL
            "amount_credit",
            "amount_items",
            "amount_pay",
            "amount_subtotal",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_voucher",
            "amount_ship",
            "credit_remain",
            // "plr_same_date", - NOT USED IN APP FOR NOW
            "voucher_id.code",
            "voucher_id.description",
            "voucher_error_message",
            "voucher_error_message_combined",
            "free_ship_min_amount",
            "error",
            "comments",
            "pay_method_id",

            // DELIVERY RELATED
            // ADDRESSES
            "ship_addresses", // added zone_id

            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",

            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",

            // LINES
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.image",
            // "lines.product_id.code",  - NOT USED IN APP FOR NOW
            "lines.product_id.stock_qty_avail",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.categ_id",
            "lines.qty",
            "lines.qty_avail",
            "lines.total_qty",
            "lines.unit_price",
            "lines.amount",
            "lines.uom_id.name",
            "lines.lot_id",
            "lines.lot_id.weight",
            "lines.error",
            "lines.product_id.zones_excl", // Added for app only for now

            // Added for cards
            "card_token_id.mask_card",
            "card_token_id.exp_month",
            "card_token_id.exp_year",
            "card_token_id.token",
            "card_token_id.cvv",

          ];
        }
        
        // 19. Changing Grocery Slot on Checkout Page (Affects both carts)
        if (operation == 'grocery_slot_change_checkout') {
          var fields = [
            // TOTALS AND GENERAL
            "error",

            // DELIVERY RELATED
            // SLOTS
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
          ];
        }
        
        // 21. Changing Grocery Slot and Address on Checkout Page
        if (operation == 'grocery_slot_and_address_change_checkout') {
          var fields = [
            // TOTALS AND GENERAL
            "amount_credit",
            "amount_items",
            "amount_pay",
            "amount_subtotal",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_voucher",
            "amount_ship",
            "credit_remain",
            "free_ship_min_amount",
            "error",
            
            // DELIVERY RELATED
            // SLOTS
            "delivery_slots_from_now",
            "delivery_date",
            "delivery_slot_id",
            "delivery_slot_id.name",
            
            "ship_address_id",
            "ship_address_id.name",
            "ship_address_id.address",
            "ship_address_id.state",
            "ship_address_id.zone_id",
            "ship_address_id.postal_code",

          ];
         
        }
        
        // 23. Changing Comment on Checkout Page        
        if (operation == 'change_comment') { 
          var fields = [
            "comments",
          ];
        }
        
        // 24. Changing Payment on Checkout Page        
        if (operation == 'change_payment') { 
          var fields = [
            "pay_method_id",
          ];
        }
        
        // 25. Applying Voucher  
        if (operation == 'apply_voucher') { 
          var fields = [
            // TOTALS AND GENERAL
            "amount_credit",
            "amount_items",
            "amount_pay",
            "amount_subtotal",
            "amount_total",
            "amount_tax",
            "amount_total_noship",
            "amount_voucher",
            "amount_ship",
            "credit_remain",
            "free_ship_min_amount",
            "error",
            
            "voucher_id.code",
            "voucher_id.description",
            "voucher_error_message",
          ];
        }
        
        /*
        var fields = [
          // TOTALS AND GENERAL
          "amount_credit",
          "amount_items",
          "amount_pay",
          "amount_subtotal",
          "amount_total",
          "amount_tax",
          "amount_total_noship",
          // "amount_total_order", - NOT USED IN APP FOR NOW
          // "customer_id", - NOT USED IN APP FOR NOW
          "amount_voucher",
          "amount_ship",
          "credit_remain",
          // "plr_same_date", - NOT USED IN APP FOR NOW
          "voucher_id.code",
          "voucher_id.description",
          "voucher_error_message",
          "voucher_error_message_combined",
          "free_ship_min_amount",
          "error",
          "comments",
          "pay_method_id",

          // New (not sure if needed here ... )
          "amount_ship_combined",
          "amount_voucher_combined",
          "amount_credit_combined",

          // DELIVERY RELATED
          // ADDRESSES
          "ship_addresses", // added zone_id

          "ship_address_id",
          "ship_address_id.name",
          "ship_address_id.address",
          // "ship_address_id.address2",  - NOT USED IN APP FOR NOW
          // "ship_address_id.mobile",  - NOT USED IN APP FOR NOW
          // "ship_address_id.coords",  - NOT USED IN APP FOR NOW
          "ship_address_id.state",
          "ship_address_id.zone_id",
          "ship_address_id.postal_code",
          // "ship_address_id.soi",  - NOT USED IN APP FOR NOW
          // "ship_address_id.bldg_name",  - NOT USED IN APP FOR NOW
          // "ship_address_id.unit_no",  - NOT USED IN APP FOR NOW
          // "ship_address_id.instructions_messenger",  - NOT USED IN APP FOR NOW

          // SLOTS
          "delivery_slots_from_now",
          "delivery_date",
          "delivery_slot_id",
          "delivery_slot_id.name",

          // LINES
          "lines.product_id.name",
          "lines.product_id.ecom_short_title",
          "lines.product_id.image",
          // "lines.product_id.code",  - NOT USED IN APP FOR NOW
          "lines.product_id.stock_qty_avail",
          "lines.product_id.ecom_no_order_unavail",
          "lines.product_id.sale_max_qty",
          "lines.product_id.sale_qty_multiple",
          "lines.product_id.categ_id",
          "lines.qty",
          "lines.qty_avail",
          "lines.total_qty",
          "lines.unit_price",
          "lines.amount",
          "lines.uom_id.name",
          "lines.lot_id",
          "lines.lot_id.weight",
          "lines.error",
          "lines.product_id.zones_excl", // Added for app only for now

          // Added for cards
          "card_token_id.mask_card",
          "card_token_id.exp_month",
          "card_token_id.exp_year",
          "card_token_id.token",
          "card_token_id.cvv",

        ];
        */

        console.log("Actions Pending Before Loading Cart", nf_state.cart_actions_count);
        if (nf_state.cart_actions_count == 0) {
          return apis.execute("ecom2.cart", "read_path", [[cart_id], fields], {}, setIsAnyApiLoading, extParams).then((res) => {
            console.log("grocery cart data", res);
            console.log("Actions Pending After Loading Cart", nf_state.cart_actions_count);
            // Avoid refreshes if the user added other items to cart in the meantime
            if (nf_state.cart_actions_count == 0) {
              
              // IN THE APP 
              // Fields that are required when: 
              // 1. Loading First Time / Homepage
              // 2. Market Page (when arriving on the market page, because we have the time selector) ... Do we really need this or are we doing it in the cart ?
              // 3. Any other page that might require the loading of the cart, beside the CART and CHECKOUT pages
              if (operation == 'grocery_initial_cart_load') {
                setCartData(res[0]);
              }
              
              // 4. When Adding to Cart / Changing quantity  from Listings
              if (operation == 'grocery_add_to_cart_app') {
                if (res[0] && res[0].lines) {
                  setCartData(currValue => ({
                     ...currValue,
                     lines: res[0].lines
                  }))
                }
              }
              
              // 5. When changing a slot / delivery date from Homepage/Market etc.
              if (operation == 'grocery_slot_change_app') {
                setCartData(currValue => ({
                   ...currValue,
                   delivery_date: res[0].delivery_date,
                   delivery_slot_id: res[0].delivery_slot_id,
                }))
              }
              
              // 6. When changing a slot and Address / delivery date from Homepage/Market etc. 
              if (operation == 'grocery_slot_and_address_change_app') {
                setCartData(currValue => ({
                   ...currValue,
                   delivery_date: res[0].delivery_date,
                   delivery_slot_id: res[0].delivery_slot_id,
                   ship_address_id: res[0].ship_address_id,
                }))
              }
              
              // CART
              // 8. When first arriving on the Cart Page
              if (operation == 'grocery_cart_cart_load') {
                console.log('Setting grocery cart details');
                setCartData(res[0]);
              }
              
              // 9. When modifying a quantity in Cart
              if (operation == 'grocery_add_to_cart_cart') {
                if (res[0] && res[0].lines) {
                  setCartData(currValue => ({
                     ...currValue,
                     amount_items: res[0].amount_items,
                     amount_total: res[0].amount_total,
                     amount_tax: res[0].amount_tax,
                     amount_total_noship: res[0].amount_total_noship,
                     amount_ship: res[0].amount_ship,
                     free_ship_min_amount: res[0].free_ship_min_amount,
                     error: res[0].error,
                     amount_ship_combined: res[0].amount_ship_combined,
                     lines: res[0].lines
                  }))
                }
              }
                      
              // 11. When deleting something from cart
              if (operation == 'delete_item') { 
                if (res[0] && res[0].lines) {
                  setCartData(currValue => ({
                     ...currValue,
                     amount_items: res[0].amount_items,
                     amount_total: res[0].amount_total,
                     amount_tax: res[0].amount_tax,
                     amount_total_noship: res[0].amount_total_noship,
                     amount_ship: res[0].amount_ship,
                     free_ship_min_amount: res[0].free_ship_min_amount,
                     error: res[0].error,
                     delivery_slots_from_now: res[0].delivery_slots_from_now,
                     amount_ship_combined: res[0].amount_ship_combined,
                     lines: res[0].lines
                  }))
                }
              }
                      
              // 12. When adding an address - MIGHT NOT BE NEEDED ... REVIEW AFTERWARDS (because we reread the cart when arriving on the Cart page.)
              if (operation == 'grocery_change_slot_and_address_after_adding_address') {
                
              }
              
              // 13. When adding an address - MIGHT NOT BE NEEDED ... REVIEW AFTERWARDS (because we reread the cart when arriving on the Cart page.)
              if (operation == 'meal_cart_update_delivery_after_adding_address') {
                
              }
              
              // 14. Changing a slot in cart - This also updates the mealcart if it is combined so need to read both.
              if (operation == 'grocery_slot_change_cart') {
                setCartData(currValue => ({
                 ...currValue,
                   delivery_date: res[0].delivery_date,
                   delivery_slot_id: res[0].delivery_slot_id
                }))
              }
              
              // 16. When changing an address and slot in the cart (affects totals ... affects all fields)
              if (operation == 'grocery_slot_and_address_change_cart') {
                setCartData(currValue => ({
                   ...currValue,
                   amount_items: res[0].amount_items,
                   amount_total: res[0].amount_total,
                   amount_tax: res[0].amount_tax,
                   amount_total_noship: res[0].amount_total_noship,
                   amount_ship: res[0].amount_ship,
                   free_ship_min_amount: res[0].free_ship_min_amount,
                   error: res[0].error,
                   delivery_slots_from_now: res[0].delivery_slots_from_now,
                   delivery_date: res[0].delivery_date,
                   delivery_slot_id: res[0].delivery_slot_id,
                   ship_address_id: res[0].ship_address_id,
                }))
              }
              // CHECKOUT
              // 18. Whn arriving on the Checkout Page
              if (operation == 'grocery_cart_checkout_load') {
                console.log('Setting grocery cart details from combined');
                setCartData(res[0]);
              }
              
              // 19. Changing Grocery Slot on Checkout Page (Affects both carts)
              if (operation == 'grocery_slot_change_checkout') {
                setCartData(currValue => ({
                 ...currValue,
                   delivery_date: res[0].delivery_date,
                   delivery_slot_id: res[0].delivery_slot_id
                }))
              }
              
              // 21. Changing Grocery Slot and Address on Checkout Page
              if (operation == 'grocery_slot_and_address_change_checkout') {
                
                  setCartData(currValue => ({
                     ...currValue,
                     delivery_slots_from_now: res[0].delivery_slots_from_now,
                     delivery_date: res[0].delivery_date,
                     delivery_slot_id: res[0].delivery_slot_id,
                     ship_address_id: res[0].ship_address_id,
                     amount_items: res[0].amount_items,
                     amount_total: res[0].amount_total,
                     amount_tax: res[0].amount_tax,
                     amount_total_noship: res[0].amount_total_noship,
                     amount_ship: res[0].amount_ship,
                     free_ship_min_amount: res[0].free_ship_min_amount,
                     error: res[0].error,
                     // Added
                     amount_credit: res[0].amount_credit,
                     amount_pay: res[0].amount_pay,
                     amount_voucher: res[0].amount_voucher,
                     credit_remain: res[0].credit_remain,
                  }))
              }
              
              // 23. Changing Comment on Checkout Page        
              if (operation == 'change_comment') { 
                setCartData(currValue => ({
                   ...currValue,
                   comments: res[0].comments,
                }))
              }
              
              // 24. Changing Payment on Checkout Page        
              if (operation == 'change_payment') { 
                setCartData(currValue => ({
                   ...currValue,
                   pay_method_id: res[0].pay_method_id,
                }))
              }
              
              // 25. Applying Voucher  
              if (operation == 'apply_voucher') { 
                setCartData(currValue => ({
                   ...currValue,
                   amount_items: res[0].amount_items,
                   amount_total: res[0].amount_total,
                   amount_tax: res[0].amount_tax,
                   amount_total_noship: res[0].amount_total_noship,
                   amount_ship: res[0].amount_ship,
                   free_ship_min_amount: res[0].free_ship_min_amount,
                   error: res[0].error,
                   // Added
                   amount_credit: res[0].amount_credit,
                   amount_pay: res[0].amount_pay,
                   amount_voucher: res[0].amount_voucher,
                   credit_remain: res[0].credit_remain,
                   voucher_id: res[0].voucher_id,
                   voucher_error_message: res[0].voucher_error_message,
                }))
              }
              
              console.log('Grocery Cart Load End', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
        
              // setCartData(res[0]);
              return res[0];
            }
          })
          .catch((err) => {
            alert("Error: " + err);
          });
        }
      }
    }
  };

  // Add to cart for Grocery
  apis.grocery_cart_set_qty_simple = async (
    prod_id,
    qty,
    call_type,
    updateCartId,
    setCartData,
    setMealsCartData,
    cartType,
    setIsAnyApiLoading,
    extParams,
    operation = 'grocery_add_to_cart_app'
  ) => {
    
    console.log('Grocery Cart Add To Cart Start', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));

    var call = "set_qty_app";
    if (call_type == 3) {
      call = "set_qty_auto_select_lot";
    }

    // console.log('Action to do 1',nf_state.cart_actions_count);
    nf_state.cart_actions_count = nf_state.cart_actions_count + 1;
    // console.log('Action to do 2',nf_state.cart_actions_count);

    /*wait until the cart is created*/
    let cardId = global.cartId;
    if (!cardId) {
      cardId = await apis.create_grocery_cart(extParams);
      updateCartId(cardId);
    }
    /*wait until the cart is created END*/
    // console.log("cardId", cardId);
    var cart_id = parseInt(cardId) || null;
    var ids = cart_id ? [cart_id] : null;
    var ctx = {
      cart_type: "grocery",
      // campaign_ref: get_cookie("campaign_ref")
    };

    console.log("Adding product_id to cart_id", prod_id, cart_id, call);

    AppsFyler.logEvent('add_to_cart_grocery', {

    });

    apis.execute("ecom2.cart", call, [ids, prod_id, qty],{ context: ctx }, setIsAnyApiLoading, extParams).then((res) => {
      console.log("Grocery item added", res);

      // console.log('Action to do 3',nf_state.cart_actions_count);
      nf_state.cart_actions_count = nf_state.cart_actions_count - 1;
      // console.log('Action to do 4',nf_state.cart_actions_count);

      // Not sure why this would ever be needed
      // if (res.message) {
          // alert(res.message); // Removed in order to not show the error when removing items from the grocery page - Figure out though why
      // } else {
        // Only load the cart when there are no other actions to be done.
        if (nf_state.cart_actions_count == 0) {
          console.log('Action to do 5 - Loading the cart');
          // Adjustment for issue with setState not actually setting it fast enough
          apis.loadCart('yes',cartType,setCartData,setMealsCartData,extParams,operation);
        } else {
          console.log("Action to do 6 - still have actions pending");
        }
        
        console.log('Grocery Cart Add To Cart End', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
      // }

    }).catch((err) => {
      // upload_action("grocery_cart_set_qty_simple",err);
      alert("Error: " + err);
    });
  };

  apis.user_load = (params, setIsApiLoaderShowing) => {
    const { user_id } = params;

    if (!user_id) return;
    var fields = [
      "contact_id.email",
      "contact_id.first_name",
      "contact_id.last_name",
      "contact_id.create_time",
      // "contact_id.plr_price_plan", // Not used right now

      "contact_id.addresses.address",
      "contact_id.addresses.postal_code",
      "contact_id.addresses.mobile",
      "contact_id.addresses.phone",
      "contact_id.addresses.instructions_messenger",
      "contact_id.addresses.subdistrict_id.name",
      "contact_id.addresses.delivery_slot_id",
      "contact_id.addresses.delivery_slot_id.name",
      "contact_id.addresses.zone_id",
      "contact_id.addresses.subdistrict_id.name",
      "contact_id.addresses.district_id.name",
      "contact_id.addresses.province_id.name",
      "contact_id.addresses.soi",
      "contact_id.addresses.bldg_name",
      "contact_id.addresses.unit_no",
      "contact_id.addresses.coords",
      "contact_id.addresses.state",
      "contact_id.title",
      // "contact_id.plr_notif_remind_sms",
      // "contact_id.plr_notif_remind_email",
      "contact_id.plr_notif_deliv_sms",
      // "contact_id.plr_notif_deliv_email",

      "contact_id.plr_notif_deliv_call",
      "contact_id.plr_notif_deliv_app",
      // "contact_id.num_orders_wait_payment",
      // "contact_id.last_order_wait_payment_id",
      // "contact_id.plr_last_grocery_id",
      "account_type",

      // Survey Fields

      "contact_id.gender",
      "contact_id.customer_source",
      "contact_id.plr_reason_grocery",
      "contact_id.birth_date",
      "contact_id.plr_survey1_denied",
      "contact_id.plr_survey1_completed",
      // New Fields
      "contact_id.plr_survey1_how_hear",
      "contact_id.plr_survey1_first_screen_shown",
      "contact_id.plr_survey1_second_screen_shown",
      "contact_id.plr_survey1_third_screen_shown",
      
      
      
      "contact_id.default_address_id.address",
      "contact_id.plr_my_refer_id",
      "contact_id.refer_id", //reffered by

      // Added for app
      "contact_id.receivable_credit",
      "contact_id.zone_id",
      "contact_id.plr_notif_weekly_promo",

      // LINE
      "contact_id.line_user_id",
      "contact_id.line_popup_showed",
      
      "contact_id.line_friendship",
      "contact_id.line_follow_popup_showed",
      // Review Later
      // "contact_id.plr_last_sale_id.pay_method_id.id"
    ];

    return apis.execute(
      "base.user",
      "read_path",
      [[user_id], fields],
      {},
      setIsApiLoaderShowing
    );
  };

  // Delete all items from carts
  apis.deleteCart = async (
    cartData,
    setCartData,
    mealsCartData,
    setMealsCartData,
    extParams
  ) => {
    const cartType = getCartType(cartData, mealsCartData);
    if (cartType == "grocery") {
      apis.execute("ecom2.cart", "empty_cart", [[global.cartId]], {}, () => {}, extParams)
      .then(() => {
        apis.loadCart('yes',cartType,setCartData,setMealsCartData,extParams,'grocery_initial_cart_load');
      });
    } else if (cartType == "meal") {
      apis.execute("ecom2.cart", "empty_cart", [[global.mealsCartId]], {}, () => {}, extParams)
      .then(() => {
        apis.loadCart('yes',cartType,setCartData,setMealsCartData,extParams,'grocery_initial_cart_load');
      });
    } else if (cartType == "combined") {
      await apis.execute("ecom2.cart","empty_cart",[[global.mealsCartId,global.cartId]],{},() => {}, extParams)
      .then(() => {
        apis.loadCart('yes',cartType,setCartData,setMealsCartData,extParams,'grocery_initial_cart_load');
      });
    }
  };

  // Functions for deleting either a line or multiple lines from cart - can be combined in the future
  apis.cart_delete_line = async (
    line_id,
    setCartData,
    setMealsCartData,
    cartType,
    extParams,
  ) => {

    // console.log('Action to do 1',nf_state.cart_actions_count);
    nf_state.cart_actions_count = nf_state.cart_actions_count + 1;
    // console.log('Action to do 2',nf_state.cart_actions_count);

    await apis
      .execute("ecom2.cart.line", "delete", [[line_id]], {}, () => {})
      .then((res) => {
        console.log("cart_delete_line response--", res);
        // console.log('Action to do 3',nf_state.cart_actions_count);
        nf_state.cart_actions_count = nf_state.cart_actions_count - 1;
        // console.log('Action to do 4',nf_state.cart_actions_count);

        if (nf_state.cart_actions_count == 0) {
          apis.loadCart('yes',cartType,setCartData,setMealsCartData,extParams,'delete_item');
        }
      })
      .catch((err) => {
        // upload_action("meal_cart_delete_line",err);
        // alert("Error: "+err);
      });
  };

  apis.cart_delete_multi_lines = async (
    line_ids,
    setCartData,
    setMealsCartData,
    cartType,
    setIsAnyApiLoading,
    extParams
  ) => {
    await apis.execute("ecom2.cart.line", "delete", [line_ids], {}, () => {})
      .then((res) => {
        console.log("res--cart_delete_multi_lines", res);
        apis.loadCart('yes',cartType,setCartData,setMealsCartData,extParams,'grocery_cart_cart_load');
      })
      .catch((err) => {
        // upload_action("meal_cart_delete_line",err);
        // alert("Error: "+err);
    });
  };

  // Used to only change the date on an item ? (by drag and drop)
  apis.meal_cart_update_delivery_date = (
    cart_line_id,
    newDate,
    setMealsCartData,
    setIsAnyApiLoading,
    data
  ) => {
    apis.execute("ecom2.cart.line","update_date",[[cart_line_id], newDate], {},() => {}).then((res) => {
      console.log("**meal_cart_update_delivery_date**", res);
      apis.meal_cart_load(
        global.mealsCartId,
        setMealsCartData,
        setIsAnyApiLoading
      );
    });
  };

  // Updating the delivery details on an item from the mealplan cart
  apis.meal_cart_update_delivery = async (
    due_date,
    vals,
    setMealsCartData,
    setCartData,
    extParams,
    cartType,
    loadCart = "yes",
    operation
  ) => {
    console.log("params", "ecom2.cart", "update_date_delivery_new", [[global.mealsCartId],due_date,vals,]);
    return apis.execute("ecom2.cart", "update_date_delivery_new",[[global.mealsCartId], due_date, vals], {},() => {}, extParams).then((res) => {
      console.log("updated delivery time ", res);
      apis.loadCart(loadCart,cartType,setCartData,setMealsCartData,extParams, operation);
    }).catch((err) => {
      // upload_action("meal_cart_update_delivery",err);
      alert("Error: " + err);
    });

  };

  // Bellow 2 functions can be merged in the future
  // Update a specific value for the meal cart in Netforce
  apis.meal_cart_write = (
    vals,
    setMealsCartData,
    setCartData,
    cartType,
    loadCart,
    extParams,
    operation
  ) => {
    apis
      .execute("ecom2.cart", "write", [[global.mealsCartId], vals], {}, () => {}, extParams)
      .then(() => {
        apis.loadCart(loadCart,cartType,setCartData,setMealsCartData,extParams,operation);
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  };

  // Update a specific value for the grocery cart in Netforce
  apis.grocery_cart_write = (
    vals,
    setMealsCartData,
    setCartData,
    cartType,
    loadCart = "yes",
    extParams,
    operation
  ) => {
    apis
      .execute("ecom2.cart", "write", [[global.cartId], vals], {}, () => {}, extParams)
      .then(() => {
        apis.loadCart(loadCart,cartType,setCartData,setMealsCartData,extParams,operation);
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  };

  // Replace the lot of a grocery item that has lot_id with a new one (if the old one was snatched by a different customer)
  apis.grocery_cart_replace_lot = (
    line_id,
    setMealsCartData,
    setCartData,
    loadCart,
    cartType,
    extParams,
    operation
  ) => {
    apis
      .execute("ecom2.cart.line", "replace_lot", [[line_id]], {}, () => {}, extParams)
      .then(() => {
        apis.loadCart(loadCart,cartType,setCartData,setMealsCartData,extParams, operation);
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  };

  // Create a grocery/ meal cart - merge functions later on
  apis.create_grocery_cart = async (extParams) => {
    var vals = {
      plr_cart_type: "grocery",
    };
    var ctx = {
      cart_type: "grocery",
      device: "App",
      operating_system: "ios",
      browser: "",
      set_date: true,
    };
    return apis.execute(
      "ecom2.cart",
      "create",
      [vals],
      { context: ctx },
      () => {},
      extParams
    );
  };

  var create_meal_cart = async (extParams) => {
    var vals = {
      plr_cart_type: "meal",
    };
    var ctx={
      cart_type:"meal",
      device: 'App',
      operating_system: '',
      browser: '',
      // set_date: true,
    };
    return apis.execute(
      "ecom2.cart",
      "create",
      [vals],
      { context: ctx },
      () => {},
      extParams
    );
  };

  // Repetitive algorithm used to reload a cart once an action (add to cart/write etc.) on the cart is done
  apis.loadCart  = (load_cart,cartType,setCartData,setMealsCartData,extParams, operation='grocery_initial_cart_load') => {
    console.log('test api',load_cart,cartType,global.cartId,global.mealsCartId)
    if (load_cart == 'yes') {
      console.log('step 1',cartType);
      if (cartType === "grocery" || (global.cartId != null && cartType==null)) {
        apis.grocery_cart_load(
          global.cartId,
          setCartData,
          () => {},
          'normal',
          extParams,
          operation
        );
      }
      if (cartType === "combined" || cartType === "meal") {
        console.log('step 2');
        apis.combined_cart_load(
          global.mealsCartId,
          global.cartId,
          setMealsCartData,
          setCartData,
          'normal',
          operation
        );
      }
      console.log("CART LOADED");
    } else {
      console.log("CART NOT YET LOADED");
    }
  };

  // Functions used for udapting the stored fields in the netforce database - Could be combined in the future
  apis.updateSlots = (cart_id, extParams, operation) => {
    console.log("updateSlots cart id ", cart_id);
    
    // This scenario needs to stay for cases in which the user adds credit etc.
    if (operation == 'grocery_cart_checkout_load') { 
      var fields = [
        "credit_remain","amount_credit","amount_pay"
      ];
    }
    
    if ( operation=="apply_voucher") {
      var fields = [
        "credit_remain","amount_credit"
      ];
    }
    
    return apis
      .execute(
        "ecom2.cart",
        "function_store",
        [
          [cart_id],
          fields,
        ],
        {},
        () => {},
        extParams
      )
      .then((res) => {
        console.log("res updateSlots", res);
        if (res == null) {
          return true;
        } else {
          return false;
        }
      });
  };
  
   apis.updateCombinedSlots = (cart_id, meal_cart_id, operation) => {
    
    if (operation == 'grocery_cart_checkout_load') {
      var fields = [
        "credit_remain","amount_credit", "amount_pay"
      ];
    }
    
    if ( operation=="apply_voucher") {
      var fields = [
        "credit_remain","amount_credit"
      ];
    }
    
    return apis
      .execute(
        "ecom2.cart",
        "function_store",
        [
          [meal_cart_id, cart_id],
          fields
        ],
        {},
        () => {}
      )
      .then((res) => {
        console.log("res updateSlots", res);
        if (res == null) {
          return true;
        } else {
          return false;
        }
      });
  };
  
  // Used very little
  apis.updateMealsSlots = (cart_id) => {
    return apis
      .execute(
        "ecom2.cart",
        "function_store",
        [
          [cart_id],
          ["credit_remain","amount_credit"], // "date_delivery_slots",  // "min_delivery_date", // "ship_addresses_days",
        ],
        {},
        () => {}
      )
      .then((res) => {
        console.log("res updateSlots", res);
        if (res == null) {
          return true;
        } else {
          return false;
        }
      });
  };

  // Currently Not used
  apis.updateSlotsAll = (cart_id, extParams) => {
    console.log("updateSlots cart id ", cart_id);

    return apis
      .execute(
        "ecom2.cart",
        "start_checkout_app",
        [
          [cart_id]
        ],
        {},
        () => {},
        extParams
      )
      .then((res) => {
        console.log("res updateSlots", res);
        if (res == null) {
          return true;
        } else {
          return false;
        }
      });
  };
  
  // Currently Not used
  apis.updateCombinedSlotsAll = (cart_id, meal_cart_id) => {
    return apis
      .execute(
        "ecom2.cart",
        "start_checkout_app",
        [
          [meal_cart_id, cart_id]
        ],
        {},
        () => {}
      )
      .then((res) => {
        console.log("res updateSlots", res);
        if (res == null) {
          return true;
        } else {
          return false;
        }
      });
  };

  apis.registerDeviceToken = async (token, opts, extParams) => {
    return apis.execute(
      'device.token',
      'register_token',
      [token],
      opts,
      () => {},
      extParams
    );
  }

  apis.unregisterDeviceToken = async (opts, extParams) => {
    return apis.execute(
      'device.token',
      'unregister_token',
      [],
      opts,
      () => {},
      extParams
    );
  }

  apis.execute = (
    model,
    method,
    args,
    opts,
    setIsApiLoaderShowing,
    extParams
  ) => {
    
    console.log('Execute START', model, method, momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss SSS'));
    
    // Commented out for now as it doesn't have any actual impact
    // setIsApiLoaderShowing(true);
    var params = [model, method];
    params.push(args);
    params.push(opts || {});

    var cookies = {};
    //if(get_cookie("cookies_were_reset")){

    //}
    console.log('extParams',extParams);

    cookies.locale = "en_US";
    cookies.client_name = "PLR_MOBILE";
    if (extParams) {
      if (extParams.user_id) {
        cookies.user_id = extParams.user_id;
        cookies.token = extParams.token;
      }
      // cookies.token = extParams.token ? extParams.token : null;
      // cookies.user_id = extParams.user_id ? extParams.user_id : null;
    }
    params.push(cookies);

    var headers = {
      Accept: "text",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    };

    var use_base_url = BASE_URL + "json_rpc";
    /*
	if (model == 'visitor.action') {
		use_base_url = 'http://paleorobbie.netforce.com'
	} else {
		use_base_url = nf_state.base_url;
	}
	*/
    // console.log('Credentials on Execute',extParams)
    // console.log('Cookies ON EXECUTE',cookies)
    console.log("Params ON Execute--", params);
    return fetch(use_base_url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        id: new Date().getTime(),
        method: "execute",
        params: params,
      }),
    })
      .then((response) => {
        // setIsApiLoaderShowing(false);
        if (!response.ok) {
          throw new Error('It seems there might be some network issues. Please try again in 5 minutes.');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Execute DATA END', model, method, momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss SSS'));
        // setIsApiLoaderShowing(false);
        if (data.error) {
          return data.error;
        }

        return data.result;
      })
      .catch((err) => {
        // setIsApiLoaderShowing(false);

        return err;
      });
  };

  return apis;
};
export default {
  create,
};
