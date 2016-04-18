import * as React from 'react';
import * as _ from 'lodash';

class App extends React.Component<any, any> {
	
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
			<div id="wrapper">
				<h1>FCC Voting App</h1>
				<div id="poll-wrapper">
					<PollsList
						polls={this.state.polls}
						selectedPoll={this.state.selectedPoll}
						pollClick={(e, pollClicked) => this.pollClick(e, pollClicked)} />
					{details}
				</div>
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
				<div 
					className={this.getPollClass(poll)}
					key={index}
					onClick={(e) => this.props.pollClick(e, poll)}>
					{poll.name}
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

export default App;