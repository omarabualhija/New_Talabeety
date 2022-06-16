//@ts-nocheck
import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  I18nManager,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import ks from '../../services/KSAPI';
import {Languages} from '../../common';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {saveCities, getCartItem} from '../../store/actions';
import {AppColors} from '../../theme';
// const LottieView = require('lottie-react-native');
import LottieView from 'lottie-react-native';
interface SplashScreenProps {
  navigation: any;
}

const SplashScreen = ({navigation}: SplashScreenProps) => {
  const {user, isLoggedIn, city} = useSelector(({data}: any) => data);
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem('langID').then(data => {
      if (!data) {
        Languages.setLanguage('ar');
        AsyncStorage.setItem('langID', '2').then(() => {
          I18nManager.forceRTL(true);
          I18nManager.allowRTL(true);
          RNRestart.Restart();
        });
      } else {
        if (data == '1') {
          Languages.setLanguage('en');
        } else {
          Languages.setLanguage('ar');
        }
      }

      ks.CitiesGet({langID: Languages.langID}).then(data => {
        if (data?.Success) {
          dispatch(saveCities(data.Cities));
        }
      });
    });
    setTimeout(() => {
      if (!city) {
        navigation.replace('SelectCityScreen');
      } else {
        if (isLoggedIn) {
          navigation.replace('BottomTabs');
        } else {
          navigation.replace('LoginStack');
        }
      }
    }, 3000);

    if (user !== null && user?.ID !== null && user?.ID !== '') {
      getCart();
    }
  }, []);
  const getCart = () => {
    ks.getCart({
      userid: user.ID,
      LangID: Languages.langID,
    }).then(data => {
      dispatch(getCartItem(data));
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'rgb(40, 44, 107)'} />
      <LottieView
        source={require('../../assets/images/Talabeety.json')}
        autoPlay
        loop
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(40, 44, 107)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
