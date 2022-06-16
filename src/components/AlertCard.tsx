import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  AppColors,
  Fonts,
  FontSizes,
  FontWeights,
  MaterialColors,
} from '../theme';
import {AppIcon, Languages} from '../common';

const WIDTH = Dimensions.get('screen').width;

const AlertCard = (props: any) => {
  return (
    <View
      style={[
        {
          backgroundColor: props.cardColor,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          marginTop: 10,
          marginHorizontal: 10,
          borderRadius: 10,
          alignSelf: 'flex-start',
          width: '65%',
          flex: 1,
        },
        props.cardStyle,
      ]}>
      <Text style={styles.statusText}>{props.text}</Text>
      <>
        {props.image ? (
          <Image
            source={props.image}
            style={[{height: 25, width: 25, tintColor:'#fff'}, props.style]}
          />
        ) : (
          <AppIcon
            type={props.iconType}
            name={props.iconName}
            size={props.iconSize ? props.iconSize : 25}
            color={props.iconColor ? props.iconColor : AppColors.white}
            style={[props.style]}
          />
        )}
      </>
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
  title: {
    fontSize: 22,
    color: AppColors.white,
    fontFamily: Fonts.Medium,
  },
  cardStyle: {
    height: 200,
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
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  body: {
    ...FontWeights.Bold,
    color: AppColors.black,
    ...FontSizes.Body,
  },
  statusText: {
    ...FontWeights.Bold,
    margin: 10,
    fontSize: 13,
    color: AppColors.white,
    flex:1,
  },
});

export default AlertCard;
