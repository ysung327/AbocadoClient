import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import HomeScreen from './HomeScreen';
import VacationTypeDetail from './Vacation/components/VacationTypeDetail';
import VacationDetailView from './Vacation/components/VacationDetailView';
import VacationTypeAdd from './Vacation/components/VacationTypeAdd';
import VacationView from './Vacation/components/VacationView';

const TypeStack = createStackNavigator(
  {
    typeDetail: {
      screen: VacationTypeDetail,
    },
    typeAdd: {
      screen: VacationTypeAdd,
      navigationOptions: {
        gestureResponseDistance: { vertical: 1000 },
      },
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    transparentCard: true,
  }
);


const VacationStack = createStackNavigator(
    {
    Home: HomeScreen,
    Type: TypeStack,
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