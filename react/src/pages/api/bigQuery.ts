// src/pages/api/queryBigQuery.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { BigQuery } from '@google-cloud/bigquery';

const bigqueryClient = new BigQuery();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { query } = req.query;

    try {
      const [job] = await bigqueryClient.createQueryJob({ query: query as string });
      const [rows] = await job.getQueryResults();

      res.status(200).json({ rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error running query' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
