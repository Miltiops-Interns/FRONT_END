import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PresentationControls,
  useTexture,
  Sphere,
  Html,
} from "@react-three/drei";

function SalonScene() {
  const sphereRef = useRef();
  const [textureError, setTextureError] = useState(false);

  // Using a sample panoramic image from a CDN
  const texture = useTexture(
    {
      map: "/images/hotel_saloni.jpg",
    },
    // Success callback
    () => {
      setTextureError(false);
    },
    // Error callback
    (error) => {
      console.error("Error loading texture:", error);
      setTextureError(true);
    }
  );

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.001;
    }
  });

  if (textureError) {
    return (
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial color="#2C3E50" />
        <Html center>
          <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
            <p>Unable to load the panoramic view.</p>
            <p>Please try again later.</p>
          </div>
        </Html>
      </mesh>
    );
  }

  return (
    <group>
      {/* 360 Panorama Sphere */}
      <Sphere ref={sphereRef} args={[500, 60, 40]} scale={[-1, 1, 1]}>
        <meshBasicMaterial map={texture.map} side={1} toneMapped={false} />
      </Sphere>

      {/* Ambient Lighting */}
      <ambientLight intensity={0.5} />

      {/* Directional Light to simulate sunlight */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Interactive Hotspots */}
      <group>
        {/* Mountain View Hotspot */}
        <mesh
          position={[0, 0, -400]}
          onClick={() => console.log("Mountain View")}
        >
          <sphereGeometry args={[5, 32, 32]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
        </mesh>

        {/* Dining Area Hotspot */}
        <mesh position={[300, 0, 0]} onClick={() => console.log("Dining Area")}>
          <sphereGeometry args={[5, 32, 32]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
        </mesh>

        {/* Lounge Area Hotspot */}
        <mesh
          position={[-300, 0, 0]}
          onClick={() => console.log("Lounge Area")}
        >
          <sphereGeometry args={[5, 32, 32]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

const RestaurantScene = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="restaurant-scene-section">
      <div
        ref={containerRef}
        className={`scene-container ${isVisible ? "visible" : ""}`}
      >
        <div className="scene-content">
          <h2>Experience Our Mountain View Salon</h2>
          <p>
            Take a virtual tour of our elegant salon in Koti, Himachal Pradesh
          </p>
        </div>
        <div className="canvas-container">
          {isLoading ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Loading panoramic view...</p>
            </div>
          ) : (
            <Canvas
              camera={{ position: [0, 0, 0.1], fov: 75 }}
              style={{ background: "transparent" }}
            >
              <SalonScene />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={(Math.PI * 3) / 4}
                rotateSpeed={0.5}
              />
            </Canvas>
          )}
        </div>
        <div className="scene-features">
          <div className={`feature ${isVisible ? "visible" : ""}`}>
            <i className="fas fa-mountain"></i>
            <h3>Panoramic Mountain Views</h3>
            <p>Breathtaking views of the Himalayan ranges from our salon</p>
          </div>
          <div className={`feature ${isVisible ? "visible" : ""}`}>
            <i className="fas fa-glass-cheers"></i>
            <h3>Elegant Interior</h3>
            <p>Luxuriously designed space with modern amenities</p>
          </div>
          <div className={`feature ${isVisible ? "visible" : ""}`}>
            <i className="fas fa-spa"></i>
            <h3>Serene Atmosphere</h3>
            <p>Peaceful environment perfect for relaxation and dining</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantScene;
