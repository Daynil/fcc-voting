import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Wrapper, PollContainer, NewPoll, Login } from './App';
require('./styles');

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={Wrapper}>
			<Route path="new-poll" component={NewPoll} />
			<Route path="log-in" component={Login} />
			<IndexRoute component={PollContainer} />
		</Route> 
	</Router>, 
	document.getElementById('app')
);
