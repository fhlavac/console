import { K8sResourceCommon } from '../../../extensions/console-types';
import { K8sResourceKind } from '../../module/k8s'; // Comment regarding weakening type checking - use K8sResourceCommon instead

export type FirehoseResult<
  R extends K8sResourceCommon | K8sResourceCommon[] = K8sResourceKind[]
> = {
  loaded: boolean;
  loadError: string;
  optional?: boolean;
  data: R;
  kind?: string;
};
