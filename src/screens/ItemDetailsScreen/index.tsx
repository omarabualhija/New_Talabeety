import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {AppIcon, Constants, Languages} from '../../common';
import {MaterialColors, FontWeights, FontSizes, AppColors} from '../../theme';
import HTML from 'react-native-render-html';
import {ScrollView} from 'react-native-gesture-handler';
import {
  AlertCard,
  AppButton,
  Header,
  OptionCard,
  QuantityButtons,
} from '../../components';
import {Transition, Transitioning} from 'react-native-reanimated';
import {addToCart} from '../../store/actions';
import moment from 'moment';
import ks from '../../services/KSAPI';

const transition = (
  <Transition.Together>
    <Transition.In type="scale" durationMs={100} />
    <Transition.Change />
    <Transition.Out type="scale" durationMs={100} />
  </Transition.Together>
);

const ItemDetailsScreen = (props: any) => {
  const {cart, user} = useSelector(({data}: any) => data);
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [RequestLoading, setRequestLoading] = useState(false);
  const [ShowPrice, setShowPrice] = useState(
    props?.route?.params?.ShowPrice || false,
  );
  const [showImage, setShowImage] = useState(true);

  const animationRef = useRef(null);
  const scrollViewRef = useRef<any>(null);

  const {store, type, item} = props.route.params;
  useEffect(() => {}, []);
  const SaveCart = () => {
    ks.SaveCart({
      userid: user.ID,
      notes: '',
      pID: item.ID,
      qty: quantity,
      UnitPrice: item.Price,
    }).then((data: any) => {
      if (data.success) {
        Alert.alert('', Languages.IsDone, [{text: Languages.OK}]);
        setIsLoadingAdd(false);
      } else {
        console.log('Erorr :  ', JSON.stringify(data.err));
        setIsLoadingAdd(false);
        alert('Erorr');
      }
    });
  };
  const DetailsView = ({value}: any) => {
    return (
      <View style={{backgroundColor: AppColors.white, width: '100%'}}>
        <Text
          style={[
            styles.body,
            {
              ...FontWeights.Bold,
              ...FontSizes.Body,
              color: AppColors.primary,
              margin: 10,
              fontSize: 20,
            },
          ]}>
          {value}
        </Text>
      </View>
    );
  };

  const requestPrice = () => {
    setRequestLoading(true);

    ks.UserShowPriceInsert({
      UserID: user.ID,
      DrugStoreID: item.DrugStoreID,
      ProductID: item.ID,
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
        // if (data.Show == '-10') {
        //   setShowPrice(true);
        // } else
        //   Alert.alert('', Languages.MaxPriceRequest, [{text: Languages.OK}]);
      } else {
        Alert.alert('', Languages.SomethingWentWrong, [{text: Languages.OK}]);
      }
      setRequestLoading(false);
    });
  };

  const itemDetails = () => {
    let arr = [];
    if (type === Constants.STORE_TYPE) {
      arr.push({
        name: Languages.MedicineType,
        data: <DetailsView value={item.TypeName} />,
        onPress: null,
        iconType: 'Fontisto',
        iconName: 'pills',
      });
    }
    arr = arr.concat([
      {
        name: Languages.Provider,
        data: <DetailsView value={item.ProviderName} />,
        onPress: null,
        iconType: 'MaterialCommunityIcons',
        iconName: 'office-building',
      },
      {
        name: Languages.ExpireDate,
        data: (
          <DetailsView value={moment(item.EndDate).format(' MMM - YYYY')} />
        ),
        onPress: null,
        iconType: 'Fontisto',
        iconName: 'date',
      },
      {
        name: Languages.Delivery,
        data: (
          <DetailsView
            value={
              store.DeliveryTime < 60
                ? store.DeliveryTime + ' ' + Languages.Minutes
                : store.DeliveryTime / 60 + ' ' + Languages.Hours
            }
          />
        ),
        onPress: null,
        iconType: 'MaterialCommunityIcons',
        iconName: 'truck-delivery',
      },
      {
        name: Languages.Description,
        data: (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              backgroundColor: AppColors.white,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '90%',
                backgroundColor: AppColors.white,
              }}>
              <HTML source={{html: item.Description}} />
            </View>
          </View>
        ),
        onPress: null,
        iconType: 'MaterialCommunityIcons',
        iconName: 'clipboard-list',
      },
    ]);
    return arr;
  };
  const handleOnAddToCart = () => {
    // if (cart && cart.store && cart.store.ID != store.ID) {
    //   // return Alert.alert('', Languages.CantBuyFromDiffStores, [
    //   //   {text: Languages.Yes},
    //   // ]);
    // }
    // const itemExists =
    //   cart && cart.items.find((_item: any) => _item.ID == item.ID);
    // return Alert.alert('', Languages.ItemAlreadyExists, [
    //   {
    //     text: Languages.Cancel,
    //   },
    //   {
    //     text: Languages.Go,
    //     onPress: () => props.navigation.navigate('CartScreen'),
    //   },
    // ]);
    if (item.Quantity > 0) {
      setIsLoadingAdd(true);
      SaveCart();
    } else {
      setQuantity(1);
      Alert.alert('', Languages.NoAvailableQuantity, [{text: Languages.OK}]);
    }

    // setTimeout(() => {
    //   if (!cart) {
    //     dispatch(
    //       addToCart({
    //         store,
    //         item: {...item, quantity, ShowPrice},
    //       }),
    //     );
    //   } else {
    //     dispatch(
    //       addToCart({
    //         item: {...item, quantity, ShowPrice},
    //       }),
    //     );
    //   }

    //   setIsLoadingAdd(false);
    // }, 100);
  };

  return (
    <>
      <Header {...props} title={Languages.ItemDetails} showBackIcon />
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '100%',
            height: 200,
            borderBottomWidth: 2,
            borderBottomColor: AppColors.grey,
          }}>
          <ImageBackground
            onError={() => setShowImage(false)}
            source={
              item.ImageName
                ? {
                    uri:
                      'http://talabeety.com/content/products/' +
                      item.ImageName +
                      '_1920x1280.jpg',
                  }
                : require('../../assets/images/pills.jpg')
            }
            style={{
              width: '100%',
              height: '100%',
            }}>
            {false && (
              <View style={{position: 'absolute', bottom: 5, right: 0}}>
                <View
                  style={{
                    backgroundColor: AppColors.secondary,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    marginRight: 10,
                    borderRadius: 20,
                  }}>
                  <View>
                    <AppIcon
                      type="Ionicons"
                      name="happy"
                      size={25}
                      color={AppColors.white}
                    />
                  </View>
                  <View>
                    <Text style={styles.statusText}>{Languages.Cameback}</Text>
                  </View>
                </View>
              </View>
            )}
          </ImageBackground>
        </View>

        <View
          style={{
            flexDirection: item.Name.length < 9 ? 'row' : 'column',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: item.Name.length < 9 ? 'center' : 'flex-start',
          }}>
          {!item.IsOfferExpired ? (
            <AlertCard
              cardColor={AppColors.primary}
              iconType={'Ionicons'}
              iconName={'timer'}
              text={Languages.OfferEndsIn.replace(
                '*',
                (+item.DaysToOfferExpire).toFixed(0),
              )}
              cardStyle={item.Name.length > 9 && {alignSelf: 'flex-end'}}
            />
          ) : (
            <View />
          )}
        </View>

        <View
          style={{
            flexDirection: item.Name.length < 9 ? 'row' : 'column',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: item.Name.length < 9 ? 'center' : 'flex-start',
            paddingHorizontal: 10,
          }}>
          <View style={{marginTop: 10}}>
            <Text style={styles.headerContainer}>
              {Languages.ItemName.replace('*', item.Name)}
            </Text>
            <Text style={styles.headerContainer}>
              {Languages.ScienteficName.replace('*', item.ScientificName)}
            </Text>
          </View>
          {/* {!item.IsOfferExpired ? (
            <AlertCard
              cardColor={AppColors.primary}
              iconType={'Ionicons'}
              iconName={'timer'}
              text={Languages.OfferEndsIn.replace(
                '*',
                (+item.DaysToOfferExpire).toFixed(0),
              )}
              cardStyle={item.Name.length > 9 && {alignSelf: 'flex-end'}}
            />
          ) : (
            <View />
          )} */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 80,
            width: '100%',
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}>
          <View style={styles.detailsCard}>
            <View
              style={[
                styles.detailsBG,
                I18nManager.isRTL
                  ? {
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                    }
                  : {
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                    },
              ]}>
              <AppIcon
                type="Ionicons"
                name="pricetag"
                size={25}
                color={AppColors.white}
              />
            </View>
            {ShowPrice ? (
              <View style={styles.detailsText}>
                <Text
                  style={{
                    ...FontWeights.Bold,
                    ...FontSizes.Body,
                    color: AppColors.primary,
                    fontSize: 15,
                  }}>
                  {Languages.ItemPrice.replace('*', item.Price) + '$'}
                </Text>
                {item.OldPrice ? (
                  <Text
                    style={{
                      ...FontWeights.Bold,
                      ...FontSizes.Body,
                      color: AppColors.primary,
                      fontSize: 15,
                    }}>
                    {Languages.OldPrice.replace('*', item.OldPrice) + '$'}
                  </Text>
                ) : null}
              </View>
            ) : (
              <View style={styles.detailsText}>
                <TouchableOpacity
                  onPress={requestPrice}
                  disabled={RequestLoading}
                  style={{
                    backgroundColor: AppColors.primary,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 20,
                    width: 100,
                  }}>
                  {RequestLoading ? (
                    <ActivityIndicator size="small" color={'#fff'} />
                  ) : (
                    <Text
                      style={{
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: AppColors.white,
                        fontSize: 12,
                        textAlign: 'center',
                      }}>
                      {Languages.RequestPrice}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            {!item.IsOfferExpired && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                }}>
                <View
                  style={{
                    width: 0,
                    height: 0,
                    backgroundColor: 'transparent',
                    borderStyle: 'solid',
                    borderRightWidth: 60,
                    borderTopWidth: 60,
                    borderRightColor: 'transparent',
                    borderTopColor: AppColors.primary,
                    transform: I18nManager.isRTL
                      ? [{rotate: '180deg'}]
                      : [{rotate: '90deg'}],
                  }}
                />

                <Text
                  style={{
                    ...FontWeights.Bold,
                    ...FontSizes.Body,
                    color: AppColors.white,
                    fontSize: 16,
                    position: 'absolute',
                    bottom: I18nManager.isRTL ? 5 : 7,
                    right: 5,
                    transform: I18nManager.isRTL
                      ? [{rotateZ: '40deg'}]
                      : [{rotateZ: '-40deg'}],
                  }}>
                  {item.DiscountRate + '%'}
                </Text>
              </View>
            )}
          </View>

          {false && (
            <View
              style={{
                ...styles.detailsCard,
                width: '45%',
              }}>
              <View
                style={[
                  styles.detailsBG,
                  I18nManager.isRTL
                    ? {
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                      }
                    : {
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                      },
                ]}>
                <AppIcon
                  type="Fontisto"
                  name="shopping-store"
                  size={25}
                  color={AppColors.white}
                />
              </View>
              <View style={styles.detailsText}>
                <Text
                  style={{
                    ...FontWeights.Bold,
                    ...FontSizes.Body,
                    color: AppColors.primary,
                    fontSize: 15,
                  }}>
                  {store.Name}
                </Text>
              </View>
            </View>
          )}
        </View>

        {item.MaxQuantity > 0 && (
          <AlertCard
            cardColor={AppColors.red}
            iconType={'AntDesign'}
            iconName={'warning'}
            text={Languages.MaxItems.replace('*', item.MaxQuantity.toString())}
            cardStyle={{marginBottom: 10}}
          />
        )}

        <AlertCard
          cardColor={AppColors.darkGreen}
          iconType={'Ionicons'}
          iconName={'basket-outline'}
          text={item?.IsDozen ? Languages.SoldByDozen : Languages.SoldByItem}
          cardStyle={{marginBottom: 10}}
        />

        {item?.PointItem && (
          <AlertCard
            cardColor={AppColors.darkGreen}
            image={require('../../assets/images/points.png')}
            text={Languages.GetPointsByQuantity.replace(
              '$',
              item?.Points,
            ).replace('&', item?.PointItem)}
            cardStyle={{marginBottom: 10}}
          />
        )}

        {item.BonusEach > 0 && item.BonusValue > 0 && (
          <AlertCard
            cardColor={AppColors.clickableText}
            image={require('../../assets/images/bonus.png')}
            text={Languages.BonusText.replace(
              '*',
              item.BonusValue.toString(),
            ).replace('^', item.BonusEach.toString())}
          />
        )}

        {false && (
          <QuantityButtons
            value={quantity}
            onMinus={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
            onPlus={() => {
              if (item.Quantity > 0) {
                if (quantity < item.Quantity) {
                  setQuantity(quantity + 1);
                }
              } else {
                setQuantity(quantity + 1);
              }
            }}
          />
        )}
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
              if (item.Quantity > 0) {
                if (parseInt(quantity) < parseInt(item.Quantity)) {
                  //  if (quantity < item.MaxQuantity) {
                  setQuantity(quantity + 1);
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
              color={props.isLoading ? AppColors.darkGrey : AppColors.primary}
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
                <ActivityIndicator size={'small'} color={AppColors.primary} />
              </View>
            ) : (
              <View style={{}}>
                <TextInput
                  keyboardType="numeric"
                  value={quantity.toString()}
                  placeholder={quantity.toString()}
                  onChangeText={txt => {
                    if (item.Quantity > 0) {
                      if (parseInt(quantity) < parseInt(item.Quantity)) {
                        setQuantity(parseInt(txt));
                        // setTimeout(() => { handleOnAddToCart}, 1000);
                      } else {
                        setQuantity(1);
                        Alert.alert('', Languages.NoAvailableQuantity, [
                          {text: Languages.OK},
                        ]);
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
                  }}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              if (item.Quantity > 0) {
                if (parseInt(quantity) < parseInt(item.Quantity)) {
                  //  if (quantity < item.MaxQuantity) {
                  setQuantity(quantity - 1);
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
              name={'minuscircle'}
              size={30}
              color={props.isLoading ? AppColors.darkGrey : AppColors.primary}
            />
          </TouchableOpacity>
        </View>

        {item?.Quantity < 1 && (
          <Text style={{fontSize: 22, color: AppColors.red}}>
            {Languages.NoAvailableQuantity}
          </Text>
        )}
        <AppButton
          iconType="MaterialIcons"
          iconName="add-shopping-cart"
          text={Languages.AddtoCart}
          onPress={handleOnAddToCart}
          disabled={isLoadingAdd}
          isLoading={isLoadingAdd}
        />
        <Transitioning.View
          transition={transition}
          ref={animationRef}
          style={styles.container}>
          {itemDetails().map((item, index) => {
            return (
              <OptionCard
                key={index}
                currentIndex={currentIndex}
                index={index}
                setCurrentIndex={(_index: any, property: any) => {
                  setCurrentIndex(_index);
                  if (_index !== null) {
                    scrollViewRef.current.scrollTo({
                      y: property.nativeEvent.pageY + 200,
                      animated: true,
                    });
                  }
                }}
                item={item}
                animationRef={animationRef}
              />
            );
          })}
        </Transitioning.View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MaterialColors.grey[200],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    ...FontWeights.Bold,
    fontSize: 20,
    color: AppColors.primary,
  },
  statusText: {
    ...FontWeights.Bold,
    margin: 10,
    fontSize: 13,
    color: AppColors.white,
  },
  logo: {
    height: 64,
    width: 64,
  },
  heading: {
    ...FontWeights.Light,
    ...FontSizes.SubHeading,
  },
  body: {
    ...FontWeights.Regular,
    color: AppColors.red,
    ...FontSizes.Body,
  },
  item: {
    ...FontWeights.Light,
    ...FontSizes.Body,
    marginTop: 10,
  },
  text: {
    ...FontWeights.Bold,
    ...FontSizes.Body,
    fontSize: 20,
    color: AppColors.white,
  },
  detailsBG: {
    backgroundColor: AppColors.primary,
    width: 60,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },
  detailsText: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
    // width: '60%',
    alignItems: 'flex-start',
  },
  detailsCard: {
    flexDirection: 'row',
    height: '100%',
    width: '50%',
    backgroundColor: AppColors.optionBG,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
});

export default ItemDetailsScreen;
