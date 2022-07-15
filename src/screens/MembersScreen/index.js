import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  I18nManager,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppIcon, Languages} from '../../common';
import {AppButton, AppInput, Header} from '../../components';
import {MaterialColors, FontWeights, FontSizes, AppColors} from '../../theme';
import DialogBox from 'react-native-dialogbox';
import ks from '../../services/KSAPI';
import {ActivityIndicator} from 'react-native';
import Modal from 'react-native-modalbox';
import {saveUser} from '../../store/actions';
import {FlatList} from 'react-native-gesture-handler';

const MembersScreen = props => {
  const {user} = useSelector(({data}) => data);
  const dispatch = useDispatch();
  const store = props.store;
  const addUserPopup = useRef();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [UserID, setUserID] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [UserName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  useEffect(() => {
    getMembers();
  }, []);

  const addNewUser = () => {
    setLoading(true);
    ks.UpdateUser({
      userID: UserID,
      phone: phoneNumber,
      UserName: UserName,
      fullname: name,
      gender: 0,
      email: email,
    })
      .then(data => {
        if (data.Success) {
          Alert.alert('', Languages.DataEditedSuccessfully, [
            {text: Languages.OK},
          ]);
          setName(data.user.Name);
          setEmail(data.user.Email);
          setUserName(data.user.UserName2);
          setPhoneNumber(data.user.Phone);
          setUserID(data.user.ID);
          addUserPopup.current.close();
        } else {
          return Alert.alert('', Languages.SomethingWentWrong, [
            {text: Languages.OK},
          ]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    getMembers();
  };
  const getMembers = () => {
    setLoading(true);

    ks.UserPharmacyGet({
      OwnerID: user.ID,
      LangID: Languages.langID,
    }).then(data => {
      if (data.Success) {
        setUsersList(data.Users);
      } else {
        Alert.alert('', Languages.SomethingWentWrong, [{text: Languages.OK}]);
      }
      setLoading(false);
    });
  };
  const addUserModal = () => {
    return (
      <Modal
        ref={addUserPopup}
        swipeToClose={false}
        backButtonClose
        useNativeDriver
        coverScreen
        style={{
          backgroundColor: AppColors.optionBG,
          width: '100%',
          height: '100%',
          position: 'absolute',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Header
          {...props}
          // title={store.Name}
          title={Languages.EditUser}
          showCloseIcon
          extraStyle={{height: 50, paddingTop: 0}}
          onClosePress={() => addUserPopup.current.close()}
        />

        <View
          style={{width: '100%', flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView style={{width: '100%', flex: 1}}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                paddingHorizontal: 10,
                marginTop: 20,
              }}>
              <TextInput
                numberOfLines={1}
                multiline
                style={styles.input}
                value={name}
                onChangeText={txt => setName(txt)}
                placeholder={Languages.Name}
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={styles.input}
                value={email}
                onChangeText={txt => setEmail(txt)}
                placeholder={Languages.Email}
                keyboardType="email-address"
              />

              <TextInput
                numberOfLines={1}
                multiline
                style={[styles.input, {textAlign: 'right'}]}
                value={phoneNumber}
                onChangeText={text => {
                  if (isNaN(text)) return;
                  setPhoneNumber(text);
                }}
                placeholder={Languages.PhoneNumber}
                keyboardType="phone-pad"
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={[styles.input]}
                value={UserName}
                onChangeText={txt => setUserName(txt)}
                placeholder={Languages.username}
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={[styles.input, {textAlign: 'right'}]}
                value={password}
                onChangeText={txt => setPassword(txt)}
                secureTextEntry
                placeholder={Languages.password}
              />
              <TextInput
                numberOfLines={1}
                multiline
                style={[styles.input, {textAlign: 'right'}]}
                value={confirmPassword}
                onChangeText={txt => setConfirmPassword(txt)}
                secureTextEntry
                placeholder={Languages.ConfirmPassword}
              />

              <View style={{height: 80}} />
            </View>
          </ScrollView>
          <AppButton
            onPress={addNewUser}
            isLoading={false}
            text={Languages.Confirm}
            extraStyle={{position: 'absolute', bottom: 0, alignSelf: 'center'}}
          />
        </View>
      </Modal>
    );
  };
  const deletePharmacy = memberID => {
    Alert.alert(Languages.Attention, Languages.AreYouSureDeleteMember, [
      {text: Languages.Cancel},
      {
        text: Languages.OK,
        onPress: () => {
          ks.MemberDelete({
            UserID: memberID,
            OwnerID: user.ID,
          }).then(data => {
            if (data?.Success === 1) {
              Alert.alert('', Languages.MemberRemoved);
              getMembers();
            } else {
              Alert.alert('', Languages.SomethingWentWrong);
            }
          });
        },
      },
    ]);
  };

  const usersCards = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setName(item.Name);
          setEmail(item.Email);
          setUserName(item.UserName2);
          setPhoneNumber(item.Phone);
          setUserID(item.ID);
          addUserPopup.current.open();
        }}
        style={styles.cards}>
        <Image
          source={{
            uri: 'https://cdn.icon-icons.com/icons2/2506/PNG/512/user_icon_150670.png',
          }}
          style={{
            height: '80%',
            width: 'auto',
            aspectRatio: 1,
            marginRight: 10,
          }}
        />
        <View
          style={{
            flex: 1,
            height: '100%',
            paddingHorizontal: 5,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text style={{...FontSizes.Label}}>{item.Name}</Text>
          <Text style={{...FontSizes.Caption}}>{item.Email}</Text>
        </View>

        <AppIcon
          name="trash"
          type="Ionicons"
          size={22}
          color="red"
          style={{padding: 7, top: 30, right: 3, position: 'absolute'}}
          onPress={() => deletePharmacy(item.ID)}
        />
      </TouchableOpacity>
    );
  };

  return loading ? (
    <ActivityIndicator
      size="small"
      color={AppColors.primary}
      style={{flex: 1}}
    />
  ) : (
    <View style={styles.container}>
      <Header {...props} title={Languages.EditProfile} showBackIcon />
      {addUserModal()}
      <FlatList
        data={usersList}
        style={{width: '100%', flex: 1}}
        renderItem={usersCards}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <Text
            style={{
              fontSize: 24,
              color: '#777',
              alignSelf: 'center',
              marginTop: '50%',
            }}>
            {Languages.NoMembers}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    color: '#222',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    zIndex: 3,
    elevation: 3,
    borderWidth: 0,
    borderColor: 'red',
    ...FontWeights.Bold,
    fontSize: 18,
    textAlign: 'right',
  },
  cards: {
    width: '94%',
    height: 100,
    alignSelf: 'center',
    borderRadius: 15,
    padding: 8,
    backgroundColor: '#fff',
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MembersScreen;
