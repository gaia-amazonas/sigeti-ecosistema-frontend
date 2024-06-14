const mapeaColor: { [key: string]: string } = {
  "PN": "#FFE8C2",
  "BC": "#ECA98A",
  "YA": "#98C182",
  "IS": "#D9B5E8",
  "PH": "#e9b55f",
  "VI": "#e9c0b8",
  "GM": "#b18bb4",
  "AR": "#c9d979",
  "UI": "#4c85b4",
  "PP": "#d59196",
  "GA": "#2dbeb9",
  "TQ": "#ecec9d",
  "MP": "#bbaf7b"
};

export const estiloTerritorio = (feature: any) => {
  
  let color: string = '#3388FF';
  if (feature.properties.id) {
    color = feature.properties && mapeaColor[feature.properties.id]
      ? mapeaColor[feature.properties.id]
      : '#3388FF';
  } else if (feature.properties.id_ti) {
    color = feature.properties && mapeaColor[feature.properties.id_ti]
      ? mapeaColor[feature.properties.id_ti]
      : '#3388FF';
  }

  return {
    color: "#7D7D7D",
    weight: 2,
    opacity: 0.8,
    fillColor: color,
    fillOpacity: 0.6,
    zIndex: 5
  };
};