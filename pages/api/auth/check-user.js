import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  let consultausr;
  const { idAdministrador } = req.query; // Pega o idAdministrador da query string, se necessário

  if (req.method === 'GET') {
    // Quando é uma requisição GET (vinda do cadastro-administradores)
    consultausr = req.query.usuario; // Pega o usuário da query string
  } else if (req.method === 'POST') {
    // Quando é uma requisição POST (vinda do login)
    consultausr = req.body.usuario; // Pega o usuário do corpo da requisição
  }

  //if (!consultausr) {
  //  return res.status(400).json({ error: 'Usuário não fornecido' });
  //}

  try {
    // Consulta para verificar se o usuário já existe
    let query = supabase
      .from('administradores')
      .select('*', { count: 'exact' }) // Contagem exata de registros
      .eq('usuario', consultausr); // Verifica o usuário

    if (idAdministrador) {
      // Se for uma alteração, exclui o próprio administrador da verificação
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
    console.error("Erro no servidor ao verificar usuário:", error);
    res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
  }
}
