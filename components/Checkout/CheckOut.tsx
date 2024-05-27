import { Alert, FlatList, ScrollView, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Pressable, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import { s } from 'react-native-wind'
import Modal from 'react-native-modal'
import Logo from '../../src/assets/Medicare_logo_screen.png'
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks'
import axios from 'axios'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LottieView from 'lottie-react-native'
import { setPaymentURL } from '../../app/slices/paymentURLSlice'





const CheckOut = ({ handleCOD, handleWebView , handlePO }) => {

    const BILL_POST_API = 'https://local.jmc.edu.pk:82/api/WebReqServices/PostSelectServiceDataInBill'
    const MAX_TRANS_API = 'https://local.jmc.edu.pk:82/api/LabTest/GetMaxTransId'
    const PAYMENT_POST_API = 'https://local.sohailuniversity.edu.pk:90/Handlers/PaymnetAPICall.ashx'
    const VOUCHER_API = 'https://local.jmc.edu.pk:82/api/PostDataInVoucherMasterDetail'
    // variables
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['100%'], []);
    const [totalAmount, setTotalAmount] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>()
    const [CoLoading, setCoLoading] = useState<boolean>(false)
    const [PoLoading, setPoLoading] = useState<boolean>(false)
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(true)
    const dispatch = useAppDispatch()
    const paymentURL = useAppSelector(state => state.url)
    const { cartItem } = useAppSelector(state => state.cart);
    const { ...user } = useAppSelector(state => state.user);


    const amount = cartItem.map((item) => {
        let billAmount = +item.amt!
        return billAmount
    })

    function addArrayValues(arr: number[]): number {
        let totalAmount = 0;
        for (const num of arr) {
            totalAmount += num;
        }
        return totalAmount;
    }

    async function GetMaxTransId() {

        try {

            const trans_response = await axios.get(MAX_TRANS_API)

            if (trans_response.status === 200) {

                const result = trans_response.data
                const transId = result[0].ltesT_ID
                const transIdToNum = +transId
                return transIdToNum

            } else {
                Alert.alert("Network Error", "Check Your Internet Connection")
            }

        } catch (error) {
            Alert.alert("Error", error)
        }
    }

    const billPosting = async (updatedObject) => {
        try {
            const response = await axios.post(BILL_POST_API, updatedObject)
            if (response.status === 200) {
                console.log("Bill Posted Successfully");
            } else {
                Alert.alert("Error", "Bill has not been generated, Something went wrong!")
            }
            return response
        } catch (error) {
            Alert.alert("Error", "Bill has not been generated, Something went wrong!")
        }
    }

    const Checkout = async () => {
        setIsLoading(true)
        setTimeout(async () => {
            setModalVisible(true)
            setIsLoading(false)
        }, 2000)
    };

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const closeInvoiceModal = () => {
        setModalVisible(!isModalVisible)
    }

    const handleSubmit = async (voucherID) => {

        try {
            const response = await axios.post((PAYMENT_POST_API), {
                "app_id": "0000",
                "Query": `select m.vc_mst_tran_id,w.entryid as app_id,w.patientlname as name,w.email,'0'||w.contactno as mobile,m.voucherid,d.VC_DTL_DTL_VOUCHER_AMT as adm_fees,TO_CHAR(SYSDATE,'YYYY-MON-DD') as coursevalid,c.api_app_id,c.api_app_key  from CONSL_APP_T_WEB w inner join stdc_jmdc_vc_mst_t m on m.vc_mst_rollno = w.entryid and m.vc_mst_catg_id = 'Consultation Fee'  inner join stdc_jmdc_vc_dtl_t d on d.voucherid = m.voucherid left join aass.GL_COMBINE_COMPANY c on c.mastercode = 'MED' where m.voucherid = ${voucherID} order by 1 desc `,
                "FeeTYPECode": "CONSULTATIONFEE",
                "FeeDesc": "CONSULTATIONFEE",
                "AfterPaymentURL": "http://localhost:53744/frmOnlinePaymentStatusMCGH.aspx",
                "Email": "YES",
                "SMS": "YES",
                "SMSReqType": "MyMedicareHealth",
                "SMSMask": "MEDICARE"
            })
            const Status = response.status
               if (Status === 200) {
                const data = await response.data
                dispatch(setPaymentURL(data.redirect_url))
            } else {
                Alert.alert("Connection Error", "Somthing went wrong, Check Your Internet Connection!")
            }

        } catch (error) {

            Alert.alert("Error", error)

        }

    }

    const handleInvoiceModal = async (value) => {

        const trans = await GetMaxTransId()
        const transID = trans! + 1
      
        return new Promise<void>(async (resolve) => {
            const response = await axios.post(VOUCHER_API, {
                p_ENTRYID: transID.toString(),
                p_ACCNO: "0010",
                p_FeeCAT: "Consultation Fee",
                p_YEAR: "2024",
                p_Fname: user.fname,
                p_ACCTITLE: "MedicareAcc",
                p_CNIC: "000000000",
                p_Pname: user.pname,
                p_PaymentLink: `${paymentURL}`,
                p_FeeTYPECode: "CONSL_FEE",
                p_TotalAmount: totalAmount?.toString(),
                v_VOUCHER_NO: "null"
   
            }).then((res) => {
   
                const response = res.data
   
                return response
   
            }).catch((error) => {
   
                Alert.alert("Error", error);
   
            })
            
            const updatedObject = [...cartItem].map((item) => {
                // Create a new object with updated `tranS_ID`
                return {
                    ...item,
                    tranS_ID: transID.toString(),
                    paymenT_TYPE : value
                };
            });

            console.log("updated Object" , updatedObject)

            if (value == 'C') {
               
                const billing = await billPosting(updatedObject)
               
                if (billing?.status === 200) {
      
                    handleCOD(true)
                    setModalVisible(false)
      
                } else {
                    
                    Alert.alert('Error', 'Something went wrong while processing your order')
                }
            } else {

                const billing = await billPosting(updatedObject)
                
                if (billing?.status === 200) {
                
                    handleSubmit(response)
                    handlePO(true)

                    setTimeout(() => {
                
                        handleWebView(response)
                
                    }, 2000)
                
                    setModalVisible(false)
     
                } else {
                    
                    Alert.alert('Error', 'Something went wrong while processing your order')
                }
            }
            resolve()
        })
    }

    useEffect(() => {
        bottomSheetRef.current?.expand()
    }, [])

    useEffect(() => {

        const totalAmount = addArrayValues(amount)
        setTotalAmount(totalAmount);
        setTimeout(() => {

            setLoader(false)

        }, 5000)

    }, [amount])


    return (
        <>
            <BottomSheet
                ref={bottomSheetRef}
                detached={true}
                animateOnMount={true}
                bottomInset={2}
                handleStyle={{ display: 'none' }}
                style={[s`z-999 flex-1 grow-0`]}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose={false}
                backgroundStyle={{
                    backgroundColor: 'white',
                    marginHorizontal: 16,
                    marginVertical: 12,
                    shadowRadius: 85,
                    borderRadius: 10,
                    shadowOffset: {
                        width: 4, height: 6
                    },
                    elevation: 8,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <View style={s`m-8 justify-center `}>
                    <View style={[s`flex-row justify-between items-center gap-x-3`,
                    { marginVertical: Dimensions.get('window').height < 704 ? 2 : 12 }]}>
                        {loader ? (
                            <SkeletonPlaceholder borderRadius={4}>
                                <SkeletonPlaceholder.Item flexDirection="row" justifyContent='space-around'
                                    gap={50} alignItems="center">
                                    <SkeletonPlaceholder.Item width={Dimensions.get('window').width < 390 ? '50%' : '70%'} height={Dimensions.get('window').width < 390 ? 20 : 30} />
                                    <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder>
                        ) : <>
                            <Text allowFontScaling={false} style={[s`text-black `,
                            { fontSize: Dimensions.get('window').width < 390 ? 14 : 18, fontFamily: 'Quicksand-Bold' }]}>
                                Total Amount
                            </Text>
                            <Text allowFontScaling={false} style={[s` text-red-600 `,
                            { fontSize: Dimensions.get('window').width < 390 ? 14 : 18, fontFamily: 'Quicksand-Bold' }]}>
                                Rs. {totalAmount?.toFixed(2)}
                            </Text>
                        </>
                        }
                    </View>
                </View>

                <View style={[s`flex absolute bottom-6 left-16 border-black-500 `, { width: '70%' }]}>
                    <TouchableOpacity onPress={Checkout} style={[s`items-center rounded-full bg-blue-600`,
                    { padding: Dimensions.get('window').height < 704 ? 10 : 16 }]}>
                        <View>
                            {isLoading ?
                                (
                                    <ActivityIndicator style={s`p-0`} size="small" color="#fff" />
                                )
                                :
                                <Text allowFontScaling={false} style={[s`text-white italic font-semibold`,
                                { fontSize: Dimensions.get('window').height < 704 ? 12 : 15 }]}>
                                    Checkout
                                </Text>
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </BottomSheet>


            {/* Invoice MODAL */}
            <Modal
                isVisible={isModalVisible}
                animationInTiming={300}
                animationIn={'zoomIn'}
                animationOut={'zoomOut'}
                coverScreen={true}

            >


                <View
                    style={{ height: '100%', backgroundColor: 'white', borderTopWidth: 8, borderTopColor: 'blue' }}
                >

                    <View style={[s`flex shrink-0 w-full items-center`, styles.lottieContainer]}>

                        <LottieView
                            style={[styles.lottie]}
                            source={require('../../src/animations/Bill.json')}
                            autoPlay

                        />

                    </View>

                    <View style={[s`flex-row justify-between items-center px-8 -pt-12 `, { paddingBottom: Dimensions.get('window').height < 704 ? 30 : 45 }]}>

                        <View style={s`items-center`}><Text style={[s`text-lg text-blue-800`, { fontFamily: 'Montserrat-Bold' }]}>Invoice</Text></View>
                        <View>
                            <Image source={Logo} style={{ width: 100, height: 50 }} width={100} height={100} />
                        </View>

                    </View>

                    <View style={s`px-8 pt-0 pb-4`}>

                        <View style={[s`flex-row py-1 justify-between`, { width: "100%" }]}>
                            <Text allowFontScaling={false} style={[s`text-black `, { fontFamily: 'Quicksand-Bold' }]}>Name    : </Text>
                            <Text allowFontScaling={false} style={[s`text-black`, { fontFamily: 'Montserrat-Medium' }]}>{user.pname}</Text>
                        </View>
                        <View style={[s`flex-row py-1 justify-between`, { width: "100%" }]}>
                            <Text allowFontScaling={false} style={[s`text-black`, { fontFamily: 'Quicksand-Bold' }]}>Phone #: </Text>
                            <Text allowFontScaling={false} style={[s`text-black`, { fontFamily: 'Montserrat-Medium' }]}>{user.mob}</Text>
                        </View>
                        <View style={[s`flex-row py-1 justify-between`, { width: "100%" }]}>
                            <Text allowFontScaling={false} style={[s`text-black`, { fontFamily: 'Quicksand-Bold' }]}>Email     : </Text>
                            <Text allowFontScaling={false} style={[s`text-black`, { fontFamily: 'Montserrat-Medium' }]}>{user.email}</Text>
                        </View>

                    </View>

                    <View style={s`flex-row justify-between px-6 py-2 bg-blue-700`}>

                        <View>
                            <Text allowFontScaling={false} style={[s`text-white`, { fontFamily: 'Montserrat-Bold' }]}>Opat ID</Text>
                        </View>
                        <Text allowFontScaling={false} style={[s`text-white`, { fontFamily: 'Montserrat-Bold' }]}>Service</Text>
                        <Text allowFontScaling={false} style={[s`text-white`, { fontFamily: 'Montserrat-Bold' }]}>Price</Text>

                    </View>

                    <FlatList
                        numColumns={1}
                        data={cartItem}
                        scrollEnabled={true}
                        removeClippedSubviews={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item.ltesT_ID!}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={{ borderWidth: 1, borderColor: 'lightgray' }}></View>
                            )
                        }}
                        renderItem={({ item }) => (

                            <ScrollView scrollEnabled={true} >

                                <View style={s`flex-row justify-between px-4 py-6`}>

                                    <Text allowFontScaling={false} style={[s`text-black pl-4`, { fontFamily: 'Montserrat-Medium', fontSize: 12 }]}>{item.opaT_ID}</Text>
                                    <Text allowFontScaling={false} style={[s`text-blue-900 pl-4`, { fontFamily: 'Montserrat-Bold', fontSize: 12 }]}>{item.ltesT_DESC?.slice(0, 24)}{item.ltesT_DESC?.length && item.ltesT_DESC?.length > 24 ? <Text>...</Text> : null}</Text>
                                    <Text allowFontScaling={false} style={[s`text-red-900 pl-4`, { fontFamily: 'Montserrat-Bold', fontSize: 12 }]}>{item.amt}</Text>

                                </View>

                            </ScrollView>
                        )}
                    />

                    <View style={s`flex-row justify-between px-6 py-2 bg-blue-700`}>

                        <Text allowFontScaling={false} style={[s`text-white`, { fontFamily: 'Montserrat-Bold' }]}>Total Amount</Text>
                        <Text allowFontScaling={false} style={[s`text-white`, { fontFamily: 'Montserrat-Bold' }]}>Rs. {totalAmount}</Text>

                    </View>
                    <View style={s`flex-row p-4 w-full justify-between`}>


                        <Pressable onPress={closeInvoiceModal} style={[s`rounded p-2  `, { paddingHorizontal: 12, backgroundColor: 'red', elevation: 10 }]}>
                            <Text allowFontScaling={false} style={[s`font-bold italic`, { color: 'white', fontSize: Dimensions.get('window').width < 390 ? 12 : 16 }]}>
                                Close
                            </Text>
                        </Pressable>

                        {CoLoading ?

                            <>
                                <View style={{ alignItems: "center", justifyContent: 'center' }}>
                                    <ActivityIndicator style={s`p-0 items-center justify-center`} size="small" color="black" />
                                </View>
                            </>
                            :

                            <TouchableOpacity style={[s`rounded p-2  `, { paddingHorizontal: Dimensions.get('window').width < 390 ? 12 : 15, backgroundColor: '#313594', elevation: 10 }]}
                                onPress={() => {
                                    setCoLoading(true)
                                    handleInvoiceModal('C').finally(() => setCoLoading(false))
                                }}
                            >
                                <Text allowFontScaling={false} style={[s`font-bold italic`, { color: 'white', fontSize: Dimensions.get('window').width < 390 ? 12 : 16 }]}>
                                    Cash On Collection
                                </Text>
                            </TouchableOpacity>

                        }

                        {PoLoading ?

                            <>
                                <View style={{ alignItems: "center", justifyContent: 'center', paddingHorizontal: 15 }}>
                                    <ActivityIndicator style={s`p-0 items-center justify-center`} size="small" color="black" />
                                </View>
                            </>

                            :

                            <Pressable style={[s`rounded p-2  `, { paddingHorizontal: Dimensions.get('window').width < 390 ? 12 : 15, backgroundColor: '#313594', elevation: 10 }]}
                                onPress={() => {
                                    setPoLoading(true)
                                    handleInvoiceModal('O').finally(() => setPoLoading(false))
                                }}
                            >
                                <Text allowFontScaling={false} style={[s`font-bold italic`, { color: 'white', fontSize: Dimensions.get('window').width < 390 ? 12 : 16 }]}>
                                    Pay Online
                                </Text>
                            </Pressable>
                        }
                    </View>

                </View>

            </Modal>

        </>
    )
}

export default CheckOut

const styles = StyleSheet.create({

    lottieContainer: {
        zIndex: 0,
    },
    lottie: {
        width: Dimensions.get('window').height < 704 ? 150 : 200,
        height: Dimensions.get('window').height < 704 ? 100 : 150,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 999,
    },

})
