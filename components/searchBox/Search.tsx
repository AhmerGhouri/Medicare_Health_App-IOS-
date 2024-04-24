import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { s } from 'react-native-wind'
import Feather from 'react-native-vector-icons/Feather';
import { searchProps } from '../../constants';




const Search = ( { onChange } : searchProps) => {


    return (

        <View style={s`m-2`}>


            {/* <Text style={s`text-black font-bold pb-2 text-center text-md`}>Lab Tests</Text> */}


            <View style={[s`flex z-0 flex-row rounded-md border-2 w-full border-blue-300 p-1 items-center`, styles.InputView]}>


                <View style={[s`flex-row justify-around items-center`, { width: '30%' }]}>

                    <Feather name='search' color={'grey'} />
                    <Text style={{fontFamily : 'Quicksand-Regular', color : 'gray'}}>Search :</Text>
                </View>
                <TouchableOpacity style={[s`flex-row items-center`, { width: '80%' }]}>
                    <TextInput
                        style={[{ width: '100%', padding: 5, color: 'black' }]}
                        placeholder=''
                        placeholderTextColor={'black'}
                        onChangeText={(text) => onChange(text)}
                    />
                </TouchableOpacity>

            </View>

        </View>

    )
}

export default memo(Search)

const styles = StyleSheet.create({

    InputView: {

        shadowColor: 'black',
        backgroundColor: 'white',
        shadowRadius: 10,
        shadowOffset: {
          width: 5,
          height: 5,
        },
        shadowOpacity: 0.2,
        elevation: 15,
        padding : 10,
        width: "100%"
    
      },

})