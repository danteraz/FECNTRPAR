import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { nome, fone, email, usuario, mensagem } = req.body;

    if (!nome || !fone || !email || !usuario) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }

    try {
      const { error } = await supabase
      .from('administradores')
      .update({
        nome: nome,
        Fone: fone,  // "Fone" com "F" maiúsculo, porque a coluna foi criada assim
        email: email,
        usuario: usuario,
        mensagem: mensagem
      })
      .eq('idAdministrador', id);

      if (error) throw error;

      res.status(200).json({ id, nome, fone, email, usuario, mensagem });
    } catch (error) {
      console.error('Erro ao atualizar administrador:', error);
      res.status(500).json({ error: 'Erro ao atualizar administrador', detalhes: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('administradores')
        .delete()
        .eq('idAdministrador', id);

      if (error) throw error;

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erro ao excluir administrador:', error);
      res.status(500).json({ error: 'Erro ao excluir administrador', detalhes: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
