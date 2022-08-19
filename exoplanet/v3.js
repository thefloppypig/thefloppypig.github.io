v3()

//3rd visualization
function v3() {
    //variables
    var colsHZ = ["#ff3040",
    "#d2d94f",
    "#5dca6d",
    "#5a7fdf",
    "#9c4f9a",
    "grey"]
    var colsSZ = ["#4dff00","#fff200","#ff0000"]
    var maxTemp = 1000
    var maxGrav = 6
    //display data on svg
    var svg3 = d3.select("#v3") 
    var margin = { top: 50, right: 50, bottom: 50, left: 50 };
    var width = 1000;
    var height = 400;
    var svg = svg3
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ")");

    //Title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Temperature and gravity of exoplanets");

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

    //load data
    var yAxis
    var xAxis
    d3.csv("nasa-composite.csv").then(
        //load and process data
        async function(data) {
            //process the data
            processedData = []
                data.forEach(function(d){
                    var temptemp = d.pl_eqt
                    var tempgrav = ""
                    var tempname = d["pl_name"]
                    // temp
                    // if (d.temp_calculated != "") {
                    //     temptemp = d.temp_calculated
                    // }
                    // else {
                    //     if (d.temp_measured != "") {
                    //         temptemp = d.temp_measured
                    //     }
                    //     return
                    // }
                    if (temptemp > maxTemp) return

                    //grav
                    if (d.pl_bmassj != "" && d.pl_radj != "") {
                        tempgrav = ((6.673 * d.pl_bmasse * 5.9722*Math.pow(10,-1))  /  Math.pow(d.pl_rade * 0.6371, 2))/9.81
                        if (tempgrav > maxGrav) return
                    }
                    else return

                    if (temptemp != "" && tempgrav !="") {
                        if (tempgrav==Infinity || tempgrav==0) {
                            print(d)
                        }
                        p = {
                            temp: temptemp -273.15,
                            grav: tempgrav,
                            radius: d.pl_rade,
                            size: planetSize(d.pl_rade),
                            mass: d.pl_bmasse,
                            name: tempname,
                            colorVal: d.st_spectype,
                            solarsystem: false,
                            habitablezone: isHZ(tempname),
                            habitableperc: parseFloat(HZperc(tempname)),
                            obj: d
                        }
                        processedData.push(p)
                    }
                    
                });
                data = processedData;
                data = await addSolarSystemNasaC(data)
                console.log(data)
            
            //axis domains
            x.domain([
                0,d3.max(Object.values(data).map(x => x.grav))
            ])
            y.domain([
                -273.15,d3.max(Object.values(data).map(x => x.temp))
            ])
            
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
            var minCZt = -67.7
            var maxCZt = 56.7
            var minSZt = -101.111
            var maxSZt = 287.8
            var maxCZG = 2
            var maxSZG = 5
            svg.append("line").style("stroke",colsSZ[0]).attr("stroke-opacity","0.5").attr("x1",x(0)).attr("y1",y(minCZt)).attr("x2",x(maxCZG)).attr("y2",y(minCZt))
            svg.append("line").style("stroke",colsSZ[0]).attr("stroke-opacity","0.5").attr("x1",x(0)).attr("y1",y(maxCZt)).attr("x2",x(maxCZG)).attr("y2",y(maxCZt))
            svg.append("line").style("stroke",colsSZ[0]).attr("stroke-opacity","0.5").attr("x1",x(maxCZG)).attr("y1",y(minCZt)).attr("x2",x(maxCZG)).attr("y2",y(maxCZt))
            svg.append("polygon").attr("fill",colsSZ[0]).attr("fill-opacity","0.1").attr("points",x(0)+","+y(minCZt)+" "+x(maxCZG)+","+y(minCZt)+" "+x(maxCZG)+","+y(maxCZt)+" "+x(0)+","+y(maxCZt))
            
            svg.append("line").style("stroke",colsSZ[1]).attr("stroke-opacity","0.5").attr("x1",x(0)).attr("y1",y(minSZt)).attr("x2",x(maxSZG)).attr("y2",y(minSZt))
            svg.append("line").style("stroke",colsSZ[1]).attr("stroke-opacity","0.5").attr("x1",x(0)).attr("y1",y(maxSZt)).attr("x2",x(maxSZG)).attr("y2",y(maxSZt))
            svg.append("line").style("stroke",colsSZ[1]).attr("stroke-opacity","0.5").attr("x1",x(maxSZG)).attr("y1",y(minSZt)).attr("x2",x(maxSZG)).attr("y2",y(maxSZt))
            svg.append("polygon").attr("fill",colsSZ[1]).attr("fill-opacity","0.1").attr("points",x(0)+","+y(minCZt)+" "+x(maxCZG)+","+y(minCZt)+" "+x(maxCZG)+","+y(maxCZt)+" "+x(0)+","+y(maxCZt)+" "+x(0)+","+y(maxSZt)+" "+x(maxSZG)+","+y(maxSZt)+" "+x(maxSZG)+","+y(minSZt)+" "+x(0)+","+y(minSZt))
            
            svg.append("line").style("stroke",colsSZ[2]).attr("stroke-opacity","0.5").attr("x1",x(0)).attr("y1",y(y.domain()[1])).attr("x2",x(x.domain()[1])).attr("y2",y(y.domain()[1]))
            svg.append("line").style("stroke",colsSZ[2]).attr("stroke-opacity","0.5").attr("x1",x(x.domain()[1])).attr("y1",y(y.domain()[0])).attr("x2",x(x.domain()[1])).attr("y2",y(y.domain()[1]))
            svg.append("polygon").attr("fill",colsSZ[2]).attr("fill-opacity","0.1").attr("points",x(0)+","+y(maxSZt)+" "+x(maxSZG)+","+y(maxSZt)+" "+x(maxSZG)+","+y(minSZt)+" "+x(0)+","+y(minSZt)+" "+x(0)+","+y(y.domain()[0])+" "+x(x.domain()[1])+","+y(y.domain()[0])+" "+x(x.domain()[1])+","+y(y.domain()[1])+" "+x(0)+","+y(y.domain()[1]))

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
            .text("Gravity (ms⁻¹)");

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
            .text("Average Temperature (°C)")

            //plot points
            var points = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class","point")
            .attr("r", 1.7)
            .attr("cx", function(d) { return x(d.grav); })
            .attr("cy", function(d) { return y(d.temp); })
            .style("fill",function (d) {
                if (d.solarsystem) return colsHZ[0]
                return colsHZ[d.size[0]]
            })
            .style("stroke-width",1)
            .style("stroke","transparent")
            .on("mouseover", function(e, d){
                tooltip.html("Planet Name: "+d.name+"<br>Gravity: "+d.grav.toFixed(2)+" g<br>Avg. Temperature: "+d.temp.toFixed(2)+" °C"+"<br>Host Star Type: "+((d.colorVal!="")?d.colorVal:"Unknown")+"<br>Planet Type: "+d.size[1]+"<br>Orbit % in OHZ: "+((d.habitableperc==-1)?"Unknown":d.habitableperc)); 
                console.log(d); 
                this.parentNode.appendChild(this);//bring to front
                d3.select(this).transition().duration(200).style("stroke", "red").style("stroke-width",2).attr("r",4);
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(e, d){return tooltip.style("top", (e.pageY+10)+"px").style("left",(e.pageX+10)+"px");})
            .on("mouseout", function(e, d){
                d3.select(this).transition().duration(200).style("stroke", "transparent").attr("r",1.7).style("stroke-width",1);;
                return tooltip.style("visibility", "hidden")
            ;})
            
            //legend
            var legend = svg.append("g").attr('class','legend')
            //rect
            legend.append("rect")
                .attr("fill", d3.rgb(60, 60, 60))
                .attr("x", 850)
                .attr("y", 20)
                .attr("width", 135)
                .attr("height", 120)
                .style("stroke", "grey");
            //key
            //containers
            var legendItems = legend.selectAll(".legendItem")
                .data(["Solar System Planet","Terrestrial","Super-Earth","Neptune-like","Gas Giants"])
                .enter().append("g")
                .attr("class","legendItem")
                .attr("transform", function(d,i){return "translate(855,"+(i*13+30)+")"})
            //circle
            legendItems.append("circle")
                .attr("cx", 6)
                .attr("cy", -3)
                .attr("r", 4)
                .style("fill", function(d,i) { return colsHZ[i] })
                //.style("stroke", function(d,i) {return ["transparent","transparent","red"][i]});
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
                .attr("transform", function(d,i){return "translate(855,"+(i*13+110)+")"})
            //poly
            legendItems2.append("rect")
                .attr("x", 2)
                .attr("y", -7)
                .attr("width", 8)
                .attr("height", 8)
                .style("fill", function(d,i) { return colsSZ[i] })
                .attr("fill-opacity","0.1")
                .style("stroke", function(d,i) {return colsSZ[i]})
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
                .attr("y", 150)
                .attr("width", 135)
                .attr("height", 40)
                .style("stroke", "grey");
            var filter = legend.append("g").attr("transform", "translate(867,162)")
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
                    points.transition().duration(300).style("fill-opacity",function(d){return (d.habitableperc>0)?1:0.15})
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

var hzPercentage = {}
d3.csv("habitable-zone.csv").then(
    function(data) {
        data.forEach(function(d){
            hzPercentage[d.PLANET.trim()] = parseFloat(d.THZO)
        })
        console.log(hzPercentage)
    }
    
)

function planetSize(re) {
    if (re<=0.5) return [5,"Unknown"]
    if (re<=1) return [1,"Terrestrial"]
    if (re<=1.75) return [2,"Super-Earth"]
    if (re<=6) return [3,"Neptune-like"]
    if (re<=14.3) return [4,"Gas Giants"]
    else return [5,"Unknown"]
}

function isHZ(plname) {
    return hzPercentage.hasOwnProperty(plname)
}
function HZperc(plname) {
    return isHZ(plname)?hzPercentage[plname]:-1
}

async function addSolarSystemNasaC(data) {
    await d3.csv("sol_tempgrav.csv").then(
        function(soldata) {
            soldata.forEach(function(d){
                p = {
                    temp: parseFloat(d.temp),
                    grav: parseFloat(d.grav),
                    radius: "",
                    mass: "",
                    name: d.name,
                    size: [0,d.size],
                    colorVal: "G2 V",
                    solarsystem: true,
                    habitablezone: (d.name=="Earth"||d.name=="Mars"),
                    habitableperc: (d.name=="Earth"||d.name=="Mars")?100:0,
                    obj: d
                }
                console.log(d)
                data.push(p)
            })
        })
    return data
}