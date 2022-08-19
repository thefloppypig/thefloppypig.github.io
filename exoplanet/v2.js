v2()

//2nd visualization
function v2() {
    var csvfile = "exoplanet.eu_catalog.csv"
    var detection_types = [
        "Radial Velocity",
        "Imaging",
        "Default",
        "Primary Transit",
        "Timing",
        "Astrometry",
        "TTV",
        "Disk Kinematics",
        "Microlensing"
      ]
    var color_palette = ["#ff6566",
    "#3c9b00",
    "#8b14a1",
    "#7f68f3",
    "#d99a00",
    "#0070b4",
    "#b53f00",
    "#45d6f6",
    "#707e00",
    "#f0b0fd",
    "#a0d487",
    "#f1bd7a",
    "#988b56"]

    //display data on svg
    var svg2 = d3.select("#v2") 
    var margin = { top: 50, right: 50, bottom: 50, left: 50 };
    var width = 1000;
    var height = 400;
    var betweenBars = 5
    var svg2 = svg2
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ")");

    //Title
    svg2.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Techniques used to find exoplanets over time");

    //create x
    var x = d3.scaleBand()
    .range([0, width]);

    //create y
    var y = d3.scaleLinear()
    .range([height, 0]);

    //color axis
    var color = d3.scaleOrdinal()
    .domain(detection_types)
    .range(color_palette)

    //tooltip
    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#000000aa")
    .style("padding", "5px")
    .style("border-style", "double")
    .text("text")

    
    //loading data 
    var keys = []

    var xAxis
    var yAxis
    var maxBarHeight
    // d3.csv("nasa.csv").then(function(data) {
    //     var alltechniques = [];

    //     data.forEach(function(d){
    //         if (!alltechniques.includes(d.discoverymethod)) {
    //             alltechniques.push(d.discoverymethod)
    //         }
    //     });
    //     console.log(alltechniques)
    // })
    d3.csv(csvfile).then(
        //load and process data
        function(data) {            
            // getAllDetection(data)
            data = processData(data,[]);

            keys = Object.keys(data).concat([1990,1991,1993,1994,1997]).sort()
            var counts = Object.values(data).map(x => x.objects.length)

            var stackedData = [];
            stackedData = d3.stack().keys(detection_types).value((obj, key) => obj[key])(Object.values(data))
            console.log(stackedData)

            //axis domains
            x.domain(keys)
            y.domain([
                d3.min(counts),
                d3.max(counts)
            ])

            yAxis = d3.axisLeft(y)
            yGridlines = d3.axisLeft(y)

            //Append x axis
            svg2.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("y", 40)
            .attr("x", width/2)
            .attr("text-anchor", "middle")
            .text("Year");

            //Append y axis
            svg2.append("g")
            .call(yAxis)
            .attr("class","yaxis")
            .append("text")
            .attr("y", -40)
            .attr("x", -height/2)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text("Number of Planets Discovered")

            //Append y gridlines
            svg2.append("g")
            .call(yGridlines.tickSize(-width, 0, 0)
            .tickFormat(""))
            .attr("class","yGl")
            .style("opacity",0.2)
            
            //show bars
            svg2.append("g")
                .selectAll("g")
                .data(stackedData)
                .enter().append("g")
                .attr("class","layer")
                .attr("fill", function(d) { return color(d.key); })
                .on("mouseover", function(e, d){
                    return tooltip.html("Technique: "+ d.key+"<br>"+tooltip.html()); 
                })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("class","bar")
                .attr("x", function(d) { return x(d.data.year)+betweenBars/2; })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width",x.bandwidth()-betweenBars)
                .style("stroke", "transparent")
                .style("stroke-width", "3px")
                .on("mouseover", function(e, d){
                    tooltip.html("Year: "+d.data.year+"<br>Planets discovered: "+(d[1]-d[0])); 
                    console.log(d); 
                    d3.select(this).transition().duration(200).style("stroke", "white");
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function(e, d){return tooltip.style("top", (e.pageY+10)+"px").style("left",(e.pageX+10)+"px");})
                .on("mouseout", function(e, d){
                    d3.select(this).transition().duration(200).style("stroke", "transparent");
                    return tooltip.style("visibility", "hidden")
                ;})
                .transition()
                .duration(500)
                
                //legend
                var legend = svg2.append("g").attr('class','legend')
                legend.append("text").attr("x", 67).attr("y", -5).text("Click to filter").style("font-size","11px").style("font-weight","bold")

                //rect
                legend.append("rect")
                    .attr("fill", d3.rgb(60, 60, 60))
                    .attr("x", 50)
                    .attr("y", 0)
                    .attr("width", 100)
                    .attr("height", 115)
                    .style("stroke", "grey")
                //containers
                var active_filters = []
                var legendItems = legend.selectAll(".legendItem")
                    .data(detection_types)
                    .enter().append("g")
                    .attr("class","legendItem")
                    .attr("v2type",function(d){return d})
                    .attr("transform", function(d,i){return "translate(55,"+(i*12+10)+")"})
                    .on("mouseover", function(e,d){
                        d3.select(this)
                        .select("circle")
                        .style("stroke", "grey");
                        d3.select(this).select("text").style("fill", "grey").style("color", "grey")
                    })
                    .on("mouseout", function(e,d){
                        d3.select(this)
                        .select("circle")
                        .style("stroke", color(d));
                        d3.select(this).select("text").style("fill", "").style("color", "")
                    })
                    .on("click",function(e,d){          
                        var index = active_filters.indexOf(d)      
                        if (index > -1) {
                            //remove from filter
                            d3.select(this).select("circle").style("fill", color(d))
                            active_filters.splice(index, 1)
                        }
                        else {
                            //add to filter
                            d3.select(this).select("circle").style("fill", "transparent")
                            active_filters.push(d)
                        }
                        applyFilters(active_filters)
                    });
                //line
                legendItems.append("circle")
                    .attr("cx", 6)
                    .attr("cy", -3)
                    .attr("r", 4)
                    .style("fill", function(d) { return color(d); })
                    .style("stroke", function(d) {color(d)});
                    
                //text
                legendItems.append("text")
                    .text(function(d) { return d; })
                    .style("font-size","10px")
                    .attr("text-anchor", "right")
                    .attr("alignment-baseline", "middle")
                    .attr("transform", function(d){return "translate(15,0)"})
                    
        }
    )

    function applyFilters(filtered_detections) {
        console.log(filtered_detections)
        d3.csv(csvfile).then(
            //load and process data
            function(data) {
                
                data = processData(data,filtered_detections);
                var counts = Object.values(data).map(x => x.objects.length)
                maxBarHeight = d3.max(counts)
        
                var stackedData = [];
                stackedData = d3.stack().keys(detection_types).value((obj, key) => obj[key])(Object.values(data))
                console.log(stackedData)
        
                //axis domains
                x.domain(keys)
                y.domain([
                    0,
                    maxBarHeight
                ])
        
                var betweenBars = 5
                
                //animate axis
                svg2.select(".yaxis")
                    .transition()
                    .duration(500)
                    .call(yAxis)
                svg2.select(".yGl")
                    .transition()
                    .duration(500)
                    .call(yGridlines)

                //animate bars
                layers = svg2.selectAll(".layer")
                .data(stackedData,function (d) { return d.key})
                .selectAll("rect")
                .data(function(d) { return d; })
                
                svg2.selectAll(".layer").selectAll("rect")
                    .transition()
                    .duration(500)
                    .attr("y", function(d) { return y(d[1]) })
                    .attr("height", function(d) {  return y(d[0]) - y(d[1]) })
            }
        )    
    }
}

function processData(data,filtered_detections) {
    var processedData = {};
    
    data.forEach(function(d){
        //Filter out entries with no date
        if (d.discovered == "") return;
        //Count frequency of years for histogram
        if (!processedData.hasOwnProperty(d.discovered)) {
            processedData[d.discovered] = {
                objects: [], 
                year: d.discovered, 
                "Radial Velocity":0,
                "Imaging":0,
                "Default":0,
                "Primary Transit":0,
                "Timing":0,
                "Astrometry":0,
                "TTV":0,
                "Disk Kinematics":0,
                "Microlensing":0,
                total :0
            } 
        }
        if (!filtered_detections.includes(d.detection_type)) {
            processedData[d.discovered].objects.push(d) 
            processedData[d.discovered][d.detection_type] += 1
            processedData[d.discovered]["total"] += 1
        }
    });
    return processedData
}

function getAllDetection(data) {
    var all_detection_types = []
    data.forEach(function(d){
        if (!all_detection_types.includes(d.detection_type)) {
            all_detection_types.push(d.detection_type)
        }
    })
    console.log(all_detection_types)

}