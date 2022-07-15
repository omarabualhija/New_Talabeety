//@ts-nocheck
import React, {useState, useRef, createRef, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  I18nManager,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppIcon, Languages} from '../../common';
import {AppButton, AppInput, Header} from '../../components';
import {MaterialColors, FontWeights, FontSizes, AppColors} from '../../theme';
import DialogBox from 'react-native-dialogbox';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Permissions, {PERMISSIONS, check} from 'react-native-permissions';
import ks from '../../services/KSAPI';
import {ActivityIndicator} from 'react-native';
import Modal from 'react-native-modalbox';
import {saveUser} from '../../store/actions';

interface ImageBody {
  uri?: string;
  base64?: string;
  fileName?: string;
  fileSize?: number;
  height?: number;
  width?: number;
  type?: string;
}

const EditProfileScreen = (props: any) => {
  const {user} = useSelector(({data}: any) => data);
  const [image, setImage] = useState<ImageBody>();
  const [name, setName] = useState(user ? user.Name : '');
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [phone, setPhone] = useState(user ? user.Phone : '');
  const [email, setEmail] = useState(user ? user.Email : '');
  const [UserName, setUserName] = useState(user ? user.UserName2 : '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.route.params && props.route.params.editPicture) {
      checkImagesPermission();
    }
  }, []);

  var dialogbox = createRef();
  const checkImagesPermission = () => {
    if (Platform.OS == 'android') {
      Permissions.check('android.permission.READ_EXTERNAL_STORAGE').then(
        response => {
          if (response != 'granted') {
            Permissions.request('android.permission.READ_EXTERNAL_STORAGE')
              .then(value => {
                if (value == 'granted') {
                  showImageOptions();
                }
              })
              .catch(error => {});
          } else if (response == 'granted') {
            showImageOptions();
          }
        },
      );
    } else {
      Permissions.check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(response => {
        if (response != 'granted') {
          Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY)
            .then(value => {
              if (value == 'granted') {
                showImageOptions();
              }
            })
            .catch(error => {});
        } else if (response == 'granted') {
          showImageOptions();
        }
      });
    }
  };

  const pickSingle = () => {
    launchImageLibrary(
      {
        quality: 0.6,
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: Dimensions.get('screen').height,
        maxWidth: Dimensions.get('screen').width,
      },
      _image => {
        let image = {
          uri: _image.uri,
          base64: _image.base64,
          fileName: _image.fileName,
          fileSize: _image.fileSize,
          height: _image.height,
          width: _image.width,
          type: _image.type,
        };
        setImage(image);
      },
    );
  };

  const pickSingleWithCamera = () => {
    launchCamera(
      {
        quality: 0.6,
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: Dimensions.get('screen').height,
        maxWidth: Dimensions.get('screen').width,
      },
      _image => {
        let image = {
          uri: _image.uri,
          base64: _image.base64,
          fileName: _image.fileName,
          fileSize: _image.fileSize,
          height: _image.height,
          width: _image.width,
          type: _image.type,
        };
        setImage(image);
      },
    );
  };

  const showImageOptions = () => {
    dialogbox.pop({
      title: Languages.ImageSource,
      btns: [
        {
          text: Languages.camera,
          style: {},
          callback: () => {
            dialogbox.close();
            setTimeout(() => {
              pickSingleWithCamera();
            }, 500);
          },
        },
        {
          text: Languages.album,
          style: {},
          callback: () => {
            dialogbox.close();
            setTimeout(() => {
              pickSingle();
            }, 500);
          },
        },
      ],
    });
  };

  return loading ? (
    <ActivityIndicator
      size="small"
      color={AppColors.primary}
      style={{flex: 1}}
    />
  ) : (
    <>
      <Header {...props} title={Languages.EditProfile} showBackIcon />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {false && (
          <TouchableOpacity
            delayPressIn={0}
            style={{
              borderColor: AppColors.primary,
              borderWidth: 1,
              borderRadius: 10,
              height: 200,
              width: '60%',
              alignItems: 'center',
              padding: 5,
            }}
            onPress={() => {
              checkImagesPermission();
            }}>
            {image ? (
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: AppColors.grey,
                }}>
                <Image
                  source={{uri: image.uri}}
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                  resizeMode="contain"
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: -10,
                    left: -10,
                    backgroundColor: AppColors.transparentGrey,
                    borderWidth: 0.5,
                    borderColor: AppColors.primary,
                    height: 30,
                    width: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <AppIcon
                    type="MaterialIcons"
                    name="edit"
                    size={25}
                    color={AppColors.primary}
                  />
                </View>
              </View>
            ) : (
              <AppIcon
                type="MaterialCommunityIcons"
                size={200}
                name="camera"
                color={AppColors.grey}
              />
            )}
          </TouchableOpacity>
        )}
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <AppInput
            style={styles.inputs}
            containerExtraStyle={{width: '94%', height: 50}}
            placeholder={Languages.Name}
            value={name}
            onChangeText={text => {
              setName(text);
            }}
          />
          <AppInput
            style={styles.inputs}
            containerExtraStyle={{width: '94%', height: 50}}
            placeholder={Languages.Email}
            value={email}
            onChangeText={text => {
              setEmail(text);
            }}
          />
          <AppInput
            style={styles.inputs}
            containerExtraStyle={{width: '94%', height: 50}}
            placeholder={Languages.username}
            value={UserName}
            onChangeText={text => {
              setUserName(text);
            }}
          />

          <AppInput
            style={styles.inputs}
            containerExtraStyle={{width: '94%', height: 50}}
            placeholder={Languages.Phone}
            value={phone}
            onChangeText={text => {
              setPhone(text);
            }}
          />
          <View style={{width: '80%'}}>
            <AppButton
              extraStyle={{
                backgroundColor: AppColors.primary,
              }}
              textStyle={{color: AppColors.white}}
              text={Languages.ChangePassword}
              onPress={() => {
                setIsModalVisible(true);
              }}
            />
          </View>
          <View style={{marginTop: 100, width: '100%'}}>
            <AppButton
              extraStyle={{width: '100%', elevation: 3}}
              text={Languages.SaveChanges}
              onPress={() => {
                setLoading(true);
                ks.UpdateUser({
                  userID: user.ID,
                  phone: phone,
                  UserName: UserName,
                  fullname: name,
                  gender: 0,
                  email: email,
                })
                  .then(data => {
                    if (data.Success) {
                      dispatch(saveUser(data.user));
                      props.navigation.goBack();
                      Alert.alert('', Languages.DataEditedSuccessfully, [
                        {text: Languages.OK},
                      ]);
                    } else {
                      return Alert.alert('', Languages.SomethingWentWrong, [
                        {text: Languages.OK},
                      ]);
                    }
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        isOpen={isModalVisible}
        hasBackdrop={false}
        swipeToClose={false}
        backButtonClose={false}
        coverScreen
        onClosed={() => {
          setIsModalVisible(false);
          setNewPassword('');
          setCurrentPassword('');
          setConfirmPassword('');
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
            width: '100%',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}>
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
          <View style={{height: 10, width: 10}}></View>
        </View>
        <ScrollView
          style={{
            width: '100%',
            marginTop: 50,
          }}
          contentContainerStyle={{
            alignItems: 'center',
          }}>
          <AppInput
            style={styles.inputs}
            containerExtraStyle={{width: '94%', height: 50}}
            placeholder={Languages.CurrentPassword}
            value={currentPassword}
            onChangeText={text => {
              setCurrentPassword(text);
            }}
            secureTextEntry={true}
          />
          <View style={{marginTop: 20, width: '100%', alignItems: 'center'}}>
            <AppInput
              style={styles.inputs}
              containerExtraStyle={{width: '94%', height: 50}}
              placeholder={Languages.NewPassword}
              value={newPassword}
              onChangeText={text => {
                setNewPassword(text);
              }}
              secureTextEntry={true}
            />
            <AppInput
              style={styles.inputs}
              containerExtraStyle={{width: '94%', height: 50}}
              placeholder={Languages.ConfirmPassword}
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
              }}
              secureTextEntry={true}
            />
          </View>
          <View style={{marginTop: 50, width: '100%'}}>
            <AppButton
              isLoading={loadingPassword}
              text={Languages.Confirm}
              onPress={() => {
                if (newPassword !== confirmPassword) {
                  return Alert.alert('', Languages.PasswordDoesntMatch, [
                    {text: Languages.OK},
                  ]);
                }
                setLoadingPassword(true);
                ks.ResetPassword({
                  OldPassword: currentPassword,
                  Password: newPassword,
                  userID: user.ID,
                })
                  .then(data => {
                    if (data.Success) {
                      Alert.alert('', Languages.DataEditedSuccessfully, [
                        {text: Languages.OK},
                      ]);
                      setIsModalVisible(false);
                    } else {
                      return Alert.alert('', Languages.IncorrectPassword, [
                        {text: Languages.OK},
                      ]);
                    }
                  })
                  .finally(() => {
                    setLoadingPassword(false);
                  });
              }}
            />
          </View>
        </ScrollView>
      </Modal>
      <DialogBox
        isOverlay
        style={{
          popupContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
            overflow: 'hidden',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            zIndex: 10,
            elevation: 10,
          },
        }}
        ref={(ref: any) => {
          dialogbox = ref;
        }}
      />
    </>
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
    ...FontWeights.Light,
    ...FontSizes.SubHeading,
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

export default EditProfileScreen;
