import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Principal() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleSair = () => {
    // Adicione qualquer lógica necessária para a saída, se houver
    router.push('/login');
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
        <div className="flex flex-col justify-center border border-black rounded-lg p-2 space-y-4">
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
