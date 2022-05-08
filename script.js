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

req.open('GET', url, true);
req.send();
req.onload = () => {
    // console.log(req.responseText);

    let json = JSON.parse(req.responseText);
    baseTemp = json.baseTemperature;
    monthlyVarArr = json.monthlyVariance;

    // console.log(baseTemp);
    console.log(monthlyVarArr);

    // Generate scales
    // Draw cells
    // Draw axes

    // Create an x and y scale
    xScale = d3.scaleLinear()
                .domain([d3.min(monthlyVarArr, (d) => d["year"]), d3.max(monthlyVarArr, (d) => d["year"])])
                .range([padding, width - padding])

    yScale = d3.scaleTime()
                // .domain([new Date(0, 11, 16), new Date(1, 11, 16)])
                .domain([new Date(0, 0), new Date(0, 12)])
                .range([padding, height - padding])

    // Add axes
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (height - padding) + ")");

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ", 0)");

    // #5 Add rect elements, #6 Add fill colours, #7/8 Add cell properties
    svg.selectAll("rect")
        .data(monthlyVarArr)
        .enter()
        .append("rect")
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
        // .attr("y", (d) => yScale(new Date(0, d.month - 1)))
}


