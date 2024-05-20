import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Seleccionador.css';

interface NombreTerritorio {
  id: number;
  nombre: string;
}

const Indicadores: React.FC = () => {
  const [nombresTerritorios, setNombresTerritorios] = useState<NombreTerritorio[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNombreTerritorio = async () => {
      try {
        const response = await axios.get<NombreTerritorio[]>(`http://127.0.0.1:8000/territorios/nombres/`);
        setNombresTerritorios(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };

    fetchNombreTerritorio();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="indicadores-container">
      <h2 className="indicadores-title">Territorios</h2>
      <ul className="indicadores-list">
        {nombresTerritorios.map(({ ID, territorio }) => (
          <li key={ID} className="indicadores-item">
            <Link to={`/indicadores/territoriales/piramide_poblacional/${ID}`} className="indicadores-link">
              {territorio}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Indicadores;
