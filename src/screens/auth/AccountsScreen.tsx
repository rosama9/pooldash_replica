import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSectionList } from '~/components/list/PDSectionList';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { useStandardStatusBar } from '~/hooks/useStatusBar';

import { useAccount } from './useAccount';

export const AccountsScreen = () => {
    const accountSections = useAccount();
    useStandardStatusBar();
    const insets = useSafeAreaInsets();

    return (
        <PDSafeAreaView bgColor="white" forceInset={ { bottom: 'never' } }>
            <ScreenHeader color="blue" textType="heading">
                My Account
            </ScreenHeader>
            <PDSectionList sections={ accountSections } showFooter insets={ { bottom: insets.bottom } } />
        </PDSafeAreaView>
    );
};
