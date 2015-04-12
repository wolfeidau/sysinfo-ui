var d3 = require('d3');

const tau = 2 * Math.PI;

var Arc = {}

Arc.create = function(el, props, state) {

	console.log('props', props)

	var arc = d3.svg.arc()
	    .innerRadius(45)
	    .outerRadius(60)
	    .startAngle(0);

    var svg = d3.select(el).append("svg")
		.attr("width", props.width)
		.attr("height", props.height)
		.append("g")
		.attr("transform", "translate(" + props.width / 2 + "," + props.height / 2 + ")");

	var background = svg.append("path")
	    .datum({endAngle: tau})
	    .style("fill", "#ddd")
	    .attr("d", arc);

	var foreground = svg.append("path")
	    .datum({endAngle: .14 * tau})
	    .style("fill", "orange")
	    .attr('class', 'foreground')
	    .attr("d", arc);

}

Arc.update = function(el, state) {
	
	var arc = d3.svg.arc()
	    .innerRadius(45)
	    .outerRadius(60)
	    .startAngle(0);

	var v = state.currentValue / 100;

	d3.select(el).select('.foreground')
		.transition()
      	.duration(750)
      	.call(arcTween, v * tau, arc);

}

function arcTween(transition, newAngle, arc) {
	transition.attrTween("d", function(d) {
		var interpolate = d3.interpolate(d.endAngle, newAngle);
		return function(t) {
			d.endAngle = interpolate(t);
			return arc(d);
		}
	});
}

exports.Arc = Arc;