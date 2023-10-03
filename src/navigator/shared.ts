import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PDAuthNavParams } from './AuthNavigator';

import { PDPoolParams } from './EditPoolNavigator';
import { PDCardNavigatorParams } from './PDCardNavigator';
import { PDRootNavigatorParams } from './PDRootNavigator';

export type PDNavParams = PDCardNavigatorParams & PDRootNavigatorParams & PDPoolParams & PDAuthNavParams;

export type PDStackNavigationProps = StackNavigationProp<PDNavParams>;

export type EstimateRoute = RouteProp<PDPoolParams, 'EntryShape'>;
