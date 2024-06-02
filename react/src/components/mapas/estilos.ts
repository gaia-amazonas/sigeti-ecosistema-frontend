export const estiloLinea = {
  color: '#FF0000', // Red color for lines
  weight: 8,        // Line thickness
  opacity: 0.6      // Line opacity
};

export const estiloTerritorio = {
  color: '#3388FF',  // Blue color for borders
  weight: 2,        // Border thickness
  opacity: 0.6,
  fillColor: '#3388FF', // Fill color
  fillOpacity: 0.2   // Fill opacity
};

export const contenedorBotones = {
  position: 'absolute',
  bottom: '10rem',
  right: 20,
  zIndex: 1000,
  background: 'transparent',
  padding: '10px',
  borderRadius: '5px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

export const estiloBoton = (isActive: boolean, color: string) => ({
  backgroundColor: isActive ? color : 'gray',
  opacity: isActive ? 0.8 : 0.6,
  color: 'white',
  border: 'none',
  padding: '10px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: isActive ? 'bold' : 'normal'
});

export const estiloCircle = {
  width: '20px',
  height: '20px',
  backgroundColor: 'orange',
  borderRadius: '50%',
  cursor: 'pointer',
  margin: '5px',
};

export const estiloTimelineContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  height: 'auto'
};

export const estiloInfoContainer = {
  marginTop: '10px',
  width: '100%'
};
