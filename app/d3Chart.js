var d3 = require('d3');

const tau = 2 * Math.PI;

var Arc = {}

Arc.create = function(el, props, state) {

	console.log('props', props)

	var arc = d3.svg.arc()
	    .innerRadius(40) // TODO some maths to calculate these values
	    .outerRadius(60) // 120
	    .startAngle(0);

    var svg = d3.select(el).append("svg")
		.attr("width", props.width)
		.attr("height", props.height)
		.append("g")
		.attr("transform", "translate(" + props.width / 2 + "," + props.height / 2 + ")");

	svg.append("path")
	    .datum({endAngle: tau})
	    .style("fill", "#ddd")
	    .attr("d", arc);

	svg.append("path")
	    .datum({endAngle: .14 * tau})
	    .style("fill", props.foregroundColor || "orange")
	    .attr('class', 'foreground')
	    .attr("d", arc);

}

Arc.update = function(el, state) {
	
	var arc = d3.svg.arc()
	    .innerRadius(40)
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

var Area = {}

Area.create = function(el, props, state) {

	var x = d3.time.scale()
	    .range([0, props.width]);

	var y = d3.scale.linear()
	    .range([props.height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var area = d3.svg.area()
	    .x(function(d) { return x(d.ts); })
	    .y0(props.height)
	    .y1(function(d) { return y(d.value); });

	d3.select(el).append("svg")
		.attr("width", props.width)
		.attr("height", props.height)
		.attr("transform", "translate(" + props.width / 2 + "," + props.height / 2 + ")");

}

Area.update = function(el, state) {
	// svg.append("path")
 //      .datum(data)
 //      .attr("class", "area")
 //      .attr("d", area);

}

exports.Arc = Arc;
exports.Area = Area;