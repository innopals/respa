import { Route, Switch, Redirect } from 'react-router';
import { LazyViewLoader as ViewLoader } from 'respa';
import PageNotFound from './NotFound';

import DefaultLayout from 'WEBROOT/layouts/Default';
import Header from 'WEBROOT/views/shared/Header';
import Footer from 'WEBROOT/views/shared/Footer';

require('../base.less');

const HomeViewLoader = () => import("./Home");
export default function App(props) {
  return (
    <DefaultLayout
      Header={<Header />}
      Footer={<Footer />}
      Main={
        <Switch location={props.routing.location}>
          <Route path='/' exact><Redirect to="/home" /></Route>
          <Route path="/home" exact>
            <ViewLoader loader={HomeViewLoader} {...props} />
          </Route>
          <PageNotFound />
        </Switch>
      }
    />
  );
}
