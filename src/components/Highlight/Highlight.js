import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import drawHighlight from './script'
import { drawMinigraph } from '../Highlight/script'
import './highlight.css'
import Map from '../map/Map'

export default function Highlight(){
    const highlightRef = useRef('highlight');
    const injuredSummaryRef = useRef();
    const involvedSummaryRef = useRef();
    const deceasedSummaryRef = useRef();
    const injuredGraphRef = useRef();
    const decGraphRef = useRef();
    const involvedGraphRef = useRef();

    const highlightDOM = () => {
        d3.select(highlightRef.current)
                            .attr("class","highlight")    
    
        let injuredSummary = d3.select(injuredSummaryRef.current)
                            .attr("class","injured-summary")
                            .append("div").attr("class", "injured-summary-detail")
    
        for (let item of ["h4", "h5", "h1"]){
            injuredSummary.append(item)
        }

        let deceasedSummary = d3.select(deceasedSummaryRef.current)
                            .attr("class","deceased-summary")
                            .append("div").attr("class", "deceased-summary-detail")

        for (let item of ["h4", "h5", "h1"]){
            deceasedSummary.append(item)
        }

        let involvedSummary = d3.select(involvedSummaryRef.current)
                            .attr("class","involved-summary")
                            .append("div").attr("class", "involved-summary-detail")

        for (let item of ["h4", "h5", "h1"]){
            involvedSummary.append(item)
        }                            

        d3.select(".dec-container")                            
                            .append("circle").attr("class", "dec-minigraph-circle")

        d3.select(".injured-container")                            
                            .append("circle").attr("class", "injured-minigraph-circle")

        d3.select(".involved-container")                            
                            .append("circle").attr("class", "involved-minigraph-circle")
    };

    useEffect(() => {
        highlightDOM(); // DOM interaction
        drawHighlight("Anambra"); // writes highlight 

        if (decGraphRef.current) {
            var node0 = decGraphRef.current    
        } 
        if (injuredGraphRef.current) {
            var node1 = injuredGraphRef.current
        } 
        if (involvedGraphRef.current) {
            var node2 = involvedGraphRef.current
        } 

        drawMinigraph(node0,node1,node2);
    });
    
    return (
        <>       
            <div ref={highlightRef}>
                <div ref={injuredSummaryRef}>
                    <svg className="injured-container">
                        <path ref={injuredGraphRef} className="injured-minigraph-path"></path>
                    </svg>
                </div>

                <div ref={deceasedSummaryRef}>
                    <svg className="dec-container">
                        <path ref={decGraphRef} className="dec-minigraph-path"></path>
                    </svg>
                </div>

                <div ref={involvedSummaryRef}>
                    <svg className="involved-container">
                        <path ref={involvedGraphRef} className="involved-minigraph-path"></path>
                    </svg>
                </div>
            </div>
            <Map decminigraph={decGraphRef} involvedminigraph={involvedGraphRef} injuredminigraph={injuredGraphRef} />
        </>       
    )
}