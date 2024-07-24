// src/components/consultaMeteorologica/gee.tsx
import React from 'react';

const IframeComponent = () => {
  return (
    <iframe
      src="https://arojas.users.earthengine.app/view/sigeti-clima"
      width="100%"
      height="500px"
      style={{ border: 'none' }}
      title="Sigeti Clima"
    ></iframe>
  );
};

export default IframeComponent;
