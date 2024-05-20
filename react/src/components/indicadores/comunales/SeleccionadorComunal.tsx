import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Seleccionador.css';

interface NombreComunidad {
  id: number;
  nombre: string;
}

const Indicadores: React.FC = () => {
  const [nombresComunidades, setNombresComunidades] = useState<NombreComunidad[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNombreComunidad = async () => {
      try {
        const response = await axios.get<NombreComunidad[]>(`http://127.0.0.1:8000/comunidades/nombres/`);
        setNombresComunidades(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };

    fetchNombreComunidad();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="indicadores-container">
      <h2 className="indicadores-title">Comunidades</h2>
      <ul className="indicadores-list">
        {nombresComunidades.map(({ ID, ID_FORM }) => (
          <li key={ID} className="indicadores-item">
            <Link to={`/indicadores/comunales/infraestructura/${ID}`} className="indicadores-link">
              {ID_FORM}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Indicadores;
