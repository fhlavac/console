import * as _ from 'lodash';
import { connect } from 'react-redux';
import { K8sModel } from '../api/common-types';
import { K8sResourceKindReference } from '../extensions/console-types';
import { kindForReference } from './module/k8s'; // how to migrate? Done! - "getGroupVersionKindForReference" - use with caution - deprecated
import { RootState } from './redux';

export const connectToModel = connect(
  (state: RootState, props: { kind: K8sResourceKindReference } & any) => {
    const kind: string = props.kind || _.get(props, 'match.params.plural');

    const kindObj: K8sModel = !_.isEmpty(kind)
      ? state.k8s.getIn(['RESOURCES', 'models', kind]) ||
        state.k8s.getIn(['RESOURCES', 'models', kindForReference(kind)])
      : null;

    return { kindObj, kindsInFlight: state.k8s.getIn(['RESOURCES', 'inFlight']) } as any;
  },
);
