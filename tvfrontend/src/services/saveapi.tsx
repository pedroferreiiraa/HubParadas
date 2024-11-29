import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface MontagemData {
  prodbruta_completo: number;
  linha: string;
  cdmaquina: number;
  nrop: number;
  DsParada: string;
  ciclopadrao: number;
  ciclomedio: number;
  prodbruta: string;
  prodplan: number;
  percentualconcluido: number;
  cdproduto: string;
  DsProduto: string;
  status: string;
  ciclo: number;
}

const TvMontagem: React.FC = () => {
  const [data, setData] = useState<MontagemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [eficiencia, setEficiencia] = useState<number | ''>(95);
  const [eficiencia2, setEficiencia2] = useState<number | ''>(110);

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.16.240:8005/api/tvmontagem');
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const result: MontagemData[] = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 65000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{`Erro ao carregar os dados: ${error}`}</p>;
  }

  return (
    <div className="grid p-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 2xl:grid-cols-3 2xl:text-2xl gap-2 mb-2 overflow-hidden">
      {data.length > 0 ? (
        
        data.map((machineData, index) => {
          const cicloValue = typeof machineData.ciclo === 'number' 
            ? machineData.ciclo 
            : Number(machineData.ciclo); // Converter para número
      
          const eficienciaValue = typeof eficiencia === 'number' 
            ? eficiencia 
            : Number(eficiencia); // Converter para número

          const eficienciaValue2 = typeof eficiencia2 === 'number' 
            ? eficiencia2 
            : Number(eficiencia2); // Converter para número

          const isMachineStopped = machineData.status !== "Máquina Trabalhando";
          const isCycleBelowEfficiency = !isNaN(cicloValue) && cicloValue < eficienciaValue;
          const isCycleAboveEfficiency = !isNaN(cicloValue) && cicloValue > eficienciaValue2;

          // Verificar se a máquina está parada e se a descrição da parada é "PARADA NÃO INFORMADA"
          const isUninformedStop = isMachineStopped && machineData.DsParada === "PARADA NÃO INFORMADA";

          return (
            <div
              key={index}
              className={`bg-white rounded-lg sm:grid-cols-1 shadow-lg p-0 flex flex-col h-[450px] ${isUninformedStop ? '!bg-red-500' : ''}`}
            >
              <h2 className="text-lg text-center font-bold text-black-600 mb-0 mx-2">{machineData.linha}</h2>
              <p className="text-black-800  text-center font-bold ">{machineData.DsProduto}</p>
              
            

              {isMachineStopped ? (
                <div className="flex flex-col items-center justify-center flex-grow">
                  <p className="text-3xl font-bold text-center text-black">
                    {machineData.DsParada}
                  </p>
                </div>
              ) : (
                <>
                  {/* Exibir percentual apenas se a máquina estiver trabalhando */}
                  <div className="my-1">
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span
                            className={`text-xs 2xl:text-lg font-semibold inline-block px-2 rounded-full mb-1 ${machineData.percentualconcluido}`} 
                          > 
                            Evolução da O.P - {machineData.percentualconcluido.toFixed(2)}%
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs 2xl:text-2xl font-semibold inline-block text-black-600">
                            100%
                          </span>
                        </div>
                      </div>
                      <div className="flex h-4 mb-2 bg-gray-200 rounded">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${machineData.percentualconcluido}%`,
                            backgroundColor: machineData.percentualconcluido <= 100 ? 'blue' : 'yellow'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Exibir gráfico apenas se a máquina estiver trabalhando */}
                  <div className="flex-grow w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[machineData]}
                        margin={{
                          top: 30,
                          right: 0,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <XAxis dataKey="cdinjetora" tick={{ fill: '#000' }} />
                        <YAxis domain={[0, 150]} tickCount={4} tick={{ fill: '#666' }} />
                        <Legend
                          formatter={(value) => value === 'ciclo' ? 'Eficiência de Ciclo' : value}
                        />
                        <Bar 
                          dataKey="ciclo" 
                          fill={isCycleBelowEfficiency ? "green" : (isCycleAboveEfficiency ? "red" : "green")}
                          barSize={100}
                        >
                          <LabelList
                            dataKey="ciclo"
                            position="top"
                            formatter={(value: number) => `${value ? value.toFixed(2) : ''}%`}
                            fill="#000"
                            style={{
                              fontSize: '2.3rem',
                              fontWeight: 'bold',
                              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                            }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          );
        })
      ) : (
        // Placeholder de layout para manter as divs estáveis quando não há dados
        <div className="bg-white rounded-lg shadow-lg p-0 flex flex-col h-[900px] col-span-3 justify-center items-center">
          <p className="text-lg font-semibold text-gray-800">Nenhum dado disponível</p>
        </div>
      )}
      <div className='col-span-3'>
      <div className="overflow-auto mt-4 mx-5 fixed-bottom">
        <input
          type="number"
          value={eficiencia}
          onChange={(e) => setEficiencia(e.target.value ? Number(e.target.value) : '')}
          placeholder="Defina a eficiência"
          className="p-2 border-black border-2  rounded mb-1 w-20"
        />
        <input
          type="number"
          value={eficiencia2}
          onChange={(e) => setEficiencia2(e.target.value ? Number(e.target.value) : '')}
          placeholder="Defina a eficiência"
          className="p-2 border-black border-2 mx-4 rounded w-20"
        />
      </div>
      </div>
    </div>
    
  );
};

export default TvMontagem;
