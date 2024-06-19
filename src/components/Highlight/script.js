import * as d3 from 'd3'
import Papa from 'papaparse'
import summary from '../../data/rtc_summary_2022.csv'
import number_deceased from '../../data/number_killed.csv'; 
import number_injured from '../../data/number_injured.csv';
import number_involved from '../../data/number_involved.csv';

const load_prev_year_summary = new Promise((resolve, reject) => {
        Papa.parse(summary, {
            download: true,
            complete: (result) => {
                let summary = []
                for (var row of result.data.slice(1)){
                    summary.push({"name": row[0],
                            "injured": row[2],
                            "deceased": row[1],
                            "involved": row[3]})
                }
                resolve(summary)
            },
            error: (e) => {  
                reject(e)
            } 
        })
    }); 

export function drawHighlight(name="Abia"){
    load_prev_year_summary.then((Data) => {
        let data = Data.filter((item) => item["name"].includes(name))[0]
    
        const injuredDetail = d3.select(".injured-summary-detail")
        const deceasedDetail = d3.select(".deceased-summary-detail")
        const involvedDetail = d3.select(".involved-summary-detail")
        
        involvedDetail.select("h4").text("Involved")
        involvedDetail.select("h5").text("in the previous year")        
        involvedDetail.select("h1").text(data.involved)
        
        injuredDetail.select("h4").text("Injured")
        injuredDetail.select("h5").text("in the previous year")        
        injuredDetail.select("h1").text(data.injured)
    
        deceasedDetail.select("h4").text("Deceased")
        deceasedDetail.select("h5").text("in the previous year")         
        deceasedDetail.select("h1").text(data.deceased)
    })
};
export default drawHighlight;

const loadCsv = (file) => {
    return new Promise((resolve, reject) => {
    Papa.parse(file, {
        download: true,
        complete: (result) => {
            var data = []
            for (var row of result.data.slice(1)){
                var row_data = {"name": row[0], "properties": []}
                for (let i =1; i <= row.length-1; i++){
                    row_data.properties.push({"value": +row[i], "date": result.data[0][i]})
                }
                data.push(row_data)
            }
            resolve(data)
        }
    })
})};

export function drawMinigraph(node0, node1, node2, name="Abia"){
    loadCsv(number_deceased).then((Data) => {
        let data = Data.filter((number) => number["name"].includes(name))[0]
        data = data.properties
        let max = d3.max(data, d => d.value)
        
        let xScale = d3.scaleTime()
                        .domain(d3.extent(data, d => new Date(d.date)))
                        .range([0, 70])

        let yScale = d3.scaleLinear()
                        .domain([0, max])
                        .range([40, 0])

        var path = d3.line()
                    .x(d => xScale( new Date(d.date) ))
                    .y(d => yScale(d.value))

        let join = d3.select(".dec-minigraph-path")
                    .datum(data)
                    .attr("d", path)

        let coord = path(data).split(',').slice(-2)
        let x = coord[0].split('L')[1]
        let y = coord[1]

        let pathLength = node0.getTotalLength()    

        join.attr("stroke-dashoffset", pathLength)
            .attr("stroke-dasharray", pathLength);

        let transitionPath = d3.transition().ease(d3.easeSin).duration(1000);

        join.transition(transitionPath)
            .attr("stroke-dashoffset", 0);

        d3.select(".dec-minigraph-circle")
            .attr("r", 2.5)
            .attr("opacity",0)
            .attr("cx", x)
            .attr("cy", y)                 
            .transition()
            .delay(1000)
            .attr("opacity",1)
        
        d3.select(".dec-minigraph-circle").exit().remove()
    })

    loadCsv(number_injured).then((Data) => {
        let data = Data.filter((number) => number["name"].includes(name))[0]
        data = data.properties
        let max = d3.max(data, d => d.value)
        
        let xScale = d3.scaleTime()
                        .domain(d3.extent(data, d => new Date(d.date)))
                        .range([0, 70])

        let yScale = d3.scaleLinear()
                        .domain([0, max])
                        .range([40, 0])

        let path = d3.line()
                    .x(d => xScale( new Date(d.date) ))
                    .y(d => yScale(d.value))

        let join = d3.select(".injured-minigraph-path")
                    .datum(data)
                    .attr("d", path)

        let coord = path(data).split(',').slice(-2)
        let x = coord[0].split('L')[1]
        let y = coord[1]

        let pathLength = node1.getTotalLength()    

        join.attr("stroke-dashoffset", pathLength)
            .attr("stroke-dasharray", pathLength);

        let transitionPath = d3.transition().ease(d3.easeSin).duration(1000);

        join.transition(transitionPath)
            .attr("stroke-dashoffset", 0);

        d3.select(".injured-minigraph-circle")
            .attr("r", 2.5)
            .attr("opacity",0)
            .attr("cx", x)
            .attr("cy", y)                 
            .transition()
            .delay(1000)
            .attr("opacity",1)

        d3.select(".injured-minigraph-circle").exit().remove()

    })


    loadCsv(number_involved).then((Data) => {
        let data = Data.filter((number) => number["name"].includes(name))[0]
        data = data.properties
        let max = d3.max(data, d => d.value)

        let xScale = d3.scaleTime()
                        .domain(d3.extent(data, d => new Date(d.date)))
                        .range([0, 70])

        let yScale = d3.scaleLinear()
                        .domain([0, max])
                        .range([40, 0])

        let path = d3.line()
                        .x(d => xScale( new Date(d.date) ))
                        .y(d => yScale(d.value))

        let join = d3.select(".involved-minigraph-path")                                            
                        .datum(data)                
                        .attr("d", path)

        let coord = path(data).split(',').slice(-2)
        let x = coord[0].split('L')[1]
        let y = coord[1]  

        let pathLength = node2.getTotalLength()

        join.attr("stroke-dashoffset", pathLength)
            .attr("stroke-dasharray", pathLength);

        let transitionPath = d3.transition().ease(d3.easeSin).duration(1000);

        join.transition(transitionPath)
            .attr("stroke-dashoffset", 0);

        d3.select(".involved-minigraph-circle")
            .attr("r", 2.5)
            .attr("opacity",0)
            .attr("cx", x)
            .attr("cy", y)                 
            .transition()
            .delay(1000)
            .attr("opacity",1)

        d3.select(".involved-minigraph-circle").exit().remove()
        })
};
