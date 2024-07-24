// src/components/consultaConAlfanumericos/cultural/Contenido.tsx

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface GraficoBurbujaImp {
  datos: any[];
  labelKey: string;
  valueKey: string;
  groupKey: string;
  mostrarMenosRepresentativo: boolean;
}

interface DatosBurbuja {
  label: string;
  valor: number;
}

interface DatosJerarquicos {
  children: DatosBurbuja[];
  label: string;
  valor: number;
}

const CulturalGraficoBurbuja: React.FC<GraficoBurbujaImp> = ({ datos, labelKey, valueKey, groupKey, mostrarMenosRepresentativo }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const datosJerarquicos = creaDatosJerarquicos(datos, labelKey, valueKey, groupKey);
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', 'transparent');
    const pack = d3.pack<DatosJerarquicos>()
      .size([width, height])
      .padding(2);
    const root = d3.hierarchy<DatosJerarquicos>({ label: '', valor: 0, children: datosJerarquicos })
      .sum((d) => mostrarMenosRepresentativo ? 1 / (d.valor || 1) : d.valor || 0);
    const nodos = pack(root).leaves();
    svg.selectAll('*').remove();
    agregaNodos(svg, nodos, width, height);
  }, [datos, labelKey, valueKey, groupKey, mostrarMenosRepresentativo]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CulturalGraficoBurbuja;

const creaDatosJerarquicos = (datos: any[], labelKey: string, valueKey: string, groupKey: string): DatosJerarquicos[] => {
  const groupedData = d3.group(datos, d => d[groupKey]);
  const result: DatosJerarquicos[] = [];
  groupedData.forEach((value, key) => {
    result.push({
      label: key,
      valor: 0,
      children: value.map((item) => ({
        label: item[labelKey],
        valor: item[valueKey],
      }))
    });
  });
  return result;
};

const agregaNodos = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, nodos: d3.HierarchyCircularNode<DatosJerarquicos>[], width: number, height: number) => {
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
    .style('fill', 'black')
    .style('font-family', 'Arial')
    .style('font-size', `${Math.min(width, height) / 20}px`)
    .style('font-weight', 'bold');
  nodo.append('text')
    .attr('dy', '1em')
    .attr('text-anchor', 'middle')
    .text((d) => (d.data as DatosBurbuja).valor.toString())
    .style('fill', 'black')
    .style('font-family', 'Arial')
    .style('font-size', `${Math.min(width, height) / 20}px`)
    .style('font-weight', 'bold');
};
