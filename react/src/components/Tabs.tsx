import { useState, useEffect } from 'react';
import { Container, TabList, TabStyle, TabPanel, Title } from 'src/components/estilos/Tabs';
import { Sexo } from 'src/components/graficos/general/Sexo';

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
    async function traerDatosGenerales() {
      const query = {
        sexo: `SELECT SEXO, ID_CNIDA, ID_TI, COUNT(*) FROM \`sigeti-admin-364713.censo_632.BD_personas\` WHERE ID_CNIDA = '${data.comunidad_id}' AND ID_TI = '${data.territorio_id}' GROUP BY ID_CNIDA, SEXO, ID_TI`,
        familias: `SELECT COUNT(*) as familias FROM \`sigeti-admin-364713.censo_632.BD_familias\` WHERE id_cnida = '${data.comunidad_id}';`,
      };

      const consultarDatos = async (query: string) => {
        const response = await fetch(`/api/bigQuery?query=${encodeURIComponent(query)}`);
        return await response.json();
      };

      const sexo = await consultarDatos(query.sexo);
      const familias = await consultarDatos(query.familias);

      setDatos((prevDatos) => ({
        ...prevDatos,
        general: [sexo, familias],
      }));
    }

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

export default Tab;
