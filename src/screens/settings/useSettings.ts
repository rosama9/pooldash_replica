import { useEffect } from 'react';
import {  } from '~/components/list/PDSectionList';
import { getDisplayForPoolValue } from '~/models/Pool/PoolUnit';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useTypedSelector } from '~/redux/AppState';
import { ExportService } from '~/services/ExportService';

import { useNavigation } from '@react-navigation/native';

import { PoolUnit, PoolUnitOptions } from '~/models/Pool/PoolUnit';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import pluralize from 'pluralize';
import { PDSection } from '~/components/list/models';

export const useSettings = () => {
    const { navigate } = useNavigation<PDStackNavigationProps>();
    const popoverValue = useTypedSelector(state => state.popover);
    const { ds, updateDS } = useDeviceSettings();

    useEffect(() => {
        if (popoverValue && popoverValue !== ds.units) {
            const cb = async () => {
                await updateDS({ units: popoverValue as PoolUnit });
            };
            cb();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [popoverValue, ds.units]);

    const handleNavigationUnits = () =>{
        navigate('PopoverScreen', {
            title: 'Volume Units',
            color: 'orange',
            description: 'This will only affect how the pool volume is displayed throughout the app. This will not affect the treatment units.',
            items: PoolUnitOptions.map((item) => ({ name: item.display, value: item.value })),
            prevSelection: ds.units,
        });

    };
    const handleNavigationScoops = () =>{
        navigate('ScoopsList');
    };
    const handleNavigationSubscription = () =>{
        navigate('Subscription');
    };
    const handleNavigatePoolDoctorImport = () => {
        navigate('Import');
    };
    const handleNavigateThemeToggled = () => {
        navigate('ThemeToggleScreen');
    };
    // const handleNavigateAuth = () => {
    //     if (ds.authenticatedUserId) {
    //         navigate('AccountsScreen');
    //     } else {
    //         navigate('AuthScreen');
    //     }
    // };

    const handleExportData = async () => {
        try {
            await ExportService.generateAndShareCSV(null);
        } catch (e) {
            console.warn(e);
        }
    };

    const numScoops = ds.scoops.length;
    const scoopsSubtitle = `${numScoops} ${pluralize('scoop', numScoops)}`;

    const settingsSection : PDSection[] = [
        {
            title: 'measurements',
            data: [
                {
                    id: 'unit',
                    image: 'IconUnits',
                    label: 'Units:',
                    valueColor: 'orange',
                    value: getDisplayForPoolValue(ds.units),
                    onPress: handleNavigationUnits,
                    animationIndex: 0,
                },
                {
                    id: 'scoops',
                    image: 'IconScoop',
                    label: 'Scoops:',
                    valueColor: 'pink',
                    value: scoopsSubtitle,
                    onPress: handleNavigationScoops,
                    animationIndex: 1,
                },
            ],
        },
        {
            title: 'open source',
            data: [
                {
                    id: 'pooldashPlus',
                    image: 'IconPooldashPlus',
                    label: 'About',
                    valueColor: 'black',
                    onPress: handleNavigationSubscription,
                    animationIndex: 2,
                },
            ],
        },
        {
            title: 'additional actions',
            data: [
                {
                    id: 'exportData',
                    image: 'IconExportData',
                    label: 'Export Data',
                    valueColor: 'black',
                    onPress: handleExportData,
                    animationIndex: 3,
                },
                {
                    id: 'importData',
                    image: 'IconImportData',
                    label: 'Import Pools',
                    valueColor: 'black',
                    onPress: handleNavigatePoolDoctorImport,
                    animationIndex: 4,
                },
                // {
                //     id: 'createAccount',
                //     image: 'IconAccount',
                //     label: ds.authenticatedUserId ? 'Account' : 'Create Account',
                //     valueColor: 'black',
                //     onPress: handleNavigateAuth,
                //     animationIndex: 5,
                // },
            ],
        },
        {
            title: 'theme',
            data: [
                {
                    id: 'theme',
                    image: 'IconTheme',
                    label: 'Theme ',
                    valueColor: 'black',
                    onPress: handleNavigateThemeToggled,
                    animationIndex: 6,
                },
            ],
        },
    ];

    return settingsSection;
};
