import React, { useEffect, useState } from 'react';

// Define a interface para os dados da API
interface ParadaData {
  cdmaquina: string;
  dsparada: string;
  cdarearesp: string; // em segundos
  dsarearesp: string;
  dthriniparada: string;
  tmpultparada: number;
  stmaquina: number;
}

// Função para remover duplicatas com base em uma chave única
const removeDuplicates = (data: ParadaData[]): ParadaData[] => {
  const uniqueItems = new Map(); // Usamos um Map para garantir unicidade
  data.forEach((item) => {
    const uniqueKey = `${item.cdmaquina}-${item.dsparada}-${item.dsarearesp}`; // Define uma chave única
    if (!uniqueItems.has(uniqueKey)) {
      uniqueItems.set(uniqueKey, item);
    }
  });
  return Array.from(uniqueItems.values());
};

const HubParadas: React.FC = () => {
  const [data, setData] = useState<ParadaData[]>([]); // Dados completos da API
  const [areas, setAreas] = useState<string[]>([]); // Áreas responsáveis extraídas
  const [selectedArea, setSelectedArea] = useState<string>(''); // Área selecionada pelo usuário
  const [filteredParadas, setFilteredParadas] = useState<ParadaData[]>([]); // Dados filtrados
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os dados da API
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.16.240:8006/api/hubparadas');
      if (!response.ok) throw new Error('Erro ao carregar dados');
      let result: ParadaData[] = await response.json();
  
      // Verificar os dados recebidos
      console.log("Dados recebidos da API:", result);
  
      // Remove duplicatas
      result = removeDuplicates(result);
  
      // Filtra apenas máquinas com stmaquina === 0
      const filteredResult = result.filter((item) => item.stmaquina === 0);
  
      // Verificar os dados filtrados
      // console.log("Dados após o filtro stmaquina === 0:", filteredResult);
  
      // Atualiza os estados
      setData(filteredResult);
  
      // Extrair áreas responsáveis únicas
      const uniqueAreas = Array.from(new Set(filteredResult.map((item) => item.dsarearesp || 'Sem área definida')));
      setAreas(uniqueAreas);
  
      setLoading(false);
    } catch (err) {
      setError('Não foi possível carregar os dados.');
      setLoading(false);
    }
  };
  
  // Atualiza as paradas filtradas sempre que a área selecionada mudar
  useEffect(() => {
    if (selectedArea) {
      setFilteredParadas(data.filter((item) => item.dsarearesp === selectedArea));
    } else {
      setFilteredParadas(data); // Mostra todos os dados se nenhuma área estiver selecionada
    }
  }, [selectedArea, data]);

  // Busca inicial dos dados
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p>Carregando os dados...</p>;
  if (error) return <p>{`Erro: ${error}`}</p>;

  const formatTempo = (tempo: number | null | undefined): string => {
    if (tempo == null || isNaN(tempo)) {
      return "N/A"; // Exibe "N/A" se o valor for inválido
    }
  
    const horas = Math.floor(tempo / 3600); // Total de horas
    const minutos = Math.floor((tempo % 3600) / 60); // Minutos restantes
    const segundos = tempo % 60; // Segundos restantes
  
    return `${horas}h ${minutos}m ${segundos}s`;
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString); // Converte a string em um objeto Date
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC', // Ajusta o fuso horário se necessário
    }).format(date);
  };


  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-4">HUB de Paradas</h1> */}

      {/* Dropdown de Áreas Responsáveis */}
      <div className="mb-4">
        <label htmlFor="areaSelect" className="block text-sm font-medium text-gray-700">
          Filtrar por Área Responsável:
        </label>
        <select
          id="areaSelect"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="mt-1 block w-46 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Todas as Áreas</option>
          {areas.map((area, index) => (
            <option key={index} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela de Paradas */}
      <div className="overflow-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">Máquina</th>
              <th className="border border-gray-400 p-2">Descrição da Parada</th>
              <th className="border border-gray-400 p-2">Área Responsável</th>
              <th className="border border-gray-400 p-2">Inicio parada</th>
              <th className="border border-gray-400 p-2">Tempo da última parada</th>

            </tr>
          </thead>
          <tbody>
          {filteredParadas
            .sort((a, b) => b.tmpultparada - a.tmpultparada) // Ordena do maior para o menor
            .map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="border border-gray-400 p-2 font-semibold text-center">{item.cdmaquina}</td>
                <td className="border border-gray-400 p-2 font-semibold text-center">{item.dsparada}</td>
                <td className="border border-gray-400 p-2 font-semibold text-center">{item.dsarearesp || 'Sem área definida'}</td>
                <td className="border border-gray-400 p-2 font-semibold text-center">{formatDate(item.dthriniparada)}</td>
                <td className="border border-gray-400 p-2 bg-red-600 font-semibold text-center text-white">{formatTempo(item.tmpultparada)}</td>
              </tr>
            ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default HubParadas;
