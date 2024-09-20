import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import QRCode from 'react-qr-code';  // Adicionado para gerar o QRCode

export default function GeracaoQRCode() {

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

  const [qrCodeUrl, setQrCodeUrl] = useState('');  // Novo estado para a URL do QRCode
  const [isPrintDisabled, setIsPrintDisabled] = useState(true); // Desabilita o botão de imprimir por padrão

  //  COLOCAR O INPUT DE IDPALESTRA EM FOCO
  const inputRef = useRef(null);  // Criando uma referência ao input

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();  // Colocando o input em foco
    }
  }, [])

  const LerPalestra = () => {
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
        const dataHoraPalestra = new Date(DadosPalestra.dataPalestra); // Use apenas a data completa vinda do banco
        const now = new Date();
        if (dataHoraPalestra < now) {
            disableListbox(true); // Desabilita a navegação para manutenção dos participantes
            setMensagem('Esta Palastra Já Ocorreu e Será apenas Visualizada.');
            setQrCodeUrl(''); // Não gera o QRCode se a palestra já ocorreu
            setIsPrintDisabled(true); // Desabilita o botão de impressão
  
            // Limpa a mensagem após 3 segundos
            setTimeout(() => {
              setMensagem(' ');
              //inputRef.current.focus();
            }, 3000);
        } else {
          //const qrCodeLink = `http://localhost:3000/participante-qrcode?idPalestra=${id}`;
          const qrCodeLink = `https://www.msn.com/pt-br/noticias/ciencia-e-tecnologia/al%C3%A9m-de-caminhada-espacial-quais-experimentos-s%C3%A3o-feitos-na-miss%C3%A3o-polaris-dawn/ar-AA1qwOth?ocid=msedgntp&pc=U531&cvid=096264e60e204540a21024f8807777bc&ei=15`;
          setQrCodeUrl(qrCodeLink); // Gera o QRCode
          setIsPrintDisabled(false); // Habilita o botão de impressão
        }

        const formattedDate = new Date(DadosPalestra.dataPalestra).toLocaleDateString('pt-BR')
        setDataPalestra(formattedDate);
        setHora(DadosPalestra.hora.slice(0, 5));
        setTitulo(DadosPalestra.titulo);
        setAssunto(DadosPalestra.assunto);
        setLocalPalestra(DadosPalestra.localPalestra);
        
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

  const fetchParticipantes = async (id) => {
      const response = await fetch(`/api/participantes?excludePresenca=${id}`);
      const data = await response.json();
      
      const sortedParticipantes = data.sort((a, b) => a.nome.localeCompare(b.nome));
  
      setParticipantes(sortedParticipantes); // Define o estado com os participantes
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
          idParticipante: idParticipante,
        }),
      });
  
      if (response.ok) {
        // Atualize a lista de confirmados após a inserção bem-sucedida
        const data = await response.json();
        setConfirmados(data); // Atualiza a lista de confirmados com a resposta do backend
        
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

  const handlePrint = () => {
    window.print();  // Função nativa do JavaScript para imprimir a página
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="grid w-full h-full max-w-full max-h-full bg-white rounded shadow-md p-4"
        style={{ gridTemplateRows: '0fr 3.5fr', gridTemplateColumns: '0.5fr 2.0fr' }}
      >
        {/* C11: Área da Imagem */}
        <div className="imagem-cipa flex flex-col items-center justify-center">
          <Image src="/CIPA.PNG" alt="CIPA" width={100} height={100} />
        </div>

        {/* C12: Cabeçalho */}
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">CONTROLE DE PALESTRAS</h1>
        </div>

        {/* C21: Menu Lateral */}
        <div className="menu-container flex flex-col justify-center border border-black rounded-lg p-2 space-y-4">
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

        {/* C22: Área de Geração de QRCODE */}
        <div className="dados-container relative flex flex-col border border-black rounded-lg p-2 space-y-2">
          <h2 className="titulo-secao text-xl font-bold text-center">GERAÇÃO DE QRCODE</h2>
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

          {qrCodeUrl && (
            <div className="flex justify-center mt-4">
              <QRCode value={qrCodeUrl} size={200} />
            </div>
          )}
          
          {/* Botão de Imprimir */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handlePrint}
              className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${isPrintDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isPrintDisabled} // Desabilita o botão se não atender às condições
            >
              Imprimir QRCode e Dados da Palestra
            </button>
          </div>
        </div>

        {/* CSS específico para impressão */}
        <style jsx>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .grid, .grid * {
              visibility: visible;
            }
            .grid {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }

            /* Alterações específicas para a impressão */

            .grid .flex.items-center.justify-center h1 {
              display: none; /* Esconde o título "CONTROLE DE PALESTRAS" */
            }

            /* Mover a imagem "CIPA" para o centro da célula C12 */
            .grid .flex.flex-col.items-center.justify-center {
              position: relative;
            }

            .grid .flex.flex-col.items-center.justify-center img {
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 100px; /* Ajusta o tamanho da imagem */
              margin-top: 20px; /* Ajuste para garantir que fique no centro */
            }

            /* 2. Remover a borda esquerda */
            .menu-container {
              border: none;
            }

            /* 3. Substituir "GERAÇÃO DE QRCODE" por "INSCRIÇÃO NA PALESTRA" */
            .grid .relative.flex.flex-col.border h2 {
              visibility: hidden; /* Esconde o texto "GERAÇÃO DE QRCODE" */
            }
            .grid .relative.flex.flex-col.border h2::before {
              content: "INSCRIÇÃO NA PALESTRA"; /* Substitui o texto para impressão */
              visibility: visible;
              display: block;
              text-align: center;
            }

            /* 4. Ocultar o botão na impressão */
            button {
              display: none;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
