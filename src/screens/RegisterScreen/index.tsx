import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  I18nManager,
  Linking,
} from 'react-native';
import {Languages, AppIcon, Constants} from '../../common';
import {
  AppColors,
  FontWeights,
  FontSizes,
  Fonts,
  MaterialColors,
} from '../../theme';
import FastImage from 'react-native-fast-image';
import {saveUser} from '../../store/actions';
import {useSelector, useDispatch} from 'react-redux';
import {default as FAIcon} from 'react-native-vector-icons/dist/Entypo';
import ks from '../../services/KSAPI';
import {Header, AppButton, AppInput} from '../../components';
import PhoneInput from 'react-native-phone-input';
import {call} from 'react-native-reanimated';

interface props {
  navigation: any;
  route: any;
}

const RegisterScreen = (props: props) => {
  const phoneRef = useRef();
  const [name, setName] = useState('');
  const [userName, setuserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [OtpNumber, setOtpNumber] = useState('');
  const [isotp, setisotp] = useState(false);
  const [loading, setloading] = useState(false);
  const [IsCheckUserName, setIsCheckUserName] = useState(false);
  const [IsCheckPhone, setIsCheckPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [eyerePassword, seteyerePassword] = useState(false);
  const [NewUser, setNewUser] = useState([]);
  const [eyePassword, seteyePassword] = useState(false);
  const [valid, SetValid] = useState('');
  useEffect(() => {
    setIsLoading(false);
  }, []);
  const CheckOtp = () => {
    ks.UserVerifyOTP({
      ID: NewUser?.ID,
      OTP: OtpNumber,
    }).then((data: any) => {
      if (data.success == 1) {
        Alert.alert(Languages.Success, Languages.RegisterRequestPending, [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
          {
            text: Languages.Contact,
            onPress: () => Linking.openURL(`tel:${'+9647840201997'}`),
          },
        ]);
        props.navigation.navigate('LoginScreen');
        setloading(true);
      } else {
      }
    });
  };
  const CheckUserName = () => {
    console.log(userName);
    setIsCheckUserName(true);
    ks.CheckUserName({
      UserName: userName,
    }).then((data: any) => {
      console.log(data);
      if (data.Success) {
        setIsCheckUserName(data.Success);
      } else {
        setIsCheckUserName(false);
        CheckPhone();
      }
    });
  };
  const CheckPhone = () => {
    let _phone = phoneNumber[0] == 0 ? phoneNumber.slice(1) : phoneNumber;

    ks.CheckPhone({
      Phone: _phone,
    }).then((data: any) => {
      if (data.Success) {
        console.log(data);
        setIsCheckPhone(data.Success);
      } else {
        setIsCheckPhone(false);
        Step2();
      }
    });
  };
  const sendOtp = (id = null) => {
    console.log();
    setloading(false);
    ks.OtpsendSMS({
      UserID: id || NewUser?.ID,
      LangID: Languages.langID,
    }).then((data: any) => {
      if (data.Success) {
        setisotp(true);
        setloading(true);
      }
    });
  };
  const Step2 = () => {
    if (!userName || !password || !name || !confirmPassword || !phoneNumber) {
      return Alert.alert('', Languages.FillItemsCorrect, [
        {text: Languages.Yes},
      ]);
    } else if (email.length > 0) {
      if (!email.includes('.') || !email.includes('@')) {
        return Alert.alert('', Languages.EnterValidEmail, [
          {text: Languages.Yes},
        ]);
      }
    } else if (phoneNumber.length < 7) {
      return Alert.alert('', Languages.EnterValidPhoneNumber, [
        {text: Languages.Yes},
      ]);
    } else if (password !== confirmPassword) {
      return Alert.alert('', Languages.PasswordDoesntMatch, [
        {text: Languages.Yes},
      ]);
    }
    // if (IsCheckUserName) {
    //   return Alert.alert('', Languages.IsUserName, [{text: Languages.Yes}]);
    // }
    // if (IsCheckPhone) {
    //   return Alert.alert('', Languages.IsPhone, [{text: Languages.Yes}]);
    // }
    else {
      setIsLoading(true);
      setTimeout(() => {
        onRegister();
      }, 1000);
    }
  };
  const onRegister = () => {
    setIsLoading(true);
    let _phone = phoneNumber[0] == 0 ? phoneNumber.slice(1) : phoneNumber;
    console.log(_phone);
    ks.Register({
      userName: userName,
      email: email,
      password: password,
      name: name,
      phone: _phone,
      langID: Languages.langID,
    })
      .then((data: any) => {
        console.log(data);
        if (data.Success) {
          setNewUser(data.User);
          sendOtp(data.User.ID);
          setisotp(true);
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
      <Header
        {...props}
        title={!isotp ? Languages.RegisterNow : Languages.OTP}
        showBackIcon
      />
      <FastImage
        source={require('../../assets/images/logo2.png')}
        style={{
          height: 120,
          width: 120,
          alignSelf: 'center',
          marginTop: 10,
          borderRadius: 10,
          borderWidth: 1.4,
          borderColor: AppColors.primary,
          marginBottom: 10,
        }}
      />
      {!isotp ? (
        <ScrollView
          style={{
            width: '100%',
            height: '100%',
            borderWidth: 2,
            borderRadius: 10,
            borderColor: AppColors.primary,
            paddingTop: 10,
          }}
          contentContainerStyle={{alignItems: 'center'}}
          showsVerticalScrollIndicator={false}>
          <AppInput
            containerExtraStyle={{
              borderWidth: 2,
              borderColor: 'red',
            }}
            placeholder={Languages.ItemName + ' ' + Languages.owner}
            value={name}
            onChangeText={(text: any) => {
              setName(text);
            }}
            extraStyle={{textAlign: 'left', ...FontWeights.Bold}}
          />
          <AppInput
            containerExtraStyle={{
              borderWidth: 2,
              borderColor: 'red',
            }}
            placeholder={Languages.username}
            value={userName}
            onChangeText={(text: any) => {
              setuserName(text);
            }}
            extraStyle={{textAlign: 'left', ...FontWeights.Bold}}
          />
          {IsCheckUserName && (
            <View
              style={{
                width: '80%',
              }}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 15,
                  fontFamily: 'Tajawal-Bold',
                }}>
                {' '}
                {Languages.IsUserName}
              </Text>
            </View>
          )}
          <AppInput
            placeholder={Languages.Email}
            value={email}
            onChangeText={(text: any) => {
              setEmail(text);
            }}
            extraStyle={{textAlign: 'left', ...FontWeights.Bold}}
          />
          <View
            style={{
              borderWidth: 2,
              borderColor: 'red',
              width: '80%',
              borderRadius: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'red',
                paddingHorizontal: 10,
                //  borderEndColor: AppColors.primary,
                // borderEndWidth: 1,
              }}>
              +964
            </Text>
            <TextInput
              value={phoneNumber}
              style={{
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                ...FontWeights.Bold,
                flex: 1,
              }}
              onChangeText={(text: any) => {
                if (isNaN(text)) return;
                setPhoneNumber(text);
              }}
              placeholder={Languages.PhoneNumber}
              keyboardType="number-pad"
            />
          </View>

          {/* /////////////////////////////////////////////////////////////////////////// */}
          {/* <View
            style={{
              borderWidth: 2,
              borderColor: 'red',
              width: '80%',
              borderRadius: 15,
              overflow: 'hidden',
            }}>
            <PhoneInput
              textProps={{
                textAlign: 'right',
              }}
              onPressFlag={() => ''}
              initialValue={'96479XXXXXXX'}
              allowZeroAfterCountryCode={false}
              initialCountry="iq"
              textStyle={{
                width: '100%',
              }}
              style={{
                width: '100%',
                flexDirection: 'row',
                height: 40,
                marginTop: 10,
                paddingHorizontal: 8,
                margin: 0,

                // borderBottomColor: AppColor.blackDivide,
                //  borderBottomWidth: 1,
              }}
              flagStyle={{
                opacity: 1,
                margin: 4,
                resizeMode: 'contain',
                backgroundColor: 'transparent',
                borderWidth: 0,
                width: 30,
                height: 20,
              }}
              onChangePhoneNumber={t => {
                if (isNaN(t)) return;
                setPhoneNumber(t);
              }}
            />
          </View> */}
          {/* /////////////////////////////////////////////////////////////////////////// */}

          {IsCheckPhone && (
            <View
              style={{
                width: '80%',
              }}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 15,
                  fontFamily: 'Tajawal-Bold',
                }}>
                {' '}
                {Languages.IsPhone}
              </Text>
            </View>
          )}
          <View
            style={{
              width: '80%',

              borderWidth: 2,
              borderColor: 'red',
              borderRadius: 15,
              marginBottom: 10,
              backgroundColor: 'rgba(255,255,255,0.5)',
              margin: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
            }}>
            <TextInput
              style={{
                ...FontWeights.Bold,
                // textAlign:'right'
                width: '100%',
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                color: '#000',
              }}
              placeholder={Languages.password}
              placeholderTextColor="gray"
              onChangeText={(text: any) => {
                setPassword(text);
              }}
              secureTextEntry={eyePassword ? true : false}
            />
            <TouchableOpacity
              style={{marginTop: 15, right: 20}}
              onPress={() => seteyePassword(!eyePassword)}>
              <FAIcon name={eyePassword ? 'eye-with-line' : 'eye'} size={20} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '80%',

              borderWidth: 2,
              borderColor: 'red',
              borderRadius: 15,
              marginBottom: 10,
              backgroundColor: 'rgba(255,255,255,0.5)',
              margin: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
            }}>
            <TextInput
              style={{
                ...FontWeights.Bold,
                // textAlign:'right'
                width: '100%',
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                color: '#000',
              }}
              placeholder={Languages.ConfirmPassword}
              placeholderTextColor="gray"
              onChangeText={(text: any) => {
                setConfirmPassword(text);
              }}
              secureTextEntry={eyerePassword ? true : false}
            />
            <TouchableOpacity
              style={{marginTop: 15, right: 20}}
              onPress={() => seteyerePassword(!eyerePassword)}>
              <FAIcon
                name={eyerePassword ? 'eye-with-line' : 'eye'}
                size={20}
              />
            </TouchableOpacity>
          </View>

          <AppButton
            text={Languages.RegisterNow}
            onPress={() => {
              setIsCheckPhone(false);
              setIsCheckUserName(false);
              CheckUserName();
            }}
          />
        </ScrollView>
      ) : (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontFamily: Fonts.Bold,
              fontSize: 25,
              color: AppColors.primary,
              alignSelf: 'center',
              marginHorizontal: 5,
              width: '90%',
              marginBottom: 20,
              textAlign: 'center',
            }}>
            {!loading ? Languages.VerifyText : Languages.sendOtp}
          </Text>
          <Text
            style={{
              marginTop: 5,
              fontFamily: Fonts.Bold,
              fontSize: 25,
              marginBottom: 20,
              color: AppColors.primary,
              alignSelf: 'center',
              marginHorizontal: 5,
              width: '90%',

              textAlign: 'center',
            }}>
            {Languages.Enterotp}
          </Text>
          <TextInput
            style={{
              backgroundColor: '#fff',
              width: 100,
              fontSize: 20,
              color: '#000',
              borderRadius: 15,
              borderColor: AppColors.primary,
              borderWidth: 2,
            }}
            textAlign="center"
            placeholderTextColor="gray"
            value={OtpNumber}
            onChangeText={(text: any) => {
              if (OtpNumber.length <= 3 || text.length <= 3) setOtpNumber(text);
            }}
            keyboardType={'number-pad'}
          />
          <View
            style={{
              width: '100%',
              //  backgroundColor:'red',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                CheckOtp();
              }}
              style={{
                width: 130,
                height: 60,
                marginLeft: 5,
                marginRight: 5,
                backgroundColor: AppColors.primary,
                marginTop: 15,
                borderRadius: 15,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Bold,
                  fontSize: 15,
                  color: AppColors.white,
                  alignSelf: 'center',
                  marginHorizontal: 5,
                  width: '90%',

                  textAlign: 'center',
                }}>
                {Languages.send}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                sendOtp();
              }}
              style={{
                width: 130,
                height: 60,
                marginLeft: 5,
                marginRight: 5,
                backgroundColor: AppColors.primary,
                marginTop: 15,
                borderRadius: 15,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Bold,
                  fontSize: 15,
                  color: AppColors.white,
                  alignSelf: 'center',
                  marginHorizontal: 5,
                  width: '90%',

                  textAlign: 'center',
                }}>
                {Languages.resendOtp}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  containerTopLevel: {
    flex: 1,
    backgroundColor: 'transparent',
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
