import { useState } from "react";
import "./TablaCliente.css";           // si querés estilos específicos
// jsons de data
import ensayoData from "../data/ensayo.json";
import birrasData from "../data/birras.json";
import alquilerData from "../data/alquiler.json";
// componentes
import DropdownSala from "./DropdownSala";
import MinitablaVentas from "./MinitablaVentas";

export default function TablaCliente() {
  /** ESTADOS LOCALES  (cada tabla maneja los suyos) */
  const [expandedRows, setExpandedRows] = useState({
    ensayo: true,
    birras: false,
    alquiler: false,
  });
  const [selectedEnsayo, setSelectedEnsayo] = useState("ensayo");
  const [selectedSala, setSelectedSala] = useState("1");
  const [cantidades, setCantidades] = useState({});

  /** HANDLERS */
  const handleEnsayoChange = (e) => {
  const nuevoEnsayo = e.target.value;
  setCantidades((prev) => ({
    ...prev,
    [selectedEnsayo]: 0,      // resetea el anterior
    [nuevoEnsayo]: prev[nuevoEnsayo] || 0, // asegura que exista el nuevo
  }));
  setSelectedEnsayo(nuevoEnsayo);
};

  const handleSalaChange  = (e) => setSelectedSala(e.target.value);
  const toggleRow = (key) =>
    setExpandedRows((p) => ({ ...p, [key]: !p[key] }));

  /** HELPERS */
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
      .filter((i) => cantidades[i.nombre] > 0)
      .map((i) => `${cantidades[i.nombre]} ${i.nombre}`)
      .join(", ");

  /** RENDERS */
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
        ) : nombre === "ensayo" ? (
          cantidades[selectedEnsayo] > 0 && (
            <span className="resumen-colapsado">
              {cantidades[selectedEnsayo]}{" "}
              {selectedEnsayo.charAt(0).toUpperCase() + selectedEnsayo.slice(1)}
            </span>
          )
        ) : resumenConsumos(data) ? (
          <span className="resumen-colapsado">{resumenConsumos(data)}</span>
        ) : null}
      </td>

      <td className="col-total">${totalCat(data)}</td>
    </tr>
  );

  return (
    <div className="tabla-container mb-6">
      <table className="tabla w-full border border-gray-300">
        <thead>{renderHead()}</thead>
        <tbody>
          {renderRow("ensayo",   ensayoData)}
          {renderRow("birras",   birrasData)}
          {renderRow("alquiler", alquilerData)}
        </tbody>
      </table>
    </div>
  );
}
