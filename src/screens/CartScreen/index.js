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
  const [DrugActive, setDrugActive] = useState(props.data);
  const [applyPoints, setApplyPoints] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [Step, setStep] = useState(true);
  const [data, setdata] = useState([]);
  const [storePointsInfo, setStorePointsInfo] = useState(null);
  React.useLayoutEffect(() => {
    let f = props.navigation.addListener('focus', () => {
      getInitData();
      return () => f;
    });
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

  const filterCart = Carts => {
    let nData = [];

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

    ks.CartCheckout(obj).then(data => {
      if (data.Success) {
        // dispatch(clearCart());

        // DeleteCartActive();
        // getCart();
        getInitData();
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
    // setStep(true);
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
  //list step 1 Drugs

  ///////////////////////////////////////////////////////////////

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
              props.navigation.navigate('DetailsCartScreen', {
                item: item,
                data: data,
              });
              //  getUserPoints();
              // setDrugActive(item);
              // PriceTotalActive();
              //  setLoading(false);
              //setStep(false);
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
      {Loading && (
        <View
          style={{
            flex: 1,
            backgroundColor: AppColors.grey,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 999,
          }}>
          <ActivityIndicator size="small" color={AppColors.primary} />
        </View>
      )}
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
