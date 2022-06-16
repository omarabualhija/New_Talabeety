import React, {useEffect} from 'react';
import {Text, View, Dimensions, StyleSheet, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';
import {AppIcon, Languages} from '@app/common';
import {
  HomeScreen,
  ProfileScreen,
  CartScreen,
  ChatScreen,
  SettingsScreen,
  SplashScreen,
  EditProfileScreen,
  ItemDetailsScreen,
  StoreItemsScreen,
  LoginScreen,
  SelectCityScreen,
  ChatDetailsScreen,
  RegisterScreen,
  MyPharmaciesScreen,
  MembersScreen,
  CategoryItemsScreen,
  OrderDetails,
  SearchScreen,
  FavouriteScreen,
} from '../screens';
import {AppColors, FontSizes, FontWeights} from '../theme';
import {useSelector, useDispatch} from 'react-redux';
import {showNotifications} from '../store/actions';
import {Constants} from '../common';
import ks from '../services/KSAPI';
const MainAppStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// const AppNavigator = () => (
//   <NavigationContainer>
//     <Stack.Navigator screenOptions={{headerShown: false}}>
//       <Stack.Screen name="BottomTabs" component={BottomTabs} />
//     </Stack.Navigator>
//   </NavigationContainer>
// );

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={({navigation, route}) => ({
      headerShown: false,
    })}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetails} />
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
    <Stack.Screen
      name="ItemDetailsScreen"
      component={ItemDetailsScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="StoreItemsScreen"
      component={StoreItemsScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen name="CategoryItemsScreen" component={CategoryItemsScreen} />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={({navigation, route}) => ({
      headerShown: false,
    })}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    <Stack.Screen name="MyPharmaciesScreen" component={MyPharmaciesScreen} />
    <Stack.Screen
      name="StoreItemsScreen"
      component={StoreItemsScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="MembersScreen"
      component={MembersScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const CartStack = () => (
  <Stack.Navigator
    screenOptions={({navigation, route}) => ({
      headerShown: false,
    })}>
    <Stack.Screen name="CartScreen" component={CartScreen} />
  </Stack.Navigator>
);

const ChatStack = () => (
  <Stack.Navigator
    screenOptions={({navigation, route}) => ({
      headerShown: false,
    })}>
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={({navigation, route}) => ({
      headerShown: false,
    })}>
    <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
  </Stack.Navigator>
);

const BottomTabs = () => {
  const {cart, user, showNotification, cartUser} = useSelector(
    ({data}) => data,
  );
  const getCart = () => {
    ks.getCart({
      userid: user.ID,
      LangID: Languages.langID,
    }).then(data => {
      dispatch(getCartItem(data));
    });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        if (remoteMessage.data.type === Constants.NOTIFICATIONS_STATUSES.chat) {
          dispatch(showNotifications(true));
        }
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      getCart();
    }
  });
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      backBehavior="initialRoute"
      tabBarOptions={{
        style: styles.bottomNavigatorView,
        keyboardHidesTabBar: true,
      }}>
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text
              style={[
                styles.labelStyle,
                focused ? {color: AppColors.primary} : {color: AppColors.black},
              ]}>
              {Languages.MyProfile}
            </Text>
          ),
          tabBarIcon: ({focused, color}) => {
            return (
              <AppIcon
                type="FontAwesome"
                name={'user'}
                color={focused ? AppColors.primary : 'grey'}
                size={25}
                style={{}}
              />
            );
          },
        }}
      />

      {user && (
        <Tab.Screen
          name="CartScreen"
          component={CartStack}
          options={{
            tabBarLabel: ({focused, color}) => (
              <Text
                style={[
                  styles.labelStyle,
                  focused
                    ? {color: AppColors.primary}
                    : {color: AppColors.black},
                ]}>
                {Languages.Cart} {cartUser.length}
              </Text>
            ),
            tabBarIcon: ({focused, color}) => {
              return (
                <View style={{}}>
                  <AppIcon
                    name={'opencart'}
                    type={'FontAwesome'}
                    color={focused ? AppColors.primary : 'grey'}
                    size={25}
                    style={{}}
                  />
                  {cart && (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: -6,
                        left: -10,
                      }}>
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 10,
                          backgroundColor: AppColors.red,
                        }}>
                        <Text
                          style={{
                            ...FontWeights.Bold,
                            fontSize: 12,
                            textAlign: 'center',
                            color: AppColors.white,
                          }}>
                          {cart.itemsQty}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            },
          }}
        />
      )}

      <Tab.Screen
        name="HomeScreen"
        component={HomeStack}
        options={{
          tabBarLabel: ({focused, color}) =>
            focused ? null : (
              <Text style={[[styles.labelStyle, {color: AppColors.primary}]]}>
                {Languages.Home}
              </Text>
            ),
          tabBarIcon: ({focused, color}) => {
            return (
              <Image
                source={require('@assets/images/newLogo2.png')}
                style={{
                  height: focused ? '100%' : 35,
                  // width: focused ? 50 : 35,
                  width: 'auto',
                  aspectRatio: 1,
                  borderRadius: 15,
                  marginBottom: 0,
                }}
              />
            );
          },
        }}
      />
      {user && (
        <Tab.Screen
          name="ChatScreen"
          component={ChatStack}
          options={{
            tabBarLabel: ({focused, color}) => (
              <Text
                style={[
                  styles.labelStyle,
                  focused
                    ? {color: AppColors.primary}
                    : {color: AppColors.black},
                ]}>
                {Languages.Chat}
              </Text>
            ),
            tabBarIcon: ({focused, color}) => {
              return (
                <View style={{}}>
                  <AppIcon
                    type="MaterialCommunityIcons"
                    name={'chat'}
                    color={focused ? AppColors.primary : 'grey'}
                    size={25}
                    style={{}}
                  />

                  {showNotification && <View style={styles.chatBadge} />}
                </View>
              );
            },
          }}
        />
      )}
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsStack}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text
              style={[
                styles.labelStyle,
                focused ? {color: AppColors.primary} : {color: AppColors.black},
              ]}>
              {Languages.Settings}
            </Text>
          ),
          tabBarIcon: ({focused, color}) => {
            return (
              <AppIcon
                name={'cog'}
                type="FontAwesome"
                color={focused ? AppColors.primary : 'grey'}
                size={25}
                style={{}}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const LoginStackScreens = () => (
  <LoginStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="LoginScreen">
    <LoginStack.Screen
      name="LoginScreen"
      component={LoginScreen}
      initialParams={{email: ''}}
    />
    <LoginStack.Screen
      name="RegisterScreen"
      component={RegisterScreen}
      initialParams={{email: ''}}
    />
  </LoginStack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <MainAppStack.Navigator screenOptions={{headerShown: false}}>
      <MainAppStack.Screen name="SplashScreen" component={SplashScreen} />
      <MainAppStack.Screen
        name="SelectCityScreen"
        component={SelectCityScreen}
      />
      <MainAppStack.Screen name="BottomTabs" component={BottomTabs} />
      <MainAppStack.Screen name="LoginStack" component={LoginStackScreens} />
      <Stack.Screen name="ChatDetailsScreen" component={ChatDetailsScreen} />
      <Stack.Screen name="FavouriteScreen" component={FavouriteScreen} />
    </MainAppStack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

const styles = StyleSheet.create({
  bottomNavigatorView: {
    // backgroundColor: AppColors.lightGray,
    maxHeight: Dimensions.get('screen').height >= 800 ? 75 : 55,
    height: Dimensions.get('screen').height >= 800 ? 75 : 55,
    borderTopWidth: 0,
    paddingVertical: 3,
  },
  labelStyle: {
    lineHeight: 18,
    ...FontWeights.Bold,
    ...FontSizes.Body,
    fontSize: 13,
    marginBottom: 2,
  },
  selectedLanguageStyle: {
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
    borderRadius: 25,
  },
  ActiveText: {
    color: '#fff',
    fontSize: 12,
  },
  LanguageButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatBadge: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: AppColors.red,
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    right: -3,
  },
});
