// src/components/indicadores/Indicadores.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Indicadores.css';

const Indicadores: React.FC = () => {
  const territorios = [
    'Resguardo Bajo Río Guainía y Rio Negro',
    'Rio Atabapo e Inirida',
    'Territorio Indigena Alto Río Guainía',
    'Territorio Indigena Medio Río Guainía',
    'Territorio Indigena Yaigojé Apaporis',
    'Territorio Indígena Arica',
    'Territorio Indígena Bajo Caquetá - Amazonas',
    'Territorio Indígena CIMTAR',
    'Territorio Indígena Mirití Paraná',
    'Territorio Indígena PANI',
    'Territorio Indígena UITIBOC',
    'Territorio Indígena Unido de los Ríos Isana y Surubí',
    'Territorio Indígena del Pira Paraná',
    'Territorio Indígena del Río Tiquié'
  ];

  return (
    <div className="indicadores-container">
      <h2 className="indicadores-title">Territorios</h2>
      <ul className="indicadores-list">
        {territorios.map((territorio, index) => (
          <li key={index} className="indicadores-item">
            <Link to={`/indicadores/piramide_poblacional/${index + 1}`} className="indicadores-link">
              {territorio}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Indicadores;
