//@ts-nocheck
import React from 'react';
import {StyleSheet, Text, View, TextInput, I18nManager} from 'react-native';
import {
  MaterialColors,
  FontWeights,
  FontSizes,
  AppColors,
  Fonts,
} from '../theme';

const AppInput = (props) => {
  return (
    <View style={[styles.inputs, props.containerExtraStyle]}>
      <TextInput
        style={[
          props.extraStyle,
          {
            ...FontWeights.Bold,
            // textAlign:'right'
            width:'100%',
            textAlign:I18nManager.isRTL ? 'right' : 'left',
            color:'#000'
          },
        ]}
        placeholder={props.placeholder}
        placeholderTextColor='gray'
        autoFocus={props.autoFocus ? true : false}
        value={props.value}
        onChangeText={props.onChangeText}
        secureTextEntry={props.secureTextEntry ? true : false}
        autoCapitalize={props.autoCapitalize? autoCapitalize: 'none'}
        keyboardType={props.keyboardType?props.keyboardType:'default'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputs: {
    width: '80%',
    borderColor: AppColors.primary,
    borderWidth: 2,
    borderRadius:15,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    margin: 10,
    paddingHorizontal: 10,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});

export default AppInput;
