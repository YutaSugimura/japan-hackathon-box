import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import App from './App';
import UserTop from './Components/UserTop';
import InputPage from './Components/Input';
import Request from './Components/Request';

const Root = () => (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/UserTop" component={UserTop} />
      <Route path="/Input" component={InputPage} />
      <Route path="/request" component={Request} />
    </div>
  </BrowserRouter>
);
ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
