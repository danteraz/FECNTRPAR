import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idPalestra, idParticipanteSorteado } = req.body;

    try {
      const { error: errorPalestra } = await supabase
        .from('palestras')
        .update({ sorteio: 1 })
        .eq('idPalestra', idPalestra);

      if (errorPalestra) throw errorPalestra;

      const { error: errorPresenca } = await supabase
        .from('presencas')
        .update({ sorteado: 1 })
        .eq('idParticipante', idParticipanteSorteado)
        .eq('idPalestra', idPalestra);

      if (errorPresenca) throw errorPresenca;

      res.status(200).json({ message: 'Sorteio atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar sorteio:', error);
      res.status(500).json({ message: 'Erro ao atualizar sorteio', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
