import { Map as ImmutableMap } from 'immutable';

type Request<R> = {
  active: boolean;
  timeout: NodeJS.Timer;
  inFlight: boolean;
  data: R;
  error: any;
};

export type RequestMap<R> = ImmutableMap<string, Request<R>>;

export type DashboardsState = ImmutableMap<string, RequestMap<any>>;
