import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { id: idParticipante } = req.query; // O 'id' é obtido da rota dinâmica
  const { idPalestra } = req.query;
    console.log("ENTROU NO ID PRESENCAS?",idParticipante,idPalestra)
  if (req.method === 'GET') {
    try {
      // Lista todos participantes de uma palestra
      let query = supabase
        .from('presencas')
        .select('idParticipante, presente, sorteado, participantes(nome)')
        .eq('idPalestra', idPalestra);

      // Verifica se é para listar um participante específico
      if (idParticipante) {
        query = query.eq('idParticipante', idParticipante);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data.length === 0) {
        console.warn('Nenhuma presença encontrada.');
      }

      res.status(200).json(data);
    } catch (error) {
      console.error("Erro ao buscar presenças:", error.message);
      res.status(500).json({ message: 'Erro ao buscar presenças', error });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query; // id do participante
    const { idPalestra } = req.query; // id da palestra

    if (!id || !idPalestra) {
      return res.status(400).json({ message: 'Dados incompletos.' });
    }

    try {
      // Remover presença
      const { error } = await supabase
        .from('presencas')
        .delete()
        .eq('idPalestra', idPalestra)
        .eq('idParticipante', id);

      if (error) throw error;

      res.status(200).json({ message: 'Presença removida com sucesso.' });
    } catch (error) {
      console.error("Erro ao remover presença:", error.message);
      res.status(500).json({ message: 'Erro ao remover presença', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido.' });
  }
}
