import { create } from 'zustand';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
const LOCAL_STORAGE_KEY = 'clientes-store';
const loadClients = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading clients from localStorage', e);
    return [];
  }
};

const useStore = create(set => ({
  clients: loadClients(),
  clienteFecha: dayjs(),
  lockContra: "sonidal123",
  lockState: false,
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
    console.log(clientId, ensayo);
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
  
  verificarContra: (input) =>
    set((state) => ({
      
      lockState: input === state.lockContra,
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
