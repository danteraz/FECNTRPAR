import { query } from '../../../../becntrpar/config/db';

export default async function handler(req, res) {
  const { fone, idParticipante } = req.query;

  try {
    //let sql = 'SELECT COUNT(*) as count FROM participantes WHERE fone = ?';
    let sql = 'SELECT * FROM participantes WHERE fone = ?';
    const values = [fone];

    if (idParticipante) {
      // Se for uma alteração, exclua o próprio participante da verificação
      sql += ' AND idParticipante != ?';
      values.push(idParticipante);
    }

    const [result] = await query(sql, values);
    
    if (result.idParticipante) {
      console.log("retorno check-fone",result)

      return res.status(400).json(result);
    } else {
      console.log("Fone Disponivel?")
      res.status(200).json({ message: 'Fone disponível.' });
    }
  } catch (error) {
    console.log("Catch error?")
    res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
  }
}
