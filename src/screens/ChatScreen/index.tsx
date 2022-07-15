import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import ks from '../../services/KSAPI';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modalbox';
import {AppIcon, Languages} from '../../common';
import messaging from '@react-native-firebase/messaging';
import {AppInput, Header, ChatCard} from '../../components';
import {MaterialColors, FontWeights, FontSizes, AppColors} from '../../theme';
import {showNotifications} from '../../store/actions';
import * as Animatable from 'react-native-animatable';

let chats = [
  {
    name: 'مذخر الحياة',
    lastMsg: 'السلام عليكم',
    createdAt: '2021-05-24T10:49:59.943Z',
    image: require('../../assets/images/pharmacy.jpeg'),
  },
  {
    name: 'مذخر التقوى',
    lastMsg: 'كيف الحال',
    createdAt: '2021-05-24T12:49:59.943Z',
    image: require('../../assets/images/capsules.png'),
  },
  {
    name: 'مذخر بغداد',
    lastMsg: 'اهلا كيف ممكن اساعدك؟',
    createdAt: '2021-05-24T15:49:59.943Z',
    image: require('../../assets/images/pharmacy2.jpeg'),
  },
];
chats = chats.concat(chats);
const totalChats = 0;

const ChatScreen = (props: any) => {
  const {user} = useSelector(({data}: any) => data);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [ChatsList, setChatsList] = useState([]);

  useEffect(() => {
    dispatch(showNotifications(false));
    getChats();
    messaging().onMessage(() => getChats());
  }, []);

  const getChats = () => {
    ks.GetAllChats({
      userID: user?.ID,
      langID: Languages.langID,
    }).then((data: any) => {
      //console.log(JSON.stringify(data))
      if (data?.Success) {
        setChatsList(data.Chats);
      } else {
        setChatsList([]);
      }
      setIsLoading(false);
    });
  };

  const newChatModal = () => {
    return (
      <Modal
        isOpen={isModalVisible}
        hasBackdrop={false}
        swipeToClose={false}
        backButtonClose
        coverScreen
        useNativeDriver
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
            searchText
              ? totalChats.filter((item: any) => item.name.includes(searchText))
              : totalChats
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
          renderItem={({item, index}) => (
            <ChatCard {...props} item={item} key={'chats' + index} />
          )}
        />
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Header {...props} title={Languages.Chat} />
      {newChatModal()}

      {IsLoading ? (
        <ActivityIndicator
          size="small"
          color={AppColors.primary}
          style={{marginTop: '60%'}}
        />
      ) : (
        <>
          {chats.length > 0 ? (
            <View style={{width: '100%', flex: 1}}>
              <FlatList
                data={ChatsList.filter((d: any) =>
                  d?.DrugStoreName ? true : false,
                )}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => <View style={{height: 10}} />}
                ListFooterComponent={() => <View style={{height: 65}} />}
                ListEmptyComponent={() => (
                  <Text
                    style={{
                      ...FontWeights.Bold,
                      alignSelf: 'center',
                      fontSize: 24,
                      marginTop: '60%',
                      color: 'gray',
                    }}>
                    {Languages.NoChat}
                  </Text>
                )}
                renderItem={({item, index}) => (
                  <Animatable.View
                    useNativeDriver
                    key={index}
                    delay={150 + 150 * index}
                    animation={'fadeInLeft'}>
                    <ChatCard item={item} {...props} />
                  </Animatable.View>
                )}
              />

              {false && (
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{
                    backgroundColor: AppColors.primary,
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    zIndex: 99,
                  }}
                  onPress={() => {
                    setIsModalVisible(!isModalVisible);
                  }}>
                  <AppIcon
                    type={'MaterialCommunityIcons'}
                    name={'plus'}
                    size={30}
                    color={AppColors.white}
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                height: '100%',
                justifyContent: 'center',
              }}>
              <AppIcon
                type="MaterialCommunityIcons"
                name={'chat'}
                size={100}
                color={AppColors.primary}
              />
              <Text style={styles.heading}>{Languages.NoChat}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
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
  body: {
    ...FontWeights.Regular,
    color: AppColors.black,
    ...FontSizes.Body,
  },
  message: {
    ...FontWeights.Regular,
    color: AppColors.black,
    ...FontSizes.Body,
  },
  title: {
    ...FontWeights.Bold,
    fontSize: 20,
  },
  chatCard: {
    backgroundColor: AppColors.optionBG,
    width: '100%',
    height: 100,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    padding: 10,
    flex: 1,
  },
  inputs: {
    width: '80%',
    borderBottomColor: AppColors.primary,
    borderBottomWidth: 1,
    marginBottom: 10,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});

export default ChatScreen;
