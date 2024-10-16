import { Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { s } from 'react-native-wind'
import Icon from 'react-native-vector-icons/AntDesign'
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler'
import { useAppSelector } from '../../app/hooks/hooks'
import { useNavigation } from '@react-navigation/native'
import {  NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { useResponsiveDimensions } from '../../app/hooks/useDimension'


type cartScreenProps = NativeStackScreenProps<RootStackParamList, 'CartScreen'>



const CartBtn = () : JSX.Element => {


    const { cartItem } = useAppSelector(state => state.cart);
    const {hp} = useResponsiveDimensions()

    return (
        <View>
            <View style={s`absolute right-4 bg-white w-4 items-center rounded-full`}>
                <Text allowFontScaling={false} style={s`text-xs text-red-800`}>{cartItem.length}</Text>
            </View>
            <Icon name='shoppingcart' size={hp(20)} style={{ marginRight: 20, marginTop: 4, padding: 4, justifyContent: 'center', alignItems: 'center' }} color={'white'} />
        </View>
    )
}


export default CartBtn
