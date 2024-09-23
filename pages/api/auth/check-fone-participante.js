import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { fone, idParticipante } = req.query;
console.log(fone, idParticipante)
  try {
    // Busca o participante com o telefone informado
    let query = supabase
      .from('participantes')
      .select('*')
      .eq('Fone', fone); // Supondo que o campo seja "Fone" com "F" maiúsculo

    // Se for uma alteração, exclua o próprio participante da verificação
    if (idParticipante) {
      query = query.neq('idParticipante', idParticipante);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data.length > 0) {
      res.status(400).json(data[0]); // Retorna o participante com o mesmo telefone
    } else {
      res.status(200).json({ message: 'Fone disponível.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
  }
}
