import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { Point } from '../types';

interface Props {
  points: Point[];
}

const RoomModel: React.FC<Props> = ({ points }) => {
  const wallHeight = 2.5;
  const wallThickness = 0.2;

  // Floor shape
  const floorShape = useMemo(() => {
    const shape = new THREE.Shape();
    if (points.length === 0) return shape;

    shape.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }
    // No cerrar automáticamente si ya se hizo
    return shape;
  }, [points]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Floor */}
      <mesh receiveShadow position={[0, 0, -0.01]}>
        <shapeGeometry args={[floorShape]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Grid helper for scale */}
      <gridHelper args={[20, 20]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} />

      {/* Walls */}
      {points.map((p, i) => {
        if (i === points.length - 1 && points.length > 1) {
            // No dibujar pared desde el ultimo al primer punto a menos que sea necesario,
            // pero normalmente el usuario añade la ultima pared para cerrar.
            return null;
        }

        const nextP = points[i + 1];
        if (!nextP) return null;

        const dx = nextP.x - p.x;
        const dy = nextP.y - p.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        if (length === 0) return null;

        return (
          <mesh
            key={i}
            position={[p.x + dx / 2, p.y + dy / 2, wallHeight / 2]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[length, wallThickness, wallHeight]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        );
      })}
    </group>
  );
};

export default RoomModel;
