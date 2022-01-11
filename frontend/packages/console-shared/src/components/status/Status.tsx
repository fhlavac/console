import * as React from 'react';
import { Status } from '@console/dynamic-plugin-sdk/src/app/components/status/Status';

export { Status } from '@console/dynamic-plugin-sdk/src/app/components/status/Status';

export const StatusIcon: React.FC<StatusIconProps> = ({ status }) => (
  <Status status={status} iconOnly />
);

type StatusIconProps = {
  status: string;
};
