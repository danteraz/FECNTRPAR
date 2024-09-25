import { createClient } from '@supabase/supabase-js';
import { isNullishCoalesce } from 'typescript';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { nome, matricula, empresa, setor, fone, email, mensagem } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !matricula || !empresa || (empresa === "1" && setor === '' )) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }

    try {
      const { error } = await supabase
        .from('participantes')
        .update({ nome: nome, matricula: matricula, empresa: empresa, setor: setor, Fone: fone, email: email, mensagem: mensagem })
        .eq('idParticipante', id);

      if (error) throw error;

      res.status(200).json({ id, nome, matricula, empresa, setor, fone, email, mensagem });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar participante', detalhes: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('participantes')
        .delete()
        .eq('idParticipante', id);

      if (error) throw error;

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir participante', detalhes: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
