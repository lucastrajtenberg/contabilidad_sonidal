import { useState } from "react";
import TablaCliente from "./components/TablaCliente";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function App() {
  /* ---------- estado global ---------- */
  const [clientes, setClientes] = useState([]);
  const [nombres, setNombres] = useState({});
  const [totales, setTotales] = useState({});
  const [fechaSeleccionada, setFechaSeleccionada] = useState(dayjs());

  const addCliente = () => {
    const id = Date.now();
    setClientes((prev) => [...prev, id]);
  };

  const removeCliente = (id) => {
    setClientes((prev) => prev.filter((c) => c !== id));
    setNombres((prev) => {
      const p = { ...prev };
      delete p[id];
      return p;
    });
    setTotales((prev) => {
      const p = { ...prev };
      delete p[id];
      return p;
    });
  };

  const handleNameChange = (id, name) =>
    setNombres((p) => ({ ...p, [id]: name }));

  const handleTotalChange = (id, total) =>
    setTotales((p) => ({ ...p, [id]: total }));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex h-screen">
        {/* NAVBAR */}
        <aside className="w-[20%] p-4 bg-gray-200 flex flex-col gap-4 ">
          <div className="bg-black text-white p-4 rounded-md">
            <div className="flex items-center">
              <img
                src="src/images/sonidal logo icon.png"
                alt="Logo"
                className="w-[100px] h-[100px] object-cover mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold">Sonidal Studio</h1>
                <span className="text-sm text-gray-400">App de contabilidad</span>
              </div>
            </div>
          </div>

          <DatePicker
            label="Fecha"
            value={fechaSeleccionada}
            onChange={(newDate) => setFechaSeleccionada(newDate)}
          />

          <button
            onClick={addCliente}
            className="px-3 py-2 bg-black text-white rounded-md"
          >
            + Añadir cliente
          </button>

          <ul className="flex-1 overflow-y-auto divide-y">
            {clientes.map((id) => (
              <li
                key={id}
                className="flex items-center justify-between py-2 text-sm px-2 gap-2"
              >
                <span className="truncate max-w-[100px] flex-1">
                  {nombres[id] || "Sin nombre"}
                </span>
                <span className="font-mono w-[50px] text-right">
                  ${totales[id]?.toFixed(0) || 0}
                </span>
                <button
                  onClick={() => removeCliente(id)}
                  className="text-red-500 hover:text-red-700 ml-1"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-300 mt-2 p-2 pl-4 text-left text-sm">
            <div>Total del día:</div>
            <div className="font-mono text-lg font-semibold">
              $
              {clientes
                .reduce((acc, id) => acc + (totales[id] || 0), 0)
                .toFixed(0)}
            </div>
          </div>
        </aside>

        {/* PANEL PRINCIPAL */}
        <main className="w-[80%] p-4 space-y-8 overflow-auto bg-linear-to-r">
          {clientes.map((id) => (
            <TablaCliente
              key={id}
              fecha={fechaSeleccionada}
              onNameChange={(name) => handleNameChange(id, name)}
              onTotalChange={(tot) => handleTotalChange(id, tot)}
            />
          ))}
        </main>
      </div>
    </LocalizationProvider>
  );
}
