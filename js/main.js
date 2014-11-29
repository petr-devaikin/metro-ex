window.onload = initialize;
window.onresize = fit;

var dom = {}
var state = {}

function fit() {
    var width = document.getElementById('mapContainer').offsetWidth,
        height = document.getElementById('mapContainer').offsetHeight;

    dom.metro.attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');
}

function inidDom() {
    dom.svg = d3.select('svg');
    dom.metro = dom.svg.select('#metro');
}

function initialize() {
    inidDom();
    processStations();

    drawTimescale();
    addStations();
    connectStations();

    fit();
    selectYear(0);
}

//drawing
function drawTimescale() {
    state.years = getPeriod();
    dom.years = d3.select('#timelineContainer').selectAll('.year')
            .data(state.years)
        .enter().append('div')
            .classed('year', true)
            .text(function(d) { return d; })
            .on('click', function(d, i) { selectYear(i); });
}

function addStations() {
    dom.stations = dom.metro.select('#stationsContainer').selectAll('.station')
            .data(coords)
        .enter().append('circle')
            .attr('r', 5)
            .attr('cx', function(d) { return d.position.x; })
            .attr('cy', function(d) { return d.position.y; });
}

function connectStations() {
    var newLines = getLines();
    dom.lines = dom.metro.select('#connectionsContainer').selectAll('.line')
            .data(newLines)
        .enter().append('g')
            .classed('line', true);

    dom.connections = dom.lines.selectAll('.connection')
            .data(function(d) { return d.connections; })
        .enter().append('line')
            .classed('connection', true)
            .attr('x1', function(d) { return d.start.position.x; })
            .attr('y1', function(d) { return d.start.position.y; })
            .attr('x2', function(d) { return d.stop.position.x; })
            .attr('y2', function(d) { return d.stop.position.y; });
}


// events
function selectYear(year) {
    state.currentYear = year;

    dom.years.filter(function(d) { return d > state.years[year]; })
        .classed('selected', false);
    dom.years.filter(function(d) { return d <= state.years[year]; })
        .classed('selected', true);

    var toHide = dom.stations.filter(function(d) { return d.year > state.years[year]; });
    var toShow = dom.stations.filter(function(d) { return d.year <= state.years[year]; });

    toHide.attr('opacity', 0);
    toShow.attr('opacity', 1);
}

document.addEventListener("keydown", function(e) {
    if (e.keyCode === 37 && state.currentYear > 0) selectYear(state.currentYear - 1);
    else if (e.keyCode === 39 && state.currentYear < state.years.length - 1) selectYear(state.currentYear + 1);
});