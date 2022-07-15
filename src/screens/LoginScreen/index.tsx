import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  I18nManager,
  StatusBar,
} from 'react-native';

import {Languages} from '../../common';
import {AppColors, FontWeights, FontSizes, MaterialColors} from '../../theme';
import {saveUser} from '../../store/actions';

import {useSelector, useDispatch} from 'react-redux';
import ks from '../../services/KSAPI';
import {Header, AppButton, AppInput} from '../../components';

interface props {
  navigation: any;
  route: any;
}
// member_user: smadi@smadi.com1
// pharmacy_user: mohammedbawaneh3@gmail.com   pass = 123123
const LoginScreen = (props: props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const onLogin = () => {
    if (email == '' || password == '') {
      return Alert.alert('', Languages.FillItemsCorrect, [
        {text: Languages.Yes},
      ]);
    }
    setIsLoading(true);
    ks.Login({
      email,
      password,
      langID: Languages.langID,
    })
      .then((data: any) => {
        if (data.Success) {
          if (!data.User.IsActive) {
            return Alert.alert('', Languages.InactiveAccount, [
              {text: Languages.Yes},
            ]);
          }
          dispatch(saveUser(data.User));

          // Alert.alert(Languages.talabity, Languages.applicationCanOnly,[
          //   {text: Languages.Yes},
          // ]);
          props.navigation.replace('BottomTabs');
        } else {
          Alert.alert('', Languages.EmailOrPassIncorrect, [
            {text: Languages.Yes},
          ]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return isLoading ? (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="small" color={AppColors.primary} />
    </View>
  ) : (
    <KeyboardAvoidingView
      style={{width: '100%', flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={AppColors.primary} />
      <Header {...props} title={Languages.Login} />

      <ScrollView
        style={{width: '100%', flex: 1}}
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../assets/images/logo2.png')}
          style={{height: 150, aspectRatio: 1, borderRadius: 15, marginTop: 20}}
          resizeMode="contain"
        />
        <Text style={styles.heading}>{Languages.Talabity}</Text>
        <AppInput
          placeholder={
            Languages.Email + '  ' + Languages.OR + '  ' + Languages.username
          }
          value={email}
          keyboardType="email-address"
          onChangeText={(text: any) => setEmail(text)}
          extraStyle={{...FontWeights.Bold}}
        />
        <AppInput
          placeholder={Languages.password}
          value={password}
          onChangeText={(text: any) => setPassword(text)}
          secureTextEntry
          extraStyle={{...FontWeights.Bold}}
        />
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('RegisterScreen');
          }}>
          <Text
            style={{
              ...FontWeights.Bold,
              color: AppColors.clickableText,
              ...FontSizes.Body,
              textAlign: 'center',
              marginVertical: 10,
              textDecorationLine: 'underline',
            }}>
            {Languages.NoAccount + ' ' + Languages.RegisterNow}
          </Text>
        </TouchableOpacity>
        <AppButton text={Languages.Login} onPress={onLogin} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  containerTopLevel: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
  },
  container: {
    marginTop: 30,

    // flex: 1,
    //  backgroundColor: AppColors.background,
  },
  logoWrap: {
    justifyContent: 'center',
    alignItems: 'center',

    flexGrow: 1,
  },
  logo: {
    width: Dimensions.get('screen').width * 0.7,
    height: (Dimensions.get('screen').width * 0.45) / 2,
  },
  subContain: {
    marginHorizontal: 26,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 15,
    //   elevation: 1,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 10,
    //  backgroundColor: 'rgba(255,255,255,0.4)',
  },
  loginForm: {},
  inputWrap: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    borderColor: '#000',
    ...FontWeights.Regular,
    borderBottomWidth: 1,
    // paddingTop: 10,
    marginBottom: 10,
  },
  input: {
    borderColor: '#9B9B9B',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    height: 40,
    marginTop: 10,
    marginLeft: 10,
    paddingHorizontal: 5,
    paddingTop: 0,
    paddingBottom: 8,
    flex: 1,
  },
  loginButton: {
    marginVertical: 10,
    backgroundColor: AppColors.primary,
    borderRadius: 5,
    // height: 25,
    ...FontWeights.Regular,

    elevation: 1,
  },
  separatorWrap: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    borderBottomWidth: 1,
    flexGrow: 1,
    borderColor: '#000',
  },
  separatorText: {
    paddingHorizontal: 5,
    ...FontWeights.Regular,
  },
  signUp: {
    ...FontWeights.Regular,
    fontSize: 15,
    // marginTop: 20
  },
  highlight: {
    ...FontWeights.Bold,
    color: AppColors.primary,
    fontSize: 18,
  },
  heading: {
    ...FontWeights.Bold,
    color: AppColors.primary,
    fontSize: 40,
    margin: 20,
  },
});
