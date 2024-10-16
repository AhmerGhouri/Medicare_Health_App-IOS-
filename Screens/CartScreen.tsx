import { Dimensions, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../app/hooks/hooks';
import { s } from 'react-native-wind';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import LottieView from 'lottie-react-native';
import CheckOut from '../components/Checkout/CheckOut';
import CashDeliveryModal from '../components/Modals/CashDeliveryModal';
import { removeAllFromCart, removeFromCart } from '../app/slices/cartSlice';
import { clearPatientToStore } from '../app/slices/patientSlice';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Icon from 'react-native-vector-icons/Entypo'



type cartScreenProps = NativeStackScreenProps<RootStackParamList, 'CartScreen'>



const CartScreen = ({ route, navigation }: cartScreenProps) => {


  const { cartItem } = useAppSelector(state => state.cart);
  const [delLoading, setDelLoading] = useState(false)
  const dispatch = useAppDispatch()
  const [cashModalVisible, setCashModalVisible] = useState(false)
  const handleRemoveFromCart = (id) => dispatch(removeFromCart(id))
  

  const handleCOD = (value) => {

    setDelLoading(value)

    setTimeout(() => {

      setDelLoading(false)
      dispatch(removeAllFromCart())
      dispatch(clearPatientToStore())
      setCashModalVisible(true)

    }, 6000)

  }

  const handlePO = (value) => {

    setDelLoading(value)

    setTimeout(() => {

      setDelLoading(false)

    }, 6000)

  }

  const handleWebView = (obj) => {

    setTimeout(() => {
      navigation.navigate('Password', obj)
    }, 2000)

  }

  const handleClose = () => {

    setCashModalVisible(false)

  }

  
  const CartItem = useCallback(({ item }) => {
    
    const [loader, setLoader] = useState<boolean>(true)
    useEffect(() => {
      setTimeout(() => {
        setLoader(false)
      }, 5000)
    }, [])
    

    return (
      <>
        <SafeAreaView style={s`flex-1`}>
          <GestureHandlerRootView style={[s`items-center`]} key={item.id}>
            <View style={[s`flex-row mt-3 mb-3 justify-between rounded-lg items-center`,
            {
              width: '90%',
              padding: 18,
              elevation: 8,
              backgroundColor: "white"

            }]}
            >
              {
                loader ?
                  <SkeletonPlaceholder borderRadius={4}>
                    <SkeletonPlaceholder.Item flexDirection="row" justifyContent='space-around'
                      gap={50} alignItems="center">
                      <SkeletonPlaceholder.Item width={'70%'} height={30} />
                      <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder> :
                  <>
                    <View style={{ width: '70%', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: '6%' }}>
                      <Text allowFontScaling={false} style={[s`text-xs`, { fontFamily: 'Montserrat-Bold' }]}>{item.samplE_COL_TIME}</Text>
                      <Text allowFontScaling={false} style={[s`text-black `, { fontFamily: 'Quicksand-Bold' }]}>{item.ltesT_DESC}</Text>
                      <Text allowFontScaling={false} style={[s`text-red-500 text-xs`, { fontFamily: 'Montserrat-Medium' }]}>{item.samplE_COL_DATE}</Text>
                    </View>
                    <Text allowFontScaling={false} style={s`text-blue-600`}>Rs. {item.amt}</Text>

                    <View style={s`absolute -top-2 -right-2`}>
                      <TouchableOpacity style={[s` border-2 rounded-full justify-center items-center w-6 h-6`]}
                        onPress={() => handleRemoveFromCart(item.ltesT_ID)}>
                        <Icon
                          name='cross'
                          size={15}
                          color={'red'} />

                      </TouchableOpacity>
                    </View>
                  </>
              }



            </View>
          </GestureHandlerRootView>
        </SafeAreaView>

      </>
    )
  }, [cartItem])


  return (
    <>
      <SafeAreaView style={s`flex-1`}>
        {delLoading && (
          <View style={styles.overlay}>
            <LottieView
              style={[styles.lottie]}
              source={require('../src/animations/Del.json')}
              autoPlay
              loop
            />
          </View>
        )}
        <GestureHandlerRootView style={s`flex-1`}>
          {cartItem.length === 0 ?
            <View style={[s`flex shrink-0 w-full justify-center items-center`, styles.lottieContainer]}>
              <LottieView
                style={[styles.lottie]}
                source={require('../src/animations/emptyCart.json')}
                autoPlay
                loop
              />
              <Text allowFontScaling={false} style={[s`text-lg text-red-500`, { fontFamily: 'Quicksand-Bold' }]}>Your Cart is Empty</Text>
            </View>
            :
            <>
              <SafeAreaView style={s`flex-1`}>
                <View style={s`flex-1`}>
                  <View style={[s`flex-2 grow-0`, { height: '70%' }]}>
                    <FlatList
                      data={cartItem}
                      keyExtractor={item => item.ltesT_ID!}
                      scrollEnabled={true}
                      style={{ marginTop: Platform.OS === 'android' ? 60 : 0 }}
                      renderItem={({ item }) => (
                        <CartItem
                          item={item}
                        />
                      )}
                    />
                  </View>
                  <View style={[s`flex-1 grow-0`, { height: '30%' }]}>
                    <CheckOut handleCOD={handleCOD} handlePO={handlePO} handleWebView={handleWebView} />
                  </View>
                </View>
              </SafeAreaView>
            </>
          }
          <CashDeliveryModal modalVisible={cashModalVisible} onClose={handleClose} navigation={navigation} />

        </GestureHandlerRootView>
      </SafeAreaView>
    </>
  )
}

export default CartScreen

const styles = StyleSheet.create({

  lottieContainer: {

    zIndex: 0,
    width: '100%',
    flex: 1

  },
  lottie: {

    width: 300,
    height: 300,

  },

  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 999,
  },

})