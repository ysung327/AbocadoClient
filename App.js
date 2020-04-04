import React, { useState } from 'react';
import * as Font from 'expo-font'
import { AppLoading } from 'expo';
import Root from './navigation/AppNavigator'
import { setCustomView, setCustomText } from 'react-native-global-props';

const fetchFonts = () => {
  return Font.loadAsync({
    'NanumSquare': require('./fonts/NanumSquare_acB.ttf'),
    'MyriadPro': require('./fonts/Myriad-Pro_31655.ttf'),
    'BlackHan': require('./fonts/BlackHanSans-Regular.ttf'),
  })
}

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false)
  
  if(dataLoaded) {
    return(
      <Root/>
    )
  }
  else {
    return <AppLoading
    startAsync={fetchFonts}
    onFinish={()=>setDataLoaded(true)}/>
  }
}
