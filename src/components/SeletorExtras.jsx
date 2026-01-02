import React from 'react'
import "../styles/detalhesCesta.css";

const SeletorExtras = ({ availableExtras, selectedExtra, setSelectedExtra, addExtra }) => {
  return (
    <div className="mb-6">
        <label className="block text-sm font-medium text-warmGray mb-2">Adicionar Itens Extras:</label>
        <div className="flex gap-2">
            <div className="relative w-full">
                <select
                    value={selectedExtra ? JSON.stringify(selectedExtra) : ""}
                    onChange={(e) =>
                    setSelectedExtra(JSON.parse(e.target.value || null))
                    }
                    className="w-full appearance-none bg-cream border border-gray-200 text-charcoal py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-colors text-sm"
                >
                    <option value="">Selecione um item especial...</option>
                    {availableExtras.map((extra, index) => (
                    <option key={index} value={JSON.stringify(extra)}>
                        {extra.name} - +R$ {extra.price.toFixed(2)}
                    </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <i className="bi bi-chevron-down text-xs"></i>
                </div>
            </div>
            <button 
                onClick={addExtra} 
                className="bg-transparent border border-terracotta text-terracotta font-semibold px-6 rounded-lg hover:bg-terracotta hover:text-white transition-all whitespace-nowrap"
            >
                Adicionar
            </button>
        </div>
    </div>
  )
}

export default SeletorExtras