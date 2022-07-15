// import { StyleSheet } from "react-native"

// <Header {...props} showBar extraStyle/>

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  I18nManager,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useSelector} from 'react-redux';
import {AppColors, Fonts, FontWeights} from '../theme';
// import Languages from '../common/Languages';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {Languages} from '../common';

const WIDTH = Dimensions.get('screen').width;

const Header = (props: any) => {
  return (
    <View
      style={[
        styles.container,
        {paddingRight: props.showBackIcon ? 25 : 0},

        props.extraStyle,
      ]}>
      {props.showCloseIcon ? (
        <TouchableOpacity onPress={() => props.onClosePress()}>
          <AntDesign
            name={'close'}
            color={AppColors.white}
            size={25}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
      ) : props.showBackIcon ? (
        <TouchableOpacity
          onPress={() =>
            props.customBack ? props.customBack : props.navigation.goBack()
          }>
          <AntDesign
            name={I18nManager.isRTL ? 'arrowright' : 'arrowleft'}
            color={AppColors.white}
            size={25}
            style={{paddingHorizontal: 5}}
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      {props.showSkipButton && (
        <TouchableOpacity
          style={{position: 'absolute', left: 10, padding: 5}}
          onPress={() => {
            props.navigation.replace('BottomTabs');
          }}>
          <Text
            style={{
              ...FontWeights.Bold,
              color: AppColors.white,
              fontSize: 20,
            }}>
            {Languages.Skip}
          </Text>
        </TouchableOpacity>
      )}

      {props.title ? <Text style={styles.title}>{props.title}</Text> : <View />}

      {props?.renderLeft ? props.renderLeft : <View style={{width: 30}} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH,

    height: 90,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    backgroundColor: AppColors.primary,
    paddingTop: StatusBar.currentHeight,
  },
  title: {
    fontSize: 22,
    color: AppColors.white,
    fontFamily: Fonts.Medium,
    flex: 1,
    textAlign: 'center',
  },
});

export default Header;
