import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface BubbleChartProps {
  data: {
    lengua: string;
    hombres: number;
    mujeres: number;
  }[];
}

interface BubbleData {
  label: string;
  value: number;
}

interface HierarchyData {
  children: BubbleData[];
  label?: string;
  value?: number;
}

const CulturalBubbleChartD3: React.FC<BubbleChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const bubbleData: BubbleData[] = data.map((item) => ({
      label: item.lengua,
      value: item.hombres + item.mujeres,
    }));

    const width = 1000;
    const height = 800;

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f0f0f0');

    const pack = d3.pack<HierarchyData>()
      .size([width, height])
      .padding(5);

    const root = d3.hierarchy<HierarchyData>({ children: bubbleData })
      .sum((d) => d.value || 0);

    const nodes = pack(root).leaves();

    // Create a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const node = svg.selectAll<SVGGElement, d3.HierarchyCircularNode<HierarchyData>>('g')
      .data(nodes)
      .enter().append('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', (d, i) => color(i.toString()));

    // Add text for each circle
    node.append('text')
      .attr('dy', '-0.3em')
      .attr('text-anchor', 'middle')
      .text((d) => (d.data as BubbleData).label)
      .style('fill', '#fff')
      .style('font-family', 'Arial')
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    node.append('text')
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .text((d) => (d.data as BubbleData).value.toString())
      .style('fill', '#fff')
      .style('font-family', 'Arial')
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    svg.call(d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
      svg.attr('transform', event.transform);
    }));

    // Create legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 150}, 20)`);

    legend.selectAll('rect')
      .data(bubbleData)
      .enter().append('rect')
      .attr('x', 0)
      .attr('y', (d, i) => i * 25)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', (d, i) => color(i.toString()));

    legend.selectAll('text')
      .data(bubbleData)
      .enter().append('text')
      .attr('x', 30)
      .attr('y', (d, i) => i * 25 + 15)
      .text((d) => `${d.label}: ${d.value}`)
      .style('font-family', 'Arial')
      .style('font-size', '14px');

  }, [data]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default CulturalBubbleChartD3;
