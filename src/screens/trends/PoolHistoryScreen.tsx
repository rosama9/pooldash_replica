import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import { ChartCard } from '~/components/charts/ChartCard';
import { DateRangeSelector, DateRange } from '~/components/DateRangeSelector';
import { Pool } from '~/models/Pool';
import { AppState } from '~/redux/AppState';
import { ChartCardViewModel } from '~/components/charts/ChartCardViewModel';
import { DeviceSettings } from '~/models/DeviceSettings';
import { useNavigation } from '@react-navigation/native';
import { ChartService } from '~/services/ChartService';
import { PDNavParams } from '~/navigator/shared';
import { useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';

interface PoolHistoryProps {
    /**  */
    selectedPool: Pool;
    deviceSettings: DeviceSettings;
}

const mapStateToProps = (state: AppState): PoolHistoryProps => {
    return {
        deviceSettings: state.deviceSettings,
        selectedPool: state.selectedPool!,
    };
};

const PoolHistoryComponent: React.FunctionComponent<PoolHistoryProps> = (props) => {
    const [dateRange, setDateRange] = React.useState<DateRange>('1M');
    const [chartData, setChartData] = React.useState<ChartCardViewModel[]>([]);
    const { goBack } = useNavigation<StackNavigationProp<PDNavParams, 'PoolHistory'>>();
    const theme = useTheme();

    const { selectedPool } = props;

    React.useEffect(() => {
        setChartData(ChartService.loadChartData(dateRange, selectedPool));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPool.objectId, dateRange]);

    const handleBackPress = () => {
        goBack();
    };

    const onRangeChanged = (selectedRange: DateRange) => {
        setDateRange(selectedRange);
    };
    const dateRanges: DateRange[] = ['24H', '7D', '1M', '3M', '1Y', 'ALL'];

    const webViewChart = (vm: ChartCardViewModel) => {
        return <ChartCard key={ vm.masterId + dateRange + vm.title } viewModel={ vm } containerStyles={ styles.chartCard } />;
    };

    return (
        <PDSafeAreaView style={ { backgroundColor: theme.colors.white, flex: 1 } } forceInset={ { bottom: 'never' } }>
            <ScreenHeader hasBackButton hasBottomLine={ false } handlePressedBack={ handleBackPress } textType="heading" color="blue">Trends</ScreenHeader>
            <PDView style={ styles.header } borderColor="border">
                <DateRangeSelector
                    onRangeUpdated={ onRangeChanged }
                    dateRange={ dateRanges }
                    currentDateRange={ dateRange }
                />
            </PDView>
            <FlatList
                data={ chartData }
                style={ [styles.scrollView, { backgroundColor: theme.colors.background }] }
                renderItem={ ({ item }) => webViewChart(item) }
                keyExtractor={ (item: any, index: number) => index.toString() + item.masterId }
                initialNumToRender={ 2 }
                maxToRenderPerBatch={ 1 }
                windowSize={ 1 }
            />

        </PDSafeAreaView>
    );
};

export const PoolHistoryScreen = connect(mapStateToProps)(PoolHistoryComponent);


const styles = StyleSheet.create({
    scrollView: {
        paddingHorizontal: 15,
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 2,
    },
    gradientText: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 12,
        marginTop: 6,
    },
    chartContainer: {
        marginTop: 20,
        flex: 1,
    },
    chartCard: {
        marginBottom: 20,
    },
});
