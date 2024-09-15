const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idPalestra, idParticipante } = req.body;

    if (!idPalestra || !idParticipante) {
      return res.status(400).json({ message: 'Dados insuficientes para inserir presença.' });
    }

    try {
      // Insere o idParticipante e idPalestra na tabela presencas
      const sqlInsert = `
        INSERT INTO presencas (idPalestra, idParticipante) 
        VALUES (?, ?)
      `;
      await query(sqlInsert, [idPalestra, idParticipante]);

      // Após a inserção, retorna a lista de confirmados atualizada
      const sqlConfirmados = `
        SELECT p.idParticipante, p.nome 
        FROM participantes p
        INNER JOIN presencas pr ON p.idParticipante = pr.idParticipante
        WHERE pr.idPalestra = ?
      `;
      const [confirmados] = await query(sqlConfirmados, [idPalestra]);

      res.status(200).json(confirmados); // Envia a lista atualizada de confirmados
    } catch (error) {
      console.error("Erro ao adicionar presença:", error.message);
      res.status(500).json({ message: 'Erro ao adicionar presença', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
