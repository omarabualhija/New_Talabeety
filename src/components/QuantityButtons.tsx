import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {AppIcon} from '../common';
import {FontWeights, FontSizes, AppColors} from '../theme';

const QuantityButtons = (props: any) => {
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity onPress={props.onPlus} disabled={props.isLoading}>
        <AppIcon
          type={'AntDesign'}
          name={'pluscircle'}
          size={30}
          color={props.isLoading ? AppColors.darkGrey : AppColors.primary}
        />
      </TouchableOpacity>
      <View
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: AppColors.primary,
          backgroundColor: AppColors.white,
          width: 40,
          height: '100%',
          justifyContent: 'center',
        }}>
        {props.isLoading ? (
          <View style={{}}>
            <ActivityIndicator size={'small'} color={AppColors.primary} />
          </View>
        ) : (
          <View style={{}}>
            <Text style={styles.body}>{props.value}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={props.onMinus} disabled={props.isLoading}>
        <AppIcon
          type={'AntDesign'}
          name={'minuscircle'}
          size={30}
          color={props.isLoading ? AppColors.darkGrey : AppColors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: 140,
    height: 45,
    marginTop: 40,
    backgroundColor: AppColors.optionBG,
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 20,
  },
  heading: {
    ...FontWeights.Light,
    ...FontSizes.SubHeading,
  },
  body: {
    ...FontWeights.Bold,
    color: AppColors.primary,
    ...FontSizes.SubHeading,
    textAlign: 'center',
    fontSize: 22,
  },
  disabled: {
    backgroundColor: AppColors.darkGrey,
  },
});

export default QuantityButtons;
