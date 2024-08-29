//const { query } = require('../../../../becntrpar/config/db');

import { query } from '../../../../becntrpar/config/db';
export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { nome, fone, email, usuario, mensagem } = req.body;
    
    // Validação dos campos
    if (!nome || !fone || !email || !usuario) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }

    try {
      const result = await query(
        'UPDATE administradores SET nome = ?, fone = ?, email = ?, usuario = ?, mensagem = ? WHERE idAdministrador = ?',
        [nome, fone, email, usuario, mensagem, id]
      );
      res.status(200).json({ id, nome, fone, email, usuario, mensagem });
    } catch (error) {
      console.error('Erro ao atualizar administrador:', error);
      res.status(500).json({ error: 'Erro ao atualizar administrador', detalhes: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await query(
        'DELETE FROM administradores WHERE idAdministrador = ?',
        [id]
      );
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erro ao excluir administrador:', error);
      res.status(500).json({ error: 'Erro ao excluir administrador', detalhes: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
