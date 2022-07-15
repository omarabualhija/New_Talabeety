//@ts-nocheck
import React, {useRef, useState, useEffect, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {AppColors, Fonts, FontSizes, FontWeights} from '../theme';
import {AppIcon, Languages} from '../common';

import {onItemMinus, onItemPlus} from '../store/actions';
import FastImage from 'react-native-fast-image';
import ks from '../services/KSAPI';
import * as Animatable from 'react-native-animatable';

const WIDTH = Dimensions.get('screen').width;

const ItemCard = (props: any) => {
  const item = props.item;
  const store = props.store;
  const type = props.type;

  const [isLoading, setIsLoading] = useState(true);
  const [RequestLoading, setRequestLoading] = useState(false);
  const [loadingQnt, setLoadingQnt] = useState(false);
  const [ShowPrice, setShowPrice] = useState(item?.ShowPrice || false);
  const [isFavorite, setIsFavorite] = useState(item?.IsFavorite || false);

  const [IsShow, setIsShow] = useState(false);
  const [quantity, setQuantity] = React.useState(0);
  const heeartRef = useRef();
  const animateShowPrice = useRef();
  console.log(IsShow);
  const {cart, user} = useSelector(({data}: any) => data);
  useLayoutEffect(() => {
    setIsLoading(true);
    CheckCartProduct();
  }, [props.isFoucse]);

  const CheckCartProduct = () => {
    setLoadingQnt(true);
    ks.CheckCartProduct({
      userid: user.ID,
      pID: item.ID,
    }).then(date => {
      if (date.success) {
        date.qnt == 0 ? setIsShow(false) : setQuantity(date.qnt);
        if (date.Check) {
          setIsShow(date.Check);
          setQuantity(date.qnt);
        }
      } else {
        setIsShow(false);
      }
      setIsLoading(false);
      setLoadingQnt(false);
    });
  };
  const SaveCart = qnt => {
    setIsLoading(true);
    ks.SaveCart({
      userid: user.ID,
      notes: '',
      pID: item.ID,
      qty: qnt,
      UnitPrice: item.Price,
    }).then(data => {
      if (data.success) {
        setIsLoading(false);
        Alert.alert('', Languages.IsDone, [{text: Languages.OK}]);
        getCart();
        CheckCartProduct();
      } else {
        setIsLoading(false);
        alert('Erorr');
      }
    });
  };

  const priceSection = () => {
    return (
      <View>
        {!item.IsOfferExpired ? (
          <View style={{flexDirection: 'row'}}>
            <View style={{}}>
              {item.OldPrice && (
                <Text
                  style={{
                    ...styles.body,
                    color: AppColors.darkGrey,
                    textDecorationLine: 'line-through',
                  }}>
                  {item.OldPrice + Languages.symbolPrice}
                </Text>
              )}
            </View>
            <View style={{marginHorizontal: 10}}>
              <Text style={{...styles.body, color: AppColors.darkGreen}}>
                {item.Price + Languages.symbolPrice}
              </Text>
            </View>
          </View>
        ) : ShowPrice ? (
          <Animatable.Text
            ref={animateShowPrice}
            duration={500}
            style={{...styles.body, color: AppColors.darkGreen}}>
            {item.Price + Languages.symbolPrice}
          </Animatable.Text>
        ) : (
          <View style={{justifyContent: 'center'}}>
            {RequestLoading ? (
              <ActivityIndicator size="small" color={AppColors.primary} />
            ) : (
              <Animatable.View
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <AppIcon
                    type="AntDesign"
                    name={'tags'}
                    size={22}
                    color={AppColors.primary}
                  />
                </View>
                <Text
                  style={{
                    ...styles.body,
                    fontSize: 16,
                    textDecorationLine: 'underline',
                    color: AppColors.primary,
                    marginHorizontal: 5,
                  }}
                  onPress={requestPrice}>
                  {Languages.RequestPrice}
                </Text>
              </Animatable.View>
            )}
          </View>
        )}
      </View>
    );
  };
  const getCart = () => {
    ks.getCart({
      userid: user.ID,
      LangID: Languages.langID,
    }).then((data: any) => {
      // dispatch(getCartItem(data.productsCart))
      filterCart(data.productsCart);
      setdata(data.productsCart);
      setLoading(false);
    });
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
          setTimeout(() => {
            try {
              animateShowPrice.current.swing();
            } catch (error) {}
          }, 150);
        } else
          Alert.alert('', Languages.MaxPriceRequest, [{text: Languages.OK}]);
      } else {
        Alert.alert('', Languages.SomethingWentWrong, [{text: Languages.OK}]);
      }
      setRequestLoading(false);
    });
  };

  const addFavourite = () => {
    ks.AddItemFavourite({
      UserID: user.ID,
      ProductID: item.ID,
    });
  };
  const removeFavourite = () => {
    ks.RemoveItemFavourite({
      UserID: user.ID,
      ProductID: item.ID,
    });
  };

  return (
    <Animatable.View
      animation={props?.animation ? props?.animation : 'zoomIn'}
      useNativeDriver
      key={props.index}
      duration={props?.duration ? props?.duration : 350}
      delay={props?.delay ? props?.delay : 100 + props.index * 50}
      style={styles.cardStyle}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{width: '100%', height: '100%'}}
        onPress={() => {
          props.closeModal && props.closeModal();
          props.navigation.navigate('ItemDetailsScreen', {
            item,
            store,
            type,
            ShowPrice,
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
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
              }}>
              {item?.OldPrice && item?.OldPrice > item?.FormattedPrice && (
                <View
                  style={{
                    position: 'absolute',
                    //  backgroundColor: AppColors.red,
                    top: 50,
                    left: 3,

                    zIndex: 10,
                    // right: 10,
                    // width: Dimensions.get('screen').width * 0.45,
                  }}></View>
              )}
              {IsShow ? (
                <View
                  style={{
                    width: '30%',

                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: AppColors.primary,
                    backgroundColor: AppColors.white,
                    //backgroundColor:'red',
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.Quantity > 0) {
                        if (parseInt(quantity) < parseInt(item.Quantity)) {
                          //  if (quantity < item.MaxQuantity) {
                          setQuantity(quantity + 1);

                          SaveCart(quantity + 1);

                          //  dispatch(onItemPlus(item.ID));
                        }
                      } else {
                        setQuantity(1);

                        Alert.alert('', Languages.NoAvailableQuantity, [
                          {text: Languages.OK},
                        ]);
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
                        {loadingQnt ? (
                          <ActivityIndicator
                            size="small"
                            color={AppColors.primary}
                          />
                        ) : (
                          <TextInput
                            editable={false}
                            keyboardType="numeric"
                            value={quantity.toString()}
                            placeholder={quantity.toString()}
                            placeholderTextColor={'#000'}
                            onChangeText={txt => {
                              if (item.Quantity > 0) {
                                if (
                                  parseInt(quantity) < parseInt(item.Quantity)
                                ) {
                                  setQuantity(parseInt(txt));
                                  SaveCart(txt);
                                } else {
                                  setQuantity(1);
                                  Alert.alert(
                                    '',
                                    Languages.NoAvailableQuantity,
                                    [{text: Languages.OK}],
                                  );
                                }
                              } else {
                                setQuantity(1);
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
                              color: '#000',
                            }}
                          />
                        )}
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (quantity > 1) {
                        //  dispatch(onItemMinus(item.ID));
                        if (item.Quantity > 0) {
                          setQuantity(quantity - 1);

                          SaveCart(quantity - 1);
                        } else {
                          Alert.alert('', Languages.NoAvailableQuantity, [
                            {text: Languages.OK},
                          ]);
                        }
                      } else {
                        Alert.alert('', Languages.NoAvailableQuantity, [
                          {text: Languages.OK},
                        ]);
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
                <TouchableOpacity
                  disabled={isLoading ? true : false}
                  style={[
                    styles.addToCartBtn,
                    isLoading && {backgroundColor: AppColors.darkGrey},
                  ]}
                  onPress={() => {
                    if (item.Quantity > 1) {
                      SaveCart(1);
                    } else {
                      Alert.alert('', Languages.NoAvailableQuantity, [
                        {text: Languages.OK},
                      ]);
                    }
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {isLoading ? (
                      <ActivityIndicator size={25} color={AppColors.primary} />
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
              )}

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.btn}
                onPress={() => {
                  heeartRef.current.bounceIn();
                  setTimeout(() => {
                    isFavorite ? removeFavourite() : addFavourite();
                  }, 100);
                  setIsFavorite(!isFavorite);
                }}>
                <Animatable.View
                  ref={heeartRef}
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
                </Animatable.View>
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
          <Text>
            {Languages.Piece.replace(
              '.',
              item?.BonusEach != undefined ? item?.BonusValue?.toString() : 0,
            ) +
              ' / ' +
              Languages.Bonus.replace(
                '.',
                item?.BonusEach != undefined ? item?.BonusEach.toString() : 0,
              )}
          </Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default ItemCard;

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
