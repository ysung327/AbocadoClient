import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import HomeScreen from './HomeScreen';
import VacationTypeDetail from './Vacation/components/VacationTypeDetail';
import VacationDetailView from './Vacation/components/VacationDetailView';
import Login from './User/components/Login';
import Register from './User/components/Register';


const VacationStack = createStackNavigator(
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
)

const UserStack = createStackNavigator(
  {
  Login: Login,
  Register: Register
  },
  {
    initialRouteName : 'Login',
    headerMode: 'none',
    defaultNavigationOptions: {
        headerVisible: false,
    }
  }
)

const Stack = createStackNavigator(
  {
  Vacation: VacationStack,
  Auth: UserStack,
  },
  {
    initialRouteName : 'Vacation',
    headerMode: 'none',
    defaultNavigationOptions: {
        headerVisible: false,
    }
  }
)

const Root = createAppContainer(Stack);

export default Root