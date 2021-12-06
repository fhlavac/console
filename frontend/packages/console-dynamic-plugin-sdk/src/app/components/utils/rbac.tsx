import * as React from 'react';
import * as _ from 'lodash';
import { getImpersonate } from '../../core/reducers/coreSelectors';
import { ProjectModel, SelfSubjectAccessReviewModel } from '../../models';
import {
  AccessReviewResourceAttributes,
  k8sCreate,
  K8sVerb,
  SelfSubjectAccessReviewKind,
} from '../../module/k8s'; // no info, find!
import store from '../../redux';
import { useSafetyFirst } from '../safety-first';

// Memoize the result so we only make the request once for each access review.
// This does mean that the user will have to refresh the page to see updates.
// Accept an `impersonateKey` parameter to include in the cache key even though
// it's not used in the function body. (Impersonate headers are added
// automatically by `k8sCreate`.) This function takes in the destructured
// resource attributes so that the cache keys are stable. (`JSON.stringify` is
// not guaranteed to give the same result for equivalent objects.)
export const checkAccessInternal = _.memoize(
  (
    group: string,
    resource: string,
    subresource: string,
    verb: K8sVerb,
    name: string,
    namespace: string,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    impersonateKey: string,
  ): Promise<SelfSubjectAccessReviewKind> => {
    // Projects are a special case. `namespace` must be set to the project name
    // even though it's a cluster-scoped resource.
    const reviewNamespace =
      group === ProjectModel.apiGroup && resource === ProjectModel.plural ? name : namespace;
    const ssar: SelfSubjectAccessReviewKind = {
      apiVersion: 'authorization.k8s.io/v1',
      kind: 'SelfSubjectAccessReview',
      spec: {
        resourceAttributes: {
          group,
          resource,
          subresource,
          verb,
          name,
          namespace: reviewNamespace,
        },
      },
    };
    return k8sCreate(SelfSubjectAccessReviewModel, ssar);
  },
  (...args) => args.join('~'),
);

export const getImpersonateKey = (impersonate): string => {
  const value = impersonate || getImpersonate(store.getState());
  return value ? `${value.kind}~{impersonate.user}` : '';
};

export const checkAccess = (
  resourceAttributes: AccessReviewResourceAttributes,
  impersonate?,
): Promise<SelfSubjectAccessReviewKind> => {
  // Destructure the attributes with defaults so we can create a stable cache key.
  const {
    group = '',
    resource = '',
    subresource = '',
    verb = '' as K8sVerb,
    name = '',
    namespace = '',
  } = resourceAttributes || {};
  return checkAccessInternal(
    group,
    resource,
    subresource,
    verb,
    name,
    namespace,
    getImpersonateKey(impersonate),
  );
};

export const useAccessReview2 = (
  resourceAttributes: AccessReviewResourceAttributes,
  impersonate?,
): [boolean, boolean] => {
  const [loading, setLoading] = useSafetyFirst(true);
  const [isAllowed, setAllowed] = useSafetyFirst(false);
  // Destructure the attributes to pass them as dependencies to `useEffect`,
  // which doesn't do deep comparison of object dependencies.
  const {
    group = '',
    resource = '',
    subresource = '',
    verb = '' as K8sVerb,
    name = '',
    namespace = '',
  } = resourceAttributes;
  const impersonateKey = getImpersonateKey(impersonate);
  React.useEffect(() => {
    checkAccessInternal(group, resource, subresource, verb, name, namespace, impersonateKey)
      .then((result: SelfSubjectAccessReviewKind) => {
        setAllowed(result.status.allowed);
        setLoading(false);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('SelfSubjectAccessReview failed', e);
        // Default to enabling the action if the access review fails so that we
        // don't incorrectly block users from actions they can perform. The server
        // still enforces access control.
        setAllowed(true);
        setLoading(false);
      });
  }, [setLoading, setAllowed, group, resource, subresource, verb, name, namespace, impersonateKey]);

  return [isAllowed, loading];
};

export const useAccessReview = (
  resourceAttributes: AccessReviewResourceAttributes,
  impersonate?,
): boolean => useAccessReview2(resourceAttributes, impersonate)[0];
