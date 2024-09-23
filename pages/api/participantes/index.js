import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {

  if (req.method === 'GET') {
    const { excludePresenca } = req.query;

    try {
      let data;
      if (excludePresenca) {
        const excludeArray = JSON.parse(excludePresenca);
        const formattedArray = `(${excludeArray.join(',')})`; // Transforma [1,3] em "(1,3)"

        // Verifique se excludeArray é um array válido
        if (!Array.isArray(excludeArray)) {
          throw new Error('excludePresenca deve ser um array');
        }
  
        // Obtenha os participantes que não estão no excludeArray
        const response = await supabase
          .from('participantes')
          .select('*')
          .not('idParticipante', 'in', formattedArray);
  
        data = response.data;
      } else {
        // Se não há exclusão, selecione todos os participantes
        const response = await supabase
          .from('participantes')
          .select('*');
  
        data = response.data;
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error('Erro ao buscar participantes:', error.message);
      res.status(500).json({ error: 'Erro ao buscar participantes' });
    }

  } else if (req.method === 'POST') {
    const { nome, fone, email, mensagem } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !fone) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }

    try {
      const { data, error } = await supabase
        .from('participantes')
        .insert([
          {
            nome: nome,         
            Fone: fone,         
            email: email,       
            mensagem: mensagem  
          }
        ])
        .select(); // Isso garante que os dados inseridos (incluindo o id) sejam retornados

      if (error) {
        return res.status(500).json({ error: 'Erro ao inserir participante' });
      // Sucesso: Participante incluído
      } else {
        //res.status(200).json({ success: true });
        return res.status(200).json({ success: true, idParticipante: data[0].idParticipante });
      }
        
    } catch (error) {
      console.error("Erro ao inserir participante:", error.message);
      res.status(500).json({ error: 'Erro ao inserir participante' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido.' });
  }
}
