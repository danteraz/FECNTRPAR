import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { usuario, idAdministrador } = req.query;
  let consultausr = usuario || req.body.usuario; // Pega o usuário do corpo da requisição, se necessário

  try {
    // Consulta para verificar se o usuário já existe
    let query = supabase
      .from('administradores')
      .select('count', { count: 'exact' }) // Contagem exata
      .eq('Usuario', consultausr); // Supondo que o campo no Supabase seja "Usuario" com "U" maiúsculo

    if (idAdministrador) {
      // Se for uma alteração, exclua o próprio administrador da verificação
      query = query.neq('idAdministrador', idAdministrador);
    }

    const { count, error } = await query;

    if (error) throw error;

    if (count > 0) {
      return res.status(400).json({ error: 'Já existe um administrador com este Usuário!' });
    } else {
      res.status(200).json({ message: 'Usuário disponível.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
  }
}
