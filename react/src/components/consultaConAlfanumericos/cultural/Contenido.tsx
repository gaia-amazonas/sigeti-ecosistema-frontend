// src/components/consultaConAlfanumericos/cultural/Contenido.tsx

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface GraficoBurbujaImp {
  datos: any[];
  labelKey: string;
  valueKey: string;
}

interface DatosBurbuja {
  label: string;
  valor: number;
}

interface DatosJerarquicos {
  children: DatosBurbuja[];
  label?: string;
  valor?: number;
}

const CulturalGraficoBurbuja: React.FC<GraficoBurbujaImp> = ({ datos, labelKey, valueKey }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (!svgRef.current) return;
    const datosBurbuja = creaDatosBurbuja(datos, labelKey, valueKey);
    const grosor = 1000;
    const altura = 800;
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
      .attr('width', grosor)
      .attr('height', altura)
      .style('background', '#f0f0f0');
    const pack = d3.pack<DatosJerarquicos>()
      .size([grosor, altura])
      .padding(5);
    const root = d3.hierarchy<DatosJerarquicos>({ children: datosBurbuja })
      .sum((d) => d.valor || 0);
    const nodos = pack(root).leaves();
    agregaNodos(svg, nodos);

  }, [datos, labelKey, valueKey]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default CulturalGraficoBurbuja;

const creaDatosBurbuja = (datos: any[], labelKey: string, valueKey: string): DatosBurbuja[] => {
  return datos.map((item) => ({
    label: item[labelKey],
    valor: item[valueKey],
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
    .text((d) => (d.data as DatosBurbuja).valor.toString())
    .style('fill', '#fff')
    .style('font-family', 'Arial')
    .style('font-size', '12px')
    .style('font-weight', 'bold');
};
