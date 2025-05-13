import { useState } from "react";
import "./App.css";

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

  const renderVentasGrid = (nombre) => {
    if (nombre === "ensayo") {
      return (
        <table className="mini-tabla">
          <tbody>
            <tr><td>Ensayo</td><td>$10.000</td><td></td></tr>
            <tr><td>Ensayo trío</td><td>$9.000</td><td></td></tr>
            <tr><td>Ensayo dúo</td><td>$7.000</td><td></td></tr>
            <tr><td>Clase</td><td>$6.000</td><td></td></tr>
            <tr><td>Práctica individual</td><td>$5.000</td><td></td></tr>
          </tbody>
        </table>
      );
    } else if (nombre === "birras") {
      return (
        <table className="mini-tabla">
          <tbody>
            <tr><td>Bluemoon</td><td>$4.000</td><td></td></tr>
            <tr><td>Heineken / Grolsch</td><td>$3.500</td><td></td></tr>
            <tr><td>Imperial IPA / Warsteiner / Andes</td><td>$3.000</td><td></td></tr>
            <tr><td>Miller / Amstel</td><td>$3.000</td><td></td></tr>
          </tbody>
        </table>
      );
    } else if (nombre === "alquiler") {
      return (
        <table className="mini-tabla">
          <tbody>
            <tr><td>Instrumento</td><td>$2.500</td><td></td></tr>
            <tr><td>Hi-hat</td><td>$1.000</td><td></td></tr>
            <tr><td>Crash</td><td>$1.000</td><td></td></tr>
            <tr><td>Ride</td><td>$1.000</td><td></td></tr>
            <tr><td>Pedal</td><td>$2.500</td><td></td></tr>
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
      <td className="col-borrar">
        <button className="boton-borrar">X</button>
      </td>
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
            <th className="col-borrar">Borrar</th>
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