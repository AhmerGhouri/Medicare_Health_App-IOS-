import { Modal, NativeSyntheticEvent, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import WebView from 'react-native-webview'
import { s } from 'react-native-wind'
import { useAppSelector } from '../app/hooks/hooks';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { removeAllFromCart } from '../app/slices/cartSlice';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo'
import { clearPatientToStore } from '../app/slices/patientSlice';
import LottieView from 'lottie-react-native';



const PaymentScreen = ({ route }: any) => {

  const obj = route.params;
  const navigation = useNavigation()

  const url = useAppSelector(state => state.url)
  console.log("url", url);

  const dispatch = useDispatch()
  const [webView, setWebView] = useState<boolean>(true)
  const [status, setStatus] = useState()
  const voucStatus = 'https://local.sohailuniversity.edu.pk:90/Handlers/VoucherAPIStatus.ashx'

  const checkVoucStatus = async () => {
    try {

      const status = await axios.post((voucStatus), {
        "Query": `select m.vc_mst_tran_id  as app_id,c.api_app_id,c.api_app_key,m.voucherid from aass.mmh_pre_labtest e inner join aass.stdc_jmdc_vc_mst_t m on m.vc_mst_rollno = e.trans_id and m.vc_mst_catg_id = 'Consultation Fee'  inner join aass.stdc_jmdc_vc_dtl_t d on d.voucherid = m.voucherid  left join aass.GL_COMBINE_COMPANY c on c.mastercode = 'MED' where  m.voucherid = ${obj} order by 1 desc`,
      })

      const data = status.data

      console.log("status", status.data.status_message)
      setStatus(data.status_message)
      if (status.data.status_message == 'SUCCESS') {
        setWebView(false)
        dispatch(removeAllFromCart())
        dispatch(clearPatientToStore())

      } else {

        setTimeout(() => {
          checkVoucStatus(); // Call the function again after a delay
        }, 5000);
      }
    } catch (err) {

      console.log("Error", err);


    }

  }
  useEffect(() => {
    checkVoucStatus()
  }, [])

  //   const [isMounted, setIsMounted] = useState(true);

  // useEffect(() => {
  //   const checkVoucStatus = async () => {

  //     const status = await axios.post((voucStatus), {
  //             "Query": `select m.vc_mst_tran_id  as app_id,c.api_app_id,c.api_app_key,m.voucherid from aass.mmh_pre_labtest e inner join aass.stdc_jmdc_vc_mst_t m on m.vc_mst_rollno = e.trans_id and m.vc_mst_catg_id = 'Consultation Fee'  inner join aass.stdc_jmdc_vc_dtl_t d on d.voucherid = m.voucherid  left join aass.GL_COMBINE_COMPANY c on c.mastercode = 'MED' where  m.voucherid = ${obj} order by 1 desc`,
  //           })
  //     // ...
  //     if (status.data.status_message == 'SUCCESS') {
  //       setWebView(false)
  //         dispatch(removeAllFromCart())
  //         dispatch(clearPatientToStore())
  //       // ...
  //     } else {
  //       if (isMounted) {
  //         setTimeout(() => {
  //           checkVoucStatus();
  //         }, 5000);
  //       }
  //     }
  //   };

  //   checkVoucStatus();

  //   return () => {
  //     setIsMounted(false);
  //   };
  // }, []);



  return (
    <>
      {webView ?
        // <WebViewComponent />
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
          <TouchableOpacity style={{ backgroundColor: 'white', padding: 20, paddingTop: Platform.OS === 'ios' ? 50 : 20 }} onPress={() => navigation.goBack()}>
            <Icon name='cross' size={20} color={'black'} />
          </TouchableOpacity>
          <WebView
            source={{ uri: `${url}` }}
            style={{ marginTop: 50 }}
          // onLoadStart={() => <View style={s`flex-1 justify-center items-center`}> <Text style={s`text-black`}>Loading ...</Text> </View>}
          // onLoadProgress={() => <View><Text>ABC</Text></View>}

          />
        </GestureHandlerRootView>
        :
        <GestureHandlerRootView style={s`flex-1 flex-row`}>
          <TouchableOpacity style={{ flexDirection: 'row', width: '100%', padding: 20 }} onPress={() => navigation.navigate('MyTabs' as never)}>
            <Icon name='cross' size={20} color={'black'} />
          </TouchableOpacity>
          <View style={s` justify-center items-center`}>
            <View style={[s`flex shrink-0 w-full items-center`, styles.lottieContainer]}>
              <LottieView
                style={[styles.lottie]}
                source={require('../src/animations/Bill.json')}
                autoPlay

              />
            </View>
            <Text style={[s`text-black` , {fontFamily : 'Quicksand-Bold'}]}>Your Voucher has been submitted.</Text>
          </View>
        </GestureHandlerRootView>

      }

    </>
  )
}

export default PaymentScreen;

const styles = StyleSheet.create({
  lottieContainer: {
    zIndex: 0,
  },
  lottie: {
    width: 200,
    height: 200,
  }
})