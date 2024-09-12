const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { excludePresenca } = req.query;

    try {
      const query = `SELECT nome FROM participantes WHERE idParticipante NOT IN 
                     (SELECT idParticipante FROM presencas WHERE idPalestra = ?)`;
      const [rows] = await db.query(query, [excludePresenca]);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar participantes', error });
    }
  } else if (req.method === 'POST') {
    const { nome, fone, email, mensagem } = req.body;

    // Validação dos campos
    if (!nome || !fone ) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }

    try {
      const result = await query(
        'INSERT INTO participantes (nome, fone, email, mensagem) VALUES (?, ?, ?, ?)',
        [nome, fone, email, mensagem]
      );
      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao inserir participante' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
