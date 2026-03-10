import React, { useRef, useState } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { Furniture } from '../types';

interface Props {
  furniture: Furniture;
  onUpdate: (f: Furniture) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const FurnitureItem: React.FC<Props> = ({ furniture, onUpdate, onDelete, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  // Load texture
  const texture = useTexture(furniture.imageUrl);

  // Handlers for drag and drop
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onSelect(furniture.id);
    (e.target as any).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: any) => {
    if (isSelected && e.buttons === 1) {
      e.stopPropagation();
      // Translate mouse point on plane
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const raycaster = e.raycaster;
      const targetPos = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, targetPos);

      // Update position (maintaining furniture above floor)
      onUpdate({
        ...furniture,
        position: [targetPos.x, furniture.height / 2, targetPos.z]
      });
    }
  };

  const rotateFurniture = (e: any) => {
    e.stopPropagation();
    const newRotation: [number, number, number] = [
        furniture.rotation[0],
        furniture.rotation[1] + Math.PI / 4,
        furniture.rotation[2]
    ];
    onUpdate({
        ...furniture,
        rotation: newRotation
    });
  };

  const handlePointerUp = (e: any) => {
    (e.target as any).releasePointerCapture(e.pointerId);
  };

  return (
    <group
      position={furniture.position}
      rotation={furniture.rotation}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[furniture.width, furniture.height, furniture.depth]} />
        {/* Usamos un material por cada cara del cubo */}
        <meshStandardMaterial attach="material-0" map={texture} /> {/* Right */}
        <meshStandardMaterial attach="material-1" map={texture} /> {/* Left */}
        <meshStandardMaterial attach="material-2" map={texture} /> {/* Top */}
        <meshStandardMaterial attach="material-3" map={texture} /> {/* Bottom */}
        <meshStandardMaterial attach="material-4" map={texture} /> {/* Front */}
        <meshStandardMaterial attach="material-5" map={texture} /> {/* Back */}
      </mesh>

      {/* Visual indicator for selection */}
      {(isSelected || hovered) && (
        <mesh position={[0, furniture.height / 2 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.min(furniture.width, furniture.depth) / 3, Math.min(furniture.width, furniture.depth) / 2, 32]} />
          <meshBasicMaterial color={isSelected ? "#4f46e5" : "#6366f1"} transparent opacity={0.5} />
        </mesh>
      )}

      {isSelected && (
        <group position={[0, furniture.height + 0.5, 0]}>
            <mesh onClick={(e) => { e.stopPropagation(); onDelete(furniture.id); }} position={[-0.4, 0, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh onClick={rotateFurniture} position={[0.4, 0, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#fbbf24" />
            </mesh>
        </group>
      )}
    </group>
  );
};

export default FurnitureItem;
