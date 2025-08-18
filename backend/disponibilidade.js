import React, { useState } from 'react';

function Disponibilidade() {
  const [medico, setMedico] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/disponibilidade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medico, especialidade, date, time })
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="p-8 bg-white shadow rounded max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Cadastrar Disponibilidade</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input placeholder="Nome do médico" value={medico} onChange={e => setMedico(e.target.value)} required />
        <input placeholder="Especialidade" value={especialidade} onChange={e => setEspecialidade(e.target.value)} required />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">Salvar Disponibilidade</button>
      </form>
      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
    </div>
  );
}

export default Disponibilidade;
