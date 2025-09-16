import React, { useState, useEffect } from "react";
import axios from "axios";


const initialState = {
  name: "",
  description: "",
  price: "",
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
      setFormData({
        ...initialState,
        ...basket,
        mainImage: basket.image || "",
        images: basket.images || [],
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
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const url = `http://localhost:3001/api/baskets${
        basket ? `/${basket.id}` : ""
      }`;

      basket
        ? await axios.put(url, payload, config)
        : await axios.post(url, payload, config);

      onClose();
    } catch (error) {
      console.error("Erro ao salvar cesta:", error);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 border p-6 rounded-md shadow-sm bg-white"
    >
      <h2 className="text-xl font-bold text-gray-800">
        {basket ? "Editar Cesta" : "Nova Cesta"}
      </h2>

      {/* Nome, descrição, preço */}
      <div className="flex gap-2">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Preço"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descrição"
        className="w-full p-2 border rounded"
        required
      />

      {/* Imagens */}
      <div className="space-y-2">
        <label className="block font-medium">Imagem Principal:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e)}
        />
        {formData.mainImage && (
          <img
            src={formData.mainImage}
            alt="Principal"
            className="h-32 mt-2 rounded object-cover"
          />
        )}

        <label className="block font-medium mt-4">Miniaturas:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "images", true)}
        />
        {formData.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {formData.images.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt={`Thumb ${i}`}
                  className="h-24 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeFromArray("images", i)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded opacity-80 group-hover:opacity-100"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Itens inclusos */}
      <fieldset className="border-t pt-4">
        <legend className="font-semibold mb-2">Itens Inclusos</legend>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={includedItem}
            onChange={(e) => setIncludedItem(e.target.value)}
            placeholder="Ex: 1 x Caneca"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddIncludedItem}
            className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
          >
            Adicionar
          </button>
        </div>
        <ul className="space-y-1">
          {formData.includedItems.map((item, i) => (
            <li
              key={i}
              className="flex justify-between bg-gray-100 p-2 rounded"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeFromArray("includedItems", i)}
                className="text-red-600 hover:underline text-sm"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      {/* Itens Extras */}
      <fieldset className="border-t pt-4">
        <legend className="font-semibold mb-2">Itens Extras</legend>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={extra.name}
            onChange={(e) =>
              setExtra((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Nome do item"
            className="flex-1 p-2 border rounded"
          />
          <input
            type="number"
            value={extra.price}
            onChange={(e) =>
              setExtra((prev) => ({ ...prev, price: e.target.value }))
            }
            placeholder="Preço"
            className="w-24 p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddExtra}
            className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
          >
            Adicionar
          </button>
        </div>
        <ul className="space-y-1">
          {formData.availableExtras.map((extra, i) => (
            <li
              key={i}
              className="flex justify-between bg-gray-100 p-2 rounded"
            >
              <span>
                {extra.name} - R$ {extra.price.toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => removeFromArray("availableExtras", i)}
                className="text-red-600 hover:underline text-sm"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {basket ? "Salvar Alterações" : "Criar Cesta"}
      </button>
    </form>
  );
};

export default BasketForm;
