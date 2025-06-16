import { useState, useEffect } from 'react';
import './TablaCliente.css';
import preciosData from '../data/precios.json';
import DropdownSala from './DropdownSala';
import MinitablaVentas from './MinitablaVentas';
import dayjs from 'dayjs';
import useStore from '../store/useStore';

export default function TablaCliente({
  clienteId,
  fecha,
  onNameChange,
  onTotalChange
}) {
  const [expandedRows, setExpandedRows] = useState({
    ensayo: true,
    birras: false,
    alquiler: false
  });

  const {
    // selectedSala,
    // setSelectedSala,
    // clienteName,
    // setClienteName,
    clients,
    setClientNombre,
    setClientSala,
    setGlobalEnsayos,
    setGlobalSelectedSala,
    setGlobalCantidades,
    setClientCantidades
    // setClients
  } = useStore();

  const currentClient = clients[clienteId];
  console.log('CURRENT NENE', currentClient);

  const [selectedEnsayo, setSelectedEnsayo] = useState('ensayo');
  const [selectedSala, setSelectedSala] = useState(currentClient.sala || '1');
  const [clienteName, setClienteName] = useState(currentClient.nombre);
  const [cantidades, setCantidades] = useState({
    ensayo: currentClient.ensayo ?? {},
    birras: currentClient.birras ?? {},
    alquiler: currentClient.alquiler ?? {}
  });

  const handleEnsayoChange = e => {
    const nuevoEnsayo = e.target.value;
    setClientCantidades(clienteId, 'ensayo', nuevoEnsayo, 0);
    setCantidades(prev => ({
      ...prev,
      ensayo: {
        [nuevoEnsayo]: prev.ensayo[nuevoEnsayo] || 0
      }
    }));
    setSelectedEnsayo(nuevoEnsayo);
    setGlobalEnsayos(clienteId, nuevoEnsayo);
  };

  const handleSalaChange = e => {
    setSelectedSala(e.target.value);
    setClientSala(clienteId, e.target.value);
    setGlobalSelectedSala(e.target.value);
  };
  const toggleRow = key => setExpandedRows(p => ({ ...p, [key]: !p[key] }));

  const precioDe = nombre =>
    [...preciosData].find(i => i.nombre === nombre)?.precio || 0;

  const changeQty = (categoria, nombre, delta) => {
    let nuevoEstado;
    setClientCantidades(clienteId, categoria, nombre, delta);

    setCantidades(prev => {
      console.log(prev);
      const nuevaCantidad = Math.max(
        0,
        (prev[categoria]?.[nombre] || 0) + delta
      );
      nuevoEstado = {
        ...prev,
        [categoria]: {
          ...prev[categoria],
          [nombre]: nuevaCantidad
        }
      };
      return nuevoEstado;
    });

    // Este se ejecuta luego del render
    setTimeout(() => {
      setGlobalCantidades(clienteId, nuevoEstado);
    }, 0);
  };

  const totalCat = lista =>
    lista.reduce((acc, item) => {
      const cat = item.categoria;
      const nombre = item.nombre;
      const cantidad = cantidades[cat]?.[nombre] || 0;
      return acc + precioDe(nombre) * cantidad;
    }, 0);

  const resumenConsumos = lista =>
    lista
      .filter(i => (cantidades[i.categoria]?.[i.nombre] || 0) > 0)
      .map(i => `${cantidades[i.categoria][i.nombre]} ${i.nombre}`)
      .join(', ');

  const totalGeneral = totalCat(preciosData);

  // Efecto para actualizar total al padre
  useEffect(() => {
    onTotalChange && onTotalChange(totalGeneral);
  }, [cantidades, selectedEnsayo]);

  // Efecto para enviar nombre al padre
  const handleNameInput = e => {
    const val = e.target.value;
    setClientNombre(clienteId, val);
    setClienteName(val);
    onNameChange && onNameChange(val);
  };

  const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1);

  const renderHead = () => (
    <tr>
      <th className='col-nombre'>
        <form onSubmit={e => e.preventDefault()} className='form-nombre'>
          <input
            type='text'
            placeholder='Nombre'
            className='input-nombre'
            value={currentClient.nombre}
            onChange={handleNameInput}
          />
        </form>
        <DropdownSala value={selectedSala} onChange={handleSalaChange} />
      </th>
      <th className='col-ventas'>Ventas</th>
      <th className='col-total'>Total</th>
    </tr>
  );

  const renderRow = (nombre, data) => (
    <tr key={nombre}>
      <td className='col-nombre'>
        <div className='nombre-expandible'>
          <span>{capitalizeFirst(nombre)}</span>
          <button className='boton-toggle' onClick={() => toggleRow(nombre)}>
            {expandedRows[nombre] ? '▲' : '▼'}
          </button>
        </div>
      </td>

      <td className='col-ventas'>
        {expandedRows[nombre] ? ( //si la categoria no esta colapsada :
          <MinitablaVentas
            categoria={nombre}
            data={data}
            cantidades={cantidades}
            changeQty={changeQty} //cambia cantidades dentro de TablaCliente, respecto de lo clickeado en las flechitas de MinitablaVentas
            selectedEnsayo={currentClient['ensayo']}
            onEnsayoChange={handleEnsayoChange}
          />
        ) : nombre === 'ensayo' ? ( //si la categoria esta colapsada y el nombre es ensayo
          cantidades.ensayo[selectedEnsayo] > 0 && (
            <span className='resumen-colapsado'>
              {cantidades.ensayo[selectedEnsayo]}{' '}
              {selectedEnsayo.charAt(0).toUpperCase() + selectedEnsayo.slice(1)}
            </span>
          )
        ) : resumenConsumos(data) ? ( //si la categoria esta colapsada y el nombre != de ensayo
          <span className='resumen-colapsado'>{resumenConsumos(data)}</span>
        ) : null}
      </td>

      <td className='col-total'>${totalCat(data)}</td>
    </tr>
  );

  return (
    <div className='tabla-container mb-6'>
      <table className='tabla w-full border border-gray-300 '>
        <thead className='text-white-700 uppercase bg-gray-50 dark:bg-black dark:text-white'>
          {renderHead()}
        </thead>
        <tbody>
          {renderRow(
            'ensayo',
            preciosData.filter(p => p.categoria === 'ensayo')
          )}
          {renderRow(
            'birras',
            preciosData.filter(p => p.categoria === 'birras')
          )}
          {renderRow(
            'alquiler',
            preciosData.filter(p => p.categoria === 'alquiler')
          )}
        </tbody>
      </table>
      <pre>{JSON.stringify(cantidades, null, 2)}</pre>
      <pre>sala: {JSON.stringify(selectedSala, null, 2)}</pre>
      <pre>
        fecha: {JSON.stringify(dayjs(fecha).format('DD/MM/YY'), null, 2)}
      </pre>
      <pre>nombre: {clienteName}</pre>
    </div>
  );
}
