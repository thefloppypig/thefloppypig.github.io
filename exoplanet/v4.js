v4()

function v4() {
    var maxTP = 700
    var maxTA = 650
    //display data on svg
    var svg4 = d3.select("#v4") 
    var margin = { top: 50, right: 50, bottom: 50, left: 50 };
    var width = 1000;
    var height = 400;
    var svg = svg4
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ")");

    //Title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Temperature of exoplanets at periastron vs apastron");

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

    d3.csv("habitable-zone.csv").then(
        //load and process data
        async function(data) {
            processedData = []
            data.forEach(function(d){
                if (d.TEQB>maxTP || d.TEQD>maxTA) return
                p = {
                    name: d.PLANET.trim(),
                    t_peri: parseFloat(d.TEQB) -273.15,
                    t_apa: parseFloat(d.TEQD) -273.15,
                    hzPerc: parseFloat(d.THZO),
                    period: parseFloat(d.PERIOD),
                    ecc: parseFloat(d.ECC),
                    obj: d,
                    solarsystem: false
                }
                processedData.push(p)
            })
            data = processedData
            data = await addSolarSystemHZG(data)
            console.log(data)

            //axis domains
            x.domain([-273.15,d3.max(Object.values(data).map(x => x.t_apa))])
            y.domain([-273.15,d3.max(Object.values(data).map(x => x.t_peri))])
            
            //color axis
            var pc = ["#88d483",
            "#009238",
            "#408fe9",
            "#8a5ef8",
            "#d44cc3"]
            var color = d3.scaleSequential(function (c) {
                if (c<10) return pc[0]
                if (c<100) return pc[1]
                if (c<1000) return pc[2]
                if (c<10000) return pc[3]
                else return pc[4]
            })
            
            //Append x gridlines
            svg.append("g")
            .call(d3.axisBottom(x).tickSize(height)
            .tickFormat(""))
            .attr("class","xGl")
            .style("opacity",0.05)
            
            //Append y gridlines
            svg.append("g")
            .call(d3.axisLeft(y).tickSize(-width)
            .tickFormat(""))
            .attr("class","yGl")
            .style("opacity",0.05)
            
            //sz highlighting
            var cols = ["#4dff00","#fff200","#ff0000"]
            var minCZt = -67.7
            var maxCZt = 56.7
            var minSZt = -101.111
            var maxSZt = 287.8
            svg.append("line").style("stroke",cols[0]).attr("stroke-opacity","0.5").attr("x1",x(x.domain()[0])).attr("y1",y(minCZt)).attr("x2",x(minCZt)).attr("y2",y(minCZt))
            svg.append("line").style("stroke",cols[0]).attr("stroke-opacity","0.5").attr("x1",x(minCZt)).attr("y1",y(minCZt)).attr("x2",x(minCZt)).attr("y2",y(y.domain()[0]))
            svg.append("line").style("stroke",cols[0]).attr("stroke-opacity","0.5").attr("x1",x(x.domain()[0])).attr("y1",y(maxCZt)).attr("x2",x(maxCZt)).attr("y2",y(maxCZt))
            svg.append("line").style("stroke",cols[0]).attr("stroke-opacity","0.5").attr("x1",x(maxCZt)).attr("y1",y(maxCZt)).attr("x2",x(maxCZt)).attr("y2",y(y.domain()[0]))
            svg.append("polygon").attr("fill",cols[0]).attr("fill-opacity","0.1").attr("points",x(x.domain()[0])+","+y(minCZt)+" "+x(x.domain()[0])+","+y(maxCZt)+" "+x(maxCZt)+","+y(maxCZt)+" "+x(maxCZt)+","+y(y.domain()[0])+" "+x(minCZt)+","+y(y.domain()[0])+" "+x(minCZt)+","+y(minCZt))
            
            svg.append("line").style("stroke",cols[1]).attr("stroke-opacity","0.5").attr("x1",x(x.domain()[0])).attr("y1",y(minSZt)).attr("x2",x(minSZt)).attr("y2",y(minSZt))
            svg.append("line").style("stroke",cols[1]).attr("stroke-opacity","0.5").attr("x1",x(minSZt)).attr("y1",y(minSZt)).attr("x2",x(minSZt)).attr("y2",y(y.domain()[0]))
            svg.append("line").style("stroke",cols[1]).attr("stroke-opacity","0.5").attr("x1",x(x.domain()[0])).attr("y1",y(maxSZt)).attr("x2",x(maxSZt)).attr("y2",y(maxSZt))
            svg.append("line").style("stroke",cols[1]).attr("stroke-opacity","0.5").attr("x1",x(maxSZt)).attr("y1",y(maxSZt)).attr("x2",x(maxSZt)).attr("y2",y(y.domain()[0]))
            svg.append("polygon").attr("fill",cols[1]).attr("fill-opacity","0.1").attr("points",x(x.domain()[0])+","+y(maxCZt)+" "+x(x.domain()[0])+","+y(maxSZt)+" "+x(maxSZt)+","+y(maxSZt)+" "+x(maxSZt)+","+y(y.domain()[0])+" "+x(maxCZt)+","+y(y.domain()[0])+" "+x(maxCZt)+","+y(maxCZt))
            svg.append("polygon").attr("fill",cols[1]).attr("fill-opacity","0.1").attr("points",x(x.domain()[0])+","+y(minCZt)+" "+x(x.domain()[0])+","+y(minSZt)+" "+x(minSZt)+","+y(minSZt)+" "+x(minSZt)+","+y(y.domain()[0])+" "+x(minCZt)+","+y(y.domain()[0])+" "+x(minCZt)+","+y(minCZt))
            
            svg.append("line").style("stroke",cols[2]).attr("stroke-opacity","0.5").attr("x1",x(x.domain()[0])).attr("y1",y(y.domain()[1])).attr("x2",x(x.domain()[1])).attr("y2",y(y.domain()[1]))
            svg.append("line").style("stroke",cols[2]).attr("stroke-opacity","0.5").attr("x1",x(x.domain()[1])).attr("y1",y(y.domain()[0])).attr("x2",x(x.domain()[1])).attr("y2",y(y.domain()[1]))
            svg.append("polygon").attr("fill",cols[2]).attr("fill-opacity","0.1").attr("points",x(x.domain()[0])+","+y(maxSZt)+" "+x(maxSZt)+","+y(maxSZt)+" "+x(maxSZt)+","+y(y.domain()[0])+" "+x(x.domain()[1])+","+y(y.domain()[0])+" "+x(x.domain()[1])+","+y(y.domain()[1])+" "+x(x.domain()[0])+","+y(y.domain()[1]))
            svg.append("polygon").attr("fill",cols[2]).attr("fill-opacity","0.1").attr("points",x(x.domain()[0])+","+y(y.domain()[0])+" "+x(minSZt)+","+y(y.domain()[0])+" "+x(minSZt)+","+y(minSZt)+" "+x(x.domain()[0])+","+y(minSZt))

            //Append x axis
            xAxis = d3.axisBottom(x)
            svg.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(xAxis)
            .attr("class","xaxis")
            .append("text")
            .attr("y", 40)
            .attr("x", width/2)
            .attr("text-anchor", "middle")
            .text("Temperature at Apastron (°C)");

            //Append y axis
            yAxis = d3.axisLeft(y)
            svg.append("g")
            .call(yAxis)
            .attr("class","yaxis")
            .append("text")
            .attr("y", -40)
            .attr("x", -height/2)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text("Temperature at Peristron (°C)")

            //plot points
            var points = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class","point")
            .attr("r",function(d) {return (d.solarsystem)?2:1.7})
            .attr("cx", function(d) { return x(d.t_apa); })
            .attr("cy", function(d) { return y(d.t_peri); })
            .style("fill",function (d) {
                return color(d.period)
            })
            .style("stroke-width",1)
            .style("stroke",function(d) {return strokecolsv4(d)} )
            .on("mouseover", function(e, d){
                tooltip.html("Planet Name: "+d.name+"<br>Temp. at Peristron: "+d.t_peri.toFixed(2)+" °C<br>Temp. at Apastron : "+d.t_apa.toFixed(2)+" °C<br>Orbit eccentricity: "+d.ecc+"<br>Orbit % in OHZ: "+d.hzPerc+"<br>Orbit period: "+d.period+" days"); 
                console.log(d); 
                if (isPOI(d.name)) this.parentNode.appendChild(this);//bring to front
                d3.select(this).transition().duration(200).style("stroke", function(d) {var col = strokecolsv4(d); return (col=="transparent")?"grey":col }).style("stroke-width",2).attr("r",4);
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(e, d){return tooltip.style("top", (e.pageY+10)+"px").style("left",(e.pageX+10)+"px");})
            .on("mouseout", function(e, d){
                d3.select(this).transition().duration(200).style("stroke", function(d) {return strokecolsv4(d)}).attr("r",function(d) {return (d.solarsystem)?2:1.7}).style("stroke-width",1);;
                return tooltip.style("visibility", "hidden")
            ;})

            //legend
            var legend = svg.append("g").attr('class','legend')
            //rect
            legend.append("rect")
                .attr("fill", d3.rgb(60, 60, 60))
                .attr("x", 850)
                .attr("y", 200)
                .attr("width", 135)
                .attr("height", 150)
                .style("stroke", "grey");
            //key
            //containers
            var legendItems = legend.selectAll(".legendItem")
                .data(["less than 10 days","10 to 100 days","100 to 1000 days","1000 to 10000 days"," 10000 or more days"])
                .enter().append("g")
                .attr("class","legendItem")
                .attr("transform", function(d,i){return "translate(855,"+(i*13+220)+")"})
            //circle
            legendItems.append("circle")
                .attr("cx", 6)
                .attr("cy", -3)
                .attr("r", 4)
                .style("fill", function(d,i) { return pc[i] })
            //text
            legendItems.append("text")
                .text(function(d) { return (d); })
                .style("font-size","10px")
                .attr("text-anchor", "right")
                .attr("alignment-baseline", "middle")
                .attr("transform", function(d){return "translate(15,0)"})
            //bg key
            //containers
            var legendItems2 = legend.selectAll(".legendItem2")
                .data(["Survivable","Survivable with Aid","Unlikely to be Survivable"])
                .enter().append("g")
                .attr("class","legendItem2")
                .attr("transform", function(d,i){return "translate(855,"+(i*13+295)+")"})
            //poly
            legendItems2.append("rect")
                .attr("x", 2)
                .attr("y", -7)
                .attr("width", 8)
                .attr("height", 8)
                .style("fill", function(d,i) { return cols[i] })
                .attr("fill-opacity","0.1")
                .style("stroke", function(d,i) {return cols[i]})
                .attr("stroke-opacity","0.5")
            //text
            legendItems2.append("text")
                .text(function(d) { return (d); })
                .style("font-size","10px")
                .attr("text-anchor", "right")
                .attr("alignment-baseline", "middle")
                .attr("transform", function(d){return "translate(15,0)"})
            
            var brush = false
            //filter
            //rect
            legend.append("rect")
                .attr("fill", d3.rgb(60, 60, 60))
                .attr("x", 850)
                .attr("y", 120)
                .attr("width", 135)
                .attr("height", 40)
                .style("stroke", "grey");
            var filter = legend.append("g").attr("transform", "translate(867,132)")
            filter.append("text").text("Click to filter").style("font-size","11px").style("font-weight","bold")
            var filterg = filter.append("g")
            .on("mouseover", function(e,d){
                d3.select(this)
                .select("circle")
                .style("stroke", "grey");
                d3.select(this).select("text").style("fill", "grey").style("color", "grey")
            })
            .on("mouseout", function(e,d){
                d3.select(this)
                .select("circle")
                .style("stroke", (brush)?"grey":"");
                d3.select(this).select("text").style("fill", "").style("color", "")
            })
            .on("click",function(e,d){          
                brush = !brush
                if (brush) {
                    d3.select(this).select("circle").style("fill", "transparent").style("stroke", "grey");
                    points.transition().duration(300).style("fill-opacity",function(d){return (d.hzPerc>0)?1:(d.t_peri!=d.t_apa)?0.15:0.03})
                }
                else {
                    d3.select(this).select("circle").style("fill", "").style("stroke", "");
                    points.transition().duration(300).style("fill-opacity",1)
                }
            })
            filterg.append("circle")
            .attr("cx", -6)
            .attr("cy", 12)
            .attr("r", 4)
            .style("fill","")
            .style("stroke","")
            .style("stroke-width","1px")
            filterg.append("text")
            .text("Filter Habitable Zone")
            .style("font-size","10px")
            .attr("text-anchor", "right")
            .attr("alignment-baseline", "middle")
            .attr("transform", function(d){return "translate(3,15)"})

        
            
        }
    )

}

function strokecolsv4(d) {
    if (d.solarsystem) {
        return "red"
    }
    else {
        if (isPOI(d.name)) return "yellow"
        else return "transparent"
    }
}

function isPOI(pn) {
    if (pn.startsWith("TRAPPIST")) return true
    if (pn.startsWith("Kepler-1649")) return true
    if (pn.startsWith("Ross 128")) return true
    if (pn.startsWith("Proxima Cen")) return true
    if (pn.startsWith("Kepler-452")) return true
    if (pn.startsWith("Kepler-442 b")) return true
    if (pn.startsWith("Kepler-1229 b")) return true
    if (pn.startsWith("Kepler-69 c")) return true
    if (pn.startsWith("Kepler-54 d")) return true
    if (pn.startsWith("Kepler-445 d")) return true
    if (pn.startsWith("Kepler-1512 b")) return true
    if (pn.startsWith("GJ-1132 c")) return true
    if (pn.startsWith("Kepler-1450 b")) return true
    if (pn.startsWith("Kepler-560 b")) return true
    if (pn.startsWith("Kepler-1652 b")) return true
    if (pn.startsWith("Kepler-438 b")) return true
    if (pn.startsWith("TOI-700 b")) return true
    if (pn.startsWith("K2-3 d")) return true

    else return false
}

async function addSolarSystemHZG(data) {
    await d3.csv("sol_tempgrav.csv").then(
        function(soldata) {
            soldata.forEach(function(d){
                p = {
                    name: d.name,
                    t_peri: parseFloat(d.t_peri_wm),
                    t_apa: parseFloat(d.t_apa_wm),
                    hzPerc: (d.name=="Earth"|| d.name=="Mars")?100:0,
                    period: parseFloat(d.period),
                    ecc: parseFloat(d.ecc),
                    obj: d,
                    solarsystem: true
                }
                console.log(d)
                data.push(p)
            })
        })
    return data
}