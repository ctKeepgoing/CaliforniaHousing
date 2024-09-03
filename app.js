function assignment8(){
    var filePath="housing.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}

var question1=function(filePath){
    let rowConverter = function (d) {

        // read the data
        return {
            households: parseInt(d.households),
            age: parseInt(d.housing_median_age),
            latitude: parseFloat(d.latitude),
            longitude: parseFloat(d.longitude),
            house_value: parseInt(d.median_house_value),
            income: parseInt(d.median_income)*1000,
            ocean_proximity: d.ocean_proximity,
            population: parseInt(d.population),
            total_bedrooms: parseInt(d.total_bedrooms),
            total_rooms: parseInt(d.total_rooms)
        }
    } // row converter
    const housing = d3.csv(filePath, rowConverter);
    housing.then(function (data) {
        //console.log(data);
        // Calculate mean and standard deviation for height and weight
        const priceMean = d3.mean(data, d => d.house_value);
        const priceDeviation = d3.deviation(data, d => d.house_value);

        const populationMean = d3.mean(data, d => d.population);
        const populationDeviation = d3.deviation(data, d => d.population);

        // Set the dimensions of the plot
        const margin = { top: 50, right: 100, bottom: 30, left: 80 };
        const width = 800;
        const height = 800;

        // Create svg
        const svg = d3.select("#q1_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");;

        // Set the scales for the x and y axes
        const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.house_value), d3.max(data, d => d.house_value)])
        .range([50, width - 50]);

        const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.population), d3.max(data, d => d.population)])
        .range([height - 50, 50]);

        // Add the x-axis
        svg.append("g")
        .attr("transform", "translate(0," + (height - 50) + ")")
        .call(d3.axisBottom(xScale));

        // Add the y-axis
        svg.append("g")
        .attr("transform", "translate(50,0)")
        .call(d3.axisLeft(yScale));

        // Add circle to plot
        svg.selectAll("circle")
        .data(data).enter()
        .append("circle")
        .attr("cx", d => xScale(d.house_value))
        .attr("cy", d => yScale(d.population))
        .attr("r", 1.7)
        .attr("fill", d=>
        {
            const priceDistance = Math.abs(d.house_value - priceMean);
            const popDistance = Math.abs(d.population - populationMean);
            if (priceDistance > 2 * priceDeviation || popDistance > 2 * populationDeviation) {
                return "red"; 
        } else {
                return "steelblue"; 
                }
                }) // fill

    
    // Add x-axis label
    svg.append("text")
    .attr("transform", "translate(" + (width/2) + "," + (height - 10) + ")")
    .style("text-anchor", "middle")
    .text("House Price in USD");

    // Add y-axis label
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -20)
    .attr("x", 0 - (height/2) )
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Population");

    // Add the legend
    const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(50, 20)");

    const legendData = [
    { label: "Outlier", color: "red" },
    { label: "Typical points", color: "blue" }
    ];

    legend.selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * 20)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", d => d.color);

    legend.selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", 20)
    .attr("y", (d, i) => i * 20 + 10)
    .text(d => d.label);

    // Add title
    svg.append("text")
    .attr("x", width / 2 + 200)
    .attr("y", 100)
    .attr("class", "title")
    .text("Population and House Price Relationship in California");

    // Add slider
    var range = [d3.min(data, d => d.house_value), d3.max(data, d => d.house_value)];

// Create the slider
    var slider = d3.sliderHorizontal()
    .min(range[0])
    .max(range[1])
    .step(10000)
    .width(400)
    .tickFormat(d3.format("$.2s"))
    .default([range[0], range[1]])
    .on('onchange', val => {
        var filteredData = data.filter(d => d.house_value >= val[0] && d.house_value <= val[1]);
        svg.selectAll("circle")
        .data(filteredData)
        .transition()
        .duration(500)
        .attr("cx", d => xScale(d.house_value))
        .attr("cy", d => yScale(d.population));
    });

    var sliderGroup = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + 50 + "," + (height - 30) + ")")
    .call(slider);

    }); // housing closing line

}
var question2=function(filePath){
    let rowConverter = function (d) {

        // read the data
        return {
            households: parseInt(d.households),
            age: parseInt(d.housing_median_age),
            latitude: parseFloat(d.latitude),
            longitude: parseFloat(d.longitude),
            house_value: parseInt(d.median_house_value),
            income: parseInt(d.median_income),
            ocean_proximity: d.ocean_proximity,
            population: parseInt(d.population),
            total_bedrooms: parseInt(d.total_bedrooms),
            total_rooms: parseInt(d.total_rooms)
        }
    } // row converter
    const housing = d3.csv(filePath, rowConverter);
    housing.then(function (data) {

    

        const averageHouse = d3.rollup(
            data,
            v => d3.mean(v, d => d.house_value),
            d => d.ocean_proximity
        );
        

        const dataArray = Array.from(averageHouse, ([ocean_proximity, average_house_value]) => ({
            ocean_proximity,
            average_house_value
        }));

        

        const margin = { top: 100, right: 20, bottom: 100, left: 80 };
        const width = 960 - margin.left - margin.right;
        const height = 800 - margin.top - margin.bottom;
        
        const x = d3.scaleBand()
        .domain(dataArray.map(d => d.ocean_proximity))
            .range([0, width])
            .padding(0.1);
            
        const y = d3.scaleLinear()
            .domain([0, d3.max(dataArray, d => d.average_house_value)])
            .range([height, 0]);
        
        const color = d3.scaleSequential(d3.interpolateYlGnBu)
        .domain([0, d3.max(dataArray, function(d) { return d.average_house_value; })]);
            
            const svg = d3.select("#q2_plot").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
            
            var bars = svg.selectAll(".bar")
            .data(dataArray)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.ocean_proximity))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.average_house_value))
            .attr("height", d => height - y(d.average_house_value))
            .attr("fill", d => color(d.average_house_value));
            
            svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
            
            svg.append("g")
            .call(d3.axisLeft(y));
        // Add x-axis label
        svg.append("text")
        .attr("transform", "translate(" + (width/2) + "," + (height + 50) + ")")
        .style("text-anchor", "middle")
        .text("Ocean Proximity");

        // Add y-axis label
        svg.append("text")
        .attr("y", -20)
        .attr("x", (height/2) - 270 )
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average House Price");
        
        // Add title
        svg.append("text")
        .attr("x", width / 2)
        .attr("y", -60)
        .attr("class", "title")
        .text("Ocean Proximity and Average House Price in California");

        // Add the button and event listener
        function update(sortedData) {
            svg.selectAll(".bar")
            .data(sortedData)
            .transition() 
            .duration(500) 
            .attr("x", (d) => x(d.ocean_proximity))
            .attr("y", (d) => y(d.average_house_value))
            .attr("height", (d) => height - y(d.average_house_value))
            .attr("fill", (d) => color(d.average_house_value));
        
            x.domain(sortedData.map((d) => d.ocean_proximity));
            svg.select(".x.axis")
            .transition() 
            .duration(500) 
            .call(d3.axisBottom(x));
        }

        d3.select('#sort_button')
                .on('click', function(){
                    const sortedData = dataArray.sort((a, b) => d3.ascending(a.average_house_value, b.average_house_value));
                    update(sortedData);
                });

        }); // housing 

    
}
var question3=function(filePath){
    let rowConverter = function (d) {

        // read the data
        return {
            households: parseInt(d.households)/100,
            age: parseInt(d.housing_median_age),
            latitude: parseFloat(d.latitude),
            longitude: parseFloat(d.longitude),
            house_value: parseInt(d.median_house_value),
            income: parseFloat(d.median_income),
            ocean_proximity: d.ocean_proximity,
            population: parseInt(d.population),
            total_bedrooms: parseInt(d.total_bedrooms),
            total_rooms: parseInt(d.total_rooms)
        }
    } // row converter
    const housing = d3.csv(filePath, rowConverter);
    housing.then(function (data) {
        const priceRanges = [
            { label: '0 - 100k', min: 0, max: 100000 },
            { label: '100k - 200k', min: 100000, max: 200000 },
            { label: '200k - 300k', min: 200000, max: 300000 },
            { label: '300k - 400k', min: 300000, max: 400000 },
            { label: '400k - 500k', min: 400000, max: 510000 },
        ];
        // Group the data by price range category
    const dataByPriceRange = priceRanges.map(priceRange => {
    const filteredData = data.filter(d => d.house_value >= priceRange.min && d.house_value < priceRange.max);
    return {
        priceRange: priceRange.label,
        age: d3.median(filteredData, d => d.age),
        households: d3.median(filteredData, d => d.households),
        income: d3.median(filteredData, d => d.income),
        };
    });

    // Get the maximum value of the stacked data
        const maxYValue = d3.max(dataByPriceRange, d => d.age + d.households + d.income);

    

    // Draw the stacked bar chart
    const margin = { top: 150, right: 20, bottom: 100, left: 40 };
    const width = 800;
    const height = 800;

    const svg = d3.select("#q3_plot").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .domain(dataByPriceRange.map(d => d.priceRange));

    const y = d3.scaleLinear()
                .rangeRound([height, 0])
                .domain([0, maxYValue]);

    const colors = ['#98abc5', '#8a89a6', '#7b6888'];
    const stackedData = d3.stack()
    .keys(['age', 'households', 'income'])(dataByPriceRange);
    

        svg.selectAll('.serie')
        .data(stackedData)
        .enter().append('g')
        .attr('class', 'serie')
        .attr('fill', (d, i) => colors[i])
        .selectAll('rect')
        .data(d => d)
        .enter().append('rect')
        .attr('x', d => x(d.data.priceRange))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth());

        // Add x-axis
        svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

        // Add y-axis
        svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y).ticks(10, 's'))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Median Values');

        // Add legend
        const legend = svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('text-anchor', 'end')
        .selectAll('g')
        .data(['Age', 'Households', 'Income'].reverse())
        .enter().append('g')
        .attr('transform', (d, i) => `translate(0,${i * 20})`);

        legend.append('rect')
        .attr('x', width/2 +50)
        .attr('width', 19)
        .attr('height', 19)
        .attr('fill', (d, i) => colors[i]);

        legend.append('text')
        .attr('x', width/2 +45)
        .attr('y', 9.5)
        .attr('dy', '0.32em')
        .text(d => d);

        // Add x-axis label
        svg.append("text")
        .attr("transform", "translate(" + (width/2) + "," + (height + 50) + ")")
        .style("text-anchor", "middle")
        .text("House Price Range");

        // Add y-axis label
        svg.append("text")
        .attr("y", -20)
        .attr("x", (height/2) - 220 )
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Combined Value of Age, Income, and Household Count");
        
        // Add title
        svg.append("text")
        .attr("x", width / 2)
        .attr("y", -60)
        .attr("class", "title")
        .text("Price Ranges and the Stacked Composition of Age, Income, and Household Count");
    }); // housing

}
var question4=function(filePath){
    let rowConverter = function (d) {

        // read the data
        return {
            households: parseInt(d.households),
            age: parseInt(d.housing_median_age),
            latitude: parseFloat(d.latitude),
            longitude: parseFloat(d.longitude),
            house_value: parseInt(d.median_house_value),
            income: parseInt(d.median_income),
            ocean_proximity: d.ocean_proximity,
            population: parseInt(d.population),
            total_bedrooms: parseInt(d.total_bedrooms),
            total_rooms: parseInt(d.total_rooms)
        }
    } // row converter
    const housing = d3.csv(filePath, rowConverter);
    housing.then(function (data) {

        // Calculate outlier thresholds
        const prices = data.map(d => d.house_value);
        const q1 = d3.quantile(prices, 0.25);
        const q3 = d3.quantile(prices, 0.75);
        const iqr = q3 - q1;
        const lowerThreshold = q1 - 1.5 * iqr;
        const upperThreshold = q3 + 1.5 * iqr;


        const margin = { top: 20, right: 20, bottom: 150, left: 40 };

        const width = 800;
        const height = 800;
        const svg = d3.select('#q4_plot').append('svg')
        .attr("id", "bubble-map")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

        d3.json('california-counties.geojson').then(geoData => {

        const projection = d3.geoAlbersUsa()
            .translate([width / 2 + 1200, height / 2 + 200])
            .scale(4000);
        const path = d3.geoPath().projection(projection);

        const tooltip = d3.select("#q4_plot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#dbfc05")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

            geoData.features.forEach(feature => {
                if (feature.geometry.type === "Polygon") {
                    feature.geometry.coordinates = feature.geometry.coordinates.map(polygon =>
                        polygon.map(coord => [parseFloat(coord[0].toFixed(2)), parseFloat(coord[1].toFixed(2))])
                    );
                } else if (feature.geometry.type === "MultiPolygon") {
                    feature.geometry.coordinates = feature.geometry.coordinates.map(multiPolygon =>
                        multiPolygon.map(polygon =>
                            polygon.map(coord => [parseFloat(coord[0].toFixed(2)), parseFloat(coord[1].toFixed(2))])
                        )
                    );
                }
            });
            svg.selectAll("path")
                .data(geoData.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", "#f0f0f0")
                .style("stroke", "#636363")
                .on("mouseover", (event, d) => {
                    tooltip
                        .style("opacity", 1)
                        .html(d.properties.name);
                })
                .on("mousemove", (event) => {
                    tooltip
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 10) + "px")
                        .style("opacity", 1)
                        .html(d.properties.name);
                })
                .on("mouseout", () => {
                    tooltip.style("opacity", 0);
                });

            // Plot the bubbles
            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => projection([d.longitude, d.latitude])[0])
                .attr("cy", d => projection([d.longitude, d.latitude])[1])
                .attr("r", d => Math.sqrt(d.house_value) / 300) 
                .style("fill", d => (d.house_value < lowerThreshold || d.house_value > upperThreshold) ? "#fc036f" : "#4169E1")
                .style("opacity", 0.6);
            
            // Add title
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", 40)
                .attr("class", "title")
                .text("Distribution of House Value in California");

            // Add legend
            const legendData = [
                { label: "Less than 482k ", color: "#4169E1" },
                { label: "More than 482k", color: "#fc036f" }
            ];

            const legend = svg.selectAll(".legend")
                .data(legendData)
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(${width - 150},${i * 20 + 50})`);

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", d => d.color);

            legend.append("text")
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(d => d.label);



        }); // california geo

    }); // housing 

    
}
var question5=function(filePath){
    let rowConverter = function (d) {

        // read the data
        return {
            households: parseInt(d.households),
            age: parseInt(d.housing_median_age),
            latitude: parseFloat(d.latitude),
            longitude: parseFloat(d.longitude),
            house_value: parseInt(d.median_house_value),
            income: parseInt(d.median_income),
            ocean_proximity: d.ocean_proximity,
            population: parseInt(d.population),
            total_bedrooms: parseInt(d.total_bedrooms),
            total_rooms: parseInt(d.total_rooms)
        }
    } // row converter
    const housing = d3.csv(filePath, rowConverter);
    housing.then(function (data) {

        const populationSubclasses = [
            {min: 0, max: 3000}, {min: 3001, max: 4000}, {min: 4001, max: 5000}, {min: 5001, max: 6000}, {min: 6001, max: 7000},
            {min: 7001, max: 8000}, {min: 8001, max: 9000}, {min: 9001, max: 10000}, {min: 10001, max: 11000}, {min: 11001, max: 12000},
            {min: 12001, max: 13000}, {min: 13001, max: 14000}, {min: 14001, max: 15000}, {min: 15001, max: 16000}, {min: 16001, max: 17000},
            {min: 17001, max: 18000}, {min: 18001, max: 19000}, {min: 19001, max: 20000}, {min: 20001, max: 21000},{min: 21001, max: 22000},
            {min: 22001, max: 23000}, {min: 23001, max: 24000}, {min: 24001, max: 25000}, {min: 25001, max: 26000}, {min: 26001, max: 27000},
            {min: 27001, max: 28000}, {min: 28001, max: 29000}, {min: 29001, max: 30000}, {min: 30001, max: 31000}, {min: 31001, max: 32000},
            {min: 32001, max: 33000}, {min: 33001, max: 34000}, {min: 34001, max: 35000}, {min: 35001, max: 36000}];

        const pop_class = ["0-3000", "3001-4000", "4001-5000", "5001-6000", "6001-7000","7001-8000","8001-9000","9001-10000","10001-11000","11001-12000",
        "12001-13000","13001-14000","14001-15000","15001-16000", "16001-17000", "17001-18000", "18001-19000", "19001-20000", "20001-21000",
        "21001-22000", "22001-23000", "23001-24000", "24001-25000", "25001-26000", "26001-27000", "27001-28000", "28001-29000" , "29001-30000",
        "30001-31000", "31001-32000", "32001-33000", "33001-34000", "34001-35000", "35001-36000"];
        
        const ocean_prop = Array.from(new Set(data.map(d => d.ocean_proximity)));
        
        const dataArray = [];
        
        for (let i = 0; i < ocean_prop.length; i++) {
            for (let j = 0; j < populationSubclasses.length; j++) {
                const oceanProximity = ocean_prop[i];
                const populationSubclass = populationSubclasses[j];
                const filteredData = data.filter(d => d.ocean_proximity === oceanProximity && d.population >= populationSubclass.min && d.population <= populationSubclass.max);
                const totalHouseValue = filteredData.reduce((total, d) => total + d.house_value, 0);
                const medianHouseValue = totalHouseValue / filteredData.length;
        
                dataArray.push({
                    ocean_proximity: oceanProximity,
                    populationSubclass: `${populationSubclass.min}-${populationSubclass.max}`,
                    medianHouseValue
                });
            }
        }

        // Filter out data points with NaN medianHouseValue
        const filteredDataArray = dataArray.filter(d => !isNaN(d.medianHouseValue));

        // Define SVG dimensions
        const width = 1000;
        const height = 1000;
        const margin = {top: 100, right: 50, bottom: 100, left: 150};

        // Create an SVG container
        const svg = d3.select("#q5_plot")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Create scales
        const xScale = d3.scaleBand()
            .domain(ocean_prop)
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3.scaleBand()
            .domain(pop_class)
            .range([height - margin.bottom, margin.top])
            .padding(0.1);

        const colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain(d3.extent(filteredDataArray, d => d.medianHouseValue));
        
        // Adding tooltip
        const tooltip = d3.select("#q5_plot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#dbfc05")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

        // Draw heatmap rectangles
        svg.selectAll("rect")
            .data(filteredDataArray)
            .join("rect")
            .attr("x", d => xScale(d.ocean_proximity))
            .attr("y", d => yScale(d.populationSubclass))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("fill", d => colorScale(d.medianHouseValue))
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html("Median house value: " + Math.round(d.medianHouseValue));
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px")
                    .style("opacity", 1)
                    .html("Median house value: " + Math.round(d.medianHouseValue));
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });;

        // Draw axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);

        // Add axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom / 2)
            .attr("text-anchor", "middle")
            .text("Ocean Proximity");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2 )
            .attr("y", margin.left / 2 )
            .attr("text-anchor", "middle")
            .text("Population");

        // Add graph title
        svg.append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("class", "title")
        .text("Heatmap of Median House Price by Ocean Proximity and Population");

                

    }); // housing 

    
}

