import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import {AppIcon} from '../common';
import {MaterialColors, FontWeights, FontSizes, AppColors} from '../theme';

const AppButton = (props: any) => {
  return (
    <TouchableOpacity
      delayPressIn={0.5}
      disabled={props.disabled || props.isLoading ? true : false}
      style={[
        styles.confirmBtn,
        props.extraStyle,
        (props.disabled || props.isLoading) && {
          backgroundColor: AppColors.darkGrey,
        },
      ]}
      onPress={() => {
        props.onPress();
      }}>
      <View style={{}}>
        <Text style={[styles.confirmText, props.textStyle]}>{props.text}</Text>
      </View>
      {props.isLoading ? (
        <View style={{}}>
          <ActivityIndicator size={30} color={AppColors.white} />
        </View>
      ) : (
        props.iconName &&
        props.iconType && (
          <View style={{}}>
            <AppIcon
              type={props.iconType}
              name={props.iconName}
              size={props.iconSize ? props.iconSize : 30}
              color={props.iconColor ? props.iconColor : AppColors.white}
            />
          </View>
        )
      )}
    </TouchableOpacity>
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
  inputs: {
    width: '80%',
    borderBottomColor: AppColors.primary,
    borderBottomWidth: 1,
    marginBottom: 10,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  confirmText: {
    fontSize: 20,
    ...FontWeights.Bold,
    color: AppColors.white,
  },
  confirmBtn: {
    backgroundColor: AppColors.primary,
    width: '85%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 15,
    marginTop: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    marginBottom: 20,
  },
});

export default AppButton;
