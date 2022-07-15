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
import {AppButton, Header, OptionCard} from '.';
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

const StoreCard = props => {
  const store = props.store;

  const {user, city, cities} = useSelector(({data}) => data);
  const [isFavorite, setIsFavorite] = React.useState(store.IsFavorite);
  const [isFollowed, setIsFollowed] = React.useState(store.IsFollowed);
  const [error, setError] = React.useState(false);
  const addPharmacyPopup = useRef();
  const heeartRef = useRef();
  const heeartbellRef = useRef();

  useEffect(() => {}, []);

  return (
    <View
      animation={props?.animation ? props?.animation : 'zoomIn'}
      useNativeDriver
      key={props.index}
      delay={props?.delay ? props?.delay : 100 + props.index * 50}
      style={[styles.cardContainer, props?.extraStyle]}>
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
                  <View
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
                  </View>
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
                  <View
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
                  </View>
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
    </View>
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
