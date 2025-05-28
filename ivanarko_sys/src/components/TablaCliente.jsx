import { useState, useEffect } from "react";
import "./TablaCliente.css";
import ensayoData from "../data/ensayo.json";
import birrasData from "../data/birras.json";
import alquilerData from "../data/alquiler.json";
import DropdownSala from "./DropdownSala";
import MinitablaVentas from "./MinitablaVentas";

export default function TablaCliente({ onNameChange, onTotalChange }) {
  const [expandedRows, setExpandedRows] = useState({
    ensayo: true,
    birras: false,
    alquiler: false,
  });
  const [selectedEnsayo, setSelectedEnsayo] = useState("ensayo");
  const [selectedSala, setSelectedSala] = useState("1");
  const [cantidades, setCantidades] = useState({});
  const [clienteName, setClienteName] = useState("");

  const handleEnsayoChange = (e) => {
    const nuevoEnsayo = e.target.value;
    setCantidades({ [nuevoEnsayo]: cantidades[nuevoEnsayo] || 0 });
    setSelectedEnsayo(nuevoEnsayo);
  };

  const handleSalaChange = (e) => setSelectedSala(e.target.value);
  const toggleRow = (key) =>
    setExpandedRows((p) => ({ ...p, [key]: !p[key] }));

  const precioDe = (nombre) =>
    [...ensayoData, ...birrasData, ...alquilerData]
      .find((i) => i.nombre === nombre)?.precio || 0;

  const changeQty = (nombre, delta) =>
    setCantidades((prev) => ({
      ...prev,
      [nombre]: Math.max(0, (prev[nombre] || 0) + delta),
    }));

  const totalCat = (lista) => //multiplica todos los consumos posibles * cantidades consumidas
    lista.reduce(
      (acc, item) =>
        acc + precioDe(item.nombre) * (cantidades[item.nombre] || 0),
      0
    );

  const resumenConsumos = (lista) => //muestra el resumen cuando contraes las filas
    lista
      .filter((i) => cantidades[i.nombre] > 0)
      .map((i) => `${cantidades[i.nombre]} ${i.nombre}`)
      .join(", ");

  const totalGeneral = 
    totalCat(ensayoData) + totalCat(birrasData) + totalCat(alquilerData);

  // Efecto para actualizar total al padre
  useEffect(() => {
    onTotalChange && onTotalChange(totalGeneral);
  }, [cantidades, selectedEnsayo]);

  // Efecto para enviar nombre al padre
  const handleNameInput = (e) => {
    const val = e.target.value;
    setClienteName(val);
    onNameChange && onNameChange(val);
  };

  const capitalizeFirst = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);


  const renderHead = () => (
    <tr>
      <th className="col-nombre">
        <form onSubmit={(e) => e.preventDefault()} className="form-nombre">
          <input
            type="text"
            placeholder="Nombre"
            className="input-nombre"
            value={clienteName}
            onChange={handleNameInput}
          />
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
          <span>{capitalizeFirst(nombre)}</span>
          <button className="boton-toggle" onClick={() => toggleRow(nombre)}>
            {expandedRows[nombre] ? "▲" : "▼"}
          </button>
        </div>
      </td>

      <td className="col-ventas">
        {expandedRows[nombre] ? ( //si la categoria no esta colapsada :
          <MinitablaVentas
            categoria={nombre}
            data={data}
            cantidades={cantidades}
            changeQty={changeQty} //cambia cantidades dentro de TablaCliente, respecto de lo clickeado en las flechitas de MinitablaVentas
            selectedEnsayo={selectedEnsayo}
            onEnsayoChange={handleEnsayoChange}
          />
        ) : nombre === "ensayo" ? ( //si la categoria esta colapsada y el nombre es ensayo
          cantidades[selectedEnsayo] > 0 && (
            <span className="resumen-colapsado">
              {cantidades[selectedEnsayo]}{" "}
              {selectedEnsayo.charAt(0).toUpperCase() +
                selectedEnsayo.slice(1)}
            </span>
          )
        ) : resumenConsumos(data) ? ( //si la categoria esta colapsada y el nombre != de ensayo
          <span className="resumen-colapsado">{resumenConsumos(data)}</span>
        ) : null}
      </td>

      <td className="col-total">${totalCat(data)}</td>
    </tr>
  );

  return (
    <div className="tabla-container mb-6">
      <table className="tabla w-full border border-gray-300 ">
        <thead className="text-white-700 uppercase bg-gray-50 dark:bg-black dark:text-white">{renderHead()}</thead>
        <tbody>
          {renderRow("ensayo", ensayoData)}
          {renderRow("birras", birrasData)}
          {renderRow("alquiler", alquilerData)}
        </tbody>
      </table>
      <pre>{JSON.stringify(clienteName, null, 2)}</pre>
      <pre>{JSON.stringify(cantidades, null, 2)}</pre>
      <pre>{JSON.stringify(selectedSala, null, 2)}</pre>
    </div>
  );
}
