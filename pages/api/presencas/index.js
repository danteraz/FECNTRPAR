//import { query } from '../../../config/db';
const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {

  console.log("Entrou no INDEX de PRESENÇA",req.method)

  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM palestras ORDER BY idPalestra');
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar palestras' });
    }
  } else if (req.method === 'POST') {
    const { idPalestra, idParticipante } = req.body;

    if (!idPalestra || !idParticipante) {
      return res.status(400).json({ message: 'Dados incompletos.' });
    }

    try {
      const result = await query(
        'INSERT INTO presencas (idPalestra, idParticipante) VALUES (?, ?)',
        [idPalestra, idParticipante]
      );
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao adicionar presença', error });
    }
  }
}
