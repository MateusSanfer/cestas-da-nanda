import React from 'react'
import "../styles/detalhesCesta.css";

const SeletorExtras = ({ availableExtras, selectedExtra, setSelectedExtra, addExtra }) => {
  return (
    <div className="mb-4">
    <label>Adicionar Itens Extras:</label>
          <select
            value={selectedExtra ? JSON.stringify(selectedExtra) : ""}
            onChange={(e) =>
              setSelectedExtra(JSON.parse(e.target.value || null))
            }
            className="select-extra"
          >
            <option value="">Selecione um extra</option>
            {availableExtras.map((extra, index) => (
              <option key={index} value={JSON.stringify(extra)}>
                {extra.name} - R$ {extra.price.toFixed(2)}
              </option>
            ))}
          </select>
          <button onClick={addExtra} className="botao-extra">
            Adicionar
          </button>
          </div>
  )
}

export default SeletorExtras