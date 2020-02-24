import { hot } from 'react-hot-loader/root';
import React from 'react';
// import { Provider } from 'react-redux';
// import { ConnectedRouter } from 'connected-react-router';
// import AppContainer from 'containers/AppContainer';
// import store, { history } from 'store/index.js';
import App from 'components/App';

class Root extends React.Component {
  render() {
    return <App/>;
    // return (
    // <Provider store={store}>
    //   <ConnectedRouter history={history}>
    // <AppContainer/>
    //   </ConnectedRouter>
    // </Provider>
    // );
  }
}

export default hot(Root);
