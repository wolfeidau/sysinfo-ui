var most = require('most');
var React = require('react');
var Router = require('react-router');

var Arc = require('../d3Chart').Arc;
var Area = require('../d3Chart').Area;


exports.ArcGraph = React.createClass({
  componentDidMount() {
    var el = this.getDOMNode();
    Arc.create(el, {width: '120', height: '120', foregroundColor: this.props.foregroundColor});
    this.props.series.observe(v => Arc.update(el, v))
  },
  render(){
    return (
      <div className="arc-graph"></div>
    )
  }
})

exports.AreaGraph = React.createClass({
  getInitialState: function() {
    return { series: [] };
  },
  componentDidMount() {
    var el = this.getDOMNode();
    var initialSet = most.from(dummySet(20, 5000));
    Area.create(el, {width: '300', height: '125', foregroundColor: this.props.foregroundColor}, initialSet);

    this.props.series.scan(function(slidingWindow, x) {
      return slidingWindow.concat(x).slice(-20);
    }, []).forEach(v => Area.update(el, {width: '300', height: '125', foregroundColor: this.props.foregroundColor}, v));
  },
  render(){
    return (
      <div className="area-graph"></div>
    )
  }
})

function dummySet(entries, interval) {
  var res = [];

  var timeNow = new Date().getTime();

  for (var i = 0; i < entries; i++) {
    res.push({time: timeNow, value:0})
    timeNow -= interval;
  };

  return res
}