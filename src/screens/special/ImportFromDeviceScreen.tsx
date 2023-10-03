import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { Import } from '~/components/list/Import';
import { LinkText } from '~/components/misc/LinkText';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';

export const ImportFromDeviceScreen = (): JSX.Element => {
    const styles = getStyles(useTheme(), StyleSheet, useSafeAreaInsets());

    const importDoc = 'https://docs.pooldash.com/mobile/importing-pools';

    return (
      <PDSafeAreaView style={ styles.container } forceInset={ { bottom: 'never' } } >
        <ScreenHeader textType="heading" color="blue">
          Import Pools
        </ScreenHeader>
        <ScrollView style={ styles.scrollView } contentInset={ styles.contentInset }>
          <PDView style={ styles.bodyContainer }>
            <Import/>
          </PDView>
                <LinkText spans={ [
                    { text: 'Guide to importing can be found, ' },
                    { text: 'here', action: () => Linking.openURL(importDoc) },
                ] } />
        </ScrollView>
      </PDSafeAreaView>
    );
};

const getStyles = (theme: any, styleSheet: any, insets: any) => {
  return styleSheet.create({
    container: {
      backgroundColor: 'fff',
    },
    bodyContainer: {
        flex: 1,
        padding: PDSpacing.lg,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    body: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bodyTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bodyText: {
        fontSize: 18,
        color: theme.colors.text,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    contentInset: {
        bottom: insets.bottom,
    },
    scrollView: {
        flex: 1,
    },
});
};


