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

    state.years = getPeriod();
    drawTimescale();
    addStations();
    connectStations();

    fit();
    selectYear(0);
}

//drawing
function drawTimescale() {
    dom.years = d3.select('#timelineContainer').selectAll('.year')
            .data(state.years)
        .enter().append('div')
            .classed('year', true)
            .style('color', function(d) {
                return getColourOfTheYear(d, state.years[0], state.years[state.years.length - 1]);
            })
            .text(function(d) { return d; })
            .on('click', function(d, i) { selectYear(i); });
}

function addStations() {
    dom.stations = dom.metro.select('#stationsContainer').selectAll('.station')
            .data(coords)
        .enter().append('g')
            .classed('station', true);
    
    dom.stations.append('circle')
        .attr('fill', function(d) {
            return getColourOfTheYear(d.year, state.years[0], state.years[state.years.length - 1]);
        })
        .attr('r', toPixelSize(0.1))
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
            .attr('stroke', function(d) {
                return getColourOfTheYear(d.year, state.years[0], state.years[state.years.length - 1]);
            })
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

    var stationsToHide = dom.stations.filter(function(d) {return d.year > state.years[year]; });
    var stationsToShow = dom.stations.filter(function(d) { return d.year <= state.years[year]; });
    var connectionsToHide = dom.connections.filter(function(d) {
        return d.year > state.years[year] || (d.until < state.years[year] && d.until !== undefined);
    });
    var connectionsToShow = dom.connections.filter(function(d) {
        return d.year <= state.years[year] && (d.until >= state.years[year] || d.until === undefined);
    });

    stationsToHide.attr('opacity', 0);
    connectionsToHide.attr('opacity', 0);
    stationsToShow.attr('opacity', 1);
    connectionsToShow.attr('opacity', 1);
}

document.addEventListener("keydown", function(e) {
    if (e.keyCode === 37 && state.currentYear > 0) selectYear(state.currentYear - 1);
    else if (e.keyCode === 39 && state.currentYear < state.years.length - 1) selectYear(state.currentYear + 1);
});