import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { useResponsiveDimensions } from '../../app/hooks/useDimension';
import { useAppDispatch } from '../../app/hooks/hooks';
import { searchProps } from '../../constants';


interface data {
    placeholder: string;
    onChange : (text : string) =>  void;
}

export const Input: React.FC<data> = props => {

    const { placeholder , onChange} = props;
    const { wp, hp } = useResponsiveDimensions();
    const [isClicked, setIsClicked] = useState<boolean>();
    const dispatch = useAppDispatch()

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

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
                marginTop: hp(8),
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
            emptyMessageText: {
                color: 'black',
                fontSize: 12,
            },
            emptyMessageContainer: {
                alignItems: 'center',
                justifyContent: 'center',
                height: hp(170),
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
                    editable={true}
                    onChangeText={(text) => onChange(text)}
                />
            </TouchableOpacity>
        </View>
    );
};
