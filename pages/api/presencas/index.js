const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {

  const { idPalestra } = req.query;

  if  (req.method === 'GET') {
    try {
      const sql = `
      SELECT pre.idParticipante, par.nome, par.fone, pre.sorteado, pre.presente
      FROM presencas pre, participantes par
      WHERE pre.idPalestra = ?
            AND par.idParticipante = pre.idParticipante
      `;  
      const rows = await query(sql, [idPalestra]);
      
      if (rows.length === 0) {
        console.warn('Nenhuma Presença encontrada');
      }
      res.status(200).json(rows);
    } catch (error) {
      console.error("Erro ao buscar presenças:", error.message); // Exibe a mensagem do erro
      console.error("Detalhes do erro:", error); // Exibe detalhes completos do erro

      res.status(500).json({ message: 'Erro ao buscar presenças', error });
    }
  } else if (req.method === 'POST') {
    const { idPalestra, idParticipante } = req.body;
    try {
      const query = `INSERT INTO presencas (idPalestra, idParticipante) VALUES (?, ?)`;
      await query(query, [idPalestra, idParticipante]);
      res.status(200).json({ message: 'Presença adicionada com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao adicionar presença', error });
    }
  } else if (req.method === 'DELETE') {
    const { idParticipante } = req.query;

    try {
      const query = `DELETE FROM presencas WHERE idParticipante = ? AND idPalestra = ?`;
      await query(query, [idParticipante, idPalestra]);
      res.status(200).json({ message: 'Presença removida com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover presença', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
  
}
