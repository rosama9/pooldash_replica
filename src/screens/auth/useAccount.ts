import { useEffect } from 'react';
import CookieManager from '@react-native-cookies/cookies';

import { PDSection } from '~/components/list/models';
import { ACCOUNT } from '~/services/gql/AccountAPI';
import { useApolloClient, useQuery } from '@apollo/client';
import { AccountInfo } from '~/services/gql/generated/AccountInfo';
import format from 'date-fns/format';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { useNavigation } from '@react-navigation/native';

export const useAccount = () => {

    useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { data } = useQuery<AccountInfo>(ACCOUNT);
    const client = useApolloClient();
    const { updateDS } = useDeviceSettings();
    const { goBack } = useNavigation();

    const handleLogout = () => {
        CookieManager.clearAll();
        client.clearStore();
        updateDS({ authenticatedUserId: null });
        goBack();
    };

    let dateString = '';
    if (data?.me?.joined_ts) {
        dateString = format(data.me.joined_ts, 'MM/dd/yyyy');
    }

    const accountSection : PDSection[] = [
        {
            title: 'info',
            data: [
                {
                    id: 'emailSupport',
                    image: 'IconEmail',
                    label: 'Email: ',
                    value: data?.me?.email ?? '',
                    valueColor: 'green',
                    onPress: null,
                    animationIndex: 0,
                },
                {
                    id: 'calendar',
                    image: 'IconCal',
                    value: dateString,
                    label: 'Created: ',
                    valueColor: 'purple',
                    onPress: null,
                    animationIndex: 1,
                },
                {
                    id: 'pages',
                    image: 'IconPages',
                    label: 'Pools: ',
                    value: `${data?.pools.count ?? ''}`,
                    valueColor: 'teal',
                    onPress: null,
                    animationIndex: 2,
                },
                {
                    id: 'page',
                    image: 'IconPaper',
                    label: 'Logs: ',
                    value: `${data?.history.count ?? ''}`,
                    valueColor: 'orange',
                    onPress: null,
                    animationIndex: 3,
                },
                // {
                //     id: 'sync',
                //     image: 'IconVerified',
                //     label: 'Sync Data: 100%',
                //     valueColor: 'pink',
                //     onPress: null,
                //     animationIndex: 3,
                // },
            ],
        },
        {
            title: 'actions',
            data: [
                {
                    id: 'resetPassword',
                    image: 'IconReset',
                    label: 'Reset Password',
                    valueColor: 'black',
                    onPress: () => {},
                    animationIndex: 4,
                },
                {
                    id: 'logOut',
                    image: 'IconLogOut',
                    label: 'Log out',
                    valueColor: 'black',
                    onPress: handleLogout,
                    animationIndex: 5,
                },
            ],
        },
    ];

    return accountSection;
};
