import React, { PureComponent } from 'react';
import { Router } from 'react-router';
import { LOCATION_CHANGE } from '../history';
import { History, Location } from 'history';

export type ConnectedRouterProps = {
  store?: any,
  history: History,
};

class ConnectedRouter extends PureComponent<ConnectedRouterProps> {

  store: any;
  unsubscribeFromHistory: any;

  handleLocationChange = (location: Location) => {
    this.store.dispatch({
      type: LOCATION_CHANGE,
      payload: location
    });
  }

  componentWillMount() {
    const { store: propsStore, history } = this.props
    this.store = propsStore || this.context.store
    this.unsubscribeFromHistory = history.listen(this.handleLocationChange)
    this.handleLocationChange(history.location)
  }

  componentWillUnmount() {
    if (this.unsubscribeFromHistory) this.unsubscribeFromHistory()
  }

  render() {
    console.log(this.props.children);
    return <Router {...this.props} />
  }
}

export default ConnectedRouter;

