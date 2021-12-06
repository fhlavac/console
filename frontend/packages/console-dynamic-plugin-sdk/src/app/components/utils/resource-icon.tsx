import * as React from 'react';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import { K8sResourceKindReference } from '../../../extensions/console-types';
import { kindToAbbr } from '../../module/k8s/get-resources'; // no info!
import { modelFor } from '../../module/k8s/k8s-models'; // Need a work around for/to remove uses of - has a reference to the store

const MEMO = {};

export const ResourceIcon: React.SFC<ResourceIconProps> = ({ className, kind }) => {
  // if no kind, return null so an empty icon isn't rendered
  if (!kind) {
    return null;
  }
  const memoKey = className ? `${kind}/${className}` : kind;
  if (MEMO[memoKey]) {
    return MEMO[memoKey];
  }
  const kindObj = modelFor(kind);
  const kindStr = _.get(kindObj, 'kind', kind);
  const backgroundColor = _.get(kindObj, 'color', undefined);
  const klass = classNames(`co-m-resource-icon co-m-resource-${kindStr.toLowerCase()}`, className);
  const iconLabel = (kindObj && kindObj.abbr) || kindToAbbr(kindStr);

  const rendered = (
    <>
      <span className="sr-only">{kindStr}</span>
      <span className={klass} title={kindStr} style={{ backgroundColor }}>
        {iconLabel}
      </span>
    </>
  );
  if (kindObj) {
    MEMO[memoKey] = rendered;
  }

  return rendered;
};

export type ResourceIconProps = {
  className?: string;
  kind: K8sResourceKindReference;
};
