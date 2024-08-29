import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CadastroPalestras = () => {
  const [palestras, setPalestras] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [titulo, setTitulo] = useState('');
  const [assunto, setAssunto] = useState('');
  const [organizador, setOrganizador] = useState('');
  const [local, setLocal] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [operacao, setOperacao] = useState('');
  // Adicione a função handleSair aqui
  const handleSair = () => {
    window.location.href = '/login'; // Redireciona para a página de login
  };

  useEffect(() => {
    // Carregar as palestras da tabela 'palestras'
    carregarPalestras();
  }, []);

  const carregarPalestras = async () => {
    try {
      const response = await axios.get('/api/palestras');
      setPalestras(response.data);
      setTotalPaginas(Math.ceil(response.data.length / 4)); // Exibir 4 registros por página
    } catch (error) {
      console.error('Erro ao carregar as palestras:', error);
    }
  };
  const handleIncluir = () => {
    setOperacao('INCLUSÃO');
    resetForm();
    habilitarInputs();
    desabilitarBotoesMenu();
  };

  const handleAlterar = (id) => {
    setOperacao('ALTERAÇÃO');
    const palestra = palestras.find((p) => p.id === id);
    setCodigo(palestra.id);
    setData(palestra.data);
    setHora(palestra.hora);
    setTitulo(palestra.titulo);
    setAssunto(palestra.assunto);
    setOrganizador(palestra.organizador);
    setLocal(palestra.local);
    habilitarInputs();
    desabilitarBotoesMenu();
  };

  const handleExcluir = (id) => {
    setOperacao('EXCLUSÃO');
    const palestra = palestras.find((p) => p.id === id);
    setCodigo(palestra.id);
    setData(palestra.data);
    setHora(palestra.hora);
    setTitulo(palestra.titulo);
    setAssunto(palestra.assunto);
    setOrganizador(palestra.organizador);
    setLocal(palestra.local);
    desabilitarInputs();
    desabilitarBotoesMenu();
  };

  const handleConfirmar = async () => {
    const novaPalestra = {
      data,
      hora,
      titulo,
      assunto,
      organizador,
      local,
    };

    try {
      if (operacao === 'INCLUSÃO') {
        await axios.post('/api/palestras', novaPalestra);
      } else if (operacao === 'ALTERAÇÃO') {
        await axios.put(`/api/palestras/${codigo}`, novaPalestra);
      } else if (operacao === 'EXCLUSÃO') {
        await axios.delete(`/api/palestras/${codigo}`);
      }
      carregarPalestras();
      resetForm();
      habilitarBotoesMenu();
    } catch (error) {
      console.error('Erro ao confirmar a operação:', error);
    }
  };
  const resetForm = () => {
    setCodigo('');
    setData('');
    setHora('');
    setTitulo('');
    setAssunto('');
    setOrganizador('');
    setLocal('');
    setMensagem('');
  };

  const habilitarInputs = () => {
    // Habilitar os campos de input
  };

  const desabilitarInputs = () => {
    // Desabilitar os campos de input
  };

  const habilitarBotoesMenu = () => {
    // Habilitar botões de menu
  };

  const desabilitarBotoesMenu = () => {
    // Desabilitar botões de menu
  };

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  return (
    <div className="p-4">
      {/* C11: Imagem e C12: Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          <img src="/CIPA.PNG" alt="CIPA" className="h-16 w-16" />
          <h1 className="text-2xl font-bold">Cadastro de Palestras</h1>
        </div>
      </div>

      {/* C21: Área de Dados do Menu */}
      <div className="flex flex-col justify-center border p-2 space-y-4">
        <button
          type="button"
          onClick={() => handleNavigation('/cadastro-administradores')}
          className="bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300"
        >
          Cadastro de Administradores
        </button>
        <button
          type="button"
          onClick={() => handleNavigation('/cadastro-palestras')}
          className="bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300"
        >
          Cadastro de Palestras
        </button>
        <button
          type="button"
          onClick={() => handleNavigation('/cadastro-participantes')}
          className="bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300"
        >
          Cadastro de Participantes
        </button>
        <button
          type="button"
          onClick={() => handleNavigation('/cadastro-presencas')}
          className="bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300"
        >
          Cadastro de Presenças
        </button>
        <button
          type="button"
          onClick={() => handleNavigation('/geracao-qrcode')}
          className="bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300"
        >
          Geração de QRCode
        </button>
        <button
          type="button"
          onClick={() => handleNavigation('/sorteio')}
          className="bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300"
        >
          Sorteio
        </button>
        <button
          type="button"
          onClick={() => handleNavigation('/certificado-participacao')}
          className="bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300"
        >
          Certificado de Participação
        </button>
        <button
          type="button"
          onClick={handleSair}
          className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>

      {/* C22: Área de Dados do Cadastro de Palestras */}
      <div className="mt-4">
        <div className="flex justify-between">
          <div>
            <label className="block">Palestra:</label>
            <input
              type="text"
              value={codigo}
              disabled
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block">Data:</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block">Hora:</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block">Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mt-4">
          <label className="block">Assunto:</label>
          <input
            type="text"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mt-4">
          <label className="block">Organizador:</label>
          <input
            type="text"
            value={organizador}
            onChange={(e) => setOrganizador(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mt-4">
          <label className="block">Local:</label>
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mt-4">
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Cód.</th>
                <th className="border px-4 py-2">Data</th>
                <th className="border px-4 py-2">Hora</th>
                <th className="border px-4 py-2">Título</th>
              </tr>
            </thead>
            <tbody>
              {palestras
                .slice((paginaAtual - 1) * 4, paginaAtual * 4)
                .map((palestra) => (
                  <tr
                    key={palestra.id}
                    onClick={() => handleAlterar(palestra.id)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="border px-4 py-2">{palestra.id}</td>
                    <td className="border px-4 py-2">{palestra.data}</td>
                    <td className="border px-4 py-2">{palestra.hora}</td>
                    <td className="border px-4 py-2">{palestra.titulo}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <div>
            <button
              type="button"
              onClick={handleIncluir}
              className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
            >
              Incluir
            </button>
            <button
              type="button"
              onClick={() => handleAlterar(codigo)}
              className="bg-yellow-500 text-white py-1 px-4 rounded hover:bg-yellow-600"
            >
              Alterar
            </button>
            <button
              type="button"
              onClick={() => handleExcluir(codigo)}
              className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
            >
              Excluir
            </button>
            <button
              type="button"
              onClick={handleConfirmar}
              className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
            >
              Confirmar
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={handlePaginaAnterior}
              className="bg-gray-300 text-gray-700 py-1 px-4 rounded-l hover:bg-gray-400"
            >
              Anterior
            </button>
            <span className="px-4">
              Página {paginaAtual} de {totalPaginas}
            </span>
            <button
              type="button"
              onClick={handleProximaPagina}
              className="bg-gray-300 text-gray-700 py-1 px-4 rounded-r hover:bg-gray-400"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroPalestras;
