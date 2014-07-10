// DATA 
// parse data properly
var umap = []
data.map(function(d) {umap[d[0]]=Number(d[1])});
console.log(umap);

var v = Object.keys(umap).map(function(k){return umap[k]})
// console.log(v);

// LOAD DATA
queue()
    .defer(d3.json, "maps/zh-mainland-provinces.topo.json") // mainland
    .defer(d3.json, "maps/zh-chn-twn.topo.json") // taiwan 
    .defer(d3.json, "maps/zh-hkg-mac.topo.json") // hk and macau
    .await(drawMap); // function that uses files

// DRAW 
// create SVG map
var projection = d3.geo.mercator()
    .center([116,39])
    .scale(600);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height);

var path = d3.geo.path()
    .projection(projection);

// COLORS
// define color scale
var colorScale = d3.scale.linear()
           .domain(d3.extent(v))
           .interpolate(d3.interpolateHcl)
           .range(["white", "lightgrey"]);

// add grey color if no values
var color = function(i){ 
    if (i==undefined) {return "#cccccc"}
    else return colorScale(i)
}

// BACKGROUND
svg.append("g")
    .attr("class", "background")
    .append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#eeeeee")
    .attr("stroke", "black")
    .attr("stroke-width", "0.35");

// TITLE AND INFOS
svg.append('g')
    .attr("class","info")
    .attr("transform", "translate("+(width-140)+","+(height-180)+")")
    .append("rect")
    .attr({fill : "transparent", height: 160,width:160})

svg.select('.info')
    .append("g")
    .attr("class", "title")
    .append("text")
    // .attr("dx", function(d){return 35})          
    .attr("transform", "translate(0,-70)")
    .attr("dy", function(d){return 16})
    .attr("text-anchor", "middle")  
    .attr("font-family", "sans-serif")
    .attr("fill", "#4B4B4B")
    .style("text-decoration", "bold")  
    .text(title)
    .attr("font-size", 16)
    .call(wrap, 150);

svg.select('.info')
    .append("g")
    .attr("class","legend")
    .append("text")
    .attr("dx", function(d){return 0})          
    .attr("dy", 12 )
    .attr("text-anchor", "middle")  
    .attr("font-family", "sans-serif")
    .attr("fill", "#aaaaaa")
    .attr("font-size", 12)
    .text(desc)
    .call(wrap, 150);

svg.select('.info')
    .append("g")
    .attr("class","credits")
    .attr("transform", "translate(0,140)")
    .append("text")
    .attr("dx", function(d){return 0})          
    .attr("dy", 9 )
    .attr("text-anchor", "middle")  
    .attr("font-family", "sans-serif")
    .attr("fill", "#aaaaaa")
    .attr("font-size", 11)
    .text(credits)
    .call(wrap, 150);

// CAPTION
// Color bar adapted from http://tributary.io/tributary/3650755/
svg.append("g")
    .attr("class","caption")
    .append("g")
    .attr("class","color-bar")
    .selectAll("rect")
    .data(d3.range(d3.min(v), d3.max(v), (d3.max(v)-d3.min(v))/50.0))
    .enter()
    .append("rect")
    .attr({width: 25,
          height: 5,
          y: function(d,i) { return height-25-i*5 },
          x: width-50,
          fill: function(d,i) { return color(d); } })

svg.select(".caption")
    .append("g")
    .attr("transform", "translate(" + (width-25) + "," + (height-25-5*49) + ")")
    .call(d3.svg.axis()
           .scale(d3.scale.linear().domain(d3.extent(v)).range([5*50,0]))
            .orient("right"))
    .attr("font-family", "sans-serif")
    .attr("fill", "#4B4B4B")
    .attr("font-size", 10)

svg.select('.caption')
    .append("g")
    .attr("class","units")
    .attr("transform", "translate("+(width-35)+","+(height/2-20)+")")
    .append("text")
    .attr("dx", function(d){return 0})          
    .attr("dy", 9 )
    .attr("text-anchor", "middle")  
    .attr("font-family", "sans-serif")
    .attr("fill", "#4b4b4b")
    .attr("font-size", 10)
    .text(units)
    .call(wrap, 50);


// DRAW
function drawMap(error,mainland,taiwan,hkmacau) {
    drawProvinces(error,mainland);
    drawTaiwan(error,taiwan);
    drawHkMacau(error,hkmacau);
}

// Mainland provinces
function drawProvinces(error, cn) {
    
    // var codes=[];
    // for (var i = 0; i < topojson.feature(cn, cn.objects.provinces).features.length; i++) {
    //     codes.push(topojson.feature(cn, cn.objects.provinces).features[i].properties.name)
        
    // };
    // console.log(codes);

    svg.append("g")
        .attr("class", "map")
        .append("g")
        .attr("class", "mainland")
        .selectAll("path")
        .data(topojson.feature(cn, cn.objects.provinces).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", function(d) { return d.id; })
        .attr("class", "province")
        .attr("fill", "#cccccc")
        .attr("fill", function(d) { return color(umap[d.properties.name]); })
        .attr("stroke", "black")
        .attr("stroke-width", "0.35");
}

// Taiwan
function drawTaiwan(error, cn) {
    // console.log(error)
    console.log(topojson.feature(cn, cn.objects.layer1))

    // Taiwan
    svg.select(".map")
        .append('g')
        .attr("class", "taiwan")
        .selectAll("path")
        .data(topojson.feature(cn, cn.objects.layer1).features.filter(function(d) { return d.properties.GU_A3 === 'TWN'; }))
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", function(d) { return d.id; })
        .attr("class", "province")
        .attr("fill", "#cccccc")
        .attr("fill", function(d) { return color(umap["Taiwan"]); })
        .attr("stroke", "black")
        .attr("stroke-width", "0.35");
}

// HK and Macau
function drawHkMacau(error, cn) {
    // console.log(error)
    
    // console.log(topojson.feature(cn, cn.objects.layer1).features.filter(function(d) { return d.properties.GU_A3 === "HKG" }))

    


    var projection2 = d3.geo.mercator()
    .center([126,17])
    .scale(2000);

    var path2 = d3.geo.path()
        .projection(projection2);
  
    svg.select('.map')
        .append("g")
        .attr("class", "hk")
        .attr("transform", "translate(50,"+(height-120)+")")
        .selectAll("path")
        .data(topojson.feature(cn, cn.objects.layer1).features)
        .enter()
        .append("path")
        .attr("d", path2)
        .attr("id", function(d) { return d.id; })
        .attr("class", "province")
        .attr("fill", function(d) { return color(umap["Xianggang"]); })
        .attr("stroke", "black")
        .attr("stroke-width", "0.35");

    svg.select(".hk")
        .append("text") //add some text
        .attr("dx", function(d){return 20})
        .attr("dy", function(d){return 35})
        .attr("font-family", "sans-serif")
        .attr("fill", "#aaaaaa")
        .attr("font-size", 10)
        .text("Hong Kong & Macau")

    // add demarcation
    svg.select(".hk")
       .append("svg:line")
         .attr("x1", 30)
         .attr("y1", -10)
         .attr("x2", 150)
         .attr("y2", 20)
         .style("stroke", "#cccccc")
         .style("stroke-width", 3);
    
    svg.select(".hk")
        .append("svg:line")
         .attr("x1", 150)
         .attr("y1", 20)
         .attr("x2", 150)
         .attr("y2", 60)
         .style("stroke", "#cccccc")
         .style("stroke-width", 3);

}

// TODO : Haiwai


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 0.7, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy );
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy ).text(word);
      }
    }
  });
}
