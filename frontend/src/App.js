import React, { useState, useEffect } from 'react';

// Componente para agendamento
function Agendamento() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (date) {
      fetch(`http://localhost:5000/available-times?date=${date}`)
        .then(res => res.json())
        .then(data => setAvailableTimes(data.times));
    }
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, date, time: selectedTime })
    });
    const data = await res.json();
    setMessage(data.message);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h1 className="text-2xl mb-4 font-semibold text-center">Agendamento de Serviço</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          placeholder="Seu nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <div className="flex flex-wrap gap-2">
          {availableTimes.map((time, index) => (
            <button
              type="button"
              key={index}
              className={`p-2 border rounded ${
                selectedTime === time ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 mt-2 rounded hover:bg-blue-700"
        >
          Agendar
        </button>
      </form>
      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
    </div>
  );
}

// Componente para cadastrar disponibilidade
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
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-2xl mb-4 font-semibold text-center">Cadastrar Disponibilidade</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          placeholder="Nome do médico"
          value={medico}
          onChange={e => setMedico(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          placeholder="Especialidade"
          value={especialidade}
          onChange={e => setEspecialidade(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Salvar Disponibilidade
        </button>
      </form>
      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
    </div>
  );
}

// App principal
function App() {
  const [modo, setModo] = useState('agendamento'); // ou 'disponibilidade'

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setModo('agendamento')}
          className={`p-2 rounded font-medium ${
            modo === 'agendamento' ? 'bg-blue-600 text-white' : 'bg-white border'
          }`}
        >
          Agendar Serviço
        </button>
        <button
          onClick={() => setModo('disponibilidade')}
          className={`p-2 rounded font-medium ${
            modo === 'disponibilidade' ? 'bg-green-600 text-white' : 'bg-white border'
          }`}
        >
          Cadastrar Disponibilidade
        </button>
      </div>

      {modo === 'agendamento' ? <Agendamento /> : <Disponibilidade />}
    </div>
  );
}

export default App;
