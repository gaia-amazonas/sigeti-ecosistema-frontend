import React, { useState, useEffect } from 'react';
import { Container, TabList, TabStyle, TabPanel, Title } from 'components/estilos/Tabs';
import { General } from 'components/graficos/general/General';
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
    async function fetchData() {

      const sexo = await fetchDatos(generalesQueries.sexo(data.comunidad_id, data.territorio_id));
      const familias = await fetchDatos(generalesQueries.familias(data.comunidad_id));
      const edad = await fetchDatos(generalesQueries.sexo_edad(data.comunidad_id, data.territorio_id));
      const territorio = await fetchDatos(generalesQueries.territorio(data.territorio_id));
      const comunidades_en_territorio = await fetchDatos(generalesQueries.comunidades_en_territorio(data.territorio_id));

      setDatos(prevDatos => ({
        ...prevDatos,
        general: [sexo, familias, edad, territorio, comunidades_en_territorio],
      }));

    };

    fetchData();
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
        {activo === 'general_tab' && <General data={datos.general} />}
        {activo === 'cultural_tab' && <div>{JSON.stringify(datos.cultural, null, 2)}</div>}
        {activo === 'educacion_tab' && <div>{JSON.stringify(datos.educacion, null, 2)}</div>}
      </TabPanel>
    </Container>
  );
};

const fetchDatos = async (query: string) => {
  const response = await fetch(`/api/bigQuery?query=${encodeURIComponent(query)}`);
  return await response.json();
};

export default Tab;
