import * as React from 'react';
import { StyleProp, StyleSheet, TouchableHighlight, ViewStyle } from 'react-native';
import { PDText, textStyles } from '../PDText';
import { useTheme } from '../PDTheme';
import { PDView } from '../PDView';

interface Props {
    spans: SpanWithAction[];
    containerStyles?: StyleProp<ViewStyle>;
}
interface SpanWithAction {
    text: string;
    action?: () => void;
}

/// A component that renders text with hyperlinks.

export const LinkText: React.FC<Props> = (props) => {

    const theme = useTheme();
    const plainTextStyles = textStyles.tooltip;
    const linkTextStyles = { ...textStyles.tooltip, color: theme.colors.blue };

    const content = props.spans.map((s, i) => {
        if (s.action === undefined) {
            return <PDText style={ plainTextStyles } key={ i }>{s.text}</PDText>;
        } else {
            return (
                <TouchableHighlight
                    underlayColor="transparent"
                    onPress={ s.action }
                    key={ i }>
                    <PDText style={ linkTextStyles } key={ i }>{s.text}</PDText>
                </TouchableHighlight>
            );
        }
    });

    return (
        <PDView style={ [styles.termsContainer, props.containerStyles] }>
            {content}
        </PDView>
    );
};

const styles = StyleSheet.create({
    termsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    termsTextAccount: {
        fontSize: 14,
    },
    termsLink: {
        backgroundColor: 'transparent',
        color: '#3910E8',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

