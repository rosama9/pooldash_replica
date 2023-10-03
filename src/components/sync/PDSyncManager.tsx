import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { ME } from '~/services/gql/AuthAPI';
import { Me } from '~/services/gql/generated/Me';


const InnerPDSyncManager: React.FC = ({ children }) => {
    const { updateDS } = useDeviceSettings();
    const [runQuery] = useLazyQuery<Me>(ME);

    /// On first load, make sure the user is still logged in:
    useEffect(() => {
        const asyncStuff = async () => {
            const res = await runQuery();
            updateDS({
                authenticatedUserId: res?.data?.me?.id ?? null,
            });
        };
        asyncStuff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TODO: resync on updated authuserid.
    return <>{ children }</>;
};

export const PDSyncManager = React.memo<{children: React.ReactNode}>(InnerPDSyncManager);
