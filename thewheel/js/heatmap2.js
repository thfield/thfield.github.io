var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 1200 - margin.left - margin.right,
    height = 1250 - margin.top - margin.bottom,
    colors = ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"];

var rowNames = [],
    colNames = [];

$.get('data/docksAll.txt', function (txt){
    rowNames = txt.split('\n');
});
$.get('data/docksAll.txt', function (txt){
    colNames = txt.split('\n');
}); 


var //numCols = 69,
    //cellSize = Math.floor(width / numCols ),
    cellSize = 16,
    legendElementWidth = cellSize*4;

d3.tsv("data/heatmap_trips.tsv",
        function(d) {
          return {
            row: +d.start,
            col: +d.end,
            value: +d.rides
          };
        },
        function(error, data) {
          var colorScale = d3.scale.threshold()
              //.domain([0, colors.length - 1, d3.max(data, function (d) { return d.value; })])
              .domain([1,10,20,50,100,150,300,500,1000])
              .range(colors);

          var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 /*
          var rowLabels = svg.selectAll(".rowLabel")
              .data(rowNames)
              .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return (i+1) * cellSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(8," + cellSize / 1.3 + ")")
                .attr("class", "rowLabel mono axis")
                .on("mouseover", function(d) {
                  d3.select(this).classed("text-hover",true);})
                .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});

          var colLabels = svg.selectAll(".colLabel")
              .data(colNames)
              .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", 0)
                .attr("y", function(d, i) { return (i+1) * cellSize; })
                .style("text-anchor", "left")
                .attr("transform", "translate(8," + cellSize / 1.3 + ") rotate (-90)")
                .attr("class", "colLabel mono axis")
                .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
                .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});
/**/
          var heatMap = svg.selectAll(".cell")
                .data(data)
              .enter().append("rect")
                .attr("x", function(d,i) { return (d.col) * cellSize; })
                .attr("y", function(d,i) { return (d.row) * cellSize; })
                /*.attr("rx", 4)
                .attr("ry", 4)*/
                .attr("class", "cell bordered")
                .attr("width", cellSize)
                .attr("height", cellSize)
                .style("fill", colors[0])
                .style("fill", function(d) { return colorScale(d.value); })
                .on("mouseover", function(d){
                  //highlight text
                  d3.select(this).classed("highlight",true);
                  d3.selectAll(".rowLabel").classed("text-hover",function(r,ri){ return ri==(d.row-1);});
                  d3.selectAll(".colLabel").classed("text-hover",function(c,ci){ return ci==(d.col-1);});
                  //Update the tooltip position and value
                  d3.select("#tooltip")
                    .style("left", (d3.event.pageX - 75) + "px")
                    .style("top", (d3.event.pageY+10) + "px")
                    .select("#value")
                    .text(d.value+" trips from " + rowNames[d.row-1] + " to "  + colNames[d.col-1]);  
                  //Show the tooltip
                  d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function(){
                  d3.select(this).classed("highlight",false);
                  d3.selectAll(".rowLabel").classed("text-hover",false);
                  d3.selectAll(".colLabel").classed("text-hover",false);
                  d3.select("#tooltip").classed("hidden", true);
                });

          //heatMap.append("title").text(function(d) { return d.value; });
              
          var legend = svg.selectAll(".legend")
              //.data([0].concat(colorScale.quantiles()), function(d) { return d; })
              .data([0].concat(colorScale.domain()), function(d) { return d; })
              .enter().append("g")
              .attr("class", "legend")
              .attr("transform", "translate(150,0)");;

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", cellSize / 2)
            .style("fill", function(d, i) { return colors[i]; })
            .style("stroke", "black");
/*
          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + cellSize);
          /**/
      });