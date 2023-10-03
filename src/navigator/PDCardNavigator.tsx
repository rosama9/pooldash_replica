import * as React from 'react';
import { CustomTargetsScreen } from '~/screens/customTargets/CustomTargetsScreen';
import { PoolScreen } from '~/screens/pool/details/PoolScreen';
import { HomeScreen } from '~/screens/home/HomeScreen';
import { ReadingListScreen } from '~/screens/readings/ReadingListScreen';
import { FormulaListNavParams, FormulaListScreen } from '~/screens/recipes/FormulaListScreen';
import { FormulaDetailsNavParams, FormulaScreen } from '~/screens/recipes/FormulaScreen';
import { ScoopsListScreen } from '~/screens/settings/scoops/list/ScoopsListScreen';
import { SettingsScreen } from '~/screens/settings/SettingsScreen';
import { SubscriptionScreen } from '~/screens/subscription/SubscriptionScreen';
import { TreatmentListScreen } from '~/screens/treatments/TreatmentListScreen';
import { PoolHistoryScreen } from '~/screens/trends/PoolHistoryScreen';

import { createStackNavigator } from '@react-navigation/stack';

import { SettingNavigation } from './animationEffects';
import { TermsScreen } from '~/screens/subscription/TermsScreen';
import { PrivacyScreen } from '~/screens/subscription/PrivacyScreen';
import { PoolDoctorImportScreen } from '~/screens/special/PoolDoctorImportScreen';
import { ImportScreen } from '~/screens/special/ImportScreen';
import { ImportFromDeviceScreen } from '~/screens/special/ImportFromDeviceScreen';
import { AuthNavigator } from './AuthNavigator';
import { AccountsScreen } from '~/screens/auth/AccountsScreen';

// This defines the navigation params accepted by each possible screen in PDCardNavigator
export type PDCardNavigatorParams = {
    AccountsScreen: undefined;
    Home: undefined;
    PoolScreen: undefined;
    ReadingList: undefined;
    TreatmentList: undefined;
    Settings: undefined;
    FormulaList: FormulaListNavParams;
    FormulaDetails: FormulaDetailsNavParams;
    PoolHistory: undefined;
    Subscription: undefined;
    CustomTargets: { prevScreen: 'ReadingList' | 'EditPoolNavigator' };
    TermsOfService: undefined;
    PrivacyPolicy: undefined;
    ScoopsList: undefined;
    Import: undefined;
    PoolDoctorImport: undefined;
    ImportFromDevice: undefined;
    AuthScreen: undefined;
};

const CardStack = createStackNavigator<PDCardNavigatorParams>();

export const PDCardNavigator = (): JSX.Element => {
    return (
        <CardStack.Navigator screenOptions={ { headerShown: false } }>
            <CardStack.Screen name="Home" component={ HomeScreen } />
            <CardStack.Screen name="PoolScreen" component={ PoolScreen } />
            <CardStack.Screen name="ReadingList" component={ ReadingListScreen } />
            <CardStack.Screen name="TreatmentList" component={ TreatmentListScreen } />
            <CardStack.Screen name="FormulaList" component={ FormulaListScreen } />
            <CardStack.Screen name="FormulaDetails" component={ FormulaScreen } />
            <CardStack.Screen name="PoolHistory" component={ PoolHistoryScreen } />
            <CardStack.Screen
                name="Settings"
                component={ SettingsScreen }
                options={ {
                    transitionSpec: {
                        open: SettingNavigation,
                        close: SettingNavigation,
                    },
                } }
            />
            <CardStack.Screen name="CustomTargets" component={ CustomTargetsScreen } />
            <CardStack.Screen name="Subscription" component={ SubscriptionScreen } />
            <CardStack.Screen name="TermsOfService" component={ TermsScreen } />
            <CardStack.Screen name="PrivacyPolicy" component={ PrivacyScreen } />
            <CardStack.Screen name="ScoopsList" component={ ScoopsListScreen }  />
            <CardStack.Screen name="Import" component={ ImportScreen }  />
            <CardStack.Screen name="PoolDoctorImport" component={ PoolDoctorImportScreen }  />
            <CardStack.Screen name="ImportFromDevice" component={ ImportFromDeviceScreen } />
            <CardStack.Screen name="AuthScreen" component={ AuthNavigator }  />
            <CardStack.Screen name="AccountsScreen" component={ AccountsScreen }/>
        </CardStack.Navigator>
    );
};
