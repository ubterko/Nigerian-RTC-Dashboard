import * as d3 from 'd3'
import { useEffect } from 'react';

function Polygon(){

    useEffect(() => {
        let lineChartGroup = d3.select(".svg-container").append("g")
                        .attr("class","line-chart-group")
                        .attr("transform","translate(40, 120)") 
                
        d3.select(".line-chart-group").append("path")
                    .attr("class","path")
                                
        lineChartGroup.append("g")
                .attr("class","yAxis")

        lineChartGroup.append("g")
            .attr("class", "xAxis")
            .attr("transform","translate(0, 300)")
    })

    return <></>;
}

export default Polygon;