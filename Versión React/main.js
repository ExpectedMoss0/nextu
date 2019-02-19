import React from 'react';
import ReactDOM from 'react-dom';
//import { render } from 'react-dom';
//import { Router, Route } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './login.jsx';
import Panel from './panel.jsx';
import Shoppingcart from './shoppingcart.jsx';
//import createBrowserHistory from 'history/createBrowserHistory'
//const browserHistory= createBrowserHistory();

import firebase from 'firebase';

// Initialize Firebase
const config = {
	apiKey: "AIzaSyCYnGm64TUmcyrB_1MTI3zKCZiZS6bol0c",
	authDomain: "hello-world-test-174703.firebaseapp.com",
	databaseURL: "https://hello-world-test-174703.firebaseio.com",
	projectId: "hello-world-test-174703",
	storageBucket: "hello-world-test-174703.appspot.com",
	messagingSenderId: "174769079404"
};
firebase.initializeApp(config);

//ReactDOM.render(<Componente1 />, document.getElementById('app'));

ReactDOM.render(
	<Router>
		<div>
			<Route exact path="/" component={Login} />
			<Route path="/panel" component={Panel} />
			<Route path="/shoppingcart" component={Shoppingcart} />
		</div>
	</Router>,
	document.getElementById('app')
)