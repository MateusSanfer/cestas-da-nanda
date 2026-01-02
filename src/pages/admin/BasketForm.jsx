import React, { useState, useEffect } from "react";
import axios from "axios";

const initialState = {
  name: "",
  description: "",
  price: "",
  category: "cesta",
  mainImage: "",
  images: [],
  includedItems: [],
  availableExtras: [],
};

const BasketForm = ({ basket, onClose }) => {
  const [formData, setFormData] = useState(initialState);
  const [extra, setExtra] = useState({ name: "", price: "" });
  const [includedItem, setIncludedItem] = useState("");

  useEffect(() => {
    if (basket) {
        // Helper to safe parse JSON
        const safeParse = (data) => {
            if (!data) return [];
            if (Array.isArray(data)) return data;
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error("Error parsing data:", e);
                return [];
            }
        };

        let safeImages = safeParse(basket.images);
        let safeIncludedItems = safeParse(basket.includedItems);
        let safeAvailableExtras = safeParse(basket.availableExtras);

      setFormData({
        ...initialState,
        ...basket,
         // Ensure category is set if existing, or default
        category: basket.category || "cesta", 
        mainImage: basket.image || "",
        images: safeImages,
        includedItems: safeIncludedItems,
        availableExtras: safeAvailableExtras,
      });
    } else {
      setFormData(initialState);
    }
  }, [basket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, key = "mainImage", append = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (append) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      } else {
        setFormData((prev) => ({ ...prev, [key]: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFromArray = (key, index) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const handleAddIncludedItem = () => {
    if (!includedItem.trim()) return;
    setFormData((prev) => ({
      ...prev,
      includedItems: [...prev.includedItems, includedItem.trim()],
    }));
    setIncludedItem("");
  };

  const handleAddExtra = () => {
    if (!extra.name.trim() || !extra.price) return;
    setFormData((prev) => ({
      ...prev,
      availableExtras: [
        ...prev.availableExtras,
        { name: extra.name.trim(), price: parseFloat(extra.price) },
      ],
    }));
    setExtra({ name: "", price: "" });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      image: formData.mainImage,
      images: formData.images,
    };
    
    // Validate Category
    if(!payload.category) payload.category = 'cesta';

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const url = `http://localhost:3001/api/baskets${
        basket ? `/${basket.id}` : ""
      }`;

      // Show loading toast? (Optional, but good UX)
      // toast.loading('Salvando...', { id: 'saving' });

      basket
        ? await axios.put(url, payload, config)
        : await axios.post(url, payload, config);

      // toast.dismiss('saving');
      // toast.success(basket ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      // toast.error("Erro ao salvar produto. Verifique os dados.");
      alert("Erro ao salvar produto. Verifique se preencheu todos os campos corretamente.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-gray-50/50 p-8 rounded-2xl border border-gray-100"
    >
      {/* Dados Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-2">
            <label className="text-sm font-semibold text-charcoal">Nome do Produto</label>
            <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Cesta Amanhecer"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all"
                required
            />
        </div>
        <div className="md:col-span-4 space-y-2">
             <label className="text-sm font-semibold text-charcoal">Categoria</label>
            <div className="relative">
                <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white appearance-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all"
                >
                    <option value="cesta">Cesta</option>
                    <option value="flor">Flores</option>
                    <option value="lembrancinha">Lembrancinhas</option>
                    <option value="kit">Kits</option>
                    <option value="personalizados">Personalizados</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <i className="bi bi-chevron-down text-xs"></i>
                </div>
            </div>
        </div>
      </div>
      
       <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-2">
                <label className="text-sm font-semibold text-charcoal">Preço (R$)</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all"
                    required
                />
            </div>
       </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-charcoal">Descrição Detalhada</label>
        <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva os detalhes e o encanto deste produto..."
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all"
            rows="4"
            required
        />
      </div>

      {/* Upload de Imagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-200">
        <div className="space-y-4">
            <label className="block text-sm font-semibold text-charcoal">📸 Imagem Principal</label>
            <div className="flex items-start gap-4">
                <label className="cursor-pointer bg-white border border-dashed border-gray-300 rounded-xl p-4 hover:border-terracotta hover:bg-orange-50 transition-all flex flex-col items-center justify-center w-32 h-32 text-center text-xs text-gray-500">
                    <i className="bi bi-image text-2xl mb-1 text-gray-400"></i>
                    Upload
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e)}
                    />
                </label>
                {formData.mainImage && (
                <img
                    src={formData.mainImage}
                    alt="Principal"
                    className="w-32 h-32 rounded-xl object-cover shadow-sm border border-gray-100"
                />
                )}
            </div>
        </div>

        <div className="space-y-4">
            <label className="block text-sm font-semibold text-charcoal">🖼️ Galeria (Miniaturas)</label>
            <div className="flex items-start gap-4 flex-wrap">
                 <label className="cursor-pointer bg-white border border-dashed border-gray-300 rounded-xl p-4 hover:border-terracotta hover:bg-orange-50 transition-all flex flex-col items-center justify-center w-24 h-24 text-center text-xs text-gray-500">
                    <i className="bi bi-plus-lg text-2xl mb-1 text-gray-400"></i>
                    Add
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "images", true)}
                    />
                </label>
                {formData.images.map((url, i) => (
                <div key={i} className="relative group w-24 h-24">
                    <img
                    src={url}
                    alt={`Thumb ${i}`}
                    className="w-full h-full object-cover rounded-xl shadow-sm"
                    />
                    <button
                    type="button"
                    onClick={() => removeFromArray("images", i)}
                    className="absolute -top-2 -right-2 bg-white text-red-500 hover:text-red-700 h-6 w-6 rounded-full shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                    <i className="bi bi-x"></i>
                    </button>
                </div>
                ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-200">
            {/* Itens Inclusos */}
            <fieldset>
                <legend className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <i className="bi bi-check2-circle text-terracotta"></i> Itens Inclusos na Cesta
                </legend>
                <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={includedItem}
                    onChange={(e) => setIncludedItem(e.target.value)}
                    placeholder="Ex: 1x Caneca de Porcelana"
                    className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:border-terracotta outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIncludedItem())}
                />
                <button
                    type="button"
                    onClick={handleAddIncludedItem}
                    className="bg-charcoal text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 transition"
                >
                    Add
                </button>
                </div>
                <ul className="space-y-2">
                {formData.includedItems.map((item, i) => (
                    <li key={i} className="flex justify-between items-center bg-white p-2 px-3 rounded-lg border border-gray-100 text-sm">
                    <span className="text-gray-600">{item}</span>
                    <button
                        type="button"
                        onClick={() => removeFromArray("includedItems", i)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                    </li>
                ))}
                </ul>
            </fieldset>

            {/* Itens Extras */}
            <fieldset>
                <legend className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <i className="bi bi-plus-circle text-terracotta"></i> Opções de Extras (Upsell)
                </legend>
                <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={extra.name}
                    onChange={(e) => setExtra((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Item (Ex: Pelúcia)"
                    className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:border-terracotta outline-none"
                />
                <input
                    type="number"
                    value={extra.price}
                    onChange={(e) => setExtra((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="R$"
                    className="w-20 p-2 border border-gray-200 rounded-lg text-sm focus:border-terracotta outline-none"
                />
                <button
                    type="button"
                    onClick={handleAddExtra}
                    className="bg-charcoal text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 transition"
                >
                    Add
                </button>
                </div>
                <ul className="space-y-2">
                {formData.availableExtras.map((ex, i) => (
                    <li key={i} className="flex justify-between items-center bg-white p-2 px-3 rounded-lg border border-gray-100 text-sm">
                    <span className="text-gray-600 font-medium">{ex.name} <span className="text-terracotta ml-1">+ R$ {ex.price.toFixed(2)}</span></span>
                    <button
                        type="button"
                        onClick={() => removeFromArray("availableExtras", i)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                         <i className="bi bi-trash"></i>
                    </button>
                    </li>
                ))}
                </ul>
            </fieldset>
      </div>

      <div className="pt-6 flex justify-end">
        <button
            type="submit"
            className="bg-terracotta text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all transform hover:-translate-y-1 active:translate-y-0 text-lg"
        >
            <i className="bi bi-check-lg mr-2"></i>
            {basket ? "Salvar Alterações" : "Cadastrar Produto"}
        </button>
      </div>
    </form>
  );
};

export default BasketForm;
