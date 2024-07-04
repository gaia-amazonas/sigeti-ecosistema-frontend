// src/consultas/BigQuery/alfanumerico/clausulas.ts

const haceClausulasWhereSimples = ({ comunidadesId, territoriosId }: { comunidadesId?: string[], territoriosId?: string[] }, nombreVariable: string) => {
    const ids = comunidadesId || territoriosId || [];
    return ids.length > 0 ? `${nombreVariable} IN ('${ids.join("', '")}')` : '1=1';
};

export default haceClausulasWhereSimples;