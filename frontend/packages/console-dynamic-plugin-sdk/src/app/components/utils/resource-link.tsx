import * as React from 'react';
import * as classNames from 'classnames';
import { Link } from 'react-router-dom';
import { ResourceLinkProps } from '@console/dynamic-plugin-sdk';
import { getReference } from '@console/dynamic-plugin-sdk/src/utils/k8s/k8s-ref';
import { K8sModel } from '../../../api/common-types';
import { K8sResourceKindReference } from '../../../extensions/console-types';
import {
  modelFor,
  // Need a work around for/to remove uses of - has a reference to the store
  referenceForModel, // Done! "getReferenceForModel"
} from '../../module/k8s';
import { ResourceIcon } from './resource-icon';

const unknownKinds = new Set();

export const resourcePathFromModel = (model: K8sModel, name?: string, namespace?: string) => {
  const { plural, namespaced, crd } = model;

  let url = '/k8s/';

  if (!namespaced) {
    url += 'cluster/';
  }

  if (namespaced) {
    url += namespace ? `ns/${namespace}/` : 'all-namespaces/';
  }

  if (crd) {
    url += referenceForModel(model);
  } else if (plural) {
    url += plural;
  }

  if (name) {
    // Some resources have a name that needs to be encoded. For instance,
    // Users can have special characters in the name like `#`.
    url += `/${encodeURIComponent(name)}`;
  }

  return url;
};

/**
 * NOTE: This will not work for runtime-defined resources. Use a `connect`-ed component like `ResourceLink` instead.
 */
export const resourcePath = (kind: K8sResourceKindReference, name?: string, namespace?: string) => {
  const model = modelFor(kind);
  if (!model) {
    if (!unknownKinds.has(kind)) {
      unknownKinds.add(kind);
      // eslint-disable-next-line no-console
      console.error(`resourcePath: no model for "${kind}"`);
    }
    return undefined;
  }

  return resourcePathFromModel(model, name, namespace); // ??
};

export const ResourceLink: React.FC<ResourceLinkProps> = ({
  className,
  displayName,
  inline = false,
  kind,
  groupVersionKind,
  linkTo = true,
  name,
  namespace,
  hideIcon,
  title,
  children,
  dataTest,
  onClick,
}) => {
  if (!kind && !groupVersionKind) {
    return null;
  }
  const kindReference = groupVersionKind ? getReference(groupVersionKind) : kind;
  const path = resourcePath(kindReference, name, namespace);
  const value = displayName || name;
  const classes = classNames('co-resource-item', className, {
    'co-resource-item--inline': inline,
  });

  return (
    <span className={classes}>
      {!hideIcon && <ResourceIcon kind={kindReference} />}
      {path && linkTo ? (
        <Link
          to={path}
          title={title}
          className="co-resource-item__resource-name"
          data-test-id={value}
          data-test={dataTest}
          onClick={onClick}
        >
          {value}
        </Link>
      ) : (
        <span className="co-resource-item__resource-name" data-test-id={value} data-test={dataTest}>
          {value}
        </span>
      )}
      {children}
    </span>
  );
};

ResourceLink.displayName = 'ResourceLink';
