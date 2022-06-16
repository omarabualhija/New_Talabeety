import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  I18nManager,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import ks from '../../services/KSAPI';
import {useSelector, useDispatch} from 'react-redux';
import {Header} from '../../components';
import {AppIcon, Constants, Languages} from '../../common';
import messaging from '@react-native-firebase/messaging';
import {FontWeights, FontSizes, AppColors, Fonts} from '../../theme';
import {GiftedChat, Send, MessageText, Bubble} from 'react-native-gifted-chat';
import FastImage from 'react-native-fast-image';
import {showNotifications} from '../../store/actions';

const ChatDetailsScreen = props => {
  const dispatch = useDispatch();
  const item = props.route.params.item;

  const {user} = useSelector(({data}) => data);
  const [messages, setMessages] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [showImage, setShowImage] = useState(true);
  const [ChatID, setChatID] = useState(
    item?.isFromChatList ? item.ID : 1000000,
  );

  useEffect(() => {
    getMessages();
    dispatch(showNotifications(false));
    messaging().onMessage(() => getMessages());
  }, []);

  const getMessages = () => {
    ks.GetMessages({
      SenderID: user?.ID,
      UserID: user?.ID,
      DrugStoreID: item?.DrugStoreID,
      ChatID: ChatID,
      OwnerID: item?.OwnerID,
    }).then(data => {
      if (data.Success) {
        if (data.messages.length > 0) {
          setMessages(
            data.messages.reverse().map((item, index) => ({
              _id: item?.ID,
              text: item?.Text,
              createdAt: moment(item?.DateAdded),
              user: {_id: item?.SenderID, name: item?.ReciverName},
            })),
          );
        } else {
          setLoading(false);
          setMessages([]);
        }
        item?.isFromChatList ? null : setChatID(data.messages[0].ChatID);
      } else {
        setMessages([]);
        setLoading(false);
      }
      setLoading(false);
    });
  };

  const onSend = (messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );

    ks.SendMessage({
      senderID: user?.ID,
      receiverID: item?.OwnerID,
      DrugStoreID: item?.DrugStoreID,
      message: messages[0].text,
      UserID: user?.ID,
      langID: Languages.langID,
      ChatID: ChatID,
    });
  };

  const header = () => {
    return (
      <View style={styles.headerContainer}>
        <FastImage
          onError={() => setShowImage(false)}
          style={{
            height: 45,
            width: 45,
            borderRadius: 30,
            marginHorizontal: 5,
            borderWidth: 0.2,
            borderColor: '#666',
          }}
          source={
            showImage
              ? {
                  uri:
                    Constants.CONTENT_URL +
                    '/DrugStore/' +
                    item?.DrugStoreID +
                    '_1920x1280.jpg',
                }
              : require('../../assets/images/logo2.png')
          }
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text
          numberOfLines={1}
          style={{
            ...FontWeights.Regular,
            color: '#fff',
            ...FontSizes.SubHeading,
            flex: 1,
            textAlign: 'left',
          }}>
          {item?.DrugStoreName || ''}
        </Text>
        <AppIcon
          name="arrowright"
          type="AntDesign"
          size={25}
          color="#fff"
          style={{padding: 5}}
          onPress={() => props.navigation.goBack()}
        />
      </View>
    );
  };

  if (Loading)
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      {header()}

      <GiftedChat
        messages={messages}
        renderAvatar={null}
        onSend={messages => onSend(messages)}
        user={{
          _id: user?.ID,
        }}
        messagesContainerStyle={{}}
        keyboardShouldPersistTaps="never"
        placeholder={Languages.TypeAMessage}
        renderSend={props => {
          return (
            <Send
              {...props}
              containerStyle={{
                height: '100%',
                justifyContent: 'center',
              }}>
              <View
                style={
                  I18nManager.isRTL
                    ? {transform: [{rotate: '180deg'}], marginHorizontal: 5}
                    : {marginHorizontal: 5}
                }>
                <AppIcon
                  type={'MaterialCommunityIcons'}
                  name={'send'}
                  size={30}
                  color={AppColors.primary}
                />
              </View>
            </Send>
          );
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: [
                  {
                    backgroundColor: AppColors.primary,
                  },
                  styles.shadow,
                ],
                left: [
                  {
                    backgroundColor: AppColors.white,
                  },
                  styles.shadow,
                ],
              }}
              renderMessageText={_props => {
                return (
                  <MessageText
                    {..._props}
                    textStyle={{
                      right: {
                        color: AppColors.white,
                        fontFamily: Fonts.Medium,
                      },
                    }}
                  />
                );
              }}
              textStyle={{
                right: {
                  fontSize: 18,
                  lineHeight: 27,
                  color: AppColors.white,
                  fontFamily: Fonts.Medium,
                },
                left: {
                  fontSize: 18,
                  lineHeight: 27,
                  color: AppColors.white,
                  fontFamily: Fonts.Medium,
                },
              }}
            />
          );
        }}
        text={text}
        onInputTextChanged={_text => {
          setText(_text);
        }}
        renderMessageText={props => {
          return (
            <MessageText
              {...props}
              customTextStyle={{
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                ...FontWeights.Regular,
              }}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e8e8e8',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: AppColors.primary,
    width: '100%',
    height: 65,
    marginTop: StatusBar.currentHeight,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    zIndex: 3,
    elevation: 3,
    marginTop: 2,
  },
});

export default ChatDetailsScreen;
