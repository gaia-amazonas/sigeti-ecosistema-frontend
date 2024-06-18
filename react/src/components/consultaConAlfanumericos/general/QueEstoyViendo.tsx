// QueEstoyViendo.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface QueEstoyViendoImp {
  comunidades: FeatureCollection<Geometry, GeoJsonProperties>;
  territorios: FeatureCollection<Geometry, GeoJsonProperties>;
}

const BotonFijo = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  z-index: 2;
`;

const Popup = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: auto;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 8px;
  z-index: 2;
`;

const CabeceraPopup = styled.div`
  font-weight: bold;
  top: 0.5rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
`;

const Filtro = styled.div`
  font-weight: bold;
`;


const BotonCerrar = styled.button`
    position: absolute;
    top: 0rem;
    right: 0.5rem;
    border-radius: 50%;
    background-color: transparent;
    border: none;
    cursor: pointer;
    line-height: 1;
    &:before {
        content: '×';
        font-size: 2rem;
        color: red;
    }
`;



const QueEstoyViendo: React.FC<QueEstoyViendoImp> = ({comunidades, territorios}) => {
    const [esPopupVisible, establecerEsPopupVisible] = useState(false);

    const alternarPopup = () => {
        establecerEsPopupVisible(!esPopupVisible);
    };

    return (
        <>
        {   
            !esPopupVisible && <BotonFijo onClick={alternarPopup}>?</BotonFijo>
        }
        
        {
            esPopupVisible && (
                <Popup>
                <CabeceraPopup>¿Qué estoy viendo?</CabeceraPopup>
                <Filtro>{comunidades.features.length > 1 ? 'Comunidades': 'Comunidad'}</Filtro>
                <BotonCerrar onClick={alternarPopup}/>
                {comunidades.features.map((feature, index) => (
                    <div key={index}>
                        {feature.properties && feature.properties.nombre ? feature.properties.nombre : 'Nombre no disponible'}
                    </div>
                ))}
                <Filtro>{territorios.features.length > 1 ? 'Territorios': 'Territorio'}</Filtro>
                    {territorios.features.map((feature, index) => (
                    <div key={index}>
                        {feature.properties && feature.properties.nombre ? feature.properties.nombre : 'Nombre no disponible'}
                    </div>
                ))}
                </Popup>
            )
        }
        </>
    );
};

export default QueEstoyViendo;
