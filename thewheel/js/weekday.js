var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#5fb7a9", "#0070cd", "#6f6f6f", "#000000"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var use = d3.select("#weekday").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/weekday.csv", function(error, data) {
  var userType = d3.keys(data[0]).filter(function(key) { return (key !== "day"); });
  var totalUsers = d3.keys(data[0]).filter(function(key) { return (key=="total"); });

  data.forEach(function(d) {
    d.trips = userType.map(function(name) { return {name: name, value: +d[name]}; });
    d.totalTrips = totalUsers.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.day; }));
  x1.domain(userType).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.totalTrips, function(d) { return d.value; }); })]);

  use.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  use.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Trips");

  var dayOfWeek = use.selectAll(".dayOfWeek")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.day) + ",0)"; });

///*
    dayOfWeek.selectAll("rect") // draw total trips
      .data(function(d) { return d.totalTrips; })
    .enter().append("rect")
      .attr("class","totalbar")
      .attr("width", x0.rangeBand())
      .attr("x", function(d) { return x0(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", "#6f6f6f"); 
/**/
    
    dayOfWeek.selectAll("rect") // draw trips by user type
      .data(function(d) { return d.trips; })
    .enter().append("rect")
      .attr("class","bar")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });
   
    

  var legend = use.selectAll(".legend")
      .data(userType.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});