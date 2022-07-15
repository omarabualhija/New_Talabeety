import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {AppIcon, Constants, Languages} from '../../common';
import {Header, StoreCard} from '../../components';
import ks from '../../services/KSAPI';
import {
  MaterialColors,
  FontWeights,
  FontSizes,
  AppColors,
  Fonts,
} from '../../theme';

const MyPharmaciesScreen = (props: any) => {
  const {city, user} = useSelector(({data}: any) => data);
  const [storesList, setStoresList] = useState([]);
  const [Loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    getMyPharmacies();
  }, []);

  const getMyPharmacies = () => {
    setLoading(true);
    ks.DrugStoreGet({
      langID: Languages.langID,
      isDrugStore: 0,
      OwnerID: user.ID,
      UserID: user.ID,
    }).then((data: any) => {
      if (data.Success) {
        setStoresList(data.DrugStores);
      }
      setLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      <Header {...props} title={Languages.MyPharmacies} showBackIcon />

      {Loading ? (
        <ActivityIndicator
          size="small"
          color={AppColors.primary}
          style={{marginTop: '50%'}}
        />
      ) : (
        <FlatList
          data={storesList}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => (
            <View style={{}}>
              <Text style={styles.heading}>{Languages.NoItems}</Text>
            </View>
          )}
          style={{
            alignSelf: 'center',
            width: '100%',
            flex: 1,
          }}
          contentContainerStyle={{
            alignItems: 'center',
            paddingVertical: 10,
          }}
          renderItem={({item, index}) => (
            <StoreCard
              key={index}
              delay={150 + index * 150}
              index={index}
              IsMyPharmacies={true}
              store={item}
              isReload={getMyPharmacies}
              isMy={false}
              {...props}
              type={props.type}
              extraStyle={{marginTop: 10}}
              // showDelete
              // afterDelete={()=>getMyPharmacies()}
              // getDrugs={getDrugs}
            />
          )}
        />
      )}
    </View>
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
    marginTop: '50%',
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
  LanguageButton: {
    width: 100,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: AppColors.primary,
    borderWidth: 3,
    margin: 10,
  },
  selectedLanguageStyle: {
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 40,
    borderRadius: 15,
  },
  ActiveText: {
    ...FontWeights.Bold,
    color: AppColors.white,
    fontSize: 15,
  },
  tabStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.grey,
    width: '100%',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 6,
    borderColor: AppColors.black,
    borderWidth: 1,
  },
});

export default MyPharmaciesScreen;
