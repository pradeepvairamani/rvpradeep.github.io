function heat(hr, key, val) {
	this.hr = hr;
	this.key = key;
	this.val = val;
}


d3.json("hourly_heatmap.json", function(error, data) {
	hear_arr = [];
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i]["values"].length; j++) {
			var temp = new heat(j + 1, data[i].key, data[i]["values"][j]);
			hear_arr.push(temp);
		};
	};


	var margin = {
			top: 20,
			right: 90,
			bottom: 30,
			left: 50
		},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.bottom + margin.top)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scale.linear().domain([0, 23]).range([0, width]),
		y = d3.scale.linear().domain([50, 410]).range([height, 0]),
		z = d3.scale.linear().domain(d3.extent(hear_arr, function(d) {
			return d.val;
		})).range(["white", "red"]);

	var xStep = 1,
		yStep = 50;

	x.domain([x.domain()[0], x.domain()[1] + xStep]);
	y.domain([y.domain()[0], y.domain()[1] + yStep]);

	svg.selectAll("tile")
		.data(hear_arr)
		.enter()
		.append("rect")
		.attr("class", "tile")
		.attr("x", function(d) {
			return x(d.hr - 1);
		})
		.attr("y", function(d) {
			return y(d.key + 50);
		})
		.attr("width", x(xStep) - x(0))
		.attr("height", y(0) - y(yStep))
		.style("fill", function(d) {
			return z(d.val);
		});

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.attr("x", width)
		.call(d3.svg.axis().scale(x).ticks(24).orient("bottom"))
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.attr("text-anchor", "end")
		.text("X axis");

	svg.append("g")
		.attr("class", "y axis")
		.call(d3.svg.axis().scale(y).orient("left"))
		.append("text")
		.attr("class", "label")
		.attr("y", 6)
		.attr("dy", ".71em")
		.attr("text-anchor", "end")
		.attr("transform", "rotate(-90)")
		.text("Value");

	// Legend
	var legend = svg.selectAll(".legend")
		.data(z.ticks(8).slice(1).reverse())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {
			return "translate(" + (width + 20) + "," + (20 + i * 20) + ")";
		});

	legend.append("rect")
		.attr("width", 20)
		.attr("height", 20)
		.style("fill", z);

	legend.append("text")
		.attr("x", 26)
		.attr("y", 10)
		.attr("dy", ".35em")
		.text(String);

});