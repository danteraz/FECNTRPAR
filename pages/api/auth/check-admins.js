import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('administradores')
        .select('*', { count: 'exact' }); // Solicita a contagem exata de registros

      if (error) throw error;

      res.status(200).json({ count }); // Retorna a contagem diretamente
    } catch (error) {
      console.error('Erro ao verificar administradores:', error);
      res.status(500).json({ error: 'Erro ao verificar administradores' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
