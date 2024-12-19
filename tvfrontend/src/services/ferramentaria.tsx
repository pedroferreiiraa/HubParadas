import React, { useEffect, useState } from 'react';

// interface Responsavel {
//   INJECAO: string,
//   SUPRIMENTOS: string,
//   USINAGEM: string,
//   SALADEMOLDES: string,
//   MANUTENCAO: string,
//   MONTAGEM: string,
//   AREADESCONHECIDA: string
// }

interface ParadaData {
  id: number;
  cdmaquina: string;
  dsparada: string;
  cdarearesp: string;
  dsarearesp: string;
  dsgalpao: string;
  dthriniparada: string;
  tmpultparada: number;
  stmaquina: number;
  nrop: string;
  dsproduto: string;
}


// Função para remover duplicatas
const removeDuplicates = (data: ParadaData[]): ParadaData[] => {
  const uniqueItems = new Map();
  data.forEach((item) => {
    const uniqueKey = `${item.cdmaquina}-${item.dsparada}-${item.dsarearesp}`;
    if (!uniqueItems.has(uniqueKey)) {
      uniqueItems.set(uniqueKey, item);
    }
  });
  return Array.from(uniqueItems.values());
};

const Ferramentaria: React.FC = () => {
  const [data, setData] = useState<ParadaData[]>([]);
  const [, setAreas] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [galpoes, setGalpoes] = useState<string[]>([]);
  const [selectedGalpoes, setSelectedGalpoes] = useState<string[]>([]);
  const [filteredParadas, setFilteredParadas] = useState<ParadaData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [previousParadasCount, setPreviousParadasCount] = useState<number>(0);
  const [noParadasMessage, setNoParadasMessage] = useState<string | null>(null);
  // const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [todosResponsaveis] = useState<string[]>([
    "MANUTENCAO",
    "FERRAMENTARIA",
  ]);


  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8006/api/ferramentaria');
      if (!response.ok) throw new Error('Erro ao carregar dados');
      let result: ParadaData[] = await response.json();
  
      result = removeDuplicates(result);
      const filteredResult = result
        .filter(
          (item) =>
            (item.stmaquina === 0 || item.stmaquina === 2) &&
            (item.nrop?.trim() ?? '').length > 0 &&
            item.dsarearesp && 
            item.dsarearesp !== 'Sem área definida' &&
            item.dsgalpao
        )
        .sort((a, b) => b.tmpultparada - a.tmpultparada);
  
        

      // Recupera as assinaturas anteriores para área, galpão e global
      // const previousGlobalSignatures: ParadaSignature[] = JSON.parse(
      //   localStorage.getItem('paradaSignatures') || '[]'
      // );
      // const previousAreaSignatures: Record<string, ParadaSignature[]> = JSON.parse(
      //   localStorage.getItem('areaParadaSignatures') || '{}'
      // );
      // const previousGalpaoSignatures: Record<string, ParadaSignature[]> = JSON.parse(
      //   localStorage.getItem('galpaoParadaSignatures') || '{}'
      // );
  

      
      // Cria assinaturas para paradas atuais
      // const currentParadaSignatures: ParadaSignature[] = filteredResult.map(parada => ({
      //   cdmaquina: parada.cdmaquina,
      //   dsparada: parada.dsparada,
      //   dthriniparada: parada.dthriniparada,
      //   dsgalpao: parada.dsgalpao
      // }));

      // const newParadasGlobal = selectedAreas.length === 0 && selectedGalpoes.length === 0 
      // ? currentParadaSignatures.filter(
      //     current => !selectedAreas.some(area => current.dsarearesp === area) &&
      //               !selectedGalpoes.some(galpao => current.dsgalpao === galpao)
      //   )
      // : [];

      // Detecta novas paradas globais
      // const newParadasGlobal = currentParadaSignatures.filter(
      //   current => !previousGlobalSignatures.some(
      //     prev => 
      //       prev.cdmaquina === current.cdmaquina &&
      //       prev.dsparada === current.dsparada &&
      //       prev.dthriniparada === current.dthriniparada
      //   )
      // );
  
      // Flag para controle de som
      // let shouldPlaySound = false;
  
      // // Se houver novas paradas globais e não houver área responsável selecionada, toca som
      // if (newParadasGlobal.length > 0 && selectedAreas.length === 0) {
      //   shouldPlaySound = true;
      //   // Atualiza o localStorage com as novas assinaturas globais
      //   localStorage.setItem('paradaSignatures', JSON.stringify(currentParadaSignatures));
      // }
  
      // Lógica para áreas selecionadas
      // if (selectedAreas.length > 0) {
      //   selectedAreas.forEach(area => {
      //     // Filtra paradas da área específica
      //     const areaParadas = filteredResult.filter(p => p.dsarearesp === area);
  
      //     // Cria assinaturas para paradas da área
      //     const currentAreaSignatures: ParadaSignature[] = areaParadas.map(parada => ({
      //       cdmaquina: parada.cdmaquina,
      //       dsparada: parada.dsparada,
      //       dthriniparada: parada.dthriniparada,
      //       dsarearesp: parada.dsarearesp
      //     }));
  
      //     // Recupera assinaturas anteriores para esta área
      //     const previousAreaSigs = previousAreaSignatures[area] || [];
  
      //     // Detecta novas paradas na área
      //     const newAreaParadas = currentAreaSignatures.filter(
      //       current => !previousAreaSigs.some(
      //         prev => 
      //           prev.cdmaquina === current.cdmaquina &&
      //           prev.dsparada === current.dsparada &&
      //           prev.dthriniparada === current.dthriniparada
      //       )
      //     );
  
      //     // Se houver novas paradas na área
      //     if (newAreaParadas.length > 0) {
      //       shouldPlaySound = true;
  
      //       // Atualiza localStorage para esta área específica
      //       previousAreaSignatures[area] = [
      //         ...previousAreaSignatures[area].filter(prev => 
      //           !currentAreaSignatures.some(current => 
      //             current.cdmaquina === prev.cdmaquina &&
      //             current.dsparada === prev.dsparada &&
      //             current.dthriniparada === prev.dthriniparada
      //           )
      //         ),
      //         ...newAreaParadas
      //       ];
            
      //     }
      //   });
      // }
  
      // Lógica para galpões selecionados
      // selectedGalpoes.forEach(galpao => {
      //   // Filtra paradas do galpão específico
      //   const galpaoParadas = filteredResult.filter(p => p.dsgalpao === galpao);
  
      //   // Cria assinaturas para paradas do galpão
      //   const currentGalpaoSignatures: ParadaSignature[] = galpaoParadas.map(parada => ({
      //     cdmaquina: parada.cdmaquina,
      //     dsparada: parada.dsparada,
      //     dthriniparada: parada.dthriniparada,
      //     dsgalpao: parada.dsgalpao
      //   }));
  
      //   // Recupera assinaturas anteriores para este galpão
      //   const previousGalpaoPrevSigs = previousGalpaoSignatures[galpao] || [];
  
        // Detecta novas paradas no galpão
        // const newGalpaoParadas = currentGalpaoSignatures.filter(
        //   current => !previousGalpaoPrevSigs.some(
        //     prev => 
        //       prev.cdmaquina === current.cdmaquina &&
        //       prev.dsparada === current.dsparada &&
        //       prev.dthriniparada === current.dthriniparada
        //   )
        // );
  
      //   // Se houver novas paradas no galpão
      //   if (newParadasGlobal.length > 0 || Object.keys(previousAreaSignatures).some(
      //     area => previousAreaSignatures[area].length > 0
      //   ) || Object.keys(previousGalpaoSignatures).some(
      //     galpao => previousGalpaoSignatures[galpao].length > 0
      //   )
      // ) {
      //   shouldPlaySound = true;
      // }
      // });
  
      // Toca o som se necessário
      // if (shouldPlaySound) {
      //   playSound();
  
      //   // Salva as assinaturas atualizadas
      //   localStorage.setItem('areaParadaSignatures', JSON.stringify(previousAreaSignatures));
      //   localStorage.setItem('galpaoParadaSignatures', JSON.stringify(previousGalpaoSignatures));
      // }
  
      // Outros estados permanecem iguais
      setData(filteredResult);
      setAreas(Array.from(new Set(filteredResult.map((item) => item.dsarearesp))));
      setGalpoes(Array.from(new Set(filteredResult.map((item) => item.dsgalpao))));
  
      setLoading(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Não foi possível carregar os dados.');
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const filtered = data.reduce<ParadaData[]>((acc, item) => {
      const matchArea = selectedAreas.length === 0 || selectedAreas.includes(item.dsarearesp);
      const matchGalpao = selectedGalpoes.length === 0 || selectedGalpoes.includes(item.dsgalpao);
      
      if (matchArea && matchGalpao) {
        acc.push(item);
      }
      return acc;
    }, []);
  
    const getMessage = () => {
      if (selectedAreas.length > 0 && selectedGalpoes.length > 0) {
        return "Nenhuma parada encontrada para a área e galpão selecionados.";
      }
      if (selectedAreas.length > 0) {
        return "Nenhuma parada encontrada para a área selecionada.";
      }
      if (selectedGalpoes.length > 0) {
        return "Nenhuma parada encontrada para o galpão selecionado.";
      }
      return null;
    };
  
    setNoParadasMessage(filtered.length === 0 ? getMessage() : null);
    setFilteredParadas(filtered);
  
    localStorage.setItem('selectedAreas', JSON.stringify(selectedAreas));
    localStorage.setItem('selectedGalpoes', JSON.stringify(selectedGalpoes));
  }, [selectedAreas, selectedGalpoes, data]);

  // const playSound = () => {
  //   const audio = new Audio('/sounds/alert.mp3');
  //   audio.load(); // Garante que o áudio seja carregado
  //   audio.play().catch((error) => {
  //     console.error('Erro ao reproduzir som:', error);
  //   });
  // };
  

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => fetchData(), 60000); // Intervalo de 1 minuto
    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   const savedAreas = localStorage.getItem('selectedAreas');
  //   const savedGalpoes = localStorage.getItem('selectedGalpoes');
  //   if (savedAreas) setSelectedAreas(JSON.parse(savedAreas));
  //   if (savedGalpoes) setSelectedGalpoes(JSON.parse(savedGalpoes));
  // }, []);

  // Atualiza os dados filtrados quando as áreas ou galpões mudam


  // Funções para alternar seleção
  const toggleAreaSelection = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleGalpaoSelection = (galpao: string) => {
    setSelectedGalpoes((prev) =>
      prev.includes(galpao) ? prev.filter((g) => g !== galpao) : [...prev, galpao]
    );
  };

  const formatTempo = (tempo: number | null | undefined): string => {
    if (!tempo) return 'N/A';
    const horas = Math.floor(tempo / 3600);
    const minutos = Math.floor((tempo % 3600) / 60);
    return `${horas}h ${minutos}m`;
  };

  const calcularTempoTotal = (paradas: { tmpultparada: number }[]) => {
    // Somar todos os tempos das paradas
    const total = paradas.reduce((acumulado, parada) => acumulado + parada.tmpultparada, 0);
    return total;
  };

  const tempoTotal = calcularTempoTotal(filteredParadas);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(date);
  };

  if (loading) return <p>Carregando os dados...</p>;
  if (error) return <p>{`Erro: ${error}`}</p>;

  const descricaoMaquinas: { [key: string]: string } = {
    "001": "Pratica 80",
    "002": "Pratica 80",
    "003": "Pratica 80",
    "004": "Pratica 80",
    "005": "Pratica 80",
    "006": "Primax 65",
    "007": "Primax 65",
    "008": "Primax 65",
    "009": "Primax 100",
    "010": "Pratica 130",
    "011": "Pratica 130",
    "012": "Primax 150",
    "013": "Pratica 170",
    "014": "Primax 150",
    "015": "LS1 160",
    "016": "Haitian 80",
    "017": "Himaco 120",
    "018": "Tayu TKM 150",
    "019": "28 LS 280",
    "020": "LS2 160",
    "021": "Tayu 140",
    "022": "Primax 450",
    "023": "Primax 450",
    "024": "Primax 300",
    "025": "Fu Chun Shin 450",
    "026": "Primax 600",
    "027": "Fu Chun Shin 250",
    "101": "Tupis Primax 450",
    "102": "Tupis Minzen 280D",
    "103": "Tupis Minzen 220D",
    "104": "Tupis Minzen 160D",
    "105": "Tupis Minzen 220D",
    "106": "Tupis Primax 300",
    "107": "Tupis Minzen 100D",
    "108": "Tupis Minzen 130D",
    "109": "Tupis GEK 530",
    "201": "Torno 1 Logic 195 II",
    "202": "Torno 2 Logic 195 II",
    "203": "Torno 3 Logic 195 II",
    "204": "Torno 4 Logic 195 II",
    "205": "Torno 5 Logic 195 II",
    "206": "Torno 6 Centur 30 D",
    "207": "Torno 7 Centur 30 D",
    "208": "Torno 8 Centur 30 D",
    "209": "Torno 9 Centur 30 D",
    "061": "Linha 1",
    "062": "Linha 2",
    "063": "Linha 3",
    "064": "Linha 4",
    "065": "Linha 5",
    "066": "Linha 6",
  };

 

  return (
<div className="p-1">
<p className='font-semibold'>Tempo total de paradas: </p>
<span className='text-red-600 font-semibold'>{formatTempo(tempoTotal)}</span>
  
  <div className="flex flex-col lg:flex-row lg:space-x-8">
    {/* Botões de áreas */}
    
    <div className="mb-4 lg:mb-0">
  <p className="font-medium mt-2">Filtrar por Responsabilidade:</p>
  <div className="flex flex-wrap gap-2 max-w-2xl">
    {todosResponsaveis.map((responsavel) => (
      <button
        key={responsavel}
        onClick={() => toggleAreaSelection(responsavel)}
        className={`px-3 py-1 rounded text-sm font-medium ${
          selectedAreas.includes(responsavel)
            ? 'bg-green-500 text-white'
            : 'bg-gray-300 text-gray-800'
        }`}
      >
        {responsavel}
      </button>
    ))}
  </div>
</div>

    {/* Botões de galpões */}
    <div className="mb-4 lg:mb-0">
      <p className="font-medium mt-2">Filtrar por Galpão:</p>
      <div className="flex flex-wrap">
        {galpoes.map((galpao) => (
          <button
            key={galpao}
            onClick={() => toggleGalpaoSelection(galpao)}
            className={`px-3 py-1 rounded text-sm font-medium mr-2 mt-1 ${
              selectedGalpoes.includes(galpao)
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-800'
            }`}
          >
            {galpao}
          </button>
        ))}
      </div>
      
    </div>
    
  </div>

  <div className="overflow-auto">
    {noParadasMessage && (
      <p className="text-red-600 font-lg mb-4 mt-4 bg-red-100 p-6 font-semibold">{noParadasMessage}</p>
    )}

    {/* Exibir como tabela para telas grandes */}
    {/* hidden lg:block caso queira voltar os cards para aparecerem no celular */}
    <div className="mt-2">
      <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border border-gray-300 p-2">Máquina</th>
            <th className="border border-gray-300 p-2">Descrição da máquina</th>
            <th className="border border-gray-300 p-2">Descrição do Produto</th>
            <th className="border border-gray-300 p-2">Parada</th>
            <th className="border border-gray-300 p-2">Área Responsável</th>
            <th className="border border-gray-300 p-2">Início da parada</th>
            <th className="border border-gray-300 p-2">Tempo de Parada</th>
          </tr>
        </thead>
        <tbody>
          {filteredParadas.map((parada) => (
            <tr key={parada.cdmaquina} className="hover:bg-gray-100 text-center">
              <td className="border border-gray-300 p-2">{parseInt(parada.cdmaquina, 10)}</td>
              <td className="border border-gray-300 p-2">{descricaoMaquinas[parada.cdmaquina] || 'Descrição não encontrada'}</td>
              <td className="border border-gray-300 p-2">{parada.dsproduto}</td>
              <td className="border border-gray-300 p-2">{parada.dsparada}</td>
              <td className="border border-gray-300 p-2">{parada.dsarearesp}</td>
              <td className="border border-gray-300 p-2">{formatDate(parada.dthriniparada)}</td>
              <td className="border border-gray-300 p-2 font-semibold text-red-600">{formatTempo(parada.tmpultparada)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Exibir como cartões para dispositivos móveis */}
    {/* <div className="lg:hidden">
      <div className="flex flex-col space-y-4">
        {filteredParadas.map((parada) => (
          <div key={parada.cdmaquina} className="border border-gray-300 p-4 shadow-md hover:bg-gray-100 font-sans">
            <div className="font-bold">{parada.cdmaquina}</div>
            <div>Descrição da máquina: {descricaoMaquinas[parada.cdmaquina] || 'Descrição não encontrada'}</div>
            <div>Descrição do Produto: {parada.dsproduto}</div>
            <div>Parada: <span className='font-semibold'>{parada.dsparada}</span></div>
            <div>Área Responsável: {parada.dsarearesp}</div>
            <div>Última Parada: {formatDate(parada.dthriniparada)}</div>
            <div className="font-semibold text-red-600">Tempo de Parada: {formatTempo(parada.tmpultparada)}</div>
          </div>
        ))}
      </div>
    </div> */}
  </div>
</div>

  );
};

export default Ferramentaria;
