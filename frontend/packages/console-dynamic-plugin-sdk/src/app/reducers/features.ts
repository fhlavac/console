import { Map as ImmutableMap } from 'immutable';
import * as _ from 'lodash';
import { FLAGS } from '@console/shared/src/constants'; // !!!: migrate?
import { FeatureAction, ActionType } from '../actions/features';
import { ActionType as K8sActionType } from '../actions/k8s';
import {
  ChargebackReportModel,
  ClusterAutoscalerModel,
  ClusterServiceClassModel,
  ConsoleCLIDownloadModel,
  ConsoleExternalLogLinkModel,
  ConsoleLinkModel,
  ConsoleNotificationModel,
  ConsoleYAMLSampleModel,
  MachineAutoscalerModel,
  MachineConfigModel,
  MachineHealthCheckModel,
  MachineModel,
  PrometheusModel,
} from '../models';
import { referenceForModel } from '../module/k8s/k8s-ref'; // Done! "getReferenceForModel"

export const defaults = _.mapValues(FLAGS, (flag) =>
  flag === FLAGS.AUTH_ENABLED ? !window.SERVER_FLAGS.authDisabled : undefined,
);

export const baseCRDs = {
  [referenceForModel(ChargebackReportModel)]: FLAGS.CHARGEBACK,
  [referenceForModel(ClusterAutoscalerModel)]: FLAGS.CLUSTER_AUTOSCALER,
  [referenceForModel(ClusterServiceClassModel)]: FLAGS.SERVICE_CATALOG,
  [referenceForModel(ConsoleLinkModel)]: FLAGS.CONSOLE_LINK,
  [referenceForModel(ConsoleCLIDownloadModel)]: FLAGS.CONSOLE_CLI_DOWNLOAD,
  [referenceForModel(ConsoleExternalLogLinkModel)]: FLAGS.CONSOLE_EXTERNAL_LOG_LINK,
  [referenceForModel(ConsoleNotificationModel)]: FLAGS.CONSOLE_NOTIFICATION,
  [referenceForModel(ConsoleYAMLSampleModel)]: FLAGS.CONSOLE_YAML_SAMPLE,
  [referenceForModel(MachineAutoscalerModel)]: FLAGS.MACHINE_AUTOSCALER,
  [referenceForModel(MachineConfigModel)]: FLAGS.MACHINE_CONFIG,
  [referenceForModel(MachineHealthCheckModel)]: FLAGS.MACHINE_HEALTH_CHECK,
  [referenceForModel(MachineModel)]: FLAGS.CLUSTER_API,
  [referenceForModel(PrometheusModel)]: FLAGS.PROMETHEUS,
};

export const CRDs = { ...baseCRDs };

export type FeatureState = ImmutableMap<string, boolean>;

export const featureReducerName = 'FLAGS';
export const featureReducer = (state: FeatureState, action: FeatureAction): FeatureState => {
  if (!state) {
    return ImmutableMap(defaults);
  }

  switch (action.type) {
    case ActionType.SetFlag:
      return state.set(action.payload.flag, action.payload.value);

    case ActionType.ClearSSARFlags:
      return state.withMutations((s) =>
        action.payload.flags.reduce((acc, curr) => acc.remove(curr), s),
      );

    case K8sActionType.ReceivedResources:
      // Flip all flags to false to signify that we did not see them
      _.each(CRDs, (v) => state.set(v, false)); // !!!: verify change!

      return action.payload.resources.models
        .filter((model) => CRDs[referenceForModel(model)] !== undefined)
        .reduce((nextState, model) => {
          const flag = CRDs[referenceForModel(model)];
          // eslint-disable-next-line no-console
          console.log(`${flag} was detected.`);

          return nextState.set(flag, true);
        }, state);

    default:
      return state;
  }
};
