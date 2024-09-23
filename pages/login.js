import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mostrarCadastrar, setMostrarCadastrar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verificarAdmins = async () => {
      const response = await fetch('/api/auth/check-admins');
      const data = await response.json();
      if (data.count === 0) {
        setMostrarCadastrar(true);
      } else {
        setMostrarCadastrar(false);
      }
    };
    verificarAdmins();
  }, []);

  const handleLogin = async () => {
    if (usuario === '' || senha === '') {
      setMensagem('Informe os campos Usuário e Senha');
      return;
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push('/principal'); // substitua '/principal' pela página principal do seu aplicativo
    } else {
      setMensagem(data.error);
    }
  };

  const handleEsqueciSenha = async () => {
    if (usuario === '') {
      setMensagem('Informe o Usuário para recuperar a Senha');
      return;
    }

    const response = await fetch('/api/auth/check-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario }),
    });

    const data = await response.json();
    //if (response.ok && data.exists) {
    if (response.status === 400 && data.error === 'Já existe um administrador com este Usuário!') {
      router.push(`/esqueci-senha?usuario=${usuario}`);
    } else {
      setMensagem('Usuário Não Cadastrado');
    }
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
          <h2 className="text-xl font-bold mb-4">Login</h2>
          {mensagem && <p className="mb-4 text-red-500">{mensagem}</p>}
          <div className="mb-4 w-full max-w-sm mx-auto">
            <label className="block text-gray-700">Usuário:</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="border border-gray-300 p-0 rounded w-full"
              disabled={mostrarCadastrar}
            />
          </div>
          <div className="mb-4 w-full max-w-sm mx-auto">
            <label className="block text-gray-700">Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="border border-gray-300 p-0 rounded w-full"
              disabled={mostrarCadastrar}
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleLogin}
              className="bg-blue-500 text-white py-2 px-4 rounded"
              disabled={mostrarCadastrar}
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleEsqueciSenha}
              className="bg-gray-500 text-white py-2 px-4 rounded"
              disabled={mostrarCadastrar}
            >
              Esqueci a Senha
            </button>
          </div>
          {mostrarCadastrar && (
            <div className="flex space-x-4 mt-4">
              <button
                type="button"
                onClick={() => router.push('/cadastro-administradores')}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Cadastrar
              </button>
            </div>
          )}
        </div>
        {/* Área de Dados (Direita) */}
        <div className="relative flex justify-center items-center border border-black rounded-lg p-2">
          <div className="relative w-full h-full">
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
