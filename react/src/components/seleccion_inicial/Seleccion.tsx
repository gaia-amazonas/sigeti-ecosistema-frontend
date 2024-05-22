import { useEffect, useState } from 'react';
import TerritorioIndigena from 'src/components/seleccion_inicial/TerritorioIndigena';
import ResguardoIndigena from 'src/components/seleccion_inicial/ResguardoIndigena';
import AATI from 'src/components/seleccion_inicial/AATI';
import ComunidadIndigena from 'src/components/seleccion_inicial/ComunidadIndigena';
import TabComponent from 'src/components/Tabs';
import { Container, StepContainer, Title, Button } from 'src/components/seleccion_inicial/estilos/Seleccion.styles';

const SelectionProcess: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const nextStep = () => setStep(step + 1);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Container>
      <StepContainer>
        {step === 1 && (
          <TerritorioIndigena data={data} setData={setData} nextStep={nextStep} />
        )}
        {step === 2 && (
          <>
            <Title>Select Resguardo Indigena</Title>
            <ResguardoIndigena data={data} setData={setData} nextStep={nextStep}/>
          </>
        )}
        {step === 3 && (
          <>
            <Title>Select AATI</Title>
            <AATI data={data} setData={setData} nextStep={nextStep}/>
          </>
        )}
        {step === 4 && (
          <>
            <Title>Select Comunidad Indigena</Title>
            <ComunidadIndigena data={data} setData={setData} nextStep={nextStep}/>
          </>
        )}
        {step > 4 && (
          <TabComponent data={data} />
        )}
      </StepContainer>
      {step <= 4 && <Button onClick={nextStep}>Next</Button>}
    </Container>
  );
};

export default SelectionProcess;
