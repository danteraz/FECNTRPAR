const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {

  const { idPalestra } = req.query;

  if (req.method === 'GET') {
    try {
      const query = `SELECT p.nome FROM presencas pr
                     JOIN participantes p ON p.idParticipante = pr.idParticipante
                     WHERE pr.idPalestra = ?`;
      const [rows] = await db.query(query, [idPalestra]);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar presenças', error });
    }
  } else if (req.method === 'POST') {
    const { idPalestra, idParticipante } = req.body;
    try {
      const query = `INSERT INTO presencas (idPalestra, idParticipante) VALUES (?, ?)`;
      await db.query(query, [idPalestra, idParticipante]);
      res.status(200).json({ message: 'Presença adicionada com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao adicionar presença', error });
    }
  } else if (req.method === 'DELETE') {
    const { idParticipante } = req.query;
    try {
      const query = `DELETE FROM presencas WHERE idParticipante = ? AND idPalestra = ?`;
      await db.query(query, [idParticipante, idPalestra]);
      res.status(200).json({ message: 'Presença removida com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover presença', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
  
}
