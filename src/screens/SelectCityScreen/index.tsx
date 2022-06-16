//@ts-nocheck
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  I18nManager,
  StatusBar,
} from 'react-native';
import {Languages, AppIcon, Constants} from '../../common';
import {AppColors, FontWeights, FontSizes} from '../../theme';
import {saveCity} from '../../store/actions';
import {useSelector, useDispatch} from 'react-redux';
import {AppButton} from '../../components';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface props {
  navigation: any;
  route: any;
}

const SelectCity = (props: props) => {
  const {cities} = useSelector(({data}: any) => data);
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const onCitySave = () => {
    dispatch(saveCity(selectedCity));
    props.navigation.replace('LoginStack');
  };

  return isLoading ? (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" color={AppColors.primary} />
    </View>
  ) : (
    <>
      <View
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <StatusBar backgroundColor={AppColors.primary} />
        <View style={{padding: 10}}>
          <Text style={styles.heading}>{Languages.SelectCity}</Text>
          {selectedCity ? (
            <Text
              style={{
                ...styles.heading,
                textAlign: 'center',
                width: '100%',
                marginTop: 10,
                height: 50,
                color: AppColors.primary,
              }}>
              {selectedCity.name}
            </Text>
          ) : (
            <View style={{marginTop: 10, height: 50}} />
          )}
          <SectionedMultiSelect
            icons={Constants.icons}
            IconRenderer={Icon}
            items={
              cities
                ? Constants.GetCitiesMultiSelect(cities)
                : Constants.defaultCities
            }
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
                  borderRadius: 10,
                  borderColor: AppColors.primary,
                  backgroundColor: AppColors.optionBG,
                  borderWidth: 1,
                  alignSelf: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                  width: 200,
                },
              ],
            }}
            confirmText={Languages.Confirm}
            onSelectedItemsChange={(items: any) => {
              let _selectedCity = cities.find(
                (_city: any) => _city.ID === items[0],
              );
              setCity(items);
              setSelectedCity(_selectedCity);
            }}
            selectedItems={city}
            showChips={false}
            single
          />
        </View>
        <AppButton
          text={Languages.Confirm}
          onPress={onCitySave}
          disabled={!selectedCity}
        />
      </View>
    </>
  );
};

export default SelectCity;

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
    color: AppColors.black,
    fontSize: 35,
  },
});

// {false && (
//   <View style={{}}>
//     <View style={{padding: 10}}>
//       <Text style={styles.heading}>{Languages.SelectCity}</Text>
//       {selectedCity ? (
//         <Text
//           style={{
//             ...styles.heading,
//             textAlign: 'center',
//             width: '100%',
//             marginTop: 10,
//             height: 50,
//             color: AppColors.primary,
//           }}>
//           {selectedCity.name}
//         </Text>
//       ) : (
//         <View style={{marginTop: 10, height: 50}} />
//       )}
//     </View>
//     <ImageBackground
//       source={require('../../assets/images/iraq.png')}
//       style={{
//         height: Dimensions.get('screen').height * 0.6,
//         width: Dimensions.get('screen').width,
//         backgroundColor: AppColors.grey,
//         shadowColor: '#000',
//         shadowOffset: {
//           width: 0,
//           height: 5,
//         },
//         shadowOpacity: 0.34,
//         shadowRadius: 6.27,
//         elevation: 10,
//       }}
//       resizeMode="cover">
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           top: 20,
//           left: 205,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.DahookID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           top: 70,
//           right: 130,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.NenwaID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           top: 60,
//           left: 160,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.ErbilID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           top: 90,
//           left: 110,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.SulaymaniyaID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           top: 100,
//           left: 150,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.KirkukID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           top: 145,
//           right: 180,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.SalahAlDeenID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 240,
//           left: 140,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.BaghdadID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 240,
//           right: 110,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.AlAnbarID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 265,
//           left: 115,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.DeyaliID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 190,
//           left: 170,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.KarbalaID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 200,
//           left: 135,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.BabelID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 200,
//           left: 90,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.WasetID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 160,
//           left: 110,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.AlQadseyaID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 160,
//           left: 30,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.MesanID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 130,
//           left: 60,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.TheQarID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 90,
//           left: 100,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.AlMothanaID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 130,
//           left: 170,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.NajafID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//       <TouchableOpacity
//         activeOpacity={0.5}
//         style={{
//           position: 'absolute',
//           bottom: 90,
//           left: 10,
//           borderRadius: 30,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           height: 30,
//           width: 30,
//         }}
//         onPress={() => {
//           let _selectedCity = Constants.ARCities[0].children.find(
//             _city => Constants.BasraID === _city.id,
//           );
//           setSelectedCity(_selectedCity);
//         }}></TouchableOpacity>
//     </ImageBackground>
//   </View>
// )}
