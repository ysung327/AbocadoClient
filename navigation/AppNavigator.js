import React from 'react';
import {
  Scene,
  Router,
  Overlay,
  Stack,
} from 'react-native-router-flux';
import HomeScreen from '../screens/HomeScreen';
import TypeScreen from '../screens/TypeScreen';
import DetailScreen from '../screens/DetailScreen';
import AnnScreen from '../screens/AnnScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

const Root = () => (
  <Router>
    <Overlay key="overlay">
      <Scene hideNavBar key="root">
        <Scene hideNavBar key="auth-loading" component={AuthLoadingScreen}></Scene>
        <Scene hideNavBar key="vacation">
          <Scene key="home" component={HomeScreen}/>
          <Scene key="detail" component={DetailScreen}/>
          <Scene key="type_detail" component={TypeScreen}/>
          <Scene key="type_ann" component={AnnScreen}/>
        </Scene>
        <Stack hideNavBar key="auth">
          <Scene key="login" component={LoginScreen}/>
          <Scene key="register" component={RegisterScreen}/>
        </Stack>
        
      </Scene>
    </Overlay>
  </Router>
)

export default Root;