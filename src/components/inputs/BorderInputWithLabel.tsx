import React from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle, ViewStyle } from 'react-native';

import { PDText } from '../PDText';
import { PDColor, PDSpacing, useTheme } from '../PDTheme';
import { PDView } from '../PDView';
import { textStyles } from '~/components/PDText';

interface BorderInputWithLabel extends TextInputProps {
    label: string;
    labelStyleProps?: TextStyle | TextStyle[];
    textInputStyleProps?: TextStyle | TextStyle[];
    containerStyles?: ViewStyle;
    color?: PDColor
    errorText?: string;
}

const BorderInputWithLabel = React.forwardRef<TextInput, BorderInputWithLabel>((props, ref) => {
    const { label, labelStyleProps, style, textInputStyleProps, color = 'black', ...restTextInputProps } = props;
    const theme = useTheme();

    const inputStyle = [
        textStyles.bodySemiBold,
        styles.textInput,
        {
            borderColor: theme.colors.border,
            color: theme.colors[color],
            backgroundColor: theme.colors.white,
        },
        textInputStyleProps,
        style,
    ];

    return (
        <PDView style={ props.containerStyles }>
            <PDText
                type="bodyGreyBold"
                color="greyDark"
                style={ labelStyleProps }
            >
                { label }
            </PDText>
            {props.errorText && <PDText
                type="bodySemiBold"
                color="red"
            >
                { props.errorText }
            </PDText>}
            <TextInput
                ref={ ref }
                style={ inputStyle }
                placeholderTextColor={ theme.colors.grey }
                blurOnSubmit
                allowFontScaling
                maxFontSizeMultiplier={ 1.4 }
                { ...restTextInputProps }
            />
        </PDView>
    );
});

BorderInputWithLabel.defaultProps = {
    color: 'black',
};

const styles = StyleSheet.create({
    textInput: {
        marginTop: 4.5,     // PDSpacing.xs - ((lineHeight - fontSize) / 2.0)
        marginBottom: PDSpacing.md,
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 8,
        paddingLeft: 8,
        minWidth: 100,
    },
});

export default BorderInputWithLabel;
