import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  AppColors,
  Fonts,
  FontSizes,
  FontWeights,
  MaterialColors,
} from '../theme';
import {AppIcon, Languages} from '../common';
import {QuantityButtons} from '.';
import {addToCart, onItemMinus, onItemPlus} from '../store/actions';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const WIDTH = Dimensions.get('screen').width;

const ItemCard = (props: any) => {
  // const [isLoading, setIsLoading] = React.useState < Boolean > false;
  const [isLoading, setIsLoading] = React.useState<Boolean>(false;

  const item = props.item;
  const store = props.store;

  const {cart} = useSelector(({data}: any) => data);
  const dispatch = useDispatch();

  const onPlus = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(onItemPlus(item.id));
      setIsLoading(false);
    }, 500);
  };

  const onMinus = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(onItemMinus(item.id));
      setIsLoading(false);
    }, 500);
  };

  const handleOnAddToCart = () => {
    if (cart?.store && cart?.store?.id != store.id) {
      return Alert.alert('', Languages.CantBuyFromDiffStores, [
        {text: Languages.Yes},
      ]);
    }
    const itemExists = cart?.items?.find((_item: any) => _item.id == item.id);
    if (itemExists) {
      return Alert.alert('', Languages.ItemAlreadyExists, [
        {
          text: Languages.Cancel,
        },
        {
          text: Languages.Go,
          onPress: () => props.navigation.navigate('CartScreen'),
        },
      ]);
    }
    setIsLoading(true);
    setTimeout(() => {
      if (!cart?.store?.id) {
        dispatch(
          addToCart({
            store,
            item: {...item, quantity: 1},
          }),
        );
      } else {
        dispatch(
          addToCart({
            item: {...item, quantity: 1},
          }),
        );
      }

      setIsLoading(false);
    }, 100);
  };
  const itemExists = cart
    ? cart.items.find((_item: any) => _item.id === item.id)
    : false;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.cardStyle}
      onPress={() => {
        props.closeModal && props.closeModal();
        props.navigation.navigate('ItemDetailsScreen', {
          item,
          store,
        });
      }}>
      <ImageBackground
        source={item.image}
        imageStyle={{
          height: '100%',
        }}
        style={{
          height: '80%',
          width: '100%',
          alignSelf: 'center',
          justifyContent: 'center',
        }}
        resizeMode="cover">
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: AppColors.transparentBlack,
          }}>
          <View
            style={{
              position: 'absolute',
              bottom: 5,
              left: 5,
            }}>
            <Text style={{color: AppColors.white, fontSize: 20}}>
              {item.name}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
            }}>
            {itemExists ? (
              <QuantityButtons
                value={itemExists.quantity}
                style={{
                  width: '45%',
                  alignSelf: 'flex-end',
                  margin: 5,
                  marginTop: 5,
                }}
                onPlus={onPlus}
                onMinus={onMinus}
                isLoading={isLoading}
              />
            ) : (
              props.showCartBtn && (
                <TouchableOpacity
                  disabled={isLoading ? true : false}
                  style={[
                    styles.addToCartBtn,
                    isLoading && {backgroundColor: AppColors.darkGrey},
                  ]}
                  onPress={handleOnAddToCart}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {isLoading ? (
                      <ActivityIndicator size={25} color={AppColors.primary} />
                    ) : (
                      <AppIcon
                        type="MaterialIcons"
                        name="add-shopping-cart"
                        size={25}
                        color={AppColors.primary}
                      />
                    )}

                    <Text style={{color: AppColors.primary, marginLeft: 5}}>
                      {Languages.AddtoCart}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </ImageBackground>
      <View
        style={{
          backgroundColor: AppColors.white,
          width: '100%',
          height: '20%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <View>
          {item.offerPrice > 0 ? (
            <View style={{flexDirection: 'row'}}>
              <View style={{}}>
                <Text
                  style={{
                    ...styles.body,
                    color: AppColors.darkGrey,
                    textDecorationLine: 'line-through',
                  }}>
                  {item.price +  Languages.symbolPrice}
                </Text>
              </View>
              <View style={{marginHorizontal: 10}}>
                <Text style={{...styles.body, color: 'green'}}>
                  {item.offerPrice +  Languages.symbolPrice}
                </Text>
              </View>
            </View>
          ) : item.price > 0 ? (
            <Text style={{...styles.body, color: 'green'}}>
              {item.price +  Languages.symbolPrice}
            </Text>
          ) : (
            <Text style={{...styles.body, fontSize: 15}}>
              {Languages.RequestPrice}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: 70,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    backgroundColor: AppColors.primary,
    paddingBottom: 5,
  },
  title: {
    fontSize: 22,
    color: AppColors.white,
    fontFamily: Fonts.Medium,
  },
  cardStyle: {
    height: 195,
    width: Dimensions.get('screen').width * 0.9,
    backgroundColor: AppColors.grey,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  body: {
    ...FontWeights.Bold,
    color: AppColors.black,
    ...FontSizes.Body,
  },
  addToCartBtn: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 7,
    margin: 10,
    width: '45%',
    alignSelf: 'flex-end',
  },
});

export default ItemCard;
