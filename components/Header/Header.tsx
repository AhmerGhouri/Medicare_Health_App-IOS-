import { Dimensions, View , Image} from 'react-native'
import HeaderImg from '../../src/assets/Ellipse.png'
import React from 'react'
import { useResponsiveDimensions } from '../../app/hooks/useDimension'

export default function Header() {

  const { wp , hp } = useResponsiveDimensions()

  return (
    <View>
      {/* <Image source={HeaderImg} style={{ width: Dimensions.get('window').height < 804 ? 260 : 350, height: Dimensions.get('window').height < 804 ? 100 : 120 }} /> */}
      <Image source={HeaderImg} width={hp(80)} height={hp(80)} />

    </View>
  )
}
