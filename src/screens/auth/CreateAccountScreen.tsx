import * as React from 'react';
import * as Yup from 'yup';
import { StyleSheet, TextInput } from 'react-native';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { Formik } from 'formik';
import { useMutation } from '@apollo/react-hooks';
import { REGISTER, USERNAME_CHECK } from '~/services/gql/AuthAPI';
import { checkUsername, checkUsernameVariables } from '~/services/gql/generated/checkUsername';
import { Register, RegisterVariables } from '~/services/gql/generated/Register';
import { AuthTextField } from './AuthTextField';
import { ButtonWithChildren } from '~/components/buttons/ButtonWithChildren';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ErrorParser } from './ErrorParser';
import { LinkText } from '~/components/misc/LinkText';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useNavigation } from '@react-navigation/native';
import { useAuthHandler } from './useAuthHandler';

interface Values {
    email: string;
    username: string;
    password: string;
    password2: string;
}

const initialValues: Values = {
    email: '',
    username: '',
    password: '',
    password2: '',
};


export const CreateAccountScreen: React.FC = () => {

    const theme = useTheme();
    const [checkUsernameMutation] = useMutation<checkUsername, checkUsernameVariables>(USERNAME_CHECK);
    const [register/*, registerState*/] = useMutation<Register, RegisterVariables>(REGISTER);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [hasSubmittedForm, setHasSubmittedForm] = React.useState(false);
    const { navigate } = useNavigation<PDStackNavigationProps>();
    const { handleAuthSuccess } = useAuthHandler();

    const emailRef = React.useRef<TextInput>(null);
    const usernameRef = React.useRef<TextInput>(null);
    const pwRef = React.useRef<TextInput>(null);
    const pw2Ref = React.useRef<TextInput>(null);

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(2, 'Username must be at least 2 characters')
            .matches(/^\w+$/, { message: 'Username can only contain letters, numbers, and underscore characters' })
            .test('checkUsernameUnique', 'Username is taken, try another', async username => {
                if (!username) { return true; }
                const result = await checkUsernameMutation({ variables: { username } });
                return result.data?.checkUsername?.available ?? false;
            })
            .required('Required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
        password: Yup.string()
            .min(4, 'Password must be at least 4 characters')
            .required('Required'),
        password2: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    const formikSubmit = async (values: Values) => {
        console.log('Submitting!');
        console.log(JSON.stringify(values));
        try {
            const res = await register({
                variables: {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                },
            });
            if (res?.data?.register?.id) {
                console.log('we did it!');
                handleAuthSuccess(res.data.register.id);
            } else {
                console.log('Nope! Show error or something');
                // TODO: handle errors here.
                // setErrorMessage(
                //     ErrorParser.getUserError(
                //         Util.firstOrNull(
                //             res?.errors
                //         )?.message ?? null
                //     )
                // );
            }
        } catch (e) {
            console.error(e);
            setErrorMessage(
                ErrorParser.getUserError(
                    JSON.stringify(e)
                )
            );
        }
    };

    return <PDSafeAreaView forceInset={ { bottom: 'never' } } bgColor="white">

        <ScreenHeader hasBackButton color="blue" textType="nav">Create Account</ScreenHeader>
        <KeyboardAwareScrollView style={ { ...styles.scrollView, backgroundColor: theme.colors.background } } extraScrollHeight={ 65 }>
            <PDText type="content" color="greyDark" textAlign="center" style={ styles.headerText }>
                Create an account to backup your pool data to pooldash.com
            </PDText>
            <Formik
                initialValues={ initialValues }
                validationSchema={ validationSchema }
                onSubmit={ formikSubmit }
                validateOnMount={ true }
            >
                {({ handleChange, handleBlur, handleSubmit, values, isValid, errors }) => {
                    console.log(JSON.stringify(errors));
                    console.log(`has submitted: ${hasSubmittedForm}`);
                    return <>
                        { errorMessage && <PDText type="content" color="red" textAlign="center" style={ styles.topError }>{errorMessage}</PDText>}
                        <AuthTextField
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            onBlur={ handleBlur('email') }
                            onChangeText={ handleChange('email') }
                            value={ values.email }
                            errorText={ hasSubmittedForm && errors.email }
                            ref={ emailRef }
                            nextRef={ usernameRef }
                            returnKeyType="next"
                            keyboardType="email-address" />
                        <AuthTextField
                            label="Username"
                            name="username"
                            type="text"
                            placeholder="Username"
                            onBlur={ handleBlur('username') }
                            onChangeText={ handleChange('username') }
                            value={ values.username }
                            errorText={ hasSubmittedForm && errors.username }
                            ref={ usernameRef }
                            nextRef={ pwRef }
                            returnKeyType="next"
                            keyboardType="default" />
                        <AuthTextField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            onBlur={ handleBlur('password') }
                            onChangeText={ handleChange('password') }
                            value={ values.password }
                            errorText={ hasSubmittedForm && errors.password }
                            secure
                            ref={ pwRef }
                            nextRef={ pw2Ref }
                            returnKeyType="next" />
                        <AuthTextField
                            label="Confirm Password"
                            name="password2"
                            type="password"
                            placeholder="Confirm Password"
                            onBlur={ handleBlur('password2') }
                            onChangeText={ handleChange('password2') }
                            value={ values.password2 }
                            errorText={ hasSubmittedForm && errors.password2 }
                            secure
                            ref={ pw2Ref }
                            returnKeyType="done"
                            onSubmit={ () => { setHasSubmittedForm(true); handleSubmit(); } }/>
                        <LinkText spans={ [
                            { text: 'By creating an account, you agree to our ' },
                            { text: 'Terms of Service', action: () => navigate('TermsOfService') },
                            { text: ' and ' },
                            { text: 'Privacy Policy.', action: () => navigate('PrivacyPolicy') },
                        ] }/>
                        <ButtonWithChildren
                            onPress={ () => { setHasSubmittedForm(true); handleSubmit(); } }
                            styles={ [
                                { backgroundColor: (isValid || !hasSubmittedForm) ? theme.colors.blue : theme.colors.greyLight },
                                styles.buttonContainer,
                            ] }>
                                <PDText type="subHeading" color="alwaysWhite">Create Account</PDText>
                        </ButtonWithChildren>
                    </>;
                }}
            </Formik>
            <LinkText spans={ [
                { text: 'Already have an account? ' },
                { text: 'Sign In.', action: () => navigate('Login') },
            ] }/>
        </KeyboardAwareScrollView>
    </PDSafeAreaView>;
};


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        padding: PDSpacing.lg,
    },
    headerText: {
        marginBottom: PDSpacing.md,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: PDSpacing.xl,
        marginBottom: PDSpacing.sm,
        paddingTop: 9,
        paddingBottom: 9,
        borderRadius: 27.5,
    },
    buttonIcon: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: PDSpacing.xs,
    },
    terms: {
        marginVertical: PDSpacing.md,
    },
    topError: {
        marginBottom: PDSpacing.sm,
    },
});
