import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import RoomModel from './components/RoomModel';
import FurnitureItem from './components/FurnitureItem';
import RoomDesigner from './components/RoomDesigner';
import FurnitureForm from './components/FurnitureForm';
import type { Point, Furniture } from './types';
import { MousePointer2, Box, Info } from 'lucide-react';

const App: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 5, y: 0 },
    { x: 5, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 0 },
  ]);

  const [furnitureList, setFurnitureList] = useState<Furniture[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addFurniture = (f: Furniture) => {
    setFurnitureList([...furnitureList, f]);
    setSelectedId(f.id);
  };

  const updateFurniture = (f: Furniture) => {
    setFurnitureList(furnitureList.map(item => item.id === f.id ? f : item));
  };

  const deleteFurniture = (id: string) => {
    setFurnitureList(furnitureList.filter(item => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Control Panel */}
      <div className="w-80 h-full bg-white shadow-xl flex flex-col z-10">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-black text-indigo-700 uppercase tracking-tighter">HabitArt 3D</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">Diseñador de Interiores</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-700">
              <MousePointer2 size={18} />
              <h2 className="font-bold text-sm uppercase tracking-wide">Dimensiones</h2>
            </div>
            <RoomDesigner onRoomChange={setPoints} />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-700">
              <Box size={18} />
              <h2 className="font-bold text-sm uppercase tracking-wide">Muebles</h2>
            </div>
            <FurnitureForm onAddFurniture={addFurniture} />
          </section>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex items-start gap-2 p-3 bg-white rounded border border-slate-200 shadow-sm">
            <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              <strong>Tips:</strong><br/>
              • Clic y arrastra: Mover mueble.<br/>
              • Esfera Roja: Eliminar.<br/>
              • Esfera Amarilla: Rotar 45°.<br/>
              • Botón derecho ratón: Rotar cámara.<br/>
              • Rueda ratón: Zoom.
            </p>
          </div>
        </div>
      </div>

      {/* Main Viewport - 3D Canvas */}
      <div className="flex-1 relative">
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
            <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-600 shadow-sm border border-white/50">
                Vista 3D Realista
            </div>
            <div className="bg-indigo-600/90 backdrop-blur px-4 py-3 rounded-lg text-white shadow-xl border border-indigo-400 max-w-xs">
                <h4 className="text-sm font-bold mb-1">Optimizador de Espacio</h4>
                <p className="text-[10px] opacity-90 leading-tight">
                    Mueve los muebles para encontrar la mejor distribución. Las dimensiones son reales según tus medidas.
                </p>
            </div>
        </div>

        <Canvas shadows className="bg-gradient-to-br from-slate-200 to-slate-300">
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[5, 8, 5]} fov={50} />
            <OrbitControls
                makeDefault
                enabled={!selectedId || !furnitureList.some(f => f.id === selectedId)}
                maxPolarAngle={Math.PI / 2.1}
            />

            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Environment preset="city" />

            <group position={[0, 0, 0]}>
                <RoomModel points={points} />
                {furnitureList.map(f => (
                <FurnitureItem
                    key={f.id}
                    furniture={f}
                    onUpdate={updateFurniture}
                    onDelete={deleteFurniture}
                    isSelected={selectedId === f.id}
                    onSelect={setSelectedId}
                />
                ))}
            </group>

            <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
          </Suspense>
        </Canvas>

        {selectedId && (
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3 bg-white/90 backdrop-blur p-4 rounded-xl shadow-2xl border border-indigo-100">
                <div className="text-sm font-bold text-indigo-700">Mueble seleccionado</div>
                <button
                    onClick={() => setSelectedId(null)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-wider"
                >
                    Soltar
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;
