import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

const Tilt3DCard = ({ children, className = '', tiltMaxAngle = 10, scaleOnHover = 1.02 }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotX = ((mouseY - height / 2) / (height / 2)) * -tiltMaxAngle;
    const rotY = ((mouseX - width / 2) / (width / 2)) * tiltMaxAngle;

    setRotateX(rotX);
    setRotateY(rotY);

    const glareX = (mouseX / width) * 100;
    const glareY = (mouseY / height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        scale: rotateX !== 0 || rotateY !== 0 ? scaleOnHover : 1,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative perspective-1000 overflow-hidden ${className}`}
    >
      {/* Glare specular highlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-20"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

export default Tilt3DCard;
