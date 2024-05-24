// components/seleccion_inicial/Seleccion.tsx
import React, { useEffect, useState } from 'react';
import Territorio from 'components/seleccion_inicial/Territorio';
// import ResguardoIndigena from 'components/seleccion_inicial/ResguardoIndigena';
// import AATI from 'components/seleccion_inicial/AATI';
import Comunidad from 'components/seleccion_inicial/Comunidad';
import { Container, StepContainer, Title, Button } from 'components/seleccion_inicial/estilos/Seleccion';

interface SeleccionImp {
  onFinish: (data: any) => void;
}

const SelectionProcess: React.FC<SeleccionImp> = ({ onFinish }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const nextStep = () => setStep(step + 1);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (step > 2) {
      onFinish(data);
    }
  }, [step, data, onFinish]);

  return (
    <Container>
      <StepContainer>
        {step === 1 && (
          <>
            <Title>Territorio</Title>
            <Territorio data={data} setData={setData} nextStep={nextStep} />
          </>
        )}
        {/* {step === 2 && (
          <>
            <Title>Resguardo Indigena</Title>
            <Resguardo data={data} setData={setData} nextStep={nextStep} />
          </>
        )}
        {step === 3 && (
          <>
            <Title>AATI</Title>
            <AATI data={data} setData={setData} nextStep={nextStep} />
          </>
        )} */}
        {step === 2 && (
          <>
            <Title>Seleccione la Comunidad Indigena</Title>
            <Comunidad data={data} setData={setData} nextStep={nextStep} />
          </>
        )}
      </StepContainer>
      {/* {step <= 2 && <Button onClick={nextStep}>Next</Button>} */}
    </Container>
  );
};

export default SelectionProcess;
