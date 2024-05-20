import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InfraestructuraComunal.css'; // Ensure this CSS file exists and is correctly styled

interface InfraestructuraDatos {
  maloca: number;
  educativo: number;
  salud: number;
}

const InfraestructuraComunal: React.FC = () => {
  const [data, setData] = useState<InfraestructuraDatos>({ maloca: 0, educativo: 0, salud: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<InfraestructuraDatos>('http://127.0.0.1:8000/indicadores/infraestructura/comunidad/1');
        setData(response.data[0]);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="infraestructura-container">
      <h2>Infraestructura en la comunidad</h2><br />
      <div className="infraestructura-item">
        <div className="infraestructura-icon maloca">{data.INFR_TOTMALOCAS}</div>
        <p>Maloca</p>
      </div>
      <div className="infraestructura-item">
        <div className="infraestructura-icon educativo">{data.INFR_MALESCOLAR}</div>
        <p>Infra. Educativa</p>
      </div>
      <div className="infraestructura-item">
        <div className="infraestructura-icon salud">{data.INFR_SALUDTOT}</div>
        <p>Infra. en Salud</p>
      </div>
    </div>
  );
};

export default InfraestructuraComunal;