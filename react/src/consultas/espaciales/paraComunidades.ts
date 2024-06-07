// src/consultas/espaciales/paraComunidades.ts
export const consultasEspacialesBigQueryParaComunidades = {
    comunidades: `
        SELECT
            geometry,
            nomb_cnida
        FROM
            \`sigeti.unidades_de_analisis.comunidades_censo632\`;`
};