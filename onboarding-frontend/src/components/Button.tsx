// src/components/Button.tsx
import React from 'react'; // import required for TS module

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ children, onClick }: Props) => {
  return <button onClick={onClick}>{children}</button>;
};

export default Button; // export makes it a module
