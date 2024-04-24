import * as React from 'react';
import { SafeAreaView, Image, Text, TouchableOpacity, View } from 'react-native';
import { s } from 'react-native-wind'
import Avatar from '../Avatar/Avatar';
import Man from '../../src/assets/man.png'
import Woman from '../../src/assets/woman.png'
import { useAuth } from '../authContext/AuthContext';
import Icon from 'react-native-vector-icons/AntDesign'
import CartBtn from '../CartBtn/CartBtn';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppDispatch } from '../../app/hooks/hooks';
import { removeAllFromCart } from '../../app/slices/cartSlice';

export default function UserDrawer({ user }) {

  const { onLogout } = useAuth()
  const dispatch = useAppDispatch()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const navigateToCart = () => {
    // Call this function to navigate to the cart screen
    // You can pass any data if needed in props
    navigation.navigate('CartScreen')
  }

  const LogOut = () => {
    if (onLogout) {
      onLogout().then(() => {
        dispatch(removeAllFromCart())
      })
    }
  }

  return (
    <>
    <SafeAreaView style={[s`flex-1` , {height : '85%'}]}>
      <View style={s`flex-1 justify-top items-center`}>
        <View style={s`flex-1 w-full`}>
          <View style={[s`flex-row h-44 bg-red-500 justify-between items-center p-8` , {elevation : 15 , shadowOffset : { width : 1 , height : 10} , shadowRadius : 10 , shadowOpacity : 0.3}]}>
            <View style={s``}>
              {/* <Avatar ImageUrl={user.gender === 'M' ? Man : Woman} width={80} height={80} /> */}
              <Image source={user.gender === 'M' ? Man : Woman} style={s`w-16 h-16`} width={20} height={20} />
            <Text style={s`text-white p-2 items-center justify-center`}>{user.pname}</Text>
            </View>
            <View style={s``}>
              <TouchableOpacity onPress={navigateToCart}>
                <CartBtn />
              </TouchableOpacity>
            </View>
          </View>
          <View style={s`justify-center items-center mt-12`}>
            <View style={s`flex-row items-center p-4`}>
              <View style={{width : '20%' , alignItems : 'center' }}>

              <Icon name='user'  color={'black'}/>
              </View>
              <View style={{width : '80%' }}>

            <Text style={[s`text-black text-lg p-2` , {fontFamily : 'Quicksand-Bold'}]}>{user.fname}</Text>
              </View>
            </View>
            <View style={s`flex-row items-center p-4`}>
            <View style={{width : '20%'  , alignItems : 'center' }}>

            <Icon name='phone' color={'black'}/>
            </View>
            <View style={{width : '80%'}}>
            <Text style={[s`text-black text-lg p-2` , {fontFamily : 'Quicksand-Bold'}]}>{user.mob}</Text>

            </View>
            </View>
          </View>
        </View>
        <TouchableOpacity style={[{elevation : 20 , shadowOffset : { width : 5, height : 5} , shadowRadius : 10} , s`flex-2 w-full p-4 bg-red-500 items-center`]} onPress={LogOut}>
          <View style={s`flex-row items-center`}>
            <View style={s`pr-4 `}>
              <Icon name='logout' size={18} color={'white'} />
            </View>
            <View>
              <Text style={s`text-white italic font-bold pt-1`}>Sign Out</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </>
  );
}
























// import React, {useRef, useState} from 'react';
// import {
//   Button,
//   DrawerLayoutAndroid,
//   Text,
//   StyleSheet,
//   View,
// } from 'react-native';

// const App = () => {
//   const drawer = useRef<DrawerLayoutAndroid>(null);
//   const [drawerPosition, setDrawerPosition] = useState<'left' | 'right'>(
//     'left',
//   );
//   const changeDrawerPosition = () => {
//     if (drawerPosition === 'left') {
//       setDrawerPosition('right');
//     } else {
//       setDrawerPosition('left');
//     }
//   };

//   const navigationView = () => (
//     <View style={[styles.container, styles.navigationContainer]}>
//       <Text style={styles.paragraph}>I'm in the Drawer!</Text>
//       <Button
//         title="Close drawer"
//         onPress={() => drawer.current?.closeDrawer()}
//       />
//     </View>
//   );

//   return (
//     <DrawerLayoutAndroid
//       ref={drawer}
//       drawerWidth={300}
//       drawerPosition={drawerPosition}
//       renderNavigationView={navigationView}>
//       <View style={styles.container}>
//         <Text style={styles.paragraph}>Drawer on the {drawerPosition}!</Text>
//         <Button
//           title="Change Drawer Position"
//           onPress={() => changeDrawerPosition()}
//         />
//         <Text style={styles.paragraph}>
//           Swipe from the side or press button below to see it!
//         </Text>
//         <Button
//           title="Open drawer"
//           onPress={() => drawer.current?.openDrawer()}
//         />
//       </View>
//     </DrawerLayoutAndroid>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   navigationContainer: {
//     backgroundColor: '#ecf0f1',
//   },
//   paragraph: {
//     padding: 16,
//     fontSize: 15,
//     textAlign: 'center',
//   },
// });

// export default App;