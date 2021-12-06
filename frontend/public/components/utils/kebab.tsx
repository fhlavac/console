import * as _ from 'lodash-es';
import * as React from 'react';
import * as classNames from 'classnames';
/* eslint-disable import/named */
import { withTranslation, WithTranslation } from 'react-i18next';
import i18next, { TFunction } from 'i18next';
import { FocusTrap } from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { subscribeToExtensions } from '@console/plugin-sdk/src/api/pluginSubscriptionService';
import { KebabActions, isKebabActions } from '@console/plugin-sdk/src/typings/kebab-actions';
import Popper from '@console/shared/src/components/popper/Popper';
import {
  annotationsModal,
  configureReplicaCountModal,
  taintsModal,
  tolerationsModal,
  labelsModal,
  podSelectorModal,
  deleteModal,
  expandPVCModal,
  clonePVCModal,
  restorePVCModal,
} from '../modals';
import { asAccessReview, checkAccess, history, resourceObjPath } from './index';
import {
  K8sKind,
  K8sResourceKind,
  K8sResourceKindReference,
  referenceForModel,
  VolumeSnapshotKind,
} from '../../module/k8s';
import { connectToModel } from '../../kinds';
import {
  BuildConfigModel,
  DeploymentConfigModel,
  DeploymentModel,
  VolumeSnapshotModel,
} from '../../models';
import {
  KebabOption,
  KebabMenuItems,
  kebabOptionsToMenu,
} from '@console/dynamic-plugin-sdk/src/app/components/utils/kebab';

export {
  kebabOptionsToMenu,
  isKebabSubMenu,
  KebabItem,
  KebabMenuItems,
  KebabItems,
  KebabOption,
  KebabMenuOption,
  KebabItemsProps,
} from '@console/dynamic-plugin-sdk/src/app/components/utils/kebab';

const kebabFactory: KebabFactory = {
  Delete: (kind, obj) => ({
    // t('public~Delete {{kind}}', {kind: kind.label})
    labelKey: 'public~Delete {{kind}}',
    labelKind: { kind: kind.labelKey ? i18next.t(kind.labelKey) : kind.label },
    callback: () =>
      deleteModal({
        kind,
        resource: obj,
      }),
    accessReview: asAccessReview(kind, obj, 'delete'),
  }),
  Edit: (kind, obj) => {
    let href: string;
    switch (kind.kind) {
      case BuildConfigModel.kind:
        href = `${resourceObjPath(obj, kind.crd ? referenceForModel(kind) : kind.kind)}/form`;
        break;
      case DeploymentModel.kind:
      case DeploymentConfigModel.kind:
        href = `/edit-deployment/ns/${obj.metadata.namespace}?name=${obj.metadata.name}&kind=${kind.kind}`;
        break;
      default:
        href = `${resourceObjPath(obj, kind.crd ? referenceForModel(kind) : kind.kind)}/yaml`;
    }
    return {
      // t('public~Edit {{kind}}', {kind: kind.label})
      labelKey: 'public~Edit {{kind}}',
      labelKind: { kind: kind.labelKey ? i18next.t(kind.labelKey) : kind.label },
      dataTest: `Edit ${kind.label}`,
      href,
      // TODO: Fallback to "View YAML"? We might want a similar fallback for annotations, labels, etc.
      accessReview: asAccessReview(kind, obj, 'update'),
    };
  },
  ModifyLabels: (kind, obj) => ({
    // t('public~Edit labels')
    labelKey: 'public~Edit labels',
    callback: () =>
      labelsModal({
        kind,
        resource: obj,
        blocking: true,
      }),
    accessReview: asAccessReview(kind, obj, 'patch'),
  }),
  ModifyPodSelector: (kind, obj) => ({
    // t('public~Edit Pod selector')
    labelKey: 'public~Edit Pod selector',
    callback: () =>
      podSelectorModal({
        kind,
        resource: obj,
        blocking: true,
      }),
    accessReview: asAccessReview(kind, obj, 'patch'),
  }),
  ModifyAnnotations: (kind, obj) => ({
    // t('public~Edit annotations')
    labelKey: 'public~Edit annotations',
    callback: () =>
      annotationsModal({
        kind,
        resource: obj,
        blocking: true,
      }),
    accessReview: asAccessReview(kind, obj, 'patch'),
  }),
  ModifyCount: (kind, obj) => ({
    // t('public~Edit Pod count')
    labelKey: 'public~Edit Pod count',
    callback: () =>
      configureReplicaCountModal({
        resourceKind: kind,
        resource: obj,
      }),
    accessReview: asAccessReview(kind, obj, 'patch', 'scale'),
  }),
  ModifyTaints: (kind, obj) => ({
    // t('public~Edit taints')
    labelKey: 'public~Edit taints',
    callback: () =>
      taintsModal({
        resourceKind: kind,
        resource: obj,
        modalClassName: 'modal-lg',
      }),
    accessReview: asAccessReview(kind, obj, 'patch'),
  }),
  ModifyTolerations: (kind, obj) => ({
    // t('public~Edit tolerations')
    labelKey: 'public~Edit tolerations',
    callback: () =>
      tolerationsModal({
        resourceKind: kind,
        resource: obj,
        modalClassName: 'modal-lg',
      }),
    accessReview: asAccessReview(kind, obj, 'patch'),
  }),
  AddStorage: (kind, obj) => ({
    // t('public~Add storage')
    labelKey: 'public~Add storage',
    href: `${resourceObjPath(obj, kind.crd ? referenceForModel(kind) : kind.kind)}/attach-storage`,
    accessReview: asAccessReview(kind, obj, 'patch'),
  }),
  ExpandPVC: (kind, obj) => ({
    // t('public~Expand PVC')
    labelKey: 'public~Expand PVC',
    callback: () =>
      expandPVCModal({
        kind,
        resource: obj,
      }),
    accessReview: asAccessReview(kind, obj, 'patch'),
  }),
  PVCSnapshot: (kind, obj) => ({
    // t('public~Create snapshot')
    labelKey: 'public~Create snapshot',
    isDisabled: obj?.status?.phase !== 'Bound',
    tooltip: obj?.status?.phase !== 'Bound' ? 'PVC is not Bound' : '',
    href: `/k8s/ns/${obj.metadata.namespace}/${VolumeSnapshotModel.plural}/~new/form?pvc=${obj.metadata.name}`,
    accessReview: asAccessReview(kind, obj, 'create'),
  }),
  ClonePVC: (kind, obj) => ({
    // t('public~Clone PVC')
    labelKey: 'public~Clone PVC',
    isDisabled: obj?.status?.phase !== 'Bound',
    tooltip: obj?.status?.phase !== 'Bound' ? 'PVC is not Bound' : '',
    callback: () =>
      clonePVCModal({
        kind,
        resource: obj,
      }),
    accessReview: asAccessReview(kind, obj, 'create'),
  }),
  RestorePVC: (kind, obj: VolumeSnapshotKind) => ({
    // t('public~Restore as new PVC')
    labelKey: 'public~Restore as new PVC',
    isDisabled: !obj?.status?.readyToUse,
    tooltip: !obj?.status?.readyToUse ? 'Volume Snapshot is not Ready' : '',
    callback: () =>
      restorePVCModal({
        kind,
        resource: obj,
      }),
    accessReview: asAccessReview(kind, obj, 'create'),
  }),
};

// The common menu actions that most resource share
kebabFactory.common = [
  kebabFactory.ModifyLabels,
  kebabFactory.ModifyAnnotations,
  kebabFactory.Edit,
  kebabFactory.Delete,
];

let kebabActionExtensions: KebabActions[] = [];

subscribeToExtensions<KebabActions>((extensions) => {
  kebabActionExtensions = extensions;
}, isKebabActions);

export const getExtensionsKebabActionsForKind = (kind: K8sKind) => {
  const actionsForKind: KebabAction[] = [];
  kebabActionExtensions.forEach((e) => {
    e.properties.getKebabActionsForKind(kind).forEach((kebabAction) => {
      actionsForKind.push(kebabAction);
    });
  });
  return actionsForKind;
};

export const ResourceKebab = connectToModel((props: ResourceKebabProps) => {
  const { actions, kindObj, resource, isDisabled, customData } = props;

  if (!kindObj) {
    return null;
  }
  const options = _.reject(
    actions.map((a) => a(kindObj, resource, null, customData)),
    'hidden',
  );
  return (
    <Kebab
      options={options}
      key={resource.metadata.uid}
      isDisabled={
        isDisabled !== undefined ? isDisabled : _.get(resource.metadata, 'deletionTimestamp')
      }
    />
  );
});

class KebabWithTranslation extends React.Component<
  KebabProps & WithTranslation,
  { active: boolean }
> {
  static factory: KebabFactory = kebabFactory;

  // public static columnClass: string = 'pf-c-table__action';
  public static columnClass: string = 'dropdown-kebab-pf pf-c-table__action';

  private dropdownElement = React.createRef<HTMLButtonElement>();

  private divElement = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  onClick = (event, option: KebabOption) => {
    event.preventDefault();

    if (option.callback) {
      option.callback();
    }

    this.hide();

    if (option.href) {
      history.push(option.href);
    }
  };

  hide = () => {
    this.dropdownElement.current && this.dropdownElement.current.focus();
    this.setState({ active: false });
  };

  toggle = () => {
    this.setState((state) => ({ active: !state.active }));
  };

  onHover = () => {
    // Check access when hovering over a kebab to minimize flicker when opened.
    // This depends on `checkAccess` being memoized.
    _.each(this.props.options, (option: KebabOption) => {
      if (option.accessReview) {
        checkAccess(option.accessReview);
      }
    });
  };

  handleRequestClose = (e?: MouseEvent) => {
    if (
      !e ||
      !this.dropdownElement.current ||
      !this.dropdownElement.current.contains(e.target as Node)
    ) {
      this.hide();
    }
  };

  getPopperReference = () => this.dropdownElement.current;

  getDivReference = () => this.divElement.current;

  render() {
    const { options, isDisabled, t } = this.props;

    const menuOptions = kebabOptionsToMenu(options);

    return (
      <div
        className={classNames({
          'pf-c-dropdown': true,
          'pf-m-expanded': this.state.active,
        })}
      >
        <button
          ref={this.dropdownElement}
          type="button"
          aria-expanded={this.state.active}
          aria-haspopup="true"
          aria-label={t('public~Actions')}
          className="pf-c-dropdown__toggle pf-m-plain"
          data-test-id="kebab-button"
          disabled={isDisabled}
          onClick={this.toggle}
          onFocus={this.onHover}
          onMouseEnter={this.onHover}
        >
          <EllipsisVIcon />
        </button>
        <Popper
          open={!isDisabled && this.state.active}
          placement="bottom-end"
          closeOnEsc
          closeOnOutsideClick
          onRequestClose={this.handleRequestClose}
          reference={this.getPopperReference}
        >
          <FocusTrap
            focusTrapOptions={{
              clickOutsideDeactivates: true,
              returnFocusOnDeactivate: false,
              fallbackFocus: this.getDivReference, // fallback to popover content wrapper div if there are no tabbable elements
            }}
          >
            <div ref={this.divElement} className="pf-c-dropdown pf-m-expanded" tabIndex={-1}>
              <KebabMenuItems
                options={menuOptions}
                onClick={this.onClick}
                className="oc-kebab__popper-items"
                focusItem={menuOptions[0]}
              />
            </div>
          </FocusTrap>
        </Popper>
      </div>
    );
  }
}

function restoreStaticProperties(Kebab) {
  Kebab.factory = KebabWithTranslation.factory;
  Kebab.getExtensionsActionsForKind = getExtensionsKebabActionsForKind;
  Kebab.columnClass = KebabWithTranslation.columnClass;
  return Kebab;
}

export const Kebab = restoreStaticProperties(withTranslation()(KebabWithTranslation));

export type KebabAction = (
  kind: K8sKind,
  obj: K8sResourceKind,
  resources?: any,
  customData?: any,
) => KebabOption;

export type ResourceKebabProps = {
  kindObj: K8sKind;
  actions: KebabAction[];
  kind: K8sResourceKindReference;
  resource: K8sResourceKind;
  isDisabled?: boolean;
  customData?: { [key: string]: any };
};

type KebabProps = {
  factory: any;
  t: TFunction;
  options: KebabOption[];
  isDisabled?: boolean;
  columnClass?: string;
};

export type KebabFactory = { [name: string]: KebabAction } & { common?: KebabAction[] };

ResourceKebab.displayName = 'ResourceKebab';
