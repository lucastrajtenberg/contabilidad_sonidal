import { useState } from "react";
import useStore from '../store/useStore';
import DesbloqueoModal from "./DesbloqueoModal";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

function MiComponente() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const lockState = useStore((s) => s.lockState);
  const bloquear = useStore((s) => s.bloquear);

  return (
    <div className="flex pl-2">
      {lockState&&<p>Bloquear grilla</p>}
      {!lockState&&<p>Desbloquear grilla</p>}
      <button className="flex pl-2" onClick={() => {
        console.log(lockState)
        if (lockState) {
          setMostrarModal(false)
          bloquear();
        } 
        else setMostrarModal(true)
        }}>
          {!lockState ? <LockIcon></LockIcon> : <LockOpenIcon></LockOpenIcon>}</button>
      {mostrarModal && (
        <DesbloqueoModal onClose={() => setMostrarModal(false)} />
      )}
    </div>
  );
}
export default MiComponente;