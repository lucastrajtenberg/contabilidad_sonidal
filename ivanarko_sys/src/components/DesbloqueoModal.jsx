import { useState } from "react";
import useStore from '../store/useStore';
import { TextField } from "@mui/material";
import { Button } from '@mui/material';

function DesbloqueoModal({ onClose }) {
  const [input, setInput] = useState("");
  const lockContra = useStore((s) => s.lockContra);
  const lockState = useStore((s) => s.lockState);
  const bloquear = useStore((s) => s.bloquear);
  const desbloquear = useStore((s) => s.desbloquear);

  const [contraIncorrecta, setContraIncorrecta] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input !== lockContra){
      setContraIncorrecta(true);
      bloquear();
      return;
    }
      desbloquear();
    setContraIncorrecta(false);
    onClose()
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center"
    }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
        <TextField error={contraIncorrecta} id="outlined-basic" label="Contraseña" variant="outlined"
          type="password"
          value={input}
          helperText={contraIncorrecta&&"Contraseña incorrecta"}
          onChange={(e) => setInput(e.target.value)}
        />
        <br /><br />
        <Button type="submit"  variant="contained">Ingresar</Button>
        <Button onClick={onClose} style={{ marginLeft: "10px" }} variant="outlined">Cancelar</Button>
      </form>
    </div>
  );
}

export default DesbloqueoModal;