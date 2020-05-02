import Root from './navigation/AppNavigator'
import React, { Component } from 'react';
import { Provider } from "react-redux";
import store from "./app/store";
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

let customFonts = {
  BlackHanSans: require('./assets/fonts/BlackHanSans-Regular.ttf'),
  MyriadPro: require('./assets/fonts/Myriad-Pro_31655.ttf'),
  NanumSquare: require('./assets/fonts/NanumSquare_acR.ttf'),
};

export default class App extends Component {
  state = {
    fontsLoaded: false,
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  
  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    if (this.state.fontsLoaded) {
      return (
        <Provider store={store}>
          <Root/> 
        </Provider>
      );
    } else {
      return <AppLoading/>;
    }
  }
}

