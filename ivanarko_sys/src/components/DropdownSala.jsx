const DropdownSala = ({ value, onChange }) => (
  <div className="dropdown-wrapper textcolor-black">
    <select className="dropdown-salas" value={value} onChange={onChange}>
      <option value="1" className="text-black">Sala 1</option>
      <option value="2" className="text-black">Sala 2</option>
      <option value="3" className="text-black">Sala 3</option>
    </select>
    <span className="flecha-dropdown">&#9662;</span>
  </div>
);

export default DropdownSala;