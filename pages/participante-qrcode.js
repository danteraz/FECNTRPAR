import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function ParticipanteQRCode() {

  // Recebendo o idPalestra da URL
  const router = useRouter();
  const { idPalestra } = router.query;
  
  //  Dados da Palestra
  const [dataPalestra, setDataPalestra] = useState('');
  const [hora, setHora] = useState('');
  const [titulo, setTitulo] = useState('');
  const [assunto, setAssunto] = useState('');
  const [localPalestra, setLocalPalestra] = useState('');
  const [isInputDisabled, setInputDisabled] = useState(false);

  //  Dados de Inputs do Participante
  const [idParticipante, setIdParticipante] = useState(null); // Guardar o idParticipante quando encontrado
  const [statusInscricao, setStatusInscricao] = useState(''); // Para exibir a mensagem de inscrição no botão
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [setor, setSetor] = useState('');
  const [fone, setFone] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('          ');

  const [MostraBotao, setMostraBotao] = useState('');

  const foneRef = useRef(null);
  const handleFocus = () => {
    setFone(fone.replace(/\D/g, ''));
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  };

  //  Execução Automática se o idPalestra Alterar - Pesquisa a Palestra do QRCODE vinda pela URL (query)
  useEffect(() => {
    if (idPalestra) {
      fetchPalestra(idPalestra);
    }
  }, [idPalestra]);

  // Foco no input de fone após carregar os dados da palestra
  useEffect(() => {
    if (foneRef.current) {
      foneRef.current.focus(); 
    }
  }, [titulo]);

  //  Pesquisa Palestra Vinda do QRCode
  const fetchPalestra = async (id) => {
    try {
      const response = await fetch(`/api/palestras/${id}`);
      const DadosPalestra = await response.json();
  
      if (DadosPalestra.idPalestra) {

        // A dataPalestra já vem no formato ISO completo
        const dataHoraPalestra = new Date(DadosPalestra.dataPalestra); // Use apenas a data completa vinda do banco
        const now = new Date();
        if (dataHoraPalestra < now) {
          setStatusInscricao('Esta Palastra Já Ocorreu e Não Tem Mais Inscrição');
          setInputDisabled(true); // Desabilita a navegação para manutenção dos participantes
          setMostraBotao('')
        } else {
          setInputDisabled(false); // Habilita a Entrada do Participante se a palestra não ocorreu ainda
          setMostraBotao('')
        }

        const formattedDate = new Date(DadosPalestra.dataPalestra).toLocaleDateString('pt-BR')
        setDataPalestra(formattedDate);
        setHora(DadosPalestra.hora.slice(0, 5));
        setTitulo(DadosPalestra.titulo); //Alterando o titulo coloca o foco no input do FONE
        setAssunto(DadosPalestra.assunto);
        setLocalPalestra(DadosPalestra.localPalestra);
        
      } else {
        setStatusInscricao('Palestra Não Cadastrada. Ela Pode Ter Sido Excluída');
        setInputDisabled(true); // Desabilita a navegação para manutenção dos participantes
        setMostraBotao('')
      }
    } catch (error) {
      setStatusInscricao('Erro ao buscar palestra. Contate o Administrador da Palestra');
      setInputDisabled(true); // Desabilita a navegação para manutenção dos participantes
      setMostraBotao('')
    }
  };

  //  Pesquisa o Participante pela Matrícula ao Sair do INPUT se já Cadastrado
  const fetchParticipantes = async () => {
    setIdParticipante(null);
    setNome('');
    //setMatricula('');
    setEmpresa('');
    setSetor('');
    setFone('');
    setEmail('');
    setMensagem('');

    // Verificar se a Matrícula já está cadastrada
    try {
      const response = await fetch(`/api/auth/check-fone-participante?matricula=${matricula}`);
      const participante = await response.json();
      
      if (response.status === 400) {
        setIdParticipante(participante.idParticipante);
        setMatricula(participante.matricula);
        setEmpresa(participante.empresa);
        setSetor(participante.setor);
        setNome(participante.nome);
        setEmail(participante.email);
  
        // Verificar se o participante está inscrito na palestra
        verificarInscricao(participante.idParticipante);
      } else {
        setStatusInscricao("NÃO inscrito");
        setMostraBotao("NÃO")
      }
    } catch (error) {
      console.error("Erro ao verificar participante:", error);
    }

    //  Picture do fone
    setFone(formatPhoneNumber(fone));
  };

  const verificarInscricao = async (idParticipante) => {
    try {
      const response = await fetch(`/api/presencas/${idParticipante}?idPalestra=${idPalestra}`);

      if (response.ok) {
        const data = await response.json(); // Obtenha os dados da resposta
  
        if (data.length > 0) {
          setStatusInscricao('JÁ inscrito');
          setInputDisabled(true); // Desabilita a navegação para manutenção dos participantes
          setMostraBotao("JÁ")
        } else {
          setStatusInscricao("NÃO inscrito");
          setInputDisabled(false); // Habilita a navegação para manutenção dos participantes
          setMostraBotao("NÃO")
        }
      } else {
        console.error('Erro na resposta do servidor:', response.statusText);
        setStatusInscricao("Erro ao verificar inscrição");
        setMostraBotao('')
      }

    } catch (error) {
      console.error("Erro ao verificar inscrição:", error);
    }
  };

  const confirmarOuRemoverInscricao = async () => {
    // Confirmar Inscrição
    if (statusInscricao.includes("NÃO")) {
      // Limpa o valor do telefone para garantir que apenas os números sejam enviados
      const foneLimpo = fone.replace(/\D/g, '');

      try {
        const mensagemValor = parseInt(mensagem) || null;

        //  ATUALIZA PARTICIPANTE
        if (idParticipante) {
          // Atualizar participante existente
          const response = await fetch(`/api/participantes/${idParticipante}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, matricula, empresa, setor, fone: foneLimpo, email, mensagem: mensagemValor }),

          });
          const result = await response.json();

          if (!response.ok) {
            setStatusInscricao(result.error || 'Erro ao processar a requisição');
    
              // Retornar a mensagem após 3 segundos
              setTimeout(() => {
                setStatusInscricao("NÃO inscrito");
              }, 3000);
              return;
          }
    
          // Inscrever na palestra
          inscreverParticipante(idParticipante,idPalestra) 

          //  INCLUI PARTICIPANTE
        } else {
          // Criar novo participante e inscrever na palestra
          const response = await fetch(`/api/participantes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, matricula, empresa, setor, fone: foneLimpo, email, mensagem: mensagemValor }),
          });
          const novoParticipante = await response.json();

          if (!response.ok) {
            setStatusInscricao(novoParticipante.error || 'Erro ao processar a requisição');
    
              // Retornar a mensagem após 3 segundos
              setTimeout(() => {
                setStatusInscricao("NÃO inscrito");
              }, 3000);
              return;
          }

          // Inscrever na palestra
          setIdParticipante(novoParticipante.id);
          inscreverParticipante(novoParticipante.idParticipante,idPalestra) 
        }
      
      } catch (error) {
        console.error("Erro ao confirmar inscrição:", error);
      }
    // Remover Inscrição
    } else if (statusInscricao.includes("JÁ")) {
      try {
        await fetch(`/api/presencas/${idParticipante}?idPalestra=${idPalestra}`, {
          method: 'DELETE',
        });

        setStatusInscricao("Inscrição removida!");
      } catch (error) {
        console.error("Erro ao remover inscrição:", error);
      }
    }
    setInputDisabled(true); // Desabilita a Entrada do Participante se a palestra não ocorreu ainda
    setMostraBotao('')

  };

  const inscreverParticipante = async (CodParticipante,CodPalestra) => {
    try {
      const responsePresenca = await fetch('/api/adicionarPresenca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idPalestra: CodPalestra,
          idParticipante: CodParticipante,
        }),
      });

      if (responsePresenca.ok) {
        setStatusInscricao("Inscrição confirmada!");
      }

    } catch (error) {
      console.error("Erro ao verificar inscrição:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="grid w-full max-w-full max-h-full bg-white rounded shadow-md p-4"
        style={{ gridTemplateRows: '1fr 3fr', gridTemplateColumns: '1fr' }} // Duas linhas e uma coluna
      >
        {/* C11: Cabeçalho */}
        <div className="flex flex-col items-center justify-center">
          <Image src="/CIPA.PNG" alt="CIPA" width={100} height={100}/>
          <h1 className="text-2xl font-bold text-center">CONTROLE DE PALESTRAS</h1>
        </div>
  
        {/* C12: Área de Cadastro de Participação */}
        <div className="relative flex flex-col border border-black rounded-lg p-2 space-y-2">
          <h2 className="text-xl font-bold text-center">PARTICIPAÇÃO NA PALESTRA</h2>
          <hr className="border-t-2 border-black w-full mb-4" />
  
          {/* Dados da Palestra */}
          <div className="flex items-center">
            <label className="mr-2">Palestra:</label>
            <span>{idPalestra}</span>
            <label className="ml-4 mr-2">Data:</label>
            <span>{dataPalestra}</span>
            <label className="ml-4 mr-2">Hora:</label>
            <span>{hora}</span>
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

          <hr className="border-t-2 border-black w-full" />

          {/* Labels e Inputs do Participante*/}
          <div className="flex items-center">
            <label className="mr-2 text-sm">Matrícula:</label>
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              onBlur={fetchParticipantes}
              disabled={isInputDisabled}
              className="border border-gray-800 p-0 pl-2 h-6 w-20 rounded flex-1"
            />
          </div>
          
          <div className="flex items-center">
            <label className="mr-2 text-sm">Empresa:</label>
            <select value={empresa} onChange={(e) => setEmpresa(e.target.value)} disabled={isInputDisabled} className="border border-gray-800 pl-1 p-0 h-6 rounded">
              <option value="          ">          </option>
              <option value="1">Alpek Polyester</option>
              <option value="2">Ambipar</option>
              <option value="3">Coating</option>
              <option value="4">DM</option>
              <option value="5">Gafor</option>
              <option value="6">In Haus</option>
              <option value="7">Manserv</option>
              <option value="8">MPM</option>
              <option value="9">Sapore</option>
              <option value="10">Sesc</option>
              <option value="11">Sigma</option>
              <option value="12">Stahl</option>
              <option value="13">Value</option>
              <option value="14">Outro</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="mr-2 text-sm">Setor:</label>
            <select value={setor} onChange={(e) => setSetor(e.target.value)} disabled={isInputDisabled} className="border border-gray-800 pl-1 p-0 h-6 rounded">
              <option value="">          </option>
              <option value="1">Comercial</option>
              <option value="2">Laboratório</option>
              <option value="3">Logística</option>
              <option value="4">Produção PET</option>
              <option value="5">Produção PTA</option>
              <option value="6">Rh</option>
              <option value="7">SMS</option>
              <option value="8">TI</option>
              <option value="9">Tributário</option>
              <option value="10">Outro</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="mr-2 text-sm">Nome:</label>
            <input
              type="text" required maxlength="60" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isInputDisabled} 
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
              placeholder="Digite 11 números (DDDNÚMERO)"
              disabled={isInputDisabled} 
              className="border border-gray-800 p-0 pl-2 rounded w-80"
            />
          </div>
          
          <div className="flex items-center">
            <label className="mr-2 text-sm">E-mail:</label>
            <input
              type="email"
              maxlength="100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isInputDisabled} 
              className="border border-gray-800 p-0 h-6 flex-1 rounded"
            />
          </div>
          
          <div className="flex items-center">
            <label className="mr-2 text-sm">Deseja Receber Mensagem Por:</label>
            <select
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)} 
              disabled={isInputDisabled} 
              className="border border-gray-800 p-0 h-6 w-32 rounded">
              <option value="          ">          </option>
              <option value="1">Fone</option>
              <option value="2">E-mail</option>
              <option value="3">Ambos</option>
            </select>
          </div>

          <div className="mt-4 text-red-500">{statusInscricao}</div>

          {/* Botão Único: Confirmar ou Remover Inscrição */}
          {MostraBotao && (
            <button
              onClick={confirmarOuRemoverInscricao}
              className={`p-2 rounded ${MostraBotao.includes("NÃO") ? 'bg-green-500' : 'bg-red-500'} text-white`}
            >
              {MostraBotao.includes("NÃO") ? 'Confirmar Inscrição' : 'Excluir Inscrição'}
            </button>
          )}
          
        </div>
      </div>
    </div>
  );
  
}
