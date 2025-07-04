import { useEffect, useState } from 'react';
import TablaCliente from './components/TablaCliente';
import BotonLock from './components/BotonLock'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import useStore from './store/useStore';
const LOCAL_STORAGE_KEY = 'clientes-store';

export default function App() {
  /* ---------- estado global ---------- */
  
  const lockState = useStore((s) => s.lockState);
  const [clientes, setClientes] = useState([]);
  const [nombres, setNombres] = useState({});
  const [totales, setTotales] = useState({});
  const {
    clients,
    clienteFecha,
    setClienteFecha,
    createNewClient,
    removeClient,
    setClientsLoadedSuccessfully,
    clientsLoaded,
    loadClientsFromGithub
  } = useStore();

  const saveClients = async () => {
    console.log(clients)
    for (const client of Object.values(clients)) {
      if (client.nombre.length === 0)
        throw new Error('Un cliente no tiene nombre asignado');
    }

    // sha clientes.json https://api.github.com/repos/lucastrajtenberg/contabilidad_sonidal/contents/clientes
    const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
    const ENDPOINT = "https://api.github.com/repos/lucastrajtenberg/contabilidad_sonidal/contents/clientes/clientes.json";
    
    // sacamos el sha de clientes.json
    const response = await fetch(ENDPOINT);
    const data = await response.json();
    const sha = data.sha;
    
    // preparamos todo el bicho
    const jsonString = JSON.stringify(clients, null, 2);
    const base64 = btoa(unescape(encodeURIComponent(jsonString)));
    
    // preparamos el payload
    const payload = {
      message: "Actualizando automatica clientes.json",
      content: base64,
      sha: sha
    };

    try {
      const putResponse = await fetch(ENDPOINT, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      console.log(putResponse.status);
      console.log("Guardado correctamente", putResponse);
    } catch (e) {
      console.error('Error al guardar los clientes', e);
      return;
    }
  }

  useEffect(() => {
    try {
      async function saveGithubClients() {
        await saveClients();
        return
      }
      async function setInitialClients() {
        await loadClientsFromGithub();
        return
      }

      if (clientsLoaded === false) {
        setInitialClients();
        setClientsLoadedSuccessfully();
      }
      if (Object.values(clients).length >= 0) {
        // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients));
        saveGithubClients();
      }
    } catch (e) {
      console.error('Error saving clients to localStorage', e);
    }
  }, [clients]);

  //console.log(selectedSala, clienteName, ensayos, cantidades);
  const addCliente = () => {
    const id = Date.now();
    createNewClient(id, clienteFecha);
    setClientes(prev => [...prev, id]);
  };

  const removeCliente = id => {
    console.log('REMOVIENDO ', id);
    removeClient(id);
    setClientes(prev => prev.filter(c => c !== id));
    setNombres(prev => {
      const p = { ...prev };
      delete p[id];
      return p;
    });
    setTotales(prev => {
      const p = { ...prev };
      delete p[id];
      return p;
    });
  };

  const handleNameChange = (id, name) =>
    setNombres(p => ({ ...p, [id]: name }));

  const handleTotalChange = (id, total) =>
    setTotales(p => ({ ...p, [id]: total }));



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
      <div className='flex h-dvh overflow-y-auto '>
        {/* NAVBAR */}
        <aside className='w-full max-w-[400px] h-full p-4 bg-grey-600 flex flex-col gap-4'>
          <div className='bg-black text-white p-4 rounded-md'>
            <div className='flex items-center'>
              <img
                src='src/images/sonidal logo icon.png'
                alt='Logo'
                className='w-[100px] h-[100px] object-cover mr-4'
              />
              <div>
                <h1 className='text-3xl font-bold'>Sonidal Estudio</h1>
                <span className='text-sm text-gray-400'>
                  App de contabilidad
                </span>
              </div>
            </div>
          </div>

          <DatePicker
            label='Fecha'
            value={clienteFecha}
            onChange={newDate => setClienteFecha(newDate)}
          />

          <button
            onClick={addCliente}
            disabled={!lockState}
            className='px-3 py-2 bg-black text-white rounded-md'
          >
            + Añadir cliente
          </button>

          {/* <button  onClick={closeBox} className='px-3 py-2 bg-red text-white rounded-md'>
          Cerrar caja
          </button> */}

          <ul className='flex-1 overflow-y-auto divide-y'>
            {Object.entries(clients)
              .filter(
                ([, cliente]) =>
                  new Date(cliente.fecha).toISOString().slice(0, 10) ===
                  new Date(clienteFecha).toISOString().slice(0, 10)
              )
              .map(([id, cliente]) => (
                <li
                  key={id}
                  className='flex items-center justify-between py-2 text-sm px-2 gap-2'
                >
                  <span className='truncate max-w-[100px] flex-1'>
                    {cliente.nombre || 'Sin nombre'}
                  </span>
                  <span className='font-mono w-[50px] text-right'>
                    ${totales[id]?.toFixed(0) || 0}
                  </span>
                  <button
                    onClick={() => removeCliente(id)}
                    className='text-red-500 hover:text-red-700 ml-1'
                  >
                    ✕
                  </button>
                </li>
              ))}
          </ul>

          <BotonLock></BotonLock>

          <div className='border-t border-gray-300 mt-2 p-2 pl-4 text-left text-sm'>
            <div>Total del día:</div>
            <div className='font-mono text-lg font-semibold'>
              $
              {clientes
                .reduce((acc, id) => acc + (totales[id] || 0), 0)
                .toFixed(0)}
            </div>
          </div>
        </aside>

        {/* PANEL PRINCIPAL */}
        {!lockState && <main className='w-[80%] h-dvh p-4 flex flex-col justify-center items-center '>
          <h1>Contenido bloqueado</h1>
        </main>
        }
        {lockState &&
        <main className='w-[80%] p-4 space-y-8 overflow-auto bg-linear-to-r'>
          {Object.entries(clients)
            .filter(
              ([, cliente]) =>
                new Date(cliente.fecha).toISOString().slice(0, 10) ===
                new Date(clienteFecha).toISOString().slice(0, 10)
            )
            .map(([id, cliente]) => (
              <TablaCliente
                key={id}
                clienteId={id}
                fecha={cliente.fecha}
                onNameChange={name => handleNameChange(id, name)}
                onTotalChange={tot => handleTotalChange(id, tot)}
              />
            ))}
        </main>
      }
      </div>
    </LocalizationProvider>
  );
}
