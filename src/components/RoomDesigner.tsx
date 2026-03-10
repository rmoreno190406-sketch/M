import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, ArrowDown, ArrowLeft, ArrowUp } from 'lucide-react';
import type { WallSegment, Point } from '../types';

interface Props {
  onRoomChange: (points: Point[]) => void;
}

const RoomDesigner: React.FC<Props> = ({ onRoomChange }) => {
  const [segments, setSegments] = useState<WallSegment[]>([
    { length: 4, direction: 'E' },
    { length: 4, direction: 'S' },
    { length: 4, direction: 'W' },
    { length: 4, direction: 'N' },
  ]);

  useEffect(() => {
    calculatePoints();
  }, [segments]);

  const calculatePoints = () => {
    const points: Point[] = [{ x: 0, y: 0 }];
    let currentX = 0;
    let currentY = 0;

    segments.forEach(seg => {
      if (seg.direction === 'E') currentX += seg.length;
      else if (seg.direction === 'W') currentX -= seg.length;
      else if (seg.direction === 'S') currentY += seg.length;
      else if (seg.direction === 'N') currentY -= seg.length;

      points.push({ x: currentX, y: currentY });
    });

    onRoomChange(points);
  };

  const addSegment = () => {
    const lastDir = segments[segments.length - 1]?.direction;
    let nextDir: 'N' | 'S' | 'E' | 'W' = 'E';
    if (lastDir === 'E') nextDir = 'S';
    else if (lastDir === 'S') nextDir = 'W';
    else if (lastDir === 'W') nextDir = 'N';
    else if (lastDir === 'N') nextDir = 'E';

    setSegments([...segments, { length: 2, direction: nextDir }]);
  };

  const updateSegment = (index: number, field: keyof WallSegment, value: any) => {
    const newSegments = [...segments];
    newSegments[index] = { ...newSegments[index], [field]: value };
    setSegments(newSegments);
  };

  const removeSegment = (index: number) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const getDirIcon = (dir: string) => {
    switch (dir) {
      case 'E': return <ArrowRight size={16} />;
      case 'S': return <ArrowDown size={16} />;
      case 'W': return <ArrowLeft size={16} />;
      case 'N': return <ArrowUp size={16} />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-h-[60vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Diseño de Habitación</h2>
      <p className="text-sm text-slate-600 mb-4">Define las paredes de tu habitación (en metros):</p>

      <div className="space-y-3">
        {segments.map((seg, index) => (
          <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
            <div className="bg-blue-100 p-1 rounded text-blue-600">
              {getDirIcon(seg.direction)}
            </div>
            <select
              value={seg.direction}
              onChange={(e) => updateSegment(index, 'direction', e.target.value)}
              className="bg-white border border-slate-300 rounded px-1 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="E">Derecha</option>
              <option value="S">Abajo</option>
              <option value="W">Izquierda</option>
              <option value="N">Arriba</option>
            </select>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={seg.length}
              onChange={(e) => updateSegment(index, 'length', parseFloat(e.target.value) || 0)}
              className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-500">m</span>
            <button
              onClick={() => removeSegment(index)}
              className="ml-auto text-red-500 hover:bg-red-50 p-1 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={addSegment}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
        >
          <Plus size={18} /> Añadir Pared
        </button>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
        <p className="text-xs text-yellow-700 italic">
          Tip: Asegúrate de que la última pared cierre el polígono o vuelva al punto de inicio (0,0) para mejores resultados.
        </p>
      </div>
    </div>
  );
};

export default RoomDesigner;
