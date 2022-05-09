// Dataset url given for project
let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Use constructor to create a new XMLHttpRequest object
let req = new XMLHttpRequest();

let baseTemp;
let monthlyVarArr = [];

let xScale;
let yScale;

let width = 1000;
let height = 1000;
let padding = 100;

let svg = d3.select('#heat-map')
                .append('svg')
                .attr('id', 'heat-map-svg');              

req.open('GET', url, true);
req.send();
req.onload = () => {
    // console.log(req.responseText);

    let json = JSON.parse(req.responseText);
    baseTemp = json.baseTemperature;
    monthlyVarArr = json.monthlyVariance;

    // console.log(baseTemp);
    // console.log(monthlyVarArr);

    // Generate scales
    // Draw cells
    // Draw axes

    //Create min & max year variables
    let minYear = d3.min(monthlyVarArr, (d) => d["year"]);
    let maxYear = d3.max(monthlyVarArr, (d) => d["year"]);

    // Create an x and y scale
    xScale = d3.scaleLinear()
                .domain([minYear, maxYear + 1]) // Add 1 to max year to fit all data
                .range([padding, width - padding])

    yScale = d3.scaleTime()
                .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)]) //#9 vertical position
                // .domain([new Date(0, 11, 16), new Date(1, 11, 16)])
                .range([padding, height - padding])

    // Add axes
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"))

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%B")) // #11 yAxis ticks

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (height - padding) + ")");

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ", 0)");

    // #16 Tooltip
    let tooltip = d3.select("#heat-map")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "2px")
                    .style("border-radius", "5px")
                    .style("padding", "5px");
    var mouseover = function(d) {
        tooltip.style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function(event, d) {
        tooltip.attr("data-year", d.year)
                .html(d.year)
                .style("left", (d3.pointer(event)[0]) + "px")
                .style("top", (d3.pointer(event)[1]) + "px")
    }
    var mouseleave = function(d) {
        tooltip.style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }                

    // #5 Add rect elements, #6 Add fill colours, #7/8 Add cell properties
    // #9 Vertical position, #10 Horizontal position
    svg.selectAll("rect")
        .data(monthlyVarArr)
        .enter()
        .append("rect")
        .attr("id", "data-point")
        .attr("class", "cell")
        .attr("fill", (d) => {
            if(d.variance < -1.5) {
                return "rgb(69, 117, 180)";
            }
            else if(d.variance < -0.5) {
                return "rgb(171, 217, 233)";
            }
            else if(d.variance < 0.5) {
                return "rgb(255, 255, 191)";
            }
            else if(d.variance < 1.5) {
                return "rgb(253, 174, 97)";
            }
            else {
                return "rgb(215, 48, 39)";
            }})
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => baseTemp + d.variance)
        .attr("height", (height - padding * 2) / 12)
        .attr("y", (d) => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
        .attr("width", (width - padding * 2) / (maxYear - minYear))
        .attr("x", (d) => xScale(d.year))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    
    let legendArr = [
        {color: "rgb(69, 117, 180)", text:"var < 1.5"},
        {color: "rgb(171, 217, 233)", text:"-0.5 < var < -1.5"},
        {color: "rgb(255, 255, 191)", text:"-0.5 < var < +0.5"},
        {color: "rgb(253, 174, 97)", text:"+0.5 < var < +1.5"},
        {color: "rgb(215, 48, 39)", text:"var > +1.5"}
    ];
    
    let legend = d3.select("#legend")
                    .append("svg")
                    .attr("id", "legend-svg")

    legend.selectAll("rect")
            .data(legendArr)
            .enter()
            .append("rect")
            .attr("fill", d => d.color)
            .attr("height", 20)
            .attr("y", 0)
            .attr("width", 20)
            .attr("x", (d, i) => i * 150 + 100)
            
    legend.selectAll("text")
            .data(legendArr)
            .enter()
            .append("text")
            .attr("fill", d => d.color)
            .attr("y", 11.25)
            .attr("x", (d, i) => i * 150 + 125)
            .text(d => d.text)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")  


    // Tooltip Testing

    // let square = d3.select("#test")
    // .append("svg")
    // .attr("width", 1000)
    // .attr("height", 400)

    // let testData = [400, 500, 600];

    // var testTooltip = d3.select("#test")
    // .append("div")
    // // .style("position", "absolute")
    // // .style("visibility", "hidden")
    // // .text("I'm a circle!")
    // .style("opacity", 0)
    // .attr("class", "tooltip")
    // .style("background-color", "white")
    // .style("border", "solid")
    // .style("border-width", "2px")
    // .style("border-radius", "5px")
    // .style("padding", "5px")

    // // Three function that change the tooltip when user hover / move / leave a cell
    // var mouseoverTest = function(d) {
    //     testTooltip
    //     .style("opacity", 1)
    //     d3.select(this)
    //     .style("stroke", "black")
    //     .style("opacity", 1)
    // }

    // var mousemoveTest = function(d) {
    //     testTooltip
    //     .text("The exact value of<br>this cell is: ")
    //     .style("top", (1200)+"px")
    //     .style("left",(475)+"px")
    // }

    // var mouseleaveTest = function(d) {
    //     testTooltip
    //     .style("opacity", 0)
    //     d3.select(this)
    //     .style("stroke", "none")
    //     .style("opacity", 0.8)
    // }

    // square.selectAll("rect")
    // .data(testData)
    // .enter()
    // .append("rect")
    // .attr("id", "circleBasicTooltip")
    // .attr("x", d => d)
    // .attr("y", 200)
    // .attr("width", 40)
    // .attr("height", 40)
    // .attr("fill", "#69b3a2")
    // .on("mouseover", mouseoverTest)
    // .on("mousemove", function(event, d) {
    //     testTooltip
    //     .text(d)
    //     .style("left", (d3.pointer(event)[0]) + "px")
    //     .style("top", (d3.pointer(event)[1] + 1000) + "px")
    // })
    // .on("mouseleave", mouseleaveTest)
}


