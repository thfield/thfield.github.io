var colorUsers = {subscriber: "#0070cd", customer: "#bae4bc", total: "#7bccc4", extra:"#d1d1d1", alert: "#e63737"},
    colorCities = ["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0070cd"];

function stations(filePath) {
var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(colorCities);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.stations; });

var svg = d3.select("#row1").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv(filePath, function(error, data) {

  data.forEach(function(d) {
    d.stations = +d.stations;
  });

  var g = svg.selectAll(".slice")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "slice");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.City); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.City + " " + d.data.stations_percent + "%"; });
  });
} //end stations()

function docks(filePath) {
  var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(colorCities);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.docks; });

var svg = d3.select("#row1").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv(filePath, function(error, data) {

  data.forEach(function(d) {
    d.docks = +d.docks;
  });

  var g = svg.selectAll(".slice")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "slice");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.City); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.City + " " + d.data.docks_percent + "%"; });
  });
} //end docks()

function rides(filePath) {
  var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(colorCities);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.rides; });

var svg = d3.select("#row1").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv(filePath, function(error, data) {

  data.forEach(function(d) {
    d.rides = +d.rides;
  });

  var g = svg.selectAll(".slice")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "slice");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.City); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.City + " " + d.data.rides_percent + "%"; });
  });
}  //end rides()

function system_rides(filePath) {
var margin = {top: 10, right: 40, bottom: 40, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%m/%d/%y").parse;

var x = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    ybar = d3.scale.linear().range([height, 0]).domain([0,1]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

//
var color = d3.scale.ordinal()
      .range([colorUsers.total, colorUsers.subscriber, colorUsers.customer]),
    bars = d3.scale.category10();

//
var line = d3.svg.line()
    .interpolate("monotone") // linear, step, step-before, step-after, basis, basis-open, cardinal, cardinal-open, monotone
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rides); });

var baritup = d3.svg.area()
    .interpolate("step")
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return ybar(d.bool); });

//
var svg = d3.select("#row2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var chart = svg.append("g")
    .attr("class", "chart")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//
d3.csv(filePath, function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return (key == "rides" ); }));
  bars.domain(d3.keys(data[0]).filter(function(key) { return (key == "weekend" ) ; }));

//    
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.rides = +d.rides;
  });

//    
  var userType = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, rides: +d[name]};
      })
    };
  });
var specialDay = bars.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, bool: +d[name]};
      })
    };
  });
    
//    
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([
    d3.min(userType, function(c) { return d3.min(c.values, function(v) { return v.rides; }); }),
    d3.max(userType, function(c) { return d3.max(c.values, function(v) { return v.rides; }); })
  ]);

//  
  
  
    
//   
  var chartUsers = chart.selectAll(".chartUsers")
      .data(userType)
    .enter().append("g")
      .attr("class", "chartUsers");

  var weekend = chart.selectAll(".weekend")
      .data(specialDay)
    .enter().append("g");

  
//    
  chartUsers.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); })
      .style("stroke-width", "2px");

  weekend.append("path")
      .attr("class", function(d){ return "bars " + d.name; })
      .attr("d", function(d) { return baritup(d.values); })
      //.style("fill", function(d) { return bars(d.name); })
      //.style("stroke", function(d) { return bars(d.name); })
      .style("display","none");    
    
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("rides");
 /*
  chartUsers.append("text")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })    
      .attr("x", width - 26)
      .attr("dy", 10)
      .style("text-anchor", "end")
      .text(function(d) { return d.name; });
    
  chartUsers.append("rect")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .attr("x", width - 20)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d.name); });
/**/ 
  });
} //end system_rides()

$(document).on('click', '#weekendCB', function () { 
     $('#weekendCB').is(':checked') ? $('.weekend').toggle(true) : $('.weekend').toggle(false);
 });


function system_users(filePath) {
 
var width = 900,
    height = 300,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range([colorUsers.customer,colorUsers.subscriber]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.rides; });

var svg = d3.select("#row3").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv(filePath, function(error, data) {

  data.forEach(function(d) {
    d.rides = +d.rides;
  });

  var g = svg.selectAll(".slice")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "slice");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.user); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.user + " " + d.data.percent + "%"; });

  }); 
} // end system_users()

function weekday_use(filePath){
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal()
      .range([colorUsers.total, colorUsers.subscriber, colorUsers.customer]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range([ colorUsers.subscriber, colorUsers.customer, colorUsers.total]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var rides = d3.select("#row4").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(filePath, function(error, data) {
  var rider = d3.keys(data[0]).filter(function(key) { return (key == "customer" || key == "subscriber" ); });
  var totalUsers = d3.keys(data[0]).filter(function(key) { return (key=="total"); });

  data.forEach(function(d) {
    d.rides = rider.map(function(name) { return {name: name, value: +d[name]}; });
    d.totalRides = totalUsers.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.day; }));
  x1.domain(rider).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.totalRides, function(d) { return d.value; }); })]);

  rides.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  rides.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("rides");

  var totalrides = rides.selectAll(".dayOfWeek")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.day) + ",0)"; });

  
  var dayOfWeek = rides.selectAll(".dayOfWeek")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.day) + ",0)"; });
  
///*
    totalrides.selectAll("rect") // draw total rides
      .data(function(d) { return d.totalRides; })
    .enter().append("rect")
      .attr("class","totalbar")
      .attr("width", x0.rangeBand())
      .attr("x", function(d) { return x0(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      //.style("fill", function(d) { return x1(d.name); });  
      .style("fill", colorUsers.total); 
/**/
    
    dayOfWeek.selectAll("rect") // draw rides by user type
      .data(function(d) { return d.rides; })
    .enter().append("rect")
      .attr("class","bar")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = rides.selectAll(".legend")
      .data(rider.slice())
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
  
  var extraLegend = rides.append("g")
        .attr("class", "legend")
        .attr("transform", function() { return "translate(0," + 2 * 20 + ")"; });
   extraLegend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorUsers.total);
  extraLegend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("total");
  });
} //end weekday_use()

function hourlyline(filePath) {
 
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var parseHour = d3.time.format("%H %p").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x(d.hour); })
    .y(function(d) { return y(d.rides); });

var svg = d3.select("#row4").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(filePath, function(error, data) {
  data.forEach(function(d) {
    d.hour =  parseHour(d.hour);
    d.rides = +d.rides;
  });

  x.domain(d3.extent(data, function(d) { return d.hour; }));
  y.domain(d3.extent(data, function(d) { return d.rides; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Rides");

  svg.append("path")
      .datum(data)
      .attr("class", "hour")
      .attr("d", line)
      .style("stroke", colorUsers.total);
  });
} // end hourlyline()

function hourlybar(filePath) {
   
var margin = {top: 20, right: 0, bottom: 30, left: 40},
    width = 350 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var x1 = d3.scale.ordinal()
      .range([colorUsers.total, colorUsers.subscriber, colorUsers.customer]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range([ colorUsers.subscriber, colorUsers.customer, colorUsers.total]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var rides = d3.select("#row4").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(filePath, function(error, data) {
  var rider = d3.keys(data[0]).filter(function(key) { return (key == "customer" || key == "subscriber" ); });
  var totalUsers = d3.keys(data[0]).filter(function(key) { return (key=="total"); });

  data.forEach(function(d) {
    d.rides = rider.map(function(name) { return {name: name, value: +d[name]}; });
    d.totalRides = totalUsers.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.hour; }));
  x1.domain(rider).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.totalRides, function(d) { return d.value; }); })]);

  rides.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  rides.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("rides");

  var totalrides = rides.selectAll(".category")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.hour) + ",0)"; });

  
  var category = rides.selectAll(".category")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.hour) + ",0)"; });
  
///*
    totalrides.selectAll("rect") // draw total rides
      .data(function(d) { return d.totalRides; })
    .enter().append("rect")
      .attr("class","totalbar")
      .attr("width", x0.rangeBand())
      .attr("x", function(d) { return x0(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      //.style("fill", function(d) { return x1(d.name); });  
      .style("fill", colorUsers.total); 
/**/
    
    category.selectAll("rect") // draw rides by user type
      .data(function(d) { return d.rides; })
    .enter().append("rect")
      .attr("class","bar")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = rides.selectAll(".legend")
      .data(rider.slice())
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
  
  var extraLegend = rides.append("g")
        .attr("class", "legend")
        .attr("transform", function() { return "translate(0," + 2 * 20 + ")"; });
   extraLegend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorUsers.total);
  extraLegend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("total");
  });
} // end hourlybar()


function durations(filePath) {
   
var margin = {top: 20, right: 0, bottom: 30, left: 40},
    width = 350 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var x1 = d3.scale.ordinal()
      .range([colorUsers.total, colorUsers.subscriber, colorUsers.customer]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range([ colorUsers.subscriber, colorUsers.customer, colorUsers.total]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var rides = d3.select("#row4").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(filePath, function(error, data) {
  var rider = d3.keys(data[0]).filter(function(key) { return (key == "customer" || key == "subscriber" ); });
  var totalUsers = d3.keys(data[0]).filter(function(key) { return (key=="total"); });

  data.forEach(function(d) {
    d.rides = rider.map(function(name) { return {name: name, value: +d[name]}; });
    d.totalRides = totalUsers.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.duration; }));
  x1.domain(rider).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.totalRides, function(d) { return d.value; }); })]);

  rides.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  rides.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("rides");

  var totalrides = rides.selectAll(".category")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.duration) + ",0)"; });

  
  var category = rides.selectAll(".category")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.duration) + ",0)"; });
  
///*
    totalrides.selectAll("rect") // draw total rides
      .data(function(d) { return d.totalRides; })
    .enter().append("rect")
      .attr("class","totalbar")
      .attr("width", x0.rangeBand())
      .attr("x", function(d) { return x0(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      //.style("fill", function(d) { return x1(d.name); });  
      .style("fill", colorUsers.total); 
/**/
    
    category.selectAll("rect") // draw rides by user type
      .data(function(d) { return d.rides; })
    .enter().append("rect")
      .attr("class","bar")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = rides.selectAll(".legend")
      .data(rider.slice())
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
  
  var extraLegend = rides.append("g")
        .attr("class", "legend")
        .attr("transform", function() { return "translate(0," + 2 * 20 + ")"; });
   extraLegend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorUsers.total);
  extraLegend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("total");
  });
} // end durations()

stations("data/stations.csv");
docks("data/stations.csv");
rides("data/stations.csv");
system_rides("data/totalUse.csv");
system_users("data/userType.csv");
weekday_use("data/weekday.csv");
hourlybar("data/hourlyRides.csv");
durations("data/rideDurationMin.csv");