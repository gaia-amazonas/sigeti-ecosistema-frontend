import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
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
  : '.ambiente.escritorio';

const direccionAmbiente = path.resolve(process.cwd(), archivoVariablesAmbiente);
config({ path: direccionAmbiente });

console.log("Environment Variables:");
console.log("POSTGRES_USER:", process.env.POSTGRES_USER);
console.log("POSTGRES_HOST:", process.env.POSTGRES_HOST);
console.log("POSTGRES_DB:", process.env.POSTGRES_DB);
console.log("POSTGRES_PASSWORD:", process.env.POSTGRES_PASSWORD);
console.log("POSTGRES_PORT:", process.env.POSTGRES_PORT);

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
    console.log("Executing query:", query);
    // Execute the query and get the result
    await client.query(`SET search_path TO sigetiescritorio`);
    const res = await client.query(query as string);
    console.log("Query Result:", res);
    respuesta.status(200).json({ rows: res.rows });
  } finally {
    client.release();
  }
}

const logRespuestaErroneaPostgreSQL = (error: unknown, query: string | string[] | undefined, respuesta: NextApiResponse) => {
  logger.error(`Error ejecutando la query: ${query}`, error);
  respuesta.status(500).json({ error: 'Error ejecutando query', details: error });
}
