import { timeSlotData } from '../DummyData/LabTests';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, AppState } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, TouchableOpacity } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { s } from 'react-native-wind'
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Entypo';
import FontIcon from 'react-native-vector-icons/FontAwesome6';
import axios from 'axios';
import { testData, LabTestData } from '../constants';
import LottieView from 'lottie-react-native';
import Search from '../components/searchBox/Search';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useAppSelector } from '../app/hooks/hooks';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
import SelectedTestsModals from '../components/Modals/SelectedTestsModals';
import ServicesDetail from '../components/services/ServicesDetail';
import BottomSheetComponent from '../components/BottomSheet/BottomSheet';
import { DropDownPicker, dataProp } from '../components/DropDownPicker/DropDownPicker';
import { AreaDropDownPicker } from '../components/DropDownPicker/AreaDropDown';
import { Input } from '../components/Input/Input';




type LabScreenProps = NativeStackScreenProps<RootStackParamList, 'LabTestRequest'>


function LabScreen({ navigation, route }: LabScreenProps) {


  const code = useAppSelector(state => state.code.serviceDetail.shortCode);
  const serviceID = useAppSelector(state => state.code.serviceDetail.serviceID)
  const API = `https://local.jmc.edu.pk:82/api/WebReqServices/GetSelectServiceData?Class=${code}&Panel=PVT`
  const TIMESLOTAPI = `https://local.jmc.edu.pk:82/api/ServiceLocation/GetAllServiceSlot?ServiceID=${serviceID}`
  const AREAAPI = `https://local.jmc.edu.pk:82/api/ServiceLocation/GetAllocation?ServiceID=${serviceID}`


  // All State Which Manages
  const checkedData = route.params
  const [date, setDate] = useState(new Date());
  const [testsData, setTestData] = useState<LabTestData[]>([])
  const [filterData, setFilterData] = useState<LabTestData[]>([]);
  const [open, setOpen] = useState(false);
  const [testID, setTestId] = useState<testData>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<boolean>(false)
  let formattedDate = date.getDate() + '-' + date.toLocaleString("en-US", { month: 'short' }) + '-' + date.getFullYear();
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  // variables
  const snapPoints = useMemo(() => ['1%', '50%'], []);
  const { cartItem } = useAppSelector(state => state.cart);
  const { errorMessage } = useAppSelector((state => state.cart))
  const timeSlot = useAppSelector(state => state.code.timeSlot)
  const serviceArea = useAppSelector(state => state.code.serviceArea)
  const [timeSlotData, setTimeSlotData] = useState<dataProp[]>([])
  const [serviceAreaData, setServiceAreaData] = useState<dataProp[]>([])
  const [address , setAddress] = useState<string>()
  console.log("Time SLOT " , timeSlot);
  console.log("Service Area " , serviceArea);
  

  const getTimeSlot = async () => {
    try {
      const res = await axios.get(TIMESLOTAPI);
      console.log("data", res.data);
      setTimeSlotData(res.data)
    } catch (err) {
      console.log("error", err);
    }
  }

  const getServiceArea = async () => {
    try {
      const res = await axios.get(AREAAPI);
      console.log("data", res.data);
      setServiceAreaData(res.data)
    } catch (err) {
      console.log("error", err);
    }
  }

  const opatValues = {
    opaT_ID: checkedData.opaT_ID!.toString(),
    currentaddress: address,
    samplE_COL_DATE: formattedDate,
    samplE_COL_TIME: timeSlot,
    areaID : serviceArea

  };

  // Fetch Data from API
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await axios.get(API)
      const data = result.data
      setTestData(data)
      setFilterData(data)
      return result

    } catch (error) {

      switch (error.response.status) {
        case 400:
          // handle 400 Bad Request case
          Alert.alert('Bad Request', 'Something went wrong with the request.');
          break;
        case 401:
          // handle 401 Unauthorized case
          Alert.alert('Unauthorized', 'Access is denied due to invalid credentials.');
          break;
        case 404:
          // handle 404 Not Found case
          Alert.alert('Not Found', 'The requested resource could not be found.');
          break;
        case 500:
          // handle 500 Internal Server Error case
          Alert.alert('Internal Server Error', 'Something went wrong on the server.');
          break;
        default:
          // handle any other error cases
          Alert.alert('Error', 'Something went wrong.');
          break;
      }

    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    getTimeSlot()
    getTimeSlot()
    getServiceArea()
  }, [])

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // BackDrop
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop style={{zIndex : 9999}} {...props} disappearsOnIndex={0} appearsOnIndex={2} />
    , []
  )

  const handleFilter = useCallback(
    (searchText: string) => {

      const filteredData = testsData!.filter(({ ltesT_DESC }) =>

        ltesT_DESC!.toUpperCase().includes(searchText.toUpperCase())

      );

      setFilterData(filteredData);

    }, [testsData, setFilterData])

  const OpenCloseDatePicker = () => {

    setOpen(!open)

  }

  const toggleModal = async () => {
    if (timeSlot === '' || serviceArea === '') {
      setErrorMsg(true);
    } else {
      try {

        setIsLoading(true)
        navigation.navigate('CartScreen');
        setIsLoading(false);

      } catch (error) {
        // Handle error if needed
        Alert.alert('Error', 'Error navigating to CartScreen:', error);
      }
    }
  };

  const handleSetTestID = useCallback((id: testData) => {
   
    setTestId(id);
    bottomSheetRef.current?.expand();

  }, [bottomSheetRef]);

  const handleAddress = useCallback((text) => {

    setAddress(text)

  } , [address])

  return (

    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {isLoading && (
          <View style={styles.overlay}>
            <LottieView
              style={[styles.lottie]}
              source={require('../src/animations/logoanimate.json')}
              autoPlay
              loop
            />
          </View>
        )}
        <View style={s`flex-1 p-8`}>
          <View style={s`m-3`}>
            <View style={[s`flex z-0 flex-row rounded-md justify-between border-2  border-blue-300 p-1 items-center`, styles.InputView]}>
              <View style={[s`flex-row justify-around items-center `, { width: '25%' }]}>
                <FontIcon name='calendar-day' color={'grey'} />
                <Text allowFontScaling={false} style={{ fontFamily: 'Quicksand-Regular', color: 'gray' }}>Date :</Text>
              </View>
              <TouchableOpacity style={[s`flex-row`, { width: '75%' }]} onPress={OpenCloseDatePicker}>
                <View style={[s`justify-center items-center`, { width: '80%' }]}>
                  <Text allowFontScaling={false} style={{ padding: 5, color: 'black' }}>{formattedDate}</Text>
                </View>
                <View style={[s` justify-center items-center`, { width: '30%' }]}>
                  <FontIcon name='calendar' color={'grey'} />
                  <DatePicker
                    open={open}
                    modal
                    minimumDate={new Date()}
                    title={'Select a Collection/Service date'}
                    textColor='white'
                    androidVariant='nativeAndroid'
                    date={date} mode='date'
                    theme='dark'
                    testID='dob'
                    style={{ backgroundColor: '#fb4d4d' }}
                    onDateChange={setDate}
                    onConfirm={(date) => {
                      OpenCloseDatePicker
                      setDate(date)
                    }}
                    onCancel={OpenCloseDatePicker}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[s`m-2 items-center `, {zIndex : 0}]}>
            <DropDownPicker data={timeSlotData} placeholder='Select Your Time Slot' />
          </View>
          {errorMsg ? <View style={s`items-center justify-center`}><Text allowFontScaling={false} style={s`text-red-400 text-xs`}>{timeSlot === '' ?  'Please select a Preferred time slot' : null}</Text></View> : null}
          <View style={[s`m-2 items-center` , {zIndex : -1}]}>
            <AreaDropDownPicker data={serviceAreaData} placeholder='Select Your Area' />
          </View>
          {errorMsg ? <View style={s`items-center justify-center`}><Text allowFontScaling={false} style={s`text-red-400 text-xs`}>{serviceArea === '' ?  'Please select a Service area' : null}</Text></View> : null}
          <View style={[s`m-2 items-center`, {zIndex : -2}]}>
            <Input placeholder='Enter Your Address' onChange={handleAddress}/>
          </View>
          {errorMsg ? <View style={s`items-center justify-center`}><Text allowFontScaling={false} style={s`text-red-400 text-xs`}>{serviceArea === '' ?  'Please select a Service area' : null}</Text></View> : null}
          <View style={[s`m-2` , {zIndex : -3}]}>
            <Search onChange={handleFilter} />
            <ServicesDetail data={filterData} opatValues={opatValues} onSetTestID={handleSetTestID} />
          </View>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          handleIndicatorStyle={{ backgroundColor: 'white' }}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          style={{zIndex : 9999}}
          backdropComponent={renderBackdrop}
          detached={true}
          backgroundStyle={{
            backgroundColor: '#fb4d4d'
          }}
        >
          <BottomSheetComponent testID={testID} />
        </BottomSheet>
        <Animated.View style={s`flex`} entering={ZoomIn.duration(1000)} exiting={FadeOut} >
          <View style={[s`justify-center items-center absolute bottom-0 -z-1 -left-0`, { width: '100%' }]}>
            {cartItem.length !== 0 ?
              <TouchableOpacity
                onPress={toggleModal}
                style={[s`bg-red-500 items-center justify-center m-4 p-4`, { borderRadius: 100 }]}>
                <Icon name='forward' color={'white'} size={25} />
                <Text allowFontScaling={false} style={s`text-white italic font-bold`}>Cart</Text>
              </TouchableOpacity>
              : null
            }
          </View>
        </Animated.View>
        <SelectedTestsModals visible={errorMessage} navigation={navigation} />
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 999,
  },
  contentContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  InputBox: {
    gap: 16,
  },
  lottie: {
    width: 200,
    height: 200,
    zIndex: 0,
  },
  InputView: {
    shadowColor: 'black',
    backgroundColor: 'white',
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.2,
    elevation: 15,
    padding: 10,
    width: "100%"
  },
  input: {
    borderWidth: 0,
    width: '100%',
    textAlign: 'center'
  },
  List: {
    width: '100%',
    shadowColor: 'black',
    shadowOffset: {
      width: 4,
      height: 8
    },
    shadowOpacity: 1,
    elevation: 50
  },
  Footer: {
    alignItems: 'flex-end',
  },
  dropDowncontainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 40,
  },
  dropdown: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'lightblue',
    marginTop: 10,
    width: '96%',
    padding: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 15,
  },
  icon: {
    marginRight: 5,
    width: 18,
    height: 18,
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default LabScreen;