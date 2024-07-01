import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface GraficoBurbujaImp {
  data: {
    lengua: string;
    hombres: number;
    mujeres: number;
  }[];
}

interface DatosBurbuja {
  label: string;
  value: number;
}

interface DatosJerarquicos {
  children: DatosBurbuja[];
  label?: string;
  value?: number;
}

const creaDatosBurbuja = (datos: GraficoBurbujaImp['data']): DatosBurbuja[] => {
  return datos.map((item) => ({
    label: item.lengua,
    value: item.hombres + item.mujeres,
  }));
};

const agregaNodos = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, nodos: d3.HierarchyCircularNode<DatosJerarquicos>[]) => {
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const nodo = svg.selectAll<SVGGElement, d3.HierarchyCircularNode<DatosJerarquicos>>('g')
    .data(nodos)
    .enter().append('g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`);

  nodo.append('circle')
    .attr('r', (d) => d.r)
    .attr('fill', (d, i) => color(i.toString()));

  nodo.append('text')
    .attr('dy', '-0.3em')
    .attr('text-anchor', 'middle')
    .text((d) => (d.data as DatosBurbuja).label)
    .style('fill', '#fff')
    .style('font-family', 'Arial')
    .style('font-size', '12px')
    .style('font-weight', 'bold');

  nodo.append('text')
    .attr('dy', '1em')
    .attr('text-anchor', 'middle')
    .text((d) => (d.data as DatosBurbuja).value.toString())
    .style('fill', '#fff')
    .style('font-family', 'Arial')
    .style('font-size', '12px')
    .style('font-weight', 'bold');
};

const agregaZoom = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
  svg.call(d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
    svg.attr('transform', event.transform);
  }));
};

const agregaLeyenda = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, datosBurbuja: DatosBurbuja[], width: number) => {
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const leyenda = svg.append('g')
    .attr('transform', `translate(${width - 150}, 20)`);

  leyenda.selectAll('rect')
    .data(datosBurbuja)
    .enter().append('rect')
    .attr('x', 0)
    .attr('y', (d, i) => i * 25)
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', (d, i) => color(i.toString()));

  leyenda.selectAll('text')
    .data(datosBurbuja)
    .enter().append('text')
    .attr('x', 30)
    .attr('y', (d, i) => i * 25 + 15)
    .text((d) => `${d.label}: ${d.value}`)
    .style('font-family', 'Arial')
    .style('font-size', '14px');
};

const CulturalGraficoBurbuja: React.FC<GraficoBurbujaImp> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const datosBurbuja = creaDatosBurbuja(data);

    const width = 1000;
    const height = 800;

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f0f0f0');

    const pack = d3.pack<DatosJerarquicos>()
      .size([width, height])
      .padding(5);

    const root = d3.hierarchy<DatosJerarquicos>({ children: datosBurbuja })
      .sum((d) => d.value || 0);

    const nodos = pack(root).leaves();

    agregaNodos(svg, nodos);
    agregaZoom(svg);
    agregaLeyenda(svg, datosBurbuja, width);

  }, [data]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default CulturalGraficoBurbuja;
