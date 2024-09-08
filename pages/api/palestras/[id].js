//const { query } = require('../../../../becntrpar/config/db');

import { query } from '../../../../becntrpar/config/db';
export default async function handler(req, res) {

  console.log("Entrou no ID palestra",req.method)

  const { id } = req.query;

  if (req.method === 'GET') {
    const sql = 'SELECT * FROM palestras WHERE idPalestra = ?';
    const values = [id];
  
    try {
      console.log("QUERY",sql)
      console.log("PALESTRA",values)
      const [rows] = await query(sql, values);
      
      if (rows && rows.idPalestra) {
        console.log("Linha da Palestra",rows)
        res.status(200).json(rows);
      } else {
        res.status(404).json({ error: 'Palestra não encontrada' });
      }
    } catch (error) {
      console.log("Linha da Palestra CATCH ERRO",rows)

      res.status(500).json({ error: 'Erro ao buscar palestra ID.JS' });
    } 
  } else if (req.method === 'PUT') {
    const { titulo, datapalestra, hora, localpalestra, organizador, assunto } = req.body;
    
    // Validação dos campos
    if (!titulo || !datapalestra || !hora || !localpalestra || !organizador || !assunto) {
      return res.status(400).json({ error: 'Existe Campo obrigatório NÃO Preenchido!' });
    }
    
    try {
      const result = await query(
        'UPDATE palestras SET titulo = ?, dataPalestra = ?, hora = ?, localPalestra = ?, organizador = ?, assunto = ? WHERE idPalestra = ?',
        [titulo, datapalestra, hora, localpalestra, organizador, assunto, id]
      );
      res.status(200).json({ id, titulo, datapalestra, hora, localpalestra, organizador, assunto });
    } catch (error) {
      console.error('Erro ao atualizar a Palestra:', error);
      res.status(500).json({ error: 'Erro ao atualizar a palestras', detalhes: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await query(
        'DELETE FROM palestras WHERE idPalestra = ?',
        [id]
      );
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erro ao excluir a Palestra:', error);
      res.status(500).json({ error: 'Erro ao excluir a Palestra', detalhes: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
