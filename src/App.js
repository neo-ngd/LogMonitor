import React, { Component } from 'react';
import {subscribeToLog} from './api/logbackend';

class Log extends Component {  
    render = function() {
      return (
        <div>
            <span>{ this.props.index +':'+ this.props.text}</span>
        </div>
      );
    }
  }
  
class LogBox extends Component {
    isLog(log) {
        return true;
    }
    constructor(props) {
        super(props)
        subscribeToLog((log, err) => {
            console.log(log)
            if (err) {
                console.log(err);
                return;
            }
            if (!this.isLog(log)) {
                return;
            }
            console.log(this.state.data.length)
            log.Key = this.state.data.length + 1;
            let newdata = this.state.data.concat(log);
            this.setState({data: newdata});
        })
    }
    componentWillMount () {
        this.setState({data: []});
    }
    componentDidMount = function() {

    }
    render = function() {
      return (
        <div className="logBox">
          <h1>Logs</h1>
          <LogList data={this.state.data} />
        </div>
      );
    }
  }
  
class LogList extends Component {
    render = function() {
      var loglistFunc = this.props.data.map(function(log) {
        return (
          <Log text={log.Text} key={log.Key} index={log.Key}/>
        );
      });
      return (
        <div className="logList">
          {loglistFunc}
        </div>
      );
    }
  }

class App extends Component {
  render() {
    return (
        <LogBox url="http://localhost:3001/api/logs" pollInterval={1000} />
    );
  }
}

export default App;
