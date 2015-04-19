var d3 = require('d3');

const tau = 2 * Math.PI;

var Arc = {}

Arc.create = function(el, props) {

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

	var v = state / 100;

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

var margin = {top: 10, right: 10, bottom: 20, left: 30};

Area.create = function(el, props, data) {
	
    var width = props.width - margin.left - margin.right;
    var height = props.height - margin.top - margin.bottom;

	data.forEach(v => v.date = new Date(v.time))

	var x = d3.time.scale()
		.domain(d3.extent(data, function(d) { return d.date; }))
	    .range([0, width]);

	var y = d3.scale.linear()
		.domain([0, 100])
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .ticks(d3.time.minute, 1)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .ticks(2)
	    .orient("left");

	var area = d3.svg.area()
	    .x(function(d) { return x(d.date); })
	    .y0(height)
	    .y1(function(d) { return y(d.value); });

	var svg = d3.select(el).append("svg")
		.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("path")
      .datum(data)
      .style("fill", props.foregroundColor || "orange")
      .attr("class", "area")
      .attr("d", area);

	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

 	svg.append("g")
       .attr("class", "y axis")
       .call(yAxis);
}

Area.update = function(el, props, data) {

    var width = props.width - margin.left - margin.right;
    var height = props.height - margin.top - margin.bottom;

	//console.log('state', data)

	data.forEach(v => v.date = new Date(v.time))

	var x = d3.time.scale()
		.domain(d3.extent(data, function(d) { return d.date; }))
	    .range([0, width]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .ticks(d3.time.minute, 1)
	    .orient("bottom");

	var y = d3.scale.linear()
		.domain([0, 100])
	    .range([height, 0]);

	var area = d3.svg.area()
	    .x(function(d) { return x(d.date); })
	    .y0(height)
	    .y1(function(d) { return y(d.value); });

	d3.select(el).select('.x axis')
     	.call(xAxis);

	d3.select(el).select('.area')
		.style("fill", props.foregroundColor || "orange")
    	.datum(data)
    	.attr("d", area);
}

exports.Arc = Arc;
exports.Area = Area;