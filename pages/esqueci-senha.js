import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function EsqueciSenha() {
  const router = useRouter();
  const { usuario } = router.query;
  const [novaSenha, setNovaSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleConfirmar = async () => {
    if (novaSenha === '' || repetirSenha === '') {
      setMensagem('Informe as duas senhas');
      return;
    }
    if (novaSenha !== repetirSenha) {
      setMensagem('As senhas não estão iguais');
      return;
    }

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, senha: novaSenha }),
    });
    const data = await response.json();
    if (response.ok) {
      setMensagem('Senha Alterada Com Sucesso');
      setTimeout(() => {
        router.push('/login');
      }, 2000); // Redireciona para a tela de login após 2 segundos
    } else {
      setMensagem(data.error || 'Senha Não Alterada! Procure o Responsável pelo App');
      setTimeout(() => {
        router.push('/login');
      }, 2000); // Redireciona para a tela de login após 2 segundos
    }
  };

  const handleVoltar = () => {
    router.push('/login');
  };

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="grid w-full h-full max-w-full max-h-full bg-white rounded shadow-md p-4"
        style={{ gridTemplateRows: '0fr 3.5fr', gridTemplateColumns: '0.5fr 2.0fr' }}
      >
        {/* Área da Imagem */}
        <div className="flex flex-col items-center justify-center">
          <Image src="/CIPA.PNG" alt="CIPA" width={100} height={100} />
        </div>
        {/* Área do Cabeçalho */}
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">CONTROLE DE PALESTRAS</h1>
        </div>
        {/* Área de Dados (Esquerda) */}
        <div className="flex flex-col items-center justify-center border border-black rounded-lg p-2">
          <h2 className="text-xl font-bold mb-4">ESQUECI A SENHA</h2>
          <p className="font-bold mb-4 text-gray-700">Usuário: <strong>{usuario}</strong></p>
          {mensagem && <p className="mb-4 text-red-500">{mensagem}</p>}
          <div className="mb-4 relative w-full max-w-sm mx-auto">
            <label className="block text-gray-700">Nova Senha:</label>
            <input
              type={mostrarSenha ? "text" : "password"}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="border border-gray-300 p-0 rounded w-full"
            />
            <span
              onClick={toggleMostrarSenha}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              style={{ top: '25%' }}
            >
            </span>
          </div>
          <div className="mb-4 relative w-full max-w-sm mx-auto">
            <label className="block text-gray-700">Repetir a Senha:</label>
            <input
              type={mostrarSenha ? "text" : "password"}
              value={repetirSenha}
              onChange={(e) => setRepetirSenha(e.target.value)}
              className="border border-gray-300 p-0 rounded w-full"
            />
            <span
              onClick={toggleMostrarSenha}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              style={{ top: '25%' }}
            >
            </span>
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleConfirmar}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Confirmar
            </button>
            <button
              type="button"
              onClick={handleVoltar}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Voltar
            </button>
          </div>
        </div>
        {/* Área de Dados (Direita) */}
        <div className="relative flex justify-center items-center border border-black rounded-lg p-2">
          <div className="relative w-full h-full">
            // <Image src="/Palestra.jpeg" alt="Palestra" layout="fill" objectFit="cover" />
			<Image
			  src="/Palestra.jpeg"
			  alt="Palestra"
			  fill
			  style={{ objectFit: 'cover' }}
			/>			
          </div>
        </div>
      </div>
    </div>
  );
}
