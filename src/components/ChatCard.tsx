import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  I18nManager,
} from 'react-native';
import {AppColors, Fonts, FontSizes, FontWeights} from '../theme';
import {AppIcon, Constants, Languages, Utils} from '../common';
import FastImage from 'react-native-fast-image';
import moment from 'moment';


const WIDTH = Dimensions.get('screen').width;

const ChatCard = ({item, ...props}: any) => {
  const [showImage, setShowImage] = useState(true);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.chatCard}
      onPress={() => {
        props.navigation.navigate('ChatDetailsScreen', {
          item: {...item, isFromChatList: true, DrugStoreID:item.DrugStoreID},
        });
      }}>
        <FastImage
          source={
            showImage
              ? {
                  uri:
                    Constants.CONTENT_URL +
                    '/DrugStore/' +
                    item?.DrugStoreID +
                    '_1920x1280.jpg',
                }
              : require('../assets/images/logo2.png')
          }
          onError={() => setShowImage(false)}
          style={{
            height: 75,
            width: 75,
            borderRadius: 40,
            borderWidth: 1.4,
            borderColor: AppColors.primary,
          }}
        />

      <View style={{flex: 1, justifyContent:'space-between', height:'100%', paddingLeft:10, paddingBottom:3, paddingTop:7}}>
        <Text style={styles.nameText} numberOfLines={1}>{item.DrugStoreName}</Text>
        <Text style={styles.messageText} numberOfLines={1}>{item.LastMessage}</Text>
        <Text style={styles.dateText}>{moment(item.createdAt).format('hh:mm a')}</Text>
      </View>
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  chatCard: {
    backgroundColor: AppColors.optionBG,
    width: '96%',
    alignSelf: 'center',
    borderRadius: 15,
    height: 100,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    zIndex: 3,
    elevation: 3,
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    ...FontWeights.Bold,
    ...FontSizes.SubHeading,
    margin: 20,
    color: AppColors.primary,
  },
  nameText: {
    ...FontWeights.Bold,
    fontSize: 18,
    alignSelf: 'flex-start',
    textAlign: 'left',
    flex:2,
  },
  messageText: {
    ...FontWeights.Regular,
    color: AppColors.black,
    ...FontSizes.Body,
    alignSelf: 'flex-start',
    textAlign: 'left',
    flex:2,
  },
  dateText: {
    ...FontWeights.Bold,
    color: '#555',
    fontSize:14,
    flex:1,
  },
  inputs: {
    width: '80%',
    borderBottomColor: AppColors.primary,
    borderBottomWidth: 1,
    marginBottom: 10,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});
export default ChatCard;
