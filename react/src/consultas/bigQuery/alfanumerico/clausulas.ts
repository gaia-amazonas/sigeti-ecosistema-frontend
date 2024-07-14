// src/consultas/BigQuery/alfanumerico/clausulas.ts

const haceClausulasWhereSimples = ({ comunidadesId, territoriosId, territoriosPrivados }: { comunidadesId?: string[], territoriosId?: string[], territoriosPrivados?: string[] }, nombreVariable: string) => {
    const ids = comunidadesId || territoriosId || territoriosPrivados || [];
    return ids.length > 0 ? `${nombreVariable} IN ('${ids.join("', '")}')` : '1=1';
};

export default haceClausulasWhereSimples;