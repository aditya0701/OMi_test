import React, { useState, useEffect, ReactElement } from 'react';
import { ProcessDiagram } from './processDiagram';
import { CohortCard } from './types';
import styles from './card.module.css'

function formatMilliseconds(ms: number): string {
    const seconds = (ms / 1000).toFixed(3);
    return `${seconds} s`;
}

export function Card({id, title, graph, median, average, number_traces} : CohortCard) : ReactElement {
    const [selectedNumber, setSelectedNumber] = useState(0);
    const [maxValue, setMaxValue] = useState(0);
    // Function to safe the value on the slider in the selectedNumber variable
    const handleSliderChange = (e: { target: { value: string; }; }) => {
        setSelectedNumber(parseInt(e.target.value));
    };

    // Get the highest value from all edges
    useEffect(() => {
        const max = graph.edges.reduce((maxValue, edge) => {
            return edge.freq > maxValue ? edge.freq : maxValue;
        }, 0);
        setMaxValue(max);
    }, [graph.edges]);
    
    // Only edges and nodes above this threshold should be visible
    const threshold = (maxValue * selectedNumber) / 100;
    
    const filteredEdges = graph.edges.filter(edge => edge.freq >= threshold);
    const filteredNodes = graph.nodes.filter(node => {
        return filteredEdges.some(edge => edge.from === node.id || edge.to === node.id);
    });
    
    // Return the Card
    return (
        <div className= {styles.card}>
            <h3>{title}</h3>
            <div>
                <input
                    type="range"
                    value={selectedNumber}
                    onChange={handleSliderChange}
                    min={0}
                    max={100}
                    step={1}
                />
                <span style={{ marginLeft: '10px' }}>{selectedNumber}</span>
            </div>
            <div className={styles.infoDiv}>
                <p>Avg Throughput Time: {formatMilliseconds(average)}</p>
                <p>Median Throughput Time: {formatMilliseconds(median)}</p>
                <p>Number of Traces: {number_traces}</p>
            </div>
            <div className={styles.containerPro}>
                <ProcessDiagram nodes={filteredNodes} edges={filteredEdges}/>
            </div>
            <div>
                <p> Suggested Features in this Cohort</p>
            </div>
            
        </div>
    );
};

