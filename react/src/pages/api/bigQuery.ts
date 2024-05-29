// src/pages/api/bigQuery.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';
import { config } from 'dotenv';

// Determine which environment file to load based on the NODE_ENV variable
const envFile = process.env.ENV === 'production'
  ? '.env.production'
  : process.env.ENV === 'development'
  ? '.env.development'
  : '.env.local';

// Load environment variables from the appropriate file
const envPath = path.resolve(process.cwd(), envFile);
config({ path: envPath });

console.log('Environment Variables:', process.env);

// Initialize BigQuery client with credentials
const bigqueryClient = new BigQuery({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { query } = req.query;

    try {
      const [job] = await bigqueryClient.createQueryJob({ query: query as string });
      const [rows] = await job.getQueryResults();

      res.status(200).json({ rows });
    } catch (error) {
      console.error('Error running query:', error);
      res.status(500).json({ error: 'Error running query', details: error });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
