import {createStackNavigator} from "react-navigation-stack";
import {createAppContainer} from "react-navigation";
import SignInView from "../SignInView";
import CreateUser from "../GuestComponent/CreateUser";

const StackNavigatorInitialView = createStackNavigator(
    {
        SignIn: {
            screen: SignInView,
            navigationOptions: {
                headerShown: false
            }
        },
        SignUp: {
            screen: CreateUser
        },

    },
    { initialRouteKey: 'SignIn' }
);

const InitialView = createAppContainer(StackNavigatorInitialView)
export default InitialView
