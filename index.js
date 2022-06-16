import 'react-native-gesture-handler';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { enableScreens } from 'react-native-screens';
enableScreens();

LogBox.ignoreAllLogs(true);


AppRegistry.registerComponent(appName, () => App);


// google maps directions
// about us redesign
// 