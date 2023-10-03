import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { useNavigation } from '@react-navigation/native';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useImportablePools } from './PoolDoctorImportHooks';
import { ScrollView } from 'react-native-gesture-handler';
import { ForumPrompt } from '../home/footer/ForumPrompt';
import { useStandardStatusBar } from '~/hooks/useStatusBar';
import { Config } from '~/services/Config/AppConfig';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HR } from '~/components/Hr';
import { PDButton } from '~/components/buttons/PDButton';

export const ImportScreen: React.FC = () => {
    const numPools = useImportablePools();
    useStandardStatusBar();

    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { navigate } = useNavigation<PDStackNavigationProps>();

    const handlePressedPoolDoctor = () => {
        navigate('PoolDoctorImport');
    };

    const goToImportFromDevice = () => {
      navigate('ImportFromDevice');
    };

    const getPoolDoctorContent = () => {
      if (Config.isIos && numPools > 0) {
        return <>
          <PDText type="heading" color="black">Pool Doctor</PDText>
          <PDText type="bodyRegular" color="greyDark">
            Want to import pools from the Pool Doctor app?
          </PDText>
          <PDButton onPress={ handlePressedPoolDoctor } textColor="alwaysWhite" style={ styles.button }>Import from Pool Doctor</PDButton>
          <HR />
        </>;
      }
      return <></>;
    };

    return (
        <PDSafeAreaView style={ { backgroundColor: theme.colors.white } } forceInset={ { bottom: 'never' } } >
            <ScreenHeader textType="heading" color="blue">
                Import Pools
            </ScreenHeader>
        <ScrollView style={ { flex: 1 } } contentInset={ { bottom: insets.bottom } }>
          <PDView style={ styles.container }>
            { getPoolDoctorContent() }
            <PDButton onPress={ goToImportFromDevice } textColor="alwaysWhite" style={ styles.button }>Import from CSV</PDButton>
            <PDText type="bodyMedium" color="greyDarker" style={ { marginTop: PDSpacing.xl } }>Want to import pools from somewhere else? Tell us on the support forum:</PDText>
          </PDView>
          <ForumPrompt />
        </ScrollView>
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: PDSpacing.md,
        borderRadius: 18,
        paddingHorizontal: PDSpacing.lg,
        paddingVertical: PDSpacing.md,
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 18,
        marginBottom: 18,
    },
    bottomSpace: {
        marginBottom: PDSpacing.sm,
    },
    button: {
      borderRadius: 27.5,
      paddingVertical: PDSpacing.xs,
    },
});

