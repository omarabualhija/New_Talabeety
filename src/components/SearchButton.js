import React, {useRef, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  StatusBar,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import {AppIcon, Languages} from '../common';
import {AppColors, FontSizes, FontWeights, MaterialColors} from '../theme';
import Modal from 'react-native-modalbox';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AppButton from './AppButton';
import ks from '../services/KSAPI';
import {AppInput, ItemCard, StoreCard} from '.';

const SearchButton = props => {
  const [ShowQR, setShowQR] = React.useState(true);
  const [Loading, setLoading] = React.useState(false);

  const BqrQrPopup = useRef();
  useEffect(() => {}, []);
  const BarQrScanModal = () => {
    return (
      <Modal
        ref={BqrQrPopup}
        hasBackdrop={false}
        swipeToClose={false}
        backButtonClose
        onClosed={() => setLoading(true)}
        onOpened={() => setLoading(false)}
        coverScreen
        useNativeDriver={true}
        style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <AppIcon
          type="MaterialCommunityIcons"
          name={ShowQR ? 'qrcode-scan' : 'barcode-scan'}
          size={50}
          color={AppColors.primary}
          style={{position: 'absolute', top: 25}}
        />

        <View
          style={{
            alignItems: 'center',
            backgroundColor: AppColors.white,
            width: '100%',
            height: '70%',
            borderRadius: 15,
            overflow: 'hidden',
          }}>
          {Loading ? (
            <ActivityIndicator
              size="small"
              color={AppColors.primary}
              style={{marginTop: '50%'}}
            />
          ) : (
            <>
              {ShowQR ? (
                <QRCodeScanner // QR code scan
                  reactivate
                  reactivateTimeout={700}
                  fadeIn={false}
                  onRead={onRead}
                  vibrate={false}
                  showMarker
                  cameraStyle={{alignSelf: 'center'}}
                  markerStyle={{
                    borderColor: '#55e',
                    width: Dimensions.get('screen').width * 0.5,
                    height: 'auto',
                    aspectRatio: 1,
                  }}
                />
              ) : (
                <QRCodeScanner // Bar code scan
                  reactivate
                  reactivateTimeout={700}
                  fadeIn={false}
                  onRead={onRead}
                  vibrate={false}
                  showMarker
                  cameraStyle={{alignSelf: 'center'}}
                  markerStyle={{
                    borderColor: '#e55',
                    width: Dimensions.get('screen').width * 0.7,
                    height: 'auto',
                    aspectRatio: 2,
                  }}
                />
              )}
            </>
          )}
        </View>

        <AppButton
          text={Languages.close}
          onPress={() => BqrQrPopup.current.close()}
          extraStyle={{bottom: 0, position: 'absolute'}}
        />
      </Modal>
    );
  };

  const onRead = async ({data}) => {
    Vibration.vibrate();
    setLoading(true);
    console.log(data);
    let pram = {
      langID: Languages.langID,
    };
    if (ShowQR) {
      pram.QRCode = data;
    } else {
      pram.BarCode = data;
    }

    let _data = await ks.BarQRCode(pram);
    setLoading(false);
    console.log(_data);
    if (_data && _data.Success === 1) {
      console.log('data');
      if (_data.Product.ID) {
        props.navigation.navigate('SearchScreen', {
          fromScanner: true,
          name: _data.Product.ScientificName,
        });
        // props.navigation.navigate('ItemDetailsScreen', {
        //   item: _data.Product,
        //   store: '',
        //   type: '1',
        // });
      } else {
        alert(Languages.NoEnoughInfo);
      }
    } else {
      let message = _data.Message.indexOf('!!');

      alert(
        message == -1 ? Languages.NoItems : _data.Message.slice(18, message),
      );
    }
    BqrQrPopup.current.close();
  };

  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 5,
        backgroundColor: AppColors.white,
        paddingTop: StatusBar.currentHeight,
        alignItems: 'flex-end',
        paddingVertical: 10,
        paddingHorizontal: 5,
        height: 100,
        flexDirection: 'row',
        justifyContent:
          props.showBackButton || props.showQRCode ? 'space-between' : 'center',
      }}>
      {BarQrScanModal()}

      {props.showBackButton && (
        <TouchableOpacity
          style={{paddingHorizontal: 5}}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <AppIcon
            name={'arrowleft'}
            color={AppColors.primary}
            type={'AntDesign'}
            size={30}
            style={{}}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        delayPressIn={0}
        style={[
          {
            elevation: 2,
            backgroundColor: AppColors.optionBG,
            borderRadius: 10,
            borderColor: MaterialColors.grey[300],
            paddingHorizontal: 5,
            paddingVertical: 0,
            marginHorizontal: 5,
            height: 35,
            justifyContent: 'center',
            // width: props.showBackButton ? '60%' : '75%',
            flex: 1,
          },
          props.extraStyle,
        ]}
        onPress={() =>
          props.navigation.navigate('SearchScreen', {Data: props.userDrugs})
        }>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: AppColors.primary}}>
            {Languages.searchProduct}
          </Text>
          <AppIcon
            name={'search'}
            color={AppColors.primary}
            size={22}
            style={{}}
          />
        </View>
      </TouchableOpacity>

      {props.showQRCode && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <TouchableOpacity
            style={{paddingHorizontal: 5}}
            onPress={() => {
              setShowQR(false);
              BqrQrPopup.current.open();
            }}>
            <AppIcon
              type="MaterialCommunityIcons"
              name={'barcode-scan'}
              size={30}
              color={AppColors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{paddingHorizontal: 5}}
            onPress={() => {
              setShowQR(true);
              BqrQrPopup.current.open();
            }}>
            <AppIcon
              type="MaterialCommunityIcons"
              name={'qrcode-scan'}
              size={30}
              color={AppColors.primary}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MaterialColors.grey[200],
    marginTop: 10,
  },
  inputs: {
    width: '80%',
    borderBottomColor: AppColors.primary,
    borderBottomWidth: 1,
    marginBottom: 10,
    textAlign: 'left',
  },
  heading: {
    ...FontWeights.Light,
    ...FontSizes.SubHeading,
    margin: 20,
  },
});

export default SearchButton;
