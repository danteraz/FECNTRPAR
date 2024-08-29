import { query } from '../../../../becntrpar/config/db';

export default async function handler(req, res) {
  const { usuario, idAdministrador } = req.query;

  try {
    let sql = 'SELECT COUNT(*) as count FROM administradores WHERE usuario = ?';
    const values = [usuario];

    if (idAdministrador) {
      // Se for uma alteração, exclua o próprio administrador da verificação
      sql += ' AND idAdministrador != ?';
      values.push(idAdministrador);
    }

    const [result] = await query(sql, values);

    if (result.count > 0) {
      return res.status(400).json({ error: 'Já existe um administrador com este Usuário!' });
    } else {
      res.status(200).json({ message: 'Usuário disponível.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
  }
}
