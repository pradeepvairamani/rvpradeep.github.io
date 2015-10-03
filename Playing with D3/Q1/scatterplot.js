// Used http://d3-legend.susielu.com/#symbol-ordinal for legends

d3.tsv("iris.tsv", function(error, data) {
	var w = window.innerWidth;
	var h = window.innerHeight;
	var setosa = [];
	var versicolor = [];
	var virginica = [];
	var min_sepal = 100;
	var min_sepalh = 100
	var max_sepal = 0;
	var max_sepalh = 0;
	var border = 200;

	var svg = d3.select("body")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	svg.append("text")
    .attr("x", w/2 - border)
    .attr("y", h/2 - border - 20)
    .attr("class", "title")
    .text("Sepal length vs Sepal height");

	for (var i = 0; i < data.length; i++) {
		if (data[i].species === "setosa") {
			setosa.push(data[i]);
		} else if (data[i].species === "versicolor") {
			versicolor.push(data[i]);
		} else if (data[i].species === "virginica") {
			virginica.push(data[i]);
		}
		if (data[i].sepalLength < min_sepal) {
			min_sepal = data[i].sepalLength;
		}
		if (data[i].sepalLength > max_sepal) {
			max_sepal = data[i].sepalLength;
		}
		if (data[i].sepalWidth < min_sepalh) {
			min_sepalh = data[i].sepalWidth;
		}
		if (data[i].sepalWidth > max_sepalh) {
			max_sepalh = data[i].sepalWidth;
		}
	};

	var x = d3.scale.linear().domain([min_sepal * 0.9, max_sepal * 1.1]).range([0 + border, w - border]);
	var y = d3.scale.linear().domain([min_sepalh * 0.8, max_sepalh * 1.1]).range([h - border, 0 + border]);

	// var x = d3.scale.sqrt().domain([2, (max_sepal)]).range([0 + border, w - border]);
	//  var y = d3.scale.linear().domain([min_sepalh * 0.8, max_sepalh * 1.1]).range([h - border, 0 + border]);

	svg.selectAll("setosa")
		.data(setosa)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return x(d.sepalLength);
		})
		.attr("cy", function(d) {
			return y(d.sepalWidth);
		})
		.attr("r", function(d) {
			return (Math.sqrt(d.sepalLength)) * 2;
		});

	svg.selectAll("versicolor")
		.data(versicolor)
		.enter()
		.append("rect")
		.attr("x", function(d) {
			return x(d.sepalLength);
		})
		.attr("y", function(d) {
			return y(d.sepalWidth);
		})
		.attr("width", function(d) {
			return (Math.sqrt(d.sepalLength)) * 3;
		})
		.attr("height", function(d) {
			return (Math.sqrt(d.sepalLength)) * 3;
		});


	svg.selectAll("virginica")
		.data(virginica)
		.enter()
		.append("path")
		.attr("class", "point")
		.attr("d", d3.svg.symbol().type("triangle-up").size(function(d) {
			return (Math.sqrt(d.sepalLength)) * 10;
		}))
		.style("fill", "black")
		.attr("transform", function(d) {
			return "translate(" + x(d.sepalLength) + "," + y(d.sepalWidth) + ")";
		});

	var xAxis = d3.svg.axis();
	xAxis.scale(x);
	xAxis.orient("bottom").ticks(8);;

	svg.append("g")
		.attr("transform", "translate(0," + (h - border + 20) + ")")
		.attr("class", "axis")
		.call(xAxis);

	svg.append("text")
    .attr("class", "label")
    .attr("text-anchor", "end")
    .attr("x", w - border)
    .attr("y", h - border + 10)
    .text("Sepal length (cms)");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(5);

		svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + border + ",0)")
		.call(yAxis);

	svg.append("text")
    .attr("class", "label")
    .attr("text-anchor", "end")
    .attr("x", -border)
    .attr("y", border + 10)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Sepal Width (cms)");

	// l1 = ["setosa", "versicolor", "virginica"];

	// var legend = svg.selectAll('legend')
	//    .data(l1)
	//    .enter()
	//    .append('text')
	//    .attr('x', x(min_sepal))
	//    .attr('y', function(d, i) {return y(min_sepalh) - 100 + (i*30);})
	//    .text(function(d, i){ return d;})


	// 	var legendRectSize = 18;
	// var legendSpacing = 4;

	//  var legend = svg.selectAll('.legend')
	//   .data(l1)
	//   .enter()
	//   .append('g')
	//   .attr('transform', function(d, i) {
	//     var height = legendRectSize + legendSpacing;
	//     var offset =  height / 2;
	//     var horz = -2 * legendRectSize;
	//     var vert = i * height - offset;
	//     return 'translate(' + horz + ',' + vert + ')';
	//   });

	//  legend.append('rect')
	//  .attr('width', 5)
	//  .attr('height', 5)
	//    .attr('x', (legendRectSize + legendSpacing)*2)
	//  .attr('y', (legendRectSize - legendSpacing)*2);

	//  legend.append('text')
	//  .attr('x', (legendRectSize + legendSpacing)*3)
	//  .attr('y', (legendRectSize - legendSpacing)*2)
	//  .text(function(d) { return d; });


	var triangleU = d3.svg.symbol().type('triangle-up')(),
		circle = d3.svg.symbol().type('circle')(),
		square = d3.svg.symbol().type('square')();

	var symbolScale = d3.scale.ordinal()
		.domain(["setosa", "versicolor", "virginica"])
		.range([circle, square, triangleU]);

	var svg = d3.select("svg");

	svg.append("g")
		.attr("class", "legendSymbol")
		.attr("transform", "translate(800, 125)");

	var legendPath = d3.legend.symbol()
		.scale(symbolScale)
		.orient("vertical")

	svg.select(".legendSymbol")
		.call(legendPath);

	var borderPath = svg.append("rect")
		.attr("x", 780)
		.attr("y", 115)
		.attr("height", 55)
		.attr("width", 120)
		.style("fill", "none")
		.style("stroke", 'black');

});