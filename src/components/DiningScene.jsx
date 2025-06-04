import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function Steam({ scrollProgress }) {
  const steamRef = useRef();
  const particles = useRef([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize particles
    for (let i = 0; i < 20; i++) {
      particles.current.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          Math.random() * 0.5,
          (Math.random() - 0.5) * 0.3
        ),
        speed: 0.02 + Math.random() * 0.02,
        size: 0.02 + Math.random() * 0.03,
        opacity: 0.3 + Math.random() * 0.3,
      });
    }

    // Mouse move handler
    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Update steam particles
    particles.current.forEach((particle, i) => {
      particle.position.y += particle.speed;
      particle.opacity = 0.3 + Math.sin(time * 2 + i) * 0.2;

      // Reset particle when it reaches the top
      if (particle.position.y > 1) {
        particle.position.y = 0;
        particle.position.x = (Math.random() - 0.5) * 0.3;
        particle.position.z = (Math.random() - 0.5) * 0.3;
      }

      // Apply mouse influence
      particle.position.x +=
        (mousePosition.x * 0.01 - particle.position.x) * 0.01;
      particle.position.z +=
        (mousePosition.y * 0.01 - particle.position.z) * 0.01;
    });

    // Update steam mesh
    if (steamRef.current) {
      steamRef.current.rotation.y = time * 0.2;
      steamRef.current.position.y = -scrollProgress * 2;
    }
  });

  return (
    <group ref={steamRef} position={[0, 0.5, 0]}>
      {particles.current.map((particle, i) => (
        <mesh key={i} position={particle.position} castShadow>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent
            opacity={particle.opacity}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function FoodBowl({ scrollProgress }) {
  const bowlRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { camera } = useThree();

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Smooth floating animation
    const floatOffset = Math.sin(time * 0.5) * 0.1;
    bowlRef.current.position.y = -scrollProgress * 2 + floatOffset;

    // Mouse influence on rotation
    bowlRef.current.rotation.x = mousePosition.y * 0.2;
    bowlRef.current.rotation.y = mousePosition.x * 0.2;

    // Gentle continuous rotation
    bowlRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
  });

  return (
    <group ref={bowlRef}>
      {/* Bowl Base */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={2}
        />
      </mesh>

      {/* Food Content - Butter Chicken */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.45, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#FF4500"
          metalness={0.3}
          roughness={0.7}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Food Details - Chicken Pieces */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, 0.15, z]} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#8B4513"
              metalness={0.3}
              roughness={0.7}
              envMapIntensity={1.5}
            />
          </mesh>
        );
      })}

      {/* Decorative Rim */}
      <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.5, 0.05, 16, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={2}
        />
      </mesh>

      {/* Decorative Patterns */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 0.45;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh
            key={i}
            position={[x, 0.2, z]}
            rotation={[0, angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.1, 0.02, 0.02]} />
            <meshStandardMaterial
              color="#FFD700"
              metalness={0.9}
              roughness={0.1}
              envMapIntensity={2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function DiningScene({ scrollProgress }) {
  const sceneRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const floatOffset = Math.sin(time * 0.5) * 0.1;
    sceneRef.current.position.y = -scrollProgress * 2 + floatOffset;
    sceneRef.current.rotation.x = scrollProgress * 0.1;
    sceneRef.current.rotation.z = scrollProgress * 0.05;
  });

  return (
    <group ref={sceneRef}>
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
        enabled={scrollProgress < 0.1}
      >
        <ambientLight intensity={0.7} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1.2}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Food Bowl and Steam */}
        <FoodBowl scrollProgress={scrollProgress} />
        <Steam scrollProgress={scrollProgress} />

        <Environment preset="sunset" />
      </PresentationControls>
    </group>
  );
}

export default DiningScene;
