const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { usuario, senha } = req.body;
    try {
      const result = await query(
        'UPDATE administradores SET senha = ? WHERE usuario = ?',
        [senha, usuario]
      );
      if (result.affectedRows > 0) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ error: 'Senha Não Alterada! Procure o Responsável pelo App' });
      }
    } catch (error) {
      console.error(error); // Log do erro para inspeção
      res.status(500).json({ error: 'Erro no servidor ao tentar alterar a senha' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
