// src/components/graficos/general/TotalYFamilias.tsx
import React from 'react';
import { ContenedorTotal, CajaReductor, CajaTitulo, RectanguloAmarillo, TextoIndicativo } from '../estilos';

interface ComponenteTotalImp {
  contadorTotal: number | null;
  contadorFamilias: number | null;
  comunidades: string[] | null;
  territorios: string[] | null;
}

const ComponenteTotal: React.FC<ComponenteTotalImp> = ({ contadorTotal, contadorFamilias, comunidades, territorios }) => {

  const comunidadesFormateadas = formateaLista(comunidades);
  const territoriosFormateados = formateaLista(territorios);
  return (
    <ContenedorTotal>
      <CajaTitulo>POBLACIÓN TOTAL</CajaTitulo>
      <CajaReductor style={{ background: 'transparent', color: 'black' }}>{contadorTotal === null ? '-' : contadorTotal}</CajaReductor>
      <TextoIndicativo>
        <div>En {!comunidades ? '' : comunidades.length > 1 ? 'las comunidades' : 'la comunidad'} <strong>{comunidadesFormateadas}</strong></div>
        <div>dentro de {!territorios ? '' : territorios.length > 1 ? '' : 'l '} <strong>{territoriosFormateados}</strong></div>
      </TextoIndicativo>
      <RectanguloAmarillo>
        <div>FAMILIAS<br />{contadorFamilias === null ? '-' : contadorFamilias}</div> 
      </RectanguloAmarillo>
    </ContenedorTotal>
  );

};

export default ComponenteTotal;

const formateaLista = (items: string[] | null): string => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
};