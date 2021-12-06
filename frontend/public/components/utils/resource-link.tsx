import * as _ from 'lodash-es';
import * as React from 'react';

import { FLAGS } from '@console/shared/src/constants';
import { K8sKind, K8sResourceKindReference, K8sResourceKind } from '../../module/k8s';
import { connectToFlags } from '../../reducers/connectToFlags';
import { FlagsObject } from '../../reducers/features';
import {
  resourcePathFromModel,
  resourcePath,
  ResourceLink,
} from '@console/dynamic-plugin-sdk/src/app/components/utils/resource-link';

export {
  resourcePathFromModel,
  resourcePath,
  ResourceLink,
} from '@console/dynamic-plugin-sdk/src/app/components/utils/resource-link';

export const resourceListPathFromModel = (model: K8sKind, namespace?: string) =>
  resourcePathFromModel(model, null, namespace);

export const resourceObjPath = (obj: K8sResourceKind, kind: K8sResourceKindReference) =>
  resourcePath(kind, _.get(obj, 'metadata.name'), _.get(obj, 'metadata.namespace'));

const NodeLink_: React.FC<NodeLinkProps> = (props) => {
  const { name, flags } = props;
  if (!name) {
    return <>-</>;
  }
  return flags[FLAGS.CAN_LIST_NODE] ? (
    <ResourceLink kind="Node" name={name} title={name} />
  ) : (
    <span className="co-break-word">{name}</span>
  );
};

export const NodeLink = connectToFlags<NodeLinkProps>(FLAGS.CAN_LIST_NODE)(NodeLink_);

type NodeLinkProps = {
  name: string;
  flags: FlagsObject;
};
