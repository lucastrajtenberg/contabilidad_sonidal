import { useState } from "react";
import "./App.css";
//jsons de data
import ensayoData from "./data/ensayo.json";
import birrasData from "./data/birras.json";
import alquilerData from "./data/alquiler.json";
//componentes
import QtyFlechitas from "./components/QtyFlechitas";
import DropdownSala from "./components/DropdownSala";
import MinitablaVentas from "./components/MinitablaVentas";

function App() {

  /** CONSTANTES */

  const [expandedRows, setExpandedRows] = useState({
    ensayo: true,
    birras: false,
    alquiler: false,
  });

  const [selectedEnsayo, setSelectedEnsayo] = useState("ensayo");
  const [selectedSala, setSelectedSala] = useState("1");
  const [cantidades, setCantidades] = useState({});

  const handleEnsayoChange = (e) => setSelectedEnsayo(e.target.value);
  const handleSalaChange = (e) => setSelectedSala(e.target.value);

  /* FUNCIONES */

  const precioDe = (nombre) =>
    [...ensayoData, ...birrasData, ...alquilerData]
      .find((i) => i.nombre === nombre)?.precio || 0;

  const changeQty = (nombre, delta) =>
    setCantidades((prev) => ({
      ...prev,
      [nombre]: Math.max(0, (prev[nombre] || 0) + delta),
    }));

  const totalCat = (lista) =>
    lista.reduce(
      (acc, item) => acc + precioDe(item.nombre) * (cantidades[item.nombre] || 0),
      0
    );

  const resumenConsumos = (lista) =>
    lista
      .filter((item) => cantidades[item.nombre] > 0)
      .map((item) => `${cantidades[item.nombre]} ${item.nombre}`)
      .join(", ");
  
    
    /** RENDERS */
    
  const toggleRow = (key) =>
    setExpandedRows((p) => ({ ...p, [key]: !p[key] }));
    
  const miniFila = (item) => ( //(cada una de las que va en la miniTabla de ventas)
    <tr key={item.nombre}>
      <td>{item.nombre}</td>
      <td>${item.precio}</td>
      <td>
        <QtyFlechitas
          value={cantidades[item.nombre] || 0}
          onIncrease={() => changeQty(item.nombre, 1)}
          onDecrease={() => changeQty(item.nombre, -1)}
        />
      </td>
    </tr>
  );

  const renderVentasGrid = (key, data) => (
    <MinitablaVentas
      categoria={key}
      data={data}
      cantidades={cantidades}
      changeQty={changeQty}
      /* props exclusivos de “ensayo” */
      selectedEnsayo={selectedEnsayo}
      onEnsayoChange={handleEnsayoChange}
    />
  );
  

  const renderHead = () => (
    <tr>
      <th className="col-nombre">
        <form onSubmit={(e) => e.preventDefault()} className="form-nombre">
          <input type="text" placeholder="nombre" className="input-nombre" />
        </form>
        <DropdownSala value={selectedSala} onChange={handleSalaChange} />
      </th>
      <th className="col-ventas">Ventas</th>
      <th className="col-total">Total</th>
    </tr>
  );

  const renderRow = (nombre, data) => (
    <tr key={nombre}>
      <td className="col-nombre">
        <div className="nombre-expandible">
          <span>{nombre}</span>
          <button className="boton-toggle" onClick={() => toggleRow(nombre)}>
            {expandedRows[nombre] ? "▲" : "▼"}
          </button>
        </div>
      </td>
      <td className="col-ventas">
      {expandedRows[nombre] ? (
  <MinitablaVentas
    categoria={nombre}
    data={data}
    cantidades={cantidades}
    changeQty={changeQty}
    selectedEnsayo={selectedEnsayo}
    onEnsayoChange={handleEnsayoChange}
  />
) : (
  nombre === "ensayo"
    ? cantidades[selectedEnsayo] > 0 && (
        <span className="resumen-colapsado">
          {cantidades[selectedEnsayo]}{" "}
          {selectedEnsayo.charAt(0).toUpperCase() + selectedEnsayo.slice(1)}
        </span>
      )
    : resumenConsumos(data) && (
        <span className="resumen-colapsado">{resumenConsumos(data)}</span>
      )
)}

</td>
      <td className="col-total">${totalCat(data)}</td>
    </tr>
  );  

  return (
    <div className="tabla-container">
      <table className="tabla">
        <thead>{renderHead()}</thead>
        <tbody>
          {renderRow("ensayo", ensayoData)}
          {renderRow("birras", birrasData)}
          {renderRow("alquiler", alquilerData)}
        </tbody>
      </table>
    </div>
  );
}

export default App;