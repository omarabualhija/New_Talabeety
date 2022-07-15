//@ts-nocheck
import React, {useEffect, useState, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Linking,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useSelector} from 'react-redux';
import {AppIcon, Constants, Languages} from '../../common';
import {MaterialColors, FontWeights, FontSizes, AppColors} from '../../theme';
import Swiper from 'react-native-swiper';
import {ScrollView} from 'react-native-gesture-handler';
import {Header, ItemCard, SearchButton, GoToButton} from '../../components';
import Modal from 'react-native-modalbox';
import moment from 'moment';
import ks from '../../services/KSAPI';
import {WebView} from 'react-native-webview';
//LIBRARY ERROR TODO
import getDirections from 'react-native-google-maps-directions';
import * as Animatable from 'react-native-animatable';

const data = [
  {
    id: 1,
    name: 'دواء الحياة',
    image: require('@assets/images/pills.jpg'),
    price: 32,
    offerPrice: 3.2,
    type: 'Tab',
    delivery: '3-5 Business Days',
    expireDate: new Date().toISOString(),
    offerExpireDate: moment().add(3, 'days').toISOString(),
    provider: 'شركة الأدوية',
    status: 1,
    points: 1200,
    bonus: {each: 11, value: 2},
  },
  {
    id: 2,
    name: 'دواء العلاج',
    image: require('@assets/images/pills2.jpg'),
    price: 0,
    offerPrice: 0,
    type: 'Liquid',
    delivery: '3-5 Business Days',
    expireDate: new Date().toISOString(),
    offerExpireDate: moment().add(3, 'days').toISOString(),
    provider: 'شركة الأدوية',
    status: 2,
    points: 0,
    bonus: {each: 11, value: 2},
  },
  {
    id: 3,
    name: 'دواء الأمل',
    image: require('@assets/images/pills3.jpg'),
    price: 45.2,
    offerPrice: 5.2,
    type: 'Capsules',
    delivery: '3-5 Business Days',
    expireDate: new Date().toISOString(),
    offerExpireDate: moment().add(3, 'days').toISOString(),
    provider: 'شركة الأدوية',
    status: 1,
    points: 1200,
    bonus: {each: 11, value: 2},
  },
  {
    id: 4,
    name: 'دواء القدس',
    image: require('@assets/images/pills4.jpg'),
    price: 96.4,
    offerPrice: 0,
    type: 'Drops',
    delivery: '3-5 Business Days',
    expireDate: new Date().toISOString(),
    offerExpireDate: moment().add(3, 'days').toISOString(),
    provider: 'شركة الأدوية',
    status: 2,
    points: 0,
    bonus: {each: 11, value: 2},
  },
  {
    id: 5,
    name: 'دواء بغداد',
    image: require('@assets/images/pills.jpg'),
    price: 13.5,
    offerPrice: 3.5,
    type: 'Inhaler',
    delivery: '3-5 Business Days',
    expireDate: new Date().toISOString(),
    offerExpireDate: moment().add(3, 'days').toISOString(),
    provider: 'شركة الأدوية',
    status: 1,
    points: 1200,
    bonus: {each: 11, value: 2},
  },
  {
    id: 6,
    name: 'دواء التقوى',
    image: require('@assets/images/pills2.jpg'),
    price: 64.3,
    offerPrice: 0,
    type: 'Injection',
    delivery: '3-5 Business Days',
    expireDate: new Date().toISOString(),
    offerExpireDate: moment().add(3, 'days').toISOString(),
    provider: 'شركة الأدوية',
    status: 2,
    points: 0,
    bonus: {each: 11, value: 2},
  },
];

const staticCategory = [
  {
    title: 'ArrivedToday',
    id: 1,
    iconName: 'Ionicons',
    iconType: 'today',
    query: 'IsArrivedToday',
  },
  {
    title: 'ArrivedAfterCutout',
    id: 2,
    iconName: 'Zocial',
    iconType: 'dropbox',
    query: 'IsArrivedAfterDiscontinued',
  },
  {
    title: 'ArrivedNew',
    id: 3,
    iconName: 'Entypo',
    iconType: 'shopping-bag',
    query: 'IsRecentlyArrived',
  },
  {
    title: 'New',
    id: 4,
    iconName: 'MaterialIcons',
    iconType: 'new-releases',
    query: 'IsNew',
  },
  {
    title: 'StoreSales',
    id: 5,
    iconName: 'Fontisto',
    iconType: 'shopping-sale',
    query: 'IsSale',
  },
  {
    title: 'FavouriteItems',
    id: 6,
    iconName: 'AntDesign',
    iconType: 'heart',
    query: 'Favourite',
  },
];

const StoreItemsScreen = props => {
  const {city, user} = useSelector(({data}) => data);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [recentArrived, setRecentArrived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Points, setPoints] = useState(0);
  const [banners, setBanners] = useState([]);
  const [showImage, setShowImage] = useState(true);

  const privacyPopup = useRef();

  const {store, type} = props.route.params;

  useEffect(() => {
    // staticCategory.push({
    //   title: 'FavouriteItems',
    //   id: 6,
    //   iconName: 'AntDesign',
    //   iconType: 'heart',
    //   query: 'Favourite',
    //   onPress: (props, store, type, item) =>
    //     props.navigation.navigate('FavouriteScreen', {
    //       store,
    //       type,
    //       category: item,
    //     }),
    // });
    getDrugs();
    getAds();
    getCategories();
    // getPoints();
  }, []);

  const getDrugs = () => {
    setLoading(true);
    ks.DrugStoreGet({
      langID: Languages.langID,
      ID: store.ID,
      // AreaID: city.ID,
      userID: user.ID,
    }).then(da => console.log(da));
  };

  const getAds = () => {
    ks.AdsGet({
      isAdmin: false,
      langID: Languages.langID,
      drugStoreID: store.ID,
    }).then((data: any) => {
      if (data.Success) {
        setBanners(data.Ads);
      }
    });
  };

  const getCategories = () => {
    setLoading(true);
    ks.CategoriesGet({
      langID: Languages.langID,
      DrugStoreID: store.ID,
      enabled: 1,
      // userID: user.ID,
    })
      .then((data: any) => {
        if (data.Success) {
          setCategories(data.Categories);
          // data.Categories.map((item:any)=>setRecentArrived(_item=>_item.concat(item.products)))
        } else {
          Alert.alert('', Languages.SomethingWentWrong, [
            {text: Languages.Yes},
          ]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const getPoints = () => {
  //   ks.DrugStorePointGet({
  //     UserID: user.ID,
  //     DrugStoreID: store.ID,
  //   }).then((data: any) => {
  //     console.log('datadatadata', data);
  //     if (data?.Success) {
  //       setPoints(data.Point);
  //     }
  //   });
  // };

  // const getPoints = () => {
  //   ks.DrugStoreGet({
  //     langID: Languages.langID,
  //     ID: store.ID,
  //     // AreaID: city.ID,
  //     userID: user.ID,
  //   }).then(da => setPoints(da.DrugStores[0].MinPointReplacement));
  // };

  const getStoreDetails = () => {
    const arr = [
      {
        name: Languages.StoreArea,
        value: store.Location,
        iconName: 'home',
        iconType: 'Fontisto',
      },
      {
        name: Languages.PhoneNumber,
        value: store.Phone,
        iconName: 'phone',
        iconType: 'MaterialCommunityIcons',
        onPress: () => {
          Linking.openURL(`tel:${store.phone}`);
        },
      },
      {
        name: Languages.Location,
        value: Languages.GoToLocation,
        iconName: 'location-sharp',
        iconType: 'Ionicons',
        onPress: () => {
          const coord = store?.GPSLocation.split(',');
          const direction = {
            destination: {
              latitude: coord[0],
              longitude: coord[1],
            },
            params: [
              {
                key: 'travelmode',
                value: 'driving',
              },
              {
                key: 'dir_action',
                value: 'navigate',
              },
            ],
          };
          getDirections(direction);
        },
      },
      {
        name: Languages.numOfItems,
        value: store.NumOfItems,
        iconName: 'pills',
        iconType: 'Fontisto',
      },
      {
        name: Languages.OpeningHours,
        value:
          moment(store.StartTime).format('hh:mm A') +
          ' - ' +
          moment(store.EndTime).format('hh:mm A'),
        iconName: 'hours-24',
        iconType: 'MaterialCommunityIcons',
      },
      {
        name: Languages.DeliveryTime,
        value:
          store?.DeliveryTime < 60
            ? store.DeliveryTime + ' ' + Languages.Minutes
            : store.DeliveryTime / 60 + ' ' + Languages.Hours,
        iconName: 'truck-delivery',
        iconType: 'MaterialCommunityIcons',
      },
      {
        name: Languages.Minimumpoints,
        value: store.MinPointReplacement,
        // iconName: 'star',
        // iconType: 'Entypo',
        image: require('../../assets/images/points.png'),
      },
      {
        name: Languages.PrivacyPolicy,
        value: Languages.ShowMore,
        iconName: 'privacy-tip',
        iconType: 'MaterialIcons',
        onPress: () => {
          setIsInfoModalVisible(false);
          setTimeout(() => {
            privacyPopup.current.open();
          }, 400);
        },
      },
    ];
    return arr;
  };

  const renderCategories = () => {
    return (
      <View style={{width: '100%'}}>
        {categories.map((_category: any, index: Number) => (
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
            }}
            key={index.toString()}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <Text style={{...styles.headerContainer, textAlign: 'left'}}>
                  {_category.Name}
                </Text>
              </View>
              <GoToButton
                showText
                data={_category.products ? _category.products : []}
                {...props}
                showCartBtn
                store={store}
                type={type}
              />
            </View>
            <View
              style={{
                backgroundColor: AppColors.grey,
                width: '100%',
                height: 1,
                marginVertical: 10,
              }}
            />
            <FlatList
              data={_category.products ? _category.products : []}
              keyExtractor={(item, index) => index.toString()}
              style={{
                alignSelf: 'center',
                paddingHorizontal: 10,
                height: 200,
                marginBottom: 10,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              disableVirtualization
              alwaysBounceHorizontal
              renderItem={({item, index}) => {
                return (
                  <ItemCard
                    navigation={props.navigation}
                    key={index}
                    item={item}
                    {...props}
                    showCartBtn
                    store={store}
                    type={type}
                  />
                );
              }}
            />
          </View>
        ))}
      </View>
    );
  };

  const renderRecentlyArrived = () => {
    return (
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <Text style={{...styles.headerContainer, textAlign: 'left'}}>
              {Languages.NewlyAdded}
            </Text>
          </View>
          <GoToButton
            showText
            data={recentArrived.filter((i: any) =>
              i.IsRecentlyArrived ? true : false,
            )}
            {...props}
            showCartBtn
            store={store}
            type={type}
          />
        </View>
        <View
          style={{
            backgroundColor: AppColors.grey,
            width: '100%',
            height: 1,
            marginVertical: 10,
          }}
        />
        <FlatList
          data={recentArrived.filter((i: any) =>
            i.IsRecentlyArrived ? true : false,
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{
            alignSelf: 'center',
            paddingHorizontal: 10,
            height: 200,
            marginBottom: 10,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          disableVirtualization
          alwaysBounceHorizontal
          renderItem={({item, index}) => {
            return (
              <ItemCard
                navigation={props.navigation}
                key={index}
                item={item}
                {...props}
                showCartBtn
                store={store}
                type={type}
              />
            );
          }}
        />
      </View>
    );
  };

  const infoModal = () => {
    return (
      <Modal
        isOpen={isInfoModalVisible}
        hasBackdrop={false}
        swipeToClose={false}
        animationDuration={250}
        backButtonClose
        useNativeDriver
        onClosed={() => setIsInfoModalVisible(false)}
        coverScreen
        style={{
          backgroundColor: AppColors.optionBG,
          width: '100%',
          height: '100%',
          position: 'absolute',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Header
          {...props}
          // title={store.Name}
          title={Languages.StoreDetails}
          showCloseIcon
          extraStyle={{height: 50, paddingTop: 0}}
          onClosePress={() => setIsInfoModalVisible(false)}
        />

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 15,
          }}>
          <Image
            onError={() => setShowImage(false)}
            source={
              store.ImageURL && showImage
                ? {
                    uri:
                      Constants.CONTENT_URL +
                      '/DrugStore/' +
                      store.ID +
                      '_1920x1280.jpg',
                  }
                : require('../../assets/images/pharmacy.jpeg')
            }
            style={{
              height: 100,
              width: 100,
              borderRadius: 20,
              borderColor: AppColors.primary,
              borderWidth: 2,
              marginHorizontal: 15,
            }}
            resizeMode="cover"
          />
          <View style={{width: '70%', height: '100%'}}>
            <Text
              style={{color: AppColors.black, fontSize: 30, textAlign: 'left'}}>
              {store.Name}
            </Text>
            <Text
              style={{
                color: AppColors.darkGrey,
                fontSize: 20,
                textAlign: 'left',
              }}>
              {store.AreaName}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{alignItems: 'center'}}
          style={{
            width: '100%',
            marginTop: 50,
          }}>
          {getStoreDetails().map((item: any, index) => {
            return (
              <View
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  height: 60,
                  justifyContent: 'space-around',
                }}
                key={index}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  {item?.iconName ? (
                    <AppIcon
                      type={item.iconType}
                      name={item.iconName}
                      size={25}
                      color={AppColors.black}
                      style={{marginHorizontal: 10}}
                    />
                  ) : (
                    <Image
                      style={{width: 25, height: 25, marginHorizontal: 10}}
                      source={item.image}
                    />
                  )}
                  <Text
                    style={{
                      color: AppColors.black,
                      fontSize: 15,
                      flex: 1,
                      textAlign: 'left',
                    }}>
                    {item.name}
                  </Text>
                  <TouchableOpacity onPress={item.onPress}>
                    <Text
                      style={{
                        color: item?.onPress ? AppColors.clickableText : 'gray',
                        fontSize: 15,
                        textDecorationLine: item?.onPress
                          ? 'underline'
                          : 'none',
                      }}>
                      {item.value}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    backgroundColor: AppColors.grey,
                    height: 2,
                    width: '100%',
                    alignSelf: 'center',
                  }}
                />
              </View>
            );
          })}
        </ScrollView>
      </Modal>
    );
  };

  const privacyPolicyModal = () => {
    return (
      <Modal
        ref={privacyPopup}
        hasBackdrop={false}
        swipeToClose={false}
        backButtonClose
        useNativeDriver
        animationDuration={250}
        coverScreen
        style={{
          backgroundColor: AppColors.optionBG,
          width: '100%',
          height: '100%',
          position: 'absolute',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Header
          {...props}
          title={Languages.PrivacyPolicy}
          showCloseIcon
          extraStyle={{height: 50, paddingTop: 0}}
          onClosePress={() => privacyPopup.current.close()}
        />

        <View style={{width: '100%', flex: 1}}>
          <WebView
            style={{width: '100%', flex: 1}}
            source={{html: store?.DrogStorePolicy}}
          />
        </View>
      </Modal>
    );
  };

  const renderStaticCategories = () => {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          paddingTop: 5,
        }}>
        {staticCategory.map((item, index) => (
          <Animatable.View
            useNativeDriver
            animation="fadeInLeft"
            delay={100 + index * 100}
            key={item.id}
            style={styles.categoryCards}>
            <TouchableOpacity
              onPress={() =>
                item.id == 6
                  ? props.navigation.navigate('FavouriteScreen', {
                      store,
                      type,
                      category: item,
                    })
                  : props.navigation.navigate('CategoryItemsScreen', {
                      store,
                      type,
                      title: item?.title,
                      category: item,
                      query: item?.query,
                      ID: item.ID,
                    })
              }
              style={{
                ...StyleSheet.absoluteFillObject,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 2,
              }}>
              <AppIcon
                type={item.iconName}
                name={item.iconType}
                size={24}
                color={AppColors.primary}
              />
              <Text adjustsFontSizeToFit style={{fontSize: 18}}>
                {Languages[item.title]}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    );
  };

  const renderDynamicCategories = () => {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          paddingBottom: 15,
        }}>
        {categories.map((item, index) => {
          if (item.ID == '5') {
            return (
              <Animatable.View
                useNativeDriver
                animation="fadeInLeft"
                delay={200}
                key={item?.ID}
                style={[
                  styles.categoryCards,
                  {
                    height: Dimensions.get('screen').width * 0.25,
                    width: '96%',
                    marginTop: 10,
                  },
                ]}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('CategoryItemsScreen', {
                      store,
                      type,
                      category: item,
                    })
                  }
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 2,
                  }}>
                  <AppIcon
                    type={'MaterialIcons'}
                    name={'store'}
                    size={24}
                    color={AppColors.primary}
                  />
                  <Text
                    adjustsFontSizeToFit
                    style={{fontSize: 22, color: AppColors.primary}}>
                    {item.Name}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            );
          } else {
            return (
              <Animatable.View
                useNativeDriver
                animation="bounceIn"
                delay={100 + index * 150}
                key={item?.ID}
                style={[
                  styles.categoryCards,
                  {height: Dimensions.get('screen').width * 0.275},
                ]}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('CategoryItemsScreen', {
                      store,
                      type,
                      category: item,
                    })
                  }
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 2,
                  }}>
                  <Text adjustsFontSizeToFit style={{fontSize: 18}}>
                    {item.Name}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            );
          }
        })}
      </View>
    );
  };

  return loading ? (
    <ActivityIndicator
      style={{flex: 1}}
      color={AppColors.primary}
      size="small"
    />
  ) : (
    <>
      {infoModal()}
      {privacyPolicyModal()}
      <SearchButton
        {...props}
        data={data}
        store={store}
        showBackButton
        showQRCode
        isItems
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getCategories} />
        }>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('screen').width / 1.77,
          }}>
          <ImageBackground
            onError={() => setShowImage(false)}
            source={
              store?.ImageURL && showImage
                ? {
                    uri:
                      Constants.CONTENT_URL +
                      '/DrugStore/' +
                      store.ID +
                      '_1920x1280.jpg',
                  }
                : require('../../assets/images/pharmacy.jpeg')
            }
            imageStyle={{
              height: '100%',
            }}
            style={{
              height: '100%',
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'center',
            }}
            resizeMode="cover">
            <View
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                backgroundColor: AppColors.transparentBlack,
              }}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 5,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => setIsInfoModalVisible(true)}>
                  <Text style={{color: AppColors.white, fontSize: 23}}>
                    {store.Name + ' / ' + store.AreaName}
                  </Text>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity
                    activeOpacity={0.4}
                    style={{alignSelf: 'center', justifyContent: 'center'}}
                    onPress={() => setIsInfoModalVisible(true)}>
                    <AppIcon
                      type="MaterialCommunityIcons"
                      name="information-outline"
                      size={30}
                      color={AppColors.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        {banners.length > 0 && (
          <Swiper
            autoplay
            autoplayTimeout={5}
            style={{
              maxHeight: Dimensions.get('screen').width / 1.77,
              height: Dimensions.get('screen').width / 1.77,
              backgroundColor: AppColors.optionBG,
            }}
            activeDotColor={AppColors.white}
            paginationStyle={{bottom: 5, position: 'absolute'}}>
            {banners.map((banner: any) => (
              <TouchableOpacity
                activeOpacity={0.6}
                key={banner.ID}
                style={styles.banners}
                onPress={() => {
                  // alert(banner.Path)
                  banner?.Path && Linking.openURL(banner.Path).catch(() => {});
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
        {/* <View style={{width: '100%'}}>
          {React.Children.toArray(renderCategories())}
        </View> */}

        {/* {renderCategories()} */}
        {/* {recentArrived.filter((i:any)=>i.IsRecentlyArrived?true:false).length>0?renderRecentlyArrived():null} */}

        {renderStaticCategories()}

        {renderDynamicCategories()}

        {false && (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
              paddingBottom: 20,
            }}>
            <TouchableOpacity style={styles.squareCategories}>
              <Text style={{fontSize: 18, color: AppColors.primary}}>
                {Languages.Drugs}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.squareCategories}>
              <Text style={{fontSize: 18, color: AppColors.primary}}>
                {Languages.GeneralItems}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
    ...FontWeights.Light,
    ...FontSizes.Body,
    marginTop: 10,
  },
  banners: {
    height: '100%',
    width: Dimensions.get('screen').width,
    // backgroundColor: AppColors.white,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
  },
  categoryCards: {
    backgroundColor: AppColors.optionBG,
    width: Dimensions.get('screen').width * 0.45,
    height: 75,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5,
  },
  squareCategories: {
    width: Dimensions.get('screen').width / 2.1,
    height: Dimensions.get('screen').width / 2.1,
    backgroundColor: AppColors.optionBG,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5,
  },
});

export default StoreItemsScreen;
