// Set SVG wrapper dimensions

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append tooltip div
var toolTip = d3.select("body").append("div")
    .attr("class", "tooltip");

// Load in CSV file
d3.csv("assets/data/data.csv", function(err, data){
    if (err) throw err;
 
    // Loop through CSV file
    data.forEach(function(data){
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

    // Scale X-Axis
    var xTimeScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.age))
        .range([0, width]);

    // Scale Y-Axis
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.smokes)])
        .range([height, 0]);

    // Call the functions to scale the X and Y axis'
    var xAxis = d3.axisBottom(xTimeScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Create X-Axis in chartGroup 
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    // Create Y-Axis in chartGroup
    chartGroup.append("g")
        .call(yAxis);
 
    // Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset ([90, -180])
        .html(function(d){
            return (`<strong> State: ${d.state}<strong><hr> Smokers: ${d.smokes}`);
        });

    // Create the tooltip in chartGroup 
    chartGroup.call(toolTip);

    // Add and append circles to the chartGroup
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xTimeScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "15")
        .attr("fill", "lightblue")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

    // Append text to the circles 
    var textGroup = chartGroup.selectAll(".stateText")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xTimeScale(d.age))
        .attr("y", d => yLinearScale(d.smokes))
        .text(d => d["abbr"])
        .classed("stateText",true);

    // Mouseover Event
    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    })
        // Mouseout Event
        .on("mouseout", function(d){
            toolTip.hide(d);
        });

    // Label for Y-Axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokers");

    // Label for X-Axis
    chartGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.top + 10})`)
        .attr("class", "axis-text")
        .text("Age");
 
});

