import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Agendamento() {
  const [especialidade, setEspecialidade] = useState('');
  const [medico, setMedico] = useState('');
  const [data, setData] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const especialidades = ['Clínico Geral', 'Dermatologia', 'Cardiologia'];
  const medicosPorEspecialidade = {
    'Clínico Geral': ['Dra. Ana Paula', 'Dr. João Silva'],
    'Dermatologia': ['Dra. Camila Costa', 'Dr. Bruno Mendes'],
    'Cardiologia': ['Dr. Pedro Alves', 'Dra. Larissa Rocha'],
  };

  // Busca horários disponíveis sempre que data muda
  useEffect(() => {
    if (data) {
      setLoading(true);
      axios.get(`http://localhost:5000/available-times?date=${data}`)
        .then(res => setHorarios(res.data.times))
        .catch(() => setHorarios([]))
        .finally(() => setLoading(false));
    }
  }, [data]);

  const agendar = () => {
    axios.post('http://localhost:5000/schedule', {
      name: nome,
      date: data,
      time: horarioSelecionado
    })
    .then(res => {
      setMensagem(res.data.message);
      setTimeout(() => setMensagem(''), 3000);
    })
    .catch(err => {
      setMensagem(err.response?.data?.message || 'Erro ao agendar');
      setTimeout(() => setMensagem(''), 3000);
    });
  };

  // Impede datas passadas
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Agende sua Consulta</h2>

      <input
        type="text"
        placeholder="Seu nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2 font-medium">Especialidade:</label>
      <select
        value={especialidade}
        onChange={e => {
          setEspecialidade(e.target.value);
          setMedico('');
        }}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">Selecione</option>
        {especialidades.map((esp, i) => (
          <option key={i} value={esp}>{esp}</option>
        ))}
      </select>

      {especialidade && (
        <>
          <label className="block mb-2 font-medium">Médico:</label>
          <select
            value={medico}
            onChange={e => setMedico(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="">Selecione</option>
            {medicosPorEspecialidade[especialidade].map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>
        </>
      )}

      {medico && (
        <>
          <label className="block mb-2 font-medium">Data:</label>
          <input
            type="date"
            value={data}
            onChange={e => {
              setData(e.target.value);
              setHorarioSelecionado('');
            }}
            min={getMinDate()}
            className="w-full p-2 mb-4 border rounded"
          />
        </>
      )}

      {loading && <p className="text-center text-sm text-gray-500 mb-2">Carregando horários...</p>}

      {data && horarios.length > 0 && (
        <>
          <label className="block mb-2 font-medium">Horários disponíveis:</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(hora => (
              <button
                key={hora}
                disabled={!horarios.includes(hora)}
                onClick={() => setHorarioSelecionado(hora)}
                className={`p-2 border rounded text-sm ${
                  horarioSelecionado === hora ? 'bg-blue-600 text-white' :
                  horarios.includes(hora) ? 'bg-white hover:bg-blue-100' :
                  'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {hora}
              </button>
            ))}
          </div>
        </>
      )}

      <button
        onClick={agendar}
        disabled={!nome || !especialidade || !medico || !data || !horarioSelecionado}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        Confirmar Agendamento
      </button>

      {mensagem && (
        <div className="mt-4 text-center text-white bg-green-500 p-2 rounded shadow">
          {mensagem}
        </div>
      )}
    </div>
  );
}
