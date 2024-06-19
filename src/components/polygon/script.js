import new_rtc from '../../data/rtc_by_year.csv'
import Papa from 'papaparse'
import * as d3 from 'd3'


const loadCsv = new Promise( (resolve, reject) => {
    Papa.parse(new_rtc, {
        download: true,
        complete: (result) => {
            let rtc_data = []
            for (var row of result.data.slice(1)){
                let row_data = {"name" : row[0], "properties":[] }
                for (let i = 1; i <= row.slice(1).length; i++){
                    row_data.properties.push({"value": +row[i], "date": result.data[0][i]})  
                }
                rtc_data.push(row_data)
            }                
            resolve(rtc_data)
        },
        error: (error) => { 
            reject(error)
        }
    });
}) 

export function drawPolygon(name="Abia"){
    loadCsv.then((Data) => {
        let data = Data.filter((state) => 
            state["name"].includes(name))

        data = data[0].properties 
        
        let max = d3.max(data, d => d.value)  
        let xScale = d3.scaleTime()
                        .domain(d3.extent(data, d => new Date(d.date)))
                        .range([0, 300])
        
        let yScale = d3.scaleLinear()
                        .domain([0, max])
                        .range([300, 0])

        let xAxis = d3.axisBottom(xScale)
        d3.select(".xAxis").call(xAxis).style("fill","green").style("stroke","green")
        
        let yAxis = d3.axisLeft(yScale)
        d3.select(".yAxis").call(yAxis).style("fill","green").style("stroke","green")

        let line = d3.line()
                    .x(d => xScale( new Date(d.date) ))
                    .y(d => yScale(d.value))

        d3.select(".path")
                    .datum(data)
                    .attr("d", line)
                    .attr("fill", "none")
                    .style("stroke", "green")
                    .style("stroke-width", 2.2)
                    .style("stroke-dasharray",5)
                    .style("stroke-dashoffset",5)
        
        d3.select(".path").exit().remove();
    })
};