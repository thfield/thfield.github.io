
var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2 - 10,
    arcRad = 40;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var dayArc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - arcRad);

var hourArc = d3.svg.arc()
    .outerRadius(radius-2*arcRad-5)
    .innerRadius(radius - arcRad);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return 1; });

var svg = d3.select("#wheel").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class","mainwheel");

var days = svg.append("svg:g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .attr("class","dayring");

var hours = svg.append("svg:g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .attr("class","hourring");

///*
d3.csv("days.csv", function(error, data) {

  var g = days.selectAll(".dayArc")
      .data(pie(data))
      .enter().append("svg:g")
      .attr("class", "dayArc");

  g.append("svg:path")
      .attr("d", dayArc)
      .style("fill", "#98abc5")
      .style("stroke", "#000000");

  g.append("svg:text")
      .attr("transform", function(d) { return "translate(" + dayArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.day; });

}); 
/**/

///*
d3.csv("hours.csv", function(error, data) {

  var g = hours.selectAll(".hourArc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "hourArc");

  g.append("path")
      .attr("d", hourArc)
      .style("fill", "#7b6888")
      .style("stroke", "#000000");

  g.append("text")
      .attr("transform", function(d) { return "translate(" + hourArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.hour; });

}); 
/**/

 /*
//Width and height
var w = 100;
var h = 100;
var barPadding = 1;
			
var week = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

			 
//Create SVG element


svg.append("rect")
    //.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .attr("x", width/2)
    .attr("y", height/2)
    .attr("width", w)
    .attr("height", h)
    .attr("fill", "black");
			
/**/