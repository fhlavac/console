import { ReducersMapObject, combineReducers } from 'redux';
import * as _ from 'lodash-es';
import { ResolvedExtension, ReduxReducer } from '@console/dynamic-plugin-sdk';
import store, { RootState, baseReducers } from '@console/dynamic-plugin-sdk/src/app/redux';

export { RootState } from '@console/dynamic-plugin-sdk/src/app/redux';

export const applyReduxExtensions = (reducerExtensions: ResolvedExtension<ReduxReducer>[]) => {
  const pluginReducers: ReducersMapObject = {};

  reducerExtensions.forEach(({ properties: { scope, reducer } }) => {
    pluginReducers[scope] = reducer;
  });

  const nextReducers: ReducersMapObject<RootState> = _.isEmpty(pluginReducers)
    ? baseReducers
    : { plugins: combineReducers(pluginReducers), ...baseReducers };

  store.replaceReducer(combineReducers<RootState>(nextReducers));
};

if (process.env.NODE_ENV !== 'production') {
  // Expose Redux store for debugging
  window.store = store;
}

export default store;
