import React, { useEffect, useState } from 'react';
import '../../styles/apps.css';

export default function ProjectsApp() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock backend fetch for now. In Phase 5, this connects to /api/v1/projects
    setTimeout(() => {
      setProjects([
        { id: '1', title: 'AroundU', description: 'Real-time hyper-local networking application resolving proximity connections dynamically.', tech: ['React', 'Node.js', 'MongoDB', 'Redis'] },
        { id: '2', title: 'AI Portfolio OS', description: 'Interactive portfolio simulating an Operating System with embedded RAG AI Assistant.', tech: ['React', 'Vite', 'Node', 'Vector DB'] },
        { id: '3', title: 'Domain-Driven API', description: 'Highly scalable backend template using domain-driven architecture and strict module isolation.', tech: ['Express', 'Redis', 'WebSockets'] }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <div className="app-container">Loading projects repository...</div>;

  return (
    <div className="app-container">
      <h1 className="app-title">Projects Explorer</h1>
      <div className="projects-grid">
        {projects.map(p => (
          <div key={p.id} className="card">
            <h2 className="card-title">{p.title}</h2>
            <p className="card-desc">{p.description}</p>
            <div className="tag-container">
              {p.tech.map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
