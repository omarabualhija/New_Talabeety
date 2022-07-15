import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  RefreshControl,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {AppIcon, Languages} from '../../common';
import {AppButton, CartItemCard, Header} from '../../components';
import ks from '../../services/KSAPI';

import {
  MaterialColors,
  FontWeights,
  FontSizes,
  AppColors,
  Fonts,
} from '../../theme';

import {Colors} from 'react-native/Libraries/NewAppScreen';
//let storePointsInfo = undefined;

const CartScreen = props => {
  const {user} = useSelector(({data}) => data);

  const [Drugs, setDrugs] = useState([]);
  const [usedPoints, setUsedPoints] = useState(0);
  const [DrugActive, setDrugActive] = useState([]);
  const [applyPoints, setApplyPoints] = useState(false); // to use points for discount
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [Loading, setLoading] = useState(true);
  const [Step, setStep] = useState(true);
  const [data, setdata] = useState([]);
  const [storePointsInfo, setStorePointsInfo] = useState(null);
  React.useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async () => {
    setLoading(true);
    let data = await ks.getCart({
      userid: user.ID,
      LangID: Languages.langID,
    });

    filterCart(data.productsCart);
    setdata(data.productsCart);

    setLoading(false);
  };
  React.useEffect(() => {
    if (!Step) {
      setLoadingPoints(true);
      const DrugStorePoint = async () => {
        let data2 = await ks.DrugStorePointGet({
          userID: user.ID,
          LangID: Languages.langID,
        });

        if (data2?.Success) {
          setStorePointsInfo(
            data2?.PointList.find(
              item => item.DrugStoreID + '' === DrugActive?.ID + '',
            ),
          );
          setLoadingPoints(false);
        } else {
          setLoadingPoints(false);
          setStorePointsInfo(null);
        }
      };
      DrugStorePoint();
    }
  }, [DrugActive]);
  const getUserPoints = () => {
    ks.DrugStorePointGet({
      userID: user.ID,
      LangID: Languages.langID,
    }).then(data => {
      if (data?.Success) {
        setStorePointsInfo(
          data?.PointList.find(
            item => item.DrugStoreID + '' === DrugActive[0]?.ID + '',
          ),
        );
        console.log(StorePointsInfo);
      }
    });
  };
  //list step 1 Drugs
  const filterCart = Carts => {
    let nData = Drugs;

    Carts.map(item => {
      if (nData.length == 0) {
        nData.push({
          ID: item.DrugStoreID,
          Name: item.DrugStoreName,
        });
      } else {
        if (!nData.find(x => x.ID == item.DrugStoreID)) {
          nData.push({
            ID: item.DrugStoreID,
            Name: item.DrugStoreName,
          });
        }
      }

      setDrugs(nData);
    });
    if (Carts.length < 1) setDrugs([]);
  };
  const PriceTotalActive = () => {
    var sum = 0;

    data.forEach(r => {
      if (r.DrugStoreID == DrugActive.ID) sum = sum + r.Price * r.Quantity;
    });
    return sum.toFixed(2);
  };

  const checkout = DrugSID => {
    setLoading(true);

    let arr = data.map(item => ({
      id: item.ID,
      Qty: item.Quantity,
      notes: item?.notes || ' ',
      DrugStoreID: item.DrugStoreID,
    }));
    arr = arr.filter(x => x.DrugStoreID == DrugSID);

    let obj = {
      uid: user.ID,
      addressid: '2',
      prods: arr,
      langID: Languages.langID,
    };

    if (applyPoints && usedPoints > 0 && usedPoints !== null) {
      //@ts-ignore
      obj.userUsedPoints = [
        {
          points: usedPoints,
          DrugStoreID: DrugActive?.ID,
        },
      ];
    }
    ks.CartCheckout(obj).then(data => {
      console.log(data);
      if (data.Success) {
        // dispatch(clearCart());
        setLoading(false);
        DeleteCartActive();
        getCart();
        // getInitData();
        Alert.alert('', Languages.CartCheckoutSuccessful);
      } else {
        setLoading(false);
        Alert.alert('', Languages.SomethingWentWrong, [{text: Languages.Yes}]);
      }
    });
  };
  const DeleteCartActive = () => {
    data.forEach(r => {
      if (r.DrugStoreID == DrugActive.ID) {
        ks.DeleteCart({
          ID: r.CartID,
        }).then(data => {});
      }
    });
    setLoading(true);
    setStep(true);
    getCart();
  };
  const getCart = () => {
    ks.getCart({
      userid: user.ID,
      LangID: Languages.langID,
    }).then(data => {
      filterCart(data.productsCart);
      setdata(data.productsCart);
      setLoading(false);
    });
  };
  const emptyCart = () => {
    return Alert.alert('', Languages.AreYouSure, [
      {text: Languages.Cancel},
      {
        text: Languages.Yes,
        onPress: () => {
          // dispatch(clearCart());
          DeleteCartActive();
        },
      },
    ]);
  };

  const pointsAdder = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          margin: 7,
        }}>
        <Text
          style={{
            fontFamily: Fonts.Bold,
            fontSize: 16,
            color: AppColors.primary,
          }}>
          {Languages.AmountOfUsedPoints}
        </Text>

        <AppIcon
          color={AppColors.primary}
          size={24}
          name={'pluscircle'}
          type="AntDesign"
          onPress={() => {
            if (storePointsInfo && usedPoints < storePointsInfo.Point) {
              setUsedPoints(usedPoints + 1);
            }
          }}
        />
        <Text
          style={{
            fontFamily: Fonts.Bold,
            fontSize: 16,
            color: AppColors.primary,
            alignSelf: 'flex-start',
            marginHorizontal: 5,
            width: 40,
            textAlign: 'center',
          }}>
          {usedPoints}
        </Text>
        <AppIcon
          color={AppColors.primary}
          size={24}
          name={'minuscircle'}
          type="AntDesign"
          onPress={() => {
            if (usedPoints >= 0) {
              setUsedPoints(usedPoints - 1);
            }
          }}
        />
      </View>
    );
  };

  const cartHeader = () => {
    return (
      <View style={styles.cartHeader}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 3,
            width: '100%',
            zIndex: 20,
          }}>
          {storePointsInfo ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setApplyPoints(!applyPoints);
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <AppIcon
                color={AppColors.primary}
                size={24}
                name={applyPoints ? 'check-box' : 'check-box-outline-blank'}
                type="MaterialIcons"
              />
              <Text
                style={{
                  ...styles.clearCartText,
                  color: 'green',
                  paddingHorizontal: 5,
                }}>
                {Languages.UsePoints}
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-end',
            }}
            activeOpacity={0.5}
            onPress={emptyCart}>
            <Text style={styles.clearCartText}>{Languages.ClearCart}</Text>
            <AppIcon
              type={'MaterialCommunityIcons'}
              name={'trash-can'}
              size={25}
              color={AppColors.red}
            />
          </TouchableOpacity>
        </View>
        {storePointsInfo ? (
          <>
            {applyPoints && pointsAdder()}
            <Text
              style={{
                fontFamily: Fonts.Bold,
                fontSize: 16,
                color: AppColors.primary,
                alignSelf: 'flex-start',
                marginHorizontal: 5,
              }}>
              {Languages.MyPoints.replace('*', storePointsInfo?.Point)}
            </Text>
          </>
        ) : null}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',

            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...styles.heading,
              fontSize: 20,
              alignSelf: 'center',
              marginBottom: 5,
              marginTop: 0,
            }}>
            {DrugActive?.Name &&
              Languages.OrderFrom.replace('*', DrugActive?.Name)}
          </Text>
          <Text
            onPress={() => {
              setStep(!Step);
              setApplyPoints(false);
            }}
            style={{
              ...styles.heading,
              fontSize: 20,
              alignSelf: 'center',
              marginBottom: 5,
              marginTop: 0,
            }}>
            {Languages.Back}
          </Text>
        </View>
      </View>
    );
  };
  const refreshData = () => {
    setStorePointsInfo(null);
    setStep(true);
    getInitData();
  };

  const CartList = (item, index) => {
    return (
      <View
        style={{
          width: '100%',

          marginBottom: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ImageBackground
          source={{
            uri:
              'http:/talabeety.com/Content/drugstore/' +
              item.ID +
              '_1920x1280.jpg',
          }}
          style={{
            width: '100%',
            height: 220,

            alignSelf: 'center',
            backgroundColor: AppColors.primary,
            borderColor: AppColors.primary,
            marginBottom: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: '90%',
              height: 220,

              alignSelf: 'center',

              borderColor: AppColors.primary,
              marginBottom: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              getUserPoints();
              setDrugActive(item);
              PriceTotalActive();
              setLoading(false);
              setStep(false);
            }}>
            <View
              style={{
                width: '100%',
                height: 200,
                borderRadius: 15,
                backgroundColor: AppColors.transparentBlack,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Bold,
                  fontSize: 25,
                  color: AppColors.white,
                  alignSelf: 'flex-start',
                  marginHorizontal: 5,
                  width: '100%',
                  textAlign: 'center',
                }}>
                {' '}
                {item.Name}
              </Text>
              <View
                style={{
                  width: '100%',

                  borderRadius: 15,
                  height: 40,
                }}>
                <TouchableOpacity
                  style={{
                    width: 150,
                    height: 40,
                    borderRadius: 15,
                    top: 50,
                    position: 'absolute',
                    backgroundColor: AppColors.primary,
                    alignSelf: 'center',
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => checkout(item.ID)}>
                  <AppIcon
                    name={'opencart'}
                    type={'FontAwesome'}
                    color={Colors.white}
                    size={20}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.Bold,
                      fontSize: 14,
                      color: AppColors.white,
                      marginHorizontal: 7,
                      textAlign: 'center',
                    }}>
                    {Languages.Checkout}
                  </Text>
                </TouchableOpacity>
                {true && (
                  <Text
                    style={{
                      fontFamily: Fonts.Bold,
                      fontSize: 18,
                      color: AppColors.white,
                      alignSelf: 'flex-start',
                      marginHorizontal: 5,
                      width: '100%',
                      textAlign: 'center',
                    }}>
                    {moment().format('DD/MM/YYYY')}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View
      style={{
        ...styles.container,
        justifyContent: 'center',
        borderWidth: 1,
      }}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,

          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        refreshControl={
          <RefreshControl refreshing={Loading} onRefresh={refreshData} />
        }>
        <Header {...props} title={Languages.Cart} />
        {Drugs.length > 0 ? (
          Step ? (
            <View style={{alignItems: 'center', width: '100%', flex: 1}}>
              <View
                style={{
                  width: '96%',
                  alignSelf: 'center',
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AppIcon
                  name={'opencart'}
                  type={'FontAwesome'}
                  size={30}
                  color={AppColors.primary}
                />
                <Text
                  style={{
                    fontFamily: Fonts.Bold,
                    fontSize: 22,
                    color: AppColors.primary,
                    alignSelf: 'center',
                  }}>
                  {Languages.StoreroomsAdded}
                </Text>
              </View>
              <View
                style={{
                  width: '96%',
                  borderWidth: 1,

                  borderColor: AppColors.primary,
                  alignSelf: 'center',
                  marginTop: 5,
                }}
              />
              <ScrollView
                style={{width: '96%', flex: 1, marginTop: 20}}
                contentContainerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FlatList
                  data={Drugs}
                  keyExtractor={(item, index) => index.toString()}
                  style={{width: '100%', alignSelf: 'center'}}
                  showsVerticalScrollIndicator
                  ListHeaderComponent={<View style={{height: 20}} />}
                  renderItem={({item, index}) => {
                    return CartList(item, index);
                  }}
                />
              </ScrollView>
            </View>
          ) : (
            <View style={{alignItems: 'center', width: '100%', flex: 1}}>
              {loadingPoints && (
                <View
                  style={{
                    position: 'absolute',
                    flex: 1,
                    backgroundColor: '#FFF',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    // backgroundColor: 'red',
                    zIndex: 99999,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size={25} color={AppColors.primary} />
                </View>
              )}
              {cartHeader()}
              <FlatList
                data={data}
                key={data.length}
                // initialScrollIndex={data.length - 1}
                keyExtractor={(item, index) => index.toString()}
                style={{width: '100%', alignSelf: 'center'}}
                showsVerticalScrollIndicator
                ListHeaderComponent={<View style={{height: 20}} />}
                ListFooterComponent={
                  <View>
                    <View>
                      <Text
                        style={[
                          styles.cartInfoText,
                          {marginTop: 10, marginBottom: 0},
                        ]}>
                        {Languages.TotalPrice.replace('*', PriceTotalActive())}
                        {/* {Languages.TotalPrice.replace(
                      '*',
                      cart?.totalPrice?.toFixed(2),
                    )} */}
                      </Text>

                      {user?.Name && (
                        <Text
                          style={[styles.cartInfoText, {marginVertical: 0}]}>
                          {Languages.BuyerName + user?.Name}
                        </Text>
                      )}
                      {user?.UserName2 && (
                        <Text
                          style={[styles.cartInfoText, {marginVertical: 0}]}>
                          {Languages.senderName + user?.UserName2}
                        </Text>
                      )}
                    </View>
                    <View>
                      <AppButton
                        text={Languages.Checkout}
                        extraStyle={{width: '90%'}}
                        onPress={() => {
                          checkout(DrugActive.ID);
                        }}
                      />
                    </View>
                  </View>
                }
                renderItem={({item, index}) => {
                  return (
                    <CartItemCard
                      getCart={() => getCart()}
                      navigation={props.navigation}
                      key={index}
                      item={item}
                      DrugActive={DrugActive}
                    />
                  );
                }}
              />
            </View>
          )
        ) : (
          <View
            style={{
              alignItems: 'center',
              width: '100%',
              flex: 1,
              justifyContent: 'center',
            }}>
            <AppIcon
              name={'opencart'}
              type={'FontAwesome'}
              size={100}
              color={AppColors.primary}
            />
            <RefreshControl refreshing={Loading} onRefresh={refreshData} />
            {!Loading && (
              <Text style={styles.heading}>
                {Languages.ShoppingCartIsEmpty}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    marginLeft: 10,
  },
  logo: {
    height: 64,
    width: 64,
  },
  heading: {
    ...FontWeights.Bold,
    ...FontSizes.SubHeading,
    margin: 20,
    color: AppColors.primary,
  },
  cartInfoText: {
    ...FontWeights.Bold,
    ...FontSizes.Body,
    margin: 20,
    color: AppColors.primary,
  },
  clearCartText: {
    ...FontWeights.Bold,
    color: AppColors.red,
    textAlignVertical: 'center',
    fontSize: 18,
  },
  body: {
    ...FontWeights.Light,
    color: MaterialColors.grey[500],
    ...FontSizes.Body,
  },
  item: {
    ...FontWeights.Light,
    ...FontSizes.Body,
    marginTop: 10,
  },
  cartHeader: {
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: AppColors.optionBG,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
});

export default CartScreen;
