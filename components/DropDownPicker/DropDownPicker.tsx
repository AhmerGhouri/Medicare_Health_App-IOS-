import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { useResponsiveDimensions } from '../../app/hooks/useDimension';
import Icon from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Animated, { ZoomIn, ZoomInUp } from 'react-native-reanimated';
import { useAppDispatch } from '../../app/hooks/hooks';
import { addTimeSlot } from '../../app/slices/serviceSlice';


export interface dataProp {
  area_desc: null | string | any,
  area_id: null | string | any;
  service_id: string | null | any;
  sloT_DESC: string | null | any;
  sloT_ID: string | null | any;
}

interface data {
  placeholder: string;
  data: dataProp[];
}

export const DropDownPicker: React.FC<data> = props => {
  
  const { placeholder, data } = props;
  const { wp, hp } = useResponsiveDimensions();
  const [isClicked, setIsClicked] = useState<boolean>();
  const dispatch = useAppDispatch()
  const [selectedLanguage, setSelectedLanguage] = useState<string>(placeholder);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const EmptyMessage = (): JSX.Element => {
    return (
  
      <View style={styles.emptyMessageContainer}>
        <Text allowFontScaling={false} style={styles.emptyMessageText}>No Time Slot Available</Text>
      </View>

  )
  }

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        backgroundColor: 'white',
        borderRadius: 10,
        height: hp(50),
        flexDirection: 'row',
        width: hp(330),
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
        shadowRadius: 5,
        shadowOffset: { width: 6, height: 12 },
        zIndex: 1
      },
      mainContainer: {
        zIndex: 1,
        elevation: 15,
        shadowRadius: 5,
        shadowOffset: {
          width: 6,
          height: 12
        }
      },
      dropDownWrapper: {
        position: 'absolute',
        top: hp(50),
        left: 0,
        right: 0,
        zIndex: 5,
      },
      dropDownContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'column',
        elevation: 3,
        height: hp(170),
        // paddingHorizontal: 12,
        marginTop: hp(8),
        // marginHorizontal: hp(4),
        zIndex: 3
      },
      dropDownList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'

      },
      dropDownListName: {
        color: 'black',
        margin: 8,
        paddingTop: 5,
        marginVertical: 12,
        fontSize: 14,
      },
      dropDownInput: {
        fontFamily: 'Poppins',
        color: 'black',
        fontSize: 14,
        zIndex: 1,
      },
      checkIcon: {
        paddingRight: 10,
      },
      emptyMessageText : {
        color: 'black',
        fontSize: 12,
      },
      emptyMessageContainer : {
        alignItems : 'center',
        justifyContent : 'center',
        height : hp(170),
        }
    });
  }, [wp, hp]);

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={handleClick}
        style={styles.container}>
        <TextInput
          allowFontScaling={false}
          style={styles.dropDownInput}
          placeholder={placeholder}
          value={selectedLanguage}
          editable={false}
        />
        <Icon
          name={isClicked ? 'up' : 'down'}
          size={20}
          color={'black'}
        />
      </TouchableOpacity>
      {isClicked && (
        <View style={styles.dropDownWrapper}>
          <Animated.View entering={ZoomIn.duration(300)}>
            <View style={styles.dropDownContainer}>
              <FlatList
                data={data}
                keyExtractor={item => item.sloT_ID}
                ListEmptyComponent={EmptyMessage}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.95}
                    style={[item.sloT_DESC === selectedLanguage ? { backgroundColor: 'rgb(147 197 253)' } : null, styles.dropDownList]}
                    onPress={() => {
                      setSelectedLanguage(item.sloT_DESC);
                      dispatch(addTimeSlot(item.sloT_DESC))
                      setIsClicked(false);
                    }}>
                    <Text allowFontScaling={false} style={styles.dropDownListName}>{item.sloT_DESC}</Text>
                    {
                      item.sloT_DESC === selectedLanguage && (
                        <Feather style={styles.checkIcon} name='check-circle' size={hp(18)} color={'red'} />
                      )
                    }
                  </TouchableOpacity>
                )}
              />
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
};
