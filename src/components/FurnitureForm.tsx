import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Link as LinkIcon, Save, X } from 'lucide-react';
import type { Furniture } from '../types';

interface Props {
  onAddFurniture: (f: Furniture) => void;
}

const FurnitureForm: React.FC<Props> = ({ onAddFurniture }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Cama',
    width: 1.5,
    height: 0.5,
    depth: 2,
    imageUrl: '',
    imageFile: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalImageUrl = formData.imageUrl;
    if (formData.imageFile) {
      finalImageUrl = URL.createObjectURL(formData.imageFile);
    }

    const newFurniture: Furniture = {
      id: crypto.randomUUID(),
      name: formData.name,
      width: formData.width,
      height: formData.height,
      depth: formData.depth,
      imageUrl: finalImageUrl || 'https://placehold.co/300x300?text=Mueble',
      position: [0, formData.height / 2, 0],
      rotation: [0, 0, 0],
    };

    onAddFurniture(newFurniture);
    setIsOpen(false);
    // Reset form
    setFormData({
      name: 'Mueble',
      width: 1,
      height: 1,
      depth: 1,
      imageUrl: '',
      imageFile: null,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imageFile: e.target.files[0], imageUrl: '' });
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors shadow-md mt-4"
      >
        <Plus size={18} /> Añadir Mueble
      </button>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-indigo-200 mt-4 overflow-y-auto max-h-[70vh]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">Nuevo Mueble</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nombre</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: Cama, Mesa..."
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Ancho (m)</label>
            <input
              type="number" step="0.01" min="0.01"
              required
              value={formData.width}
              onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value) || 0})}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Alto (m)</label>
            <input
              type="number" step="0.01" min="0.01"
              required
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value) || 0})}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Fondo (m)</label>
            <input
              type="number" step="0.01" min="0.01"
              required
              value={formData.depth}
              onChange={(e) => setFormData({...formData, depth: parseFloat(e.target.value) || 0})}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Imagen del mueble</label>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
              <LinkIcon size={16} className="text-slate-400" />
              <input
                type="url"
                placeholder="URL de imagen"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value, imageFile: null})}
                className="flex-1 bg-transparent text-xs focus:outline-none"
              />
            </div>

            <div className="text-center text-[10px] text-slate-400 font-bold italic">O SUBE UN ARCHIVO</div>

            <label className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 px-4 rounded border-2 border-dashed border-slate-300 cursor-pointer transition-colors">
              <ImageIcon size={16} />
              <span className="text-xs font-medium">{formData.imageFile ? formData.imageFile.name : 'Seleccionar Archivo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors font-bold mt-2"
        >
          <Save size={18} /> Guardar Mueble
        </button>
      </form>
    </div>
  );
};

export default FurnitureForm;
