// components/CulturalBubbleChartD3.tsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface BubbleChartProps {
  data: {
    lengua: string;
    hombres: number;
    mujeres: number;
  }[];
}

const CulturalBubbleChartD3: React.FC<BubbleChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const bubbleData = data.map((item) => ({
      label: item.lengua,
      value: item.hombres + item.mujeres,
    }));

    const width = 1000;
    const height = 800;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f0f0f0');

    const pack = d3.pack()
      .size([width, height])
      .padding(5);

    const root = d3.hierarchy({ children: bubbleData })
      .sum((d) => d.value);

    const node = svg.selectAll('g')
      .data(pack(root).leaves())
      .enter().append('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', 'rgba(75, 192, 192, 0.6)');

    node.append('text')
      .attr('dy', '0.3em')
      .attr('text-anchor', 'middle')
      .text((d) => d.data.label)
      .style('fill', '#fff')
      .style('font-family', 'Arial')
      .style('font-size', '16px')
      .style('font-weight', 'bold');

    svg.call(d3.zoom().on('zoom', (event) => {
      svg.attr('transform', event.transform);
    }));

  }, [data]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default CulturalBubbleChartD3;
