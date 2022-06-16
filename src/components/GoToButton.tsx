import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  I18nManager,
  FlatList,
} from 'react-native';
import {AppIcon, Languages} from '../common';
import {MaterialColors, FontWeights, FontSizes, AppColors} from '../theme';
import Modal from 'react-native-modalbox';
import {AppInput, ItemCard, StoreCard} from '.';
import {useNavigation} from '@react-navigation/native';

const GoToButton = (props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  useEffect(() => {}, []);

  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          justifyContent: 'center',
        }}
        activeOpacity={0.6}
        onPress={() => setIsModalVisible(!isModalVisible)}>
        {props.showText && (
          <Text style={styles.body}>{Languages.DisplayMore}</Text>
        )}
        <AppIcon
          type={'Feather'}
          name={'chevrons-right'}
          size={25}
          color={AppColors.primary}
        />
      </TouchableOpacity>
      <Modal
        isOpen={isModalVisible}
        hasBackdrop={false}
        swipeToClose={false}
        backButtonClose
        coverScreen
        onClosed={() => {
          setIsModalVisible(false);
          setSearchText('');
        }}
        style={{
          backgroundColor: AppColors.white,
          width: '100%',
          height: '100%',
          position: 'absolute',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <AppInput
            style={styles.inputs}
            placeholder={Languages.search}
            value={searchText}
            onChangeText={(text: string) => {
              setSearchText(text);
            }}
            containerExtraStyle={{width: '80%'}}
          />
          <TouchableOpacity
            style={{}}
            onPress={() => {
              setIsModalVisible(false);
            }}>
            <AppIcon
              type="AntDesign"
              name={'close'}
              size={30}
              color={AppColors.primary}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={
            searchText.trim().length > 0
              ? props.data.filter((item: any) =>
                  item?.name?.includes(searchText),
                )
              : props.data
          }
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => <View style={{height: 40}} />}
          ListEmptyComponent={() => (
            <View style={{}}>
              <Text style={styles.heading}>{Languages.NoItems}</Text>
            </View>
          )}
          style={{
            alignSelf: 'center',
            width: '100%',
          }}
          contentContainerStyle={{alignItems: 'center'}}
          renderItem={({item, index}: any) => {
            if (props.isStore) {
              return (
                <StoreCard
                  key={index}
                  index={index}
                  IsMyPharmacies={false}
                  store={item}
                  isMy={true}
                  {...props}
                  navigation={navigation}
                  closeModal={() => setIsModalVisible(false)}
                  getDrugs={props.getDrugs}
                />
              );
            } else {
              return (
                <ItemCard
                  item={item}
                  {...props}
                  navigation={navigation}
                  closeModal={() => setIsModalVisible(false)}
                />
              );
            }
          }}
        />
      </Modal>
    </View>
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
    ...FontWeights.Regular,
    ...FontSizes.SubHeading,
  },
  body: {
    ...FontWeights.Regular,
    color: AppColors.primary,
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

export default GoToButton;
