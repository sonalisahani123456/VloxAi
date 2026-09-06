import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const Background3D = () => {
  const containerRef = useRef(null);
  const { activeTheme } = useTheme();
  const themeRef = useRef(activeTheme);

  useEffect(() => {
    themeRef.current = activeTheme;
  }, [activeTheme]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Detect low performance environment or reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowEndHardware = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
    const isLowSpec = prefersReducedMotion || isLowEndHardware;

    const particleCount = isLowSpec ? 400 : 2000;

    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    const initialFogColor = new THREE.Color(activeTheme.fogColor || 0x080c14);
    scene.fog = new THREE.FogExp2(initialFogColor, 0.012);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 28);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isLowSpec });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowSpec ? 1 : 2));
    containerRef.current.appendChild(renderer.domElement);

    // Ambient Light with breathing pulse state
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Dynamic Colored Point Lights
    const light1 = new THREE.PointLight(new THREE.Color(activeTheme.primary), 3, 100);
    light1.position.set(-15, 15, 10);
    scene.add(light1);

    const light2 = new THREE.PointLight(new THREE.Color(activeTheme.secondary), 3, 100);
    light2.position.set(15, -15, 10);
    scene.add(light2);

    const light3 = new THREE.PointLight(new THREE.Color(activeTheme.tertiary), 2.5, 100);
    light3.position.set(0, 10, -10);
    scene.add(light3);

    // 3D Grid Plane
    const gridHelper = new THREE.GridHelper(120, 60, new THREE.Color(activeTheme.primary), 0x1e293b);
    gridHelper.position.y = -16;
    gridHelper.material.opacity = 0.45;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Particle Stars Cloud
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const paletteColors = (activeTheme.particles || [0x6366f1, 0x06b6d4, 0xec4899, 0x10b981]).map(
      (hex) => new THREE.Color(hex)
    );

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 110;
      positions[i + 1] = (Math.random() - 0.5) * 110;
      positions[i + 2] = (Math.random() - 0.5) * 110;

      const randomColor = paletteColors[Math.floor(Math.random() * paletteColors.length)];
      colors[i] = randomColor.r;
      colors[i + 1] = randomColor.g;
      colors[i + 2] = randomColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: isLowSpec ? 0.45 : 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Floating 3D Geometries Group
    const polyGroup = new THREE.Group();

    const geoTorusKnot = new THREE.TorusKnotGeometry(4.5, 1.2, 80, 16);
    const matTorusKnot = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeTheme.primary),
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const meshTorusKnot = new THREE.Mesh(geoTorusKnot, matTorusKnot);
    meshTorusKnot.position.set(-16, 6, -6);
    polyGroup.add(meshTorusKnot);

    const geoDodeca = new THREE.DodecahedronGeometry(5, 0);
    const matDodeca = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeTheme.secondary),
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const meshDodeca = new THREE.Mesh(geoDodeca, matDodeca);
    meshDodeca.position.set(18, -4, -8);
    polyGroup.add(meshDodeca);

    const geoIco = new THREE.IcosahedronGeometry(4, 1);
    const matIco = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeTheme.tertiary),
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const meshIco = new THREE.Mesh(geoIco, matIco);
    meshIco.position.set(12, 12, -12);
    polyGroup.add(meshIco);

    scene.add(polyGroup);

    // Parallax mouse & gyroscope tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      if (isLowSpec) return;
      // Limit camera parallax offset strictly to 4-6% max range
      const maxOffset = 0.05;
      mouseX = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * maxOffset;
      mouseY = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * maxOffset;
    };

    const handleOrientation = (e) => {
      if (isLowSpec || !e.gamma || !e.beta) return;
      const maxOffset = 0.05;
      mouseX = (e.gamma / 45) * maxOffset;
      mouseY = (e.beta / 45) * maxOffset;
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Ambient light slow breathing pulse (~8s cycle sine wave)
      const breath = 0.45 + 0.25 * Math.sin((elapsedTime * Math.PI * 2) / 8);
      ambientLight.intensity = breath;

      // Smooth color transitions based on activeTheme
      const targetPrimary = new THREE.Color(themeRef.current.primary);
      const targetSecondary = new THREE.Color(themeRef.current.secondary);
      const targetTertiary = new THREE.Color(themeRef.current.tertiary);
      const targetFog = new THREE.Color(themeRef.current.fogColor || 0x080c14);

      light1.color.lerp(targetPrimary, 0.05);
      light2.color.lerp(targetSecondary, 0.05);
      light3.color.lerp(targetTertiary, 0.05);
      matTorusKnot.color.lerp(targetPrimary, 0.05);
      matDodeca.color.lerp(targetSecondary, 0.05);
      matIco.color.lerp(targetTertiary, 0.05);
      scene.fog.color.lerp(targetFog, 0.05);

      // Smooth parallax interpolation
      if (!isLowSpec) {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        camera.position.x = targetX * 12;
        camera.position.y = 2 - targetY * 12;
        camera.lookAt(0, 0, 0);
      }

      // Rotate particles & polyhedrons
      particles.rotation.y = elapsedTime * (isLowSpec ? 0.015 : 0.03);
      meshTorusKnot.rotation.x = elapsedTime * 0.2;
      meshTorusKnot.rotation.y = elapsedTime * 0.3;
      meshDodeca.rotation.y = elapsedTime * 0.25;
      meshIco.rotation.x = elapsedTime * 0.25;

      gridHelper.position.z = (elapsedTime * 3) % 2;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 bg-cyber-grid overflow-hidden"
      aria-hidden="true"
    />
  );
};

export default Background3D;
