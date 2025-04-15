import React from "react";
import "../styles/detalhesCesta.css"; // se necessário para estilização
import {motion, AnimatePresence } from "framer-motion";

const ExtrasAdicionados = ({ includedExtraItems, removeExtra }) => {
  if (includedExtraItems.length === 0) {
    return <p className="text-gray-500">Nenhum item extra adicionado.</p>;
  }

  return (
    <>
      <h3 className="m-2">Itens Extras Adicionados:</h3>
      <ul className="lista-extras">
      <AnimatePresence>
    {includedExtraItems.map((extra, index) => (
      <motion.li
        key={extra.name + index}
        className="extra-item"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        <span>
          {extra.name} ({extra.count})
        </span>
        <span>R$ {(extra.price * extra.count).toFixed(2)}</span>
        <button
          onClick={() => removeExtra(index)}
          className="remover-extra"
        >
          Remover
        </button>
      </motion.li>
    ))}
  </AnimatePresence>
</ul>
    </>
  );
};

export default ExtrasAdicionados;
