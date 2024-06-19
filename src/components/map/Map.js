import * as d3 from 'd3'
import './map.css'
import { useEffect, useRef } from "react";
import { drawMap } from "./script";

function Map(props){
    const containerRef = useRef();

    useEffect( () => {
        const svg = d3.select(containerRef.current)
        svg.append("g")
            .attr("class","map-group")
           
        drawMap(props.decminigraph.current,
                props.injuredminigraph.current,
                props.involvedminigraph.current); 
    });

    return(
        <>
            <svg ref={containerRef} className="svg-container"></svg>
            <div className="tooltip"></div>
            <div className="svg-header"></div>
            {/* <div className="svg-header"> */}
                {/* <p><span>RTC Cases</span>Timeseries From 2015 to 2022</p> */}
            {/* </div> */}
        </>
    ) 
};

export default Map;