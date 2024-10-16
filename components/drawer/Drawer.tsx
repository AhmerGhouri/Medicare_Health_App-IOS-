import * as React from 'react';
import { SafeAreaView, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
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
import { useMemo } from 'react';
import { useResponsiveDimensions } from '../../app/hooks/useDimension';

export default function UserDrawer({ user }) {

  const { onLogout } = useAuth()
  const dispatch = useAppDispatch()
  const {hp , wp} = useResponsiveDimensions()
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

  const styles = useMemo(() => {

    return StyleSheet.create({

    })

  } , [])

  return (
    <>
      <SafeAreaView style={[s`flex-1`, { height: '85%' }]}>
        <View style={s`flex-1 justify-top items-center`}>
          <View style={s`flex-1 w-full`}>
            <View style={[s`flex-row h-44 bg-red-500 justify-between items-center p-8`, { elevation: 15, shadowOffset: { width: 1, height: 10 }, shadowRadius: 10, shadowOpacity: 0.3 }]}>
              <View style={s``}>
                {/* <Avatar ImageUrl={user.gender === 'M' ? Man : Woman} width={80} height={80} /> */}
                <Image source={user.gender === 'M' ? Man : Woman} style={{width : hp(60) , height : hp(60)}} />
                <Text allowFontScaling={false} style={[s`text-white p-2 items-center justify-center` , { fontSize : hp(15)}]}>{user.pname}</Text>
              </View>
              <View style={s``}>
                <TouchableOpacity onPress={navigateToCart}>
                  <CartBtn />
                </TouchableOpacity>
              </View>
            </View>
            <View style={s`justify-center items-center mt-12`}>
              <View style={s`flex-row items-center p-4`}>
                <View style={{ width: '20%', alignItems: 'center' }}>
                  <Icon name='user' color={'black'} size={hp(18)}/>
                </View>
                <View style={{ width: '80%' }}>
                  <Text allowFontScaling={false} style={[s`text-black p-2`, {fontSize : hp(18) ,  fontFamily: 'Quicksand-Bold' }]}>{user.fname}</Text>
                </View>
              </View>
              <View style={s`flex-row items-center p-4`}>
                <View style={{ width: '20%', alignItems: 'center' }}>
                  <Icon name='phone' color={'black'} size={hp(18)}/>
                </View>
                <View style={{ width: '80%' }}>
                  <Text allowFontScaling={false} style={[s`text-black p-2`, {fontSize : hp(18) , fontFamily: 'Quicksand-Bold' }]}>{user.mob}</Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity style={[{ elevation: 20, shadowOffset: { width: 5, height: 5 }, shadowRadius: 10 }, s`flex-2 w-full p-4 bg-red-500 items-center`]} onPress={LogOut}>
            <View style={s`flex-row items-center`}>
              <View style={s`pr-4 `}>
                <Icon name='logout' size={hp(18)} color={'white'} />
              </View>
              <View>
                <Text allowFontScaling={false} style={[s`text-white italic font-bold pt-1` , { fontSize : hp(14)}]}>Sign Out</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}