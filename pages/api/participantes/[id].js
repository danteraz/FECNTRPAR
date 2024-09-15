const { query } = require('../../../../becntrpar/config/db');

export default async function handler(req, res) {
  const { id } = req.query;

if (req.method === 'PUT') {
    const { nome, fone, email, mensagem } = req.body;
    
    // Validação dos campos
    if (!nome || !fone ) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }

    try {
      const result = await query(
        'UPDATE participantes SET nome = ?, fone = ?, email = ?, mensagem = ? WHERE idParticipante = ?',
        [nome, fone, email, mensagem, id]
      );
      res.status(200).json({ id, nome, fone, email, mensagem });
    } catch (error) {
      console.error('Erro ao atualizar participante:', error);
      res.status(500).json({ error: 'Erro ao atualizar participante', detalhes: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await query(
        'DELETE FROM participantes WHERE idParticipante = ?',
        [id]
      );
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erro ao excluir participante:', error);
      res.status(500).json({ error: 'Erro ao excluir participante', detalhes: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
