import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function CadastroPalestras() {
  const router = useRouter();
  const [opcao, setOpcao] = useState('                              ');
  const [operacao, setOperacao] = useState('');
  
  // Dados de Entrada
  const [palestras, setPalestras] = useState([]);
  const [idcodigo, setIdCodigo] = useState('               ');
  const [datapalestra, setDataPalestra] = useState('');
  const [hora, setHora] = useState('');
  const [titulo, setTitulo] = useState('');
  const [assunto, setAssunto] = useState('');
  const [organizador, setOrganizador] = useState('');
  const [localpalestra, setLocalPalestra] = useState('');
  
  //  Dados de Paginação Listbox
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  
  //  Dados de Controle de habilitar/Desabilitar Elementos da Tela
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isNavDisabled, setIsNavDisabled] = useState(false);
  const [isImpDisabled, setIsImpDisabled] = useState(true);
  const [mensagem, setMensagem] = useState('');

  const temRegistroRef = useRef(false);

  useEffect(() => {
    async function fetchPalestras() {

      const res = await fetch('/api/palestras');
      const data = await res.json();
      setPalestras(data);

      // Selecionar a primeira linha automaticamente
      if (data.length > 0) {
        setSelectedId(data[0].idPalestra);
        fillInputs(data[0].idPalestra);
        temRegistroRef = true
      }
    }
    fetchPalestras();
  }, [temRegistroRef]);

  const handleIncluir = () => {
    setOpcao('INCLUSÃO DE PALESTRA');
    setIsEditing(true);
    setIsImpDisabled(false);
    resetInputs();
    disableNavButtons();
  };

  const handleAlterar = () => {
    //if (temRegistroRef) {
      setOpcao('ALTERAÇÃO DE PALESTRA');
      setIsEditing(true);
      setIsImpDisabled(false);
      fillInputs(selectedId);
      disableNavButtons();
    //}
    //else {
    //  setOpcao('Não HÁ Palestra para Alterar. USE INCLUIR');
    //}
  };

  const handleExcluir = () => {
    //if (temRegistroRef) {
      setOpcao('EXCLUSÃO DE PALESTRA');
      setIsEditing(true);
      setIsImpDisabled(true);
      fillInputs(selectedId);
      disableNavButtons();
      disableInputs();
    //}
    //  else {
    //  setOpcao('Não HÁ Palestra para Excluir. USE INCLUIR');
    //}
  };

  const handleConfirmar = async () => {

    // Inclusão - body: JSON.stringify({ idPalestra: maiorId, titulo, datapalestra, hora, localpalestra, organizador, assunto }),
    if (opcao.includes('INCLUSÃO DE PALESTRA')) {
      //const maiorId = Math.max(...palestras.map(a => a.idPalestra)) + 1;

      const response = await fetch('/api/palestras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titulo, datapalestra, hora, localpalestra, organizador, assunto }),
      });
      const result = await response.json();

      if (!response.ok) {
          setOpcao(result.error || 'Erro ao processar a requisição');

          // Retornar a mensagem após 3 segundos
          setTimeout(() => {
            setOpcao('INCLUSÃO DE PALESTRA');
          }, 3000);
          return;
      }
    }
    // Alteração
    else if (opcao.includes('ALTERAÇÃO DE PALESTRA')) {
      const response = await fetch(`/api/palestras/${selectedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titulo, datapalestra, hora, localpalestra, organizador, assunto }),
      });
      const result = await response.json();

      if (!response.ok) {
          setOpcao(result.error || 'Erro ao processar a requisição');

          // Retornar a mensagem após 3 segundos
          setTimeout(() => {
            setOpcao('ALTERAÇÃO DE PALESTRA');
          }, 3000);
          return;
      }
    }
    // Exclusão
    else if (opcao.includes('EXCLUSÃO DE PALESTRA')) {
      await fetch(`/api/palestras/${selectedId}`, {
        method: 'DELETE',
      });
    }
    setOpcao('                              ');
    setIsEditing(false);
    setIsImpDisabled(true);
    resetInputs();
    await refreshListbox();
    enableNavButtons();
  };

  const handleCancelar = () => {
    setOpcao('                              ');
    setIsEditing(false);
    setIsImpDisabled(true);
    resetInputs();
    enableNavButtons();
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleSair = () => {
    router.push('/login');
  };

  const fillInputs = async (id) => {
    const admin = palestras.find((admin) => admin.idPalestra === id);
    if (admin) {
      const formattedDate = new Date(admin.dataPalestra).toISOString().split('T')[0];   
      setIdCodigo(id)
      setDataPalestra(formattedDate);
      setHora(admin.hora);
      setTitulo(admin.titulo);
      setAssunto(admin.assunto);
      setOrganizador(admin.organizador);
      setLocalPalestra(admin.localPalestra);
    }
  };

  const resetInputs = () => {
    setIdCodigo('       ')
    setTitulo('');
    setDataPalestra('');
    setHora('');
    setLocalPalestra('');
    setOrganizador('');
    setAssunto('');
  };

  const refreshListbox = async () => {
    const res = await fetch('/api/palestras');
    const data = await res.json();
    setPalestras(data);
  };

  const disableInputs = () => {
    setIsImpDisabled(true);
  };

  const disableNavButtons = () => {
    setIsNavDisabled(true);
  };

  const enableNavButtons = () => {
    setIsNavDisabled(false);
  };

  const totalPages = Math.ceil(palestras.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startRow = (currentPage - 1) * rowsPerPage;
  const endRow = startRow + rowsPerPage;
  const displayedPalestras = palestras.slice(startRow, endRow);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="grid w-full h-full max-w-full max-h-full bg-white rounded shadow-md p-4"
        style={{ gridTemplateRows: '0fr 3.5fr', gridTemplateColumns: '0.5fr 2.0fr' }}
      >
        {/* Área da Imagem (C11) */}
        <div className="flex flex-col items-center justify-center">
          <Image src="/CIPA.PNG" alt="CIPA" width={100} height={100} />
        </div>

        {/* Área do Cabeçalho (C12) */}
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">CONTROLE DE PALESTRAS</h1>
        </div>

        {/* Área de Dados (Esquerda) - Menu */}
        <div className="flex flex-col justify-center border border-black rounded-lg p-2 space-y-4">
          <button
            type="button"
            onClick={() => handleNavigation('/cadastro-administradores')}
            className={`bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 ${isNavDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isNavDisabled}
          >
            Cadastro de Administradores
          </button>
          <button
            type="button"
            onClick={() => handleNavigation('/cadastro-palestras')}
            className={`bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 ${isNavDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isNavDisabled}
          >
            Cadastro de Palestras
          </button>
          <button
            type="button"
            onClick={() => handleNavigation('/cadastro-participantes')}
            className={`bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 ${isNavDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isNavDisabled}
          >
            Cadastro de Participantes
          </button>
          <button
            type="button"
            onClick={() => handleNavigation('/cadastro-presencas')}
            className={`bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 ${isNavDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isNavDisabled}
          >
            Cadastro de Presenças
          </button>
          <button
            type="button"
            onClick={() => handleNavigation('/geracao-qrcode')}
            className={`bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 ${isNavDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isNavDisabled}
          >
            Geração de QRCode
          </button>
          <button
            type="button"
            onClick={() => handleNavigation('/sorteio')}
            className={`bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 ${isNavDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isNavDisabled}
          >
            Sorteio
          </button>
          <button
            type="button"
            onClick={() => handleNavigation('/certificado-participacao')}
            className={`bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 ${isNavDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isNavDisabled}
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

        {/* Área de Dados (C22) - Cadastro de palestras */}
        <div className="relative flex flex-col border border-black rounded-lg p-2 space-y-2">
          {/* Título da Seção */}
          <h2 className="text-xl font-bold text-center">CADASTRO DE PALESTRAS</h2>
          <hr className="border-t-2 border-black w-full mb-4" />
          
          {/* Operação */}
          <div className="font-bold text-left mb-4">
              Operação: <strong className={opcao.includes('!') ? 'text-red-500' : 'text-black'}>{opcao}</strong>
          </div>

          {/* Labels e Inputs  <div className="text-left mb-4">Palestra: <strong>{idcodigo}</strong>*/}
          <div className="flex flex-col space-y-1">  {/* Aplica um espaçamento de 4px entre as linhas */}
            <div className="text-left">
              Palestra: <strong>{idcodigo}</strong>
              <label className="ml-4 mr-2 text-sm">Data:</label>
              <input type="date" value={datapalestra} onChange={(e) => setDataPalestra(e.target.value)} disabled={isImpDisabled} className="border border-gray-800 p-0 h-6 rounded flex-1" />
              <label className="ml-4 mr-2 text-sm">Hora:</label>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} disabled={isImpDisabled} className="border border-gray-800 p-0 h-6 rounded flex-1" />
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-sm">Título:</label>
              <input type="text" maxlength="100" value={titulo} onChange={(e) => setTitulo(e.target.value)} disabled={isImpDisabled} className="border border-gray-800 p-0 h-6 rounded flex-1" />
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-sm">Assunto:</label>
              <input type="text" maxlength="100" value={assunto} onChange={(e) => setAssunto(e.target.value)} disabled={isImpDisabled} className="border border-gray-800 p-0 h-6 rounded flex-1" />
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-sm">Organizador:</label>
              <input type="text" maxlength="100" value={organizador} onChange={(e) => setOrganizador(e.target.value)} disabled={isImpDisabled} className="border border-gray-800 p-0 h-6 rounded flex-1" />
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-sm">Local:</label>
              <input type="text" maxlength="100" value={localpalestra} onChange={(e) => setLocalPalestra(e.target.value)} disabled={isImpDisabled} className="border border-gray-800 p-0 h-6 rounded flex-1" />
            </div>
          </div>

          {/* Listbox */}
          <table className="table-fixed w-full border-collapse border border-gray-500">
            <thead>
              <tr>
                  <th className="w-1/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">Cod.</th>
                  <th className="w-212 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">Data</th>
                  <th className="w-1/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">Hora</th>
                  <th className="w-8/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">Título</th>
              </tr>
            </thead>
            <tbody>
              {displayedPalestras.map((palestra) => (
                <tr key={palestra.idPalestra} onClick={() => !isEditing && setSelectedId(palestra.idPalestra)} className={selectedId === palestra.idPalestra ? 'bg-green-200' : ''}>
                  <td className="w-1/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">{palestra.idPalestra}</td>
                  <td className="w-2/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">{new Date(palestra.dataPalestra).toLocaleDateString('pt-BR')}</td>
                  <td className="w-1/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">{palestra.hora.slice(0, 5)}</td>
                  <td className="w-8/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">{palestra.titulo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Botões de Ação e Controle de Paginação */}
          <div className="flex justify-between mt-2">
            <div className="flex space-x-2">
              <button onClick={() => handleIncluir()} disabled={isEditing} className="bg-gray-200 text-gray-800 py-1 px-2 rounded hover:bg-gray-300">Incluir</button>
              <button onClick={() => handleAlterar()} disabled={isEditing} className="bg-gray-200 text-gray-800 py-1 px-2 rounded hover:bg-gray-300">Alterar</button>
              <button onClick={() => handleExcluir()} disabled={isEditing} className="bg-gray-200 text-gray-800 py-1 px-2 rounded hover:bg-gray-300">Excluir</button>
              <button onClick={() => handleConfirmar()} disabled={!isEditing} className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">Confirmar</button>
              <button onClick={() => handleCancelar()} disabled={!isEditing} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">Cancelar</button>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-gray-200 text-gray-800 py-1 px-2 rounded hover:bg-gray-300">Anterior</button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-gray-200 text-gray-800 py-1 px-2 rounded hover:bg-gray-300">Próxima</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
