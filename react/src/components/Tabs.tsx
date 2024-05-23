import { useState, useEffect } from 'react';
import { Container, TabList, TabStyle, TabPanel, Title } from 'components/estilos/Tabs';
import { Sexo } from 'components/graficos/general/Sexo';
import generalesQueries from 'components/consultas/generalesQueries';

interface TabImp {
  data: any;
}

interface DatosImp {
  general: any[];
  cultural: any[];
  educacion: any[];
}

const Tab: React.FC<TabImp> = ({ data }) => {
  const [activo, setActivo] = useState('general_tab');
  const [datos, setDatos] = useState<DatosImp>({
    general: [],
    cultural: [],
    educacion: []
  });

  useEffect(() => {
    const traerDatosGenerales = async () => {
      const sexo = await consultarDatos(generalesQueries.sexo(data.comunidad_id, data.territorio_id));
      const familias = await consultarDatos(generalesQueries.familias(data.comunidad_id));

      setDatos((prevDatos) => ({
        ...prevDatos,
        general: [sexo, familias],
      }));
    };

    traerDatosGenerales();
  }, [data.comunidad_id, data.territorio_id]);

  return (
    <Container>
      <Title>Temáticas</Title>
      <TabList>
        <TabStyle active={activo === 'general_tab'} onClick={() => setActivo('general_tab')}>General</TabStyle>
        <TabStyle active={activo === 'cultural_tab'} onClick={() => setActivo('cultural_tab')}>Cultural</TabStyle>
        <TabStyle active={activo === 'educacion_tab'} onClick={() => setActivo('educacion_tab')}>Educación</TabStyle>
      </TabList>
      <TabPanel>
        {activo === 'general_tab' && <Sexo data={datos.general} />}
        {activo === 'cultural_tab' && <div>{JSON.stringify(datos.cultural, null, 2)}</div>}
        {activo === 'educacion_tab' && <div>{JSON.stringify(datos.educacion, null, 2)}</div>}
      </TabPanel>
    </Container>
  );
};

const consultarDatos = async (query: string) => {
  const response = await fetch(`/api/bigQuery?query=${encodeURIComponent(query)}`);
  return await response.json();
};

export default Tab;
