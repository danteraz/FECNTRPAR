import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { matricula, idParticipante } = req.query;

  try {
    // Busca o participante com a matricula informada
    let query = supabase
      .from('participantes')
      .select('*')
      .eq('matricula', matricula); 

    // Se for uma alteração, exclua o próprio participante da verificação
    if (idParticipante) {
      query = query.neq('idParticipante', idParticipante);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data.length > 0) {
      res.status(400).json(data[0]); // Retorna o participante com a mesma matricula
    } else {
      res.status(200).json({ message: 'Matrícula disponível.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
  }
}
