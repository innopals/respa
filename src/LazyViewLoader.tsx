import { Component, ComponentType, ComponentClass, StatelessComponent } from 'react';

export type ComponentLoader = () => Promise<ComponentType>;
export type LazyViewLoaderProps = {
  loader: ComponentLoader,
  LoadingView?: ComponentType,
  ErrorView?: ComponentType,
  [index: string]: any
};
export type LazyViewLoaderState = {
  C?: ComponentType | null,
  error?: any
};

class ViewLoader extends Component<LazyViewLoaderProps, LazyViewLoaderState> {
  constructor(props: LazyViewLoaderProps) {
    super(props);
    this.state = {};
  }
  loadComponent(loader: ComponentLoader) {
    loader().then((C: any) => {
      this.setState({ C: C.default || C, error: null });
    }, e => {
      // console.log('err', res);
      this.setState({ C: null, error: e });
    });
  }
  componentWillMount() {
    this.loadComponent(this.props.loader);
  }
  componentWillReceiveProps(nextProps: LazyViewLoaderProps) {
    if (this.props.loader !== nextProps.loader) {
      this.setState({ C: null });
      this.loadComponent(nextProps.loader);
    }
  }
  render(): ComponentClass<{}> | StatelessComponent<{}> | JSX.Element {
    let { C, error } = this.state;
    let { loader, LoadingView, ErrorView, ...props } = this.props;
    if (!C) {
      return error ? (ErrorView || <div>Unable to load this page.</div>) : (LoadingView || <div>Loading...</div >);
    } else {
      return <C {...props} />
    }
  }
}

export default ViewLoader;
