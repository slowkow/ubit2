function initDiffexpPca() {
    drawVolcano();
    drawPval();
    drawFc();
    drawPcScatter();
}

// Draw volcano plot
function drawVolcano() {

    var data = dataPro[0].map(function(o) { return { name: o.name, fc: o.fc, pval: o.pval } });
    
    var g = document.getElementById('volcano_panel'),
	windowWidth = g.clientWidth,
	windowHeight = g.clientHeight;
    
    var margin = {top: 20, right: 40, bottom: 60, left: 40},
        width = windowWidth - margin.left - margin.right,
        height = windowHeight - margin.top - margin.bottom;
    
    // remove if already existing for regeneration
    d3.select("#volcano_svg").remove();
    
    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-1, 0])
        .html(function(d) {
	    return d.name;
	})
    
    var svg = d3.select("#volcano").append("svg")
	.attr("id","volcano_svg")
	.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");	

    svg.call(tip);

    x.domain(d3.extent(data, function(d) { return d.fc; })).nice();
    y.domain(d3.extent(data, function(d) { return d.pval; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("log2(fold change)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("-log10(p-value)")
    
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.fc); })
        .attr("cy", function(d) { return y(d.pval); })
	.style("fill", function(d) {
	    if (d.pval >= -Math.log10(0.05/data.length)) {return "red"}
	    else { return "steelblue" }
	    ;})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);  

}

// Barplot of p-values
function drawPval() {

    var data = dataPro[0].map(function(o) { return { name: o.name, value: o.pval } });
    
    // remove if already existing for regeneration
    d3.select("#diffexp_pval_svg").remove();

    var g = document.getElementById('diffexp_pval_panel'),
	windowWidth = g.clientWidth,
	windowHeight = g.clientHeight,
        margin = {top: 20, right: 40, bottom: 60, left: 40}

    d3.select("#diffexp_pval").datum(data)
	.call(columnChart()
	      .margin(margin)
	      .width(windowWidth)
	      .height(windowHeight)
	      .x(function(d, i) { return d.name; })
	      .y(function(d, i) { return d.value; }))

}

// Barplot of fold-change
function drawFc() {

    var data = dataPro[0].map(function(o) { return { name: o.name, value: o.fc } });
    
    // remove if already existing for regeneration
    d3.select("#diffexp_fc_svg").remove();

    var g = document.getElementById('diffexp_fc_panel'),
	windowWidth = g.clientWidth,
	windowHeight = g.clientHeight,
        margin = {top: 20, right: 40, bottom: 60, left: 40}

    var svg = d3.select("#diffexp_fc").datum(data)
	.call(columnChart()
	      .margin(margin)
	      .width(windowWidth)
	      .height(windowHeight)
	      .x(function(d, i) { return d.name; })
	      .y(function(d, i) { return d.value; }))

}

// PCA
function drawPcScatter() {

    var data = dataPro;
    
    var g = document.getElementById('pca_panel'),
	windowWidth = g.clientWidth,
	windowHeight = g.clientHeight;
    
    var margin = {top: 20, right: 40, bottom: 60, left: 40},
        width = windowWidth - margin.left - margin.right,
        height = windowHeight - margin.top - margin.bottom;
    
    // remove if already existing for regeneration
    d3.select("#pca_svg").remove();
        
    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-1, 0])
        .html(function(d) {
	    return d.name;
	})
    
    var svg = d3.select("#pca").append("svg")
	.attr("id","pca_svg")
	.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    x.domain(d3.extent(data, function(d) { return d.pc1; })).nice();
    y.domain(d3.extent(data, function(d) { return d.pc2; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("PC1");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("PC2")
    
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.pc1); })
        .attr("cy", function(d) { return y(d.pc2); })
        .style("fill", function(d) { return color(d.group); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);  
}
