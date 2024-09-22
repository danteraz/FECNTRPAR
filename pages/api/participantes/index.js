import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { excludePresenca } = req.query;

    try {
      // Lista os participantes que não estão na palestra (excludePresenca)
      if (excludePresenca) {
        const { data, error } = await supabase
          .from('participantes')
          .select('idParticipante, nome')
          .not('idParticipante', 'in', supabase
            .from('presencas')
            .select('idParticipante')
            .eq('idPalestra', excludePresenca)
          );

        if (error) throw error;

        res.status(200).json(data);
      } else {
        // Lista todos os participantes
        const { data, error } = await supabase
          .from('participantes')
          .select('*')
          .order('idParticipante', { ascending: true });

        if (error) throw error;

        res.status(200).json(data);
      }
    } catch (error) {
      console.error("Erro ao buscar participantes:", error.message);
      res.status(500).json({ message: 'Erro ao buscar participantes', error });
    }
  } else if (req.method === 'POST') {
    const { nome, fone, email, mensagem } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !fone) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }

    try {
      const { data, error } = await supabase
        .from('participantes')
        .insert([{ nome, fone, email, mensagem }]);

      if (error) throw error;

      res.status(201).json(data[0]);
    } catch (error) {
      console.error("Erro ao inserir participante:", error.message);
      res.status(500).json({ error: 'Erro ao inserir participante' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido.' });
  }
}
