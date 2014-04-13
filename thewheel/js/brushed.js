var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var color = d3.scale.ordinal()
    .range(["#5fb7a9", "#0070cd", "#6f6f6f", "#000000"]);

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rides); });
var line2 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x2(d.date); })
    .y(function(d) { return y2(d.rides); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv("data/dailyType.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.total = +d.total;
    d.subscriber = +d.subscriber;
    d.customer = +d.customer;
  });

  var userType = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, rides: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([
    d3.min(userType, function(c) { return d3.min(c.values, function(v) { return v.rides; }); }),
    d3.max(userType, function(c) { return d3.max(c.values, function(v) { return v.rides; }); })
  ]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("rides");
  
    context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);
  
    
    context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);
   
  var focusUsers = focus.selectAll(".focusUsers")
      .data(userType)
    .enter().append("g")
      .attr("class", "focusUsers");

  var contextUsers = context.selectAll(".contextUsers")
      .data(userType)
    .enter().append("g")
      .attr("class", "contextUsers");
    
  contextUsers.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line2(d.values); })
      .style("stroke", function(d) { return color(d.name); });
    
  focusUsers.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  focusUsers.append("text")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })    
      .attr("x", width - 24)
      .attr("dy", 10)
      .style("text-anchor", "end")
      .text(function(d) { return d.name; });
  focusUsers.append("rect")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d.name); });
 
});

function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.selectAll(".line").attr("d", function(d) { return line(d.values); });
  focus.select(".x.axis").call(xAxis);
}

