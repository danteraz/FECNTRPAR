import { query } from '../../../../becntrpar/config/db';

export default async function handler(req, res) {
  const { fone, idParticipante } = req.query;

  try {
    let sql = 'SELECT COUNT(*) as count FROM participantes WHERE fone = ?';
    const values = [fone];

    if (idParticipante) {
      // Se for uma alteração, exclua o próprio participante da verificação
      sql += ' AND idParticipante != ?';
      values.push(idParticipante);
    }

    const [result] = await query(sql, values);

    if (result.count > 0) {
      return res.status(400).json({ error: 'Já existe um participante com este Fone!' });
    } else {
      res.status(200).json({ message: 'Fone disponível.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
  }
}
