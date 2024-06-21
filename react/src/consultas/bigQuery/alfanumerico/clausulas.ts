const haceClausulasWhere = (variableId: string[], nombreVariable: string) => {
    return variableId.length > 0 ? variableId.map(id => `${nombreVariable} = '${id}'`).join(' OR '): `${nombreVariable} = '${variableId[0]}'`;
}

export default haceClausulasWhere;