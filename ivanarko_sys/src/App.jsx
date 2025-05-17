import { useState } from "react";
import "./App.css";
import ensayoData from "./data/ensayo.json";
import birrasData from "./data/birras.json";
import alquilerData from "./data/alquiler.json";

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
        <div className="qty">
            <span className="qty-num">{cantidades[item.nombre] || 0}</span>
            <div className="qty-flechas">
              <button onClick={() => changeQty(item.nombre, 1)}>▲</button>
              <button onClick={() => changeQty(item.nombre, -1)}>▼</button>
            </div>
        </div>
      </td>
    </tr>
  );

  const renderVentasGrid = (nombre) => {
    if (nombre === "ensayo") {
      const ensayoActual = ensayoData.find(
        (i) => i.nombre.toLowerCase() == selectedEnsayo
      ) || ensayoData[0];

      return (
        <table className="mini-tabla">
          <tbody>
            <tr>
              <td>
                <div className="dropdown-wrapper">
                  <select className="dropdown-ventas"
                          value={selectedEnsayo}
                          onChange={handleEnsayoChange}>
                    {ensayoData.map(({ nombre }) => (
                      <option key={nombre} value={nombre}>
                        {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
                      </option>
                    ))}
                  </select>
                  <span className="flecha-dropdown">&#9662;</span>
                </div>
              </td>
              <td>${ensayoActual.precio}</td>
              <td>
                <div className="qty">
                  <span className="qty-num">{cantidades[ensayoActual.nombre] || 0}</span>
                  <div className="qty-flechas">
                    <button onClick={() => changeQty(ensayoActual.nombre, 1)}>▲</button>
                    <button onClick={() => changeQty(ensayoActual.nombre, -1)}>▼</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    if (nombre === "birras")
      return (
        <table className="mini-tabla"><tbody>{birrasData.map(miniFila)}</tbody></table>
      );

    if (nombre === "alquiler")
      return (
        <table className="mini-tabla"><tbody>{alquilerData.map(miniFila)}</tbody></table>
      );

    return null;
  };

  const renderHead = () => (
    <tr>
      <th className="col-nombre">
        <form onSubmit={(e) => e.preventDefault()} className="form-nombre">
          <input type="text" placeholder="nombre" className="input-nombre" />
        </form>
        <div className="dropdown-wrapper">
          <select className="dropdown-salas" value={selectedSala} onChange={handleSalaChange}>
            <option value="1">Sala 1</option>
            <option value="2">Sala 2</option>
            <option value="3">Sala 3</option>
          </select>
          <span className="flecha-dropdown">&#9662;</span>
        </div>
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
  {expandedRows[nombre]
    ? renderVentasGrid(nombre)
    : nombre === "ensayo"
      ? cantidades[selectedEnsayo] > 0
        ? <span className="resumen-colapsado">{cantidades[selectedEnsayo]} {selectedEnsayo.charAt(0).toUpperCase() + selectedEnsayo.slice(1)}</span>
        : null
      : resumenConsumos(data)
        ? <span className="resumen-colapsado">{resumenConsumos(data)}</span>
        : null
  }
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