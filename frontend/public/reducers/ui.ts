import * as _ from 'lodash-es';
import { RootState } from '../redux';
import { Alert, AlertStates, RuleStates, SilenceStates } from '../components/monitoring/types';
import { isSilenced } from '../components/monitoring/utils';
import { getUser } from '@console/dynamic-plugin-sdk';

export { UIState, impersonateStateToProps } from '@console/dynamic-plugin-sdk/src/app/reducers/ui';

export const silenceFiringAlerts = (firingAlerts, silences) => {
  // For each firing alert, store a list of the Silences that are silencing it and set its state to show it is silenced
  _.each(firingAlerts, (a) => {
    a.silencedBy = _.filter(
      _.get(silences, 'data'),
      (s) => _.get(s, 'status.state') === SilenceStates.Active && isSilenced(a, s),
    );
    if (a.silencedBy.length) {
      a.state = AlertStates.Silenced;
      // Also set the state of Alerts in `rule.alerts`
      _.each(a.rule.alerts, (ruleAlert) => {
        if (_.some(a.silencedBy, (s) => isSilenced(ruleAlert, s))) {
          ruleAlert.state = AlertStates.Silenced;
        }
      });
      if (!_.isEmpty(a.rule.alerts) && _.every(a.rule.alerts, isSilenced)) {
        a.rule.state = RuleStates.Silenced;
        a.rule.silencedBy = _.filter(
          silences?.data,
          (s) => s.status.state === SilenceStates.Active && _.some(a.rule.alerts, isSilenced),
        );
      }
    }
  });
};

export const createProjectMessageStateToProps = ({ UI }: RootState) => {
  return { createProjectMessage: UI.get('createProjectMessage') as string };
};

export const userStateToProps = (state: RootState) => {
  return { user: getUser(state) };
};

export const getActiveNamespace = ({ UI }: RootState): string => UI.get('activeNamespace');

export const getActiveApplication = ({ UI }: RootState): string => UI.get('activeApplication');

export type NotificationAlerts = {
  data: Alert[];
  loaded: boolean;
  loadError?: {
    message?: string;
  };
};
