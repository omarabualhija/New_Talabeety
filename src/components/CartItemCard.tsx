import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
  I18nManager,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {AppColors, Fonts, FontSizes, FontWeights} from '../theme';
import {
  onItemMinus,
  onItemPlus,
  onItemRemove,
  addToCart,
  cartItemNote,
} from '../store/actions';
import {AppIcon, Constants, Languages} from '../common';
import Modal from 'react-native-modalbox';
import {AppButton, QuantityButtons} from '.';
import ks from '../services/KSAPI';

const CartItemCard = (props: any) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [itemNote, setItemNote] = React.useState(props?.item?.notes || '');
  const [RequestLoading, setRequestLoading] = React.useState(false);
  const [quantity, setQuantity] = React.useState(props?.item.Quantity);
  const [ShowPrice, setShowPrice] = React.useState(
    props?.item?.ShowPrice || false,
  );
  const notePopup = useRef<any>();
  const dispatch = useDispatch();
  const {user} = useSelector(({data}: any) => data);
  const item = props.item;
  React.useEffect(() => {}, []);
  const onPlus = () => {
    setIsLoading(true);

    dispatch(onItemPlus(item.ID));
    setIsLoading(false);
  };

  const onMinus = () => {
    setIsLoading(true);

    dispatch(onItemMinus(item.ID));
    setIsLoading(false);
  };

  const onRemove = () => {
    setIsLoading(true);

    dispatch(onItemRemove(item.ID));
    setIsLoading(false);
  };

  const SaveCart = qnt => {
    qnt == 0 || qnt == '' ? setQuantity(1) : '';
    ks.SaveCart({
      userid: user.ID,
      notes: '',
      pID: item.ID,
      qty: qnt,
      UnitPrice: item.Price,
    }).then(data => {
      console.log(data);
      if (data.success) {
        //   Alert.alert('', Languages.IsDone, [{text: Languages.OK}]);
        props.getCart();

        // CheckCartProduct();
      } else {
        alert('Erorr');
      }
    });
  };

  // const CheckCartProduct = () => {
  //   ks.CheckCartProduct({
  //     userid: user.ID,
  //     pID: item.ID,
  //   }).then(date => {
  //     if (date.success) {
  //       if (date.Check) {
  //         setIsShow(date.Check);
  //       }
  //     } else {
  //       setIsShow(false);
  //     }
  //   });
  // };
  const noteModal = () => {
    return (
      <Modal
        ref={notePopup}
        swipeToClose={false}
        backButtonClose
        useNativeDriver
        coverScreen
        style={{
          backgroundColor: 'transparent',
          width: '100%',
          height: '100%',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <SafeAreaView
          style={{
            width: '94%',
            height: Dimensions.get('screen').height / 2.5,
            backgroundColor: AppColors.optionBG,
            alignSelf: 'center',
            borderRadius: 20,
            padding: 5,
            alignItems: 'center',
          }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              textAlignVertical: 'center',
              color: AppColors.primary,
              ...FontSizes.SubHeading,
            }}>
            {item.Name}
          </Text>

          <AppIcon
            type={'AntDesign'}
            name={'closecircleo'}
            size={26}
            color={AppColors.primary}
            style={{position: 'absolute', left: 0, margin: 5, zIndex: 5}}
            onPress={() => notePopup.current.close()}
          />

          <TextInput
            multiline
            placeholder={Languages.NotePlaceholder}
            style={styles.noteInput}
            onChangeText={txt => setItemNote(txt)}
            value={itemNote}
          />

          <AppButton
            text={Languages.Confirm}
            onPress={() => {
              notePopup.current.close();
              dispatch(cartItemNote({ID: item.ID, Note: itemNote}));
            }}
            extraStyle={{width: '94%', marginBottom: 10}}
          />
        </SafeAreaView>
      </Modal>
    );
    // dispatch(cartItemNote({ID: item.ID, Note: 'HI'}))
  };

  const requestPrice = () => {
    setRequestLoading(true);

    ks.UserShowPriceInsert({
      UserID: user.ID,
      DrugStoreID: props.item.DrugStoreID,
      ProductID: props.item.ID,
    }).then((data: any) => {
      if (data?.Success) {
        if (data.Show.toString() != '0') {
          setShowPrice(true);
          Alert.alert(
            '',
            Languages.CountShowPrice + ' ' + data.Show.toString(),
            [{text: Languages.OK}],
          );
        } else
          Alert.alert('', Languages.MaxPriceRequest, [{text: Languages.OK}]);
        // if (!data.Show === true) {
        //   setShowPrice(true);
        // } else
        //   Alert.alert('', Languages.MaxPriceRequest, [{text: Languages.OK}]);
      } else {
        Alert.alert('', Languages.SomethingWentWrong, [{text: Languages.OK}]);
      }
      setRequestLoading(false);
    });
  };

  return (
    item.DrugStoreID == props.DrugActive.ID && (
      <View style={styles.container}>
        {noteModal()}
        <View
          style={{
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
              width: '100%',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0',
            }}>
            <Text
              style={[styles.body, {flex: 1, textAlign: 'left', fontSize: 18}]}
              numberOfLines={2}>
              {item.Name}
            </Text>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 10,
                borderColor: '#ddd',
                borderWidth: 1,
                overflow: 'hidden',
              }}>
              <Image
                source={
                  item.ImageName
                    ? {
                        uri:
                          'http://talabeety.com/content/products/' +
                          item.ImageName +
                          '_1920x1280.jpg',
                      }
                    : require('../assets/images/pills.jpg')
                }
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
              />
            </View>
          </View>

          {ShowPrice ? (
            <View>
              <Text style={styles.body}>
                {Languages.SingleItemPrice.replace(
                  '*',
                  item?.Price?.toFixed(2) + Languages.symbolPrice,
                )}
              </Text>
              <Text style={{...styles.body, color: 'green'}}>
                {Languages.SingleItemTotalPrice.replace(
                  '*',
                  (item.Price * quantity)?.toFixed(2) + Languages.symbolPrice,
                )}
              </Text>
              <Text style={{...styles.body, color: 'green'}}>
                {Languages.Quantity.replace('*', quantity)}
              </Text>
            </View>
          ) : (
            <Text
              style={{
                ...styles.body,
                fontSize: 16,
                textDecorationLine: 'underline',
                color: AppColors.primary,
                marginHorizontal: 5,
                textAlign: 'left',
              }}
              onPress={requestPrice}>
              {RequestLoading ? (
                <ActivityIndicator size="small" color={AppColors.primary} />
              ) : (
                Languages.RequestPrice
              )}
            </Text>
          )}
          {item.notes ? (
            <Text
              style={{
                color: '#000',
                fontSize: 15,
              }}>
              {Languages.Note + ': ' + item.notes}
            </Text>
          ) : null}
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          {false && (
            <TouchableOpacity onPress={() => notePopup.current.open()}>
              <AppIcon
                type={'MaterialCommunityIcons'}
                name={'file-document-edit-outline'}
                size={26}
                color={AppColors.clickableText}
                style={{
                  backgroundColor: '#eee',
                  padding: 5,
                  borderRadius: 10,
                }}
              />
            </TouchableOpacity>
          )}
          {false && (
            <QuantityButtons
              value={item.Quantity}
              style={{marginTop: 0, height: 45}}
              isLoading={isLoading}
              onPlus={onPlus}
              onMinus={onMinus}
            />
          )}
          <View
            style={{
              width: '100%',
              //backgroundColor:'red',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (parseInt(quantity) > 0) {
                  // if (parseInt(quantity) < parseInt(item.Quantity)) {
                  //  if (quantity < item.MaxQuantity) {

                  setQuantity(parseInt(quantity) + 1);
                  SaveCart(quantity + 1);
                  // }
                } else {
                  setQuantity(1);
                  Alert.alert('', Languages.NoAvailableQuantity, [
                    {text: Languages.OK},
                  ]);
                }
              }}
              disabled={props.isLoading}>
              <AppIcon
                type={'AntDesign'}
                name={'pluscircle'}
                size={30}
                color={props.isLoading ? AppColors.darkGrey : AppColors.primary}
              />
            </TouchableOpacity>
            <View
              style={{
                borderRadius: 10,
                borderWidth: 1,
                borderColor: AppColors.primary,
                backgroundColor: AppColors.white,
                width: 50,
                height: 45,
                justifyContent: 'center',
              }}>
              {props.isLoading ? (
                <View style={{}}>
                  <ActivityIndicator size={'small'} color={AppColors.primary} />
                </View>
              ) : (
                <View style={{}}>
                  <TextInput
                    keyboardType="numeric"
                    value={quantity.toString()}
                    placeholder={quantity.toString()}
                    onChangeText={txt => {
                      // if (item.MaxQuantity > 0) {
                      // if (parseInt(quantity) < parseInt(item.Quantity)) {
                      setQuantity(txt);
                      setTimeout(() => SaveCart(txt.toString()), 1000);

                      // dispatch(
                      //   addToCart({

                      //     item: {...item, quantity: quantity, ShowPrice},
                      //   }),
                      // );
                      // } else {
                      //   setQuantity(1);
                      //   Alert.alert('', Languages.NoAvailableQuantity, [
                      //     {text: Languages.OK},
                      //   ]);
                      // }
                      // } else {
                      //   setQuantity(1);
                      //   Alert.alert('', Languages.NoAvailableQuantity, [
                      //     {text: Languages.OK},
                      //   ]);
                      // }
                    }}
                    numberOfLines={1}
                    maxLength={3}
                    textAlign="center"
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: 17,
                      borderColor: AppColors.primary,
                    }}
                  />
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                if (item.Quantity) {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                    SaveCart(quantity - 1);
                  }
                } else {
                  setQuantity(1);
                }
              }}
              disabled={props.isLoading}>
              <AppIcon
                type={'AntDesign'}
                name={'minuscircle'}
                size={30}
                color={props.isLoading ? AppColors.darkGrey : AppColors.primary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            disabled={isLoading ? true : false}
            onPress={() => {
              return Alert.alert('', Languages.AreYouSure, [
                {text: Languages.Cancel},
                {
                  text: Languages.Yes,
                  onPress: onRemove,
                },
              ]);
            }}>
            <AppIcon
              type={'Ionicons'}
              name={'trash-outline'}
              size={26}
              color={isLoading ? AppColors.darkGrey : AppColors.lightRed}
              style={{
                backgroundColor: '#eee',
                padding: 5,
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.primary,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    color: AppColors.white,
    fontFamily: Fonts.Medium,
  },
  body: {
    ...FontWeights.Bold,
    color: AppColors.primary,
    ...FontSizes.Body,
  },
  noteInput: {
    width: '96%',
    height: '50%',
    borderWidth: 1,
    borderColor: '#bbb',
    textAlignVertical: 'top',
    borderRadius: 15,
    paddingHorizontal: 7,
    color: AppColors.primary,
  },
});

export default CartItemCard;

// import React, {useRef} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Dimensions,
//   ImageBackground,
//   Alert,
//   SafeAreaView,
// } from 'react-native';
// import {useDispatch} from 'react-redux';
// import {AppColors, Fonts, FontSizes, FontWeights} from '../theme';
// import {
//   onItemMinus,
//   onItemPlus,
//   onItemRemove,
//   cartItemNote,
// } from '../store/actions';
// import {AppIcon, Constants, Languages} from '../common';
// import Modal from 'react-native-modalbox';
// import {AppButton, QuantityButtons} from '.';
// import {TextInput} from 'react-native-gesture-handler';

// const CartItemCard = (props: any) => {
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [itemNote, setItemNote] = React.useState(props?.item?.notes || '');

//   const notePopup = useRef<any>();

//   const dispatch = useDispatch();

//   const item = props.item;

//   const onPlus = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       dispatch(onItemPlus(item.ID));
//       setIsLoading(false);
//     }, 200);
//   };

//   const onMinus = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       dispatch(onItemMinus(item.ID));
//       setIsLoading(false);
//     }, 200);
//   };

//   const onRemove = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       dispatch(onItemRemove(item.ID));
//       setIsLoading(false);
//     }, 200);
//   };

//   const noteModal = () => {
//     return (
//       <Modal
//         ref={notePopup}
//         swipeToClose={false}
//         backButtonClose
//         useNativeDriver
//         coverScreen
//         style={{
//           backgroundColor: 'transparent',
//           width: '100%',
//           height: '100%',
//           alignSelf: 'center',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         <SafeAreaView
//           style={{
//             width: '94%',
//             height: Dimensions.get('screen').height / 2.5,
//             backgroundColor: AppColors.optionBG,
//             alignSelf: 'center',
//             borderRadius: 20,
//             padding: 5,
//             alignItems: 'center',
//           }}>
//           <Text
//             numberOfLines={1}
//             style={{
//               flex: 1,
//               textAlignVertical: 'center',
//               color: AppColors.primary,
//               ...FontSizes.SubHeading,
//             }}>
//             {item.Name}
//           </Text>

//           <AppIcon
//             type={'AntDesign'}
//             name={'closecircleo'}
//             size={26}
//             color={AppColors.primary}
//             style={{position: 'absolute', left: 0, margin: 5, zIndex: 5}}
//             onPress={() => notePopup.current.close()}
//           />

//           <TextInput
//             placeholder={Languages.NotePlaceholder}
//             style={styles.noteInput}
//             onChangeText={txt => setItemNote(txt)}
//             value={itemNote}
//           />

//           <AppButton
//             text={Languages.Confirm}
//             onPress={() => {
//               if (itemNote.trim().length > 0) {
//                 notePopup.current.close();
//                 dispatch(cartItemNote({ID: item.ID, Note: itemNote}));
//               }
//             }}
//             extraStyle={{width: '94%', marginBottom: 10}}
//           />
//         </SafeAreaView>
//       </Modal>
//     );
//     // dispatch(cartItemNote({ID: item.ID, Note: 'HI'}))
//   };

//   return (
//     <View style={styles.container}>
//       {noteModal()}
//       <ImageBackground
//         source={
//           item.FullImagePath
//             ? {
//                 uri: Constants.URL + item.FullImagePath + '_1920x1080.jpg',
//               }
//             : require('../assets/images/pills.jpg')
//         }
//         style={{height: '100%', width: '100%'}}>
//         <View
//           style={{
//             position: 'absolute',
//             height: '100%',
//             width: '100%',
//             backgroundColor: AppColors.transparentBlack,
//             padding: 10,
//           }}>
//           <View
//             style={{
//               width: '100%',
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}>
//             <View>
//               <Text style={styles.body}>
//                 {/* {Languages.ItemQuantity.replace('*', item.Name).replace(
//                   '^',
//                   item.quantity,
//                 )} */}
//                 {item.Name + ' ' + item?.Price?.toFixed(2) + '$'}
//               </Text>
//             </View>
//             {item.Price > 0 ? (
//               <View>
//                 <Text style={{...styles.body, color: AppColors.lightGreen}}>
//                   {'$' + (item.Price * item.quantity)?.toFixed(2)}
//                 </Text>
//               </View>
//             ) : (
//               <View>
//                 <Text style={{...styles.body, color: AppColors.lightGreen}}>
//                   {Languages.NoPrice}
//                 </Text>
//               </View>
//             )}
//           </View>
//           <Text
//             style={{
//               color: '#fff',
//               height: '50%',
//               textAlignVertical: 'top',
//               paddingHorizontal: 3,
//             }}>
//             {item.notes}
//           </Text>
//           <QuantityButtons
//             value={item.quantity}
//             style={{alignSelf: 'center', position: 'absolute', bottom: 5}}
//             isLoading={isLoading}
//             onPlus={onPlus}
//             onMinus={onMinus}
//           />
//         </View>

//         <TouchableOpacity
//           onPress={() => notePopup.current.open()}
//           style={{
//             bottom: 10,
//             left: 10,
//             position: 'absolute',
//           }}>
//           <AppIcon
//             type={'MaterialCommunityIcons'}
//             name={'file-document-edit-outline'}
//             size={26}
//             color={AppColors.clickableText}
//             style={{
//               backgroundColor: AppColors.transparentOptionBG,
//               padding: 5,
//               borderRadius: 10,
//             }}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity
//           disabled={isLoading ? true : false}
//           style={{
//             bottom: 10,
//             right: 10,
//             position: 'absolute',
//           }}
//           onPress={() => {
//             return Alert.alert('', Languages.AreYouSure, [
//               {text: Languages.Cancel},
//               {
//                 text: Languages.Yes,
//                 onPress: onRemove,
//               },
//             ]);
//           }}>
//           <AppIcon
//             type={'Ionicons'}
//             name={'trash-outline'}
//             size={26}
//             color={isLoading ? AppColors.darkGrey : AppColors.lightRed}
//             style={{
//               backgroundColor: AppColors.transparentOptionBG,
//               padding: 5,
//               borderRadius: 10,
//             }}
//           />
//         </TouchableOpacity>
//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignSelf: 'center',
//     borderRadius: 20,
//     marginBottom: 10,
//     overflow: 'hidden',
//     width: '90%',
//     height: (Dimensions.get('screen').width * 0.9) / 1.77,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.32,
//     shadowRadius: 5.46,
//     elevation: 4,
//   },
//   title: {
//     fontSize: 22,
//     color: AppColors.white,
//     fontFamily: Fonts.Medium,
//   },
//   cardStyle: {
//     height: 200,
//     width: Dimensions.get('screen').width * 0.9,
//     backgroundColor: AppColors.grey,
//     marginHorizontal: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden',
//     marginBottom: 10,

//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.29,
//     shadowRadius: 2.65,

//     elevation: 7,
//   },
//   body: {
//     ...FontWeights.Bold,
//     color: AppColors.white,
//     ...FontSizes.Label,
//   },
//   noteInput: {
//     width: '96%',
//     height: '50%',
//     borderWidth: 1,
//     borderColor: '#bbb',
//     textAlignVertical: 'top',
//     borderRadius: 15,
//     paddingHorizontal: 7,
//     color: AppColors.primary,
//   },
// });

// export default CartItemCard;
