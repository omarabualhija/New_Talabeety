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

const CategoryItemsScreen = (props: any) => {
  const {city, cities, user} = useSelector(({data}: any) => data);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const {store, type, category} = props.route.params;

  useEffect(() => {

    if (props.route?.params?.query) {
      ks.DrugStoreProductsFilter({
        langID: Languages.langID,
        query: props.route?.params?.query,
        DrugStoreID: store?.ID,
        IsRecentlyArrived:props.route?.params?.category?.id ===3?1:'',
        IsNew:props.route?.params?.category?.id===4?1:'',
        IsArrivedAfterDiscontinued:props.route?.params?.category?.id===2?1:'',
        IsArrivedToday:props.route?.params?.category?.id===1?1:"",
      }).then((data: any) => {
        if (data?.Success === 1) {
          
          setItems(data?.Products);
        }
        setLoading(false);
      });
    } else {
      ks.GetCategoryItems({
        categoryID: category?.ID,
        LangID: Languages.langID,
        DrugStoreID: store?.ID,
        page: 1,
        pageSize: 20,
        ownerid: store?.OwnerID,
      }).then((data: any) => {
        if (data?.Success === 1) {
          setItems(data?.Products);
        }
        setLoading(false);
      });
    }
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
          size="large"
        />
      </View>
    );
  return (
    <View style={{width: '100%', flex: 1, paddingTop: 20}}>
      <Header
        {...props}
        title={
          props.route?.params?.title
            ? //@ts-ignore
              Languages[props.route?.params?.title]
            : category?.Name
        }
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
            {Languages.NoProductsHere}
          </Text>
        )}
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <ItemCard
            animation={'fadeInRight'}
            key={index}
            delay={0}
            duration={150 + index * 25}
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

export default CategoryItemsScreen;
