import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { usuario, senha } = req.body;
    try {
      // Atualiza a senha do administrador baseado no nome de usuário
      const { data, error } = await supabase
        .from('administradores')
        .update({ Senha: senha })
        .eq('usuario', usuario); // Supondo que o campo no Supabase seja "Usuario" com "U" maiúsculo

      // Se houver erro, retorne mensagem de falha
      if (error) {
        return res.status(500).json({ error: 'Senha Não Alterada! Procure o Responsável pelo App' });
      // Sucesso: senha alterada
      } else {
        res.status(200).json({ success: true });
      }

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.status(500).json({ error: 'Erro no servidor ao tentar alterar a senha' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
