
import React from 'react';

interface LuckyNumberProps {
  number: number;
}

const LuckyNumber: React.FC<LuckyNumberProps> = ({ number }) => {
  return (
    <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg border-2 border-white/50 animate-pop-in">
      <span className="text-2xl sm:text-3xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
        {String(number).padStart(2, '0')}
      </span>
    </div>
  );
};

export default LuckyNumber;
