import { useState } from "react";
import useStore from '../store/useStore';

function DesbloqueoModal({ onClose }) {
  const [input, setInput] = useState("");
  const verificarContra = useStore((s) => s.verificarContra);

  const handleSubmit = () => {
    verificarContra(input);
    onClose(); // cerrar el modal
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center"
    }}>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
        <h3>Ingresar contraseña</h3>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <br /><br />
        <button onClick={handleSubmit}>Desbloquear</button>
        <button onClick={onClose} style={{ marginLeft: "10px" }}>Cancelar</button>
      </div>
    </div>
  );
}

export default DesbloqueoModal;
