import React, { PureComponent } from 'react'
import { Router } from 'react-router'
import { LOCATION_CHANGE } from '../history'

class ConnectedRouter extends PureComponent {

  handleLocationChange = location => {
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
    return <Router {...this.props} />
  }
}

export default ConnectedRouter
