import { K8sKind } from '../module/k8s';

export const ChargebackReportModel: K8sKind = {
  kind: 'Report',
  label: 'Report',
  // t('public~Report')
  labelKey: 'public~Report',
  labelPlural: 'Reports',
  // t('public~Reports')
  labelPluralKey: 'public~Reports',
  apiGroup: 'metering.openshift.io',
  apiVersion: 'v1',
  crd: true,
  plural: 'reports',
  abbr: 'R',
  namespaced: true,
};

export const ClusterAutoscalerModel: K8sKind = {
  label: 'ClusterAutoscaler',
  // t('public~ClusterAutoscaler')
  labelKey: 'public~ClusterAutoscaler',
  labelPlural: 'ClusterAutoscalers',
  // t('public~ClusterAutoscalers')
  labelPluralKey: 'public~ClusterAutoscalers',
  apiVersion: 'v1',
  apiGroup: 'autoscaling.openshift.io',
  plural: 'clusterautoscalers',
  abbr: 'CA',
  namespaced: false,
  kind: 'ClusterAutoscaler',
  id: 'clusterautoscaler',
  crd: true,
};

export const ClusterServiceClassModel: K8sKind = {
  label: 'ClusterServiceClass',
  // t('public~ClusterServiceClass')
  labelKey: 'public~ClusterServiceClass',
  labelPlural: 'ClusterServiceClasses',
  // t('public~ClusterServiceClasses')
  labelPluralKey: 'public~ClusterServiceClasses',
  apiVersion: 'v1beta1',
  apiGroup: 'servicecatalog.k8s.io',
  plural: 'clusterserviceclasses',
  abbr: 'CSC',
  namespaced: false,
  kind: 'ClusterServiceClass',
  id: 'clusterserviceclass',
  crd: true,
};

export const ConsoleCLIDownloadModel: K8sKind = {
  label: 'ConsoleCLIDownload',
  // t('public~ConsoleCLIDownload')
  labelKey: 'public~ConsoleCLIDownload',
  labelPlural: 'ConsoleCLIDownloads',
  // t('public~ConsoleCLIDownloads')
  labelPluralKey: 'public~ConsoleCLIDownloads',
  apiVersion: 'v1',
  apiGroup: 'console.openshift.io',
  plural: 'consoleclidownloads',
  abbr: 'CCD',
  namespaced: false,
  kind: 'ConsoleCLIDownload',
  id: 'consoleclidownload',
  crd: true,
};

export const ConsoleExternalLogLinkModel: K8sKind = {
  label: 'ConsoleExternalLogLink',
  // t('public~ConsoleExternalLogLink')
  labelKey: 'public~ConsoleExternalLogLink',
  labelPlural: 'ConsoleExternalLogLinks',
  // t('public~ConsoleExternalLogLinks')
  labelPluralKey: 'public~ConsoleExternalLogLinks',
  apiVersion: 'v1',
  apiGroup: 'console.openshift.io',
  plural: 'consoleexternalloglinks',
  abbr: 'CELL',
  namespaced: false,
  kind: 'ConsoleExternalLogLink',
  id: 'consoleexternalloglink',
  crd: true,
};

export const ConsoleLinkModel: K8sKind = {
  label: 'ConsoleLink',
  // t('public~ConsoleLink')
  labelKey: 'public~ConsoleLink',
  labelPlural: 'ConsoleLinks',
  // t('public~ConsoleLinks')
  labelPluralKey: 'public~ConsoleLinks',
  apiVersion: 'v1',
  apiGroup: 'console.openshift.io',
  plural: 'consolelinks',
  abbr: 'CL',
  namespaced: false,
  kind: 'ConsoleLink',
  id: 'consolelink',
  crd: true,
};

export const ConsoleNotificationModel: K8sKind = {
  label: 'ConsoleNotification',
  // t('public~ConsoleNotification')
  labelKey: 'public~ConsoleNotification',
  labelPlural: 'ConsoleNotifications',
  // t('public~ConsoleNotifications')
  labelPluralKey: 'public~ConsoleNotifications',
  apiVersion: 'v1',
  apiGroup: 'console.openshift.io',
  plural: 'consolenotifications',
  abbr: 'CN',
  namespaced: false,
  kind: 'ConsoleNotification',
  id: 'consolenotification',
  crd: true,
};

export const ConsoleYAMLSampleModel: K8sKind = {
  label: 'ConsoleYAMLSample',
  // t('public~ConsoleYAMLSample')
  labelKey: 'public~ConsoleYAMLSample',
  labelPlural: 'ConsoleYAMLSamples',
  // t('public~ConsoleYAMLSamples')
  labelPluralKey: 'public~ConsoleYAMLSamples',
  apiVersion: 'v1',
  apiGroup: 'console.openshift.io',
  plural: 'consoleyamlsamples',
  abbr: 'CYS',
  namespaced: false,
  kind: 'ConsoleYAMLSample',
  id: 'consoleyamlsample',
  crd: true,
};

export const MachineAutoscalerModel: K8sKind = {
  label: 'MachineAutoscaler',
  // t('public~MachineAutoscaler')
  labelKey: 'public~MachineAutoscaler',
  labelPlural: 'MachineAutoscalers',
  // t('public~MachineAutoscalers')
  labelPluralKey: 'public~MachineAutoscalers',
  apiVersion: 'v1beta1',
  apiGroup: 'autoscaling.openshift.io',
  plural: 'machineautoscalers',
  abbr: 'MA',
  namespaced: true,
  kind: 'MachineAutoscaler',
  id: 'machineautoscaler',
  crd: true,
};

export const MachineConfigModel: K8sKind = {
  label: 'MachineConfig',
  // t('public~MachineConfig')
  labelKey: 'public~MachineConfig',
  labelPlural: 'MachineConfigs',
  // t('public~MachineConfigs')
  labelPluralKey: 'public~MachineConfigs',
  apiVersion: 'v1',
  apiGroup: 'machineconfiguration.openshift.io',
  plural: 'machineconfigs',
  abbr: 'MC',
  namespaced: false,
  kind: 'MachineConfig',
  id: 'machineconfigpool',
  crd: true,
};

export const MachineHealthCheckModel: K8sKind = {
  label: 'MachineHealthCheck',
  // t('public~MachineHealthCheck')
  labelKey: 'public~MachineHealthCheck',
  labelPlural: 'MachineHealthChecks',
  // t('public~MachineHealthChecks')
  labelPluralKey: 'public~MachineHealthChecks',
  apiVersion: 'v1beta1',
  apiGroup: 'machine.openshift.io',
  plural: 'machinehealthchecks',
  abbr: 'MHC',
  namespaced: true,
  kind: 'MachineHealthCheck',
  id: 'machinehealthcheck',
  crd: true,
};

// Cluster API resources
// https://github.com/openshift/cluster-api
export const MachineModel: K8sKind = {
  label: 'Machine',
  // t('public~Machine')
  labelKey: 'public~Machine',
  labelPlural: 'Machines',
  // t('public~Machines')
  labelPluralKey: 'public~Machines',
  apiVersion: 'v1beta1',
  apiGroup: 'machine.openshift.io',
  plural: 'machines',
  abbr: 'M',
  namespaced: true,
  kind: 'Machine',
  id: 'machine',
  crd: true,
};

export const PrometheusModel: K8sKind = {
  kind: 'Prometheus',
  label: 'Prometheus',
  // t('public~Prometheus')
  labelKey: 'public~Prometheus',
  labelPlural: 'Prometheuses',
  // t('public~Prometheuses')
  labelPluralKey: 'public~Prometheuses',
  apiGroup: 'monitoring.coreos.com',
  apiVersion: 'v1',
  abbr: 'PI',
  namespaced: true,
  crd: true,
  plural: 'prometheuses',
  propagationPolicy: 'Foreground',
};
