import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/selector.css';

export default function OSSelector() {
  const navigate = useNavigate();

  const handleSelect = (os) => {
    localStorage.setItem('selectedOS', os);
    navigate('/evolution');
  };

  return (
    <div className="selector-container">
      <h1 className="selector-title">Select Operating System Environment</h1>
      <div className="selector-cards">
        <div className="selector-card windows-card" onClick={() => handleSelect('windows')}>
          <div className="card-icon">⊞</div>
          <h2 className="card-title">Windows</h2>
        </div>
        <div className="selector-card macos-card" onClick={() => handleSelect('macos')}>
          <div className="card-icon"></div>
          <h2 className="card-title">macOS</h2>
        </div>
      </div>
    </div>
  );
}
