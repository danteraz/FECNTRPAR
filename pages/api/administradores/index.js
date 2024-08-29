const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM administradores ORDER BY idAdministrador');
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar administradores' });
    }
  } else if (req.method === 'POST') {
    const { nome, fone, email, usuario, mensagem } = req.body;

    // Validação dos campos
    if (!nome || !fone || !email || !usuario) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }

    try {
      const result = await query(
        'INSERT INTO administradores (nome, fone, email, usuario, mensagem) VALUES (?, ?, ?, ?, ?)',
        [nome, fone, email, usuario, mensagem]
      );
      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao inserir administrador' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
