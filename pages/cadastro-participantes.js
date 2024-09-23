import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function CadastroParticipantes() {
  const router = useRouter();
  const [opcao, setOpcao] = useState('                              ');

  //  Dados de Inputs
  const [participantes, setParticipantes] = useState([]);
  const [nome, setNome] = useState('');
  const [fone, setFone] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('          ');

  //  Dados de Controle de habilitar/Desabilitar Elementos da Tela
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isNavDisabled, setIsNavDisabled] = useState(false);
  const [isImpDisabled, setIsImpDisabled] = useState(true);

  //  Dados de Paginação Listbox
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

  useEffect(() => {
    async function fetchParticipantes() {
      const res = await fetch('/api/participantes');
      const data = await res.json();
      setParticipantes(data);

      // Selecionar a primeira linha automaticamente
      if (data.length > 0) {
        setSelectedId(data[0].idParticipante);
        fillInputs(data[0].idParticipante);
      }
    }
    fetchParticipantes();
  }, []);

  const handleFocus = () => {
    setFone(fone.replace(/\D/g, ''));
  };
  const handleBlur = () => {
    setFone(formatPhoneNumber(fone));
  };

  const handleIncluir = () => {
    setOpcao('INCLUSÃO DE PARTICIPANTE');
    setIsEditing(true);
    setIsImpDisabled(false);
    resetInputs();
    disableNavButtons();
  };

  const handleAlterar = () => {
    setOpcao('ALTERAÇÃO DE PARTICIPANTE');
    setIsEditing(true);
    setIsImpDisabled(false);
    fillInputs(selectedId);
    disableNavButtons();
  };

  const handleExcluir = () => {
    setOpcao('EXCLUSÃO DE PARTICIPANTE');
    setIsEditing(true);
    setIsImpDisabled(true);
    fillInputs(selectedId);
    disableNavButtons();
    disableInputs();
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  };

  const handleConfirmar = async () => {

    // Limpa o valor do telefone para garantir que apenas os números sejam enviados
    const foneLimpo = fone.replace(/\D/g, '');

    //  Verifica se Já existe um participante com o fone
    try {
      
      if (opcao === 'ALTERAÇÃO DE PARTICIPANTE' || opcao === 'INCLUSÃO DE PARTICIPANTE') {
        let url = `/api/auth/check-fone-participante?fone=${foneLimpo}`;
        
        // Se for uma alteração, passamos também o idParticipante para ignorar ele mesmo na alteração de outro campo
        if (opcao === 'ALTERAÇÃO DE PARTICIPANTE') {
          url += `&idParticipante=${selectedId}`;
        }
      
        const response = await fetch(url);
        const result = await response.json();
    
        if (response.status === 400) {
          // Já existe um participante com este fone
          setOpcao(result.error || 'Já existe um participante com este fone!');
          // Retornar a mensagem após 3 segundos
          setTimeout(() => {
            setOpcao(opcao);
          }, 3000);
          return; // Parar a execução aqui
        }
      }
    } catch (error) {
        console.error('Erro ao verificar o participante:', error);
        return; // Parar a execução aqui
    }

    const mensagemValor = parseInt(mensagem) || null;

    if (opcao.includes('INCLUSÃO DE PARTICIPANTE')) {

      const response = await fetch('/api/participantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, fone: foneLimpo, email, mensagem: mensagemValor }),
      });
      const result = await response.json();

      console.log("RETORNO RESPONSE ", response)
      console.log("RETORNO RESULT ", result)

      if (response.status !== 200) {
          setOpcao(result.error || 'Erro ao processar a requisição');

          // Retornar a mensagem após 3 segundos
          setTimeout(() => {
            setOpcao('INCLUSÃO DE PARTICIPANTE');
          }, 3000);
          return;
      }
    }
    // Alteração 
    else if (opcao.includes('ALTERAÇÃO DE PARTICIPANTE')) {
      const response = await fetch(`/api/participantes/${selectedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, fone: foneLimpo, email, mensagem: mensagemValor }),
      });
      const result = await response.json();

      if (!response.ok) {
          setOpcao(result.error || 'Erro ao processar a requisição');

          // Retornar a mensagem após 3 segundos
          setTimeout(() => {
            setOpcao('ALTERAÇÃO DE PARTICIPANTE');
          }, 3000);
          return;
      }
    }
    // Exclusão
    else if (opcao.includes('EXCLUSÃO DE PARTICIPANTE')) {
      await fetch(`/api/participantes/${selectedId}`, {
        method: 'DELETE',
      });
    }
    setOpcao('                              ');
    setMensagem('          ');
    setIsEditing(false);
    setIsImpDisabled(true);
    resetInputs();
    await refreshListbox();
    enableNavButtons();
  };

  const handleCancelar = () => {
    setOpcao('                              ');
    setMensagem('          ');
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
    const admin = participantes.find((admin) => admin.idParticipante === id);
    if (admin) {
      setNome(admin.nome);
      setFone(formatPhoneNumber(admin.Fone));
      setEmail(admin.email);

      // Inicializa o campo "mensagem" com o valor correspondente
      const mensagemTexto = admin.mensagem === 1 ? '1' :
                            admin.mensagem === 2 ? '2' :
                            admin.mensagem === 3 ? '3' : '          ';
      setMensagem(mensagemTexto);
      //setSenha(admin.Senha);
    }
  };

  const resetInputs = () => {
    setNome('');
    setFone('');
    setEmail('');
    setMensagem('          ');
    //setSenha('');
  };

  const refreshListbox = async () => {
    const res = await fetch('/api/participantes');
    const data = await res.json();
    setParticipantes(data);
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

  const totalPages = Math.ceil(participantes.length / rowsPerPage);

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
  const displayedParticipantes = participantes.slice(startRow, endRow);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="grid w-full h-full max-w-full max-h-full bg-white rounded shadow-md p-4"
        style={{ gridTemplateRows: '0fr 3.5fr', gridTemplateColumns: '0.5fr 2.0fr' }}
      >
        {/* Área da Imagem (C11) */}
        {/*<div className="flex flex-col items-center justify-center border p-2">*/}
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

        {/* Área de Dados (C22) - Cadastro de Participantes */}
        <div className="relative flex flex-col border border-black rounded-lg p-2 space-y-2">
          {/* Título da Seção */}
          <h2 className="text-xl font-bold text-center">CADASTRO DE PARTICIPANTEES</h2>
          <hr className="border-t-2 border-black w-full mb-4" />

          {/* Operação */}
          <div className="font-bold text-left mb-4">
              Operação: <strong className={opcao.includes('!') ? 'text-red-500' : 'text-black'}>{opcao}</strong>
          </div>
          
          {/* Labels e Inputs */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center">
              <label className="mr-2 text-sm">Nome:</label>
              <input type="text" required maxlength="60"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={isImpDisabled}
                className="border border-gray-800 p-0 h-6 flex-1 rounded"
              />
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-sm">Celular:</label>
              <input  
                type="tel" required maxlength="11" 
                value={fone} 
                onChange={(e) => setFone(e.target.value)} 
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Digite 11 números (DDDNÚMERO)"
                disabled={isImpDisabled} 
                className="border border-gray-800 p-0 pl-2 rounded w-80"
              />
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-sm">E-mail:</label>
              <input type="email" maxlength="100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isImpDisabled}
                className="border border-gray-800 p-0 h-6 flex-1 rounded"
              />
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-sm">Mensagem:</label>
              <select value={mensagem} onChange={(e) => setMensagem(e.target.value)} disabled={isImpDisabled} className="border border-gray-800 p-0 h-6 w-32 rounded">
                <option value="          ">          </option>
                <option value="1">Fone</option>
                <option value="2">E-mail</option>
                <option value="3">Ambos</option>
              </select>
            </div>
          </div>
          {/* Listbox */}
          <table className="table-fixed w-full border-collapse border border-gray-500">
            <thead>
              <tr>
                  <th className="w-1/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">Cod.</th>
                  <th className="w-7/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">Nome</th>
                  <th className="w-4/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {displayedParticipantes.map((admin) => (
                <tr key={admin.idParticipante} onClick={() => !isEditing && setSelectedId(admin.idParticipante)} className={selectedId === admin.idParticipante ? 'bg-green-200' : ''}>
                  <td className="w-1/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">{admin.idParticipante}</td>
                  <td className="w-7/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">{admin.nome}</td>
                  <td className="w-4/12 border border-gray-500 px-2 py-0 p-0 whitespace-nowrap text-left">{formatPhoneNumber(admin.Fone)}</td>
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

