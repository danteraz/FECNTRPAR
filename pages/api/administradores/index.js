import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('administradores')
        .select('*')
        .order('idAdministrador');

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      console.error('Erro ao buscar administradores:', error);
      res.status(500).json({ error: 'Erro ao buscar administradores' });
    }
  } else if (req.method === 'POST') {
    const { nome, fone, email, usuario, mensagem } = req.body;

    if (!nome || !fone || !email || !usuario) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }

    try {
      const { error } = await supabase
      .from('administradores')
      .insert([
        {
          nome: nome,         
          Fone: fone,         
          email: email,       
          usuario: usuario,   
          mensagem: mensagem  
        }
      ]);

      if (error) throw error;

      res.status(201).json({ success: true });
    } catch (error) {
      console.error('Erro ao inserir administrador:', error);
      res.status(500).json({ error: 'Erro ao inserir administrador' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
