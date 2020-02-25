import React from 'react';
import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst,
  Overlay,
  Tabs,
  Modal,
  Drawer,
  Stack,
  Lightbox,
} from 'react-native-router-flux';
import HomeScreen from '../screens/HomeScreen';
import TypeScreen from '../screens/TypeScreen';
import DetailScreen from '../screens/DetailScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const AppNavigator = () => (
  <Router>
    <Overlay key="overlay">
      <Stack hideNavBar key="root">
        <Stack hideNavBar key="vacation">
          <Scene key="home" component={HomeScreen}/>
          <Scene key="detail" component={DetailScreen}/>
          <Scene key="type_detail" component={TypeScreen}/>
        </Stack>
        <Stack hideNavBar key="auth">
          <Scene key="login" component={LoginScreen}/>
          <Scene key="register" component={RegisterScreen}/>
        </Stack>
      </Stack>
    </Overlay>
  </Router>
)

export default AppNavigator;