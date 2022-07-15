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
  Modal,
  Pressable,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {AppIcon, Constants, Languages} from '../../common';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
const index = props => {
  const {city, cities, user} = useSelector(({data}) => data);
  const {cartUser} = useSelector(({data}) => data);
  const dispatch = useDispatch();

  const [pointsPopup, setPointsPopup] = useState(false);
  const [loadingPoints, setloadingPoints] = useState(true);

  const [LoadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationsPopup, setnotificationsPopup] = useState(false);
  const [favouritesPopup, setfavouritesPopup] = useState(false);
  const [ordersPopup, setOrdersPopup] = useState(false);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [NotificationsList, setNotificationsList] = useState([]);
  const [userPoints, setUserPoints] = useState([]);
  const [stores, setStores] = useState([]);
  const [allstores, setAllStores] = useState([]);
  const [medicalSupplies, setMedicalSupplies] = useState([]);
  const [allmedicalSupplies, setAllMedicalSupplies] = useState([]);
  const [userStores, setUserStores] = useState([]);
  const [userSupplies, setUserSupplies] = useState([]);
  const [banners, setBanners] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [quickAccessButtons, setQuickAccessButtons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyOrders, setLoadingMyOrders] = useState(true);
  const [loadingFavourites, setLoadingFavourites] = useState(true);
  const [FavouritesList, setFavouritesList] = useState([]);
  const [loadingRefreshData, setLoadingRefreshData] = useState(false);
  useEffect(() => {
    handleAccessButtons();
    setupToken();
    getinitData();
  }, []);

  ////////////////////////////////////
  const getinitData = () => {
    setLoading(true);

    ks.DrugStoreGet({
      langID: Languages.langID,
      AreaID: city.ID,
      userID: user.ID,
    }).then(data => {
      if (data.Success) {
        let stores = data.DrugStores.filter(_store => _store.IsDrugStore);
        let medicalSupplies = data.DrugStores.filter(
          _store => !_store.IsDrugStore,
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
          .then(data => {
            if (data.Success) {
              let userStores = data.DrugStores.filter(
                _store =>
                  _store.IsDrugStore &&
                  _store.IsAvailable === Constants.USER_STORE_STATUSES.ACCEPTED,
              );
              let userSupplies = data.DrugStores.filter(
                _store =>
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
            // getNotifications();
            // getUserPoints();
            // getUserFavourites();
            // GetMyOrders();
          });
      } else {
        // setLoading(false);
      }

      ks.AdsGet({isAdmin: true, langID: Languages.langID}).then(data => {
        if (data.Success) {
          setBanners(data.Ads);
        }
        ks.GetUserFavourites({
          UserID: user.ID,
          LangID: Languages.langID,
        }).then(data => {
          if (data?.Success) {
            setFavouritesList(data.Products);
          }
          ks.NotificationsGet({
            userID: user.ID,
          }).then(data => {
            if (data.Success) {
              NotificationsCount = data.notifications.filter(
                d => !d.IsRead,
              ).length;
              setNotificationsList(data.notifications);
            }

            setLoading(false);
            setLoadingRefreshData(false);
          });
        });
      });
    });
  };

  const handleAccessButtons = () => {
    if (user) {
      setQuickAccessButtons([
        {
          id: 1,
          image: require('../../assets/images/box.png'),
          name: Languages.MyOrders,
          onPress: () => {
            setOrdersPopup(true);
            GetMyOrders();
          },
        },

        {
          id: 2,
          size: 22,
          icon: 'heart',
          type: 'AntDesign',
          name: Languages.Favourites,
          onPress: () => {
            setfavouritesPopup(true);
            getUserFavourites();
          },
        },
        {
          id: 5,
          image: require('../../assets/images/points.png'),
          name: Languages.Points,
          onPress: () => {
            setPointsPopup(true);
            getUserPoints();
          },
        },
        {
          id: 3,
          icon: 'notifications',
          type: 'Ionicons',
          name: Languages.Notifications,
          onPress: () => {
            NotificationsCount = 0;
            setnotificationsPopup(true);
            getNotifications();
          },
          showBadge: true,
        },
      ]);
    } else {
    }
  };

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
          {quickAccessButtons.map(item => {
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
          onSelectedItemsChange={items => {
            let _selectedCity = cities.find(_city => _city.ID === items[0]);
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

  const getDrugs = city => {
    setLoading(true);

    ks.DrugStoreGet({
      langID: Languages.langID,
      AreaID: city.ID,
      userID: user.ID,
    }).then(data => {
      if (data.Success) {
        let stores = data.DrugStores.filter(_store => _store.IsDrugStore);
        let medicalSupplies = data.DrugStores.filter(
          _store => !_store.IsDrugStore,
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
          .then(data => {
            if (data.Success) {
              let userStores = data.DrugStores.filter(
                _store =>
                  _store.IsDrugStore &&
                  _store.IsAvailable === Constants.USER_STORE_STATUSES.ACCEPTED,
              );
              let userSupplies = data.DrugStores.filter(
                _store =>
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
            setLoading(false);
          });
      } else {
        // setLoading(false);
      }
    });
  };

  const getNotifications = () => {
    setLoadingNotifications(true);
    ks.NotificationsGet({
      userID: user.ID,
    }).then(data => {
      if (data.Success) {
        NotificationsCount = data.notifications.filter(d => !d.IsRead).length;
        setNotificationsList(data.notifications);
        setLoadingNotifications(false);
      }
    });
  };

  const GetMyOrders = () => {
    setLoadingMyOrders(true);
    ks.MyOrders({
      UserID: user.ID,
      LangID: Languages.langID,
    }).then(data => {
      if (data.Success) {
        setLoadingMyOrders(false);

        setMyOrders(data.orders);
      } else {
        Alert.alert('', 'Oops...Somthing Worng ', [
          {
            text: 'Back',
            onPress: () => ordersPopup.current.close(),
          },
        ]);
      }
    });
  };

  const getUserPoints = () => {
    setloadingPoints(true);
    ks.DrugStorePointGet({
      userID: user.ID,
      LangID: Languages.langID,
    }).then(data => {
      if (data?.Success) {
        setUserPoints(data?.PointList);
        setloadingPoints(false);
      }
    });
  };

  const getUserFavourites = () => {
    setLoadingFavourites(true);

    ks.GetUserFavourites({
      UserID: user.ID,
      LangID: Languages.langID,
    }).then(data => {
      if (data?.Success) {
        setFavouritesList(data.Products);
      }
      setLoadingFavourites(false);
    });
  };

  const setupToken = () => {
    messaging().requestPermission();
    messaging()
      .getToken()
      .then(token => {
        ks.SetUserToken({
          userid: user?.ID,
          token: token,
        }).then(data => {});
      });
  };
  const refreshData = () => {
    handleAccessButtons();
    setLoadingRefreshData(true);
    getinitData();
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
        setnotificationsPopup(false);
      }

      default:
        null;
    }

    ks.NotificationRead({
      ID: item.ID,
      IsRead: 1,
    });
  };
  ///////////////////////////////////

  ////////////Start Modals////////////////////
  const notificationsModal = () => {
    return (
      <Modal visible={notificationsPopup}>
        <View
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
              onClosePress={() => setnotificationsPopup(false)}
            />

            {LoadingNotifications ? (
              <View
                style={{
                  flex: 1,
                  //backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 99,
                }}>
                <ActivityIndicator size="small" color={AppColors.primary} />
              </View>
            ) : (
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
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const ordersModal = () => {
    return (
      <Modal animationType="slide" visible={ordersPopup}>
        <View
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
              onClosePress={() => setOrdersPopup(false)}
            />

            {loadingMyOrders ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator color={AppColors.primary} size="small" />
              </View>
            ) : (
              <FlatList
                data={myOrders}
                style={{width: '100%', flex: 1}}
                contentContainerStyle={{paddingVertical: 5}}
                keyExtractor={item => item.ID}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={styles.ordersCards}
                    onPress={() => {
                      setOrdersPopup(false);
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
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const pointsModal = () => {
    return (
      <Modal animationType="slide" visible={pointsPopup}>
        <View style={styles.modals}>
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

            {loadingPoints ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator color={AppColors.primary} size="small" />
              </View>
            ) : userPoints.length == 0 ? (
              <View
                style={{
                  flex: 1,

                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 18, color: '#111'}}>
                  {Languages.Points} : 0
                </Text>
                <Text style={{fontSize: 18, color: '#111'}}>
                  {Languages.getPoints}
                </Text>
              </View>
            ) : (
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
                    <Text style={{fontSize: 18, color: '#111'}}>
                      {item.Point}
                    </Text>
                  </View>
                )}
              />
            )}

            <AppButton
              onPress={() => setPointsPopup(false)}
              isLoading={false}
              text={Languages.close}
              extraStyle={{marginBottom: 0, width: '92%'}}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const favouritesModal = () => {
    return (
      <Modal visible={favouritesPopup}>
        <View style={styles.modals}>
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
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator color={AppColors.primary} size="small" />
              </View>
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
                    closeModal={() => setfavouritesPopup(false)}
                  />
                )}
              />
            )}

            <AppButton
              onPress={() => setfavouritesPopup(false)}
              isLoading={false}
              text={Languages.close}
              extraStyle={{marginBottom: 0, width: '92%'}}
            />
          </View>
        </View>
      </Modal>
    );
  };
  ////////////end Modals////////////////////

  ////////////////render Tabs///////////
  const [routes] = useState([
    {key: 'first', title: Languages.Stores},
    {key: 'second', title: Languages.MedicalSupplies},
  ]);
  const HomeComponent = props => {
    return loading ? (
      <></>
    ) : (
      <ScrollView
        style={{width: '100%', flex: 1}}
        // style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        refreshControl={
          <RefreshControl
            refreshing={loadingRefreshData}
            onRefresh={refreshData}
          />
        }>
        {props.banners.length > 0 && (
          <Swiper
            autoplay
            autoplayTimeout={5}
            style={{maxHeight: Dimensions.get('screen').height * 0.25}}
            activeDotColor={AppColors.white}
            paginationStyle={{bottom: 5, position: 'absolute'}}>
            {props.banners.map(banner => (
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
          userStores.filter(_store => _store.IsFavorite).length > 0 ? (
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
                  data={userStores.filter(_store => _store.IsFavorite)}
                  isStore
                  {...props}
                  type={props.type}
                  getDrugs={stores}
                />
              </View>
              <FlatList
                data={userStores.filter(_store => _store.IsFavorite)}
                keyExtractor={(item, index) => index.toString()}
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
        ) : userSupplies.filter(_store => _store.IsFavorite).length > 0 ? (
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
                data={userSupplies.filter(_store => _store.IsFavorite)}
                isStore
                {...props}
                type={props.type}
                getDrugs={getDrugs}
              />
            </View>
            <FlatList
              data={userSupplies.filter(_store => _store.IsFavorite)}
              keyExtractor={(item, index) => index.toString()}
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

        {user && props.userDrugs.filter(_item => _item.IsAvailable).length > 0 && (
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
                  user && props.userDrugs.filter(_item => _item.IsAvailable)
                }
                isStore
                getDrugs={getDrugs}
                type={props.type}
              />
            </View>
            <FlatList
              data={user && props.userDrugs.filter(_item => _item.IsAvailable)}
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
          _item =>
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

            <FlatList
              data={props.data.filter(
                _item =>
                  _item.IsAvailable ===
                    Constants.USER_STORE_STATUSES.NOT_REQUESTED ||
                  _item.IsAvailable === Constants.USER_STORE_STATUSES.REQUESTED,
              )}
              renderItem={({item, index}) => {
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
              }}
            />

            {/* {props.data
              .filter(
                _item =>
                  _item.IsAvailable ===
                    Constants.USER_STORE_STATUSES.NOT_REQUESTED ||
                  _item.IsAvailable === Constants.USER_STORE_STATUSES.REQUESTED,
              )
              .map((item, index) => {
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
              })} */}
          </>
        )}
      </ScrollView>
    );
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

  const renderScene = SceneMap({
    first: Stores,
    second: MedicalSupplies,
  });

  const renderTabs = () => {
    return (
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
    );
  };

  ////////////////////////////////////
  return (
    <View style={{flex: 1, width: '100%'}}>
      {loading && (
        <View
          style={{
            position: 'absolute',
            zIndex: 999,
            flex: 1,
            backgroundColor: '#FFF',
            opacity: 0.5,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          }}>
          <ActivityIndicator
            size={'small'}
            color={AppColors.primary}
            style={{flex: 1}}
          />
        </View>
      )}
      <SearchButton
        {...props}
        // data={index === 0 ? stores : medicalSupplies}
        banners={banners}
        data={stores}
        userDrugs={userStores}
        showQRCode
      />
      {header()}
      {renderTabs()}
      {/* Modals */}

      {notificationsModal()}
      {ordersModal()}
      {pointsModal()}
      {favouritesModal()}
    </View>
  );
};

export default index;

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
