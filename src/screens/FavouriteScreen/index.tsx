import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Dimensions,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Languages} from '../../common';
import {Header, ItemCard} from '../../components';
import ks from '../../services/KSAPI';
import {AppColors, FontSizes} from '../../theme';

const FavouriteScreen = (props: any) => {
  const {user} = useSelector(({data}: any) => data);

  const [loading, setLoading] = useState(true);
  const [FavouritesList, setFavouritesList] = useState([]);

  const {store, type} = props.route.params;

  useEffect(() => {
    ks.GetUserFavourites({
      UserID: user.ID,
      LangID: Languages.langID,
    }).then((data: any) => {
      if (data?.Success) {
        setFavouritesList(data.Products);
      }
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator
          style={{flex: 1}}
          color={AppColors.primary}
          size="small"
        />
      </View>
    );
  return (
    <View style={{width: '100%', flex: 1, paddingTop: 20}}>
      <Header
        {...props}
        // title={store.Name}
        title={Languages.Favourites}
        showBackIcon
        extraStyle={{height: 50, paddingTop: 0}}
      />

      <FlatList
        style={{width: '100%', flex: 1}}
        contentContainerStyle={{alignItems: 'center', paddingVertical: 10}}
        ListEmptyComponent={() => (
          <Text
            style={{
              ...FontSizes.SubHeading,
              width: '100%',
              textAlign: 'center',
              marginTop: Dimensions.get('screen').height / 3,
            }}>
            {Languages.NoFavListings}
          </Text>
        )}
        data={FavouritesList}
        keyExtractor={(item: any) => item.ID}
        renderItem={({item, index}) => (
          <ItemCard
            navigation={props.navigation}
            animation={'fadeInRight'}
            key={index}
            delay={0}
            duration={150 + index * 100}
            item={item}
            {...props}
            showCartBtn
            store={store}
            type={type}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default FavouriteScreen;
