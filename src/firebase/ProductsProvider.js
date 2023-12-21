import db from "./index.js";
import firestore from "@react-native-firebase/firestore";

// General Functions

const buildProductsArrayInOriginalOrder = (products, ids) => {
  const productMap = products.reduce((result, product) => {
    result[product.docId] = product;
    return result;
  }, {});
  return ids.map((productID) => productMap[productID]).filter(p => p);
}

const getSubCategoriesByParent = (allCategories, parentCategoryID) => {
  let filtered = allCategories.filter((x) => x[1].parent_id == parentCategoryID);

  filtered = filtered.sort(function (a, b) {
    const first = a[1].sequence || Number.MAX_SAFE_INTEGER;
    const second = b[1].sequence || Number.MAX_SAFE_INTEGER;
    return first - second;
  });

  return filtered;
}

// All Products 
const getAllProductsData = async () => {
  
  const array = [];
  
  await firestore()
    .collection("products_grocery")
     // .collection("products2")
     // .where("group_items", "!=", [])
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        array.push({ ...doc.data(), docId: doc.id });
      });
       console.log('All products array length',array.length);
       // console.log('All products array',array);
      return array;
     
      // return buildProductsArrayInOriginalOrder(array, data);
  });
  
  return array;
};

const decycle = (obj, stack = []) => {
    if (!obj || typeof obj !== 'object')
        return obj;
    
    if (stack.includes(obj))
        return null;

    let s = stack.concat([obj]);

    return Array.isArray(obj)
        ? obj.map(x => decycle(x, s))
        : Object.fromEntries(
            Object.entries(obj)
                .map(([k, v]) => [k, decycle(v, s)]));
};

const getAllProductsDataFromGroup = async (GroupId) => {
  
  const array = [];
  
  console.log('checking for group',GroupId, typeof(GroupId));
  
  
  await firestore()
    .collection("products_grocery")
     .where("groups_items_list", "array-contains", GroupId.toString())
    .get()
    .then((querySnapshot) => {
      console.log('Firestore errror', JSON.stringify(decycle(querySnapshot)));
      querySnapshot.forEach((doc) => {
        array.push({ ...doc.data(), docId: doc.id });
      });
       console.log('All products array length',array.length);
       // console.log('All products array',array);
      return array;
     
      // return buildProductsArrayInOriginalOrder(array, data);
  });
  
  return array;
};

// Products Data For Specific Item or List of Items
const getProductsData = async (data, setIsApiLoaderShowing, keepOriginalOrder = false) => {
  setIsApiLoaderShowing(true);

  const ids = data.map(String);
  // don't run if there aren't any ids or a path for the collection
  if (!ids || !ids.length) return [];

  const collectionPath = firestore().collection("products_grocery");
  // const collectionPath = firestore().collection("products2");

  let batches = [];

  while (ids.length) {
    // firestore limits batches to 10
    const batch = ids.splice(0, 10);
    // add the batch request to to a queue
    batches.push(
      collectionPath
        .where(firestore.FieldPath.documentId(), "in", [...batch])
        .get()
        .then((results) => results.docs.map(
            doc => ({
              ...doc.data(),
              docId: doc.id,
            })
          )
        )
    );
  }

  // after all of the data is fetched, return it
  const results = await Promise.all(batches);
  setIsApiLoaderShowing(false);

  if (keepOriginalOrder) {
    return buildProductsArrayInOriginalOrder(results.flat(), data);
  } else {
    return results.flat();
  }
};

// Products Data For Specific Item or List of Items FOR MEALS
const getProductsDataMeals = async (data, setIsApiLoaderShowing, keepOriginalOrder = false) => {
  setIsApiLoaderShowing(true);

  const ids = data.map(String);
  // don't run if there aren't any ids or a path for the collection
  if (!ids || !ids.length) return [];
  
  // const collectionPath = firestore().collection("products2");
  const collectionPath = firestore().collection("products_meals");

  let batches = [];

  while (ids.length) {
    // firestore limits batches to 10
    const batch = ids.splice(0, 10);
    // add the batch request to to a queue
    batches.push(
      collectionPath
        .where(firestore.FieldPath.documentId(), "in", [...batch])
        .get()
        .then((results) => results.docs.map(
            doc => ({
              ...doc.data(),
              docId: doc.id,
            })
          )
        )
    );
  }

  // after all of the data is fetched, return it
  const results = await Promise.all(batches);
  setIsApiLoaderShowing(false);

  if (keepOriginalOrder) {
    return buildProductsArrayInOriginalOrder(results.flat(), data);
  } else {
    return results.flat();
  }
};

// Products Data For Fresh Meals Specials - can be used for other things
const getProductsDataOrderByDoc = async (data, setIsApiLoaderShowing) => {
  setIsApiLoaderShowing(true);
  const ids = [...data.map(String)];
  // const collectionPath = firestore().collection("products2");
  const collectionPath = firestore().collection("products_meals");

  return new Promise((res) => {
    // don't run if there aren't any ids or a path for the collection
    if (!ids || !ids.length) return res([]);

    let batches = [];

    while (ids.length) {
      // firestore limits batches to 10
      const batch = ids.splice(0, 10);

      // add the batch request to to a queue
      batches.push(
        new Promise((response) => {
          collectionPath
            .where(firestore.FieldPath.documentId(), "in", [...batch])
            .orderBy(firestore.FieldPath.documentId())
            .get()
            .then((results) =>
              response(
                results.docs.map((result) => ({
                  ...result.data(),
                  docId: result.id,
                }))
              )
            );
        })
      );
    }

    // after all of the data is fetched, return it
    Promise.all(batches).then((content) => {
      setIsApiLoaderShowing(false);

      res(content.flat());
    });
  });
};

const getProductsGroupsData = async (setIsApiLoaderShowing) => {
  // setIsApiLoaderShowing(true);
  var docRef = db.collection("product_groups2");
  const output = {};
  let response = [];
  await docRef
    .orderBy("sequence_app", "asc")
    .limit(500)
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.map(function (documentSnapshot) {
        return (output[documentSnapshot.id] = documentSnapshot.data());
      });
      response = Object.entries(output);

      // setIsApiLoaderShowing(false);
    });
  // console.log('response',response);
  return response;
};

const getFreshMealsArrayData = async (setIsApiLoaderShowing,time) => {
  setIsApiLoaderShowing(true);
  var docRef = db.collection("meal_menus2");
  const output = {};
  let response = [];
  await docRef
    // .where("date_from", "<=", time) // This doesn't work at this time because of All where filters with an inequality (<, <=, >, != or >=) must be on the same field
    .where("date_to", ">=", time)
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.map(function (documentSnapshot) {
        return (output[documentSnapshot.id] = documentSnapshot.data());
      });
      response = Object.entries(output);

      setIsApiLoaderShowing(false);
  });
  return response;
};

const getHomeScreenData = async (setIsApiLoaderShowing, time) => {
  // setIsApiLoaderShowing(true);
  var docRef = db.collection("app_periods2");
  const output = {};
  let response = [];
  await docRef
    .where("date_to", ">=", time)
    .get().then((querySnapshot) => {
    querySnapshot.docs.map(function (documentSnapshot) {
      return (output[documentSnapshot.id] = documentSnapshot.data());
    });
    response = Object.entries(output);
    // setIsApiLoaderShowing(false);
  });
  return response;
};

const subscribeToChatAvailability = (callback) => {
  if (!callback || typeof callback !== 'function') {
    throw 'callback is required';
  }

  return db.doc('ecom2_settings/1').onSnapshot((res) => {
    callback((res.data() || {}).chat_active);
  }, err => {
    console.log('failed to sync chat availability status', err);
    callback(false);
  })
}

const getAppVersions = async () => {
  const snapshot = await db.doc('app_settings/app_versions').get();

  if (snapshot.exists) {
    return snapshot.data();
  }
  return {};
}

/* NOT USED ANYWHERE - COULD BE DELETED IN THE FUTURE */
const getProductsDataByPage = async (data, setIsApiLoaderShowing) => {
  setIsApiLoaderShowing(true);
  const array = [];
  const idsSting = data.map(String);

  await firestore()
    // .collection("products2")
    .collection("products_grocery")
    .where("__name__", "in", idsSting)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        array.push({ ...doc.data(), docId: doc.id });
      });
      setIsApiLoaderShowing(false);
      return buildProductsArrayInOriginalOrder(array, data);
    });

  return array;
};

const getProductsGroupsDataByIds = async (data, setIsApiLoaderShowing) => {
  setIsApiLoaderShowing(true);
  const array = [];

  await firestore()
    .collection("product_groups2")
    .where("__name__", "in", data.map(String))
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        array.push({ ...doc.data(), docId: doc.id });
      });

      setIsApiLoaderShowing(false);
      return array;
    });

  return array;
};

const getFreshMealsData = async (setIsApiLoaderShowing) => {
  setIsApiLoaderShowing(true);
  var docRef = db.collection("meal_menus2");
  const output = {};
  let response = [];
  await docRef.get().then((querySnapshot) => {
    querySnapshot.docs.map(function (documentSnapshot) {
      return (output[documentSnapshot.id] = documentSnapshot.data());
    });
    response = Object.entries(output);

    setIsApiLoaderShowing(false);
  });
  return response;
};

const getAllUomsData = async (setIsApiLoaderShowing) => {
  setIsApiLoaderShowing(true);
  var docRef = db.collection("uoms2");
  const output = {};
  let response = [];
  await docRef
    .limit(500)
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.map(function (documentSnapshot) {
        return (output[documentSnapshot.id] = documentSnapshot.data());
      });
      response = Object.entries(output);
      setIsApiLoaderShowing(false);
    });
  return response;
};
/* NOT USED ANYWHERE */

export default {
  getAllProductsData,
  getProductsData,
  getProductsDataMeals, 
  getProductsGroupsData,
  getFreshMealsData,
  getProductsGroupsDataByIds,
  getFreshMealsArrayData,
  getAllUomsData,
  getProductsDataOrderByDoc,
  getHomeScreenData,
  getProductsDataByPage,
  subscribeToChatAvailability,
  getAppVersions,
  getSubCategoriesByParent,
  getAllProductsDataFromGroup
};
