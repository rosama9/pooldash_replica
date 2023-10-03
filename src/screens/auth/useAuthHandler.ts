import { useNavigation } from '@react-navigation/native';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';

export const useAuthHandler = () => {

    const { navigate } = useNavigation<PDStackNavigationProps>();
    const { updateDS } = useDeviceSettings();

    const handleAuthSuccess = (authenticatedUserId: string) => {
        updateDS({ authenticatedUserId });
        navigate('AccountsScreen');
    };

    return { handleAuthSuccess };
};
