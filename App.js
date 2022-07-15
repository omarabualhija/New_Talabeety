//@ts-nocheck
import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  ActivityIndicator,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {Provider} from 'react-redux';
import AppNavigator from './src/navigation';
import Store from './src/store';
import {persistor} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Languages} from './src/common';
import GlobalFont from 'react-native-global-font';
import {AppColors} from './src/theme';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [IsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('langID', (err, result) => {
      if (result && result == '1') {
        Languages.setLanguage('en');
      } else {
        Languages.setLanguage('ar');
      }
    });
    I18nManager.forceRTL(true);
    // Languages.setLanguage('ar');
    GlobalFont.applyGlobal('Tajawal-Medium');

    setupNotification();
    setIsLoading(false);
  }, []);

  const setupNotification = () => {
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
        }
      });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage) {
      }
    });

    messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
      }
    });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage) {
      }
    });
  };

  const reduxLoading = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <ActivityIndicator size="small" color={AppColors.primary} />
      </View>
    );
  };

  if (IsLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="small" color={AppColors.primary} />
      </View>
    );
  }
  return (
    <Provider store={Store}>
      <View style={{width: '100%', flex: 1}}>
        <StatusBar
          backgroundColor={AppColors.primary}
          translucent
          barStyle="light-content"
        />

        <PersistGate persistor={persistor} loading={reduxLoading}>
          <AppNavigator />
        </PersistGate>
      </View>
    </Provider>
  );
};

export default App;
