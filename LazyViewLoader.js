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
      this.setState({ C });
    }, res => {
      console.log('err', res);
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
    let { C } = this.state;
    if (!C) {
      return this.props.LoadingView || <div>Loading...</div>;
    } else {
      let { loader, ...props } = this.props;
      return <C {...props}/>
    }
  }
}

export default ViewLoader;
