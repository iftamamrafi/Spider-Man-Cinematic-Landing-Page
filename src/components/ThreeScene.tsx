import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Points, PointMaterial, Image } from '@react-three/drei';
import * as THREE from 'three';

const ParticleLayer = () => {
  const count = 1500;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return p;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ff4444" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
};

const RedSun = ({ scrollRef }: { scrollRef: React.RefObject<number> }) => {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const scrollOffset = scrollRef.current || 0;
    
    if (matRef.current) {
      // Gentle pulsing emissive intensity fades as we scroll down
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        2 + Math.sin(state.clock.elapsedTime * 2) * 0.5,
        0.5,
        scrollOffset
      );
    }

    if (meshRef.current) {
      // Sun explodes/expands in size slightly while scrolling down
      const scale = THREE.MathUtils.lerp(1, 4, scrollOffset);
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.position.y = THREE.MathUtils.lerp(0, -5, scrollOffset);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <sphereGeometry args={[4, 64, 64]} />
      <meshStandardMaterial
        ref={matRef}
        color="#000000"
        emissive="#fb1a22"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
};

const AbstractWebs = () => {
  const group = useRef<THREE.Group>(null);
  
  const lines = useMemo(() => {
    const list = [];
    for(let i=0; i<15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const start = new THREE.Vector3(Math.cos(angle)*1.5, Math.sin(angle)*1.5, 0);
      const end = new THREE.Vector3(Math.cos(angle)*10, Math.sin(angle)*10, Math.random() * -5 - 2);
      list.push({ start, end });
    }
    return list;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    // Subtly react to mouse movement (shifting/pulsing)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, state.pointer.x * 0.1, 0.02);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.1, 0.02);
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02 + (Math.abs(state.pointer.x) + Math.abs(state.pointer.y)) * 0.05;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.05);
  });

  return (
    <group ref={group} position={[0,0,-2]}>
      {lines.map((l, i) => {
        const points = [l.start, l.end];
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <primitive key={i} object={new THREE.Line(geom, new THREE.LineBasicMaterial({ color: "#fb1a22", transparent: true, opacity: 0.15 }))} />
        )
      })}
    </group>
  );
};

const SpidermanEyes = () => {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if(!group.current) return;
    // Subtly react to mouse
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, state.pointer.x * 0.5, 0.05);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, state.pointer.y * 0.5, 0.05);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.4, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.4, 0.05);
  });

  return (
    <group ref={group} position={[0, -0.5, -2]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
        {/* Left Eye */}
        <group position={[-0.8, 0, 0]} rotation={[0, 0, 0.3]}>
          <mesh>
            <planeGeometry args={[1.5, 0.8]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
            <mesh position={[0,0,-0.05]}>
              <planeGeometry args={[1.7, 1]} />
              <meshBasicMaterial color="#fb1a22" toneMapped={false} />
            </mesh>
            <mesh position={[0,0,-0.1]} scale={1.1}>
              <planeGeometry args={[1.7, 1]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
          </mesh>
        </group>
        {/* Right Eye */}
        <group position={[0.8, 0, 0]} rotation={[0, 0, -0.3]}>
          <mesh>
            <planeGeometry args={[1.5, 0.8]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
            <mesh position={[0,0,-0.05]}>
              <planeGeometry args={[1.7, 1]} />
              <meshBasicMaterial color="#fb1a22" toneMapped={false} />
            </mesh>
            <mesh position={[0,0,-0.1]} scale={1.1}>
              <planeGeometry args={[1.7, 1]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
          </mesh>
        </group>
      </Float>
    </group>
  );
};

const CameraRig = ({ scrollRef }: { scrollRef: React.RefObject<number> }) => {
  const { camera, pointer } = useThree();
  const vec = new THREE.Vector3();

  useFrame(() => {
    const scrollOffset = scrollRef.current || 0; // value between 0 and 1
    
    // Dolly in on scroll
    const targetZ = THREE.MathUtils.lerp(5, 1, scrollOffset);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    // Parallax mouse effect
    const targetX = pointer.x * (1 - scrollOffset * 0.5); 
    const targetY = pointer.y * (1 - scrollOffset * 0.5);
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02);

    camera.lookAt(0, 0, -10);
  });

  return null;
};

export const SceneContent = ({ scrollRef }: { scrollRef: React.RefObject<number> }) => {
  return (
    <>
      <fog attach="fog" args={['#050510', 5, 20]} />
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      <CameraRig scrollRef={scrollRef} />
      
      {/* City Skyline Background */}
      <Float floatIntensity={0.5} rotationIntensity={0.1} speed={1}>
        <Image 
          url="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop"
          transparent
          opacity={0.15}
          scale={[40, 20]}
          position={[0, 2, -18]}
        />
      </Float>

      {/* Background Sun */}
      <RedSun scrollRef={scrollRef} />
      
      {/* Environment / Spider */}
      <SpidermanEyes />
      <AbstractWebs />
      
      {/* Particles */}
      <ParticleLayer />
    </>
  );
};
