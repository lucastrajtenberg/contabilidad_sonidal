import { useState } from "react";
import TablaCliente from "./components/TablaCliente";

export default function App() {
  /* ---------- estado global de clientes ---------- */
  const [clientes, setClientes] = useState([]);        // array de IDs únicos
  const [nombres,  setNombres]  = useState({});        // { id: nombre }
  const [totales,  setTotales]  = useState({});        // { id: total }

  /* ---------- helpers ---------- */
  const addCliente = () => {
    const id = Date.now();               // ID simple
    setClientes((prev) => [...prev, id]);
  };

  const removeCliente = (id) => {
    setClientes((prev) => prev.filter((c) => c !== id));
    setNombres((prev)  => { const p={...prev};  delete p[id]; return p; });
    setTotales((prev)  => { const p={...prev};  delete p[id]; return p; });
  };

  const handleNameChange  = (id, name)  =>
    setNombres((p) => ({ ...p, [id]: name }));

  const handleTotalChange = (id, total) =>
    setTotales((p) => ({ ...p, [id]: total }));

  /* ---------- render ---------- */
  return (
    <div className="flex h-screen">
      {/* NAVBAR 20 % */}
      <aside className="w-[20%] p-4 bg-gray-100 flex flex-col gap-4">
        <button
          onClick={addCliente}
          className="px-3 py-2 bg-blue-600 text-white rounded-md"
        >
          ➕ Añadir cliente
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

      </aside>

      {/* PANEL PRINCIPAL 80 % */}
      <main className="w-[80%] p-4 space-y-8 overflow-auto">
        {clientes.map((id) => (
          <TablaCliente
            key={id}
            onNameChange={(name)  => handleNameChange(id, name)}
            onTotalChange={(tot) => handleTotalChange(id, tot)}
          />
        ))}
      </main>
    </div>
  );
}
