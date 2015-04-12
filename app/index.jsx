var React = require('react');
var Router = require('react-router');

var Arc = require('./d3Chart').Arc;

var fromWebSocket = require('./most-w3msg').fromWebSocket;
var sysmonSocket = new WebSocket('ws://localhost:9980/sysmon');
var stream = fromWebSocket(sysmonSocket, sysmonSocket.close.bind(sysmonSocket));


var log = require('bows')('App');

require('./index.scss');
require('./base/style/poole.css');
require('./base/style/lanyon.css');

var App = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState() {
    return { sideBarEnabled: false };
  },
  toggleSideBar() {
    this.setState({sideBarEnabled: !this.state.sideBarEnabled});
  },
  render() {
    return (
      <div className="App">
        <input type="checkbox" className="sidebar-checkbox" id="sidebar-checkbox" checked={this.state.sideBarEnabled} />
        <SideBar/>
        <Router.RouteHandler toggleSideBar={this.toggleSideBar} {...this.props}/>
      </div>
    );
  }
});

var SideBar = React.createClass({
  render() {
    return (
      <div className="sidebar" id="sidebar">
        <div className="sidebar-item">
          <p>Sysmon</p>
        </div>

        <nav className="sidebar-nav">
          <Router.Link className="sidebar-nav-item" activeClassName="active" to="/">Home</Router.Link>
          <Router.Link className="sidebar-nav-item" activeClassName="active" to="about">About</Router.Link>

          <a className="sidebar-nav-item" href="https://github.com/wolfeidau/sysmon-ui">GitHub project</a>
          <span className="sidebar-nav-item">Currently v1.0.0</span>
        </nav>

        <div className="sidebar-item">
          <p>
            &copy; 2015. All rights reserved.
          </p>
        </div>
      </div>
    );
  }
});

var AboutView = React.createClass({
  render() {
    return (
      <div>
        Some view
      </div>
    );
  }
});

var DefaultView = React.createClass({
  render() {
      return (
      <div className="wrap">
        <div className="masthead">
          <div className="container">
            <h3 className="masthead-title">
              <Router.Link title="Home" to="/">Sysmon</Router.Link>
            </h3>
          </div>
        </div>

        <div className="container content">
          <Dashboard/>
        </div>

        <label for="sidebar-checkbox" onClick={this.props.toggleSideBar} className="sidebar-toggle"></label>
      </div>
    );
  }
});

var Dashboard = React.createClass({
  getInitialState() {
    return { metrics: {} };
  },
  updateCurrentMetrics(value) {
    this.setState({metrics: value});
  },
  componentDidMount() {
    stream.map(parseEvent).observe(this.updateCurrentMetrics);
  },  
  render(){
    return (
      <ul className="dash-container">
        <CPUWidget metrics={this.state.metrics} foregroundColor="orange"/>
        <MemoryWidget metrics={this.state.metrics} foregroundColor="green"/>
      </ul>
    )
  }

});

var CPUWidget = React.createClass({
  getInitialState() {
    return { currentValue: 0 };
  },
  componentWillReceiveProps(nextProps) {
    this.setState({currentValue: getCPUUsage(nextProps.metrics).toFixed(1)})
  },  
  render() {
    return (
      <li className="dash-widget">
        <div className="dash-date" >CPU Usage</div>
        <div className="dash-odometer" >{ this.state.currentValue }%</div>
        <ArcGraph currentValue={this.state.currentValue} foregroundColor={this.props.foregroundColor} />
      </li>
    )
  }
})

var MemoryWidget = React.createClass({
  getInitialState() {
    return { currentValue: 0 };
  },
  componentWillReceiveProps(nextProps) {
    this.setState({currentValue: getMemoryUsage(nextProps.metrics).toFixed(1)})
  },  
  render() {
    return (
      <li className="dash-widget">
        <div className="dash-date" >Memory Usage</div>
        <div className="dash-odometer" >{ this.state.currentValue }%</div>
        <ArcGraph currentValue={this.state.currentValue} foregroundColor={this.props.foregroundColor} />
      </li>
    )
  }
})

var ArcGraph = React.createClass({
  componentDidMount() {
    var el = this.getDOMNode();
    Arc.create(el, {width: '120', height: '120', foregroundColor: this.props.foregroundColor}, this.props.currentValue);
  },
  componentWillReceiveProps(nextProps) {
    var el = this.getDOMNode();
    Arc.update(el, nextProps);
  },
  render(){
    return (
      <div className="arc-graph"></div>
    )
  }
})

var routes = (
  <Router.Route name="app" path="/" handler={App}>
    <Router.DefaultRoute handler={DefaultView}/>
    <Router.Route name="about" path="/about" handler={AboutView}/>

  </Router.Route>
);

Router.run(routes, Router.HistoryLocation, (Handler, state) => {

  // store logic here if required

  React.render(<Handler/>, document.body);
});

function parseEvent(evt){
  return JSON.parse(evt.data)
}

function getCPUUsage(metrics) {
  return metrics.payload["cpu.totals.usage"].value
}

function getMemoryUsage(metrics) {
  return metrics.payload["memory.used"].value / metrics.payload["memory.total"].value * 100;
}