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
  TextInput,
} from 'react-native';
import {
  MaterialColors,
  FontWeights,
  FontSizes,
  AppColors,
  Fonts,
} from '../../theme';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {AppIcon, Languages} from '../../common';
import {AppButton, CartItemCard, Header} from '../../components';
import ks from '../../services/KSAPI';

const DetailsCartScreen = props => {
  const [usedPoints, setUsedPoints] = useState(1);
  const [applyPoints, setApplyPoints] = useState(false); // to use points for discount
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [storePointsInfo, setStorePointsInfo] = useState(null);
  const [DrugActive, setDrugActive] = useState(props.route.params.item);
  const [data, setdata] = useState(props.route.params.data);
  const {user} = useSelector(({data}) => data);
  const [Drugs, setDrugs] = useState([]);
  React.useEffect(() => {
    const DrugStorePoint = async () => {
      let data1 = await ks.DrugStoreGet({
        langID: Languages.langID,
        ID: props.route.params.item.ID,
        // AreaID: city.ID,
        userID: user.ID,
      });
      if (data1.Success) {
        setDrugActive(data1.DrugStores[0]);
      } else {
      }

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
  }, []);
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
        <TextInput
          style={{textAlign: 'center'}}
          keyboardType="numeric"
          value={usedPoints.toString()}
          onChangeText={t => {
            if (storePointsInfo && t < storePointsInfo.Point) {
              setUsedPoints(t);
            } else {
              if (t < 0) {
                setUsedPoints(1);
              } else {
                if (t == '') {
                  setUsedPoints(1);
                }
                setUsedPoints(storePointsInfo.Point);
              }
            }
          }}
        />
        {/* <Text
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
        </Text> */}
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

  const PriceTotalActive = () => {
    var sum = 0;

    data.forEach(r => {
      if (r.DrugStoreID == DrugActive.ID) sum = sum + r.Price * r.Quantity;
    });
    return sum.toFixed(2);
  };

  const checkout = DrugSID => {
    setLoadingPoints(true);

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

    console.log(applyPoints && usedPoints > 0 && usedPoints !== null);
    if (applyPoints && usedPoints > 0 && usedPoints !== null) {
      if (usedPoints >= DrugActive.MinPointReplacement) {
        obj.userUsedPoints = [
          {
            points: usedPoints,
            DrugStoreID: DrugActive?.ID,
          },
        ];

        check(obj);
      } else {
        Alert.alert(
          '',
          Languages.minPoint.replace('&&', DrugActive.MinPointReplacement),
          [
            {
              text: Languages.OK,
              onPress: () => check(obj),
            },
            {
              text: Languages.Cancel,
              onPress: () => setLoadingPoints(false),
            },
          ],
        );
      }
    } else {
      check(obj);
    }
  };

  let check = obj => {
    ks.CartCheckout(obj).then(data => {
      console.log(data);
      if (data.Success) {
        if (data.DeletSuccess == '1') {
          setLoadingPoints(false);
          Alert.alert('', Languages.CartCheckoutSuccessful, [
            {
              text: Languages.OK,
              onPress: () => props.navigation.goBack(),
            },
          ]);
        } else {
        }
        //DeleteCartActive;
      } else {
        setLoadingPoints(false);
        Alert.alert('', Languages.SomethingWentWrong, [{text: Languages.Yes}]);
      }
    });
  };
  const DeleteCartActive = async () => {
    data.forEach(async r => {
      if (r.DrugStoreID == DrugActive.ID) {
        let data = await ks.DeleteCart({
          ID: r.CartID,
        });
        setLoadingPoints(false);
        props.navigation.navigate('HomeScreen');
      }
    });
  };
  const getCart = () => {
    ks.getCart({
      userid: user.ID,
      LangID: Languages.langID,
    }).then(data => {
      filterCart(data.productsCart);
      setdata(data.productsCart);
    });
  };

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
          {storePointsInfo && storePointsInfo?.Point > 0 ? (
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
  return (
    <View style={{alignItems: 'center', width: '100%', flex: 1}}>
      <Header {...props} title={Languages.Cart} showBackIcon />
      {!loadingPoints && cartHeader()}
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
                style={[styles.cartInfoText, {marginTop: 10, marginBottom: 0}]}>
                {Languages.TotalPrice.replace('*', PriceTotalActive())}
                {/* {Languages.TotalPrice.replace(
            '*',
            cart?.totalPrice?.toFixed(2),
          )} */}
              </Text>

              {user?.Name && (
                <Text style={[styles.cartInfoText, {marginVertical: 0}]}>
                  {Languages.BuyerName + user?.Name}
                </Text>
              )}
              {user?.UserName2 && (
                <Text style={[styles.cartInfoText, {marginVertical: 0}]}>
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
  );
};

export default DetailsCartScreen;

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
