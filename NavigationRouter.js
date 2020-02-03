import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import HomeScreen from './HomeScreen';
import VacationTypeDetail from './Vacation/components/VacationTypeDetail';
import VacationDetailView from './Vacation/components/VacationDetailView';


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

const Root = createAppContainer(VacationStack);

export default Root