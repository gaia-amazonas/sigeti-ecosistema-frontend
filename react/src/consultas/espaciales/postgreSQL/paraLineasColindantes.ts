// src/consultas/espaciales/paraLineasColindates.ts

export const consultasEspacialesPostgreSQLParaLineasColindates = {
  lineas: `SELECT * FROM sigetiescritorio.lineascolindantes_ln;`,
  territorios: `SELECT * FROM sigetiescritorio.territoriosindigenas_pg;`
}