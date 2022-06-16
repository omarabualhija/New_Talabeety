import React, {useRef, useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  Dimensions,
  I18nManager,
} from 'react-native';
import ks from '../../services/KSAPI';
import Modal from 'react-native-modalbox';
import {logout} from '../../store/actions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {AppButton, Header, OptionCard} from '../../components';
import Geolocation from 'react-native-geolocation-service';
import Permissions, {PERMISSIONS, check} from 'react-native-permissions';
import {useSelector, useDispatch} from 'react-redux';
import {AppIcon, Constants, Languages} from '../../common';
import {Transition, Transitioning} from 'react-native-reanimated';
import {ActivityIndicator} from 'react-native';
import {MaterialColors, FontWeights, FontSizes, AppColors} from '../../theme';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
const transition = (
  <Transition.Together>
    <Transition.In type="scale" durationMs={100} />
    <Transition.Change />
    <Transition.Out type="scale" durationMs={100} />
  </Transition.Together>
);

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

const ProfileScreen = props => {
  const {user, isLoggedIn, cities} = useSelector(({data}) => data);
  const dispatch = useDispatch();
  const pharmacyOwner = user?.MemberOf[0]?.ID === Constants.ownerGUID;

  const [currentIndex, setCurrentIndex] = useState(null);
  const [image, setImage] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [Refresh, setRefresh] = useState(false);
  const [ShowError, setShowError] = useState(false);
  const [NameAr, setNameAr] = useState('');
  const [NameEn, setNameEn] = useState('');
  const [UserName, setUserName] = useState('');
  const [LocationAr, setLocationAr] = useState('');
  const [isSelected, setisSelected] = useState(true);
  const [LocationEn, setLocationEn] = useState('');
  const [Loclatitude, setLoclatitude] = useState(31.955972); //31.955972
  const [Loclongitude, setLoclongitude] = useState(35.896192); //35.896192
  const [userLocation, setuserLocation] = useState('');
  const [name, setName] = useState('');
  const [nameCity, setnameCity] = useState(Languages.SelectCity);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const ref = useRef();
  const addPharmacyPopup = useRef();
  const addUserPopup = useRef();
  const selectedLocation = useRef();
  const selectedCity = useRef();
  useEffect(() => {
    if (!user.TherePharmacy) {
      addPharmacyPopup.current.open();
    }
  }, []);
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
  const GoToLogin = () => {
    dispatch(logout());
    props.navigation.replace('LoginStack');
  };
  const primaryTabs = () => {
    let arr = [];
    if (isLoggedIn) {
      pharmacyOwner &&
        arr.push({
          name: Languages.AddUser,
          data: null,
          onPress: () => addUserPopup.current.open(),
          iconType: 'Ionicons',
          iconName: 'person-add',
          iconSize: 25,
        });
      pharmacyOwner &&
        arr.push({
          name: Languages.Members,
          data: null,
          onPress: () => props.navigation.navigate('MembersScreen'),
          iconType: 'Ionicons',
          iconName: 'person-add',
          iconSize: 25,
        });
      // arr.push({
      //   name: Languages.OrderHistory,
      //   data: null,
      //   onPress: () => null,
      //   image: require('../../assets/images/myorders.png'),
      // });
      arr.push({
        name: Languages.EditProfile,
        data: null,
        onPress: () => props.navigation.navigate('EditProfileScreen'),
        iconType: 'FontAwesome',
        iconName: 'user',
      });
    }
    // arr = arr.concat([
    //   {
    //     name: Languages.contactus,
    //     data: null,
    //     onPress: () => Linking.openURL(`tel:${contactPhoneNumber}`),
    //     iconType: 'Ionicons',
    //     iconName: 'call',
    //     iconSize: 25,
    //   },
    // ]);
    if (isLoggedIn) {
      arr.push({
        name: Languages.Logout,
        data: null,
        onPress: () => {
          dispatch(logout());
          props.navigation.replace('LoginStack');
        },
        iconType: 'MaterialCommunityIcons',
        iconName: 'logout',
      });
    } else {
      arr.push({
        name: Languages.Login,
        data: null,
        onPress: () => {
          props.navigation.replace('LoginStack');
        },
        iconType: 'MaterialCommunityIcons',
        iconName: 'login',
      });
    }
    return arr;
  };

  const addPharmacyModal = () => {
    return (
      <Modal
        ref={addPharmacyPopup}
        swipeToClose={false}
        onClosed={() => {
          if (user.TherePharmacy) {
            setShowError(false);
            setImage(null);
          }
        }}
        backButtonClose={user?.TherePharmacy ? true : false}
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
          title={Languages.AddPharmacy}
          showCloseIcon
          extraStyle={{height: 50, paddingTop: 0}}
          onClosePress={() => {
            if (user.TherePharmacy) addPharmacyPopup.current.close();
            else
              Alert.alert(Languages.Talabity, Languages.applicationCanOnly, [
                {text: 'OK', onPress: () => {}},
              ]);
          }}
        />

        {Loading ? (
          <ActivityIndicator
            size="large"
            color={AppColors.primary}
            style={{flex: 1}}
          />
        ) : (
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
                      borderWidth: 2,
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
                  style={[
                    styles.input,
                    {
                      borderWidth: 2,
                    },
                  ]}
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
                      borderWidth: 2,
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
                      borderWidth: 2,
                      borderColor: 'red',
                      borderWidth:
                        ShowError && pharmacy.AreaID.length === 0 ? 2 : 0,
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
                  style={[
                    styles.input,
                    {
                      borderWidth: 2,
                    },
                  ]}
                  value={LocationAr}
                  onChangeText={txt => setLocationAr(txt)}
                  placeholder={Languages.LocationAr}
                />
                <TextInput
                  numberOfLines={1}
                  multiline
                  style={[
                    styles.input,
                    {
                      borderWidth: 2,
                    },
                  ]}
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
                      borderWidth: 2,
                      borderColor: 'red',
                    }}>
                    {image?.base64 ? (
                      <Image
                        style={{width: '100%', height: '100%'}}
                        source={{uri: 'data:image/png;base64,' + image.base64}}
                        resizeMode="contain"
                      />
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
                            '';
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
              extraStyle={{
                position: 'absolute',
                bottom: 0,
                alignSelf: 'center',
              }}
            />
          </KeyboardAvoidingView>
        )}
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

  const addNewPharmacy = () => {
    setLoading(true);
    if (
      NameAr.trim().length === 0 ||
      pharmacy.AreaID.length === 0 ||
      pharmacy.Phone.length < 5 ||
      image?.base64 === undefined
    ) {
      setShowError(true);
      return alert(Languages.FillWithValidData);
    }
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
      },
      namear: NameAr,
      nameen: NameEn,
      image64: image?.base64,
      Locationar: LocationAr,
      Locationen: LocationEn,
    }).then(data => {
      if (!user.TherePharmacy) {
        setLoading(true);
        GoToLogin();
      } else {
        addPharmacyPopup.current.close();

        alert(data.Message);
      }

      setLoading(false);
    });
  };

  const addUserModal = () => {
    return (
      <Modal
        ref={addUserPopup}
        swipeToClose={false}
        onClosed={() => setShowError(false)}
        backButtonClose
        useNativeDriver
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
          title={Languages.AddUser}
          showCloseIcon
          extraStyle={{height: 50, paddingTop: 0}}
          onClosePress={() => addUserPopup.current.close()}
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
                style={styles.input}
                value={name}
                onChangeText={txt => setName(txt)}
                placeholder={Languages.Name}
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={styles.input}
                value={email}
                onChangeText={txt => setEmail(txt)}
                placeholder={Languages.Email}
                keyboardType="email-address"
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={[styles.input, {textAlign: 'right'}]}
                value={phoneNumber}
                onChangeText={text => {
                  if (isNaN(text)) return;
                  setPhoneNumber(text);
                }}
                placeholder={Languages.PhoneNumber}
                keyboardType="phone-pad"
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={[styles.input]}
                value={UserName}
                onChangeText={txt => setUserName(txt)}
                placeholder={Languages.username}
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={[styles.input, {textAlign: 'right'}]}
                value={password}
                onChangeText={txt => setPassword(txt)}
                secureTextEntry
                placeholder={Languages.password}
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={[styles.input, {textAlign: 'right'}]}
                value={confirmPassword}
                onChangeText={txt => setConfirmPassword(txt)}
                secureTextEntry
                placeholder={Languages.ConfirmPassword}
              />

              <View style={{height: 80}} />
            </View>
          </ScrollView>
          <AppButton
            onPress={addNewUser}
            isLoading={false}
            text={Languages.Confirm}
            extraStyle={{position: 'absolute', bottom: 0, alignSelf: 'center'}}
          />
        </KeyboardAvoidingView>
      </Modal>
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
  const addNewUser = () => {
    if (
      !password ||
      !name ||
      UserName.trim().length === 0 ||
      !confirmPassword ||
      !phoneNumber
    ) {
      return Alert.alert('', Languages.FillItemsCorrect, [
        {text: Languages.OK},
      ]);
    }

    if (password !== confirmPassword) {
      return Alert.alert('', Languages.PasswordDoesntMatch, [
        {text: Languages.OK},
      ]);
    }

    ks.Register({
      OwnerID: user.ID,
      email,
      password,
      userName: UserName,
      name,
      phone: phoneNumber,
      langID: Languages.langID,
      IsSubUser: 1,
    }).then(data => {
      if (data.Success === 1) {
        addUserPopup.current.close();
        Alert.alert('', Languages.AddedSuccessfully);
      } else {
        if (data?.Message) {
          Alert.alert('', Languages.UserExist);
        } else {
          Alert.alert('', Languages.SomethingWentWrong);
        }
      }
    });
  };

  return (
    <>
      <Header {...props} title={Languages.MyProfile} />
      {addPharmacyModal()}
      {addUserModal()}
      {SelectLocation()}
      {selectedCityUser()}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
        }}>
        {isLoggedIn && (
          <>
            {false && (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  props.navigation.navigate('EditProfileScreen', {
                    editPicture: true,
                  });
                }}
                style={{
                  borderColor: AppColors.primary,
                  borderWidth: 1,
                  borderRadius: 10,
                  height: 200,
                  width: '60%',
                  alignItems: 'center',
                  padding: 5,
                  marginTop: 10,
                }}>
                {user.Image ? (
                  <Image
                    source={{uri: Constants.CONTENT_URL + user.Image}}
                    style={{
                      height: '100%',
                      width: '100%',
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <AppIcon
                    type="MaterialCommunityIcons"
                    size={200}
                    name="camera"
                    color={AppColors.grey}
                  />
                )}
              </TouchableOpacity>
            )}

            <View
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                width: '100%',
                height: 30,
                marginTop: 20,
              }}>
              <Text style={styles.text}>{user.Name}</Text>
            </View>
          </>
        )}
        {pharmacyOwner && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '100%',
              marginTop: 20,
            }}>
            <TouchableOpacity
              style={[styles.headerBtns, {borderWidth: 2, borderColor: 'red'}]}
              onPress={() => addPharmacyPopup.current.open()}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <AppIcon
                  type={'Ionicons'}
                  name={'add'}
                  size={40}
                  color={AppColors.primary}
                />
                <Text style={styles.headerBtnsText}>
                  {Languages.AddPharmacy}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBtns}
              onPress={() => {
                props.navigation.navigate('MyPharmaciesScreen');
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <AppIcon
                  type={'MaterialCommunityIcons'}
                  name={'hospital-building'}
                  size={40}
                  color={AppColors.primary}
                />
                <Text style={styles.headerBtnsText}>
                  {Languages.MyPharmacies}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <Transitioning.View
          transition={transition}
          ref={ref}
          style={{marginTop: 20, padding: 10}}>
          {primaryTabs().map((item, index) => {
            return (
              <OptionCard
                currentIndex={currentIndex}
                index={index}
                setCurrentIndex={setCurrentIndex}
                item={item}
                key={index}
                animationRef={ref}
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
    width: '100%',
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
  text: {
    fontSize: 22,
    ...FontWeights.Bold,
    color: AppColors.primary,
  },
  tabStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.grey,
    width: '100%',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 6,
    borderColor: AppColors.black,
    borderWidth: 1,
  },
  headerBtns: {
    borderColor: AppColors.primary,
    borderWidth: 2,
    borderRadius: 15,
    width: '35%',
    height: 'auto',
    aspectRatio: 1,
    maxWidth: 220,
    alignItems: 'center',
    padding: 5,
    marginTop: 10,
    justifyContent: 'center',
    backgroundColor: AppColors.optionBG,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
  headerBtnsText: {
    ...FontWeights.Bold,
    fontSize: 16,
    color: AppColors.primary,
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
    borderWidth: 0,
    borderColor: 'red',
    ...FontWeights.Bold,
    fontSize: 18,
    textAlign: 'right',
  },
  citiesList: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    zIndex: 3,
    elevation: 3,
    margin: 3,
    borderColor: AppColors.primary,
    borderWidth: 0,
  },
  MapContainer: {
    // ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  map: {
    flex: 1,
    //  ...StyleSheet.absoluteFillObject,
  },
});

export default ProfileScreen;
