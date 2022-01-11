import * as React from 'react';
import { HourglassHalfIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import GenericStatus from './GenericStatus';
import { YellowExclamationTriangleIcon } from './icons';
import { StatusComponentProps } from './types';

export {
  ErrorStatus,
  InfoStatus,
  ProgressStatus,
  SuccessStatus,
} from '@console/dynamic-plugin-sdk/src/app/components/status/statuses';

export const PendingStatus: React.FC<StatusComponentProps> = (props) => {
  const { t } = useTranslation();
  return (
    <GenericStatus
      {...props}
      Icon={HourglassHalfIcon}
      title={props.title || t('console-shared~Pending')}
    />
  );
};
PendingStatus.displayName = 'PendingStatus';

export const WarningStatus: React.FC<StatusComponentProps> = (props) => {
  const { t } = useTranslation();
  return (
    <GenericStatus
      {...props}
      Icon={YellowExclamationTriangleIcon}
      title={props.title || t('console-shared~Warning')}
    />
  );
};
WarningStatus.displayName = 'WarningStatus';
