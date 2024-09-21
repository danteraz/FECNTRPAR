import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { usuario, senha } = req.body;

    try {
      // Verifica se o usuário e a senha são válidos
      const { data, error } = await supabase
        .from('administradores')
        .select('*')
        .eq('usuario', usuario)  
        .eq('Senha', senha);

      if (error) throw error;

      if (data.length > 0) {
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ error: 'Usuário e/ou Senha Não Encontrado' });
      }
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      res.status(500).json({ error: 'Erro ao autenticar usuário' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
