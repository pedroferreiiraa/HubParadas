import React from 'react';

interface ButtonProps {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
  }
  
  const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary', size = 'medium' }) => {
    const baseClasses = "font-bold rounded";
    const variantClasses = variant === 'primary' ? "bg-blue-500 hover:bg-blue-700 text-white" : "bg-gray-300 hover:bg-gray-400 text-black";
    const sizeClasses = {
      small: "py-1 px-2 text-sm",
      medium: "py-2 px-4 text-base",
      large: "py-3 px-6 text-lg"
    }[size];
  
    return (
      <button 
        className={`${baseClasses} ${variantClasses} ${sizeClasses}`}
        onClick={onClick}
      >
        {text}
      </button>
    );
  };

export default Button;