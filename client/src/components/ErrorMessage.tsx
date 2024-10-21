import React from 'react';

interface errorProps {
  text: string;
  style?: React.CSSProperties;
}

const ErrorMessage: React.FC<errorProps> = ({ text, style }) => {
  return (
    <div>
      <p style={{ color: '#f00', fontWeight: '500', textAlign: 'center', marginTop: '0', ...style }}>
        {text}
      </p>
    </div>
  );
};

export default ErrorMessage;
