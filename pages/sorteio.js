import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Sorteio() {

  const router = useRouter();
  const [palestras, setPalestras] = useState([]);
  const [idPalestra, setIdPalestra] = useState('');
//  const [previousIdPalestra, setPreviousIdPalestra] = useState('');  // Variável para armazenar o idPalestra anterior
  const [dataPalestra, setDataPalestra] = useState('');
  const [hora, setHora] = useState('');
  const [titulo, setTitulo] = useState('');
  const [assunto, setAssunto] = useState('');
  const [localPalestra, setLocalPalestra] = useState('');
  const [participantes, setParticipantes] = useState([]);
  const [confirmados, setConfirmados] = useState([]);
  const [sorteados, setSorteados] = useState([]);
  const [palestraSorteada, setpalestraSorteada] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [isNavDisabled, setIsNavDisabled] = useState(false);
  const [isSortearDisable, setisSortearDisable] = useState(false);

  const [QtdParticipantes, setQtdParticipantes] = useState(0)
  const [Brinde, setBrinde] = useState('')
  const [QtdBrinde, setQtdBrinde] = useState(0)

  //  COLOCAR O INPUT DE IDPALESTRA EM FOCO
  const inputRef = useRef(null);  // Criando uma referência ao input

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();  // Colocando o input em foco
    }
  }, [])

  const LerPalestra = () => {
    setDataPalestra('');
    setHora('');
    setTitulo('');
    setAssunto('');
    setLocalPalestra('');
    setConfirmados('');
    setSorteados('');
    setpalestraSorteada('');

    if (idPalestra) {
      fetchPalestra(idPalestra);  // Executa a função apenas quando o campo perde o foco
    }
  };

  const fetchPalestra = async (id) => {
    try {
      const response = await fetch(`/api/palestras/${id}`);
      const DadosPalestra = await response.json();

      if (DadosPalestra.idPalestra) {

        // Já houve Sorteio para Esta Palastra.
        if (DadosPalestra.sorteio === 1) {
          setpalestraSorteada(DadosPalestra.sorteio);
          DisableSortear(true); // Desabilita a navegação para manutenção dos participantes
          setMensagem('Sorteio ENCERRADO para Esta Palastra.');
          // Limpa a mensagem após 3 segundos
          setTimeout(() => {
            setMensagem(' ');
          }, 3000);

        } else {
          setMensagem('');
          DisableSortear(false); // Habilita as ações se a palestra não ocorreu ainda
        }
        
        // A dataPalestra já vem no formato ISO completo
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
        if (DtosPalestra > DtosHoje) {
            setpalestraSorteada(DadosPalestra.sorteio);
            DisableSortear(true); // Desabilita a navegação para manutenção dos participantes
            setMensagem('Esta Palestra Ainda Vai Ser Realizada.');

        } else if (DadosPalestra.sorteio !== 1) { 
            setMensagem('');
            DisableSortear(false); // Habilita as ações se a palestra não ocorreu ainda
        }

        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // 23/09/2024
        setDataPalestra(formattedDate);
        setHora(DadosPalestra.hora.slice(0, 5));
        setTitulo(DadosPalestra.titulo);
        setAssunto(DadosPalestra.assunto);
        setLocalPalestra(DadosPalestra.localPalestra);

        //  Popula o listbox de Participantes para o sorteio
        fetchParticipantes(id);

      } else {

        setMensagem('Palestra Não Cadastrada');
        DisableSortear(true); // Desabilita o botão Sortear

        // Limpa a mensagem após 3 segundos
        setTimeout(() => {
          setMensagem(' ');
          //setIdPalestra(previousIdPalestra); // Restaura o IdPalestra Válido
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
      // Primeiro, obtenha os participantes que participaram da palestra
      const responsePresenca = await fetch(`/api/presencas?idPalestra=${idPalestra}`);
      const presencaData = await responsePresenca.json();
      if (!responsePresenca.ok || !Array.isArray(presencaData)) {
        console.error('Erro ao buscar presenças ou estrutura de dados inválida');
        return;
      }

      // Guarda os ids dos participantes da palestra que NÃO FORAM sorteados
      const idsNaoSorteados = presencaData
        .filter(p => p.sorteado === '')  // Filtra apenas os participantes NÃO sorteados
        .map(p => ({
          idParticipante: p.idParticipante,
          nome: p.nome,
          matricula: p.matricula,
          presente: p.presente
        }));        

      // Guarda os ids dos participantes da palestra que FORAM sorteados
      const idsSorteados = presencaData
        .filter(p => p.sorteado !== '')  // Filtra apenas os participantes NÃO sorteados
        .map(p => ({
          idParticipante: p.idParticipante,
          nome: p.nome,
          matricula: p.matricula,
          brinde: p.sorteado
        }));        
      
      // Popula os listboxes Classificados por Nome
      const sortedNaoSorteados = idsNaoSorteados.sort((a, b) => a.nome.localeCompare(b.nome));
      const sortedSorteados = idsSorteados.sort((a, b) => a.nome.localeCompare(b.nome));

      setConfirmados(sortedNaoSorteados);
      setSorteados(sortedSorteados);
      setQtdParticipantes(idsNaoSorteados.length)

    } catch (error) {
      console.error('Erro ao buscar participantes:', error);
    }
  };

  const DisableSortear = (status) => {
    setisSortearDisable(status);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleSair = () => {
    router.push('/login');
  };

  const ExecutaSorteio = async () => {
    // Verifica se há confirmados para sortear
    if (QtdParticipantes === 0) {
      setMensagem('Não há participantes confirmados para o sorteio.');

      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        setMensagem(' ');
      }, 3000);

      return;
    } else if (QtdBrinde > QtdParticipantes) {
      setMensagem('Qtd Brinde MAIOR Que Participantes.');

      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        setMensagem(' ');
      }, 3000);
      
      return;      
    }

    // Gera um índice aleatório baseado no número de confirmados
    const sorteadosLocal = [];
    const novosConfirmados = [...confirmados]; // Clona o array para não modificar diretamente
  
    for (let i = 0; i < QtdBrinde; i++) {
      const indiceAleatorio = Math.floor(Math.random() * novosConfirmados.length);
      const sorteado = novosConfirmados[indiceAleatorio];
  
      // Adiciona o participante sorteado ao array de sorteados
      sorteadosLocal.push({
        idParticipante: sorteado.idParticipante,
        nome: sorteado.nome,
        fone: sorteado.fone,
        brinde: Brinde
      });
  
      // Remove o sorteado dos confirmados
      novosConfirmados.splice(indiceAleatorio, 1);
    }
  
    // Atualiza os estados
    setSorteados([...sorteados, ...sorteadosLocal]); // Adiciona os novos sorteados ao array
    setConfirmados(novosConfirmados); // Atualiza a lista de confirmados removendo os sorteados
    setQtdParticipantes(novosConfirmados.length)

  };

  //  ENCERRA SORTEIO
  const EncerraSorteio = async () => {
    // Atualiza a Palestra e o participante como sorteados
    if (idPalestra) {
      try {
        // Chamar a API para atualizar as tabelas 'palestras' e 'presencas'
        const response = await fetch('/api/atualizaSorteio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idPalestra: idPalestra // ID da palestra atual
          }),
        });
    
        if (!response.ok) {
          const error = await response.json();
          console.error('Erro ao atualizar o sorteio:', error.message);
        }
        DisableSortear(true); // Desabilita a navegação para sorteio

        //  Atualiza os sorteados da palestra
        const responseSorteado = await fetch('/api/atualizaSorteados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idPalestra: idPalestra,  // O id da palestra que está sorteando
            sorteados: sorteados     // O array com os participantes sorteados e o brinde
          }),
        });
    
        if (!response.ok) {
          console.error('Erro ao atualizar Sorteados:', await response.json());
        }

      } catch (error) {
        console.error('Erro ao chamar a API de sorteio:', error);
      }

    }
  }

  // EXIBE A TELA
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

        {/* C22: Área de Cadastro de Sorteio */}
        <div className="relative flex flex-col border border-black rounded-lg p-2 space-y-0">
          <h2 className="text-xl font-bold text-center">SORTEIO</h2>
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

          <div className="relative flex flex-col border border-black rounded-lg p-2 space-y-0.5">
            <div className="flex items-center">
              <label className="mr-2"><strong>Confirmados:</strong></label>
              <span>{QtdParticipantes}</span>
              
              <label className="ml-10 mr-2"><strong>Brinde:</strong></label>
              <input type="text"
                value={Brinde}
                onChange={(e) => setBrinde(e.target.value)}
                disabled = {isSortearDisable}
                className="border border-gray-800 p-0 pl-2 rounded"
              />
              
              <label className="ml-10 mr-2"><strong>Quantidade:</strong></label>
              <input type="number"
                value={QtdBrinde}
                onChange={(e) => setQtdBrinde(e.target.value)}
                disabled = {isSortearDisable}
                className="border border-gray-800 p-0 pl-2 rounded w-20"
              />
              <button
                type="button"
                onClick={ExecutaSorteio}
                className={"ml-9 py-1 px-4 rounded bg-green-500" }
                disabled={isSortearDisable}
              >
                <strong>SORTEAR</strong>
              </button>
            </div>
          </div>

          <div className="flex justify-between">

            {/* Listbox de Confirmados */}
            <div className="w-6/12 border rounded -lg border-gray-500 p-2">
              <h3 className="font-bold text-center mb-2">Confirmados</h3>
              <ul className="h-32 overflow-auto">
                {Array.isArray(confirmados) && confirmados.map((conf) => (
                  <li 
                    key={conf.idParticipante} 
                    className={`cursor-pointer hover:bg-gray-200 px-2 py-1 ${isSortearDisable ? 'opacity-50 cursor-not-allowed' : ''}`}        
                  >
                    {conf.idParticipante} - {conf.nome}
                    {conf.presente === 1 && <span> ✔️</span>} {/* Exibe o símbolo "marcado" */}
                  </li>
                ))}
              </ul>
            </div>
            {/* Listbox de Sorteado */}
            <div className="w-6/12 border rounded -lg border-gray-500 p-2">
              <h3 className="font-bold text-center mb-2">SORTEADO</h3>
              <ul className="h-32 overflow-auto">
                {Array.isArray(sorteados) && sorteados.map((sorte) => (
                  <li 
                    key={sorte.idParticipante} 
                    className={`cursor-pointer hover:bg-gray-200 px-2 py-1 ${isSortearDisable ? 'opacity-50 cursor-not-allowed' : ''}`}        
                  >
                    {sorte.nome} - {sorte.matricula} - <strong>{sorte.brinde}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button
            type="button"
            onClick={EncerraSorteio}
            className={`py-1 px-4 rounded bg-red-500` }
            disabled={isSortearDisable}
          >
            <strong>ENCERRAR SORTEIO</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
  