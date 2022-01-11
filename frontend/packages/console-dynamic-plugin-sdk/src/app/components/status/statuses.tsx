import * as React from 'react';
import { InProgressIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import GenericStatus from './GenericStatus';
import { RedExclamationCircleIcon, GreenCheckCircleIcon, BlueInfoCircleIcon } from './icons';
import { StatusComponentProps } from './types';

export const ErrorStatus: React.FC<StatusComponentProps> = (props) => {
  const { t } = useTranslation();
  return (
    <GenericStatus
      {...props}
      Icon={RedExclamationCircleIcon}
      title={props.title || t('console-shared~Error')}
    />
  );
};

export const InfoStatus: React.FC<StatusComponentProps> = (props) => {
  const { t } = useTranslation();
  return (
    <GenericStatus
      {...props}
      Icon={BlueInfoCircleIcon}
      title={props.title || t('console-shared~Information')}
    />
  );
};

export const ProgressStatus: React.FC<StatusComponentProps> = (props) => {
  const { t } = useTranslation();
  return (
    <GenericStatus
      {...props}
      Icon={InProgressIcon}
      title={props.title || t('console-shared~In progress')}
    />
  );
};

export const SuccessStatus: React.FC<StatusComponentProps> = (props) => {
  const { t } = useTranslation();
  return (
    <GenericStatus
      {...props}
      Icon={GreenCheckCircleIcon}
      title={props.title || t('console-shared~Healthy')}
    />
  );
};
