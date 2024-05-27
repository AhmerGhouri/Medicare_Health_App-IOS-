import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Alert,
  LogBox,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { s } from 'react-native-wind';
import { servicesData } from '../../constants'
import axios from 'axios';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useAppDispatch } from '../../app/hooks/hooks';
import { addSerShortCodeToStore } from '../../app/slices/serviceSlice';




export default function Services({ mob, bottomSheetRef, handleSetBottomSheetData }: any) {


  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useAppDispatch()
  const [services, setServices] = useState<servicesData[]>()

  // API
  const baseURL = 'https://local.jmc.edu.pk:82/api/OnlineServices'
  const OPAT_API_URL = `https://local.jmc.edu.pk:82/api/Patients/GetPatientDataFromMob?mob=${mob}`

  const fetchServices = useCallback(async (serviceBaseURL) => {

    axios({
      method: 'GET',
      baseURL: `${serviceBaseURL}`
    })
      .then((response) => {

        setServices(response.data)
        setLoading(false)
        console.log("ABC", response.data);


      })
      .catch((err) => {

        setError(err)
        // setLoading(false)
        console.log(err)

      })

  }, [])

  const opat_data = useCallback(async () => {

    try {

      const response = await axios.get(OPAT_API_URL)
      const result = response.data
      handleSetBottomSheetData(result)
      return result;

    } catch (err) {

      Alert.alert('Something went wrong!', err)

    }

  }, [])

  useEffect(() => {
    bottomSheetRef.current?.forceClose()
    LogBox.ignoreLogs(["`flexWrap: `wrap`` is not supported with the `VirtualizedList` components.Consider using `numColumns` with `FlatList` instead."])
  }, [])

  const handleServicePress = async (service) => {
    console.log("service" , service.servicE_ID);
    
    switch (service.servicE_DESC) {
      case 'Nursing Services':
        dispatch(addSerShortCodeToStore({shortCode : 'ER' , serviceID : service.servicE_ID}))
        break;
      case 'Lab Test Request':
        dispatch(addSerShortCodeToStore({shortCode : 'LB' , serviceID : service.servicE_ID}))
        break;
      case 'Radiology Request':
        dispatch(addSerShortCodeToStore({shortCode : 'XR' , serviceID : service.servicE_ID}))
        break;
      case 'Physiotherapy':
        dispatch(addSerShortCodeToStore({shortCode : 'PO' , serviceID : service.servicE_ID}))
        break;
      default:
        break;
    }
    const userOpatData = await opat_data()
    if (userOpatData && service.avaiL_MOBILEAPP === 'YES') {
      bottomSheetRef.current?.snapToIndex(2)
    } else if (!userOpatData && service.servicE_DESC === 'YES') {
      bottomSheetRef.current?.snapToIndex(2)
    }
    else {
      Alert.alert('Service', `Coming Soon: ${service.servicE_DESC}`)
    }
  }

  // Fetching Data From API
  useEffect(() => {
    setLoading(true)
    fetchServices(baseURL)
  }, [])

  if (isLoading) {
    // return <ActivityIndicator size={50} color={'red'} />
    return (
      <>
        <View style={s`flex-row flex-wrap justify-center`}>
          <View
            style={[
              s`shadow-2xl py-6 px-2 flex-column bg-white justify-center items-center rounded-3xl m-2`,
              styles.box,
            ]}>
            <SkeletonPlaceholder borderRadius={4}>
              <SkeletonPlaceholder.Item flexDirection="column" justifyContent='space-around'
                gap={20} alignItems="center">
                <SkeletonPlaceholder.Item width={'70%'} height={30} />
                <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
          <View
            style={[
              s`shadow-2xl py-6 px-2 flex-column bg-white justify-center items-center rounded-3xl m-2`,
              styles.box,
            ]}>
            <SkeletonPlaceholder borderRadius={4}>
              <SkeletonPlaceholder.Item flexDirection="column" justifyContent='space-around'
                gap={20} alignItems="center">
                <SkeletonPlaceholder.Item width={'70%'} height={30} />
                <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
          <View
            style={[
              s`shadow-2xl py-6 px-2 flex-column bg-white justify-center items-center rounded-3xl m-2`,
              styles.box,
            ]}>
            <SkeletonPlaceholder borderRadius={4}>
              <SkeletonPlaceholder.Item flexDirection="column" justifyContent='space-around'
                gap={20} alignItems="center">
                <SkeletonPlaceholder.Item width={'70%'} height={30} />
                <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
          <View
            style={[
              s`shadow-2xl py-6 px-2 flex-column bg-white justify-center items-center rounded-3xl m-2`,
              styles.box,
            ]}>
            <SkeletonPlaceholder borderRadius={4}>
              <SkeletonPlaceholder.Item flexDirection="column" justifyContent='space-around'
                gap={20} alignItems="center">
                <SkeletonPlaceholder.Item width={'70%'} height={30} />
                <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
          <View
            style={[
              s`shadow-2xl py-6 px-2 flex-column bg-white justify-center items-center rounded-3xl m-2`,
              styles.box,
            ]}>
            <SkeletonPlaceholder borderRadius={4}>
              <SkeletonPlaceholder.Item flexDirection="column" justifyContent='space-around'
                gap={20} alignItems="center">
                <SkeletonPlaceholder.Item width={'70%'} height={30} />
                <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
          <View
            style={[
              s`shadow-2xl py-6 px-2 flex-column bg-white justify-center items-center rounded-3xl m-2`,
              styles.box,
            ]}>
            <SkeletonPlaceholder borderRadius={4}>
              <SkeletonPlaceholder.Item flexDirection="column" justifyContent='space-around'
                gap={20} alignItems="center">
                <SkeletonPlaceholder.Item width={'70%'} height={30} />
                <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
        </View>
      </>
    )
  }

  // useEffect(() => {

  //   if (isLoading) {
  //     {
  //       services!.map((item) => {

  //         <View
  //           style={[
  //             s`shadow-2xl py-6 px-2 flex-column bg-white justify-center items-center rounded-3xl m-2`,
  //             styles.box,
  //           ]}>
  //           <SkeletonPlaceholder borderRadius={4}>
  //             <SkeletonPlaceholder.Item flexDirection="column" justifyContent='space-around'
  //               gap={20} alignItems="center">
  //               <SkeletonPlaceholder.Item width={'70%'} height={30} />
  //               <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
  //             </SkeletonPlaceholder.Item>
  //           </SkeletonPlaceholder>
  //         </View>

  //       })

  //     }
  //   }
  // } , [])

  return (

    <ScrollView scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 0, flexShrink: 1 }}>
      <SafeAreaView>
        <View>
          <View>
            <View style={s`flex-row z-1 w-full flex-wrap py-2 pb-20 justify-center items-center `}>
              <FlatList
                // numColumns={3}
                data={services}
                scrollEnabled={true}
                contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}
                keyExtractor={item => item.servicE_ID.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={s`justify-center items-center`}
                    // activeOpacity={0.8}
                    key={item.servicE_ID}
                    onPress={() => {
                      handleServicePress(item)
                      setShowModal(true);
                    }}>
                    <View style={[s`shadow-2xl py-6 px-2 flex-column bg-white justify-center items-center rounded-3xl m-2`,
                      styles.box]}>
                      <Icon name={item.icon} size={Dimensions.get('window').height <= 704 ? 22 : 30} color={'red'} />
                      <Text allowFontScaling={false} style={[s`pt-2 text-blue-800 text-center `, {fontSize: Dimensions.get('window').height <= 704 ? 10 : 14, fontFamily: 'Quicksand-Bold' }]}>
                        {item.servicE_DESC}
                      </Text>
                    </View>
                  </Pressable>
                )}
              />
              {error ? <Text allowFontScaling={false} style={styles.errorMsg}>{error}</Text> : null}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  contentContainer: {

    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  box: {
    elevation: 5,
    // borderWidth: 1,
    borderColor: 'red',
    shadowColor: '#000000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // width: Dimensions.get('window').height <= 804 ? 88 : 110,
    // height: Dimensions.get('window').height <= 804 ? 95 : 110
    width: Dimensions.get('window').height <= 640 ? 80 : 110 && Dimensions.get('window').height <= 804 ? 88 : 110,
    height: Dimensions.get('window').height <= 640 ? 80 : 110 && Dimensions.get('window').height <= 804 ? 95 : 110
    // width: Dimensions.get('window').height <= 592 ? '60%' : '70%',
    // height: Dimensions.get('window').height <= 592 ? '40%' : '60%'
  },
  // box: {
  //   elevation: 5,
  //   borderWidth: 1,
  //   borderColor: 'red',
  //   shadowColor: '#000000',
  //   shadowOffset: {
  //     width: 10,
  //     height: 10,
  //   },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 0,
  // },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: -50,
  },
  modalView: {
    // margin: 20,
    backgroundColor: '#ff8787',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    // marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  errorMsg: {
    color: 'red',
    marginTop: 10,
  },
});



