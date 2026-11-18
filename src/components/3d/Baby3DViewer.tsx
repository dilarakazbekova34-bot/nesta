// src/components/3d/Baby3DViewer.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles, 
  Eye, 
  Heart, 
  Brain, 
  Activity, 
  Info,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { WeeklyMilestone, getWeeklyData } from '../../data/pregnancyWeeklyData';

interface Baby3DViewerProps {
  currentWeek: number;
  onWeekChange?: (week: number) => void;
  className?: string;
}

export const Baby3DViewer: React.FC<Baby3DViewerProps> = ({
  currentWeek,
  onWeekChange,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [selectedHotspot, setSelectedHotspot] = useState<{ id: string; title: string; description: string } | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [webglSupported, setWebglSupported] = useState(true);
  const [cameraZoomLevel, setCameraZoomLevel] = useState(1);
  const [viewAngle, setViewAngle] = useState<'front' | 'side' | 'top'>('front');

  const weeklyData = getWeeklyData(currentWeek);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const cordMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    try {
      // 1. Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // 2. Camera setup
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 450;
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
      camera.position.set(0, 0.4, 3.8);
      cameraRef.current = camera;

      // 3. Renderer setup
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      rendererRef.current = renderer;

      // 4. Lights
      const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.85); // Warm ambient
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffeedd, 1.4);
      keyLight.position.set(3, 4, 4);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xdceaf0, 0.7);
      fillLight.position.set(-3, -1, 2);
      scene.add(fillLight);

      const backLight = new THREE.DirectionalLight(0xa8b9a5, 0.9);
      backLight.position.set(0, 3, -4);
      scene.add(backLight);

      // Glowing heart point light
      const heartLight = new THREE.PointLight(0xff4d6d, 1.2, 2.5);
      heartLight.position.set(0, 0.15, 0.2);
      scene.add(heartLight);

      // 5. Build Procedural Anatomical Baby Model
      const modelGroup = new THREE.Group();
      scene.add(modelGroup);
      modelGroupRef.current = modelGroup;

      buildBabyModel(modelGroup, currentWeek);

      // Mouse Drag Interaction for 360 Rotation
      const handleMouseDown = (e: MouseEvent) => {
        isDraggingRef.current = true;
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current || !modelGroupRef.current) return;
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;

        modelGroupRef.current.rotation.y += deltaX * 0.008;
        modelGroupRef.current.rotation.x += deltaY * 0.006;
        // Clamp x rotation to avoid flipping upside down
        modelGroupRef.current.rotation.x = Math.max(-0.8, Math.min(0.8, modelGroupRef.current.rotation.x));

        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (!cameraRef.current) return;
        const newZ = cameraRef.current.position.z + e.deltaY * 0.0025;
        cameraRef.current.position.z = Math.max(1.8, Math.min(6.5, newZ));
        setCameraZoomLevel(Number((4.0 / cameraRef.current.position.z).toFixed(2)));
      };

      // Touch handlers for mobile
      let initialPinchDistance = 0;
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          isDraggingRef.current = true;
          previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2 && cameraRef.current) {
          initialPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1 && isDraggingRef.current && modelGroupRef.current) {
          const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
          const deltaY = e.touches[0].clientY - previousMousePosition.current.y;
          modelGroupRef.current.rotation.y += deltaX * 0.01;
          modelGroupRef.current.rotation.x += deltaY * 0.008;
          previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2 && cameraRef.current && initialPinchDistance > 0) {
          const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          const factor = initialPinchDistance / currentDistance;
          cameraRef.current.position.z = Math.max(1.8, Math.min(6.5, cameraRef.current.position.z * (factor > 1 ? 1.02 : 0.98)));
        }
      };

      const handleTouchEnd = () => {
        isDraggingRef.current = false;
      };

      canvas.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      canvas.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);

      // Handle Resize
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // 6. Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animFrameIdRef.current = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Slow smooth auto-rotation if not being dragged
        if (isAutoRotating && !isDraggingRef.current && modelGroupRef.current) {
          modelGroupRef.current.rotation.y += 0.005;
        }

        // Heartbeat pulsation
        if (heartMeshRef.current) {
          const pulse = 1 + Math.sin(elapsedTime * 6.0) * 0.09;
          heartMeshRef.current.scale.set(pulse, pulse, pulse);
        }

        // Gentle floating amniotic breathing motion
        if (modelGroupRef.current) {
          modelGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.04;
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('wheel', handleWheel);
        canvas.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    } catch (err) {
      console.warn('WebGL is not fully supported in this environment:', err);
      setWebglSupported(false);
    }
  }, []);

  // Update 3D baby model when currentWeek changes
  useEffect(() => {
    if (modelGroupRef.current) {
      buildBabyModel(modelGroupRef.current, currentWeek);
    }
  }, [currentWeek]);

  // Procedural anatomical mesh generation with realistic materials
  const buildBabyModel = (group: THREE.Group, week: number) => {
    // Clear old children
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) {
        if (Array.isArray((child as any).material)) {
          (child as any).material.forEach((m: any) => m.dispose());
        } else {
          (child as any).material.dispose();
        }
      }
    }

    // Material parameters adapted by week
    // Early weeks (4-12) are more translucent rosy/coral; late weeks (28-40) are opaque soft peach with velvet skin
    const skinOpacity = week < 12 ? 0.78 : week < 24 ? 0.90 : 0.98;
    const skinRoughness = week < 16 ? 0.25 : 0.45;
    const skinColor = week < 10 ? 0xffa085 : week < 24 ? 0xffb59b : 0xf7c4af;

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: skinRoughness,
      metalness: 0.05,
      transparent: skinOpacity < 1,
      opacity: skinOpacity,
    });

    // Fetal scale factor based on gestational age
    const scaleFactor = Math.max(0.45, Math.min(1.4, 0.45 + (week / 40) * 0.95));

    // 1. Torso (curled fetal posture)
    const torsoCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, -0.4 * scaleFactor, 0),
      new THREE.Vector3(-0.15 * scaleFactor, -0.1 * scaleFactor, -0.1 * scaleFactor),
      new THREE.Vector3(-0.1 * scaleFactor, 0.25 * scaleFactor, 0),
      new THREE.Vector3(0, 0.45 * scaleFactor, 0.1 * scaleFactor)
    );
    const torsoGeo = new THREE.TubeGeometry(torsoCurve, 32, 0.30 * scaleFactor, 24, false);
    const torsoMesh = new THREE.Mesh(torsoGeo, skinMaterial);
    group.add(torsoMesh);

    // 2. Fetal Head (larger proportion in earlier weeks, characteristic fetal proportions)
    const headScale = (0.42 + (week < 20 ? 0.08 : 0)) * scaleFactor;
    const headGeo = new THREE.SphereGeometry(headScale, 32, 32);
    // Slightly elongate cranium
    headGeo.scale(0.92, 1.08, 1.0);
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headMesh.position.set(0.02 * scaleFactor, 0.65 * scaleFactor, 0.12 * scaleFactor);
    group.add(headMesh);

    // 3. Cute Face features (forehead, nose tip, chin) if week >= 10
    if (week >= 10) {
      const noseGeo = new THREE.SphereGeometry(0.06 * scaleFactor, 16, 16);
      const noseMesh = new THREE.Mesh(noseGeo, skinMaterial);
      noseMesh.position.set(0.02 * scaleFactor, 0.62 * scaleFactor, 0.52 * scaleFactor);
      group.add(noseMesh);

      // Eyelids
      const eyeGeo = new THREE.SphereGeometry(0.045 * scaleFactor, 16, 16);
      const leftEye = new THREE.Mesh(eyeGeo, skinMaterial);
      leftEye.position.set(-0.14 * scaleFactor, 0.68 * scaleFactor, 0.44 * scaleFactor);
      const rightEye = new THREE.Mesh(eyeGeo, skinMaterial);
      rightEye.position.set(0.18 * scaleFactor, 0.68 * scaleFactor, 0.44 * scaleFactor);
      group.add(leftEye, rightEye);
    }

    // 4. Arms & Hands in curled fetal position
    if (week >= 8) {
      const armCurveLeft = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-0.25 * scaleFactor, 0.35 * scaleFactor, 0.05 * scaleFactor),
        new THREE.Vector3(-0.45 * scaleFactor, 0.25 * scaleFactor, 0.2 * scaleFactor),
        new THREE.Vector3(-0.35 * scaleFactor, 0.45 * scaleFactor, 0.35 * scaleFactor),
        new THREE.Vector3(-0.1 * scaleFactor, 0.55 * scaleFactor, 0.38 * scaleFactor)
      );
      const armLeftGeo = new THREE.TubeGeometry(armCurveLeft, 24, 0.09 * scaleFactor, 16, false);
      const armLeftMesh = new THREE.Mesh(armLeftGeo, skinMaterial);
      group.add(armLeftMesh);

      const armCurveRight = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0.25 * scaleFactor, 0.35 * scaleFactor, 0.05 * scaleFactor),
        new THREE.Vector3(0.45 * scaleFactor, 0.25 * scaleFactor, 0.2 * scaleFactor),
        new THREE.Vector3(0.35 * scaleFactor, 0.45 * scaleFactor, 0.35 * scaleFactor),
        new THREE.Vector3(0.1 * scaleFactor, 0.55 * scaleFactor, 0.38 * scaleFactor)
      );
      const armRightGeo = new THREE.TubeGeometry(armCurveRight, 24, 0.09 * scaleFactor, 16, false);
      const armRightMesh = new THREE.Mesh(armRightGeo, skinMaterial);
      group.add(armRightMesh);
    }

    // 5. Legs curled up towards abdomen
    if (week >= 9) {
      const legCurveLeft = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-0.18 * scaleFactor, -0.35 * scaleFactor, -0.05 * scaleFactor),
        new THREE.Vector3(-0.38 * scaleFactor, -0.15 * scaleFactor, 0.25 * scaleFactor),
        new THREE.Vector3(-0.25 * scaleFactor, 0.1 * scaleFactor, 0.35 * scaleFactor),
        new THREE.Vector3(-0.08 * scaleFactor, 0.05 * scaleFactor, 0.38 * scaleFactor)
      );
      const legLeftGeo = new THREE.TubeGeometry(legCurveLeft, 24, 0.12 * scaleFactor, 16, false);
      const legLeftMesh = new THREE.Mesh(legLeftGeo, skinMaterial);
      group.add(legLeftMesh);

      const legCurveRight = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0.18 * scaleFactor, -0.35 * scaleFactor, -0.05 * scaleFactor),
        new THREE.Vector3(0.38 * scaleFactor, -0.15 * scaleFactor, 0.25 * scaleFactor),
        new THREE.Vector3(0.25 * scaleFactor, 0.1 * scaleFactor, 0.35 * scaleFactor),
        new THREE.Vector3(0.08 * scaleFactor, 0.05 * scaleFactor, 0.38 * scaleFactor)
      );
      const legRightGeo = new THREE.TubeGeometry(legCurveRight, 24, 0.12 * scaleFactor, 16, false);
      const legRightMesh = new THREE.Mesh(legRightGeo, skinMaterial);
      group.add(legRightMesh);
    }

    // 6. Beating Heart (Visible internal warm glow)
    const heartGeo = new THREE.SphereGeometry(0.11 * scaleFactor, 24, 24);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xff2a55,
      emissive: 0xff0033,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      transparent: true,
      opacity: 0.92
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(0, 0.18 * scaleFactor, 0.18 * scaleFactor);
    group.add(heartMesh);
    heartMeshRef.current = heartMesh;

    // 7. Umbilical Cord (Twisting spiral vessel)
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.05 * scaleFactor, 0.28 * scaleFactor),
      new THREE.Vector3(0.12 * scaleFactor, -0.15 * scaleFactor, 0.45 * scaleFactor),
      new THREE.Vector3(-0.05 * scaleFactor, -0.35 * scaleFactor, 0.65 * scaleFactor),
      new THREE.Vector3(0.2 * scaleFactor, -0.6 * scaleFactor, 0.85 * scaleFactor),
      new THREE.Vector3(0.35 * scaleFactor, -0.85 * scaleFactor, 1.1 * scaleFactor)
    ]);
    const cordGeo = new THREE.TubeGeometry(cordCurve, 32, 0.055 * scaleFactor, 16, false);
    const cordMat = new THREE.MeshStandardMaterial({
      color: 0x6bb8cc,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85
    });
    const cordMesh = new THREE.Mesh(cordGeo, cordMat);
    group.add(cordMesh);
    cordMeshRef.current = cordMesh;

    // 8. Amniotic Sac boundary bubble (Soft subtle translucent egg)
    const sacGeo = new THREE.SphereGeometry(1.4 * scaleFactor, 32, 32);
    sacGeo.scale(1.0, 1.25, 1.1);
    const sacMat = new THREE.MeshPhysicalMaterial({
      color: 0xdceaf0,
      transmission: 0.95,
      opacity: 0.18,
      transparent: true,
      roughness: 0.1,
      ior: 1.33,
      depthWrite: false
    });
    const sacMesh = new THREE.Mesh(sacGeo, sacMat);
    sacMesh.position.set(0, 0.1 * scaleFactor, 0.1 * scaleFactor);
    group.add(sacMesh);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? -0.4 : 0.4;
    const newZ = cameraRef.current.position.z + factor;
    cameraRef.current.position.z = Math.max(1.8, Math.min(6.5, newZ));
    setCameraZoomLevel(Number((4.0 / cameraRef.current.position.z).toFixed(2)));
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !modelGroupRef.current) return;
    cameraRef.current.position.set(0, 0.4, 3.8);
    modelGroupRef.current.rotation.set(0, 0, 0);
    setIsAutoRotating(true);
    setSelectedHotspot(null);
  };

  const setPresetAngle = (angle: 'front' | 'side' | 'top') => {
    setViewAngle(angle);
    if (!modelGroupRef.current) return;
    setIsAutoRotating(false);
    if (angle === 'front') {
      modelGroupRef.current.rotation.set(0, 0, 0);
    } else if (angle === 'side') {
      modelGroupRef.current.rotation.set(0, Math.PI / 2, 0);
    } else if (angle === 'top') {
      modelGroupRef.current.rotation.set(Math.PI / 4, 0, 0);
    }
  };

  return (
    <div className={`relative bg-gradient-to-b from-softblue-950 via-sage-950 to-sage-900 rounded-4xl overflow-hidden border border-sage-700/50 shadow-soft-xl text-white select-none ${className}`}>
      {/* 3D Canvas / WebGL Mount */}
      <div ref={mountRef} className="relative w-full h-[460px] sm:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        {webglSupported ? (
          <canvas ref={canvasRef} className="w-full h-full block" />
        ) : (
          /* WebGL Fallback */
          <div className="p-8 text-center max-w-md space-y-4">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-softblue-900/60 flex items-center justify-center text-5xl border border-softblue-500/30">
              {weeklyData.fruitEmoji}
            </div>
            <h4 className="text-xl font-bold font-display">Анатомическая модель {currentWeek}-й недели</h4>
            <p className="text-xs text-softblue-200 leading-relaxed">
              Ваш браузер работает в режиме экономии ресурсов. Отображаются клинические параметры и интерактивные данные недели.
            </p>
          </div>
        )}

        {/* 3D Hotspots overlay chips */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 max-w-md">
          {weeklyData.hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => setSelectedHotspot(spot)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-sm ${
                selectedHotspot?.id === spot.id
                  ? 'bg-softblue-500 text-white border-softblue-300 ring-2 ring-softblue-400/40'
                  : 'bg-white/10 hover:bg-white/20 text-softblue-100 border-white/15'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              <span>{spot.title}</span>
            </button>
          ))}
        </div>

        {/* Selected Hotspot Detail Popup Card */}
        {selectedHotspot && (
          <div className="absolute bottom-20 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 bg-slate-900/90 backdrop-blur-xl border border-softblue-400/40 rounded-3xl p-5 shadow-2xl text-white animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-softblue-300 font-bold text-xs">
                <Activity className="w-4 h-4 text-rose-400" />
                <span>Анатомический фокус</span>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-white/60 hover:text-white text-xs px-2 py-0.5 rounded-lg bg-white/10"
              >
                ✕
              </button>
            </div>
            <h4 className="text-base font-bold font-display mt-1 text-white">{selectedHotspot.title}</h4>
            <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">{selectedHotspot.description}</p>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-softblue-300">
              <span>Срок: {currentWeek}-я неделя</span>
              <span className="text-emerald-400 font-semibold">Норма по ВОЗ</span>
            </div>
          </div>
        )}

        {/* View Controls Overlay (Right Side) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {/* Autorotate Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2.5 rounded-2xl backdrop-blur-md border transition-all ${
              isAutoRotating
                ? 'bg-softblue-600/80 text-white border-softblue-400 shadow-md'
                : 'bg-black/30 text-white/70 hover:text-white border-white/10'
            }`}
            title={isAutoRotating ? 'Остановить автовращение' : 'Включить автовращение на 360°'}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom('in')}
            className="p-2.5 rounded-2xl bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/10 text-white/80 hover:text-white transition-colors"
            title="Приблизить"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom('out')}
            className="p-2.5 rounded-2xl bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/10 text-white/80 hover:text-white transition-colors"
            title="Отдалить"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset View */}
          <button
            onClick={handleResetCamera}
            className="p-2.5 rounded-2xl bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/10 text-white/80 hover:text-white transition-colors"
            title="Сбросить угол обзора"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Angle Presets (Bottom Center) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15">
          <button
            onClick={() => setPresetAngle('front')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewAngle === 'front' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Спереди
          </button>
          <button
            onClick={() => setPresetAngle('side')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewAngle === 'side' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Сбоку
          </button>
          <button
            onClick={() => setPresetAngle('top')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewAngle === 'top' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Сверху
          </button>
        </div>

        {/* Interactive hint banner */}
        <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-1.5 text-[11px] text-white/60">
          <span>Вращайте мышью 360°</span>
          <span>•</span>
          <span>Колесико для масштаба</span>
        </div>
      </div>

      {/* Week Timeline Slider & Medical Metrics Bar */}
      <div className="p-6 bg-slate-950/70 border-t border-white/10 backdrop-blur-md space-y-4">
        {/* Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-softblue-200 uppercase tracking-wider">
              Шкала беременности: {currentWeek}-я неделя ({weeklyData.trimester}-й триместр)
            </span>
            <span className="text-xs text-white/70">
              Срок от зачатия: ~{Math.max(1, currentWeek - 2)} нед.
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min="4"
              max="40"
              step="1"
              value={currentWeek}
              onChange={(e) => onWeekChange?.(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-softblue-400"
            />
          </div>

          <div className="flex justify-between text-[10px] text-white/50 px-0.5">
            <span>4 нед (Начало)</span>
            <span>12 нед (I скрининг)</span>
            <span>20 нед (Экватор)</span>
            <span>28 нед (III триместр)</span>
            <span>36 нед</span>
            <span>40 нед (ПДР)</span>
          </div>
        </div>

        {/* Quick Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-softblue-300 block">Размер с плод</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xl">{weeklyData.fruitEmoji}</span>
              <span className="text-xs font-bold text-white truncate">{weeklyData.babyFruitComparison}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-softblue-300 block">Примерный вес</span>
            <div className="text-sm font-bold text-white mt-1">{weeklyData.babyWeightEstimate}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-softblue-300 block">Длина (макушка-пятки)</span>
            <div className="text-sm font-bold text-white mt-1">{weeklyData.babyLengthEstimate}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-softblue-300 block">Сердцебиение</span>
            <div className="text-sm font-bold text-rose-300 mt-1 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              <span>140–160 уд/мин</span>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer as per technical specification */}
        <div className="pt-2 flex items-center gap-2 text-[11px] text-white/60">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            3D-визуализация носит научно-образовательный характер и не заменяет индивидуальное ультразвуковое исследование врача.
          </span>
        </div>
      </div>
    </div>
  );
};
