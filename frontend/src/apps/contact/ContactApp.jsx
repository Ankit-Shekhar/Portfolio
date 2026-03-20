import React, { useState } from 'react';
import '../../styles/apps.css';

export default function ContactApp() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending message via secure connection...');
    
    // Mock API call
    setTimeout(() => {
      setStatus('Message delivered successfully!');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 4000);
    }, 1500);
  };

  return (
    <div className="app-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h1 className="app-title">Contact Ankit</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1aa', fontSize: '0.9rem' }}>Name</label>
          <input 
            required 
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="chat-input" 
            style={{ width: '100%', boxSizing: 'border-box' }} 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1aa', fontSize: '0.9rem' }}>Email Interface</label>
          <input 
            required 
            type="email" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="chat-input" 
            style={{ width: '100%', boxSizing: 'border-box' }} 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1aa', fontSize: '0.9rem' }}>Encrypted Message</label>
          <textarea 
            required 
            rows="5"
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            className="chat-input" 
            style={{ width: '100%', resize: 'vertical', boxSizing: 'border-box' }} 
          />
        </div>
        <button type="submit" className="chat-btn" style={{ padding: '14px', marginTop: '12px' }}>Transmit Message</button>
      </form>
      {status && <p style={{ marginTop: '20px', color: '#34d399', textAlign: 'center', fontWeight: 'bold' }}>{status}</p>}
    </div>
  );
}
