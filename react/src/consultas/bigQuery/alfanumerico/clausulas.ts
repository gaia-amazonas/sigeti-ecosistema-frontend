const haceClausulasWhere = (comunidadesId: string[], variable: string) => {
    return comunidadesId.length > 0 ? comunidadesId.map(id => `${variable} = '${id}'`).join(' OR '): `${variable} = '${comunidadesId[0]}'`;
}

export default haceClausulasWhere;