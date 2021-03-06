import * as React from 'react';
import { Link } from 'react-router';
import * as _ from 'lodash';
import * as axios from 'axios';

class Wrapper extends React.Component<any, any> {
	
	constructor() {
		super();
		this.state = {
			loggedIn: false,
			userID: null,
			polls: [],
			selectedPoll: null
		}
	}
	
	componentWillMount() {
		this.checkLoggedState();
		for (let i = 0; i < 10; i++) {
			this.state.polls.push({
				name: _.random(100, 999)
			});
		}
		this.refreshState();
	}
	
	refreshState() {
		this.setState({
			loggedIn: this.state.loggedIn, 
			userID: this.state.userID,
			polls: this.state.polls, 
			selectedPoll: this.state.selectedPoll
		});
	}
	
	isLoggedIn() {
		return axios.get('/auth/checkCreds');
	}
	
	pollClick(e, pollClicked) {
		this.state.selectedPoll = pollClicked;
		this.refreshState();
	}
	
	checkLoggedState() {
		let comp = this;
		this.isLoggedIn().then((res: any) => {
			let isLoggedIn = res.data.isAuthenticated;
			if (isLoggedIn) {
				this.state.loggedIn = true;
				this.state.userID = res.data.userID;
				console.log(res.data.userID);
			}
			else {
				this.state.loggedIn = false;
				this.state.userID = null;
			}
			comp.refreshState();
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
		this.isLoggedIn().then(res => {
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
					{React.cloneElement(
						this.props.children, 
						{ 
							state: this.state, 
							pollClick: (e, pollClicked) => this.pollClick(e, pollClicked)
						}
					)}
				</div>
			</div>
		);
	}
}

class PollContainer extends React.Component<any, any> {
	
	componentWillMount() {
		console.log(this.props);
	}
	
	render() {
		let details;
		if (this.props.state.selectedPoll === null) details = null;
		else details = (
			<PollDetails
				poll={this.props.state.selectedPoll} />
		);
		return (
			<div id="poll-wrapper">
				<PollsList
					polls={this.props.state.polls}
					selectedPoll={this.props.state.selectedPoll}
					pollClick={(e, pollClicked) => this.props.pollClick(e, pollClicked)} />
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
	
	questionRef;
	choicesRef;
	
	createPoll() {
		console.log(this.props);
		//this.newPoll.creator ;
	}
	
	render() {
		return (
			<div id="new-poll">
				<h1>Create a new poll!</h1>
				<p>Question: </p>
				<input id="new-question" type="text" ref={(ref) => this.questionRef = ref}></input>
				<p>Choices (comma separated): </p>
				<input id="new-choices" type="text" ref={(ref) => this.choicesRef = ref}></input><br/>
				<div className="button" onClick={this.createPoll}>Create</div>
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