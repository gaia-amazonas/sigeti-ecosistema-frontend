// src/consultas/bigQuery/alfanumerico/salud/porTodasComunidadesEnTodosTerritorios.ts
import haceClausulasWhere from "../clausulas";

type Query = (territoriosPrivados?: string[]) => string;

const funciones: Record<string, Query> = {
    mujeresEnEdadFertil: ( territoriosPrivados ) => `
        SELECT
            id_cnida AS comunidadId,
            id_ti AS territorioId,
            total_mujeres AS totalMujeres,
            mujeres_en_edad_fertil AS mujeresEnEdadFertil,
            proporcion_mujeres_en_edad_fertil as proporcionMujeresEnEdadFertil
        FROM
            \`sigeti.censo_632.mujeres_edad_fertil\`
        WHERE
            (${haceClausulasWhere({ territoriosPrivados }, 'id_ti')});`,
    territorios: () => `
        SELECT DISTINCT
            ST_AsGeoJSON(geometry) AS geometry,
            id_ti AS id,
            territorio AS nombre
        FROM
            \`sigeti.unidades_de_analisis.territorios_censo632\`;`,
    comunidadesEnTerritorios: ( territoriosPrivados ) => `
        SELECT
            ST_AsGeoJSON(cc.geometry) AS geometry,
            cc.id_cnida AS id,
            cc,nomb_cnida AS nombre
        FROM
            \`sigeti.unidades_de_analisis.comunidades_censo632\` cc
        JOIN
            \`sigeti.censo_632.comunidades_por_territorio\` cpt
        ON
            cc.id_cnida = cpt.id_cnida
        WHERE
            ${haceClausulasWhere({ territoriosPrivados }, 'id_ti')};`
    };

export default funciones;