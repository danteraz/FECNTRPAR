const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { usuario, senha } = req.body;

    try {
      const result = await query(
        'SELECT * FROM administradores WHERE usuario = ? AND senha = ?',
        [usuario, senha]
      );

      if (result.length > 0) {
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ error: 'Usuário e/ou Senha Não Encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao autenticar usuário' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
