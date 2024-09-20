const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idPalestra, idParticipanteSorteado } = req.body; // Recebe os parâmetros do frontend

    try {
      // Atualiza a tabela 'palestras' para marcar que o sorteio foi realizado
      const updatePalestraQuery = `
        UPDATE palestras 
        SET sorteio = 1 
        WHERE idPalestra = ?`;
      await query(updatePalestraQuery, [idPalestra]);

      // Atualiza a tabela 'presencas' para marcar o participante sorteado
      const updatePresencaQuery = `
        UPDATE presencas 
        SET sorteado = 1 
        WHERE idParticipante = ? AND idPalestra = ?`;
      await query(updatePresencaQuery, [idParticipanteSorteado, idPalestra]);

      res.status(200).json({ message: 'Sorteio atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar sorteio:', error);
      res.status(500).json({ message: 'Erro ao atualizar sorteio', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}