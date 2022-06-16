import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  I18nManager,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {MaterialColors, FontWeights, FontSizes, AppColors} from '../theme';
import {AppIcon, Languages} from '../common';
import * as Animatable from 'react-native-animatable';



const OptionCard = ({
  item,
  currentIndex,
  index,
  setCurrentIndex,
  animationRef,
  cardClicked,
}: any) => {
  var {iconType, iconName, iconSize, image} = item;
  return (
    <Animatable.View
      delay={150 + 200 * index}
      animation={'fadeInUp'}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          width: Dimensions.get('screen').width,
        }}>
        <TouchableOpacity
          activeOpacity={0.4}
          style={[styles.tabStyle]}
          onPress={property => {
            if (item.onPress) {
              item.onPress();
              setCurrentIndex(null, property);
            } else {
              if (currentIndex === index) {
                setCurrentIndex(null, property);
              } else {
                animationRef.current.animateNextTransition();
                setCurrentIndex(index, property);
              }
            }
          }}>
          <View style={{}}>
            <Text style={{fontSize: 20}}>{item.name}</Text>
          </View>
          <View style={{}}>
            {image ? (
              <Image source={image} style={{height: 30, width: 30}} />
            ) : (
              <AppIcon
                type={iconType ? iconType : 'AntDesign'}
                name={
                  iconName
                    ? iconName
                    : currentIndex === index
                    ? 'arrowdown'
                    : 'arrowright'
                }
                size={iconSize ? iconSize : 30}
                color={AppColors.primary}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
      {currentIndex === index && item.data && item.data}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  },
  ActiveText: {
    fontSize: 12,
    ...FontWeights.Bold,
  },
  tabStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.optionBG,
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    zIndex: 3,
    elevation: 3,
  },
});

export default OptionCard;
