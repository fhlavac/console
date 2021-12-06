import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { coreReducer } from './core/reducers/core';
import { DashboardsState } from './reducers/dashboards';
import { featureReducer, featureReducerName, FeatureState } from './reducers/features';
import k8sReducers, { K8sState } from './reducers/k8s';
import UIReducers, { UIState } from './reducers/ui';
import { SDKStoreState } from './redux-types';

Dořešit!;
// import { dashboardsReducer } from './reducers/dashboards';

const composeEnhancers =
  (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export type RootState = {
  k8s: K8sState;
  UI: UIState;
  [featureReducerName]: FeatureState;
  dashboards: DashboardsState;
  plugins?: {
    [namespace: string]: any;
  };
} & SDKStoreState;

/**
 * Dynamic Plugin SDK Redux store reducers
 *
 * If the app uses Redux, these can be spread into the root of your store to provide an integrated SDK.
 * If the app does not use Redux, these will be provided via the SDK Redux Store.
 */
export const SDKReducers = Object.freeze({
  sdkCore: coreReducer,
});

export const baseReducers = Object.freeze({
  k8s: k8sReducers, // data
  UI: UIReducers,
  [featureReducerName]: featureReducer,
  dashboards: dashboardsReducer,
  ...SDKReducers,
});

const store = createStore(
  combineReducers<RootState>(baseReducers),
  {},
  composeEnhancers(applyMiddleware(thunk)),
);

export default store;
