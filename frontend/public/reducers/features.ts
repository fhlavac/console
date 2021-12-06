import { FLAGS } from '@console/shared/src/constants'; //upravit
import { isModelFeatureFlag } from '@console/plugin-sdk/src/typings';
import {
  subscribeToExtensions,
  extensionDiffListener,
} from '@console/plugin-sdk/src/api/pluginSubscriptionService';
import {
  ModelFeatureFlag as DynamicModelFeatureFlag,
  isModelFeatureFlag as isDynamicModelFeatureFlag,
} from '@console/dynamic-plugin-sdk/src/extensions';
import { referenceForGroupVersionKind } from '../module/k8s';
import { referenceForModel } from '../module/k8s/k8s-ref';
import { RootState } from '../redux';
import { pluginStore } from '../plugins';
import { featureReducerName, CRDs } from '@console/dynamic-plugin-sdk/src/app/reducers/features';

const addToCRDs = (ref: string, flag: string) => {
  if (!CRDs[ref]) {
    CRDs[ref] = flag as FLAGS;
  }
};

pluginStore
  .getExtensionsInUse()
  .filter(isModelFeatureFlag)
  .forEach((ff) => {
    addToCRDs(referenceForModel(ff.properties.model), ff.properties.flag);
  });

subscribeToExtensions<DynamicModelFeatureFlag>(
  extensionDiffListener((added, removed) => {
    const getModelRef = (e: DynamicModelFeatureFlag) => {
      const model = e.properties.model;
      return referenceForGroupVersionKind(model.group)(model.version)(model.kind);
    };

    added.forEach((e) => {
      addToCRDs(getModelRef(e), e.properties.flag);
    });

    removed.forEach((e) => {
      delete CRDs[getModelRef(e)];
    });

    // TODO(vojtech): change of 'CRDs' should trigger relevant detection logic
  }),
  isDynamicModelFeatureFlag,
);

export {
  FeatureState,
  featureReducerName,
  featureReducer,
  baseCRDs,
  defaults,
} from '@console/dynamic-plugin-sdk/src/app/reducers/features';

export const getFlagsObject = ({ [featureReducerName]: featureState }: RootState): FlagsObject =>
  featureState.toObject();

export type FlagsObject = { [key: string]: boolean };

// Flag detection is not complete if the flag's value is `undefined`.
export const flagPending = (flag: boolean) => flag === undefined;
