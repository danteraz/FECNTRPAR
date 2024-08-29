const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await query('SELECT COUNT(*) as count FROM administradores');
      const count = result[0].count;
      res.status(200).json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao verificar administradores' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
