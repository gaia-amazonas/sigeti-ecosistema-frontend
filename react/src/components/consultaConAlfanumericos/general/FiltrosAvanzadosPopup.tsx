import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CajaTitulo } from '../estilos';
import Slider from 'react-slider';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  height: 25px;
  margin-top: 1rem;
`;

const Thumb = styled.div`
  height: 25px;
  width: 25px;
  background-color: #000;
  border-radius: 50%;
  cursor: grab;
`;

interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
  $index: number;
}

const Track = styled.div<TrackProps>`
  top: 50%;
  transform: translateY(-50%);
  height: 10px;
  background: ${(props) => (props.$index === 1 ? '#ddd' : '#2196F3')};
  border-radius: 999px;
`;

interface FiltrosAvanzadosProps {
  edadMinima: number;
  edadMaxima: number;
  establecerEdadMinima: (edad: number) => void;
  establecerEdadMaxima: (edad: number) => void;
  onSend: () => void;
}

const FiltrosAvanzadosPopup: React.FC<FiltrosAvanzadosProps> = ({ edadMinima, edadMaxima, establecerEdadMinima, establecerEdadMaxima, onSend }) => {
  const [values, setValues] = useState<[number, number]>([edadMinima, edadMaxima]);

  useEffect(() => {
    establecerEdadMinima(values[0]);
    establecerEdadMaxima(values[1]);
  }, [values, establecerEdadMinima, establecerEdadMaxima]);

  const controlarCambio = (newValues: number | readonly number[]) => {
    if (Array.isArray(newValues)) {
      setValues([newValues[0], newValues[1]] as [number, number]);
    }
  };

  const handleSend = () => {
    onSend();
  };

  return (
    <div>
      <CajaTitulo>Seleccione un rango de edad (0-120)</CajaTitulo>
      <StyledSlider
        value={values}
        min={0}
        max={120}
        onChange={controlarCambio}
        renderTrack={(props, state) => <Track key={state.index} {...props} $index={state.index} />}
        renderThumb={(props, state) => <Thumb key={state.index} {...props} />}
      />
      <div style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
        {values[0]} - {values[1]}
      </div>
      <button onClick={handleSend} style={{ marginTop: '1rem' }}>Send</button>
    </div>
  );
};

interface PopupProps {
  esVisible: boolean;
  edadMinima: number;
  edadMaxima: number;
  establecerEdadMinima: React.Dispatch<React.SetStateAction<number>>;
  establecerEdadMaxima: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
  onSend: () => void;
}

const Popup: React.FC<PopupProps> = ({ esVisible, edadMinima, edadMaxima, establecerEdadMinima, establecerEdadMaxima, onClose, onSend }) => {
  if (!esVisible) return null;

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={(e) => e.stopPropagation()}>
        <FiltrosAvanzadosPopup 
          edadMinima={edadMinima} 
          edadMaxima={edadMaxima} 
          establecerEdadMinima={establecerEdadMinima} 
          establecerEdadMaxima={establecerEdadMaxima} 
          onSend={onSend} 
        />
        <button onClick={onClose} style={{ marginTop: '1rem' }}>Close</button>
      </PopupContent>
    </PopupOverlay>
  );
};

export default Popup;
