// layouts
import DefaultLayout from 'WEBROOT/layouts/Default';
import RightHeavyTwoColumnsLayout from 'WEBROOT/layouts/RightHeavyTwoColumns';
// page parts
import Welcome from './Welcome';
import LeftMenu from './LeftMenu';
import Header from '../shared/Header';
import Footer from '../shared/Footer';

// components
import NameForm from 'WEBROOT/components/NameForm';
// actions
import setName from 'ACTIONS/home/setName';
import getIp from 'ACTIONS/home/getIp';
import getAddressInfo from 'ACTIONS/home/getAddressInfo';

// action chaining..
getIp().then(({ ip }) => getAddressInfo(ip));

function HomeMain({ name, ip, loading, error, addressInfo }) {
  if (loading) return <img src={IMG_LOADING} />;
  return (
    <div>
      <Welcome {...{ name, ip, error }} />
      <div>
        <NameForm onChange={v => setName(v)} value={name} label="What's your name please? " />
      </div>
      <h3>Your address Detail</h3>
      <pre>{addressInfo ? JSON.stringify(addressInfo, null, 2) : 'loading...'}</pre>
    </div>
  );
}

export default ({ home }) => {
  return (
    <RightHeavyTwoColumnsLayout
      LeftMenu={<LeftMenu />}
      Main={<HomeMain {...home} />}
      minHeight={400}
    />
  );
};
