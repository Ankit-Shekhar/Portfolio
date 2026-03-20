import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TerminalLanding from '../os/terminal/TerminalLanding';
import OSEvolution from '../os/evolution/OSEvolution';
import Desktop from '../os/desktop/Desktop';

export default function App() {
  return (
    <BrowserRouter>
      <div className="os-container">
        <Routes>
          <Route path="/" element={<TerminalLanding />} />
          <Route path="/evolution" element={<OSEvolution />} />
          <Route path="/desktop" element={<Desktop />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
