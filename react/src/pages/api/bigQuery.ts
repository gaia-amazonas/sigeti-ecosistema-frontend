// src/pages/api/queryBigQuery.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: path.resolve(__dirname, '../../../.env.local') });

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
