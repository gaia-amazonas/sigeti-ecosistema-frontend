// src/pages/api/bigQueryEspacial.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';
import { config } from 'dotenv';
import logger from 'utilidades/logger';


const archivoVariablesAmbiente = process.env.AMBIENTE === 'produccion'
  ? '.ambiente.produccion'
  : process.env.AMBIENTE === 'desarrollo'
  ? '.ambiente.desarrollo'
  : '.ambiente.escritorio';

const direccionAmbiente = path.resolve(process.cwd(), archivoVariablesAmbiente);
config({ path: direccionAmbiente });

const clienteBigQuery = new BigQuery({
  keyFilename: process.env.CREDENCIALES_GOOGLE,
});

export default async function handler(solicitud: NextApiRequest, respuesta: NextApiResponse) {
  if (solicitud.method === 'GET') {
    const { query } = solicitud.query;
    try {
      await esperaRespuestaBigQuery(query, respuesta);
    } catch (error) {
      logRespuestaErroneaBigQuery(error, query, respuesta);
    }
  } else {
    respuesta.status(405).json({ error: 'Método no permitido' });
  }
}

const esperaRespuestaBigQuery = async (query: string | string[] | undefined, respuesta: NextApiResponse) => {
  const [job] = await clienteBigQuery.createQueryJob({ query: query as string });
  const [rows] = await job.getQueryResults();
  respuesta.status(200).json({ rows });
}

const logRespuestaErroneaBigQuery = (error: unknown, query: string | string[] | undefined, respuesta: NextApiResponse) => {
  logger.error(`Error ejecutando la query: ${query}`, error);
  respuesta.status(500).json({ error: 'Error ejecutando query', details: error });
}
