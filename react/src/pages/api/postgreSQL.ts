// .src/pages/api/postgreSQL.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
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

logger.info("Environment Variables:", {
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
});

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

export default async function handler(solicitud: NextApiRequest, respuesta: NextApiResponse) {
  if (solicitud.method === 'GET') {
    const { query } = solicitud.query;
    try {
      await esperaRespuestaPostgreSQL(query, respuesta);
    } catch (error) {
      logRespuestaErroneaPostgreSQL(error, query, respuesta);
    }
  } else {
    respuesta.status(405).json({ error: 'Método no permitido' });
  }
}

const esperaRespuestaPostgreSQL = async (query: string | string[] | undefined, respuesta: NextApiResponse) => {
  const client = await pool.connect();
  try {
    logger.info("Executing query:", { query });
    await client.query(`SET search_path TO sigetiescritorio`);
    const res = await client.query(query as string);
    logger.info("Query Result:", { res });
    respuesta.status(200).json({ rows: res.rows });
  } finally {
    client.release();
  }
}

const logRespuestaErroneaPostgreSQL = (error: unknown, query: string | string[] | undefined, respuesta: NextApiResponse) => {
  logger.error(`Error ejecutando la query: ${query}`, { error });
  respuesta.status(500).json({ error: 'Error ejecutando query', details: error });
}
