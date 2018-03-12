import { createBrowserHistory, History } from 'history';
declare const __CONTEXT_PATH__: string;

export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
export default <History>createBrowserHistory({ basename: __CONTEXT_PATH__ });
