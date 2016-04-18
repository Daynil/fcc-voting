import * as React from 'react';
import * as axios from 'axios';

class App extends React.Component<any, any> {
	
	constructor() {
		super();
		this.state = {
			response: ''
		}
	}
	
	componentWillMount() {
		axios.get('/test').then(res => this.setState({response: res.data}));
	}
	
	render() {
		return <div>{this.state.response} lalala</div>
	}
}

export default App;