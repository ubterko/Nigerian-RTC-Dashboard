import * as d3 from 'd3'
import Papa from 'papaparse'
import map from '../../data/nigeria_state_boundaries.geo.json'
import csv_data from '../../data/rtc_timeseries_data.csv'
import { drawPolygon } from '../polygon/script'
import { drawMinigraph, drawHighlight } from '../Highlight/script'
  
const loadCsv = new Promise((resolve, reject) => {
        Papa.parse(csv_data, {
            download: true,
            complete: (result) => { 
                let rtc_data = {}
                for (var row of result.data){
                    rtc_data[row[0]] = d3.sum(row.slice(1))
                }
                resolve(rtc_data);
            },
            error: (error) => {
                reject(error)
            }
        });
})

function displaySvgHeader(name){
    let text = `<h4>${name}</h4><p>Road Traffic Accidents <br> 2015 to 2022</p>`
    d3.select(".svg-header")
        .html(text)
}

export function displayTooltip(name, x, y){
    let text = `<h4>${name}</h4><p>Click for more detail</p>`
    d3.select(".tooltip")
        .html(text)
        .style("top", `${y + 30}px`)
        .style("left", `${x}px`)
        .style("display","block")      
}

export function drawMap(node0, node1, node2){
    loadCsv.then((data) => {
        map.features = map.features.map( (d) =>{
            let name = d.properties.admin1Name
            let Magnitude = data[name]
            d.properties.Magnitude = Magnitude
            return d
        })

        const max = d3.max(map.features, d => d.properties.Magnitude)
        
        let colorScale = d3.scaleLinear()
                            .domain([0, max])
                            .range(['rgba(52, 43, 68, 0.5)','rgba(236, 8, 8, 0.98)'])
                            // .range(['rgba(52, 43, 68, 0.42)','rgba(241, 40, 40, 0.92)'])

        let projection = d3.geoMercator()
                            .scale(2700)
                            .translate([0, 675])

        let geopath = d3.geoPath().projection(projection)
        
        let join =  d3.select(".map-group")
                        .selectAll("path")
                        .data(map.features)

        join.enter()
            .append("path")
            .attr("d", d => geopath(d))
            .style("stroke", "rgba(52, 49, 68, 0.3)")
            .attr("fill", d => d.properties.Magnitude ?
                                colorScale(d.properties.Magnitude):
                                "grey")
            .on("click", function(index, d) {
                let name = d.properties.admin1Name;
                d3.select(".map-group").transition().duration(200).attr("transform", "translate(270)")
                d3.select(".svg-container").style("background-color","#212131")
                drawPolygon(name);
                displaySvgHeader(name);
                drawHighlight(name);
                drawMinigraph(node0,node1,node2,name); 

            })
            .on("mouseover", function(mouseEvent, d) {
                let name = d.properties.admin1Name
                displayTooltip(name, mouseEvent.clientX, mouseEvent.clientY);
            })
            .on("mousemove", function(mouseEvent, d) {
                let name = d.properties.admin1Name
                displayTooltip(name, mouseEvent.clientX, mouseEvent.clientY);
            })
            .on("mouseleave", function (){
                d3.select(".tooltip")
                    .style("display","none")
            })  
        });

    };


        