import { StyleSheet, Text, View , Image, ImageSourcePropType, ViewStyle, ImageStyle, StyleProp, Dimensions} from 'react-native'
import React, { PropsWithChildren } from 'react'
import { s } from 'react-native-wind'
import Man from '../../src/assets/man.png'
import { useResponsiveDimensions } from '../../app/hooks/useDimension'


type imgTypeCheck = PropsWithChildren<{
  ImageUrl : ImageSourcePropType
  width : number,
  height : number
}>
 


export default function Avatar({ImageUrl} : imgTypeCheck) {

  const { hp } = useResponsiveDimensions()

  return (
    <View>
        {/* <Image source={ImageUrl} style={{ width: Dimensions.get('window').height < 704 ? 28 : 40, height: Dimensions.get('window').height <= 704 ? 28 : 40 }}/> */}
        <Image source={ImageUrl} style={{ width: hp(40), height: hp(40) }}/>
    </View>
  )
}


const styles = StyleSheet.create({})