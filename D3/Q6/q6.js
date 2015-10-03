var asylum_providers = ["Germany", "France", "United Kingdom", "Sweden", "Denmark"];

var array = ["Germany", "France", "United Kingdom", "Sweden", "Denmark", "Afghanistan", "Eritrea", "Iran", "Iraq", "Russian Federation", "Somalia", "Serbia & Kosovo", "Syrian Arab Rep."];

// d3.json("refugees.json", function(error, data) {
//     console.log(data);
//     var refugee_seekers = ["Afghanistan", "Eritrea", "Iran", "Iraq", "Russian Federation", "Somalia", "Serbia & Kosovo", "Syrian Arab Rep."]
//     var matrix = new Array(13);
//     for (var i = 0; i < 13; i++) {
//         matrix[i] = new Array(13);
//     };

//     for (var i = 0; i < 13; i++) {
//         for (var j = 0; j < 13; j++) {
//             matrix[i][j] = 0;
//         }
//     }

//     for (var i = 0; i < 8; i++) {
//         for (var j = 0; j < 5; j++) {
//             matrix[i][j] = data["paths"][j][values][i];
//             matrix[j][i] = data["paths"][j][values][i];
//         }
//     }

//     console.log(matrix);

// });

var rotation = -0.7;

var color = d3.scale.category20();

var matrix_2014 = [
    [0, 0, 0, 0, 0, 27814, 4716, 18814, 41167, 4608, 4205, 9294, 40994],
    [0, 0, 0, 0, 0, 3838, 1671, 2359, 2991, 13644, 1896, 12119, 2882],
    [0, 0, 0, 0, 0, 9039, 11583, 11510, 2951, 575, 8509, 408, 4572],
    [0, 0, 0, 0, 0, 12090, 14107, 4152, 24184, 2014, 21189, 3082, 34285],
    [0, 0, 0, 0, 0, 2130, 319, 1912, 967, 1051, 1134, 468, 7253],
    [27814, 3838, 9039, 12090, 2130, 0, 0, 0, 0, 0, 0, 0, 0],
    [4716, 1671, 11583, 14107, 319, 0, 0, 0, 0, 0, 0, 0, 0],
    [18814, 2359, 11510, 4152, 1912, 0, 0, 0, 0, 0, 0, 0, 0],
    [41167, 2991, 2951, 24184, 967, 0, 0, 0, 0, 0, 0, 0, 0],
    [4608, 13644, 575, 2014, 1051, 0, 0, 0, 0, 0, 0, 0, 0],
    [4205, 1896, 8509, 21189, 1134, 0, 0, 0, 0, 0, 0, 0, 0],
    [9294, 12119, 408, 3082, 468, 0, 0, 0, 0, 0, 0, 0, 0],
    [40994, 2882, 4572, 34285, 7253, 0, 0, 0, 0, 0, 0, 0, 0]
];

var chord_options = {
    "country_names": array,
    "rotation": rotation,
    "colors": [color(0), color(1), color(2), color(3), color(4), "#b10026", "#b10026", "#b10026", "#b10026", "#b10026", "#b10026", "#b10026", "#b10026"]
};

function Graph(options, matrix) {

    var config = {
        width: window.innerWidth/2.5,
        height: window.innerHeight,
        rotation: 0,
        textgap: 5,
        colors: [color(0), color(1), color(2), color(3), color(4), "#b10026", "#b10026", "#b10026", "#b10026", "#b10026", "#b10026", "#b10026", "#b10026"]
    };

    for (var i in options) {
            config[i] = options[i];
    }

    var offset = Math.PI * config.rotation,
        width = config.width,
        height = config.height,
        textgap = config.textgap
    colors = config.colors;

    if (config.country_names) {
        country_names = config.country_names;
    }

    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);

    var innerRadius = Math.min(width, height) * .28,
        outerRadius = innerRadius * 1.15;

    var fill = d3.scale.ordinal()
        .domain(d3.range(matrix.length - 1))
        .range(colors);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll("g.group")
        .data(chord.groups)
        .enter().append("svg:g")
        .attr("class", "group");

    g.append("svg:path")
        .style("fill", function(d) {
            return fill(d.index);
        })
        .style("stroke", function(d) {
            return fill(d.index);
        })
        .attr("id", function(d, i) {
            return "group" + d.index;
        })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius).startAngle(startAngle).endAngle(endAngle))
        .on("mouseover", fade(0.1))
        .on("mouseout", fade(0.7));

    g.append("svg:text")
        .each(function(d) {
            d.angle = ((d.startAngle + d.endAngle) / 2) + offset;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
            return d.angle > Math.PI ? "end" : null;
        })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + (outerRadius + textgap) + ")" + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) {
            return country_names[d.index];
        });

    svg.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(chord.chords)
        .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius).startAngle(startAngle).endAngle(endAngle))
        .style("fill", function(d) {
            return fill(d.source.index);
        })
        .style("opacity", 1)
        .append("svg:title")
        .text(function(d) {
            if(asylum_providers.indexOf(country_names[d.source.index]) > -1){
                return d.source.value + " people from " + country_names[d.target.index] + " took refuge in " + country_names[d.source.index];
            }
            else {
            return d.source.value + " people from " + country_names[d.source.index] + " commute to " + country_names[d.target.index];
        }
        });

    function startAngle(d) {
        return d.startAngle + offset;
    }

    function endAngle(d) {
        return d.endAngle + offset;
    }

    function fade(opacity) {
        return function(g, i) {
            svg.selectAll(".chord path")
                .filter(function(d) {
                    return d.source.index != i && d.target.index != i;
                })
                .transition()
                .style("opacity", opacity);
        };
    }

}

window.onload = function() {
    Graph(chord_options, matrix_2014);
}

d3.select(self.frameElement).style("height", "600px");

