var React = require('react');
var Router = require('react-router');

var Arc = require('../d3Chart').Arc;
var Area = require('../d3Chart').Area;


exports.ArcGraph = React.createClass({
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

exports.AreaGraph = React.createClass({
  componentDidMount() {
    var el = this.getDOMNode();
    Area.create(el, {width: '240', height: '120', foregroundColor: this.props.foregroundColor}, this.props.currentSeries);
  },
  componentWillReceiveProps(nextProps) {
    var el = this.getDOMNode();
    Area.update(el, nextProps);
  },
  render(){
    return (
      <div className="area-graph"></div>
    )
  }
})
