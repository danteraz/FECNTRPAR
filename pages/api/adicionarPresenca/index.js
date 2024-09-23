import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idPalestra, idParticipante } = req.body;

    if (!idPalestra || !idParticipante) {
      return res.status(400).json({ message: 'Dados insuficientes para inserir presença.' });
    }

    try {
      // Inserindo nova presença
      const { error } = await supabase
        .from('presencas')
        .insert([{ idPalestra: idPalestra, idParticipante: idParticipante, presente: 1 }]);

      if (error) throw error;

      // INNER JOIN entre participantes e presencas para obter o participante confirmado
      /*
      const { data: confirmados, error: errorConfirmados } = await supabase
        .from('presencas')
        .select('participantes(idParticipante, nome)')
        .eq('idPalestra', idPalestra)
        .join('participantes', 'participantes.idParticipante', 'presencas.idParticipante');

      if (errorConfirmados) throw errorConfirmados;
      */
    
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erro ao adicionar presença:', error.message);
      res.status(500).json({ message: 'Erro ao adicionar presença', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
