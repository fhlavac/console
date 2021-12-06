import { ALL_NAMESPACES_KEY } from '@console/shared/src/constants';

export const legalNamePattern = /[a-z0-9](?:[-a-z0-9]*[a-z0-9])?/;

const basePathPattern = new RegExp(`^/?${window.SERVER_FLAGS.basePath}`);

export const stripBasePath = (path: string): string => path.replace(basePathPattern, '/');

export const getNamespace = (path: string): string => {
  const newPath = stripBasePath(path); // !!!: renamed to newPath
  const split = newPath.split('/').filter((x) => x);

  if (split[1] === 'all-namespaces') {
    return ALL_NAMESPACES_KEY;
  }

  let ns: string;
  if (split[1] === 'cluster' && ['namespaces', 'projects'].includes(split[2]) && split[3]) {
    // eslint-disable-next-line prefer-destructuring
    ns = split[3];
  } else if (split[1] === 'ns' && split[2]) {
    // eslint-disable-next-line prefer-destructuring
    ns = split[2];
  } else {
    // eslint-disable-next-line consistent-return
    return;
  }

  const match = ns.match(legalNamePattern);
  return match && match.length > 0 && match[0];
};
