// src/pages/api/bigQuery.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';
import { config } from 'dotenv';
import winston from 'winston';


const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

const archivoVariablesAmbiente = process.env.AMBIENTE === 'produccion'
  ? '.ambiente.produccion'
  : process.env.AMBIENTE === 'desarrollo'
  ? '.ambiente.desarrollo'
  : '.ambiente.local';

const direccionAmbiente = path.resolve(process.cwd(), archivoVariablesAmbiente);
config({ path: direccionAmbiente });

const clienteBigQuery = new BigQuery({
  keyFilename: process.env.CREDENCIALES_GOOGLE,
});

export default async function handler(solicitud: NextApiRequest, respuesta: NextApiResponse) {

  if (solicitud.method === 'GET') {
    const { query } = solicitud.query;
    try {
      esperaRespuestaBigQuery(query, respuesta);
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
