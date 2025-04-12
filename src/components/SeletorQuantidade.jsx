import React from "react";

const SeletorQuantidade = ({ quantidade, setQuantidade, min = 1 }) => {
  const incrementar = () => {
    setQuantidade(quantidade + 1);
  };

  const diminuir = () => {
    setQuantidade(Math.max(min, quantidade - 1)); // Respeita o mínimo
  };

  return (
    <div className="box-quantidade">
      <button className="setas s1" onClick={diminuir}>
        <i className="bi bi-caret-left-fill"></i>
      </button>
      <input
        type="number"
        name="quantidade"
        id="quantidade"
        min={min}
        value={quantidade}
        onChange={(e) => setQuantidade(parseInt(e.target.value) || min)}
      />
      <button className="setas s2" onClick={incrementar}>
        <i className="bi bi-caret-right-fill"></i>
      </button>
    </div>
  );
};

export default SeletorQuantidade;