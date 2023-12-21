import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./Styles";
import DelayInput from "react-native-debounce-input";
import { Text, Input } from "../../components/";
import { debounce } from "lodash";
import Highlighter from "react-native-highlight-words";
import { appFonts, appColors, appImages } from "../../theme";
import provider from "../../firebase/ProductsProvider";
import ProductDetails from "../ProductDetails";
import moment from "moment-timezone";
import { TIMEZONE } from "../../common/constants";

const { getHomeScreenData, getProductsGroupsData, getProductsData } = provider;
import helpers from "../../helpers";
const { getDefaultDateForFreshMeals, get_thumbnail } = helpers;
import Modal from "react-native-modal";
import AppContext from "../../provider";
import Services from "../../services";
import FastImage from "react-native-fast-image";
import { IMAGE_URL } from "../../services/ApiConstants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { API } = Services;
const { orderDarkGray, accountSettingGray, transparent, white } = appColors;
const { search_ic, close, black_back_ic, del_searchch_ic } = appImages;

const Search = (props) => {
  const { navigation, route } = props;

  const [searchText, setSearchText] = useState("");
  const [homeDataArray, setHomeDataArray] = useState([]);
  const [popularSearch, setPopularSearch] = useState([]);
  const [searchResultProducts, setSearchResultProducts] = useState([]);
  const [searchResultGroups, setSearchResultGroups] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProductObj, setSelectedProductObj] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  // const searchProductsHandler = useCallback(
  //   debounce((quText) => {
  //     searchProducts(quText)
  //   }, 2000),
  //   [],
  // )
  const {
    setIsApiLoaderShowing,
    addToCart
  } = useContext(AppContext);

  const onBackPress = () => {
    if (searchText.trim().length > 0) {
      setSearchText("");
    } else navigation.goBack();
  };

  useEffect(() => {
    if (searchHistory.length > 0) {
      try {
        AsyncStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      } catch (error) {
        console.error(error);
      }
    }
  }, [searchHistory]);

  const deleteAllSearchHistoryItem = () => {
    setSearchHistory([]);
    try {
      AsyncStorage.setItem("searchHistory", JSON.stringify([]));
    } catch (error) {
      console.error(error);
    }
  };
  const updateSearchHistory = (array) => {
    setSearchHistory(array);
    try {
      AsyncStorage.setItem("searchHistory", JSON.stringify(array));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("searchHistory").then((value) => {
      if (value) {
        const localData = JSON.parse(value);
        setSearchHistory(localData);
      }
    });
  }, []);

  const getFreshObjByDate = (arr, time) => {
    let mealsObj = [];

    for (let index = 0; index < arr.length; index++) {
      const strDateFrom = arr[index][1].date_from;
      const strDateTo = arr[index][1].date_to;
      let strDateFromDate = moment(strDateFrom).format("YYYY-MM-DD");

      let strDateToDate = moment(strDateTo).format("YYYY-MM-DD");

      if (time >= strDateFromDate && time <= strDateToDate) {
        mealsObj = arr[index];
      }
    }
    
    if (mealsObj[1] && mealsObj[1].search_groups && mealsObj[1].search_products ) {
      var array = [
        ...mealsObj[1].search_groups,
        ...mealsObj[1].search_products,
      ];
    
    } else {
      var array = [];
    }

    setPopularSearch(array);
  };

  const getData = async () => {
    // Not sure why we get the homescreen data here. Review this
    const selectedDate = moment.tz('Asia/Bangkok').format('YYYY-MM-DD');
    const array = await getHomeScreenData(setIsApiLoaderShowing, selectedDate);
    array.forEach((mealData) => {
      const searchGroups = [];
      const searchProducts = [];
      for (let index = 1; index < 4; index++) {
        const searchGroupId = mealData[1][`search_group${index}_id`];
        const searchGroupText = mealData[1][`search_group${index}_text`];
        searchGroups.push({
          id: String(searchGroupId),
          text: searchGroupText,
        });
        const searchProductId = mealData[1][`search_product${index}_id`];
        const searchProductText = mealData[1][`search_product${index}_text`];
        searchProducts.push({
          id: String(searchProductId),
          text: searchProductText,
        });
      }
      mealData[1].search_groups = searchGroups;
      mealData[1].search_products = searchProducts;
    });
    setHomeDataArray(array);
    const { formattedTomorrow } = getDefaultDateForFreshMeals();
    getFreshObjByDate(array, formattedTomorrow);
  };

  useEffect(() => {
    getData();
  }, []);

  const searchGroups = async (query, products) => {
    // var cond = [
    //   'or',
    //   ['parent_id.name', 'ilike', query],
    //   ['parent_id.parent_id.name', 'ilike', query],
    // ]

    // var fields = [
    //   'name',
    //   'id',
    //   'code',
    //   'description',
    //   'parent_id.id',
    //   'parent_id.name',
    //   'parent_id.code',
    //   'parent_id.description',
    //   'sequence',
    //   'sequence_app',
    //   'items',
    //   'products',
    // ]

    // var res10 = await API.execute(
    //   'product.group',
    //   'search_read_path',
    //   [cond, fields],
    //   {},
    //   setIsApiLoaderShowing,
    // )
    // console.log('res10--', res10)
    // if (Array.isArray(res10)) {
    //   setSearchResultGroups(res10)
    // }

    const filteredCates = global.categoriesArray.filter((x) =>
      (x[1].name.toLowerCase().includes(query.toLowerCase())) && (x[1].name !='Keto Meals') && (x[1].name !='Keto')  && (x[1].name !='Spicy')   && (x[1].name !='Spicy')    && (x[1].name !='Local')    && (x[1].name !='Local Meals')
    );
    setSearchResultGroups(filteredCates);
    //// setting products
    const updateArray = [];

    for (let index = 0; index < products.length; index++) {
      updateArray.push({
        ...products[index],
        quantity: 0,
      });
    }

    setSearchResultProducts(updateArray);
    Keyboard.dismiss();
  };

  // const debouncedFetchData = debounce((searchText) => {
  //   searchProducts(searchText)
  // }, 2000)

  // React.useEffect(() => {
  //   debouncedFetchData(searchText)
  // }, [searchText])

  const searchProducts = async (query) => {
    if (query.length > 0) {
      const quArr = [...searchHistory];

      if (quArr.length >= 5) {
        quArr.pop();
      }

      quArr.unshift({
        id: moment().utcOffset(TIMEZONE).toString(),
        query: query.trim(),
      });

      setSearchHistory(quArr);
      const removeEmmoJiText = query
        .replace(
          /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
          ""
        )
        .trim();
      
      /*
      var cond = [
        [
          "or",
          ["name", "ilike", removeEmmoJiText],
          ["product_origin", "ilike", removeEmmoJiText],
          ["sale_uom_id.name", "ilike", removeEmmoJiText],
        ],
        ["categ_id", "child_of", 326],
        ["active", "=", true],
      ];

      var fields = [
        "image",
        "name",

        "ecom_no_order_unavail",
        "ecom_notif_waiting",

        "stock_qty_avail",
        "old_sale_price",
        "packing_size",

        "sale_price",
        "sale_price_order_uom",
        "sale_invoice_uom_id.name",
        "sale_uom_id.name",
        "sale_tax_id",
        "sale_max_qty",
        "sale_qty_multiple",

        "uom_id",
        "product_origin",

        "is_favorite",

        "categ_id",

        "sold_out",
      ];
      var res10 = await API.execute(
        "product",
        "search_read_path",
        [cond, fields],
        {},
        setIsApiLoaderShowing
      );
      */
      
      
      
      var ctx={
        categ_id: 326,
        group_id: 113
      };
      
      var res_new = await API.execute("ecom2.interface","search_products",[removeEmmoJiText],{context:ctx},setIsApiLoaderShowing);
  
  

      // searchGroups(removeEmmoJiText, res10);
      searchGroups(removeEmmoJiText, res_new);
      
    }
  };

  const popularSearchCell = (obj, i) => {
    if (i > 7) {
      return null;
    }
    return (
      <View style={styles.popularCell} key={i}>
        {/* {obj.img && <Image source={cock_ic} style={styles.cockImg} />} */}
        <TouchableOpacity
          onPress={() => {
            setSearchResultProducts([]);
            setSearchResultGroups([]);
            setSearchText(obj.text.toString());
            searchProducts(obj.text);
          }}
        >
          <Text smallRegular color={accountSettingGray}>
            {obj.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const searchSubmit = () => {
    searchProducts(searchText);
  };
  const renderPopularSearches = () => {
    return (
      <View style={styles.papularMain}>
        <View style={styles.locationRow}>
          <Text smallRegular color={orderDarkGray}>
            Popular searches
          </Text>
        </View>
        <View style={styles.historyContainer}>
          {popularSearch.map((obj, i) => popularSearchCell(obj, i))}
        </View>
      </View>
    );
  };
  const historyCell = (obj) => {
    const regexExp =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
    const isEmmojiText = regexExp.test(obj.query);
    return (
      <View style={styles.historyCell}>
        <TouchableOpacity
          style={[styles.queryText, {}]}
          onPress={() => {
            setSearchResultProducts([]);
            setSearchResultGroups([]);
            setSearchText(obj.query.toString());
            searchProducts(obj.query);
          }}
        >
          <Text
            smallRegular
            color={accountSettingGray}
            style={{
              marginTop: isEmmojiText ? -4 : 0,
            }}
          >
            {obj.query}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 25,
            justifyContent: "center",
            width: 25,
            alignItems: "center",
          }}
          onPress={() => {
            const filteredArray = searchHistory.filter((x) => x.id !== obj.id);

            updateSearchHistory(filteredArray);
            //setSearchHistory(filteredArray)
          }}
        >
          <Image source={close} style={styles.closeImg} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderHistory = () => {
    return (
      <View style={styles.searchMain}>
        <View style={styles.locationRow}>
          <Text smallRegular color={orderDarkGray}>
            Search history
          </Text>
          <TouchableOpacity
            onPress={() => {
              deleteAllSearchHistoryItem();
            }}
          >
            <Image source={del_searchch_ic} style={styles.deleteIc} />
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          {searchHistory.map((obj, i) => {
            return historyCell(obj);
          })}
        </View>
      </View>
    );
  };

  // const changeHandler = (text) => {
  //   if (text.length > 0) {
  //     searchProducts(text)
  //   }
  // }
  // const debouncedChangeHandler = useMemo(
  //   () => debounce(changeHandler, 2000),
  //   [],
  // )

  const renderSearchbar = () => {
    return (
      <View style={styles.searchContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => onBackPress()}
            style={styles.leftBtn}
          >
            <Image
              source={black_back_ic}
              style={styles.backImg}
              resizeMode={"contain"}
            />
          </TouchableOpacity>

          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: white,

              height: 40,
              borderRadius: 4,

              borderWidth: 0.8,
              borderColor: appColors.borderGrey,
              width: '88%',
            }}
          >
            <Image source={search_ic} style={styles.leftIconStyle} />
            {console.log('obj.text--', searchText)}
             <DelayInput
              value={searchText}
              minLength={1}
              onChangeText={(text) => {
                setonChangeSearchText(text)
              }}
              delayTimeout={2000}
              style={{
                height: 40,
                paddingLeft: 10,
                width: '100%',
              }}
            />


          </View> */}

          <Input
            autoCapitalize="none"
            inputViewStyle={styles.inputViewStyle}
            placeholder={" "}
            leftIcon={search_ic}
            leftIconStyle={styles.leftIconStyle}
            placeholderColor={accountSettingGray}
            returnKeyType="search"
            onSubmitEditing={searchSubmit}
            onChangeText={(text) => {
              if (text.length == 1 && text.includes(" ")) {
                setSearchText("");
              } else {
                setSearchText(text);
              }

              setSearchResultProducts([]);
              setSearchResultGroups([]);
            }}
            value={searchText}
            customStyles={{
              container: {
                flex: 1,
              },
            }}
            autoFocus
          />
        </View>
      </View>
    );
  };
  const renderContent = () => {
    return (
      <View style={styles.searchContainer}>
        {renderHistory()}
        {renderPopularSearches()}
      </View>
    );
  };

  const suggestedCategories = (item, index) => {
    const { tabIndex, filtered, heading } = getProductByParentId(item);

    const routeObj = {
      categoriesArray: filtered,
      selectedTab: tabIndex,
      headingTitle: heading,
      parentId: item[1].parent_id,
      parentObj: item,
    };

    return (
      <TouchableOpacity
        style={styles.cateCategory}
        onPress={() => {
          navigation.push("Products", { ...routeObj });
        }}
        key={index}
      >
        <View style={styles.listText}>
          <Text color={accountSettingGray}>
            <Highlighter
              highlightStyle={styles.highlightedText}
              searchWords={[searchText]}
              textToHighlight={item[1].name ? item[1].name : "no"}
            />
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getProductDetails = async (item) => {
    const pIds = [item.id];
    const idsArray = pIds.map(String);
    const data = await getProductsData(idsArray, setIsApiLoaderShowing);

    if (data[0]) {
      const dataObj = data[0];
      setSelectedProductObj({
        ...dataObj,
        quantity: 0,
      });

      setShowDetailsModal(true);
    } else {
      alert("Product not found.");
    }
  };

  const getProductByParentId = (item) => {
    const itemObj = item[1];
    const id = item[0];
    let heading = "";
    let filtered = [];
    if (itemObj.parent_id == "113") {
      filtered = global.categoriesArray.filter((x) => x[1].parent_id == id);
      heading = itemObj.name;
    } else {
      filtered = global.categoriesArray.filter((x) => {
        if (x[0] == itemObj.parent_id) {
          heading = x[1].name;
        }
        return x[1].parent_id == itemObj.parent_id;
      });
    }

    filtered = filtered.sort(function (a, b) {
      return a[1].sequence - b[1].sequence;
    });

    let tabIndex = 0;
    for (let index = 0; index < filtered.length; index++) {
      if (parseInt(filtered[index][0]) == id) {
        tabIndex = index;
        break;
      }
    }
    console.log("filtered--", filtered);
    return { tabIndex, filtered, heading };
  };

  const suggestedProducts = (item, index) => {
    const imageUrl = IMAGE_URL + item.image;
    return (
      <TouchableOpacity
        style={styles.cell}
        onPress={() => {
          getProductDetails(item);
        }}
        key={index}
      >
        {item.image && (
          <FastImage
            style={styles.locationImg}
            source={{ uri: get_thumbnail(imageUrl, 512) }}
          />
        )}
        <View style={styles.listText}>
          <Text color={accountSettingGray}>
            <Highlighter
              highlightStyle={styles.highlightedText}
              searchWords={[searchText]}
              textToHighlight={item.name ? item.name : "no"}
            />
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderList = () => {
    return (
      <View style={styles.orderList}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text smallRegular color={orderDarkGray} style={styles.categoryText}>
            Categories
          </Text>
          <View style={styles.listInnerContainer}>
            {searchResultGroups.map((item, index) =>
              suggestedCategories(item, index)
            )}
          </View>

          <Text smallRegular color={orderDarkGray} style={styles.productText}>
            Products
          </Text>
          <View style={styles.listInnerContainer}>
            {searchResultProducts.map((item, index) =>
              suggestedProducts(item, index)
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.body}>
        {renderSearchbar()}
        {searchText.length == 0 ? renderContent() : renderList()}
      </View>

      <Modal
        style={{ margin: 0 }}
        testID={"modal"}
        swipeDirection={null}
        isVisible={showDetailsModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor={transparent}
        animationInTiming={400}
        animationOutTiming={300}
        backdropTransitionInTiming={1500}
        backdropTransitionOutTiming={1500}
        useNativeDriverForBackdrop
      >
        <ProductDetails
          navigation={navigation}
          productObj={Object.assign({}, selectedProductObj)}
          setShowDetailsModal={setShowDetailsModal}
          addToCart={addToCart}
        />
      </Modal>
    </View>
  );
};

export default Search;
