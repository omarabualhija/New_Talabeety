import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  I18nManager,
  Image,
} from 'react-native';
import ks from '../../services/KSAPI';

import {useSelector, useDispatch} from 'react-redux';
import {addToCart} from '../../store/actions';
import {Constants, Languages} from '../../common';
import {FontSizes, AppColors, FontWeights, Fonts} from '../../theme';
import {Header, AppButton} from '../../components';
import moment from 'moment';

const OrderDetails = props => {
  const {user} = useSelector(({data}) => data);
  const dispatch = useDispatch();

  const [orderInfo, setOrderInfo] = useState({});
  const [Loading, setLoading] = useState(true);
  const [LoadingReorder, setLoadingReorder] = useState(false);

  useEffect(() => {
    ks.GetOrderDetails({
      OrderId: props.route.params.OrderID,
      langID: Languages.langID,
    }).then(data => {
      if (data?.Success) {
        setOrderInfo(data.cartOrder);
      }
      setLoading(false);
    });
  }, []);

  const itemsCards = ({item, index}) => {
    return (
      <TouchableOpacity
        disabled
        style={styles.cardsContainer}
        onPress={() =>
          props.navigation.navigate('ItemDetailsScreen', {
            item,
            store: {
              Name: item.DrugStoreName,
              ID: item.DrugStoreID,
              DeliveryTime: '',
            },
            type: Constants.STORE_TYPE,
          })
        }>
        <View
          style={{
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
              width: '100%',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0',
            }}>
            <Text
              style={[styles.body, {flex: 1, textAlign: 'left', fontSize: 18}]}
              numberOfLines={2}>
              {item.Name}
            </Text>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 10,
                borderColor: '#ddd',
                borderWidth: 1,
                overflow: 'hidden',
              }}>
              <Image
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
                }}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={{...styles.body, color: AppColors.primary}}>
            {Languages.Quantity.replace('*', item.Quantity)}
          </Text>

          <Text style={styles.body}>
            {Languages.SingleItemPrice.replace(
              '*',
              item?.UnitPrice?.toFixed(2) + Languages.symbolPrice,
            )}
          </Text>

          <Text style={{...styles.body, color: 'green'}}>
            {Languages.SingleItemTotalPrice.replace(
              '*',
              (item.UnitPrice * item.Quantity)?.toFixed(2) +
                Languages.symbolPrice,
            )}
          </Text>

          {item.Notes ? (
            <Text
              style={{
                color: '#000',
                fontSize: 15,
              }}>
              {Languages.Note + ': ' + item.Notes}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  // const reorderItems = () => {
  //   setLoadingReorder(true);
  //   let arr = orderInfo.Items.map(item => ({
  //     quantity: item.Quantity,
  //     notes: item.Notes,
  //     DrugStoreID: item.DrugStoreID,
  //     Price: item.UnitPrice,
  //     ...item,
  //   }));
  //   arr.forEach(item =>
  //     dispatch(
  //       addToCart({
  //         store: {
  //           Name: item.DrugStoreName,
  //           ID: item.DrugStoreID,
  //           DeliveryTime: '',
  //         },
  //         item,
  //       }),
  //     ),
  //   );
  //   setLoadingReorder(false);

  //   // ks.CartCheckout({
  //   //   uid: user.ID,
  //   //   addressid: '2',
  //   //   prods: arr,
  //   //   langID: Languages.langID,
  //   // }).then((data) => {
  //   //   if (data.Success) {
  //   //     Alert.alert('', Languages.ReorderedSuccessfully);
  //   //   } else {
  //   //     Alert.alert('', Languages.SomethingWentWrong, [{text: Languages.OK}]);
  //   //   }
  //   // });
  // };

  const reorderItems = () => {
    console.log(orderInfo.Items);
    orderInfo.Items.map(item => {
      setLoading(true);
      ks.SaveCart({
        userid: user.ID,
        notes: '',
        pID: item.ID,
        qty: item.Quantity,
        UnitPrice: item.UnitPrice,
      }).then(data => {
        console.log(data);
      });
    });

    setLoading(false);
  };

  const cancelOrder = () => {
    let da = {
      UserID: user.ID,
      OrderID: orderInfo.OrderID,
      Cancelreason: '',
    };
    console.log(da);

    ks.CancelOrder(da).then(data => {
      console.log(data);
      if (data.Success) {
        Alert.alert('', Languages.OrderCanceled);
        props.navigation.goBack();
      } else {
        Alert.alert('', Languages.SomethingWentWrong, [{text: Languages.OK}]);
      }
    });
  };

  const orderStatusDots = () => {
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
          }}>
          <View
            style={[
              styles.dots,
              {
                backgroundColor:
                  orderInfo?.Status === Constants.ORDER_STATUSES.New ||
                  orderInfo?.Status === Constants.ORDER_STATUSES.Complete ||
                  orderInfo?.Status === Constants.ORDER_STATUSES.Pending
                    ? AppColors.lightGreen
                    : 'gray',
              },
            ]}
          />

          <View
            style={[
              styles.line,
              {
                backgroundColor:
                  orderInfo?.Status === Constants.ORDER_STATUSES.Complete ||
                  orderInfo?.Status === Constants.ORDER_STATUSES.Paid
                    ? AppColors.lightGreen
                    : 'gray',
              },
            ]}
          />

          <View
            style={[
              styles.line,
              {
                backgroundColor:
                  orderInfo?.Status === Constants.ORDER_STATUSES.Complete
                    ? AppColors.lightGreen
                    : 'gray',
              },
            ]}
          />

          <View
            style={[
              styles.dots,
              {
                backgroundColor:
                  orderInfo?.Status === Constants.ORDER_STATUSES.Complete
                    ? AppColors.lightGreen
                    : 'gray',
              },
            ]}
          />

          <View
            style={[
              styles.line,
              {
                backgroundColor:
                  orderInfo?.Status === Constants.ORDER_STATUSES.Complete ||
                  orderInfo?.Status === Constants.ORDER_STATUSES.Paid
                    ? AppColors.lightGreen
                    : 'gray',
              },
            ]}
          />

          <View
            style={[
              styles.line,
              {
                backgroundColor:
                  orderInfo?.Status === Constants.ORDER_STATUSES.Complete ||
                  orderInfo?.Status === Constants.ORDER_STATUSES.Paid
                    ? AppColors.lightGreen
                    : 'gray',
              },
            ]}
          />

          <View
            style={[
              styles.dots,
              {
                backgroundColor:
                  orderInfo?.Status == Constants.ORDER_STATUSES.Complete
                    ? AppColors.lightGreen
                    : 'gray',
              },
            ]}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '80%',
            alignItems: 'center',
          }}>
          <Text style={styles.statusText}>{Languages.Preparing}</Text>
          <Text style={styles.statusText}>{Languages.completed}</Text>
          <Text style={styles.statusText}>{Languages.Finished}</Text>
        </View>
      </View>
    );
  };

  const calculateOrderStatus = () => {
    if (orderInfo?.Status === Constants.ORDER_STATUSES.Complete) {
      return Languages.Finished;
    } else if (
      orderInfo?.Status === Constants.ORDER_STATUSES.New ||
      orderInfo?.Status === Constants.ORDER_STATUSES.Pending
    ) {
      return Languages.Preparing;
    }
  };

  return (
    <View style={{width: '100%', flex: 1}}>
      <Header
        title={orderInfo?.MerchantName}
        showBackIcon
        navigation={props.navigation}
        extraStyle={{height: 65, paddingTop: 15}}
      />

      {Loading ? (
        <View
          style={{
            width: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="small" color={AppColors.primary} />
        </View>
      ) : (
        <View style={{width: '100%', flex: 1}}>
          <Text
            style={{
              alignSelf: 'center',
              marginTop: 10,
              fontSize: 20,
              color: AppColors.primary,
            }}>
            {Languages.OrderInfo}
          </Text>

          {orderStatusDots()}
          <Text
            style={{
              ...FontSizes.Body,
              color: AppColors.primary,
              padding: 10,
            }}>
            {Languages.OrderNum}
            {props.route.params.OrderID + ' # '}
          </Text>
          <Text
            style={{
              ...FontSizes.Body,
              color: AppColors.primary,
              padding: 10,
            }}>
            {Languages.OrderOmnerName}
            {orderInfo.OwnerName}
          </Text>
          <Text
            style={{
              ...FontSizes.Body,
              color: AppColors.primary,
              padding: 10,
            }}>
            {Languages.usedPoints} :{' '}
            {orderInfo.UsedPoints != '' ? orderInfo.UsedPoints : 0}
          </Text>
          <Text
            style={{
              ...FontSizes.Body,
              color: AppColors.primary,
              padding: 10,
            }}>
            {Languages.OrderDate}
            {moment(orderInfo.OrderDate).format(
              'dddd, MMMM Do YYYY, h:mm:ss a',
            )}
          </Text>
          <Text
            style={{
              ...FontSizes.Body,
              color: AppColors.primary,
              paddingHorizontal: 10,
              paddingBottom: 5,
            }}>
            {Languages.OrderInfo}:{' '}
            <Text style={{color: AppColors.darkGreen}}>
              {calculateOrderStatus()}
            </Text>
          </Text>

          <View
            style={{
              width: '94%',
              height: 1,
              backgroundColor: '#ccc',
              alignSelf: 'center',
            }}
          />

          <FlatList
            style={{width: '100%', flex: 1}}
            contentContainerStyle={{paddingTop: 15}}
            data={orderInfo.Items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={itemsCards}
          />

          <View style={styles.orderTotalContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 22,
                  color: AppColors.primary,
                  marginHorizontal: 10,
                }}>
                {Languages.OrderTotal}
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  color: AppColors.primary,
                  marginHorizontal: 10,
                }}>
                {orderInfo?.OrderTotal + Languages.symbolPrice}
              </Text>
            </View>

            <View
              style={{
                position: 'absolute',
                width: Dimensions.get('screen').width,
                bottom: -10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 5,
              }}>
              <AppButton
                text={Languages.Reorder}
                textStyle={{...FontSizes.Body}}
                onPress={() =>
                  Alert.alert(Languages.Reorder, Languages.SureToReorder, [
                    {text: Languages.No},
                    {text: Languages.Yes, onPress: () => reorderItems()},
                  ])
                }
                extraStyle={{
                  height: 40,
                  flex: 1,
                  marginHorizontal: 5,
                }}
              />

              {(orderInfo?.Status === Constants.ORDER_STATUSES.New ||
                orderInfo?.Status === Constants.ORDER_STATUSES.Pending) && (
                <AppButton
                  text={Languages.CancelOrder}
                  textStyle={{...FontSizes.Body}}
                  onPress={() =>
                    Alert.alert(
                      Languages.CancelOrder,
                      Languages.SureToCancelOrder,
                      [
                        {text: Languages.No},
                        {text: Languages.Yes, onPress: cancelOrder},
                      ],
                    )
                  }
                  extraStyle={{
                    height: 40,
                    flex: 1,
                    backgroundColor: AppColors.red,
                    marginHorizontal: 5,
                  }}
                />
              )}
            </View>
          </View>
        </View>
      )}

      {LoadingReorder && (
        <View
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0, 0.3)',
            position: 'absolute',
            zIndex: 99,
          }}>
          <ActivityIndicator size={'small'} color={AppColors.primary} />
        </View>
      )}
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  orderTotalContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#fff',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  dots1: {
    width: 15,
    height: 15,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'gray',
  },
  dots: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'gray',
  },
  line: {
    width: Dimensions.get('screen').width / 6,
    height: 3,
    backgroundColor: 'gray',
  },
  statusText: {
    color: AppColors.primary,
    fontSize: 15,
  },
  cardsContainer: {
    alignSelf: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.primary,
    paddingHorizontal: 10,
    paddingBottom: 7,
  },
  title: {
    fontSize: 22,
    color: AppColors.white,
    fontFamily: Fonts.Medium,
  },
  body: {
    ...FontWeights.Bold,
    color: AppColors.primary,
    ...FontSizes.Body,
  },
  noteInput: {
    width: '96%',
    height: '50%',
    borderWidth: 1,
    borderColor: '#bbb',
    textAlignVertical: 'top',
    borderRadius: 15,
    paddingHorizontal: 7,
    color: AppColors.primary,
  },
});
