//@ts-nocheck
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
  StatusBar,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {AppIcon, Constants, Languages} from '../../common';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modalbox';
import Swiper from 'react-native-swiper';
import ks from '../../services/KSAPI';
import {useSelector, useDispatch} from 'react-redux';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {saveCity} from '../../store/actions';
import messaging from '@react-native-firebase/messaging';
import {MaterialColors, FontWeights, FontSizes, AppColors} from '../../theme';
import {
  StoreCard,
  Header,
  SearchButton,
  GoToButton,
  AppButton,
  FavouriteItemsCards,
} from '../../components';
import moment from 'moment';

let NotificationsCount = 0;

const HomeScreen = (props: any) => {
  const {city, cities, user} = useSelector(({data}: any) => data);
  const {cartUser} = useSelector(({data}: any) => data);

  const dispatch = useDispatch();

  const pointsPopup = useRef();
  const favouritesPopup = useRef();
  const notificationsPopup = useRef();
  const ordersPopup = useRef();

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [NotificationsList, setNotificationsList] = useState([]);
  const [userPoints, setUserPoints] = useState([]);
  const [stores, setStores] = useState([]);
  const [medicalSupplies, setMedicalSupplies] = useState([]);
  const [userStores, setUserStores] = useState([]);
  const [userSupplies, setUserSupplies] = useState([]);
  const [banners, setBanners] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [quickAccessButtons, setQuickAccessButtons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFavourites, setLoadingFavourites] = useState(true);
  const [FavouritesList, setFavouritesList] = useState([]);
  const [routes] = useState([
    {key: 'first', title: Languages.Stores},
    {key: 'second', title: Languages.MedicalSupplies},
  ]);

  const pointsModal = () => {
    return (
      <Modal
        ref={pointsPopup}
        swipeToClose={false}
        onOpened={getUserPoints}
        backButtonClose
        useNativeDriver
        coverScreen
        style={styles.modals}>
        <View
          style={{
            width: '100%',
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <Text
            style={{
              fontSize: 26,
              color: AppColors.primary,
              alignSelf: 'center',
            }}>
            {Languages.Points}
          </Text>

          <AppIcon
            name="infocirlceo"
            type="AntDesign"
            color={'green'}
            size={24}
            style={{position: 'absolute', top: 0, left: 0, margin: 15}}
            onPress={() =>
              Alert.alert('', Languages.ReplacePointsMessage, [
                {text: Languages.OK},
              ])
            }
          />

          <FlatList
            data={userPoints}
            style={{width: '100%', flex: 1, marginTop: 25}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View
                style={{
                  width: '100%',
                  height: 50,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                  alignSelf: 'center',
                  borderTopWidth: 0,
                  borderBottomWidth: 1,
                  borderColor: '#bbb',
                }}>
                <Text style={{fontSize: 18, color: '#111'}}>
                  {item.DrugStoreName}
                </Text>
                <Text style={{fontSize: 18, color: '#111'}}>{item.Point}</Text>
              </View>
            )}
          />
          <AppButton
            onPress={() => pointsPopup.current.close()}
            isLoading={false}
            text={Languages.close}
            extraStyle={{marginBottom: 0, width: '92%'}}
          />
          {/* extraStyle={{position:'absolute', bottom:0, alignSelf: 'center'}} */}
        </View>
      </Modal>
    );
  };

  const favouritesModal = () => {
    return (
      <Modal
        ref={favouritesPopup}
        swipeToClose={false}
        backButtonClose
        onOpened={getUserFavourites}
        onClosed={() => {
          setFavouritesList([]);
          setLoadingFavourites(true);
        }}
        useNativeDriver
        coverScreen
        style={styles.modals}>
        <View
          style={{
            width: '100%',
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <Text
            style={{
              fontSize: 26,
              color: AppColors.primary,
              alignSelf: 'center',
              marginBottom: 20,
            }}>
            {Languages.Favourites}
          </Text>

          {loadingFavourites ? (
            <ActivityIndicator color={AppColors.primary} size="small" />
          ) : (
            <FlatList
              data={FavouritesList}
              style={{width: '100%', flex: 1}}
              contentContainerStyle={{alignItems: 'center'}}
              keyExtractor={item => item.ID}
              ListEmptyComponent={() => (
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    textAlign: 'center',
                    marginTop: Dimensions.get('screen').height * 0.3,
                  }}>
                  {Languages.NoFavListings}
                </Text>
              )}
              renderItem={({item, index}) => (
                <FavouriteItemsCards
                  animation={'fadeInRight'}
                  delay={150 + index * 150}
                  item={item}
                  {...props}
                  showCartBtn={false}
                  store={{ID: '', Name: '', DeliveryTime: ''}}
                  type={Constants.STORE_TYPE}
                  reloadList={getUserFavourites}
                  closeModal={() => favouritesPopup.current.close()}
                />
              )}
            />
          )}

          <AppButton
            onPress={() => favouritesPopup.current.close()}
            isLoading={false}
            text={Languages.close}
            extraStyle={{marginBottom: 0, width: '92%'}}
          />
        </View>
      </Modal>
    );
  };

  const getUserFavourites = async () => {
    setLoadingFavourites(true);

    let data = await ks.GetUserFavourites({
      UserID: user.ID,
      LangID: Languages.langID,
    });
    if (data?.Success) {
      setFavouritesList(data.Products);
    }
    setLoadingFavourites(false);
  };

  useEffect(() => {
    if (!user.TherePharmacy) {
      Alert.alert(Languages.Talabity, Languages.applicationCanOnly, [
        {
          text: 'OK',
          onPress: () => {
            setLoading(true);
            props.navigation.navigate('ProfileScreen');
          },
        },
      ]);
    }
    setLoading(true);

    getinitData();
    messaging().onMessage(async (remoteMessage: any) => {
      if (
        remoteMessage &&
        remoteMessage.data.type === Constants.NOTIFICATIONS_STATUSES.general
      ) {
        getNotifications();
      }
    });
  }, []);

  const getinitData = () => {
    Promise.all([
      getDrugs(city),
      handleAccessButtons(),
      getAds(),
      getUserPoints(),
      getUserFavourites(),
      getNotifications(),
      GetMyOrders(),
      setupToken(),
      getUserPoints(),
    ]).then(() => {
      setLoading(false);
    });
  };

  const getAds = async () => {
    let data = await ks.AdsGet({isAdmin: true, langID: Languages.langID});
    if (data.Success) {
      setBanners(data.Ads);
    }
  };

  const getUserPoints = async () => {
    console.log('before 2222 function');
    var data = await ks.DrugStorePointGet({
      userID: user.ID,
      LangID: Languages.langID,
    });

    if (data?.Success) {
      setUserPoints(data?.PointList);
    }
  };

  const refreshData = () => {
    getinitData();
  };

  // const getDrugs = (city: any) => {
  //   // setLoading(true);
  //   ks.DrugStoreGet({
  //     langID: Languages.langID,
  //     AreaID: city.ID,
  //     userID: user.ID,
  //   }).then((data: any) => {
  //     if (data.Success) {
  //       let stores = data.DrugStores.filter(
  //         (_store: any) => _store.IsDrugStore,
  //       );
  //       let medicalSupplies = data.DrugStores.filter(
  //         (_store: any) => !_store.IsDrugStore,
  //       );
  //       setStores(stores);
  //       setMedicalSupplies(medicalSupplies);
  //     } else {
  //       return Alert.alert('', Languages.SomethingWentWrong, [
  //         {text: Languages.Yes},
  //       ]);
  //     }
  //     if (user) {
  //       ks.DrugStoreGet({
  //         langID: Languages.langID,
  //         userID: user.ID,
  //       })
  //         .then((data: any) => {
  //           if (data.Success) {
  //             let userStores = data.DrugStores.filter(
  //               (_store: any) =>
  //                 _store.IsDrugStore &&
  //                 _store.IsAvailable === Constants.USER_STORE_STATUSES.ACCEPTED,
  //             );
  //             let userSupplies = data.DrugStores.filter(
  //               (_store: any) =>
  //                 !_store.IsDrugStore &&
  //                 _store.IsAvailable === Constants.USER_STORE_STATUSES.ACCEPTED,
  //             );
  //             setUserStores(userStores);
  //             setUserSupplies(userSupplies);
  //             // setLoading(true);
  //           } else {
  //             return Alert.alert('', Languages.SomethingWentWrong, [
  //               {text: Languages.Yes},
  //             ]);
  //           }
  //         })
  //         .finally(() => {
  //           // setLoading(false);
  //         });
  //     } else {
  //       // setLoading(false);
  //     }
  //   });
  // };
  const getDrugs = async (city: any) => {
    // setLoading(true);
    let data = await ks.DrugStoreGet({
      langID: Languages.langID,
      AreaID: city.ID,
      userID: user.ID,
    });

    if (data.Success) {
      let stores = data.DrugStores.filter((_store: any) => _store.IsDrugStore);
      let medicalSupplies = data.DrugStores.filter(
        (_store: any) => !_store.IsDrugStore,
      );
      setStores(stores);
      setMedicalSupplies(medicalSupplies);
    } else {
      return Alert.alert('', Languages.SomethingWentWrong, [
        {text: Languages.Yes},
      ]);
    }
    if (user) {
      ks.DrugStoreGet({
        langID: Languages.langID,
        userID: user.ID,
      })
        .then((data: any) => {
          if (data.Success) {
            let userStores = data.DrugStores.filter(
              (_store: any) =>
                _store.IsDrugStore &&
                _store.IsAvailable === Constants.USER_STORE_STATUSES.ACCEPTED,
            );
            let userSupplies = data.DrugStores.filter(
              (_store: any) =>
                !_store.IsDrugStore &&
                _store.IsAvailable === Constants.USER_STORE_STATUSES.ACCEPTED,
            );
            setUserStores(userStores);
            setUserSupplies(userSupplies);
            // setLoading(true);
          } else {
            return Alert.alert('', Languages.SomethingWentWrong, [
              {text: Languages.Yes},
            ]);
          }
        })
        .finally(() => {
          // setLoading(false);
        });
    } else {
      // setLoading(false);
    }
  };
  const setupToken = async () => {
    let token = messaging().requestPermission();
    messaging().getToken();

    let data = await ks.SetUserToken({
      userid: user?.ID,
      token: token,
    });
  };

  const getNotifications = async () => {
    let data = await ks.NotificationsGet({
      userID: user.ID,
    });

    if (data.Success) {
      NotificationsCount = data.notifications.filter(
        (d: any) => !d.IsRead,
      ).length;
      setNotificationsList(data.notifications);
    }
  };

  const handleAccessButtons = () => {
    if (user) {
      setQuickAccessButtons([
        {
          id: 1,
          image: require('../../assets/images/box.png'),
          name: Languages.MyOrders,
          onPress: () => ordersPopup.current.open(),
        },
        // {
        //   id: 2,
        //   icon: 'user',
        //   type: 'FontAwesome',
        //   name: Languages.MyInformation,
        //   onPress: () => props.navigation.navigate('EditProfileScreen'),
        // },
        {
          id: 2,
          // image: require('../../assets/images/star.png'),
          size: 22,
          icon: 'heart',
          type: 'AntDesign',
          name: Languages.Favourites,
          onPress: () => favouritesPopup.current.open(),
        },
        {
          id: 5,
          image: require('../../assets/images/points.png'),
          name: Languages.Points,
          onPress: () => pointsPopup.current.open(),
        },
        {
          id: 3,
          icon: 'notifications',
          type: 'Ionicons',
          name: Languages.Notifications,
          onPress: () => {
            NotificationsCount = 0;
            notificationsPopup.current.open();
          },
          showBadge: true,
        },
        // {
        //   id: 4,
        //   icon: 'share-variant',
        //   type: 'MaterialCommunityIcons',
        //   name: Languages.ShareApp,
        //   onPress: () => onShare(),
        // },
      ]);
    } else {
      // setQuickAccessButtons([
      //   {
      //     id: 4,
      //     icon: 'share-variant',
      //     type: 'MaterialCommunityIcons',
      //     name: Languages.ShareApp,
      //     onPress: () => onShare(),
      //   },
      // ]);
    }
  };

  const Stores = () => (
    <HomeComponent
      banners={banners}
      data={stores}
      userDrugs={userStores}
      type={Constants.STORE_TYPE}
      favTitle={Languages.FavoriteStores}
      availableTitle={Languages.AvaialbleStores}
      {...props}
    />
  );

  const MedicalSupplies = () => (
    <HomeComponent
      banners={banners}
      data={medicalSupplies}
      userDrugs={userSupplies}
      type={Constants.MEDICAL_SUPPLIES_TYPE}
      favTitle={Languages.FavoriteMedicalSupplies}
      availableTitle={Languages.AvailableMedicalSupplies}
      {...props}
    />
  );

  const notificationsModal = () => {
    return (
      <Modal
        ref={notificationsPopup}
        swipeToClose={false}
        onClosed={getNotifications}
        backButtonClose
        useNativeDriver
        coverScreen
        style={{
          backgroundColor: 'transparent',
          width: '100%',
          height: '100%',
          position: 'absolute',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{width: '100%', flex: 1, backgroundColor: '#fff'}}>
          <Header
            title={Languages.Notifications}
            showCloseIcon
            extraStyle={{height: 50, paddingTop: 0}}
            onClosePress={() => notificationsPopup.current.close()}
          />

          <FlatList
            data={NotificationsList}
            style={{width: '100%', flex: 1}}
            contentContainerStyle={{paddingVertical: 5}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={styles.notificationsCards}
                activeOpacity={0.6}
                onPress={() => onNotificationPressed(item)}>
                {!item.IsRead ? (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: '#88e',
                      marginHorizontal: 5,
                      alignSelf: 'center',
                    }}
                  />
                ) : null}
                <Text style={{paddingHorizontal: 5}}>{item.Text}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    );
  };

  const onNotificationPressed = item => {
    // item.Parameter

    switch (item.Type) {
      case '1':
        props.navigation.navigate('ChatScreen');
      case '2':
        null;
      case '3': {
        props.navigation.navigate('StoreItemsScreen', {
          store: {...item, ID: item.Parameter},
        });
        notificationsPopup.current.close();
      }

      default:
        null;
    }

    ks.NotificationRead({
      ID: item.ID,
      IsRead: 1,
    });
  };

  const HomeComponent = (props: any) =>
    loading ? (
      <ActivityIndicator
        size={'small'}
        color={AppColors.primary}
        style={{flex: 1}}
      />
    ) : (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }>
        {props.banners.length > 0 && (
          <Swiper
            autoplay
            autoplayTimeout={5}
            style={{maxHeight: Dimensions.get('screen').height * 0.25}}
            activeDotColor={AppColors.white}
            paginationStyle={{bottom: 5, position: 'absolute'}}>
            {props.banners.map((banner: any) => (
              <TouchableOpacity
                activeOpacity={0.6}
                key={banner.ID}
                style={styles.banners}
                onPress={() => {
                  if (banner?.Path) {
                    Linking.openURL(banner?.Path).catch(() => {});
                  }
                }}>
                <Image
                  source={{
                    uri:
                      Constants.URL + banner.FullImagePath + '_1920x1080.jpg',
                  }}
                  style={{
                    width: Dimensions.get('screen').width,
                    height: Dimensions.get('screen').width / 1.77,
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    position: 'absolute',
                    padding: 10,
                    fontSize: FontSizes.Heading.fontSize,
                    color: AppColors.primary,
                    textAlign: 'center',
                    height: '100%',
                    textAlignVertical: 'center',
                  }}>
                  {banner?.Description}
                </Text>
              </TouchableOpacity>
            ))}
          </Swiper>
        )}
        {props.type === Constants.STORE_TYPE ? (
          userStores.filter((_store: any) => _store.IsFavorite).length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View style={{width: '60%'}}>
                  <Text style={styles.headerContainer}>{props.favTitle}</Text>
                </View>
                <GoToButton
                  showText
                  data={userStores.filter((_store: any) => _store.IsFavorite)}
                  isStore
                  {...props}
                  type={props.type}
                  getDrugs={getDrugs}
                />
              </View>
              <FlatList
                data={userStores.filter((_store: any) => _store.IsFavorite)}
                keyExtractor={(item, index) => index.toString()}
                style={{
                  alignSelf: 'center',
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                alwaysBounceHorizontal
                renderItem={({item, index}: any) => {
                  return (
                    <StoreCard
                      key={index}
                      isMy={true}
                      IsMyPharmacies={false}
                      index={index}
                      store={item}
                      {...props}
                      type={props.type}
                      getDrugs={getDrugs}
                    />
                  );
                }}
              />
            </>
          ) : (
            <View />
          )
        ) : userSupplies.filter((_store: any) => _store.IsFavorite).length >
          0 ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}>
              <View style={{width: '60%'}}>
                <Text style={styles.headerContainer}>{props.favTitle}</Text>
              </View>
              <GoToButton
                showText
                data={userSupplies.filter((_store: any) => _store.IsFavorite)}
                isStore
                {...props}
                type={props.type}
                getDrugs={getDrugs}
              />
            </View>
            <FlatList
              data={userSupplies.filter((_store: any) => _store.IsFavorite)}
              keyExtractor={(item, index) => index.toString()}
              style={{
                alignSelf: 'center',
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              alwaysBounceHorizontal
              renderItem={({item, index}: any) => {
                return (
                  <StoreCard
                    key={index}
                    isMy={true}
                    IsMyPharmacies={false}
                    index={index}
                    store={item}
                    {...props}
                    type={props.type}
                    getDrugs={getDrugs}
                  />
                );
              }}
            />
          </>
        ) : (
          <View style={{}}></View>
        )}

        {user &&
          props.userDrugs.filter((_item: any) => _item.IsAvailable).length >
            0 && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View style={{width: '60%'}}>
                  <Text style={styles.headerContainer}>
                    {props.availableTitle}
                  </Text>
                </View>
                <GoToButton
                  showText
                  data={
                    user &&
                    props.userDrugs.filter((_item: any) => _item.IsAvailable)
                  }
                  isStore
                  getDrugs={getDrugs}
                  type={props.type}
                />
              </View>
              <FlatList
                data={
                  user &&
                  props.userDrugs.filter((_item: any) => _item.IsAvailable)
                }
                keyExtractor={item => item.ID}
                style={{
                  alignSelf: 'center',
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                alwaysBounceHorizontal
                renderItem={({item, index}) => {
                  return (
                    <StoreCard
                      key={index}
                      index={index}
                      IsMyPharmacies={false}
                      isMy={true}
                      store={item}
                      {...props}
                      type={props.type}
                      getDrugs={getDrugs}
                    />
                  );
                }}
              />
            </>
          )}
        {props.data.filter(
          (_item: any) =>
            _item.IsAvailable === Constants.USER_STORE_STATUSES.NOT_REQUESTED ||
            _item.IsAvailable === Constants.USER_STORE_STATUSES.REQUESTED,
        ).length > 0 && (
          <>
            <View
              style={{
                backgroundColor: AppColors.grey,
                width: '100%',
                height: 1,
                marginVertical: 20,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}>
              <View style={{width: '60%'}}>
                <Text style={styles.headerContainer}>
                  {props.type === Constants.STORE_TYPE
                    ? Languages.Stores
                    : Languages.MedicalSupplies}
                </Text>
              </View>
            </View>
            {props.data
              .filter(
                (_item: any) =>
                  _item.IsAvailable ===
                    Constants.USER_STORE_STATUSES.NOT_REQUESTED ||
                  _item.IsAvailable === Constants.USER_STORE_STATUSES.REQUESTED,
              )
              .map((item: any, index: any) => {
                return (
                  <StoreCard
                    key={index}
                    index={index}
                    IsMyPharmacies={false}
                    store={item}
                    isMy={true}
                    {...props}
                    joinable={false}
                    getDrugs={getDrugs}
                  />
                );
              })}
          </>
        )}
      </ScrollView>
    );

  const header = () => {
    return (
      <View
        style={{
          marginVertical: 10,
          paddingHorizontal: 5,
          flexDirection:
            quickAccessButtons.length > 1 ? 'column' : 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: quickAccessButtons.length > 1 ? '100%' : '20%',
            marginBottom: 10,
          }}>
          {quickAccessButtons.map((item: any) => {
            const {icon, name, id, type, onPress, image} = item;
            const heightWidth = item?.size || 25;
            return (
              <View
                key={id}
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  marginHorizontal: 2,
                  flex: 1,
                  height: 85,
                  paddingVertical: 1,
                }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.quickAccessBtn}
                  onPress={onPress}>
                  {image ? (
                    <Image
                      source={image}
                      style={{height: heightWidth, width: heightWidth}}
                    />
                  ) : (
                    <View style={{}}>
                      <AppIcon
                        type={type}
                        name={icon}
                        size={heightWidth}
                        color={AppColors.primary}
                      />
                      {item?.showBadge && NotificationsCount > 0 && (
                        <View
                          style={{
                            position: 'absolute',
                            top: -10,
                            right: -15,
                          }}>
                          <View
                            style={{
                              backgroundColor: AppColors.red,
                              height: 20,
                              width: 20,
                              borderRadius: 10,
                            }}>
                            <Text
                              style={{
                                ...FontWeights.Regular,
                                color: AppColors.white,
                                textAlign: 'center',
                              }}>
                              {NotificationsCount}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </TouchableOpacity>

                <Text adjustsFontSizeToFit style={styles.item}>
                  {name}
                </Text>
              </View>
            );
          })}
        </View>
        <SectionedMultiSelect
          icons={Constants.icons}
          IconRenderer={Icon}
          showCancelButton
          items={Constants.GetCitiesMultiSelect(cities)}
          uniqueKey="ID"
          displayKey="Name"
          subKey="children"
          selectText={city.Name}
          showDropDowns={false}
          hideSearch
          readOnlyHeadings={true}
          colors={{
            primary: AppColors.primary,
          }}
          styles={{
            button: {
              justifyContent: 'center',
              alignItems: 'center',
            },
            selectToggleText: {
              color: AppColors.primary,
              textAlign: 'center',
              width: '100%',
            },
            container: {},
            toggleIcon: {backgroundColor: AppColors.primary},
            subItemText: {
              ...FontWeights.Bold,
              ...FontSizes.Body,
              color: AppColors.black,
            },
            selectToggle: [
              {
                borderRadius: 10,
                borderColor: AppColors.primary,
                backgroundColor: AppColors.optionBG,
                borderWidth: 1,
                alignSelf: 'center',
                paddingVertical: 5,
                paddingHorizontal: 5,
                width: 200,
              },
            ],
          }}
          confirmText={Languages.Confirm}
          onSelectedItemsChange={(items: any) => {
            let _selectedCity = cities.find(
              (_city: any) => _city.ID === items[0],
            );
            dispatch(saveCity(_selectedCity));
            if (user) {
              getDrugs(_selectedCity);
            } else {
              getDrugs(_selectedCity);
            }
          }}
          selectedItems={[city.ID]}
          showChips={false}
          single
        />
      </View>
    );
  };

  const renderScene = SceneMap({
    first: Stores,
    second: MedicalSupplies,
  });

  const GetMyOrders = async () => {
    let data = await ks.MyOrders({
      UserID: user.ID,
      LangID: Languages.langID,
    });
    if (data.Success) {
      setMyOrders(data.orders);
    }
  };

  const ordersModal = () => {
    return (
      <Modal
        ref={ordersPopup}
        swipeToClose={false}
        onOpened={GetMyOrders}
        backButtonClose
        useNativeDriver
        coverScreen
        style={{
          backgroundColor: 'transparent',
          width: '100%',
          height: '100%',
          position: 'absolute',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{width: '100%', flex: 1, backgroundColor: '#fff'}}>
          <Header
            title={Languages.MyOrders}
            showCloseIcon
            extraStyle={{height: 50, paddingTop: 0}}
            onClosePress={() => ordersPopup.current.close()}
          />

          <FlatList
            data={myOrders}
            style={{width: '100%', flex: 1}}
            contentContainerStyle={{paddingVertical: 5}}
            keyExtractor={item => item.ID}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={styles.ordersCards}
                onPress={() => {
                  ordersPopup.current.close();
                  props.navigation.navigate('OrderDetails', {
                    OrderID: item.OrderID,
                  });
                }}>
                <Text style={{alignSelf: 'flex-start'}}>
                  {moment(item.OrderDate).format('DD/MM/YYYY')}
                </Text>
                <Text style={{color: '#000'}}>{item.OwnerName}</Text>
                <Text style={{color: '#000'}}>{item.MerchantName}</Text>
                <Text style={{}}>{' # ' + item.OrderID}</Text>
                <Text style={{fontSize: 16, color: '#000'}}>
                  {item.FormattedOrderTotal} ID
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    );
  };

  return (
    <>
      {
        <SearchButton
          {...props}
          data={index === 0 ? stores : medicalSupplies}
          banners={banners}
          data={stores}
          userDrugs={userStores}
          showQRCode
        />
      }

      <StatusBar backgroundColor={AppColors.primary} />
      {header()}
      {notificationsModal()}
      {ordersModal()}
      {pointsModal()}
      {favouritesModal()}

      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        swipeEnabled={false}
        renderTabBar={props => {
          return (
            <TabBar
              {...props}
              pressColor={'rgba(0,0,0,0)'}
              labelStyle={{
                fontSize: 16,
                ...FontWeights.Bold,
                color: '#FFF',
              }}
              indicatorStyle={{
                backgroundColor: AppColors.secondary,
              }}
              tabStyle={{backgroundColor: AppColors.primary, marginBottom: 2}}
            />
          );
        }}
      />
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
    margin: 10,
    fontSize: 24,
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
    ...FontWeights.Light,
    color: MaterialColors.grey[500],
    ...FontSizes.Body,
  },
  item: {
    ...FontWeights.Bold,
    ...FontSizes.Body,
    marginTop: 5,
    fontSize: 13,
    width: '100%',
    textAlign: 'center',
    paddingHorizontal: 1,
  },
  banners: {
    height: '100%',
    width: Dimensions.get('screen').width,
    // backgroundColor: AppColors.white,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.27,
    // shadowRadius: 4.65,

    // elevation: 6,
  },
  quickAccessBtn: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.optionBG,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    width: 50,
    height: 50,
  },
  notificationsCards: {
    width: '94%',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    zIndex: 3,
    elevation: 3,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 5,
    minHeight: 60,
    flexDirection: 'row',
  },
  modals: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersCards: {
    width: '94%',
    height: 87,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    zIndex: 3,
    elevation: 3,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 5,
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
