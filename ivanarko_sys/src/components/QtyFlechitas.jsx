const QtyFlechitas = ({ value = 0, onIncrease, onDecrease }) => (
  <div className="qty">
    <span className="qty-num">{value}</span>
    <div className="qty-flechas">
      <button onClick={onIncrease}>▲</button>
      <button onClick={onDecrease}>▼</button>
    </div>
  </div>
);

export default QtyFlechitas;
