import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function CadastroPresencas() {

  const router = useRouter();
  const [palestras, setPalestras] = useState([]);
  const [idPalestra, setIdPalestra] = useState('');
  const [previousIdPalestra, setPreviousIdPalestra] = useState('');  // Variável para armazenar o idPalestra anterior
  const [dataPalestra, setDataPalestra] = useState('');
  const [hora, setHora] = useState('');
  const [titulo, setTitulo] = useState('');
  const [assunto, setAssunto] = useState('');
  const [localPalestra, setLocalPalestra] = useState('');
  const [participantes, setParticipantes] = useState([]);
  const [confirmados, setConfirmados] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [isNavDisabled, setIsNavDisabled] = useState(false);
  const [isListDisabled, setisListDisabled] = useState(false);

  //  COLOCAR O INPUT DE IDPALESTRA EM FOCO
  const inputRef = useRef(null);  // Criando uma referência ao input

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();  // Colocando o input em foco
    }
  }, [])

  const LerPalestra = () => {
    
    //  Limpar os dados da tela ao sair do input da Palestra
    setMensagem(' ');
    setParticipantes('')
    setConfirmados('')
    setDataPalestra('');
    setHora('');
    setTitulo('');
    setAssunto('');
    setLocalPalestra('');

    //  Obtem Palestra
    if (idPalestra) {
      fetchPalestra(idPalestra);  // Executa a função apenas quando o campo perde o foco
    }
  };

  const fetchPalestra = async (id) => {
    try {
      const response = await fetch(`/api/palestras/${id}`);
      const DadosPalestra = await response.json();
  
      if (DadosPalestra.idPalestra) {
        setPreviousIdPalestra(idPalestra); //Guarda o ID Atual para recuperar se for digitado um ID inválido

        // A dataPalestra já vem no formato ISO completo
        const dataHoraPalestra = DadosPalestra.dataPalestra; // Use apenas a data completa vinda do banco
        const dateParts = dataHoraPalestra.split('-'); // ['2024', '09', '23']
        const DtosPalestra = `${dateParts[0]}${dateParts[1]}${dateParts[2]}`; // 23/09/2024

        const hoje = new Date(); 
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // O mês começa em 0, por isso é necessário somar 1
        const dia = String(hoje.getDate()).padStart(2, '0');
        
        // Montar a data no formato YYYYMMDD
        const DtosHoje = `${ano}${mes}${dia}`;

        if (DtosPalestra < DtosHoje) {
            disableListbox(true); // Desabilita a navegação para manutenção dos participantes
            setMensagem('Esta Palastra Já Ocorreu e Será apenas Visualizada.');

        } else {
            disableListbox(false); // Habilita as ações se a palestra não ocorreu ainda
        }

        //const dateParts = DadosPalestra.dataPalestra.split('-'); // ['2024', '09', '23']
        //const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // 23/09/2024
        const formattedDate = new Date(DadosPalestra.dataPalestra).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
        setDataPalestra(formattedDate);
        setHora(DadosPalestra.hora.slice(0, 5));
        setTitulo(DadosPalestra.titulo);
        setAssunto(DadosPalestra.assunto);
        setLocalPalestra(DadosPalestra.localPalestra);
        
        //  Popula os listboxes de Participantes e Confirmados
        fetchParticipantes(id);
        fetchConfirmados(id);
      } else {

        setMensagem('Palestra Não Cadastrada');

        // Limpa a mensagem após 3 segundos
        setTimeout(() => {
          setMensagem(' ');
          setIdPalestra(previousIdPalestra); // Restaura o IdPalestra Válido
          inputRef.current.focus();
        }, 3000);
      }
    } catch (error) {
      setMensagem('Erro ao buscar palestra');
      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        setMensagem(' ');
      }, 3000);
    }
  };

  const fetchParticipantes = async (idPalestra) => {
    try {
      // Primeiro, obtenha os participantes que já confirmaram presença
      const responsePresenca = await fetch(`/api/presencas?idPalestra=${idPalestra}`);
      const presencaData = await responsePresenca.json();
      if (!responsePresenca.ok || !Array.isArray(presencaData)) {
        console.error('Erro ao buscar presenças ou estrutura de dados inválida');
        return;
      }
  
      // Extraia os ids dos participantes que já confirmaram presença
      const idsComPresenca = presencaData.map(p => p.idParticipante);
  
      // Se idsComPresenca for um array válido e tiver algum valor, use-o, senão, não inclua no fetch
      const url = idsComPresenca.length > 0 
        ? `/api/participantes?excludePresenca=${JSON.stringify(idsComPresenca)}`
        : `/api/participantes`;
  
      // Agora, obtenha os participantes
      const responseParticipantes = await fetch(url);
      const participantesData = await responseParticipantes.json();
  
      if (responseParticipantes.ok && Array.isArray(participantesData)) {
        const sortedParticipantes = participantesData.sort((a, b) => a.nome.localeCompare(b.nome));
        setParticipantes(sortedParticipantes);
      } else {
        console.error('Erro ao buscar participantes ou estrutura de dados inválida');
      }
    } catch (error) {
      console.error('Erro ao buscar participantes:', error);
    }
  };
    
  const fetchConfirmados = async (id) => {
    const response = await fetch(`/api/presencas?idPalestra=${id}`);
    const data = await response.json();

    const sortedConfirmados = data.sort((a, b) => a.nome.localeCompare(b.nome));

    setConfirmados(sortedConfirmados);
  };

  const adicionarPresenca = async (idParticipante) => {
    try {
      const response = await fetch('/api/adicionarPresenca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idPalestra: idPalestra,
          idParticipante: idParticipante
        }),
      });
  
      if (response.ok) {
        // Atualize a lista de confirmados após a inserção bem-sucedida
        const data = await response.json();
        //setConfirmados(data); // Atualiza a lista de confirmados com a resposta do backend
        
        fetchParticipantes(idPalestra); // Atualiza os participantes
        fetchConfirmados(idPalestra);   // Atualiza os confirmados  
      } else {
        console.error("Erro ao adicionar presença");
      }
    } catch (error) {
      console.error("Erro ao adicionar presença:", error);
    }
  };
  
  const removerPresenca = async (idParticipante) => {

    const response = await fetch(`/api/presencas/${idParticipante}?idPalestra=${idPalestra}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (response.ok) {
      fetchParticipantes(idPalestra);
      fetchConfirmados(idPalestra);
    }
  };

  const disableListbox = (status) => {
    setisListDisabled(status);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleSair = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="grid w-full h-full max-w-full max-h-full bg-white rounded shadow-md p-4"
        style={{ gridTemplateRows: '0fr 3.5fr', gridTemplateColumns: '0.5fr 2.0fr' }}
      >
        {/* C11: Área da Imagem */}
        <div className="flex flex-col items-center justify-center">
          <Image src="/CIPA.PNG" alt="CIPA" width={100} height={100} />
        </div>

        {/* C12: Cabeçalho */}
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">CONTROLE DE PALESTRAS</h1>
        </div>

        {/* C21: Menu Lateral */}
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

        {/* C22: Área de Cadastro de Presenças */}
        <div className="relative flex flex-col border border-black rounded-lg p-2 space-y-2">
          <h2 className="text-xl font-bold text-center">CADASTRO DE PRESENÇAS</h2>
          <hr className="border-t-2 border-black w-full mb-4" />

          {/* Input da Palestra */}
          <div className="flex items-center">
            <label className="mr-2">Palestra:</label>
            <input type="text"  maxlength="7"
              ref={inputRef}  // Conectando o input com o useRef
              value={idPalestra}
              onChange={(e) => setIdPalestra(e.target.value)}
              className="border border-gray-800 p-0 pl-2 rounded w-20"
              onBlur={LerPalestra}
            />
            <label className="ml-4 mr-2">Data:</label>
            <span>{dataPalestra}</span>
            <label className="ml-4 mr-2">Hora:</label>
            <span>{hora}</span>
          </div>

          {/* Mensagem de Erro ou Alerta */}
          <div className="absolute text-red-500 mt-1">
            {mensagem}
          </div>

          <div className="flex items-center">
            <label className="mr-2">Título:</label>
            <span>{titulo}</span>
          </div>
          <div className="flex items-center">
            <label className="mr-2">Assunto:</label>
            <span>{assunto}</span>
          </div>
          <div className="flex items-center">
            <label className="mr-2">Local:</label>
            <span>{localPalestra}</span>
          </div>

          <div className="flex justify-between">
            {/* LISTBOX - PARTICIPANTES*/}
            <div className="w-6/12 border rounded -lg border-gray-500 p-2">
              <h3 className="font-bold text-center mb-2">Participantes</h3>
              <ul className="h-32 overflow-auto">
                {Array.isArray(participantes) && participantes.map((part) => (
                  <li 
                    key={part.idParticipante} 
                    onClick={() => !isListDisabled && adicionarPresenca(part.idParticipante)} // Só permite clique se isListDisabled for false
                    className={`cursor-pointer hover:bg-gray-200 px-2 py-1 ${isListDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        
                  >
                    {part.nome} - {part.matricula}
                  </li>
                ))}
              </ul>
            </div>

            {/* Listbox de Confirmados */}
            <div className="w-6/12 border rounded -lg border-gray-500 p-2">
              <h3 className="font-bold text-center mb-2">Confirmados</h3>
              <ul className="h-32 overflow-auto">
                {Array.isArray(confirmados) && confirmados.map((conf) => (
                  <li 
                    key={conf.idParticipante} 
                    onClick={() => !isListDisabled && removerPresenca(conf.idParticipante)} // Só permite clique se isListDisabled for false
                    className={`cursor-pointer hover:bg-gray-200 px-2 py-1 ${isListDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}        
                  >
                    {conf.nome} - {conf.matricula}
                    {conf.presente === 1 && <span> ✔️</span>} {/* Exibe o símbolo "marcado" */}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  