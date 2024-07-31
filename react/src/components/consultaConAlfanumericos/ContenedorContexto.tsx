import React from 'react';
import { Contexto } from './estilos';

interface ContextoImp {
    texto: string;
}

const ContenedorContexto = (texto: ContextoImp) => {
  return (
    <Contexto>{texto.texto}</Contexto>
  );
};

export default ContenedorContexto;