import { useState } from "react";
import "./App.css";
import ensayoData from "./data/ensayo.json";
import birrasData from "./data/birras.json";
import alquilerData from "./data/alquiler.json";

function App() {
  const [expandedRows, setExpandedRows] = useState({
    ensayo: true,
    birras: true,
    alquiler: true,
  });

  const toggleRow = (key) => { //Esto switchea el estado de los bichos expanded
    setExpandedRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [selectedEnsayo, setSelectedEnsayo] = useState("ensayo");

  const handleEnsayoChange = (e) => {
    setSelectedEnsayo(e.target.value);
  };

  const renderVentasGrid = (nombre) => {
    if (nombre === "ensayo") {
      return (
        <table className="mini-tabla">
          <tbody>
            <tr>
            <td>
  <div className="dropdown-wrapper">
    <select className="dropdown-ventas" value={selectedEnsayo} onChange={handleEnsayoChange}>
      <option value="ensayo">Ensayo</option>
      <option value="ensayo trio">Ensayo trío</option>
      <option value="ensayo duo">Ensayo dúo</option>
      <option value="clase">Clase</option>
      <option value="practica individual">Práctica individual</option>
    </select>
    <span className="flecha-dropdown">&#9662;</span> {/* flechita ▼ en unicode */}
  </div>
</td>
              <td>${ensayoData.find(item => item.nombre === selectedEnsayo)?.precio || "$0"}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      );    
    } else if (nombre === "birras") {
      return (
        <table className="mini-tabla">
          <tbody>
             {birrasData.map((item, index) => (
          <tr key={item.nombre}>
            <td>{item.nombre}</td>
            <td>${item.precio}</td>
            <td></td>
          </tr>
        ))}
          </tbody>
        </table>
      );
    } else if (nombre === "alquiler") {
      return (
        <table className="mini-tabla">
          <tbody>
            {alquilerData.map((item, index) => (
          <tr key={item.nombre}>
            <td>{item.nombre}</td>
            <td>${item.precio}</td>
            <td></td>
          </tr>
        ))}
          </tbody>
        </table>
      );
    } else {
      return null;
    }
  };
  
  //render row renderea cada columna teniendo en cuenta si está expandida o colapsada ventas, checkeando el 

  const renderRow = (nombre) => (
    <tr key={nombre}>
      <td className="col-nombre">
        <div className="nombre-expandible">
          <span>{nombre}</span>
          <button
            className="boton-toggle"
            onClick={() => toggleRow(nombre)}
          >
            {expandedRows[nombre] ? "x" : "+"}
          </button>
        </div>
      </td>
      <td className="col-ventas">
        {expandedRows[nombre] && renderVentasGrid(nombre)}
      </td>
      <td className="col-total">$0</td>
    </tr>
  );

  return (
    <div className="tabla-container">
      <table className="tabla">
        <thead>
          <tr>
            <th className="col-nombre">
              <form onSubmit={(e) => e.preventDefault()} className="form-nombre">
                <span>Nombre:</span>
                <input
                  type="text"
                  placeholder="nombre"
                  className="input-nombre"
                />
              </form>
            </th>
            <th className="col-ventas">Ventas</th>
            <th className="col-total">Total</th>
          </tr>
        </thead>
        <tbody>
          {renderRow("ensayo")}
          {renderRow("birras")}
          {renderRow("alquiler")}
        </tbody>
      </table>
    </div>
  );
}

export default App;