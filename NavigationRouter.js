import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import HomeScreen from './HomeScreen';
import VacationTypeDetail from './Vacation/components/VacationTypeDetail';
import VacationDetailView from './Vacation/components/VacationDetailView';
import VacationView from './Vacation/components/VacationView';


const VacationStack = createSwitchNavigator(
    {
    Home: HomeScreen,
    Type: VacationTypeDetail,
    Detail: VacationDetailView
    },
    {
      initialRouteName : 'Home',
      headerMode: 'none',
      defaultNavigationOptions: {
          headerVisible: false,
      }
    }
);

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: VacationStack,
    Vacation: VacationView
  }
);


const Root = createAppContainer(TabNavigator);

export default Root