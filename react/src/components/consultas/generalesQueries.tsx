const generalesQueries = {
  sexo: (comunidadId: string, territorioId: string) => `
    SELECT
      SEXO, ID_CNIDA, ID_TI, COUNT(*) 
    FROM
      \`sigeti-admin-364713.censo_632.BD_personas\`
    WHERE
      ID_CNIDA = '${comunidadId}' AND ID_TI = '${territorioId}'
    GROUP BY
      ID_CNIDA, SEXO, ID_TI`,
  familias: (comunidadId: string) => `
    SELECT
      COUNT(*) as familias
    FROM
      \`sigeti-admin-364713.censo_632.BD_familias\`
    WHERE
      id_cnida = '${comunidadId}';`,
};

export default generalesQueries;