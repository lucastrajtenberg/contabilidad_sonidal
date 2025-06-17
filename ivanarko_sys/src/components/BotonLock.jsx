import { useState } from "react";
import useStore from '../store/useStore';
import DesbloqueoModal from "./DesbloqueoModal";

function MiComponente() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const desbloqueado = useStore((s) => s.modoDesbloqueado);

  return (
    <div>
      <button onClick={() => setMostrarModal(true)}>Desbloquear opciones</button>

      {mostrarModal && (
        <DesbloqueoModal onClose={() => setMostrarModal(false)} />
      )}

      <p>Estado de desbloqueo: {desbloqueado ? "✅ Habilitado" : "❌ Bloqueado"}</p>

      {desbloqueado && (
        <div>
          <h4>Zona desbloqueada</h4>
          {/* más componentes o funciones que ahora están disponibles */}
        </div>
      )}
    </div>
  );
}

export default MiComponente;
