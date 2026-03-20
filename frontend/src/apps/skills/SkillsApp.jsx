import React, { useEffect, useState } from 'react';
import '../../styles/apps.css';

export default function SkillsApp() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    setSkills([
      { category: 'Frontend', items: ['React', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind', 'Framer Motion'] },
      { category: 'Backend', items: ['Node.js', 'Express', 'Domain-Driven Design', 'RESTful APIs', 'WebSockets'] },
      { category: 'Database & Cloud', items: ['MongoDB', 'Redis', 'Vector DBs (Chroma)', 'AWS/GCP'] },
      { category: 'AI & Systems', items: ['RAG Architectures', 'LLM Prompting', 'Embeddings', 'LangChain'] }
    ]);
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">Technical Skills Matrix</h1>
      <div className="skills-grid">
        {skills.map(skill => (
          <div key={skill.category} className="card">
            <h2 className="card-title">{skill.category}</h2>
            <div className="tag-container" style={{ marginTop: '16px' }}>
              {skill.items.map(item => (
                <span key={item} className="tag" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
