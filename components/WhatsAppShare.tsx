import React, { useState, useRef, useEffect } from 'react';

const WhatsAppShare: React.FC = () => {
  const shareText = `🔮✨ Aumente sua sorte! Compartilhe este Oráculo com 3 amigos ou familiares e tenha a chance de ser ajudado também quando eles ganharem. Gere seus números aqui: ${window.location.href}`;

  const [showThanksPopup, setShowThanksPopup] = useState(false);
  const popupTimeoutRef = useRef<number | null>(null);

  const encodedMessage = encodeURIComponent(shareText);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

  const handleDonationClick = () => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    window.open('https://www.vakinha.com.br', '_blank', 'noopener,noreferrer');
    setShowThanksPopup(true);
    popupTimeoutRef.current = window.setTimeout(() => {
      setShowThanksPopup(false);
    }, 60000); // O pop-up desaparecerá após 60 segundos
  };

  const handleClosePopup = () => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    setShowThanksPopup(false);
  };

  useEffect(() => {
    // Limpa o timeout se o componente for desmontado
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="my-6 animate-fade-in flex flex-col items-center space-y-3">
        <div className="bg-gray-700/80 p-3 rounded-lg relative shadow-lg max-w-md w-full">
          <p className="text-sm text-center text-gray-200">
            Aumente sua sorte praticando uma boa ação e compartilhando este site para mais 3 pessoas. Quando uma delas ganhar, você também poderá ser ajudado.
          </p>
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-10px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-gray-700/80 border-r-[10px] border-r-transparent"></div>
        </div>
        <div className="flex flex-col items-center space-y-3 w-full max-w-xs sm:max-w-sm">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            Compartilhar o Oráculo
          </a>
          <button
            onClick={handleDonationClick}
            className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            Doe para o Oráculo
          </button>
        </div>
      </div>
      {showThanksPopup && (
        <div 
          className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-2xl z-50 animate-fade-in max-w-sm"
          role="alert"
        >
          <p className="font-semibold">✨ Energia Positiva Enviada!</p>
          <p className="text-sm mt-1">Obrigado por contribuir com o oráculo, estou mandando mais energia positiva para você contribuinte!</p>
          <div className="mt-3 text-right">
              <button
                  onClick={handleClosePopup}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors"
              >
                  OK
              </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppShare;