// src/components/3d/Anatomy3DViewer.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ShieldCheck, Info, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export interface AnatomicalElement {
  id: string;
  name: string;
  latinName: string;
  role: string;
  functionDescription: string;
  pregnancyChanges: string;
  simpleExplanation: string;
  color: number;
}

export const ANATOMICAL_ELEMENTS: Record<string, AnatomicalElement> = {
  uterus: {
    id: 'uterus',
    name: 'Матка',
    latinName: 'Uterus',
    role: 'Главное вместилище и колыбель плода',
    functionDescription: 'Мощный полый мышечный орган, состоящий из трех слоев: периметрия, миометрия и эндометрия. Обеспечивает защиту плода и изгоняющие сокращения в родах.',
    pregnancyChanges: 'Масса матки увеличивается в 20 раз (с 50 г до 1 000–1 200 г к доношенному сроку), а внутренний объем возрастает в 500 раз (с 5–10 мл до 4–5 литров).',
    simpleExplanation: 'Это невероятный эластичный «домик» из мышц, который бережно растягивается вместе с ростом малыша и защищает его от любых внешних толчков.',
    color: 0xd9777f
  },
  placenta: {
    id: 'placenta',
    name: 'Плацента («Детское место»)',
    latinName: 'Placenta',
    role: 'Автономный орган жизнеобеспечения малыша',
    functionDescription: 'Выполняет функции легких, почек, печени и эндокринной железы плода. Синтезирует прогестерон, эстрогены и ХГЧ, фильтрует токсины через гематоплацентарный барьер.',
    pregnancyChanges: 'Формируется к 12–16 неделям из трофобласта. К 40 неделям достигает диаметра 18–20 см, толщины 2–3 см и веса ~500–600 г.',
    simpleExplanation: 'Это природная «фабрика питания и дыхания». Кровь мамы и малыша никогда не смешиваются напрямую, но через тончайшие мембраны плаценты малыш получает весь кислород и витамины.',
    color: 0x9e2a2b
  },
  fetus: {
    id: 'fetus',
    name: 'Плод (Малыш)',
    latinName: 'Fetus',
    role: 'Развивающийся организм ребенка',
    functionDescription: 'Проходит путь от микроскопической зиготы до зрелого доношенного новорожденного человека с миллионами слаженно работающих клеток.',
    pregnancyChanges: 'Еженедельно осваивает новые навыки: от первых движений на 8-й неделе до дыхательных тренировок, сосания пальчика и различения вкусов к 28-й неделе.',
    simpleExplanation: 'Ваш будущий сын или дочь! Находится в уютной позе эмбриона, слушает биение вашего сердца и растет день ото дня.',
    color: 0xfcb097
  },
  umbilicalCord: {
    id: 'umbilicalCord',
    name: 'Пуповина (Пупочный канатик)',
    latinName: 'Funiculus umbilicalis',
    role: 'Магистраль непрерывного питания и дыхания',
    functionDescription: 'Содержит 1 вену (несущую богатую кислородом артериальную кровь от плаценты к плоду) и 2 артерии (выводящие продукты метаболизма обратно в плаценту). Окружена упругим вартоновым студнем.',
    pregnancyChanges: 'Вартонов студень обладает уникальной упругостью: он не дает пуповине пережаться при шевелениях малыша или узлах. Длина к родам составляет 50–60 см.',
    simpleExplanation: 'Эластичный «шланг жизни». Благодаря особому гелю внутри, пуповина никогда не сдавливается, даже если малыш обнимает ее ручками или крутится.',
    color: 0x38bdf8
  },
  amnioticFluid: {
    id: 'amnioticFluid',
    name: 'Околоплодные воды и амнион',
    latinName: 'Liquor amnii',
    role: 'Идеальная невесомая защитная гидросреда',
    functionDescription: 'Стерильная биологически активная жидкость. Предохраняет плод от механических ударов, обеспечивает свободное движение, постоянную температуру 37°C и созревание легких при заглатывании.',
    pregnancyChanges: 'Полностью обновляется каждые 3 часа! Объем нарастает до 800–1000 мл к 36 неделям, обеспечивая комфорт малыша.',
    simpleExplanation: 'Теплый природный «бассейн», в котором малыш плавает в невесомости. Жидкость защищает от шума, холода и любых прикосновений к животу.',
    color: 0x67e8f9
  },
  cervix: {
    id: 'cervix',
    name: 'Шейка матки',
    latinName: 'Cervix uteri',
    role: 'Надежный замок и входной шлюз',
    functionDescription: 'Нижний сегмент матки с цервикальным каналом, заполненным плотной слизистой пробкой с высоким содержанием лизоцима и антител, блокирующих бактерии.',
    pregnancyChanges: 'Всю беременность остается плотной, длиной не менее 30–35 мм (профилактика преждевременных родов). Перед родами под действием гормонов размягчается, укорачивается и плавно раскрывается до 10 см.',
    simpleExplanation: 'Крепкий защитный «замочек», который держит вход в матку плотно закрытым все 9 месяцев, а в день родов аккуратно открывается, пропуская малыша на свет.',
    color: 0xbe185d
  }
};

export const Anatomy3DViewer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedId, setSelectedId] = useState<string>('uterus');
  const [isRotating, setIsRotating] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const meshesRef = useRef<Record<string, THREE.Mesh>>({});
  const animFrameId = useRef<number | null>(null);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const w = container.clientWidth || 500;
      const h = container.clientHeight || 420;
      const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
      camera.position.set(0, 0, 3.6);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      // Lights
      const ambLight = new THREE.AmbientLight(0xfff5ea, 0.9);
      scene.add(ambLight);
      const d1 = new THREE.DirectionalLight(0xffffff, 1.2);
      d1.position.set(3, 4, 3);
      scene.add(d1);
      const d2 = new THREE.DirectionalLight(0xdceaf0, 0.6);
      d2.position.set(-3, -2, 2);
      scene.add(d2);

      const anatomyGroup = new THREE.Group();
      scene.add(anatomyGroup);
      groupRef.current = anatomyGroup;

      // 1. Uterus Shell
      const uterusGeo = new THREE.SphereGeometry(1.2, 32, 32);
      uterusGeo.scale(1.0, 1.25, 0.95);
      const uterusMat = new THREE.MeshStandardMaterial({
        color: ANATOMICAL_ELEMENTS.uterus.color,
        transparent: true,
        opacity: 0.38,
        roughness: 0.3,
        side: THREE.DoubleSide
      });
      const uterusMesh = new THREE.Mesh(uterusGeo, uterusMat);
      anatomyGroup.add(uterusMesh);
      meshesRef.current.uterus = uterusMesh;

      // 2. Placenta (Upper posterior wall disk)
      const placGeo = new THREE.CylinderGeometry(0.65, 0.7, 0.15, 32);
      placGeo.scale(1.0, 1.0, 0.45);
      const placMat = new THREE.MeshStandardMaterial({
        color: ANATOMICAL_ELEMENTS.placenta.color,
        roughness: 0.5
      });
      const placMesh = new THREE.Mesh(placGeo, placMat);
      placMesh.position.set(0.2, 0.65, -0.45);
      placMesh.rotation.x = Math.PI / 4;
      anatomyGroup.add(placMesh);
      meshesRef.current.placenta = placMesh;

      // 3. Fetus in center
      const fetusGroup = new THREE.Group();
      const fHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 24, 24),
        new THREE.MeshStandardMaterial({ color: ANATOMICAL_ELEMENTS.fetus.color, roughness: 0.4 })
      );
      fHead.position.set(0, -0.4, 0); // Head down
      const fBody = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 24, 24),
        new THREE.MeshStandardMaterial({ color: ANATOMICAL_ELEMENTS.fetus.color, roughness: 0.4 })
      );
      fBody.scale.set(0.9, 1.3, 0.9);
      fBody.position.set(0, 0.05, 0);
      fetusGroup.add(fHead, fBody);
      anatomyGroup.add(fetusGroup);
      meshesRef.current.fetus = fBody;

      // 4. Umbilical Cord
      const cordCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.15, 0.6, -0.35),
        new THREE.Vector3(0.0, 0.3, 0.1),
        new THREE.Vector3(-0.15, 0.15, 0.25),
        new THREE.Vector3(0.0, 0.05, 0.15)
      ]);
      const cordGeo = new THREE.TubeGeometry(cordCurve, 24, 0.045, 12, false);
      const cordMat = new THREE.MeshStandardMaterial({ color: ANATOMICAL_ELEMENTS.umbilicalCord.color, roughness: 0.3 });
      const cordMesh = new THREE.Mesh(cordGeo, cordMat);
      anatomyGroup.add(cordMesh);
      meshesRef.current.umbilicalCord = cordMesh;

      // 5. Amniotic Sac (Inner fluid glow)
      const sacGeo = new THREE.SphereGeometry(1.05, 32, 32);
      sacGeo.scale(0.95, 1.18, 0.9);
      const sacMat = new THREE.MeshPhysicalMaterial({
        color: ANATOMICAL_ELEMENTS.amnioticFluid.color,
        transmission: 0.88,
        transparent: true,
        opacity: 0.22,
        roughness: 0.1,
        depthWrite: false
      });
      const sacMesh = new THREE.Mesh(sacGeo, sacMat);
      anatomyGroup.add(sacMesh);
      meshesRef.current.amnioticFluid = sacMesh;

      // 6. Cervix (Bottom neck)
      const cervixGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.35, 24);
      const cervixMat = new THREE.MeshStandardMaterial({
        color: ANATOMICAL_ELEMENTS.cervix.color,
        roughness: 0.4
      });
      const cervixMesh = new THREE.Mesh(cervixGeo, cervixMat);
      cervixMesh.position.set(0, -1.35, 0);
      anatomyGroup.add(cervixMesh);
      meshesRef.current.cervix = cervixMesh;

      // Drag controls
      const onMouseDown = (e: MouseEvent) => {
        isDragging.current = true;
        prevMouse.current = { x: e.clientX, y: e.clientY };
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !groupRef.current) return;
        const dx = e.clientX - prevMouse.current.x;
        const dy = e.clientY - prevMouse.current.y;
        groupRef.current.rotation.y += dx * 0.009;
        groupRef.current.rotation.x += dy * 0.007;
        prevMouse.current = { x: e.clientX, y: e.clientY };
      };
      const onMouseUp = () => {
        isDragging.current = false;
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
        animFrameId.current = requestAnimationFrame(animate);
        if (isRotating && !isDragging.current && groupRef.current) {
          groupRef.current.rotation.y += 0.006;
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    } catch (err) {
      console.warn('Anatomy 3D WebGL error', err);
    }
  }, []);

  const activeElement = ANATOMICAL_ELEMENTS[selectedId] || ANATOMICAL_ELEMENTS.uterus;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-4xl p-6 sm:p-8 border border-sage-200/80 shadow-soft ${className}`}>
      {/* 3D Visualizer Column */}
      <div className="lg:col-span-7 bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-4 relative overflow-hidden border border-slate-800 text-white flex flex-col justify-between min-h-[420px]">
        {/* Top Controls */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-200">
              Интерактивная 3D-анатомия
            </span>
          </div>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              isRotating ? 'bg-softblue-600 border-softblue-500 text-white' : 'bg-white/10 border-white/20 text-white/80'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>360°</span>
          </button>
        </div>

        {/* 3D Canvas */}
        <div ref={mountRef} className="relative w-full h-[320px] flex items-center justify-center cursor-grab active:cursor-grabbing">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Bottom Anatomy Selectors */}
        <div className="flex flex-wrap gap-1.5 z-10 pt-2 border-t border-white/10">
          {Object.values(ANATOMICAL_ELEMENTS).map((elem) => (
            <button
              key={elem.id}
              onClick={() => setSelectedId(elem.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedId === elem.id
                  ? 'bg-softblue-500 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white/80'
              }`}
            >
              {elem.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Medical Explanation Column */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sage-500 bg-sage-100 px-2.5 py-0.5 rounded-full">
              {activeElement.latinName}
            </span>
          </div>

          <h3 className="text-2xl font-bold font-display text-sage-900 mt-2">
            {activeElement.name}
          </h3>

          <p className="text-xs font-semibold text-softblue-700 mt-1">
            {activeElement.role}
          </p>

          <div className="mt-4 space-y-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-warmbeige-50 border border-warmbeige-200/60">
              <span className="text-[10px] uppercase font-bold text-sage-600 block mb-1">
                Клиническая функция:
              </span>
              <p className="text-sage-800 leading-relaxed">{activeElement.functionDescription}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sage-50 border border-sage-200/60">
              <span className="text-[10px] uppercase font-bold text-sage-600 block mb-1">
                Изменения во время беременности:
              </span>
              <p className="text-sage-800 leading-relaxed">{activeElement.pregnancyChanges}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-softblue-50/70 border border-softblue-200/60">
              <span className="text-[10px] uppercase font-bold text-softblue-800 block mb-1">
                Простыми словами:
              </span>
              <p className="text-softblue-950 leading-relaxed">{activeElement.simpleExplanation}</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-sage-100 flex items-center gap-2 text-[11px] text-sage-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Материалы согласованы с протоколами анатомии человека ВОЗ.</span>
        </div>
      </div>
    </div>
  );
};
