import React, { Component } from 'react';
import {subscribeToLog} from './api/logbackend';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

function numberStr(num, length) {  
    return (Array(length).join(' ') + num).slice(-length);  
}

class Log extends Component { 
    render = function() {
        let logstr = numberStr(this.props.log.Key, 4) + `:[${this.props.log.Name}] ${this.props.log.Text}`
        return (
            <div className="Log">
                <span>{logstr}</span>
            </div>
      );
    }
  }
  
class LogBox extends Component {
    tagFilter(log) {
        let tagfilter = this.props.match.params.name;
        if (tagfilter) {
            if (tagfilter === 'all') {
                return true
            }
            if (0 <= tagfilter.indexOf(log.Name)) {
                return true;
            }
            return false
        }
        return true;
    }
    constructor(props) {
        super(props)
        subscribeToLog((log, err) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!this.tagFilter(log)) {
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
          <Log log={log} key={log.Key}/>
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
            <Router >
                <Switch>
                    <Route path="/:name" component={LogBox}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
