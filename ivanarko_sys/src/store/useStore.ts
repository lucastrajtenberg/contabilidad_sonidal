import { create } from 'zustand';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
const LOCAL_STORAGE_KEY = 'clientes-store';

const loadClients = async () => {
  try {
    const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
    
    const ENDPOINT = "https://api.github.com/repos/lucastrajtenberg/contabilidad_sonidal/contents/clientes/clientes.json";
    const response = await fetch(ENDPOINT, 
    {
      headers: {
          'Authorization': `token ${TOKEN}`,
          'Content-Type': 'application/json'
      }
    })

    if (!response.ok)
      throw new Error('Error al cargar clientes.json');
    const data = await response.json();

    const decodeBase64 = (b64) => {
      // atob → binario (string con chars de 0–255)
      const binary = atob(b64);
      // convertir cada char a su código y crear un Uint8Array
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      // TextDecoder para obtener string UTF-8
      return new TextDecoder().decode(bytes);
    };

    // 4. Decodificar el contenido y convertir a objeto
    const jsonString = decodeBase64(data.content);
    const clients = JSON.parse(jsonString);

    console.log('Clientes cargados:', clients);
    return clients;

  } catch (e) {
    console.error('Error loading clients from localStorage', e);
    return [];
  }
};

const useStore = create(set => ({
  clients: [],
  clienteFecha: dayjs(),
  lockContra: "sonidal123",
  lockState: false,
  clientsLoaded: false,
  setClientsLoadedSuccessfully: () => set(() => ({ clientsLoaded: true })),
  loadClientsFromGithub: async () => {
    const clients = await loadClients();
    console.log("CLIENTES OBTENIDOS DESDE GITHUB", clients);
    set(() => ({ clients }));
  },
  createNewClient: (clientId, fecha) =>
    set(state => {
      if (state.clients[clientId]) return state;
      return {
        clients: {
          ...state.clients,
          [clientId]: {
            nombre: '',
            fecha: fecha
          }
        }
      };
    }),
  removeClient: clientId =>
    set(state => {
      const newClients = { ...state.clients };
      delete newClients[clientId];
      console.log('removeClient', clientId, newClients);
      return { clients: newClients };
    }),
  setClientNombre: (clientId, nombre) =>
    set(state => {
      if (!state.clients[clientId]) return state;
      const client = state.clients[clientId] || {};
      return {
        clients: {
          ...state.clients,
          [clientId]: {
            ...client,
            nombre: nombre
          }
        }
      };
    }),
  setClientSala: (clientId, sala) =>
    set(state => {
      if (!state.clients[clientId]) return state;
      const client = state.clients[clientId] || {};
      return {
        clients: {
          ...state.clients,
          [clientId]: {
            ...client,
            sala: sala
          }
        }
      };
    }),
  setClientCantidades: (clientId, categoria, nombre, delta) =>
    set(state => {
      const client = state.clients[clientId] || {};
      console.log("SETTER CANTIDADES", categoria, nombre, delta)
      const newQuantity = Math.max(
        0,
        (client[categoria]?.[nombre] || 0) + delta
      );
      if (client[categoria] && categoria == 'ensayo') delete client[categoria];
      return {
        clients: {
          ...state.clients,
          [clientId]: {
            ...client,
            [categoria]: {
              ...client[categoria],
              [nombre]: newQuantity
            }
          }
        }
      };
    }),

  setGlobalClienteFecha: newDate => set(() => ({ clienteFecha: newDate })),
  selectedSala: [],
  setGlobalSelectedSala: sala =>
    set(state => ({ selectedSala: [...state.selectedSala, sala] })),
  clienteName: [],
  setGlobalClienteName: name =>
    set(state => ({ clienteName: [...state.clienteName, name] })),
  ensayos: [],
  setGlobalEnsayos: (clientId, ensayo) => {
    console.log("GLOBAL ENSAYOS", clientId, ensayo);
    set(state => ({
      clients: state.clients.map(client =>
        client.id === clientId ? { ...client, ensayo } : client
      )
    }));
  },
  cantidades: [],
  setGlobalCantidades: (id, newCantidades, total) => {
    set(state => ({
      cantidades: {
        ...state.cantidades,
        [id]: {
          cantidades: newCantidades,
          total: total
        }
      }
    }));
  },
  setClienteFecha: newDate => set(() => ({ clienteFecha: newDate })),
  
  desbloquear: () =>
    set(() => ({
     lockState: true,
    })),

  bloquear: () =>
    set(() => ({
      lockState: false,
    }))
}));

/*
"20-5-23": {
  "11231312": {
    cantidades: {
      "ensayo" : {
        "trio": 0
        "duo": 0
      }
      "birras": {
        "": 0
      }
      alquiler: {
        "a": 0
      }
    }
    sala
    nombre
    
  }
}
*/

export default useStore;
