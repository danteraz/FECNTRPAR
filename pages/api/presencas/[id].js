import { query } from '../../../../becntrpar/config/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query; // id do participante
    const { idPalestra } = req.query; // id da palestra

    if (!id || !idPalestra) {
      return res.status(400).json({ message: 'Dados incompletos.' });
    }

    try {
      // Tente executar a query de DELETE
      const result = await query(
        'DELETE FROM presencas WHERE idPalestra = ? AND idParticipante = ?',
        [idPalestra, id]
      );

      // Se o DELETE não afetou nenhuma linha, avisa o usuário
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Presença não encontrada para este Participante.' });
      }

      res.status(200).json({ message: 'Presença removida com sucesso.' });
    } catch (error) {
      console.error("Erro ao remover presença:", error.message); // Exibe a mensagem de erro
      console.error("Detalhes do erro:", error); // Exibe os detalhes completos do erro

      res.status(500).json({ message: 'Erro ao remover presença', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
