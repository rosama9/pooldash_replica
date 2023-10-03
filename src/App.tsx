
import * as React from 'react';
import { PDRootNavigator } from '~/navigator/PDRootNavigator';
import { loadDeviceSettings } from '~/redux/deviceSettings/Actions';

import { ApolloProvider } from '@apollo/client';

import { DeviceSettings } from './models/DeviceSettings';
import { dispatch } from './redux/AppState';
import { Database } from './repository/Database';
import { DeviceSettingsService } from './services/DeviceSettings/DeviceSettingsService';
import { getApolloClient } from './services/gql/Client';
import { useDeviceSettings } from './services/DeviceSettings/Hooks';
import { darkTheme, lightTheme, PDThemeContext } from './components/PDTheme';
import { Appearance } from 'react-native';
import { PDSyncManager } from './components/sync/PDSyncManager';

export const App: React.FC = () => {
    const [isDatabaseLoaded, setIsDatabaseLoaded] = React.useState(false);
    const [areDeviceSettingsLoaded, setAreDeviceSettingsLoaded] = React.useState(false);
    const { ds } = useDeviceSettings();

    const apolloClient = getApolloClient();

    React.useEffect(() => {
        Database.prepare().finally(() => {
            setIsDatabaseLoaded(true);
        });

        DeviceSettingsService.getSettings().then((settings: DeviceSettings) => {
            dispatch(loadDeviceSettings(settings));
            setAreDeviceSettingsLoaded(true);
        });
    }, []);

    const isAppReady = isDatabaseLoaded && areDeviceSettingsLoaded;
    const { night_mode } = ds;

    const appContent = React.useMemo(() => {
        console.log('Re Rendering App');
        if (!isAppReady) {
            return <></>;
        }
        // TODO: move into another helper
        let theme = darkTheme;
        if (night_mode === 'light') {
            theme = lightTheme;
        } else if (night_mode === 'system' && Appearance.getColorScheme() === 'light') {
            theme = lightTheme;
        }
        return (
            <PDThemeContext.Provider value={ theme }>
                <PDSyncManager>
                    <PDRootNavigator />
                </PDSyncManager>
            </PDThemeContext.Provider>
        );
    }, [night_mode, isAppReady]);

    return (
        <ApolloProvider client={ apolloClient }>
            { appContent }
        </ApolloProvider>
    );
};

