import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  I18nManager,
  Alert,
  StatusBar,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Languages} from '../../common';
import {MaterialColors, AppColors} from '../../theme';
import ks from '../../services/KSAPI';
import FastImage from 'react-native-fast-image';
import {AppInput, ItemCard} from '../../components';

const SearchScreen = (props: any) => {
  // const {city, user} = useSelector(({data}: any) => data);

  const [searchText, setSearchText] = useState('');
  const [dataSearch, setdataSearch] = useState([]);
  const [loading, setLoading] = useState(false);

  //  const [data,setdata]=useState(props.route.params.Data)

  useEffect(() => {
    console.log(props);
    let fromScanner = props.route.params?.fromScanner;
    if (fromScanner) {
      setLoading(true);

      setSearchText(props.route.params?.name.trim());
      Dosearch(props.route.params?.name.trim());
    }
  }, []);
  React.useEffect(() => {}, [loading]);
  const Dosearch = (txt = null) => {
    if (searchText.length > 2) setLoading(true);
    {
      ks.DrugStoreProductsFilter({
        LangID: Languages.langID,
        SearchFor: txt ? txt : searchText,
        PageSize: 50,
        PageNum: 1,
      })
        .then((data: any) => {
          if (data.Success) {
            setdataSearch(data.Products);
            setLoading(false);
          } else {
            if (data?.Message) {
              Alert.alert('', Languages.UserExist);
            } else {
              Alert.alert('', Languages.SomethingWentWrong);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const searchResultsCards = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={{
          width: '94%',
          height: Dimensions.get('screen').width / 1.8,
          borderRadius: 15,
        }}>
        <FastImage
          source={
            item.ImageName
              ? {
                  uri:
                    'http://talabeety.com/content/products/' +
                    item.ImageName +
                    '_1920x1280.jpg',
                }
              : require('../../assets/images/pills.jpg')
          }
        />
      </TouchableOpacity>
    );
  };

  const searchBar = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
        }}>
        <AppInput
          style={styles.inputs}
          placeholder={Languages.searchProduct}
          value={searchText}
          onChangeText={(text: string) => {
            setdataSearch([]);
            setSearchText(text);
            if (searchText.length > 2) {
              Dosearch(text);
            } else {
              setdataSearch([]);
            }
          }}
          containerExtraStyle={{width: '80%'}}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {searchBar()}

      {!loading ? (
        <View
          style={{
            width: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            left: 5,
          }}>
          {dataSearch.length > 0 ? (
            <FlatList
              data={dataSearch}
              style={{width: '100%', flex: 1}}
              renderItem={({item, index}: any) => {
                return (
                  <ItemCard
                    navigation={props.navigation}
                    animation={'fadeInRight'}
                    key={index}
                    delay={0}
                    duration={150 + index * 25}
                    item={item}
                    {...props}
                    showCartBtn={false}
                    store={0}
                    type={item.Type}
                  />
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View
              style={{
                width: '100%',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                left: 5,
              }}>
              <Text
                style={{
                  fontSize: 20,
                }}>
                {Languages.NoProductsHere}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <ActivityIndicator
          size={'small'}
          color={AppColors.primary}
          style={{flex: 1}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: MaterialColors.grey[200],
    paddingTop: StatusBar.currentHeight,
  },
  inputs: {
    width: '90%',
    borderBottomColor: AppColors.primary,
    borderBottomWidth: 1,
    marginBottom: 10,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  confirmText: {
    fontSize: 20,

    color: AppColors.white,
  },
  confirmBtn: {
    backgroundColor: AppColors.primary,
    width: '60%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 40,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default SearchScreen;
