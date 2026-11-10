import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { matRegistry } from './Materials';

export const Environment: React.FC = () => {
  const torchLight1 = useRef<THREE.PointLight>(null);
  const torchLight2 = useRef<THREE.PointLight>(null);
  const torchLight3 = useRef<THREE.PointLight>(null);

  // Materials
  const terraceMat = matRegistry.get('#4b5563', 0.8, 0.05);
  const wallMat = matRegistry.get('#64748b', 0.85, 0.05);
  const roofMatBlue = matRegistry.get('#1e40af', 0.6, 0.1);
  const roofMatRed = matRegistry.get('#991b1b', 0.6, 0.1);
  const woodMat = matRegistry.get('#5c3818', 0.8, 0.0);
  const goldMat = matRegistry.get('#eab308', 0.3, 0.85);
  const blueBannerMat = matRegistry.get('#1d4ed8', 0.7, 0.05);
  const redBannerMat = matRegistry.get('#b91c1c', 0.7, 0.05);
  const foliageMat = matRegistry.get('#15803d', 0.8, 0.0);
  const foliageLightMat = matRegistry.get('#16a34a', 0.8, 0.0);
  const stoneMat = matRegistry.get('#94a3b8', 0.75, 0.1);
  const waterMat = matRegistry.get('#38bdf8', 0.2, 0.4);
  const flameMat = matRegistry.get('#f97316', 0.1, 0.0);

  // Animate torch flickers
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (torchLight1.current) {
      torchLight1.current.intensity = 1.4 + Math.sin(t * 12) * 0.25 + Math.cos(t * 17) * 0.15;
    }
    if (torchLight2.current) {
      torchLight2.current.intensity = 1.4 + Math.cos(t * 14) * 0.25 + Math.sin(t * 19) * 0.15;
    }
    if (torchLight3.current) {
      torchLight3.current.intensity = 1.2 + Math.sin(t * 15) * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Lower Stone Terrace Platform */}
      <mesh position={[0, -0.6, 0]} material={terraceMat} receiveShadow>
        <boxGeometry args={[11, 1.2, 11]} />
      </mesh>
      {/* Platform Lower Step */}
      <mesh position={[0, -1.4, 0]} material={terraceMat} receiveShadow>
        <boxGeometry args={[12.5, 0.6, 12.5]} />
      </mesh>

      {/* FOREGROUND BANNERS (Left Blue Lion Banner, Right Red Lion Banner) */}
      {/* Left Blue Banner */}
      <group position={[-5.4, 0, 4.6]}>
        {/* Stone Pedestal */}
        <mesh position={[0, 0.2, 0]} material={stoneMat} castShadow>
          <boxGeometry args={[0.5, 0.4, 0.5]} />
        </mesh>
        {/* Wooden Post */}
        <mesh position={[0, 1.8, 0]} material={woodMat} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 3.2, 6]} />
        </mesh>
        {/* Crossbar with Gold Finials */}
        <mesh position={[0, 3.2, 0.15]} rotation={[0, 0, Math.PI / 2]} material={woodMat}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
        </mesh>
        <mesh position={[-0.6, 3.2, 0.15]} material={goldMat}>
          <sphereGeometry args={[0.08, 6, 6]} />
        </mesh>
        <mesh position={[0.6, 3.2, 0.15]} material={goldMat}>
          <sphereGeometry args={[0.08, 6, 6]} />
        </mesh>
        {/* Blue Banner Cloth */}
        <mesh position={[0, 2.1, 0.15]} material={blueBannerMat} castShadow>
          <boxGeometry args={[0.9, 2.0, 0.03]} />
        </mesh>
        {/* Golden Heraldic Lion Crest Emblem on Banner */}
        <group position={[0, 2.2, 0.17]}>
          <mesh material={goldMat}>
            <boxGeometry args={[0.3, 0.38, 0.02]} />
          </mesh>
          <mesh position={[0, -0.22, 0]} material={goldMat}>
            <coneGeometry args={[0.15, 0.2, 4]} />
          </mesh>
        </group>
      </group>

      {/* Right Red Banner */}
      <group position={[5.4, 0, 4.6]}>
        {/* Stone Pedestal */}
        <mesh position={[0, 0.2, 0]} material={stoneMat} castShadow>
          <boxGeometry args={[0.5, 0.4, 0.5]} />
        </mesh>
        {/* Wooden Post */}
        <mesh position={[0, 1.8, 0]} material={woodMat} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 3.2, 6]} />
        </mesh>
        {/* Crossbar with Gold Finials */}
        <mesh position={[0, 3.2, 0.15]} rotation={[0, 0, Math.PI / 2]} material={woodMat}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
        </mesh>
        <mesh position={[-0.6, 3.2, 0.15]} material={goldMat}>
          <sphereGeometry args={[0.08, 6, 6]} />
        </mesh>
        <mesh position={[0.6, 3.2, 0.15]} material={goldMat}>
          <sphereGeometry args={[0.08, 6, 6]} />
        </mesh>
        {/* Red Banner Cloth */}
        <mesh position={[0, 2.1, 0.15]} material={redBannerMat} castShadow>
          <boxGeometry args={[0.9, 2.0, 0.03]} />
        </mesh>
        {/* Golden Lion Crest */}
        <group position={[0, 2.2, 0.17]}>
          <mesh material={goldMat}>
            <boxGeometry args={[0.3, 0.38, 0.02]} />
          </mesh>
          <mesh position={[0, -0.22, 0]} material={goldMat}>
            <coneGeometry args={[0.15, 0.2, 4]} />
          </mesh>
        </group>
      </group>

      {/* BACKGROUND CASTLE FORTRESS & WALLS (Behind Black Kingdom) */}
      <group position={[0, 0, -6.8]}>
        {/* Central Castle Wall */}
        <mesh position={[0, 1.5, 0]} material={wallMat} castShadow receiveShadow>
          <boxGeometry args={[8.5, 3.8, 1.2]} />
        </mesh>

        {/* Arched Castle Gateway Door */}
        <mesh position={[0, 1.1, 0.62]} material={woodMat}>
          <boxGeometry args={[1.5, 2.2, 0.05]} />
        </mesh>
        {/* Arch Stone Frame */}
        <mesh position={[0, 2.3, 0.64]} material={stoneMat}>
          <cylinderGeometry args={[0.85, 0.85, 0.2, 8, 1, false, 0, Math.PI]} />
        </mesh>

        {/* Castle Wall Crenellations */}
        {[-3.6, -2.4, -1.2, 1.2, 2.4, 3.6].map((x) => (
          <mesh key={x} position={[x, 3.6, 0]} material={wallMat} castShadow>
            <boxGeometry args={[0.7, 0.5, 1.25]} />
          </mesh>
        ))}

        {/* Left Watchtower */}
        <group position={[-5.2, 0, 0.4]}>
          <mesh position={[0, 2.4, 0]} material={wallMat} castShadow>
            <cylinderGeometry args={[1.1, 1.2, 5.2, 8]} />
          </mesh>
          {/* Tower Balcony / Battlements */}
          <mesh position={[0, 5.0, 0]} material={stoneMat} castShadow>
            <cylinderGeometry args={[1.3, 1.2, 0.4, 8]} />
          </mesh>
          {/* Blue Cone Roof */}
          <mesh position={[0, 6.1, 0]} material={roofMatBlue} castShadow>
            <coneGeometry args={[1.4, 2.0, 8]} />
          </mesh>
        </group>

        {/* Right Watchtower */}
        <group position={[5.2, 0, 0.4]}>
          <mesh position={[0, 2.4, 0]} material={wallMat} castShadow>
            <cylinderGeometry args={[1.1, 1.2, 5.2, 8]} />
          </mesh>
          {/* Tower Balcony */}
          <mesh position={[0, 5.0, 0]} material={stoneMat} castShadow>
            <cylinderGeometry args={[1.3, 1.2, 0.4, 8]} />
          </mesh>
          {/* Red Cone Roof */}
          <mesh position={[0, 6.1, 0]} material={roofMatRed} castShadow>
            <coneGeometry args={[1.4, 2.0, 8]} />
          </mesh>
        </group>

        {/* Castle Sconce Torches */}
        <group position={[-2.2, 2.4, 0.65]}>
          <mesh material={woodMat}>
            <boxGeometry args={[0.08, 0.4, 0.15]} />
          </mesh>
          <mesh position={[0, 0.22, 0.1]} material={flameMat}>
            <coneGeometry args={[0.09, 0.2, 5]} />
          </mesh>
          <pointLight ref={torchLight1} position={[0, 0.3, 0.2]} color="#ff8833" intensity={1.5} distance={5} />
        </group>

        <group position={[2.2, 2.4, 0.65]}>
          <mesh material={woodMat}>
            <boxGeometry args={[0.08, 0.4, 0.15]} />
          </mesh>
          <mesh position={[0, 0.22, 0.1]} material={flameMat}>
            <coneGeometry args={[0.09, 0.2, 5]} />
          </mesh>
          <pointLight ref={torchLight2} position={[0, 0.3, 0.2]} color="#ff8833" intensity={1.5} distance={5} />
        </group>
      </group>

      {/* Left Guardian Lion Statue on Pedestal (as in reference image) */}
      <group position={[-5.8, 0, -3.2]} rotation={[0, 0.6, 0]}>
        {/* Stone Pedestal */}
        <mesh position={[0, 0.5, 0]} material={stoneMat} castShadow>
          <boxGeometry args={[0.9, 1.0, 1.2]} />
        </mesh>
        {/* Stylized Sitting Lion */}
        <mesh position={[0, 1.2, -0.1]} material={stoneMat} castShadow>
          <boxGeometry args={[0.6, 0.7, 0.7]} />
        </mesh>
        {/* Lion Mane & Head */}
        <mesh position={[0, 1.6, 0.2]} material={stoneMat} castShadow>
          <boxGeometry args={[0.55, 0.55, 0.5]} />
        </mesh>
      </group>

      {/* Waterfall & Stream in Background Left */}
      <group position={[-6.2, 1.5, -6.6]}>
        <mesh position={[0, 0, 0]} material={waterMat}>
          <boxGeometry args={[1.4, 4.0, 0.2]} />
        </mesh>
      </group>

      {/* Low-Poly Pine Trees around the platform */}
      {[
        [-5.8, 0, -0.5, 0.8],
        [-5.9, 0, 1.8, 0.7],
        [5.8, 0, -1.2, 0.9],
        [6.0, 0, 1.4, 0.75],
        [6.2, 0, -3.6, 0.85]
      ].map(([x, y, z, s], idx) => (
        <group key={idx} position={[x, y, z]} scale={[s, s, s]}>
          {/* Trunk */}
          <mesh position={[0, 0.4, 0]} material={woodMat}>
            <cylinderGeometry args={[0.1, 0.14, 0.8, 5]} />
          </mesh>
          {/* 3 Tier Foliage Cones */}
          <mesh position={[0, 1.0, 0]} material={foliageMat} castShadow>
            <coneGeometry args={[0.7, 0.8, 6]} />
          </mesh>
          <mesh position={[0, 1.5, 0]} material={foliageLightMat} castShadow>
            <coneGeometry args={[0.55, 0.7, 6]} />
          </mesh>
          <mesh position={[0, 1.95, 0]} material={foliageMat} castShadow>
            <coneGeometry args={[0.4, 0.6, 6]} />
          </mesh>
        </group>
      ))}

      {/* Corner Torches on Platform */}
      <group position={[-4.8, 0.4, 4.8]}>
        <mesh position={[0, 0.2, 0]} material={stoneMat}>
          <cylinderGeometry args={[0.15, 0.18, 0.4, 6]} />
        </mesh>
        <mesh position={[0, 0.48, 0]} material={flameMat}>
          <coneGeometry args={[0.08, 0.18, 5]} />
        </mesh>
        <pointLight ref={torchLight3} position={[0, 0.6, 0]} color="#f97316" intensity={1.2} distance={3} />
      </group>
    </group>
  );
};
