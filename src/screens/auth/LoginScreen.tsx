import * as React from 'react';
import * as Yup from 'yup';
import { StyleSheet, TextInput } from 'react-native';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { Formik } from 'formik';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from '~/services/gql/AuthAPI';
import { Login, LoginVariables } from '~/services/gql/generated/Login';
import { AuthTextField } from './AuthTextField';
import { ButtonWithChildren } from '~/components/buttons/ButtonWithChildren';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ErrorParser } from './ErrorParser';
import { LinkText } from '~/components/misc/LinkText';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useNavigation } from '@react-navigation/native';
import { useAuthHandler } from './useAuthHandler';

interface Values {
    usernameOrEmail: string;
    password: string;
}

const initialValues: Values = {
    usernameOrEmail: '',
    password: '',
};


export const LoginScreen: React.FC = () => {

    const theme = useTheme();
    const [login] = useMutation<Login, LoginVariables>(LOGIN);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [hasSubmittedForm, setHasSubmittedForm] = React.useState(false);
    const { navigate } = useNavigation<PDStackNavigationProps>();
    const { handleAuthSuccess } = useAuthHandler();

    const emailRef = React.useRef<TextInput>(null);
    const usernameRef = React.useRef<TextInput>(null);
    const pwRef = React.useRef<TextInput>(null);
    const pw2Ref = React.useRef<TextInput>(null);

    const validationSchema = Yup.object({
        usernameOrEmail: Yup.string()
            .min(2, 'Username or email must be at least 2 characters')
            .required('Required'),
        password: Yup.string()
            .min(4, 'Password must be at least 4 characters')
            .required('Required'),
    });

    const formikSubmit = async (values: Values) => {
        console.log('Submitting!');
        console.log(JSON.stringify(values));
        try {
            const res = await login({
                variables: {
                    usernameOrEmail: values.usernameOrEmail,
                    password: values.password,
                },
            });
            console.log(JSON.stringify(res));

            if (res?.data?.login?.id) {
                console.log('we did it!');
                handleAuthSuccess(res.data.login.id);
            } else {
                console.log('Show errors here!');
                // TODO: check errors
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
            console.error(JSON.stringify(e));
            setErrorMessage(
                ErrorParser.getUserError(
                    JSON.stringify(e)
                )
            );
        }
    };

    return <PDSafeAreaView forceInset={ { bottom: 'never' } } bgColor="white">

        <ScreenHeader hasBackButton color="blue" textType="nav">Sign In</ScreenHeader>
        <KeyboardAwareScrollView style={ { ...styles.scrollView, backgroundColor: theme.colors.background } } extraScrollHeight={ 65 }>
            <PDText type="content" color="greyDark" textAlign="center" style={ styles.headerText }>
                Sign In to your account
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
                        { errorMessage && <PDText type="content" color="red" textAlign="center">{errorMessage}</PDText>}
                        <AuthTextField
                            label="Email Or Username"
                            name="usernameOrEmail"
                            type="usernameOrEmail"
                            placeholder="Email or Username"
                            onBlur={ handleBlur('usernameOrEmail') }
                            onChangeText={ handleChange('usernameOrEmail') }
                            value={ values.usernameOrEmail }
                            errorText={ hasSubmittedForm && errors.usernameOrEmail }
                            ref={ emailRef }
                            nextRef={ usernameRef }
                            returnKeyType="next"
                            keyboardType="email-address" />
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
                            nextRef={ pw2Ref }returnKeyType="done"
                            onSubmit={ () => { setHasSubmittedForm(true); handleSubmit(); } } />
                        <ButtonWithChildren
                            onPress={ () => { setHasSubmittedForm(true); handleSubmit(); } }
                            styles={ [
                                { backgroundColor: (isValid || !hasSubmittedForm) ? theme.colors.blue : theme.colors.greyLight },
                                styles.buttonContainer,
                            ] }>
                                <PDText type="subHeading" color="alwaysWhite">Sign In</PDText>
                        </ButtonWithChildren>
                        {/* <button className={ styles.enterButton } type="submit">Create Account</button>
                        <div className={ styles.formInfo }>Already have an account? <Link href={ getLoginLink(props) }><a>Log in</a></Link></div> */}
                    </>;
                }}
            </Formik>
            <LinkText spans={ [
                { text: "Don't have an account yet? " },
                { text: 'Create one now!', action: () => navigate('CreateAccount') },
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
        marginTop: PDSpacing.sm,
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
});
