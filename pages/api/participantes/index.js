const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {
  
  if (req.method === 'GET') {
    const { excludePresenca } = req.query;

    console.log("Valor de excludePresenca:", excludePresenca); // Adicione para verificar o valor
    
    //  CHAMADA PARA POPULAR O LISTBOX DOS PARTICIPANTES AINDA SEM PALESTRA
    if  (excludePresenca) {
      try {
        const sql = `
          SELECT idParticipante, nome 
          FROM participantes 
          WHERE idParticipante NOT IN (
            SELECT idParticipante 
            FROM presencas 
            WHERE idPalestra = ?
          )
        `;  
        const rows = await query(sql, [excludePresenca]);

        console.log("Participantes retornados:", rows); // Adicione para verificar se a query retorna valores
        if (rows.length === 0) {
          console.warn('Nenhum participante encontrado');
        }
  
        res.status(200).json(rows); // Garante que retorna um array
      } catch (error) {
        console.error("Erro ao buscar participantes:", error.message); // Exibe a mensagem do erro
        console.error("Detalhes do erro:", error); // Exibe detalhes completos do erro

        res.status(500).json({ message: 'Erro ao buscar participantes', error });
      }

    //  CHAMADA PARA POPULAR O LISTBOX DE CADASTRO DOS PARTICIPANTES
    } else {
      try {
        const result = await query('SELECT * FROM participantes ORDER BY idParticipante');
        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar Participantes' });
      }
  
    }

  } else if (req.method === 'POST') {
    const { nome, fone, email, mensagem } = req.body;

    // Validação dos campos
    if (!nome || !fone ) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }
    console.log(nome, fone, email, mensagem)

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
