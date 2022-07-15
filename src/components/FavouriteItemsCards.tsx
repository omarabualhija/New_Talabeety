//@ts-nocheck
import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {AppColors, Fonts, FontSizes, FontWeights} from '../theme';
import {AppIcon, Constants, Languages} from '../common';
import {QuantityButtons} from '.';
import {
  addToCart,
  onItemMinus,
  onItemInput,
  onItemPlus,
} from '../store/actions';
import FastImage from 'react-native-fast-image';
import ks from '../services/KSAPI';
import * as Animatable from 'react-native-animatable';

const WIDTH = Dimensions.get('screen').width;

const FavouriteItemsCards = (props: any) => {
  const {cart, user} = useSelector(({data}: any) => data);
  const dispatch = useDispatch();
  const item = props.item;
  let store = props.store;
  const type = props.type;
  const [quantity, setQuantity] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [RequestLoading, setRequestLoading] = React.useState(false);
  const [ShowPrice, setShowPrice] = React.useState(item?.ShowPrice || false);
  const [isFavorite, setIsFavorite] = React.useState(true);
  const [storeInfo, setStoreInfo] = React.useState({
    ID: '',
    Name: '',
    DeliveryTime: '',
  });

  const containerRef = useRef();

  useEffect(() => {
    ks.DrugStoreGet({
      langID: Languages.langID,
      ID: item.DrugStoreID,
      userID: user.ID,
    }).then((data: any) => {
      if (data?.Success && data?.DrugStores.length > 0) {
        setStoreInfo(data.DrugStores[0]);
      }
    });
  }, []);

  const onPlus = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(onItemPlus(item.ID));
      setIsLoading(false);
    }, 100);
  };
  const input = txt => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(onItemInput(item.ID, txt));
      setIsLoading(false);
    }, 100);
  };
  const onMinus = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(onItemMinus(item.ID));
      setIsLoading(false);
    }, 100);
  };

  const handleOnAddToCart = () => {
    if (cart && cart.store && cart.store.ID !== store.ID) {
      // return Alert.alert('', Languages.CantBuyFromDiffStores, [
      //   {text: Languages.Yes},
      // ]);
    }
    const itemExists =
      cart && cart.items.find((_item: any) => _item.ID === item.ID);
    if (itemExists) {
      return Alert.alert('', Languages.ItemAlreadyExists, [
        {
          text: Languages.Cancel,
        },
        {
          text: Languages.Go,
          onPress: () => props.navigation.navigate('CartScreen'),
        },
      ]);
    }
    setIsLoading(true);
    setTimeout(() => {
      if (!cart) {
        dispatch(
          addToCart({
            store,
            item: {...item, quantity: quantity},
          }),
        );
      } else {
        dispatch(
          addToCart({
            item: {...item, quantity: quantity},
          }),
        );
      }

      setIsLoading(false);
    }, 100);
  };
  const itemExists = cart
    ? cart.items.find((_item: any) => _item.ID === item.ID)
    : false;

  const priceSection = () => {
    return (
      <View>
        {!item.IsOfferExpired ? (
          <View style={{flexDirection: 'row'}}>
            <View>
              {item.OldPrice && (
                <Text
                  style={{
                    ...styles.body,
                    color: AppColors.darkGrey,
                    textDecorationLine: 'line-through',
                  }}>
                  {item.OldPrice + ' ID '}
                </Text>
              )}
            </View>
            <View style={{marginHorizontal: 10}}>
              <Text style={{...styles.body, color: AppColors.darkGreen}}>
                {item.Price + Languages.symbolPrice}
              </Text>
            </View>
          </View>
        ) : ShowPrice === true ? (
          <Text style={{...styles.body, color: AppColors.darkGreen}}>
            {item.Price + ' ID '}
          </Text>
        ) : (
          <View style={{justifyContent: 'center'}}>
            {RequestLoading ? (
              <ActivityIndicator size="small" color={AppColors.primary} />
            ) : (
              <Text
                style={{
                  ...styles.body,
                  fontSize: 16,
                  textDecorationLine: 'underline',
                  color: AppColors.primary,
                }}
                onPress={requestPrice}>
                {Languages.RequestPrice}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const requestPrice = () => {
    setRequestLoading(true);

    ks.UserShowPriceInsert({
      UserID: user.ID,
      DrugStoreID: props.item.DrugStoreID,
      ProductID: props.item.ID,
    }).then((data: any) => {
      if (data?.Success) {
        if (data.Show.toString() != '0') {
          setShowPrice(true);
          Alert.alert(
            '',
            Languages.CountShowPrice + ' ' + data.Show.toString(),
            [{text: Languages.OK}],
          );
        } else
          Alert.alert('', Languages.MaxPriceRequest, [{text: Languages.OK}]);
        // data.Show === true
        //   ? setShowPrice(true)
        //   : Alert.alert('', Languages.MaxPriceRequest, [{text: Languages.OK}]);
      } else {
        Alert.alert('', Languages.SomethingWentWrong, [{text: Languages.OK}]);
      }
      setRequestLoading(false);
    });
  };

  const removeFavourite = () => {
    ks.RemoveItemFavourite({
      UserID: user.ID,
      ProductID: item.ID,
    });
    containerRef.current.zoomOut();
    props?.reloadList && props.reloadList();
  };

  return (
    <Animatable.View
      ref={containerRef}
      animation={props?.animation ? props?.animation : 'zoomIn'}
      useNativeDriver
      duration={props?.duration ? props?.duration : 350}
      delay={props?.delay ? props?.delay : 100 + props.index * 50}
      style={styles.cardStyle}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{width: '100%', height: '100%'}}
        disabled={storeInfo?.ID ? false : true}
        onPress={() => {
          props.closeModal && props.closeModal();
          props.navigation.navigate('ItemDetailsScreen', {
            item,
            store: storeInfo,
            type,
          });
        }}>
        <View
          style={{
            height: '80%',
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <FastImage
            source={
              item.ImageName
                ? {
                    uri:
                      'http://talabeety.com/content/products/' +
                      item.ImageName +
                      '_1920x1280.jpg',
                  }
                : require('../assets/images/pills.jpg')
            }
            style={{
              height: '100%',
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'center',
              position: 'absolute',
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              backgroundColor: AppColors.transparentBlack,
            }}>
            <View
              style={{
                width: '96%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                //   backgroundColor:'red',
                position: 'absolute',
                bottom: 5,
                left: 5,
              }}>
              <Text style={{color: AppColors.white, fontSize: 20}}>
                {item.Name}
              </Text>
              {item?.DrugStoreName && (
                <Text style={{color: AppColors.white, fontSize: 20}}>
                  {item?.DrugStoreName}
                </Text>
              )}
            </View>
            {false && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 5,
                  left: 5,
                }}>
                <Text style={{color: AppColors.white, fontSize: 20}}>
                  {item.Name}
                </Text>
              </View>
            )}
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
              }}>
              {props.showCartBtn ? (
                <View
                  style={{
                    width: '100%',
                    //backgroundColor:'red',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.MaxQuantity > 0) {
                        if (parseInt(quantity) < parseInt(item.MaxQuantity)) {
                          setQuantity(quantity);

                          dispatch(
                            addToCart({
                              store,
                              item: {...item, quantity: quantity, ShowPrice},
                            }),
                          );
                        }
                      } else {
                        setQuantity(item.MaxQuantity);
                      }
                    }}
                    disabled={props.isLoading}>
                    <AppIcon
                      type={'AntDesign'}
                      name={'pluscircle'}
                      size={30}
                      color={
                        props.isLoading ? AppColors.darkGrey : AppColors.primary
                      }
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: AppColors.primary,
                      backgroundColor: AppColors.white,
                      width: 50,
                      height: 45,
                      justifyContent: 'center',
                    }}>
                    {props.isLoading ? (
                      <View style={{}}>
                        <ActivityIndicator
                          size={'small'}
                          color={AppColors.primary}
                        />
                      </View>
                    ) : (
                      <View style={{}}>
                        <TextInput
                          keyboardType="numeric"
                          value={quantity.toString()}
                          placeholder={quantity.toString()}
                          onChangeText={txt => {
                            if (item.MaxQuantity > 0) {
                              if (
                                parseInt(quantity) < parseInt(item.MaxQuantity)
                              ) {
                                setQuantity(parseInt(txt));
                              } else {
                                setQuantity(quantity);
                                Alert.alert('', Languages.NoAvailableQuantity, [
                                  {text: Languages.OK},
                                ]);
                              }
                            } else {
                              setQuantity(quantity);
                              Alert.alert('', Languages.NoAvailableQuantity, [
                                {text: Languages.OK},
                              ]);
                            }
                          }}
                          numberOfLines={1}
                          maxLength={3}
                          textAlign="center"
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 17,
                            borderColor: AppColors.primary,
                          }}
                        />
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (quantity > 1) {
                        setQuantity(quantity - 1);
                      }
                    }}
                    disabled={props.isLoading}>
                    <AppIcon
                      type={'AntDesign'}
                      name={'minuscircle'}
                      size={30}
                      color={
                        props.isLoading ? AppColors.darkGrey : AppColors.primary
                      }
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                props.showCartBtn && (
                  <TouchableOpacity
                    disabled={isLoading ? true : false}
                    style={[
                      styles.addToCartBtn,
                      isLoading && {backgroundColor: AppColors.darkGrey},
                    ]}
                    onPress={handleOnAddToCart}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {isLoading ? (
                        <ActivityIndicator
                          size={25}
                          color={AppColors.primary}
                        />
                      ) : (
                        <AppIcon
                          type="MaterialIcons"
                          name="add-shopping-cart"
                          size={25}
                          color={AppColors.primary}
                        />
                      )}

                      <Text style={{color: AppColors.primary, marginLeft: 5}}>
                        {Languages.AddtoCart}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              )}

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.btn}
                onPress={() => {
                  removeFavourite();
                  setIsFavorite(false);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <AppIcon
                    type="AntDesign"
                    name={isFavorite ? 'heart' : 'hearto'}
                    size={22}
                    color={AppColors.red}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: AppColors.white,
            width: '100%',
            height: '20%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          {priceSection()}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: 70,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    backgroundColor: AppColors.primary,
    paddingBottom: 5,
  },
  title: {
    fontSize: 22,
    color: AppColors.white,
    fontFamily: Fonts.Medium,
  },
  cardStyle: {
    height: 195,
    width: Dimensions.get('screen').width * 0.9,
    backgroundColor: AppColors.grey,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    zIndex: 7,
    elevation: 7,
  },
  body: {
    ...FontWeights.Bold,
    color: AppColors.black,
    ...FontSizes.Body,
  },
  addToCartBtn: {
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,

    elevation: 5,
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 7,
    margin: 10,
    width: '45%',
    alignSelf: 'flex-end',
  },
  btn: {
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 7,
    margin: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    top: 0,
    position: 'absolute',
  },
});

export default FavouriteItemsCards;
