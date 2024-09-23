import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('palestras')
        .select('*')
        .order('idPalestra', { ascending: true });

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar palestras' });
    }
  } else if (req.method === 'POST') {
    const { titulo, datapalestra, hora, localpalestra, organizador, assunto } = req.body;

    if (!titulo || !datapalestra || !hora || !localpalestra || !organizador || !assunto) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }

    try {
      const { error } = await supabase
        .from('palestras')
        .insert([
          { titulo: titulo,
            dataPalestra: datapalestra,
            hora: hora,
            localPalestra: localpalestra,
            organizador: organizador,
            assunto: assunto
          }
        ]);

        if (error) throw error;

      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao inserir Palestras' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
