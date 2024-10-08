import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {

  if (req.method === 'GET') {
    const { idPalestra } = req.query;

    try {
      // Buscando os participantes confirmados na palestra
      const { data, error } = await supabase
        .from('presencas')
        .select(`
          idParticipante,presente,sorteado,
          participantes (nome, matricula)
        `)
        .eq('idPalestra', idPalestra);
  
      if (error) {
        throw error;
      }
  
      // Formatando os dados para incluir os campos concatenados
      const confirmados = data.map((presenca) => ({
        idParticipante: presenca.idParticipante,
        nome: presenca.participantes.nome,
        matricula: presenca.participantes.matricula,
        presente: presenca.presente,
        sorteado: presenca.sorteado
      }));
      //display: `${presenca.idParticipante} - ${presenca.participantes.nome} - ${presenca.participantes.Fone}`
  
      res.status(200).json(confirmados);
    } catch (error) {
      console.error('Erro ao buscar presenças:', error.message);
      res.status(500).json({ error: 'Erro ao buscar presenças' });
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
