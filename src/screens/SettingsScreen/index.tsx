//@ts-nocheck
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  I18nManager,
  ScrollView,
  Share,
  Dimensions,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {AppIcon, Constants, Languages} from '../../common';
import {AppButton, Header, OptionCard} from '../../components';
import Modal from 'react-native-modalbox';
import {
  MaterialColors,
  FontWeights,
  FontSizes,
  AppColors,
  Fonts,
} from '../../theme';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Transition, Transitioning} from 'react-native-reanimated';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {saveCity} from '../../store/actions';
import * as Animatable from 'react-native-animatable';
import App from '../../../App';

const transition = (
  <Transition.Together>
    <Transition.In type="scale" durationMs={100} />
    <Transition.Change />
    <Transition.Out type="scale" durationMs={100} />
  </Transition.Together>
);
const contactPhoneNumber = '00962797233837';
const contactWhatsappNumber1 = '00962796708229';
const contactWhatsappNumber2 = '009647840201997';
const contactWhatsappNumber1key = '+962796708229';
const contactWhatsappNumber2key = '+9647840201997';
const contactEmail = 'info@talabeety.com';
const facebook = 'https://www.facebook.com/profile.php?id=100076785457954';
const instagram = 'https://www.instagram.com/talabeety/?hl=en';
const Youtube = 'https://youtube.com/channel/UCL4ITks5Qipyff4eIVDLGmQ';
const SettingsScreen = (props: any) => {
  const {city, cities} = useSelector(({data}: any) => data);
  const [currentIndex, setCurrentIndex] = React.useState(null);
  const ref = React.useRef(null);
  const policy = React.useRef<any>(null);
  const AboutRef = React.useRef<any>();

  const dispatch = useDispatch();

  const primarySettings = () => {
    let arr = [
      {
        name: Languages.Language,
        data: langButtons(),
        onPress: null,
        iconType: 'FontAwesome',
        iconName: 'language',
      },
      {
        name: Languages.City,
        data: citySelect(),
        onPress: null,
        iconType: 'MaterialCommunityIcons',
        iconName: 'city',
      },
      {
        name: Languages.TermsAndConditions,
        data: null,
        onPress: () => policy.current.open(),
        iconType: 'Octicons',
        iconName: 'law',
      },
      {
        name: Languages.About,
        data: null,
        onPress: () => AboutRef.current.open(),
        iconType: 'MaterialCommunityIcons',
        iconName: 'information-outline',
        iconSize: 25,
      },
      {
        name: Languages.contactus,
        data: contactInfoContainer(),
        onPress: null,
        iconType: 'Ionicons',
        iconName: 'call',
        iconSize: 25,
      },
      {
        name: Languages.ShareApp,
        data: null,
        onPress: () => onShare(),
        iconType: 'MaterialCommunityIcons',
        iconName: 'share-variant',
        iconSize: 25,
      },
    ];
    return arr;
  };

  const policyModal = () => {
    return (
      <Modal
        ref={policy}
        swipeToClose={false}
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
          overflow: 'hidden',
        }}>
        <View
          style={{
            position: 'absolute',
            alignSelf: 'center',
            width: Dimensions.get('screen').width * 2,
            height: Dimensions.get('screen').height * 1.6,
            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            opacity: 0.3,
            transform: [
              {rotate: '30deg'},
              {translateX: -Dimensions.get('screen').width / 2.5},
            ],
          }}>
          <View
            style={{
              height: '100%',
              flex: 1,
              backgroundColor: '#192a56',
            }}
          />
          <View
            style={{
              height: '100%',
              flex: 1,
              backgroundColor: '#44bd32',
            }}
          />
        </View>

        <Header
          {...props}
          // title={store.Name}
          title={Languages.TermsAndConditions}
          showCloseIcon
          extraStyle={{height: 50, paddingTop: 0}}
          onClosePress={() => policy.current.close()}
        />

        <ScrollView style={{width: '100%', flex: 1}}>
          {/* <Text style={{fontSize:28, color:AppColors.primary, alignSelf:'center', paddingTop:15}}>Talabeety</Text> */}

          <Image
            source={require('../../assets/images/logo2.png')}
            style={{
              width: Dimensions.get('screen').width * 0.4,
              height: Dimensions.get('screen').width * 0.4,
              alignSelf: 'center',
              marginVertical: 30,
              borderRadius: 15,
            }}
            resizeMode="cover"
          />

          <Text
            style={{
              fontSize: 16,
              paddingHorizontal: 19,
              paddingBottom:15,
              lineHeight: 20,
              letterSpacing: 0.6,
              color: '#000',
              width: '100%',
            }}>
            {Constants.privacyPolicyPart1.replace(/[.]/g, '\n')}
          </Text>

          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#fff',
                paddingHorizontal: 10,
                paddingVertical: 5,
                //backgroundColor:'#dbb3b2',
                //borderWidth: 1,
                //borderColor: "#f00",
                backgroundColor: '#002E3Dcc',
                textAlign: 'center',
                borderRadius: 16,
              }}>
              {Constants.privacyPolicyPart2.replace(/[.]/g, '\n')}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              padding: 19,
              lineHeight: 20,
              letterSpacing: 0.6,
              color: '#000',
              width: '100%',
            }}>
            {Constants.privacyPolicyPart3.replace(/[.]/g, '\n')}
          </Text>
        </ScrollView>
      </Modal>
    );
  };

  const contactInfoContainer = () => {
    // Linking.openURL(`tel:${contactPhoneNumber}`)
    return (
      <Animatable.View
        animation="fadeInLeftBig"
        style={{
          width: '100%',
          flexDirection: 'column',
          height: 200,
          justifyContent: 'space-evenly',
          alignItems: 'flex-start',
          marginVertical: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
          }}>
          <Image
            source={require('../../assets/images/JO.png')}
            style={{
              width: 24,
              height: 18,
            }}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: 16,
              color: AppColors.primary,
              marginHorizontal: 5,
            }}>
            {Languages.whatsappContact}
          </Text>

          <Text
            onPress={() => {
              Linking.openURL(
                `whatsapp://send?text=''&phone=${contactWhatsappNumber1key}`,
              ).catch(() => {});
              Linking.canOpenURL(
                `whatsapp://send?text=''&phone=${contactWhatsappNumber1key}`,
              ).then(supported => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  Alert.alert('Erorr 101 ', Languages.whatsapp);
                }
              });
            }}
            style={{
              fontSize: 16,
              color: AppColors.primary,
              textDecorationLine: 'underline',
              marginHorizontal: 5,
            }}>
            {contactWhatsappNumber1}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
          }}>
          <Image
            source={require('../../assets/images/IQ.png')}
            style={{
              width: 24,
              height: 18,
            }}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: 16,
              color: AppColors.primary,
              marginHorizontal: 5,
            }}>
            {Languages.whatsappContact}
          </Text>
          <Text
            onPress={() => {
              Linking.openURL(
                `whatsapp://send?text=''&phone=${contactWhatsappNumber2key}`,
              ).catch(() => {});
              Linking.canOpenURL(
                `whatsapp://send?text=''&phone=${contactWhatsappNumber2key}`,
              ).then(supported => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  Alert.alert('Erorr 101 ', Languages.whatsapp);
                }
              });
            }}
            style={{
              fontSize: 16,
              color: AppColors.primary,
              textDecorationLine: 'underline',
              marginHorizontal: 5,
            }}>
            {contactWhatsappNumber2}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
          }}>
          <AppIcon
            type="AntDesign"
            onPress={() => Linking.openURL(facebook).catch(() => {})}
            color={AppColors.clickableText}
            name="facebook-square"
            size={26}
          />
          <Text
            onPress={() => Linking.openURL(facebook).catch(() => {})}
            style={{
              fontSize: 16,
              color: AppColors.primary,
              marginHorizontal: 5,
            }}>
            {Languages.facebook}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
          }}>
          <AppIcon
            type="AntDesign"
            onPress={() => Linking.openURL(instagram).catch(() => {})}
            name="instagram"
            size={26}
          />
          <Text
            onPress={() => Linking.openURL(instagram).catch(() => {})}
            style={{
              fontSize: 16,
              color: AppColors.primary,
              marginHorizontal: 5,
            }}>
            {Languages.instagram}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
          }}>
          <AppIcon
            type="Entypo"
            onPress={() => Linking.openURL(Youtube).catch(() => {})}
            name="youtube"
            color={AppColors.red}
            size={26}
          />
          <Text
            onPress={() => Linking.openURL(Youtube).catch(() => {})}
            style={{
              fontSize: 16,
              color: AppColors.primary,
              marginHorizontal: 5,
            }}>
            {Languages.Youtube}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
          }}>
          <AppIcon
            type="Ionicons"
            color={AppColors.black}
            name="ios-call"
            size={26}
          />
          <Text
            onPress={() =>
              Linking.openURL(`tel:${contactWhatsappNumber1}`).catch(() => {})
            }
            style={{
              fontSize: 16,
              color: AppColors.primary,
              textDecorationLine: 'underline',
              marginHorizontal: 5,
            }}>
            {contactWhatsappNumber1}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
          }}>
          <AppIcon
            type="FontAwesome"
            color={AppColors.title}
            name="telegram"
            size={26}
          />
          <Text
            onPress={() =>
              Linking.openURL(
                `tg://msg?text=Hello&to=+${contactWhatsappNumber1}`,
              ).catch(() => {})
            }
            style={{
              fontSize: 16,
              color: AppColors.primary,
              textDecorationLine: 'underline',
              marginHorizontal: 5,
            }}>
            {contactWhatsappNumber1}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
          }}>
          <AppIcon
            type="MaterialCommunityIcons"
            color={AppColors.lightRed2}
            name="gmail"
            size={26}
          />
          <Text
            onPress={() =>
              Linking.openURL(
                `mailto:${contactEmail}?subject=Talabeety_contact&body=""`,
              ).catch(() => {})
            }
            style={{
              fontSize: 18,
              color: AppColors.primary,
              textDecorationLine: 'underline',
              marginHorizontal: 10,
            }}>
            {contactEmail}
          </Text>
        </View>
      </Animatable.View>
    );
  };

  const citySelect = () => (
    <SectionedMultiSelect
      icons={Constants.icons}
      IconRenderer={Icon}
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
            borderRadius: 5,
            borderColor: AppColors.primary,
            backgroundColor: AppColors.optionBG,
            borderWidth: 1,
            alignSelf: 'center',
            paddingVertical: 10,
            paddingHorizontal: 5,
            width: 150,
            marginTop: 10,
          },
        ],
      }}
      onSelectedItemsChange={(items: any) => {
        let _selectedCity = cities.find((_city: any) => _city.ID === items[0]);
        dispatch(saveCity(_selectedCity));
      }}
      selectedItems={[city.ID]}
      showChips={false}
      single
    />
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: Languages.TalabityApp,
        message: Languages.TalabityAppMessage,
        url: 'https://play.google.com/store/apps/details?id=com.talabity&hl=en',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };

  const langButtons = () => (
    <Animatable.View animation="fadeInLeftBig" style={styles.langView}>
      <TouchableOpacity
        delayPressIn={0}
        style={[
          styles.LanguageButton,
          Languages.langID == 1 && styles.selectedLanguageStyle,
        ]}
        onPress={() => {
          if (Languages.langID == 1) return;
          Alert.alert(Languages.LanguageAlert, Languages.AreYouSure, [
            {
              text: Languages.Cancel,
              onPress: () => console.log('CancelPressed'),
              style: 'cancel',
            },
            {
              text: Languages.Yes,
              onPress: () => {
                Languages.setLanguage('en');
                AsyncStorage.setItem('langID', '1').then(() => {
                  I18nManager.allowRTL(false);
                  I18nManager.forceRTL(false);
                  RNRestart.Restart();
                });
              },
            },
          ]);
        }}>
        <Text
          style={
            Languages.langID == 1 ? styles.ActiveText : {color: AppColors.black}
          }>
          English
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        delayPressIn={0}
        style={[
          styles.LanguageButton,
          Languages.langID == 2 && styles.selectedLanguageStyle,
        ]}
        onPress={() => {
          if (Languages.langID == 2) return;
          Alert.alert(Languages.LanguageAlert, Languages.AreYouSure, [
            {
              text: Languages.Cancel,
              onPress: () => console.log('CancelPressed'),
              style: 'cancel',
            },
            {
              text: Languages.Yes,
              onPress: () => {
                Languages.setLanguage('ar');
                AsyncStorage.setItem('langID', '2').then(() => {
                  I18nManager.forceRTL(true);
                  I18nManager.allowRTL(true);
                  RNRestart.Restart();
                });
              },
            },
          ]);
        }}>
        <Text
          style={
            Languages.langID == 2
              ? {...styles.ActiveText}
              : {color: AppColors.black}
          }>
          العربية
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  const AboutUsModal = () => {
    return (
      <Modal
        ref={AboutRef}
        swipeToClose={false}
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
          overflow: 'hidden',
        }}>
        <View
          style={{
            position: 'absolute',
            alignSelf: 'center',
            width: Dimensions.get('screen').width * 2,
            height: Dimensions.get('screen').height * 1.6,
            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            opacity: 0.3,
            transform: [
              {rotate: '30deg'},
              {translateX: -Dimensions.get('screen').width / 2.5},
            ],
          }}>
          <View
            style={{
              height: '100%',
              flex: 1,
              backgroundColor: '#192a56',
            }}
          />
          <View
            style={{
              height: '100%',
              flex: 1,
              backgroundColor: '#44bd32',
            }}
          />
        </View>

        <Header
          {...props}
          // title={store.Name}
          title={Languages.About}
          showCloseIcon
          extraStyle={{height: 50, paddingTop: 0}}
          onClosePress={() => AboutRef.current.close()}
        />

        <ScrollView style={{width: '100%', flex: 1}}>
          {/* <Text style={{fontSize:28, color:AppColors.primary, alignSelf:'center', paddingTop:15}}>Talabeety</Text> */}

          <Image
            source={require('../../assets/images/logo2.png')}
            style={{
              width: Dimensions.get('screen').width * 0.4,
              height: Dimensions.get('screen').width * 0.4,
              alignSelf: 'center',
              marginVertical: 30,
              borderRadius: 15,
            }}
            resizeMode="cover"
          />

          <Text
            style={{
              fontSize: 18,
              padding: 10,
              lineHeight: 20,
              letterSpacing: 0.6,
              color: '#000',
            }}>
            {Languages.AbouUsParagraph.replace('&&', '\n')}
          </Text>
        </ScrollView>
      </Modal>
    );
  };

  return (
    <>
      <Header {...props} title={Languages.Settings} />
      {AboutUsModal()}
      {policyModal()}
      <Transitioning.View
        transition={transition}
        ref={ref}
        style={styles.container}>
        {primarySettings().map((item, index) => {
          return (
            <OptionCard
              key={index}
              currentIndex={currentIndex}
              index={index}
              setCurrentIndex={setCurrentIndex}
              item={item}
              animationRef={ref}
            />
          );
        })}
      </Transitioning.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
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
  langView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingVertical: 5,
  },
  LanguageButton: {
    flex: 1,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: AppColors.primary,
    borderWidth: 3,
    margin: 10,
  },
  selectedLanguageStyle: {
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 40,
    borderRadius: 15,
  },
  ActiveText: {
    ...FontWeights.Bold,
    color: AppColors.white,
    fontSize: 15,
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
});

export default SettingsScreen;
