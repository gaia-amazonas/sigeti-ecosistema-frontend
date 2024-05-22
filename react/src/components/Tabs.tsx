import { useState, useEffect } from 'react';
import { Container, TabList, Tab, TabPanel, Title } from 'src/components/estilos/Tabs.styles';

interface Props {
  data: any;
}

const TabComponent: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [tab1Data, setTab1Data] = useState([]);
  const [tab2Data, setTab2Data] = useState([]);
  const [tab3Data, setTab3Data] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const queries = {
        tab1: `SELECT * FROM table1 WHERE territorio_id = '${data.territorio_id}'`,
        tab2: `SELECT * FROM table2 WHERE territorio_id = '${data.territorio_id}'`,
        tab3: `SELECT * FROM table3 WHERE territorio_id = '${data.territorio_id}'`,
      };
      const fetchDataForTab = async (query: string) => {
        const response = await fetch(`/api/bigQuery?query=${encodeURIComponent(query)}`);
        return await response.json();
      };
      setTab1Data(await fetchDataForTab(queries.tab1));
      setTab2Data(await fetchDataForTab(queries.tab2));
      setTab3Data(await fetchDataForTab(queries.tab3));
    }

    fetchData();
  }, [data]);

  return (
    <Container>
      <Title>Query Results</Title>
      <TabList>
        <Tab active={activeTab === 'tab1'} onClick={() => setActiveTab('tab1')}>Tab 1</Tab>
        <Tab active={activeTab === 'tab2'} onClick={() => setActiveTab('tab2')}>Tab 2</Tab>
        <Tab active={activeTab === 'tab3'} onClick={() => setActiveTab('tab3')}>Tab 3</Tab>
      </TabList>
      <TabPanel>
        {activeTab === 'tab1' && <div>{JSON.stringify(tab1Data, null, 2)}</div>}
        {activeTab === 'tab2' && <div>{JSON.stringify(tab2Data, null, 2)}</div>}
        {activeTab === 'tab3' && <div>{JSON.stringify(tab3Data, null, 2)}</div>}
      </TabPanel>
    </Container>
  );
};

export default TabComponent;
