import React, { Component } from 'react';
import {subscribeToLog} from './api/logbackend';
import './App.css';

function numberStr(num, length) {  
    return (Array(length).join(' ') + num).slice(-length);  
}

class Log extends Component {  
    render = function() {
      return (
        <div className="Log">
            <span>{ numberStr(this.props.index, 4) +':'+ this.props.text}</span>
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
            if (err) {
                console.log(err);
                return;
            }
            if (!this.isLog(log)) {
                return;
            }
            let index = this.state.data.length + 1;
            if (10000 < index) {
                log.Key = 1
                this.setState({data: [log]})
                return
            }
            log.Key = index
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
    scrollToBottom = () => {
        this.el.scrollIntoView({ behavior: "smooth" });
    }
    componentDidMount() {
        this.scrollToBottom();
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
    render = function() {
      var loglistFunc = this.props.data.map(function(log) {
        return (
          <Log text={log.Text} key={log.Key} index={log.Key}/>
        );
      });
      return (
        <div>
        <div className="logList" >
          {loglistFunc}
        </div>
        <div ref={el => {this.el = el;}}/>
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
