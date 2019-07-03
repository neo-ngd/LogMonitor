import React, { Component } from 'react';
import api from './api/api';

class Log extends Component {
  padding(num, length) {
    for(var len = (num + "").length; len < length; len = num.length) {
        num = "0" + num;            
    }
    return num;
  }
  render() {
    let index = this.padding(this.props.index, 4);
    return (
      <div className="log">
          <p>
            <span>
            {`${index}:[${this.props.key}] ${this.props.text}`}
            </span>
          </p>
      </div>
    );
  }
}
  
class LogBox extends Component {
  logHandler = (log, err) => {
    if (err) {
        console.log(err);
        return;
    }
    if (this.state.tags.every(ele => ele != log.Name)) {
      let tags = this.state.tags;
      tags.push(log.Name);
      this.setState({tags: tags});
    }
    if (this.state.tag != "all" && log.Name != this.state.tag) 
      return;
    let index = this.state.data.length + 1;
    if (10000 < index) {
        log.Key = 1;
        this.setState({data: [log]});
        return;
    }
    log.Key = index;
    let newdata = this.state.data.concat(log);
    this.setState({data: newdata});
  }
  constructor(props) {
      super(props);
      this.state = {data: [], tag: "all", tags: ["all"]};
  }
  componentWillMount() {
  }
  componentDidMount() {
    api.Regist(this.state.tag, this.logHandler);
  }
  render() {
    return (
      <div className="logBox">
        <h1>Log Monitor</h1>
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
