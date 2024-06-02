// src/pages/api/postgreSQL.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
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

const clientePostgres = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});
clientePostgres.connect();

export default async function handler(solicitud: NextApiRequest, respuesta: NextApiResponse) {
  if (solicitud.method === 'GET') {
    const { query } = solicitud.query;
    try {
      await esperaRespuestaPostgres(query, respuesta);
    } catch (error) {
      logRespuestaErroneaPostgres(error, query, respuesta);
    }
  } else {
    respuesta.status(405).json({ error: 'Método no permitido' });
  }
}

const esperaRespuestaPostgres = async (query: string | string[] | undefined, respuesta: NextApiResponse) => {
  const result = await clientePostgres.query(query as string);
  respuesta.status(200).json({ rows: result.rows });
}

const logRespuestaErroneaPostgres = (error: unknown, query: string | string[] | undefined, respuesta: NextApiResponse) => {
  logger.error(`Error ejecutando la query: ${query}`, error);
  respuesta.status(500).json({ error: 'Error ejecutando query', details: error });
}
