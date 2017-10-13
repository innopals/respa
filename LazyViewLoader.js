import { Component } from 'react';

// TODO use custom loading view & load failed view.
class ViewLoader extends Component {
  constructor() {
    super();
    this.state = {};
  }
  loadComponent(loader) {
    loader().then(C => {
      C = C['default'] || C;
      this.setState({ C, error: null });
    }, res => {
      console.log('err', res);
      this.setState({ C: null, error: res });
    });
  }
  componentWillMount() {
    this.loadComponent(this.props.loader);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.loader !== nextProps.loader) {
      this.setState({ C: null });
      this.loadComponent(nextProps.loader);
    }
  }
  render() {
    let { C, error } = this.state;
    let { loader, LoadingView, ErrorView, ...props } = this.props;
    if (!C) {
      return error ? (ErrorView || <div>Unable to load this page.</div>) : (LoadingView || <div>Loading...</div>);
    } else {
      return <C {...props} />
    }
  }
}

export default ViewLoader;
