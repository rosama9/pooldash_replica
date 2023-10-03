import { FieldConfig } from 'formik';
import React from 'react';
import { KeyboardTypeOptions, NativeSyntheticEvent, ReturnKeyTypeOptions, TextInput } from 'react-native';
import BorderInputWithLabel from '~/components/inputs/BorderInputWithLabel';
import { Util } from '~/services/Util';

type AuthInputProps = FieldConfig & {
    label: string;
    placeholder?: string;
    onChangeText: (newText: string) => void;
    onBlur: (e: NativeSyntheticEvent<any>) => void;
    value: string;
    // This is really stupid syntax sugar
    errorText?: string | false;
    secure?: boolean;
    nextRef?: React.RefObject<TextInput>;
    returnKeyType?: ReturnKeyTypeOptions;
    onSubmit?: () => void;
    keyboardType?: KeyboardTypeOptions;
}

export const AuthTextField = React.forwardRef<TextInput, AuthInputProps>((props, ref) => {
    // We need a unique id on the first render cycle, this is a hacky way to do it.
    const [keyboardAccessoryViewId] = React.useState(Util.generateUUID());

    const handleSubmit = () => {
        if (props.nextRef) {
            props.nextRef.current?.focus();
        }
        props.onSubmit && props.onSubmit();
    };

    return <>
        <BorderInputWithLabel
            label={ props.label }
            placeholder={ props.placeholder }
            onChangeText={ props.onChangeText }
            autoCapitalize="none"
            onBlur={ props.onBlur }
            value={ props.value }
            returnKeyType={ props.returnKeyType ?? 'done' }
            enablesReturnKeyAutomatically
            inputAccessoryViewID={ keyboardAccessoryViewId }
            errorText={ props.errorText ? props.errorText : undefined }
            secureTextEntry={ props.secure }
            ref={ ref }
            onSubmitEditing={ handleSubmit }
            keyboardType={ props.keyboardType }
            autoCorrect={ false }
        />
    </>;
});
