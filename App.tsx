import React, { useState, useEffect } from 'react';
import { ZODIAC_SIGNS } from './constants';
import type { FormData, GenerationResult, SavedPrediction } from './types';
import { generateLuckyNumbers } from './services/geminiService';
import Input from './components/Input';
import Select from './components/Select';
import LuckyNumber from './components/LuckyNumber';
import LoadingSpinner from './components/LoadingSpinner';
import WhatsAppShare from './components/WhatsAppShare';
import DonationModal from './components/DonationModal';

const getZodiacSign = (day: number, month: number): string => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Áries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Touro";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gêmeos";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Câncer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leão";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgem";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpião";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitário";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricórnio";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquário";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Peixes";
  return "";
};


const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dob: '',
    age: '',
    height: '',
    zodiacSign: '',
    favoriteColor: '',
    needsToForgive: '',
    needsToBeForgiven: '',
    drawDate: '',
  });
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [history, setHistory] = useState<SavedPrediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('luckyNumberHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      localStorage.removeItem('luckyNumberHistory');
    }
  }, []);

  useEffect(() => {
    const dob = formData.dob;
    if (dob && dob.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = dob.split('-').map(part => parseInt(part, 10));
      const birthDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
      
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
        const m = today.getUTCMonth() - birthDate.getUTCMonth();
        if (m < 0 || (m === 0 && today.getUTCDate() < birthDate.getUTCDate())) {
          age--;
        }
        const calculatedAge = age >= 0 ? String(age) : '';
        
        const day = birthDate.getUTCDate();
        const month = birthDate.getUTCMonth() + 1;
        const calculatedSign = getZodiacSign(day, month);
        
        setFormData(prev => ({
          ...prev,
          age: calculatedAge,
          zodiacSign: calculatedSign,
        }));
      }
    }
  }, [formData.dob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const proceedWithGeneration = async (choseToDonate: boolean) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedResult = await generateLuckyNumbers(formData, choseToDonate);
      setResult(generatedResult);

      const newPrediction: SavedPrediction = {
        id: new Date().toISOString(),
        timestamp: new Date().toLocaleString('pt-BR'),
        formData: formData,
        result: generatedResult,
      };

      const updatedHistory = [newPrediction, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('luckyNumberHistory', JSON.stringify(updatedHistory));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDonationModalOpen(true);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <DonationModal
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
          onProceed={proceedWithGeneration}
        />
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 pb-2">
            Oráculo da Sorte MegaSena
          </h1>
          <p className="text-gray-400 mt-2">
            Preencha tudo, e deixe o Oráculo e o universo revelar seus números da sorte!
          </p>
        </header>

        <div className="text-center mt-8">
          <a
            href="https://www.megasena.com/calendario-de-sorteios"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Calendário oficial da MegaSena
          </a>
        </div>

        <WhatsAppShare />

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-purple-300">Seus Dados Místicos</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nome Completo" name="fullName" value={formData.fullName} onChange={handleChange} required />
              <Input label="Data de Nascimento" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
              <Input label="Idade" name="age" type="number" value={formData.age} onChange={handleChange} required />
              <Input label="Altura (cm)" name="height" type="number" value={formData.height} onChange={handleChange} required />
              <Select label="Signo do Zodíaco" name="zodiacSign" options={ZODIAC_SIGNS} value={formData.zodiacSign} onChange={handleChange} required />
              <Input label="Cor Favorita" name="favoriteColor" value={formData.favoriteColor} onChange={handleChange} required />
              <Select label="Você sente que precisa perdoar alguém?" name="needsToForgive" options={['', 'Sim', 'Não']} value={formData.needsToForgive} onChange={handleChange} required />
              <Select label="Você sente que precisa ser perdoado?" name="needsToBeForgiven" options={['', 'Sim', 'Não']} value={formData.needsToBeForgiven} onChange={handleChange} required />
              <Input label="Que dia será o sorteio desejado?" name="drawDate" type="date" value={formData.drawDate} onChange={handleChange} required />
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-lg"
              >
                {isLoading ? <LoadingSpinner /> : 'Gerar Meus Números!'}
              </button>
            </form>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col items-center justify-center min-h-[300px]">
            {isLoading && (
              <div className="text-center">
                <div className="animate-pulse text-purple-300 text-lg">
                  Consultando os astros e alinhando os chakras...
                </div>
              </div>
            )}
            {error && <div className="text-red-400 text-center">{error}</div>}
            {result && (
              <div className="text-center w-full animate-fade-in">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">Sua Sorte foi Lançada!</h3>
                <div className="flex justify-center gap-2 sm:gap-4 my-6">
                  {result.luckyNumbers.map(num => <LuckyNumber key={num} number={num} />)}
                </div>
                <p className="text-gray-300 italic text-sm mb-6">{result.explanation}</p>
              </div>
            )}
            {!isLoading && !error && !result && (
               <div className="text-center text-gray-400">
                 <p>Seus números da sorte aparecerão aqui.</p>
               </div>
            )}
          </div>
        </main>
        
        {history.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-6 text-purple-300">Histórico de Previsões</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {history.map(item => (
                <div key={item.id} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{item.formData.fullName}</p>
                      <p className="text-sm text-gray-400">Gerado em: {item.timestamp}</p>
                    </div>
                    <p className="text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded">
                      Sorteio: {new Date(item.formData.drawDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {item.result.luckyNumbers.map(num => <div key={num} className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500/50 text-sm font-bold">{String(num).padStart(2,'0')}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default App;