import * as React from 'react';
import { Link } from 'react-router';
import * as _ from 'lodash';
import * as axios from 'axios';

function isLoggedIn() {
	return axios.get('/auth/checkCreds');
}

class Wrapper extends React.Component<any, any> {
	
	constructor() {
		super();
		this.state = {
			loggedIn: false
		}
	}
	
	componentWillMount() {
		this.checkLoggedState();
	}
	
	checkLoggedState() {
		isLoggedIn().then(res => {
			let isLoggedIn = res.data;
			if (isLoggedIn) this.setState({loggedIn: true});
			else this.setState({loggedIn: false});
		});
	}
	
	login() {
		let oauthWindow = window.open('http://localhost:3000/auth/github', 'OAuthConnect', 'location=0,status=0,width=800,height=400');
		let oauthInterval = window.setInterval(() => {
			if (oauthWindow.closed) {
				window.clearInterval(oauthInterval);
				this.checkLoggedState();
			}
		}, 1000);
	}
	
	logout() {
		axios.get('/auth/logout').then(res => this.checkLoggedState());
	}
	
	loginText() {
		let loginText = '';
		isLoggedIn().then(res => {
			let loggedIn = res.data;
			if (loggedIn) loginText = 'Log Out';
			else loginText = 'Log In';
		});
	}
	
	getLoginButton() {
		if (this.state.loggedIn) {
			console.log('logged in');
			return <div className="button" onClick={(e) => this.logout()}>Log Out</div>
		}
		else {
			console.log('logged out');
			return <div className="button" onClick={(e) => this.login()}>Log In</div>
		}
	}
	
	render() {
		return (
			<div id="wrapper">
				<div id="header">
					<h1>FCC Voting App</h1>
					<div id="menu">
						<Link to={'/'}><div className="button">Home</div></Link>
						<Link to={'/new-poll'}><div className="button">New Poll</div></Link>
						{this.getLoginButton()}
					</div>
				</div>
				<div>
					{this.props.children}
				</div>
			</div>
		);
	}
}

class PollContainer extends React.Component<any, any> {
	
	constructor() {
		super();
		this.state = {
			polls: [],
			selectedPoll: null
		}
	}
	
	componentWillMount() {
		for (let i = 0; i < 10; i++) {
			this.state.polls.push({
				name: _.random(100, 999)
			});
		}
		this.refreshState();
	}
	
	refreshState() {
		this.setState({polls: this.state.polls, selectedPoll: this.state.selectedPoll});
	}
	
	pollClick(e, pollClicked) {
		this.state.selectedPoll = pollClicked;
		this.refreshState();
	}
	
	render() {
		let details;
		if (this.state.selectedPoll === null) details = null;
		else details = (
			<PollDetails
				poll={this.state.selectedPoll} />
		);
		return (
			<div id="poll-wrapper">
				<PollsList
					polls={this.state.polls}
					selectedPoll={this.state.selectedPoll}
					pollClick={(e, pollClicked) => this.pollClick(e, pollClicked)} />
				{details}
			</div>
		);
	}
}

class PollsList extends React.Component<any, any> {
	
	getListPosition() {
		let listClass = '';
		if (this.props.selectedPoll != null) listClass = 'show-details';
		return listClass;
	}
	
	getPollClass(poll) {
		let pollClass = 'poll';
		if (this.props.selectedPoll == poll) pollClass += ' selected';
		return pollClass;
	}
	
	render() {
		let polls = this.props.polls.map((poll, index) => {
			return (
				<div>
					<div 
						className={this.getPollClass(poll)}
						key={index}
						onClick={(e) => this.props.pollClick(e, poll)}>
						{poll.name}
					</div>
				</div>
			)
		})
		return (
			<div id="poll-list" className={this.getListPosition()}>{polls}</div>
		);
	}
}

class PollDetails extends React.Component<any, any> {
	render() {
		return (
			<div className="poll-details">
				{this.props.poll.name}
			</div>
		);
	}
}

class NewPoll extends React.Component<any, any> {
	newPoll: Poll;
	
	render() {
		return (
			<div id="new-poll">
				<h1>Create a new poll!</h1>
				<p>Question: </p>
				<input id="new-question" type="text"></input>
				<p>Choices (comma separated): </p>
				<input id="new-choices" type="text"></input><br/>
				<div className="button">Create</div>
			</div>
		);
	}
}

class AfterAuth extends React.Component<any, any> {
	
	componentWillMount() {
		if (window.opener) window.opener.focus();
		window.close();
	}
	
	render() {
		return (
			<div>
			</div>
		);
	}
}

interface Poll {
	creator: string;
	question: string;
	choices: [{
		text: string;
		votes: number;
	}]
}

export { Wrapper, PollContainer, NewPoll, AfterAuth };