import { query } from '../../../../becntrpar/config/db';

export default async function handler(req, res) {
  const { usuario, idAdministrador } = req.query;
  let consultausr = ''

  //  Usuario indefinido vem do botão "Esqueci a Senha" do login.js então pega do Body
  if (!usuario) {
    // Se for uma alteração, exclua o próprio administrador da verificação
    consultausr = req.body.usuario
  } else {
    consultausr = usuario
  }

  try {
    let sql = 'SELECT COUNT(*) as count FROM administradores WHERE usuario = ?';
    const values = [consultausr];

    if (idAdministrador) {
      // Se for uma alteração, exclua o próprio administrador da verificação
      sql += ' AND idAdministrador != ?';
      values.push(idAdministrador);
    }

    const [result] = await query(sql, values);

    if (result.count > 0) {
      return res.status(400).json({ error: 'Já existe um administrador com este Usuário!' });
    } else {
      res.status(200).json({ message: 'Usuário disponível.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
  }
}
