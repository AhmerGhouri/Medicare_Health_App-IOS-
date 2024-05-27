import 'react-native-gesture-handler'
import { StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StatusScreen from './Screens/StatusScreen';
import SplashScreen from 'react-native-splash-screen';
import LoginScreen from './Screens/LoginScreen';
import { AuthProvider, useAuth } from './components/authContext/AuthContext';
import LabScreen from './Screens/LabScreen';
import ElevatedCards from './components/Animation/LogoAnimation';
import Registration from './Screens/Registration';
import { checkedData, userData } from './constants';
import MRCreateScreen from './Screens/MRCreateScreen';
import { Provider } from 'react-redux';
import { store } from './app/Store/Store';
import CartBtn from './components/CartBtn/CartBtn';
import CartScreen from './Screens/CartScreen';
import LogoTitle from './components/LogoTitle/LogoTitle';
import { useAppSelector } from './app/hooks/hooks';
import ClearAllBtn from './components/ClearAllBtn/ClearAllBtn';
import MyTabs, { HistoryScreen } from './Navigator/Navigator';
import PasswordGenerator from './Screens/PasswordGenerator';



export type RootStackParamList = {
  HomeScreen: {
    user: userData,
  },
  MyTabs: {
    user: userData
  },
  CurvedBottomTab: {
    user: userData
  },
  Login: any,
  Registration: any;
  Loading: any;
  LabTestRequest: checkedData;
  MRScreen: {
    user: userData
  },
  CartScreen: any,
  StatusScreen: any,
  TabCartScreen: any,
  HistoryScreen: any,
  Password: any,
};



export default function App() {

  useEffect(() => {

    SplashScreen.hide();

  });

  return (

    <AuthProvider>
      <Provider store={store}>
        <Layout></Layout>
      </Provider>
    </AuthProvider>

  );

}

export const Layout = () => {

  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { authState } = useAuth()
  const [headerTitle, setHeaderTitle] = useState<string>('')
  const { cartItem } = useAppSelector(state => state.cart);
  const code = useAppSelector(state => state.code.serviceDetail.shortCode)

  useEffect(() => {
    switch (code) {
      case 'ER':
        setHeaderTitle('Nursing Service')
        break;
      case 'LB':
        setHeaderTitle('Lab Tests Requests')
        break;
      case 'XR':
        setHeaderTitle('Radiology Services')
        break;
      case 'PO':
        setHeaderTitle('Physiotherapy Service')
        break;
      default:
        setHeaderTitle('')
        break;
    }
  }, [code])

  return (

    <NavigationContainer>
      <StatusBar barStyle={'light-content'} backgroundColor='#fb4d4d' />
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        {
          authState?.authenticated ?
            <Stack.Screen
              options={{
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: '#fb4d4d'
                }
              }}
              name="MyTabs"
              component={MyTabs}
              initialParams={{ user: authState.user }}
            />
            :
            <Stack.Screen name="Login" component={LoginScreen} />
        }
        <Stack.Screen
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
          }} name='Loading' component={ElevatedCards} />
        <Stack.Screen
          name="LabTestRequest"
          component={LabScreen}
          options={({ navigation, route }) => ({
            headerShown: true,
            headerBackTitleVisible: false,
            animation: 'slide_from_right',
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#fb4d4d' },
            headerTitleAlign: 'center',
            headerTitle: (props) => <LogoTitle {...props} tintColor={'white'} title={headerTitle} />,
            // Add a placeholder button without the `onPress` to avoid flicker
            headerRight: () => (
              <CartBtn />
            ),
          })}
        />
        <Stack.Screen options={{
          headerShown: true,
          title: 'My Cart',
          headerBackTitleVisible: false,
          headerShadowVisible: true,
          headerBlurEffect: 'extraLight',
          headerTransparent: true,
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          contentStyle: {
            borderCurve: 'circular',
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            borderColor: 'red',
          },
          headerRight: () => {
            return (cartItem.length > 0 ? <ClearAllBtn /> : null)
          },
          headerTitleStyle: {
            fontFamily: 'Quicksand-Bold',
            color: 'white'
          },
          headerStyle: {
            backgroundColor: '#fb4d4d',

          }
        }} name='CartScreen' component={CartScreen} />

        <Stack.Screen
          name='Registration'
          component={Registration}
          options={{
            headerBackTitleVisible: false,
            headerShown: true,
            title: '',
            headerTransparent: true,
            headerTintColor: 'white'
          }}
        />

        <Stack.Screen options={{
          headerBackTitleVisible: false,
          headerShown: true,
          title: '',
          headerTransparent: true,
          headerTintColor: 'white'
        }} name='MRScreen' component={MRCreateScreen} />


        <Stack.Screen options={{
          headerBackTitleVisible: false,
          headerShown: true,
          title: '',
          headerTransparent: true,
          headerTintColor: 'white'
        }} name='StatusScreen' component={StatusScreen} />

        <Stack.Screen name='HistoryScreen' component={HistoryScreen} />
        <Stack.Screen name='Password' options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerTitle: '',
        }} component={PasswordGenerator} />

      </Stack.Navigator>

    </NavigationContainer>


  )


}