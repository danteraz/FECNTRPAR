import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { id } = req.query;
  console.log("ENTROU NO ID PALESTRAS?", id)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('palestras')
        .select('*')
        .eq('idPalestra', id);

      if (error) throw error;

      if (data.length > 0) {
        res.status(200).json(data[0]);
      } else {
        res.status(404).json({ error: 'Palestra não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar palestra ID.JS' });
    }
  } else if (req.method === 'PUT') {
    const { titulo, datapalestra, hora, localpalestra, organizador, assunto } = req.body;

    if (!titulo || !datapalestra || !hora || !localpalestra || !organizador || !assunto) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }

    try {
      const { error } = await supabase
        .from('palestras')
        .update([
          { titulo: titulo,
            dataPalestra: datapalestra,
            hora: hora,
            localPalestra: localpalestra,
            organizador: organizador,
            assunto: assunto
          }
        ])
        .eq('idPalestra', id);

      if (error) throw error;

      res.status(200).json({ id, titulo, datapalestra, hora, localpalestra, organizador, assunto });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar a palestras', detalhes: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('palestras')
        .delete()
        .eq('idPalestra', id);

      if (error) throw error;

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir a Palestra', detalhes: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
