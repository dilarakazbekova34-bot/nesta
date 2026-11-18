// src/components/3d/Fruit3DViewer.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Info, Sparkles, ShieldCheck } from 'lucide-react';
import { getWeeklyData } from '../../data/pregnancyWeeklyData';

interface Fruit3DViewerProps {
  currentWeek: number;
  className?: string;
}

export const Fruit3DViewer: React.FC<Fruit3DViewerProps> = ({ currentWeek, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRotating, setIsRotating] = useState(true);

  const weeklyData = getWeeklyData(currentWeek);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const fruitGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const w = container.clientWidth || 400;
      const h = container.clientHeight || 320;
      const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
      camera.position.set(0, 0, 3.2);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      rendererRef.current = renderer;

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0xffeedd, 1.3);
      dirLight.position.set(2, 3, 3);
      scene.add(dirLight);

      const fruitGroup = new THREE.Group();
      scene.add(fruitGroup);
      fruitGroupRef.current = fruitGroup;

      buildProceduralFruit(fruitGroup, currentWeek);

      // Mouse drag
      const onMouseDown = (e: MouseEvent) => {
        isDraggingRef.current = true;
        prevMousePos.current = { x: e.clientX, y: e.clientY };
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current || !fruitGroupRef.current) return;
        const dx = e.clientX - prevMousePos.current.x;
        const dy = e.clientY - prevMousePos.current.y;
        fruitGroupRef.current.rotation.y += dx * 0.01;
        fruitGroupRef.current.rotation.x += dy * 0.01;
        prevMousePos.current = { x: e.clientX, y: e.clientY };
      };
      const onMouseUp = () => {
        isDraggingRef.current = false;
      };

      canvas.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      const handleResize = () => {
        if (!container || !camera || !renderer) return;
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', handleResize);

      const animate = () => {
        animFrameIdRef.current = requestAnimationFrame(animate);
        if (isRotating && !isDraggingRef.current && fruitGroupRef.current) {
          fruitGroupRef.current.rotation.y += 0.01;
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    } catch (e) {
      console.warn('Fruit 3D WebGL context error', e);
    }
  }, []);

  useEffect(() => {
    if (fruitGroupRef.current) {
      buildProceduralFruit(fruitGroupRef.current, currentWeek);
    }
  }, [currentWeek]);

  const buildProceduralFruit = (group: THREE.Group, week: number) => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) (child as any).material.dispose();
    }

    if (week <= 8) {
      // Small berry / raspberry / seed
      const berryGeo = new THREE.DodecahedronGeometry(0.55, 2);
      const berryMat = new THREE.MeshStandardMaterial({ color: 0x9e1b32, roughness: 0.35 });
      const berry = new THREE.Mesh(berryGeo, berryMat);
      group.add(berry);
    } else if (week <= 14) {
      // Lime / Lemon
      const limeGeo = new THREE.SphereGeometry(0.65, 32, 32);
      limeGeo.scale(0.85, 1.05, 0.85);
      const limeMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.4 });
      const lime = new THREE.Mesh(limeGeo, limeMat);
      group.add(lime);
    } else if (week <= 18) {
      // Avocado with pit
      const avoGeo = new THREE.SphereGeometry(0.75, 32, 32);
      avoGeo.scale(0.8, 1.2, 0.8);
      const avoMat = new THREE.MeshStandardMaterial({ color: 0x22543d, roughness: 0.5 });
      const avo = new THREE.Mesh(avoGeo, avoMat);
      group.add(avo);
    } else if (week <= 22) {
      // Banana
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-0.7, -0.6, 0),
        new THREE.Vector3(-0.1, -0.1, 0),
        new THREE.Vector3(0.5, 0.3, 0),
        new THREE.Vector3(0.8, 0.7, 0)
      );
      const banGeo = new THREE.TubeGeometry(curve, 32, 0.18, 16, false);
      const banMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 });
      const banana = new THREE.Mesh(banGeo, banMat);
      group.add(banana);
    } else if (week <= 26) {
      // Corn cob
      const cornGeo = new THREE.CylinderGeometry(0.25, 0.22, 1.4, 24);
      const cornMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.45 });
      const corn = new THREE.Mesh(cornGeo, cornMat);
      group.add(corn);
    } else if (week <= 30) {
      // Eggplant / Баклажан
      const eggGeo = new THREE.SphereGeometry(0.8, 32, 32);
      eggGeo.scale(0.7, 1.35, 0.7);
      const eggMat = new THREE.MeshStandardMaterial({ color: 0x4a154b, roughness: 0.25 });
      const egg = new THREE.Mesh(eggGeo, eggMat);

      // Calyx (Green top)
      const calyxGeo = new THREE.ConeGeometry(0.35, 0.4, 6);
      const calyxMat = new THREE.MeshStandardMaterial({ color: 0x2f855a });
      const calyx = new THREE.Mesh(calyxGeo, calyxMat);
      calyx.position.set(0, 1.0, 0);
      calyx.rotation.x = Math.PI;

      group.add(egg, calyx);
    } else if (week <= 34) {
      // Coconut
      const cocoGeo = new THREE.SphereGeometry(0.85, 32, 32);
      cocoGeo.scale(0.9, 1.05, 0.9);
      const cocoMat = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.7 });
      const coco = new THREE.Mesh(cocoGeo, cocoMat);
      group.add(coco);
    } else if (week <= 38) {
      // Papaya
      const papGeo = new THREE.SphereGeometry(0.9, 32, 32);
      papGeo.scale(0.75, 1.3, 0.75);
      const papMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35 });
      const pap = new THREE.Mesh(papGeo, papMat);
      group.add(pap);
    } else {
      // Watermelon
      const wmGeo = new THREE.SphereGeometry(0.95, 32, 32);
      wmGeo.scale(1.0, 1.08, 1.0);
      const wmMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.3 });
      const wm = new THREE.Mesh(wmGeo, wmMat);
      group.add(wm);
    }
  };

  return (
    <div className={`relative bg-gradient-to-br from-warmbeige-100 to-sage-50 rounded-4xl p-6 border border-sage-200/80 shadow-soft overflow-hidden ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-sage-200/60">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-sage-600 bg-white/70 px-2.5 py-1 rounded-full border border-sage-200">
            Сравнение на {currentWeek}-й неделе
          </span>
          <h3 className="text-xl font-bold font-display text-sage-900 mt-2 flex items-center gap-2">
            <span>{weeklyData.fruitEmoji}</span>
            <span>{weeklyData.babyFruitComparison}</span>
          </h3>
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2 rounded-xl border transition-all ${
            isRotating ? 'bg-sage-800 text-white border-sage-800' : 'bg-white text-sage-700 border-sage-200'
          }`}
          title={isRotating ? 'Пауза' : 'Вращать'}
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Canvas */}
      <div ref={mountRef} className="relative w-full h-64 flex items-center justify-center cursor-grab active:cursor-grabbing">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <span className="absolute bottom-2 text-[10px] text-sage-400">Потяните для вращения 360°</span>
      </div>

      {/* Details Card */}
      <div className="mt-2 p-4 rounded-3xl bg-white border border-sage-200/70 shadow-xs space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-sage-50 border border-sage-100">
            <span className="text-[10px] uppercase font-bold text-sage-500 block">Длина плода</span>
            <span className="text-base font-bold text-sage-900">{weeklyData.babyLengthEstimate}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-sage-50 border border-sage-100">
            <span className="text-[10px] uppercase font-bold text-sage-500 block">Вес плода</span>
            <span className="text-base font-bold text-sage-900">{weeklyData.babyWeightEstimate}</span>
          </div>
        </div>

        <p className="text-xs text-sage-600 leading-relaxed pt-1">
          {weeklyData.fetalDevelopment}
        </p>

        <div className="flex items-center gap-1.5 pt-1 text-[11px] text-sage-500">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-600 shrink-0" />
          <span>Сравнение носит визуальный характер и не заменяет медицинскую норму.</span>
        </div>
      </div>
    </div>
  );
};
