import { query } from '../../../../becntrpar/config/db';

export default async function handler(req, res) {

  if (req.method === 'DELETE') {
    const { idParticipante } = req.query;
    const { idPalestra } = req.body;

    if (!idParticipante || !idPalestra) {
      return res.status(400).json({ message: 'Dados incompletos.' });
    }

    try {
      const result = await query(
        'DELETE FROM presencas WHERE idPalestra = ? AND idParticipante = ?',
        [idPalestra, idParticipante]
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover presença', error });
    }
  }
}
