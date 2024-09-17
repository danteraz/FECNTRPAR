import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function ParticipanteQRCode() {
  const router = useRouter();
  const { idPalestra } = router.query; // Recebendo o idPalestra da URL

  const [dataPalestra, setDataPalestra] = useState('');
  const [hora, setHora] = useState('');
  const [titulo, setTitulo] = useState('');
  const [assunto, setAssunto] = useState('');
  const [localPalestra, setLocalPalestra] = useState('');
  const [fone, setFone] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState(' ');
  const [idParticipante, setIdParticipante] = useState(null); // Guardar o idParticipante quando encontrado
  const [statusInscricao, setStatusInscricao] = useState(''); // Para exibir a mensagem de inscrição

  const foneRef = useRef(null);

  useEffect(() => {
    if (idPalestra) {
      fetchPalestra(idPalestra);
    }
  }, [idPalestra]);

  useEffect(() => {
    if (foneRef.current) {
      foneRef.current.focus(); // Foca no input de fone após carregar os dados da palestra
    }
  }, [titulo]);

  const fetchPalestra = async (id) => {
    try {
      const response = await fetch(`/api/palestras/${id}`);
      const DadosPalestra = await response.json();

      if (DadosPalestra.idPalestra) {
        setDataPalestra(new Date(DadosPalestra.dataPalestra).toLocaleDateString('pt-BR'));
        setHora(DadosPalestra.hora.slice(0, 5));
        setTitulo(DadosPalestra.titulo);
        setAssunto(DadosPalestra.assunto);
        setLocalPalestra(DadosPalestra.localPalestra);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da palestra:", error);
    }
  };

  const handleFoneBlur = async () => {
    const foneLimpo = fone.replace(/\D/g, ''); // Remove formatação do fone

    // Verificar se o telefone já está cadastrado
    try {
      const response = await fetch(`/api/auth/check-fone-participante?fone=${foneLimpo}`);
      const participante = await response.json();

      if (participante && participante.idParticipante) {
        setIdParticipante(participante.idParticipante);
        setNome(participante.nome);
        setEmail(participante.email);
        setMensagem(participante.mensagem);

        // Verificar se o participante está inscrito na palestra
        verificarInscricao(participante.idParticipante);
      } else {
        setStatusInscricao("Novo Participante. Confirme sua inscrição.");
      }
    } catch (error) {
      console.error("Erro ao verificar participante:", error);
    }
  };

  const verificarInscricao = async (idParticipante) => {
    try {
      const response = await fetch(`/api/presencas/${idParticipante}?idPalestra=${idPalestra}`);
      if (response.ok) {
        setStatusInscricao("Você JÁ Está Inscrito nesta Palestra!");
      } else {
        setStatusInscricao("Você NÃO Está Inscrito nesta Palestra!");
      }
    } catch (error) {
      console.error("Erro ao verificar inscrição:", error);
    }
  };

  const confirmarInscricao = async () => {
    try {
      if (idParticipante) {
        // Atualizar participante existente
        const response = await fetch(`/api/participantes/${idParticipante}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nome, fone, email, mensagem }),
        });
      } else {
        // Criar novo participante e inscrever na palestra
        const response = await fetch(`/api/participantes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nome, fone, email, mensagem }),
        });
        const novoParticipante = await response.json();
        setIdParticipante(novoParticipante.id);
      }

      // Inscrever na palestra
      await fetch(`/api/presencas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idParticipante, idPalestra }),
      });

      setStatusInscricao("Inscrição confirmada!");
    } catch (error) {
      console.error("Erro ao confirmar inscrição:", error);
    }
  };

  const removerInscricao = async () => {
    try {
      await fetch(`/api/presencas/${idParticipante}?idPalestra=${idPalestra}`, {
        method: 'DELETE',
      });

      setStatusInscricao("Inscrição removida!");
    } catch (error) {
      console.error("Erro ao remover inscrição:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="grid w-full max-w-full max-h-full bg-white rounded shadow-md p-4">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center justify-center">
          <Image src="/CIPA.PNG" alt="CIPA" width={100} height={100} />
          <h1 className="text-2xl font-bold text-center">CONTROLE DE PALESTRAS</h1>
        </div>

        {/* Área de Cadastro de Participação */}
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

          {/* Participante */}
          <div className="flex items-center">
            <label className="mr-2">Celular:</label>
            <input
              ref={foneRef}
              type="tel"
              maxLength="11"
              value={fone}
              onChange={(e) => setFone(e.target.value)}
              onBlur={handleFoneBlur}
              className="border border-gray-800 p-0 pl-2 rounded w-80"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2">Nome:</label>
            <input
              type="text"
              maxLength="60"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="border border-gray-800 p-0 pl-2 rounded w-80"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2">E-mail:</label>
            <input
              type="email"
              maxLength="100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-800 p-0 pl-2 rounded w-80"
            />
          </div>

          <div className="mt-4 text-red-500">{statusInscricao}</div>

          {statusInscricao.includes("NÃO") && (
            <button onClick={confirmarInscricao} className="bg-green-500 text-white p-2 rounded">
              Confirmar Inscrição?
            </button>
          )}

          {statusInscricao.includes("JÁ") && (
            <button onClick={removerInscricao} className="bg-red-500 text-white p-2 rounded">
              Excluir Inscrição?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
