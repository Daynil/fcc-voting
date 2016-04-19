import * as React from 'react';
import { Link } from 'react-router';
import * as _ from 'lodash';

class Wrapper extends React.Component<any, any> {
	
	render() {
		return (
			<div id="wrapper">
				<div id="header">
					<h1>FCC Voting App</h1>
					<div id="menu">
						<Link to={'/new-poll'}><div className="button">New Poll</div></Link>
						<Link to={'/log-in'}><div className="button">Log In</div></Link>
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
	render() {
		return (
			<div>
				New Poll!!
			</div>
		);
	}
}

class Login extends React.Component<any, any> {
	render() {
		return (
			<div>
				Log in here!!
			</div>
		);
	}
}

export { Wrapper, PollContainer, NewPoll, Login };