import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CreateAccountScreen } from '~/screens/auth/CreateAccountScreen';
import { LoginScreen } from '~/screens/auth/LoginScreen';

export type PDAuthNavParams = {
    CreateAccount: undefined;
    Login: undefined;
};

const AuthStackNavigator = createStackNavigator<PDAuthNavParams>();


export const AuthNavigator: React.FC = () => {
    // TODO: wrap with some auth provider hook? Meh, might do the whole app instead.
    return (
        <AuthStackNavigator.Navigator screenOptions={ { headerShown: false } }>
            <AuthStackNavigator.Screen name="CreateAccount" component={ CreateAccountScreen } />
            <AuthStackNavigator.Screen name="Login" component={ LoginScreen } />
        </AuthStackNavigator.Navigator>
    );
};
