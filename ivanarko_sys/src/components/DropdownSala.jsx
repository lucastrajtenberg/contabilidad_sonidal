const DropdownSala = ({ value, onChange }) => (
  <div className="dropdown-wrapper textcolor-black">
    <select className="dropdown-salas" value={value} onChange={onChange}>
      <option value="1">Sala 1</option>
      <option value="2">Sala 2</option>
      <option value="3">Sala 3</option>
    </select>
    <span className="flecha-dropdown">&#9662;</span>
  </div>
);

export default DropdownSala;