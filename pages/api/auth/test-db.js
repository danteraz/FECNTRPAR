const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {
  try {
    const result = await query('SELECT 1');
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha na conexão com o banco de dados' });
  }
}
