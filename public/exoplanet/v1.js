v1() 

function v1() {
    //display data on svg
    var svg1 = d3.select("#v1") 
    var margin = { top: 100, right: 50, bottom: 50, left: 50 };
    var width = 1000;
    var height = 350;
    var binCount = 75;
    var betweenBars = 2;
    var svg = svg1
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ")");

    //Title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", -75)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Distance of exoplanets from earth over time");

    //create x
    var x = d3.scaleLinear()
    .range([0, width]);

    //create y
    var y = d3.scaleLinear()
    .range([height, 0]);
    
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
    var csvfile = "nasa-composite.csv"
    d3.csv(csvfile).then(
        //load and process data
        function(data) {            
            // getAllDetection(data)
            data = processData1(data,20025);

            //x axis domain
            var maxX = (d3.max(data.map(x => x.distanceln))+0.49999).toPrecision(1)
            x.domain([0,maxX])

            //Append Log x axis
            var xLog = d3.scaleLog()
            .range([0, width]).domain([1,Math.pow(10,maxX)])
            xLogAxis = d3.axisBottom(xLog)
            xLogAxis.ticks(50).tickFormat("")
            svg.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(xLogAxis)
            .append("text")
            .attr("y", 40)
            .attr("x", width/2)
            .attr("text-anchor", "middle")

            //Append x axis
            var xAxis = d3.axisBottom(x)
            xAxis.ticks(5).tickFormat(x => logTickFormat(x))
            svg.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 40)
            .attr("x", width/2)
            .attr("text-anchor", "middle")
            .text("Logarithmic distance from earth in parsecs");

            //use d3 histogram
            var histogram = d3.histogram()
            .value(function(d) { return d.distanceln; }) 
            .domain(x.domain()) 
            .thresholds(binCount)
            var bins = histogram(data);

            //y axis domain
            var maxY = d3.max(bins, function(d) { return d.length; })
            y.domain([0, maxY])         

            var yAxis = d3.axisLeft(y)
            yGridlines = d3.axisLeft(y)

            //Append y axis
            svg.append("g")
            .attr("class","yaxis")
            .call(yAxis)
            .append("text")
            .attr("y", -40)
            .attr("x", -height/2)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text("Number of Planets Discovered")

            //Append y gridlines
            svg.append("g")
            .call(yGridlines.tickSize(-width, 0, 0)
            .tickFormat(""))
            .attr("class","yGl")
            .style("opacity",0.2)

            //add histogram bars
            var bars = svg.selectAll("rect")
                .data(bins)
                .enter()
                .append("rect")
                .attr("class","hist")
                .attr("x", function(d) {return (x(d.x0)+betweenBars/2)})
                .attr("y", function(d) {return y(d.length)})
                .attr("width", function(d) { return x(d.x1) - x(d.x0) - betweenBars; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("stroke-width",2)
                .style("stroke","transparent")                
                .style("fill", "#90ee90")
                .on("mouseover", function(e, d){
                    tooltip.html("Distance: "+Math.pow(10,d.x0).toFixed(2)+" to "+Math.pow(10,d.x1).toFixed(2)+" pc"+"<br>Total discovered: "+d.length); 
                    console.log(d); 
                    d3.select(this).transition().duration(50).style("stroke", "white");
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function(e, d){return tooltip.style("top", (e.pageY+10)+"px").style("left",(e.pageX+10)+"px");})
                .on("mouseout", function(e, d){
                    d3.select(this).transition().duration(200).style("stroke", "transparent");
                    return tooltip.style("visibility", "hidden")
                ;})
            
            //legend
            var legend = svg.append("g").attr('class','legend')
            //rect
            legend.append("rect")
                .attr("fill", d3.rgb(60, 60, 60))
                .attr("x", 50)
                .attr("y", 5)
                .attr("width", 190)
                .attr("height", 40)
                .style("stroke", "grey")
            //text
            var txt1 = legend.append("text").attr("x", 55).attr("y", 20).text("Total planets discovered as of 2021").style("font-size","11px").style("text-decoration","underline")
            var txt2 = legend.append("text").attr("x", 55).attr("y", 35).text(data.length).style("font-size","11px")
            

            //filter
            var filterheight = 40
            var currentFilter = 2021
            var filter = svg.append("g").attr('class','v1filter')
            var yearmin = d3.min(data.map(x=>x.year))
            var yearmax = d3.max(data.map(x=>x.year))
            var yearscale = d3.scaleLinear()
                .range([0, width])
                .domain([yearmin,Number(yearmax)+1])
            //filter timeline
            filter.append("rect")
                .attr("class","arrowline")
                .attr("fill","lightgrey")
                .attr("pointer-events", "none")
                .style("stroke", "red")
                .style("stroke-dasharray", 10)
                .style("stroke-width", 2)
                .attr("y",-30)
                .attr("height",10)
                .attr("width",yearscale(Number(currentFilter)+0.5)-yearscale(yearmin))
            filter.append("text").text("Click to filter the timeline").attr("font-size","13px").attr("x","10").attr("y","-60").attr("font-weight","bold")
            //filter years
            for (let i = yearmin; i < Number(yearmax)+1; i++) { 
                g = filter.append("g")
                .attr("class","v1filterg")
                .attr("id",i)
                .attr("transform", "translate("+yearscale(i)+","+( -filterheight-10)+")")
                .on("mouseover", function(e){
                    tooltip.html(""); 
                    d3.select(this).select("rect").transition().duration(50).style("stroke", "red")
                    return
                })
                .on("mouseout", function(e){
                    d3.select(this).select("rect").transition().duration(200).style("stroke", "transparent")
                    return
                ;})
                .on("click", function(e){
                    currentFilter = d3.select(this).select("text").text()
                    filter.select(".arrowline").transition().duration(200).attr("width",yearscale(Number(currentFilter)+0.9)-yearscale(yearmin))
                    applyFilters(currentFilter)
                })
                g.append("rect")
                .attr("fill", "transparent")
                .attr("width", width/(yearmax-yearmin)-betweenBars)
                .attr("height", filterheight)
                .style("stroke", "transparent")
                g.append("text").text(i).attr("font-size","10px").attr("x","4").attr("y","10")
            }

            function applyFilters(currentFilter) {
                console.log("Max year:"+currentFilter)
                d3.csv(csvfile).then(
                    //load and process data
                    function(data) {
                        
                        data = processData1(data,currentFilter);
                        
                        //use d3 histogram
                        var histogram = d3.histogram()
                        .value(function(d) { return d.distanceln; }) 
                        .domain(x.domain()) 
                        .thresholds(binCount)
                        bins = histogram(data);

                        //y axis domain
                        var maxY = d3.max(bins, function(d) { return d.length; })
                        y.domain([0, maxY])         
                        


                        //animate axis
                        svg1.select(".yaxis")
                            .transition()
                            .duration(500)
                            .call(yAxis)
                        svg1.select(".yGl")
                            .transition()
                            .duration(500)
                            .call(yGridlines)
        
                        //animate bars
                        svg.selectAll(".hist")
                        .data(bins)
                        .enter()

                        svg.selectAll(".hist")
                        .transition()
                        .duration(500)
                        .attr("height", function(d) { console.log(d);return height - y(d.length) })
                        .attr("y", function(d) {return y(d.length)})


                        console.log(bins)

                        //update text
                        txt1.text("Total planets discovered as of "+currentFilter)
                        txt2.text(data.length)
                    }
                )    
            }

        }
    )

    
}


function processData1(data,max_year) {
    var processedData = [];
    
    data.forEach(function(d){
        //Filter out entries with no date
        if (d.disc_year == "" || d.disc_year > max_year) return;
        //Count frequency of years for histogram
        var p = {
            name: d.pl_name,
            year: d.disc_year,
            distance: d.sy_dist,
            distanceln: Math.log10(d.sy_dist)
        }
        processedData.push(p)
    });
    return processedData
}

function logTickFormat(x) {
    if (x !== Math.floor(x)) return ""
    return `10${(x + "").replace(/./g, c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c] || "⁻")}`;
  }