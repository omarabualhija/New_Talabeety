//@ts-nocheck
import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Linking,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  Platform,
  Pressable,
  I18nManager,
} from 'react-native';
import ks from '../services/KSAPI';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import Geolocation from 'react-native-geolocation-service';
import {AppButton, Header, OptionCard} from '../components';
import Permissions, {PERMISSIONS, check} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  MaterialColors,
  FontWeights,
  FontSizes,
  Fonts,
  AppColors,
} from '../theme';
import {AppIcon, Constants, Languages} from '../common';
import Modal from 'react-native-modalbox';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import * as Animatable from 'react-native-animatable';

const WIDTH = Dimensions.get('screen').width;

let pharmacy = {
  ID: 0,
  AreaID: '',
  Enabled: true,
  Email: '',
  Phone: '',
  OwnerID: '',
  GPSLocation: '',
  IsDrugStore: 0,
};
const StoreCard = (props: any) => {
  const store = props.store;

  const {user, city, cities} = useSelector(({data}: any) => data);
  const [isFavorite, setIsFavorite] = React.useState(store.IsFavorite);
  const [isFollowed, setIsFollowed] = React.useState(store.IsFollowed);
  const [error, setError] = React.useState(false);
  const addPharmacyPopup = useRef();
  const heeartRef = useRef();
  const heeartbellRef = useRef();
  const [image, setImage] = useState(null);
  const [Refresh, setRefresh] = useState(false);
  const [ShowError, setShowError] = useState(false);
  const [NameAr, setNameAr] = useState('');
  const [NameEn, setNameEn] = useState('');
  const [ImageUrl, setImageUrl] = useState('');
  const [ID, setID] = useState('');
  const [UserName, setUserName] = useState('');
  const [LocationAr, setLocationAr] = useState('');
  const [isSelected, setisSelected] = useState(false);
  const [LocationEn, setLocationEn] = useState('');
  const [Loclatitude, setLoclatitude] = useState(31.955972); //31.955972
  const [Loclongitude, setLoclongitude] = useState(35.896192); //35.896192
  const [nameCity, setnameCity] = useState(Languages.City);
  const selectedLocation = useRef();
  const selectedCity = useRef();
  useEffect(() => {}, []);
  const selectedCityUser = () => {
    return (
      <Modal
        ref={selectedCity}
        backButtonClose
        coverScreen={Platform.OS == 'android'}
        swipeToClose={false}
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={[
            styles.MapContainer,
            {
              backgroundColor: '#fff',
            },
          ]}>
          <Text
            style={{
              fontSize: 25,
              textAlign: 'center',
              marginTop: 7,
              color: '#000',
            }}>
            {Languages.SelectCity}
          </Text>

          <TouchableOpacity
            onPress={() => {
              selectedCity.current.close();
            }}
            style={{
              position: 'absolute',
              paddingHorizontal: 20,
              zIndex: 100,
              top: Dimensions.get('screen').height * 0.012,
              alignSelf: 'flex-start',
            }}>
            <AppIcon
              type={'AntDesign'}
              name={'close'}
              color={'#000'}
              size={30}
            />
          </TouchableOpacity>
          <View
            style={{
              marginTop: 10,
              width: '95%',
              alignSelf: 'center',
              borderWidth: 1,
              borderColor: AppColors.primary,
            }}
          />
          <FlatList
            style={{width: '100%', flex: 1}}
            contentContainerStyle={{paddingTop: 15}}
            data={cities}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    pharmacy.AreaID = item.item.ID;
                    setnameCity(Languages.City + ' ' + item.item.Name);
                    setRefresh(!Refresh);
                  }}
                  key={item.item.ID}
                  style={{
                    width: '90%',
                    marginBottom: 5,
                    alignSelf: 'center',
                    borderWidth: pharmacy.AreaID === item.item.ID ? 3 : 1,
                    borderColor: AppColors.primary,

                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      marginTop: 5,
                      textAlign: 'center',
                      marginBottom: 10,
                      fontSize: 18,
                      color: 'rgba(0,0,0,0.7)',
                    }}>
                    {item.item.Name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity
            style={{
              marginTop: 10,
              marginBottom: 10,
              paddingHorizontal: 30,
              paddingVertical: 15,
              backgroundColor: AppColors.primary,
              width: '80%',
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              zIndex: 20,

              alignSelf: 'center',
            }}
            onPress={() => {
              selectedCity.current.close();
            }}>
            <Text style={{fontSize: 18, color: '#fff'}}>
              {Languages.Confirm}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  const pickFromGallery = () => {
    launchImageLibrary(
      {
        quality: 0.6,
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: Dimensions.get('screen').width,
        maxWidth: Dimensions.get('screen').width,
      },
      _image => {
        let image = {
          uri: _image.uri,
          base64: _image.base64,
          fileName: _image.fileName,
          fileSize: _image.fileSize,
          height: _image.height,
          width: _image.width,
          type: _image.type,
        };
        setImage(image);
      },
    );
  };

  const pickFromCamera = () => {
    launchCamera(
      {
        quality: 0.6,
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: Dimensions.get('screen').width,
        maxWidth: Dimensions.get('screen').width,
      },
      _image => {
        let image = {
          uri: _image.uri,
          base64: _image.base64,
          fileName: _image.fileName,
          fileSize: _image.fileSize,
          height: _image.height,
          width: _image.width,
          type: _image.type,
        };
        setImage(image);
      },
    );
  };
  const SelectLocation = () => {
    return (
      <Modal
        ref={selectedLocation}
        backButtonClose
        coverScreen={Platform.OS == 'android'}
        swipeToClose={false}
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.MapContainer}>
          <TouchableOpacity
            onPress={() => {
              selectedLocation.current.close();
            }}
            style={{
              position: 'absolute',
              paddingHorizontal: 20,
              zIndex: 100,
              top: Dimensions.get('screen').height * 0.02,
              alignSelf: 'flex-start',
            }}>
            <AppIcon
              type={'AntDesign'}
              name={'close'}
              color={'#000'}
              size={30}
            />
          </TouchableOpacity>
          <MapView
            ref={instance => (this.map = instance)}
            initialRegion={{
              latitude: Loclatitude,
              longitude: Loclongitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            liteMode
            region={{
              latitude: Loclatitude,
              longitude: Loclongitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            style={{
              width: '100%',
              height: '100%',

              backgroundColor: AppColors.white,
            }}
            onPress={region => {
              setLoclatitude(region.nativeEvent.coordinate.latitude);
              setLoclongitude(region.nativeEvent.coordinate.longitude);
            }}>
            {
              <MapView.Marker
                coordinate={{
                  latitude: Loclatitude,
                  longitude: Loclongitude,
                  latitudeDelta: 0.008,
                  longitudeDelta: 0.008,
                }}
              />
            }
          </MapView>
          <TouchableOpacity
            style={{
              paddingHorizontal: 30,
              paddingVertical: 15,
              backgroundColor: AppColors.primary,
              width: '80%',
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              zIndex: 20,
              position: 'absolute',
              bottom: 20,
              alignSelf: 'center',
            }}
            onPress={() => {
              setisSelected(false);
              selectedLocation.current.close();
            }}>
            <Text style={{fontSize: 18, color: '#fff'}}>
              {Languages.Confirm}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  const addPharmacyModal = () => {
    return (
      <Modal
        ref={addPharmacyPopup}
        swipeToClose={false}
        onClosed={() => {
          setShowError(false);
          setImage(null);
        }}
        backButtonClose={true}
        useNativeDriver={true}
        coverScreen={true}
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
          title={Languages.EditPharmacy}
          showCloseIcon
          extraStyle={{height: 50, paddingTop: 0}}
          onClosePress={() => addPharmacyPopup.current.close()}
        />

        <KeyboardAvoidingView
          style={{width: '100%', flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView style={{width: '100%', flex: 1}}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                paddingHorizontal: 10,
                marginTop: 20,
              }}>
              <TextInput
                numberOfLines={1}
                multiline
                style={[
                  styles.input,
                  {
                    // borderWidth:
                    //   ShowError && NameAr.trim().length === 0 ? 2 : 0,
                  },
                ]}
                value={NameAr}
                onChangeText={txt => setNameAr(txt)}
                placeholder={Languages.EnterArabicName}
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={[styles.input, {}]}
                value={NameEn}
                onChangeText={txt => setNameEn(txt)}
                placeholder={Languages.EnterEnglishName}
              />

              <TextInput
                numberOfLines={1}
                multiline
                style={styles.input}
                value={pharmacy.Email}
                onChangeText={txt => {
                  pharmacy.Email = txt;
                  setRefresh(!Refresh);
                }}
                placeholder={Languages.Email}
                keyboardType="email-address"
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={[
                  styles.input,
                  {
                    //   borderWidth: ShowError && pharmacy.Phone.length < 5 ? 2 : 0,
                  },
                ]}
                value={pharmacy.Phone}
                onChangeText={txt => {
                  pharmacy.Phone = txt;
                  setRefresh(!Refresh);
                }}
                placeholder={Languages.PhoneNumber}
                keyboardType="phone-pad"
              />
              <View style={[styles.input, {borderWidth: 2}]}>
                <Text
                  onPress={() => {
                    selectedCity.current.open();
                  }}
                  style={{
                    fontSize: 20,
                    marginTop: 10,
                    color: '#222',
                  }}>
                  {nameCity}
                </Text>
              </View>

              {false && (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    paddingVertical: 5,
                    marginBottom: 15,

                    borderRadius: 10,
                  }}>
                  {cities.map(item => (
                    <Pressable
                      key={item.ID}
                      style={[
                        styles.citiesList,
                        {borderWidth: pharmacy.AreaID === item.ID ? 2 : 0},
                      ]}
                      onPress={() => {
                        pharmacy.AreaID = item.ID;
                        setRefresh(!Refresh);
                      }}>
                      <Text>{item.Name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <TextInput
                numberOfLines={1}
                multiline
                style={[styles.input, {}]}
                value={LocationAr}
                onChangeText={txt => setLocationAr(txt)}
                placeholder={Languages.LocationAr}
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={[styles.input]}
                value={LocationEn}
                onChangeText={txt => setLocationEn(txt)}
                placeholder={Languages.LocationEn}
              />

              <View
                style={{
                  width: '100%',
                  flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  marginBottom: 20,

                  height: Dimensions.get('screen').width * 0.5,
                }}>
                <View
                  style={{
                    width: Dimensions.get('screen').width * 0.5,
                    height: Dimensions.get('screen').width * 0.5,
                    backgroundColor: '#eee',
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.22,

                    shadowRadius: 2.22,
                    zIndex: 3,
                    elevation: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    // borderWidth:
                    //   ShowError && image?.base64 === undefined ? 2 : 0,
                  }}>
                  {image?.base64 || ImageUrl ? (
                    image?.base64 ? (
                      <Image
                        style={{width: '100%', height: '100%'}}
                        source={{uri: 'data:image/png;base64,' + image.base64}}
                        resizeMode="contain"
                      />
                    ) : (
                      <FastImage
                        onError={() => setError(true)}
                        source={
                          ImageUrl && !error
                            ? {
                                uri:
                                  'http://talabeety.com/content/DrugStore/' +
                                  ImageUrl +
                                  '_1920x1280.jpg',
                              }
                            : require('../assets/images/pharmacyall.jpg')
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
                    )
                  ) : (
                    <Text style={{fontSize: 17, textAlign: 'center'}}>
                      {Languages.AddOpenPharmacyAccess}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    justifyContent: 'space-evenly',
                    height: '100%',
                    flexGrow: 1,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={pickFromCamera}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 10,
                      backgroundColor: '#e9e9e9',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AppIcon
                      name="camera"
                      type="Entypo"
                      size={35}
                      color={AppColors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={pickFromGallery}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 10,
                      backgroundColor: '#e9e9e9',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AppIcon
                      name="image"
                      type="FontAwesome"
                      size={35}
                      color={AppColors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  width: '100%',

                  height: 120,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '100%',

                    borderRadius: 10,
                    backgroundColor: '#e9e9e9',
                    height: 120,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  {isSelected ? (
                    <Text
                      onPress={() => {
                        checkPermission();
                        setTimeout(function () {
                          selectedLocation.current.open();
                        }, 2000);
                      }}
                      style={{
                        fontSize: 17,
                        textAlign: 'center',
                        color: 'rgba(0,0,0,0.5)',
                      }}>
                      {Languages.SelectLocation}
                    </Text>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setisSelected(true);
                          selectedLocation.current.open();
                        }}
                        style={{
                          position: 'absolute',
                          paddingHorizontal: 20,
                          zIndex: 100,
                          top: Dimensions.get('screen').height * 0.02,
                          alignSelf: 'flex-start',
                        }}>
                        <AppIcon
                          type={'MaterialIcons'}
                          name={'add-location-alt'}
                          color={AppColors.primary}
                          size={30}
                        />
                      </TouchableOpacity>
                      <MapView
                        ref={instance => (this.map = instance)}
                        initialRegion={{
                          latitude: Loclatitude,
                          longitude: Loclongitude,
                          latitudeDelta: 0.008,
                          longitudeDelta: 0.008,
                        }}
                        liteMode
                        region={{
                          latitude: Loclatitude,
                          longitude: Loclongitude,
                          latitudeDelta: 0.008,
                          longitudeDelta: 0.008,
                        }}
                        style={{
                          width: '100%',
                          height: '100%',

                          backgroundColor: AppColors.white,
                        }}
                        onPress={region => {
                          ('');
                          // setLoclatitude(region.nativeEvent.coordinate.latitude);
                          // setLoclongitude(
                          //   region.nativeEvent.coordinate.longitude,
                          // );
                        }}>
                        {
                          <MapView.Marker
                            coordinate={{
                              latitude: Loclatitude,
                              longitude: Loclongitude,
                              latitudeDelta: 0.008,
                              longitudeDelta: 0.008,
                            }}
                          />
                        }
                      </MapView>
                    </>
                  )}
                </View>
              </View>
              <View style={{height: 80}} />
            </View>
          </ScrollView>
          <AppButton
            onPress={addNewPharmacy}
            isLoading={false}
            text={Languages.Confirm}
            extraStyle={{position: 'absolute', bottom: 0, alignSelf: 'center'}}
          />
        </KeyboardAvoidingView>
      </Modal>
    );
  };
  const addNewPharmacy = () => {
    ks.PharmacyDoAdd({
      // :{
      //   ID: 0, // if add send null or 0
      //   AreaID:"",
      //   Enabled:"",
      //   Email:"",
      //   Phone:"",
      //   OwnerID:"",
      //   GPSLocation:"",
      //   IsDrugStore:"",
      // }

      pharmacy: {
        ...pharmacy,
        OwnerID: user.ID,
        GPSLocation: Loclatitude + ',' + Loclongitude,
        ID: ID,
      },
      namear: NameAr,
      nameen: NameEn,
      image64: image?.base64 ? image?.base64 : store.ID,
      Locationar: LocationAr,
      Locationen: LocationEn,
    }).then(data => {
      addPharmacyPopup.current.close();

      alert(data.Message);
      if (props.IsMyPharmacies) {
        props.isReload();
      }
    });
  };
  const deletePharmacy = () => {
    Alert.alert(Languages.Attention, Languages.AreYouSureDeletePharmacy, [
      {text: Languages.Cancel},
      {
        text: Languages.OK,
        onPress: () => {
          ks.UserPharmacyDelete({
            UserID: user.ID,
            OwnerID: store.OwnerID,
          }).then(data => {
            if (data?.Success === 1) {
              props.afterDelete();
            } else {
              alert(Languages.SomethingWentWrong);
            }
          });
        },
      },
    ]);
  };
  const checkPermission = () => {
    if (Platform.OS === 'android') {
      Permissions.check('android.permission.ACCESS_FINE_LOCATION').then(
        response => {
          if (response != 'granted') {
            Permissions.request('android.permission.ACCESS_FINE_LOCATION')
              .then(value => {
                if (value == 'granted') {
                  watchPosition();
                } else {
                  alert(Languages.EnableLocation);
                }
              })
              .catch(error => {});
          } else if (response == 'granted') {
            watchPosition();
          }
        },
      );
    } else {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(response => {
        if (response != 'granted') {
          Permissions.request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            .then(value => {
              if (value == 'granted') {
                watchPosition();
              }
            })
            .catch(error => {});
        } else if (response == 'granted') {
          watchPosition();
        }
      });
    }
  };
  const watchPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        };
        setLoclatitude(region.latitude);
        setLoclongitude(region.longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  return (
    <Animatable.View
      animation={props?.animation ? props?.animation : 'zoomIn'}
      useNativeDriver
      key={props.index}
      delay={props?.delay ? props?.delay : 100 + props.index * 50}
      style={[styles.cardContainer, props?.extraStyle]}>
      {addPharmacyModal()}
      {SelectLocation()}
      {selectedCityUser()}
      <TouchableOpacity
        activeOpacity={0.7}
        style={{width: '100%', height: '100%'}}
        disabled={
          props.IsMyPharmacies
            ? false
            : store.IsAvailable !== Constants.USER_STORE_STATUSES.ACCEPTED
        }
        onPress={() => {
          if (!props.IsMyPharmacies) {
            props.closeModal && props.closeModal();
            props.navigation.navigate('StoreItemsScreen', {
              store,
              type: props.type,
            });
          } else {
            // setLoclongitude()
            // setLoclatitude()
            if (Languages.langID == 1) {
              setLocationEn(store.Location);
              setNameEn(store.Name);
            } else {
              setLocationAr(store.Location);
              setNameAr(store.Name);
            }

            setID(store.ID);
            store?.AdditionalImage
              ? setImageUrl(store?.AdditionalImage)
              : setImage('');
            let loc = store.GPSLocation.split(',');
            setLoclatitude(parseFloat(loc[0]));
            setLoclongitude(parseFloat(loc[1]));
            pharmacy.Email = store.Email;
            pharmacy.Phone = store.Phone;
            setnameCity(Languages.City + ' ' + store.AreaName);

            addPharmacyPopup.current.open();
          }
        }}>
        <View
          style={{
            height: '100%',
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <FastImage
            onError={() => setError(true)}
            source={
              (store.ImageURL || store.ImageURL) && !error
                ? {
                    uri:
                      'http://talabeety.com/content/DrugStore/' +
                      store.ID +
                      '_1920x1280.jpg',
                  }
                : require('../assets/images/pharmacyall.jpg')
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
                position: 'absolute',
                bottom: 5,
                left: 5,
              }}>
              <Text style={{color: AppColors.white, fontSize: 20}}>
                {store.IsAvailable === Constants.USER_STORE_STATUSES.ACCEPTED
                  ? store.Name + ' / ' + store.AreaName
                  : store.Name}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}>
              {props.isMy &&
                (store.IsAvailable ===
                  Constants.USER_STORE_STATUSES.NOT_REQUESTED ||
                  store.IsAvailable ===
                    Constants.USER_STORE_STATUSES.REQUESTED) && (
                  <TouchableOpacity
                    disabled={
                      store.IsAvailable ===
                      Constants.USER_STORE_STATUSES.REQUESTED
                    }
                    style={[
                      styles.btn,
                      store.IsAvailable ===
                        Constants.USER_STORE_STATUSES.REQUESTED && {
                        backgroundColor: AppColors.darkGrey,
                      },
                    ]}
                    onPress={() => {
                      ks.DrugStoreAddAvailable({
                        DrugStoreId: store.ID,
                        UserID: user.ID,
                        IsApproved: 0,
                      }).then(data => {
                        props.getDrugs && props.getDrugs(city);
                      });
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <AppIcon
                        type="MaterialIcons"
                        name="add-to-queue"
                        size={22}
                        color={AppColors.primary}
                      />
                      <Text style={{color: AppColors.primary, marginLeft: 5}}>
                        {Languages.JoinStore}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              {store.IsAvailable === Constants.USER_STORE_STATUSES.ACCEPTED && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.btn}
                  onPress={() => {
                    heeartRef.current.bounceIn();
                    setIsFavorite(!isFavorite);
                    ks.DrugStoreAddFavorite({
                      userID: user.ID,
                      DrugStoreID: store.ID,
                    }).then(data => {
                      // props.getDrugs && props.getDrugs(city);
                    });
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
              )}
              {store.IsAvailable === Constants.USER_STORE_STATUSES.ACCEPTED && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.btn}
                  onPress={() => {
                    heeartbellRef.current.tada();
                    setIsFollowed(!isFollowed);
                    ks.DrugStoreAddFavorite({
                      userID: user.ID,
                      DrugStoreID: store.ID,
                      isFollow: 1,
                    }).then(data => {
                      // props.getDrugs && props.getDrugs(city);
                    });
                  }}>
                  <Animatable.View
                    ref={heeartbellRef}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AppIcon
                      type="MaterialCommunityIcons"
                      name={isFollowed ? 'bell' : 'bell-outline'}
                      size={22}
                      color={AppColors.bell}
                    />
                  </Animatable.View>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
              }}>
              {true && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    props.navigation.navigate('ChatDetailsScreen', {
                      item: {
                        ...store,
                        DrugStoreID: store.ID,
                        DrugStoreName: store.Name,
                      },
                    });
                  }}>
                  <AppIcon
                    type="Ionicons"
                    name="chatbubbles-sharp"
                    size={22}
                    color={AppColors.primary}
                  />
                  <Text style={{color: AppColors.primary, marginLeft: 5}}>
                    {Languages.SendChat}
                  </Text>
                </TouchableOpacity>
              )}
              {true && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    Linking.openURL(`tel:${store.Phone}`);
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AppIcon
                      type="Ionicons"
                      name="call"
                      size={22}
                      color={AppColors.primary}
                    />
                    <Text style={{color: AppColors.primary, marginLeft: 5}}>
                      {Languages.Phonecall}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {false && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    Linking.openURL(
                      `https://www.google.com/maps/@${store?.GPSLocation},15z`,
                    );
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AppIcon
                      type="Entypo"
                      name="location"
                      size={22}
                      color={AppColors.primary}
                    />
                    <Text style={{color: AppColors.primary, marginLeft: 5}}>
                      {Languages.location}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
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
          <View
            style={{
              width: '100%',
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {false && <Text>{store.NumOfItems + ' ' + Languages.Item}</Text>}
            {props.showDelete && (
              <AppIcon
                name="trash"
                type="Ionicons"
                size={18}
                color="red"
                style={{padding: 5}}
                onPress={deletePharmacy}
              />
            )}
          </View>
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
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    color: '#222',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    zIndex: 3,
    elevation: 3,

    ...FontWeights.Bold,
    fontSize: 18,
    textAlign: 'right',
  },
  MapContainer: {
    // ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  btn: {
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 7,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContainer: {
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
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    zIndex: 12,
    elevation: 12,
  },
});

export default StoreCard;
