import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idPalestra, sorteados } = req.body;
    try {
      for (const sorteado of sorteados) {
        const { idParticipante, brinde } = sorteado;

        // Atualiza a tabela presencas para o participante sorteado
        const { error } = await supabase
          .from('presencas')
          .update({ sorteado: brinde })  // Atualiza o campo Sorteado com o brinde
          .eq('idPalestra', idPalestra)
          .eq('idParticipante', idParticipante);

        if (error) {
          console.error('Erro ao atualizar presenca:', error);
          return res.status(500).json({ error: 'Erro ao atualizar presenca' });
        }
      }

      res.status(200).json({ message: 'Presenças atualizadas com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar presenças:', error);
      res.status(500).json({ error: 'Erro ao atualizar presenças' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
