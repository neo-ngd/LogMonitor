import React, { Component } from 'react';
import './App.css';
import api from './api/api';
import ScrollArea from 'react-scrollbar';
import {Combobox} from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

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
            {`${index}:[${this.props.name}] ${this.props.text}`}
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
    if (this.state.tags.every(ele => ele !== log.Name)) {
      let tags = this.state.tags;
      tags.push(log.Name);
      this.setState({tags: tags});
    }
    if (this.state.tag !== "all" && log.Name !== this.state.tag) 
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
        <div className="header">
          <h1 className="title">Log Monitor</h1>
          <div>
            <Combobox
              defaultValue = {"all"}
              data={this.state.tags}
              onChange={value => {
                this.setState({data: [], tag: value});
                api.Regist(value, this.logHandler);
              }}
            />
          </div>
        </div>
        <LogList data={this.state.data} />
        
      </div>
    );
  }
}
  
class LogList extends Component {
  constructor(props) {
    super(props);
    this.state = ({autoScroll: true});
  }
  componentDidUpdate() {
    if (this.state.autoScroll)
      this.scrollArea.scrollBottom();
  }
  onscroll = event => {
    if (!this.state.autoScroll) {
      if (event.topPosition === event.realHeight - event.containerHeight) {
        this.setState({autoScroll: true});
      }
    }
    if (this.state.autoScroll) {
      if (event.topPosition < event.realHeight - event.containerHeight) {
        this.setState({autoScroll: false});
      }
    }
  }
  render = function() {
    var loglistFunc = this.props.data.map(function(log) {
      return (
        <Log text={log.Text} name={log.Name} key={log.Key} index={log.Key}/>
      );
    });
    return (
      <ScrollArea
        ref = {r => this.scrollArea = r}
        speed={0.8}
        className="scrollarea"
        contentClassName="loglist"
        horizontal={false}
        verticalScrollbarStyle={{
          "width": "8px",
          "height": "20px",
          "background": "white",
          "marginLeft": "0px",
        }}
        onScroll = {this.onscroll}
      >
        {loglistFunc}
      </ScrollArea>
    );
  }
}

class App extends Component {
  render() {
    return (
        <LogBox />
    );
  }
}

export default App;
