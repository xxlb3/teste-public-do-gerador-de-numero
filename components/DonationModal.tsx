import React, { useState, useEffect } from 'react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (choseToDonate: boolean) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, onProceed }) => {
  const [step, setStep] = useState(1);

  // Reset step to 1 when the modal is closed and then reopened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleNo = () => {
    onClose();
    onProceed(false);
  };

  const handleYes = () => {
    window.open('https://www.vakinha.com.br', '_blank', 'noopener,noreferrer');
    setStep(2);
  };

  const handleHonest = () => {
    onClose();
    onProceed(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 max-w-sm w-full text-center border border-purple-500 transform transition-all animate-pop-in">
        {step === 1 && (
          <>
            <h3 className="text-xl font-bold text-purple-300 mb-2">Aumente sua Sorte! ✨</h3>
            <p className="text-gray-300 mb-6">
              Aumente sua sorte e energia universal fazendo o bem, doando qualquer valor para o criador do oráculo.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={handleNo} 
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Não, obrigado
              </button>
              <button 
                onClick={handleYes} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Sim, quero doar
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="text-xl font-bold text-purple-300 mb-2">Obrigado pela sua Boa Ação!</h3>
            <p className="text-gray-300 mb-6">
              Já fez sua doação? Sua honestidade fortalece a sua sorte.
            </p>
            <button 
              onClick={handleHonest} 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
            >
              Sim, sou honesto
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DonationModal;
