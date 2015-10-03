var json_by_year;
var json2_by_year;
var data;

var svg;

window.onload = function() {
	d3.json("poc.json", function(error, data) {
		json_by_year = d3.nest().key(function(d) {
				return d.Year;
			})
			.key(function(d) {
				return d.Origin;
			})
			.rollup(function(v) {
				return d3.sum(v, function(d) {
					return d["Refugees (incl. refugee-like situations)"];
				});
			})
			.map(data);

	var select = document.getElementById("year");
	for (var i = 2014; i >= 2005; i--) {
		var option = document.createElement('option');
		option.text = option.value = i;
		select.add(option, 0);
	}
	selected_year = d3.select('#year').property('value');
	draw_bargraph(selected_year);
	});


	d3.json("poc.json", function(error, data) {
		json2_by_year = d3.nest().key(function(d) {
				return d.Year;
			})
			.key(function(d) {
				return d['Country / territory of asylum/residence'];
			})
			.key(function(d) {
				return d.Origin;
			})
			.rollup(function(v) {
				return d3.sum(v, function(d) {
					return d["Refugees (incl. refugee-like situations)"];
				});
			})
			.map(data);

	var select = document.getElementById("year");
	selected_year = d3.select('#year').property('value');
	draw_combined_bargraph(selected_year);
	});

var selector = d3.select('#year')
    .attr('transform', function (d, i) {
        var horz = 100;
        var vert = 100;
        return 'translate(' + horz + ',' + vert + ')';
    });

};

function year_change() {
	selected_year = d3.select('#year').property('value');
	draw_bargraph(selected_year);
	draw_combined_bargraph(selected_year);
}

function draw_bargraph(year) {

data = json_by_year[year];

d3.selectAll(".chart>g").remove();

	var arr = [];
	var countries = [];
	var count = 0;

	for (var i = 0; i < Object.keys(data).length; i++) {
		key = Object.keys(data)[i];
		arr.push({
			"key": key,
			"value": data[key]
		});
		key = key.replace(/ *\([^)]*\) */g, "");
		key = key.replace(")", "");
		countries.push(key)
		count++;
	};

var width = 960 - 150,
    barHeight = 9;

var x = d3.scale.linear()
    .domain([0, 160000])
    .range([0, width * 0.8]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", barHeight * (count + 5));

var bar = chart.selectAll("g")
    .data(arr)
  .enter().append("g")
    .attr("transform", function(d, i) {  return "translate(0," + i * barHeight + ")"; });

bar.append("rect")
    .attr("width", function(d) {
			return x(d.value);
		})
    .attr("transform", function(d, i) {  return "translate(120,0)"; })
    .attr("height", barHeight - 1)
    .attr("class", "bar1");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

 chart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(120," + barHeight * count + ")")
      .call(xAxis);

border = 120;
 chart.append("text")
    .attr("class", "label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", barHeight * count - 3)
    .text("Number of refugees");

      

    var y = d3.scale.ordinal()
    .domain(countries)
    .rangeBands([0, barHeight * count]);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.outerTickSize(0);

		chart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + border + ",0)")
		.call(yAxis);

}

function draw_combined_bargraph(year) {
	var data1 = json2_by_year[year];

    console.log(data1);
    d3.selectAll(".chart1>g").remove();


	var origin = [
    'Afghanistan', 'Eritrea', 'Gambia', 'Iran (Islamic Rep. of)', 
    'Iraq','Russian Federation','Somalia', 'Serbia and Kosovo (S/RES/1244 (1999))',
    'Syrian Arab Rep.', 'Mali'
	  ];
	 var asylum = ['Germany', 'France', 'United Kingdom', 'Sweden', 'Denmark'
	  ];
  var s = [];
    for (var i = 0; i < asylum.length; i++) {
  		var temp = {},
  		values = [];
  		temp['label'] = asylum[i];
  		for (var j = 0; j < origin.length; j++) {
  			var v = data1[asylum[i]][origin[j]];
  			if (!v){
  				v = 0;
  			}
  			values.push(v);
  		};
  		temp['values'] = values;
  		s.push(temp);
  	};

  	console.log(JSON.stringify(s));

	var data = {
  labels: [
    'Afghanistan', 'Eritrea', 'Gambia', 'Iran', 
    'Iraq','Russian Federation','Somalia', 'Serbia and Kosovo',
    'Syrian Arab Rep.', 'Mali'
  ],
  series: s
};


var barHeight        = 9,
    groupHeight      = barHeight * data.series.length,
    gapBetweenGroups = 9,
    spaceForLabels   = 120,
    spaceForLegend   = 150,
    chart1Width      = 960 - spaceForLabels - spaceForLegend;

// Zip the series data together (first values, second values, etc.)
var zippedData = [];
for (var i=0; i<data.labels.length; i++) {
  for (var j=0; j<data.series.length; j++) {
    zippedData.push(data.series[j].values[i]);
  }
}

// Color scale
var color = d3.scale.category10();
var chart1Height = barHeight * zippedData.length + gapBetweenGroups * data.labels.length+ 30;

var x = d3.scale.linear()
    .domain([0, d3.max(zippedData)])
    .range([0, chart1Width]);

var y = d3.scale.linear()
    .range([chart1Height + gapBetweenGroups, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat('')
    .tickSize(0)
    .orient("left");

// Specify the chart1 area and dimensions
var chart1 = d3.select(".chart1")
    .attr("width", spaceForLabels + chart1Width + spaceForLegend)
    .attr("height", chart1Height);

// Create bars
var bar = chart1.selectAll("g")
    .data(zippedData)
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
    });

// Create rectangles of the correct width
bar.append("rect")
    .attr("fill", function(d,i) { return color(i % data.series.length); })
    .attr("class", "bar")
    .attr("width", x)
    .attr("height", barHeight - 1);

// Draw labels
bar.append("text")
    .attr("class", "label")
    .attr("x", function(d) { return - 10; })
    .attr("y", groupHeight / 2)
    .attr("dy", ".35em")
    .text(function(d,i) {
      if (i % data.series.length === 0)
        return data.labels[Math.floor(i/data.series.length)];
      else
        return ""});

chart1.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
      .call(yAxis);

 chart1.append("text")
 	.attr("class", "label")
    .attr("x", spaceForLabels - 3)
    .attr("y", (gapBetweenGroups))
    .text("Country of origin");

chart1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(120," + (50 * barHeight + gapBetweenGroups * (0.5 + Math.floor(50/data.series.length))) + ")")
      .call(xAxis);

 chart1.append("text")
    .attr("class", "label")
    .attr("text-anchor", "end")
    .attr("x", spaceForLabels + chart1Width)
    .attr("y", (50 * barHeight + gapBetweenGroups * (0.5 + Math.floor(50/data.series.length))) - 3)
    .text("Number of Refugees");

// Draw legend
var legendRectSize = 18,
    legendSpacing  = 4;

var legend = chart1.selectAll('.legend')
    .data(data.series)
    .enter()
    .append('g')
    .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = -gapBetweenGroups/2;
        var horz = spaceForLabels + chart1Width + 40 - legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
    });

legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function (d, i) { return color(i); })
    .style('stroke', function (d, i) { return color(i); });

legend.append('text')
    .attr('class', 'legend')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function (d) { return d.label; });
}