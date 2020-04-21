import React, { useState } from 'react';
import * as Font from 'expo-font'
import { AppLoading } from 'expo';
import Root from './navigation/AppNavigator'
const fetchFonts = () => {
  return Font.loadAsync({
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
