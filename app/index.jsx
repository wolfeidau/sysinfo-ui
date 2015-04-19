var React = require('react');
var Router = require('react-router');
var most = require('most');
var log = require('bows')('App');

// components
var ArcGraph = require('./components/charts.jsx').ArcGraph;
var AreaGraph = require('./components/charts.jsx').AreaGraph;

// subsribe to a feed of metric data from the sysmon-mqtt service using websockets
var fromWebSocket = require('./most-w3msg').fromWebSocket;
var sysmonSocket = new WebSocket('ws://localhost:9980/sysmon');
var stream = fromWebSocket(sysmonSocket, sysmonSocket.close.bind(sysmonSocket));

var memorydata = stream.map(parseEvent).map(m => m.payload["memory.used"])

require('./base/style/dash.css');
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
  componentWillMount() {
    this.props.cpuData = stream.map(parseEvent).map(m => m.payload.cpu)
    this.props.memoryData = stream.map(parseEvent).map(m => m.payload.memory)
    this.props.cpuHistory = stream.map(parseEvent).map(m => m.payload.cpu)
    this.props.memoryHistory = stream.map(parseEvent).map(m => m.payload.memory)
},  
  render(){
    return (
      <ul className="dash-container">
        <CPUWidget metricStream={this.props.cpuData} foregroundColor="orange"/>
        <MemoryWidget metricStream={this.props.memoryData} foregroundColor="green"/>
        <CPUHistoryWidget metricStream={this.props.cpuHistory} foregroundColor="orange"/>
        <MemoryHistoryWidget metricStream={this.props.memoryHistory} foregroundColor="green"/>
      </ul>
    )
  }
});

var CPUWidget = React.createClass({
  getInitialState() {
    return { currentValue: 0 };
  },  
  componentWillMount() {
    this.props.cpuUsage = this.props.metricStream.map(m => m.totals.usage).map(v => v.value)
    this.props.cpuSeries = this.props.metricStream.map(m => m.totals.usage).map(v => v.value)
  },
  componentDidMount(){
    this.props.cpuUsage.observe(v => this.setState({currentValue: v.toFixed(1)}))
  },
  render() {
    return (
      <li className="dash-widget">
        <div className="dash-date" >CPU Usage</div>
        <div className="dash-odometer" >{ this.state.currentValue }%</div>
        <ArcGraph series={this.props.cpuSeries} foregroundColor={this.props.foregroundColor} />
      </li>
    )
  }
})

var MemoryWidget = React.createClass({
  getInitialState() {
    return { currentValue: 0 };
  },
  componentWillMount() {
    this.props.memoryUsage = this.props.metricStream.map(getMemoryUsage)
    this.props.memorySeries = this.props.metricStream.map(getMemoryUsage)
  },
  componentDidMount(){
    this.props.memoryUsage.observe(v => this.setState({currentValue: v.toFixed(1)}))
  },
  render() {
    return (
      <li className="dash-widget">
        <div className="dash-date" >Memory Usage</div>
        <div className="dash-odometer" >{ this.state.currentValue }%</div>
        <ArcGraph series={this.props.memorySeries} foregroundColor={this.props.foregroundColor} />
      </li>
    )
  }
})

var CPUHistoryWidget = React.createClass({
  getInitialState() {
    return { currentValue: 0 };
  },
  componentWillMount() {
    this.props.cpuSeries = this.props.metricStream.map(m => m.totals.usage).map(v => v.value).timestamp()
  },
  render() {
    return (
      <li className="dash-history-widget">
        <div className="dash-date" >CPU History</div>
        <AreaGraph series={this.props.cpuSeries} foregroundColor={this.props.foregroundColor} />
      </li>
    )
  }
})

var MemoryHistoryWidget = React.createClass({
  getInitialState() {
    return { currentValue: 0 };
  },
  componentWillMount() {
    this.props.memorySeries = this.props.metricStream.map(getMemoryUsage).timestamp()
  },
  render() {
    return (
      <li className="dash-history-widget">
        <div className="dash-date" >Memory History</div>
        <AreaGraph series={this.props.memorySeries} foregroundColor={this.props.foregroundColor} />
      </li>
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

function getMemoryUsage(memory) {
  return memory.used.value / memory.total.value * 100;
}