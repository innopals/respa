import createBrowserHistory from 'history/createBrowserHistory';

export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
export default createBrowserHistory({ basename: __CONTEXT_PATH__ });
