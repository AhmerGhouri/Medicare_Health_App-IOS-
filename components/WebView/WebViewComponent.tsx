import { Modal, NativeSyntheticEvent, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { s } from 'react-native-wind'
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import WebView from 'react-native-webview';



const WebViewComponent = ({ route }: any) => {

  
  return (
    <GestureHandlerRootView style={{flex : 1}}>
          <TouchableOpacity><Text>back</Text></TouchableOpacity>
          <WebView
            source={{ uri: `www.google.com` }}
            style={{ marginTop: 50 }}
            onLoadStart={() => <View style={s`flex-1 justify-center items-center`}> <Text style={s`text-black`}>Loading ...</Text> </View>}
            onLoadProgress={() => <View><Text>ABC</Text></View>}

          />
      
    </GestureHandlerRootView>
  )
}

export default WebViewComponent

const styles = StyleSheet.create({})