import QtyFlechitas from "./QtyFlechitas";

export default function MinitablaVentas({
  categoria,          // "ensayo" | "birras" | "alquiler"
  data,               // array con { nombre, precio }
  cantidades,         // objeto: { ensayo: {}, birras: {}, alquiler: {} }
  changeQty,          // (categoria, nombre, delta) => void
  // Sólo para la categoría “ensayo”:
  selectedEnsayo,
  onEnsayoChange,
}) {

  const fila = (item) => (
    <tr key={item.nombre}>
      <td>{item.nombre}</td>
      <td>${item.precio}</td>
      <td>
        <QtyFlechitas
          value={cantidades[categoria]?.[item.nombre] || 0}
          onIncrease={() => changeQty(categoria, item.nombre, 1)}
          onDecrease={() => changeQty(categoria, item.nombre, -1)}
        />
      </td>
    </tr>
  );

  /* --- caso especial: “ensayo” ---------------------------------------- */
  if (categoria === "ensayo") {
    const ensayoActual =
      data.find((e) => e.nombre.toLowerCase() === selectedEnsayo) || data[0];
    return (
      <table className="mini-tabla">
        <tbody>
          <tr>
            <td>
              <div className="dropdown-wrapper">
                <select
                  className="dropdown-ventas"
                  value={selectedEnsayo}
                  onChange={onEnsayoChange}
                >
                  {data.map(({ nombre }) => (
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
              <QtyFlechitas
                value={cantidades[categoria]?.[ensayoActual.nombre] || 0}
                onIncrease={() => changeQty(categoria, ensayoActual.nombre, 1)}
                onDecrease={() => changeQty(categoria, ensayoActual.nombre, -1)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  /* --- resto de categorías (“birras”, “alquiler”) --------------------- */
  return (
    <table className="mini-tabla">
      <tbody>{data.map(fila)}</tbody>
    </table>
  );
}
