var colorUsers = {subscriber: "#0070cd", customer: "#bae4bc", total: "#7bccc4", extra:"#d1d1d1", alert: "#e63737", highlight:"#ff9c27"},
    colorCities = ["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0070cd"],
    colorHeat = ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"];

function factors(filePath) {
var margin = {top: 10, right: 40, bottom: 100, left: 40},
    margin2 = {top: 430, right: 40, bottom: 20, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%m/%d/%y").parse;

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);
    ybar = d3.scale.linear().range([height, 0]).domain([0,1]);
    ytemp = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left"),
    yAxisTemp = d3.svg.axis().scale(ytemp).orient("right");


var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

//
var color = d3.scale.ordinal()
      .range([colorUsers.total, colorUsers.subscriber, colorUsers.customer]),
    avgs = d3.scale.ordinal()
      .range([colorUsers.total, colorUsers.subscriber, colorUsers.customer]),
    bars = d3.scale.category10(),
    temps = d3.scale.ordinal();

//
var line = d3.svg.line()
    .interpolate("linear") // linear, step, step-before, step-after, basis, basis-open, cardinal, cardinal-open, monotone
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rides); });

var area = d3.svg.area()
    .interpolate("linear") // linear, step, step-before, step-after, basis, basis-open, cardinal, cardinal-open, monotone
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.rides); });
var area2 = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.rides); });

var baritup = d3.svg.area()
    //.interpolate("monotone")
    .interpolate("step")
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return ybar(d.bool); });

var tempLine = d3.svg.line()
    .interpolate("basis") // linear, step, step-before, step-after, basis, basis-open, cardinal, cardinal-open, monotone
    .x(function(d) { return x(d.date); })
    .y(function(d) { return ytemp(d.temp); });

//
var svg = d3.select("#chart").append("svg")
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

//
d3.csv(filePath, function(error, data) {
//d3.csv("data/factorsAll.csv", function(error, data) {
  
  color.domain(d3.keys(data[0]).filter(function(key) { return (key == "total" || key == "subscriber" || key =="customer"); }));
  avgs.domain(d3.keys(data[0]).filter(function(key) { return (key == "totalAvg" || key == "subscriberAvg" || key =="customerAvg"); }));
  temps.domain(d3.keys(data[0]).filter(function(key) { return (key == "temp"); }));
  bars.domain(d3.keys(data[0]).filter(function(key) { return (key == "weekend" || key =="BART" || key =="49ers" || key =="Giants" || key =="Sharks" || key =="AmericasCup" || key =="SFRain" || key =="holiday" || key =="USGovShutdown") ; }));

//    
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.total = +d.total;
    d.subscriber = +d.subscriber;
    d.customer = +d.customer;
    d.totalAvg = +d.totalAvg;
    d.subscriberAvg = +d.subscriberAvg;
    d.customerAvg = +d.customerAvg;  
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
var userTypeAvg = avgs.domain().map(function(name) {
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
var tempCities = temps.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, temp: +d[name]};
      })
    };
  });
    
//    
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([
    d3.min(userType, function(c) { return d3.min(c.values, function(v) { return v.rides; }); }),
    d3.max(userType, function(c) { return d3.max(c.values, function(v) { return v.rides; }); })
  ]);
  x2.domain(x.domain());
  y2.domain(y.domain());
  ytemp.domain([
    d3.min(tempCities, function(c) { return d3.min(c.values, function(v) { return v.temp; }); }),
    d3.max(tempCities, function(c) { return d3.max(c.values, function(v) { return v.temp; }); })
  ]);    

//  
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
  
  focus.append("g")
      .attr("class", "y axis axisTemp")
      .attr("transform", "translate(" + width + ",0)")
      .call(yAxisTemp)
      .style("display","none")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("ºF");
    
  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);
    
    
//   
  var focusUsers = focus.selectAll(".focusUsers")
      .data(userType)
    .enter().append("g")
      .attr("class", "focusUsers");
  
  var focusUsersAvg = focus.selectAll(".focusUsersAvg")
      .data(userTypeAvg)
    .enter().append("g")
      .attr("class", "focusUsersAvg");

 var focusTemps = focus.selectAll(".focusTemps")
      .data(tempCities)
    .enter().append("g")
      .attr("class", "focusTemps")
      .style("display", "none");

  var contextUsers = context.selectAll(".contextUsers")
      .data(userType)
    .enter().append("g")
      .attr("class", "contextUsers");

  var noteableDay = focus.selectAll(".notableDay")
      .data(specialDay)
    .enter().append("g")
      .attr("class", "notableDay");    
  
//    
  contextUsers.append("path")
      .attr("class", "area")
      .attr("d", function(d) { return area2(d.values); })
      .style("stroke", function(d) { return color(d.name); })
      .style("fill", function(d) { return color(d.name); });
    
  focusUsers.append("path")
      .attr("class", "area")
      .attr("d", function(d) { return area(d.values); })
      .style("stroke", function(d) { return color(d.name); })
      .style("fill", function(d) { return color(d.name); });

  focusUsersAvg.append("path")
      .attr("class", "avgline")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return avgs(d.name); });

  focusTemps.append("path")
      .attr("class", "tempLine")
      .attr("d", function(d) { return tempLine(d.values); })
      .style("stroke", colorUsers.highlight);

  noteableDay.append("path")
      .attr("class", function(d){ return "bars " + d.name; })
      .attr("d", function(d) { return baritup(d.values); })
      .style("fill", function(d) { return bars(d.name); })
      .style("stroke", function(d) { return bars(d.name); })
      .style("display", "none");    
    
//
  focusUsers.append("text")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })    
      .attr("x", width - 26)
      .attr("dy", 10)
      .style("text-anchor", "end")
      .text(function(d) { return d.name; });
    
  focusUsers.append("rect")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .attr("x", width - 20)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d.name); });
    
//    
  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7); 
  });
} //end factors()


function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.selectAll(".area").attr("d", function(d) { return area(d.values); });
  focus.selectAll(".tempLine").attr("d", function(d) { return tempLine(d.values); });
  focus.selectAll(".avgline").attr("d", function(d) { return line(d.values); });
  focus.selectAll(".bars").attr("d", function(d) { return baritup(d.values); });
  focus.select(".x.axis").call(xAxis);
}

 $(document).on('click', '#weekendCB', function () { 
     $('.weekend').toggle(); 
 });
 $(document).on('click', '#bartCB', function () { 
     $('.BART').toggle(); 
 });
$(document).on('click', '#49ersCB', function () { 
    $('.49ers').toggle(); 
});
$(document).on('click', '#giantsCB', function () { 
    $('.Giants').toggle(); 
});
$(document).on('click', '#sharksToggle', function () { 
    $('.Sharks').toggle();
});
$(document).on('click', '#americasCB', function () { 
    $('.AmericasCup').toggle(); 
});
$(document).on('click', '#rainCB', function () {
     $('.SFRain').toggle();
    });
$(document).on('click', '#holidayCB', function () {
     $('.holiday').toggle();
    });
$(document).on('click', '#govCB', function () {
     $('.USGovShutdown').toggle();
    });
$(document).on('click', '#avgCB', function () {
     $('.focusUsersAvg').toggle();
    });
$(document).on('click', '#tempCB', function () {
     $('.focusTemps').toggle();
     $('.axisTemp').toggle();
    });

$(document).on('click', 'input[name=city]', function () { 
  var city=$('input[name=city]:checked').val();
  
  switch (city) {
        case "all":
            $("#chart").empty();
            factors("data/factorsAll.csv");
            break;
        case "sj":
            $("#chart").empty();
            factors("data/factorsSJ.csv"); 
            break;
        case "rc":
           $("#chart").empty();
            factors("data/factorsRC.csv"); 
            break;
        case "mv":
          $("#chart").empty();
            factors("data/factorsMV.csv"); 
            break;
        case "pa":
            $("#chart").empty();
            factors("data/factorsPA.csv"); 
            break;
        case "sf":
            $("#chart").empty();
            factors("data/factorsSF.csv"); 
            break;
        default:
          
            break;
        }
});

factors("data/factorsAll.csv");