const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {
  console.log("Entrou no INDEX palestra",req.method)
  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM palestras ORDER BY idPalestra');
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar palestras' });
    }
  } else if (req.method === 'POST') {
    const { titulo, datapalestra, hora, localpalestra, organizador, assunto } = req.body;
    
    // Validação dos campos
    if (!titulo || !datapalestra || !hora || !localpalestra || !organizador || !assunto) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }
    
    try {
      const result = await query(
        'INSERT INTO palestras (titulo, dataPalestra, hora, localPalestra, organizador, assunto ) VALUES (?, ?, ?, ?, ?, ?)',
        [titulo, datapalestra, hora, localpalestra, organizador, assunto]
      );
      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao inserir Palestras' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
