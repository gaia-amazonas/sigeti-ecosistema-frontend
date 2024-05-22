import SelectionProcess from 'src/components/seleccion_inicial/Seleccion';
import { GlobalStyle } from '../pages/estilos/estilosGlobales.styles'; // Adjust the path according to your project structure

const Home: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <div>
        <h1>Selection Process</h1>
        <SelectionProcess />
      </div>
    </>
  );
};

export default Home;