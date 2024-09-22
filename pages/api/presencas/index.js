import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { idPalestra } = req.query;

  if (req.method === 'GET') {
    try {
      // Join entre as tabelas presencas e participantes
      const { data, error } = await supabase
        .from('presencas')
        .select('idParticipante, sorteado, presente, participantes (nome, fone)')
        .eq('idPalestra', idPalestra);

      if (error) throw error;

      if (data.length === 0) {
        console.warn('Nenhuma Presença encontrada');
      }

      res.status(200).json(data);
    } catch (error) {
      console.error("Erro ao buscar presenças:", error.message);
      res.status(500).json({ message: 'Erro ao buscar presenças', error });
    }
  } else if (req.method === 'POST') {
    const { idPalestra, idParticipante } = req.body;

    try {
      const { error } = await supabase
        .from('presencas')
        .insert([{ idPalestra, idParticipante }]);

      if (error) throw error;

      res.status(200).json({ message: 'Presença adicionada com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao adicionar presença', error });
    }
  } else if (req.method === 'DELETE') {
    const { idParticipante } = req.query;

    try {
      const { error } = await supabase
        .from('presencas')
        .delete()
        .eq('idParticipante', idParticipante)
        .eq('idPalestra', idPalestra);

      if (error) throw error;

      res.status(200).json({ message: 'Presença removida com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover presença', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
