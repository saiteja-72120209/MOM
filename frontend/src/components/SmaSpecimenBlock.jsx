import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, Compass, Shield, Maximize2, Wind, Activity, CheckCircle2, ChevronRight, Gauge } from 'lucide-react';

/**
 * SmaSpecimenBlock: High-fidelity 3D mechanical SMA-actuated thermal ventilation window assembly.
 *
 * Replaces the former transparent spring box with a realistic, dark-graphite mechanical opening panel:
 * - Rectangular graphite outer frame with chamfered stiles, mounting flange, and gasket reveal
 * - Matching inner rectangular sash frame with architectural glazing infill
 * - Top-hung precision mechanical hinges (knuckles, pivot pins, mounting leaves)
 * - Dual kinematic SMA linear actuators that extend pistons dynamically as the panel opens
 * - Smooth continuous idle rotation around vertical axis when not hovered
 * - Smooth hover-actuated opening outward (0° to 60°) around the top hinge axis
 * - Smooth closing and resumption of idle rotation upon cursor exit
 * - Technical HUD overlay displaying calibrated temperature, actuation status, and SMA phase kinetics
 */
export default function SmaSpecimenBlock({
  temperature = 24.5,
  phase = 'Martensite',
  recoveryPct = 0,
  isSimulated = true,
}) {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [panelStatus, setPanelStatus] = useState('CLOSED'); // 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'
  const [currentAngleDeg, setCurrentAngleDeg] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Animation & interaction refs
  const dragStart = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0.20, y: 0.55 });
  const currentRotation = useRef({ x: 0.20, y: 0.55 });
  const targetOpeningAngle = useRef(0.0); // radians (0 to 1.05 rad = ~60 deg)
  const currentOpeningAngle = useRef(0.0);
  const idleSpeed = useRef(0.28);
  const targetIdleSpeed = useRef(0.28);
  const animFrameRef = useRef(null);

  // References to 3D sub-elements that require per-frame kinematic updates
  const kinematicRefs = useRef({
    hingePivotGroup: null,
    assemblyGroup: null,
    leftActuator: null,
    rightActuator: null,
    actuatorIndicatorMat: null,
  });

  // Track hover state into ref for synchronous loop access
  const isHoveredRef = useRef(false);
  isHoveredRef.current = isHovered;

  const isRotatingRef = useRef(true);
  isRotatingRef.current = isRotating;

  const isDraggingRef = useRef(false);
  isDraggingRef.current = isDragging;

  // Handle pointer enter / leave
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    targetOpeningAngle.current = 1.05; // ~60 degrees outward
    targetIdleSpeed.current = 0.0;     // Gradually decelerate idle rotation
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    targetOpeningAngle.current = 0.0;  // Close back flush
    // Idle rotation will re-accelerate once panel reaches near-closed in loop
  }, []);

  // Manual toggle for touch devices or click accessibility
  const handleToggleActuation = useCallback(() => {
    if (targetOpeningAngle.current > 0.1) {
      targetOpeningAngle.current = 0.0;
      setIsHovered(false);
    } else {
      targetOpeningAngle.current = 1.05;
      setIsHovered(true);
      targetIdleSpeed.current = 0.0;
    }
  }, []);

  const handleResetPerspective = useCallback(() => {
    targetRotation.current = { x: 0.20, y: 0.55 };
  }, []);

  const handleToggleRotation = useCallback(() => {
    setIsRotating((prev) => !prev);
  }, []);

  // Mouse / Touch Drag handlers for 3D inspection
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    targetRotation.current.y += dx * 0.007;
    targetRotation.current.x += dy * 0.007;
    targetRotation.current.x = Math.max(-0.6, Math.min(0.8, targetRotation.current.x));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Main Three.js Scene Setup & Kinematics
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Premium Mechanical Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key Light from upper right
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(6, 7, 7);
    scene.add(keyLight);

    // Cool fill light from lower left
    const fillLight = new THREE.DirectionalLight(0xccd5e0, 1.4);
    fillLight.position.set(-6, -4, 5);
    scene.add(fillLight);

    // Crisp rim light from behind to highlight metallic chamfers
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);

    // Subtle front accent light
    const frontLight = new THREE.PointLight(0xffffff, 0.8, 12);
    frontLight.position.set(0, 0, 4.5);
    scene.add(frontLight);

    // 4. Assembly Root Group
    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);
    kinematicRefs.current.assemblyGroup = assemblyGroup;

    // ---------------------------------------------------------
    // MATERIALS PALETTE (Engineering CAD & Realistic Graphite)
    // ---------------------------------------------------------
    // Outer Frame Material: Dark Graphite anodized aluminum
    const outerFrameMat = new THREE.MeshStandardMaterial({
      color: 0x151619,
      metalness: 0.88,
      roughness: 0.28,
    });

    // Outer Flange / Trim Material: Deep charcoal
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x0f1012,
      metalness: 0.82,
      roughness: 0.42,
    });

    // Sash Moving Frame Material: Satin graphite with metallic sheen
    const sashFrameMat = new THREE.MeshStandardMaterial({
      color: 0x1e2024,
      metalness: 0.86,
      roughness: 0.25,
    });

    // Hardware / Hinges / Stainless Clevis Material
    const hardwareMat = new THREE.MeshStandardMaterial({
      color: 0x8a929e,
      metalness: 0.96,
      roughness: 0.18,
    });

    // Piston Rod: Polished mirror titanium / chrome
    const pistonRodMat = new THREE.MeshStandardMaterial({
      color: 0xd6dbe4,
      metalness: 0.98,
      roughness: 0.12,
    });

    // Glazing Material: Architectural smoked ventilation glass
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111316,
      metalness: 0.12,
      roughness: 0.08,
      transmission: 0.38,
      opacity: 0.82,
      transparent: true,
      ior: 1.52,
      reflectivity: 0.65,
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Actuator SMA Core indicator material
    const actuatorIndicatorMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x222222,
      emissiveIntensity: 0.2,
    });
    kinematicRefs.current.actuatorIndicatorMat = actuatorIndicatorMat;

    // Engineering Edge Outline Material (Subtle CAD Wireframe overlay)
    const cadEdgeMat = new THREE.LineBasicMaterial({
      color: 0x767c88,
      transparent: true,
      opacity: 0.55,
      linewidth: 1,
    });

    const subtleCadEdgeMat = new THREE.LineBasicMaterial({
      color: 0x505560,
      transparent: true,
      opacity: 0.35,
      linewidth: 1,
    });

    // Helper: Add CAD wireframe lines to a mesh
    const addCadEdges = (mesh, parent, material = cadEdgeMat) => {
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const line = new THREE.LineSegments(edges, material);
      line.position.copy(mesh.position);
      line.rotation.copy(mesh.rotation);
      line.scale.copy(mesh.scale);
      parent.add(line);
      return line;
    };

    // ---------------------------------------------------------
    // 5. OUTER STATIONARY FRAME
    // Dimensions: Outer width 3.6, Outer height 2.5, Depth 0.32
    // Frame profile thickness: 0.20
    // Opening: width 3.20, height 2.10
    // ---------------------------------------------------------
    const outerFrameGroup = new THREE.Group();
    assemblyGroup.add(outerFrameGroup);

    const frameW = 3.6;
    const frameH = 2.5;
    const frameD = 0.32;
    const profT = 0.20;

    // Top Outer Rail
    const topRailGeo = new THREE.BoxGeometry(frameW, profT, frameD);
    const topRail = new THREE.Mesh(topRailGeo, outerFrameMat);
    topRail.position.set(0, frameH / 2 - profT / 2, 0);
    outerFrameGroup.add(topRail);
    addCadEdges(topRail, outerFrameGroup);

    // Bottom Outer Rail
    const botRailGeo = new THREE.BoxGeometry(frameW, profT, frameD);
    const botRail = new THREE.Mesh(botRailGeo, outerFrameMat);
    botRail.position.set(0, -frameH / 2 + profT / 2, 0);
    outerFrameGroup.add(botRail);
    addCadEdges(botRail, outerFrameGroup);

    // Left Outer Stile
    const stileH = frameH - profT * 2;
    const stileGeo = new THREE.BoxGeometry(profT, stileH, frameD);
    const leftStile = new THREE.Mesh(stileGeo, outerFrameMat);
    leftStile.position.set(-frameW / 2 + profT / 2, 0, 0);
    outerFrameGroup.add(leftStile);
    addCadEdges(leftStile, outerFrameGroup);

    // Right Outer Stile
    const rightStile = new THREE.Mesh(stileGeo, outerFrameMat);
    rightStile.position.set(frameW / 2 - profT / 2, 0, 0);
    outerFrameGroup.add(rightStile);
    addCadEdges(rightStile, outerFrameGroup);

    // Architectural Perimeter Flange (Outer mounting lip extending 0.08)
    const flangeThickness = 0.04;
    const flangeW = frameW + 0.16;
    const flangeH = frameH + 0.16;
    const flangeDepth = 0.06;

    const flangeTopGeo = new THREE.BoxGeometry(flangeW, 0.08, flangeDepth);
    const flangeTop = new THREE.Mesh(flangeTopGeo, trimMat);
    flangeTop.position.set(0, frameH / 2 + 0.04, -frameD / 2 + flangeDepth / 2);
    outerFrameGroup.add(flangeTop);

    const flangeBotGeo = new THREE.BoxGeometry(flangeW, 0.08, flangeDepth);
    const flangeBot = new THREE.Mesh(flangeBotGeo, trimMat);
    flangeBot.position.set(0, -frameH / 2 - 0.04, -frameD / 2 + flangeDepth / 2);
    outerFrameGroup.add(flangeBot);

    const flangeSideGeo = new THREE.BoxGeometry(0.08, frameH, flangeDepth);
    const flangeLeft = new THREE.Mesh(flangeSideGeo, trimMat);
    flangeLeft.position.set(-frameW / 2 - 0.04, 0, -frameD / 2 + flangeDepth / 2);
    outerFrameGroup.add(flangeLeft);

    const flangeRight = new THREE.Mesh(flangeSideGeo, trimMat);
    flangeRight.position.set(frameW / 2 + 0.04, 0, -frameD / 2 + flangeDepth / 2);
    outerFrameGroup.add(flangeRight);

    // Weatherstrip Seal Rim (Inner gasket stop on frame interior)
    const gasketGeo = new THREE.BoxGeometry(frameW - profT * 2 + 0.02, 0.04, 0.04);
    const gasketMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.95 });
    const topGasket = new THREE.Mesh(gasketGeo, gasketMat);
    topGasket.position.set(0, frameH / 2 - profT + 0.01, -0.06);
    outerFrameGroup.add(topGasket);

    // Corner Gussets / Reinforcement Plates
    const gussetMat = new THREE.MeshStandardMaterial({ color: 0x33373e, metalness: 0.9, roughness: 0.3 });
    const gussetGeo = new THREE.BoxGeometry(0.12, 0.12, 0.04);
    [
      [-frameW / 2 + profT + 0.06, frameH / 2 - profT - 0.06],
      [frameW / 2 - profT - 0.06, frameH / 2 - profT - 0.06],
      [-frameW / 2 + profT + 0.06, -frameH / 2 + profT + 0.06],
      [frameW / 2 - profT - 0.06, -frameH / 2 + profT + 0.06],
    ].forEach(([gx, gy]) => {
      const gusset = new THREE.Mesh(gussetGeo, gussetMat);
      gusset.position.set(gx, gy, 0);
      outerFrameGroup.add(gusset);
    });

    // ---------------------------------------------------------
    // 6. TOP MECHANICAL HINGES
    // Hinge Pivot Axis: horizontal along X at top of opening
    // y_pivot = 1.05, z_pivot = 0.08
    // ---------------------------------------------------------
    const yPivot = frameH / 2 - profT - 0.02; // ~1.03
    const zPivot = 0.08;

    const hingeGroup = new THREE.Group();
    outerFrameGroup.add(hingeGroup);

    const hingePositions = [-1.18, 1.18];
    hingePositions.forEach((hx) => {
      // Hinge Barrel (Horizontal cylinder along X)
      const barrelGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.22, 18);
      const barrel = new THREE.Mesh(barrelGeo, hardwareMat);
      barrel.rotation.z = Math.PI / 2;
      barrel.position.set(hx, yPivot, zPivot);
      hingeGroup.add(barrel);
      addCadEdges(barrel, hingeGroup, subtleCadEdgeMat);

      // Frame-side mounting leaf
      const leafGeo = new THREE.BoxGeometry(0.18, 0.12, 0.04);
      const leaf = new THREE.Mesh(leafGeo, hardwareMat);
      leaf.position.set(hx, yPivot + 0.07, zPivot - 0.02);
      hingeGroup.add(leaf);

      // Stainless Pivot Pin end caps
      const pinEndGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.24, 16);
      const pin = new THREE.Mesh(pinEndGeo, pistonRodMat);
      pin.rotation.z = Math.PI / 2;
      pin.position.set(hx, yPivot, zPivot);
      hingeGroup.add(pin);
    });

    // ---------------------------------------------------------
    // 7. HINGED MOVING PANEL (SASH & GLAZING)
    // Placed inside hingePivotGroup situated exactly at the pivot axis (0, yPivot, zPivot)
    // Rotating hingePivotGroup.rotation.x opens the panel outward!
    // ---------------------------------------------------------
    const hingePivotGroup = new THREE.Group();
    hingePivotGroup.position.set(0, yPivot, zPivot);
    assemblyGroup.add(hingePivotGroup);
    kinematicRefs.current.hingePivotGroup = hingePivotGroup;

    // Moving Sash Dimensions
    const sashW = 3.14; // Clearance 0.03 from opening edge (3.20)
    const sashH = 2.04;
    const sashD = 0.18;
    const sashProfT = 0.16;

    // Sash local coordinates relative to hinge pivot:
    // Hinge pivot is at the top front edge of the sash.
    // Sash top rail is at local y = -sashProfT / 2
    // Sash bottom rail is at local y = -sashH + sashProfT / 2
    // Center Z is local z = -sashD / 2 = -0.09
    const sashTopRailGeo = new THREE.BoxGeometry(sashW, sashProfT, sashD);
    const sashTopRail = new THREE.Mesh(sashTopRailGeo, sashFrameMat);
    sashTopRail.position.set(0, -sashProfT / 2, -sashD / 2);
    hingePivotGroup.add(sashTopRail);
    addCadEdges(sashTopRail, hingePivotGroup);

    const sashBotRailGeo = new THREE.BoxGeometry(sashW, sashProfT, sashD);
    const sashBotRail = new THREE.Mesh(sashBotRailGeo, sashFrameMat);
    sashBotRail.position.set(0, -sashH + sashProfT / 2, -sashD / 2);
    hingePivotGroup.add(sashBotRail);
    addCadEdges(sashBotRail, hingePivotGroup);

    const sashStileH = sashH - sashProfT * 2;
    const sashStileGeo = new THREE.BoxGeometry(sashProfT, sashStileH, sashD);

    const sashLeftStile = new THREE.Mesh(sashStileGeo, sashFrameMat);
    sashLeftStile.position.set(-sashW / 2 + sashProfT / 2, -sashH / 2, -sashD / 2);
    hingePivotGroup.add(sashLeftStile);
    addCadEdges(sashLeftStile, hingePivotGroup);

    const sashRightStile = new THREE.Mesh(sashStileGeo, sashFrameMat);
    sashRightStile.position.set(sashW / 2 - sashProfT / 2, -sashH / 2, -sashD / 2);
    hingePivotGroup.add(sashRightStile);
    addCadEdges(sashRightStile, hingePivotGroup);

    // Architectural Smoked Glass Infill Panel
    const glassW = sashW - sashProfT * 2;
    const glassH = sashStileH;
    const glassGeo = new THREE.BoxGeometry(glassW, glassH, 0.035);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, -sashH / 2, -sashD / 2);
    glassMesh.renderOrder = 3;
    hingePivotGroup.add(glassMesh);

    // Glass perimeter CAD rim
    addCadEdges(glassMesh, hingePivotGroup, subtleCadEdgeMat);

    // Sash Bottom Aerodynamic Extrusion Lip
    const dripLipGeo = new THREE.BoxGeometry(sashW + 0.04, 0.04, 0.06);
    const dripLip = new THREE.Mesh(dripLipGeo, hardwareMat);
    dripLip.position.set(0, -sashH - 0.02, -sashD / 2 + 0.02);
    hingePivotGroup.add(dripLip);

    // Sash-side hinge mounting leaves
    hingePositions.forEach((hx) => {
      const sashLeafGeo = new THREE.BoxGeometry(0.18, 0.12, 0.04);
      const sashLeaf = new THREE.Mesh(sashLeafGeo, hardwareMat);
      sashLeaf.position.set(hx, -0.06, -0.02);
      hingePivotGroup.add(sashLeaf);
    });

    // ---------------------------------------------------------
    // 8. DUAL KINEMATIC SMA LINEAR ACTUATORS
    // Mounted on Left and Right jambs inside the frame.
    // Frame Anchor: stationary point on outer frame jamb.
    // Sash Clevis: moving point attached to sash stile.
    // As the window panel opens, pistons extend smoothly and cylinders pivot!
    // ---------------------------------------------------------
    function createActuatorAssembly(sideX) {
      // Container group for actuator base attached to frame
      const actuatorGroup = new THREE.Group();
      assemblyGroup.add(actuatorGroup);

      // Frame Mount Bracket attached to jamb stile
      const bracketGeo = new THREE.BoxGeometry(0.08, 0.14, 0.12);
      const bracket = new THREE.Mesh(bracketGeo, hardwareMat);
      const frameMountPos = new THREE.Vector3(sideX, -0.22, -0.04);
      bracket.position.copy(frameMountPos);
      actuatorGroup.add(bracket);

      // Pivot trunnion / base knuckle
      const trunnionGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.08, 14);
      const trunnion = new THREE.Mesh(trunnionGeo, hardwareMat);
      trunnion.rotation.z = Math.PI / 2;
      trunnion.position.copy(frameMountPos);
      actuatorGroup.add(trunnion);

      // Actuator Main Cylinder Body Group (rotates towards sash clevis)
      const cylinderArmGroup = new THREE.Group();
      cylinderArmGroup.position.copy(frameMountPos);
      actuatorGroup.add(cylinderArmGroup);

      // Cylinder Body (Dark titanium/graphite sleeve)
      const bodyRadius = 0.042;
      const bodyLength = 0.52;
      const cylinderGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyLength, 16);
      // Offset so base is at the pivot point
      cylinderGeo.translate(0, bodyLength / 2, 0);
      const cylinderMesh = new THREE.Mesh(cylinderGeo, outerFrameMat);
      cylinderArmGroup.add(cylinderMesh);
      addCadEdges(cylinderMesh, cylinderArmGroup, subtleCadEdgeMat);

      // Cylinder Collar / Machined Ring (Nitinol SMA indicator band)
      const collarGeo = new THREE.CylinderGeometry(bodyRadius + 0.006, bodyRadius + 0.006, 0.12, 16);
      collarGeo.translate(0, bodyLength * 0.55, 0);
      const collarMesh = new THREE.Mesh(collarGeo, actuatorIndicatorMat);
      cylinderArmGroup.add(collarMesh);

      // Extending Chrome Piston Rod
      const rodRadius = 0.022;
      const defaultRodLen = 0.70;
      const rodGeo = new THREE.CylinderGeometry(rodRadius, rodRadius, defaultRodLen, 16);
      rodGeo.translate(0, defaultRodLen / 2, 0);
      const rodMesh = new THREE.Mesh(rodGeo, pistonRodMat);
      rodMesh.position.set(0, bodyLength - 0.02, 0);
      cylinderArmGroup.add(rodMesh);

      // Sash-side Clevis Attachment Point
      // Local position on the moving sash:
      const sashLocalAttachment = new THREE.Vector3(sideX, -1.18, -sashD / 2);

      const sashClevisGeo = new THREE.BoxGeometry(0.06, 0.10, 0.08);
      const sashClevis = new THREE.Mesh(sashClevisGeo, hardwareMat);
      sashClevis.position.copy(sashLocalAttachment);
      hingePivotGroup.add(sashClevis);

      return {
        frameMountPos,
        cylinderArmGroup,
        rodMesh,
        bodyLength,
        sashLocalAttachment,
      };
    }

    const leftActuator = createActuatorAssembly(-1.46);
    const rightActuator = createActuatorAssembly(1.46);
    kinematicRefs.current.leftActuator = leftActuator;
    kinematicRefs.current.rightActuator = rightActuator;

    // ---------------------------------------------------------
    // 9. SUBTLE ENGINEERING TICK MARKS & CAD GROUND ACCENT
    // ---------------------------------------------------------
    const groundGrid = new THREE.GridHelper(5.2, 12, 0x333333, 0x141414);
    groundGrid.position.y = -frameH / 2 - 0.35;
    groundGrid.material.transparent = true;
    groundGrid.material.opacity = 0.35;
    scene.add(groundGrid);

    // Frame Corner Registration Marks
    const crosshairGeo = new THREE.BufferGeometry();
    const chVerts = [];
    const chS = 0.12;
    [
      [-frameW / 2 - 0.14, frameH / 2 + 0.14],
      [frameW / 2 + 0.14, frameH / 2 + 0.14],
      [-frameW / 2 - 0.14, -frameH / 2 - 0.14],
      [frameW / 2 + 0.14, -frameH / 2 - 0.14],
    ].forEach(([cx, cy]) => {
      chVerts.push(cx - chS, cy, 0, cx + chS, cy, 0);
      chVerts.push(cx, cy - chS, 0, cx, cy + chS, 0);
    });
    crosshairGeo.setAttribute('position', new THREE.Float32BufferAttribute(chVerts, 3));
    const crosshairs = new THREE.LineSegments(crosshairGeo, new THREE.LineBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.5 }));
    assemblyGroup.add(crosshairs);

    // ---------------------------------------------------------
    // 10. RESIZE LISTENER
    // ---------------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // ---------------------------------------------------------
    // 11. ANIMATION & KINEMATICS RENDER LOOP
    // ---------------------------------------------------------
    let lastTime = performance.now();
    let statusUpdateThrottle = 0;

    const animate = (time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // A. Smooth Interpolation of Opening Angle (0 to ~1.05 rad)
      const prevAngle = currentOpeningAngle.current;
      currentOpeningAngle.current += (targetOpeningAngle.current - currentOpeningAngle.current) * 0.065;
      const currentAng = currentOpeningAngle.current;

      // Update Panel Hinge Rotation:
      // Negative rotation around X swings the bottom forward (+Z) outward!
      if (hingePivotGroup) {
        hingePivotGroup.rotation.x = -currentAng;
      }

      // Update Actuator Kinematics (Dual hydraulic/SMA cylinders)
      const updateKinematicActuator = (actuator) => {
        if (!actuator) return;
        const { frameMountPos, cylinderArmGroup, rodMesh, bodyLength, sashLocalAttachment } = actuator;

        // Calculate world-space / assembly-space position of sash clevis
        // Sash clevis rotates around (0, yPivot, zPivot) by -currentAng
        const dy = sashLocalAttachment.y;
        const dz = sashLocalAttachment.z;
        const cosA = Math.cos(-currentAng);
        const sinA = Math.sin(-currentAng);

        const sashWorldY = yPivot + (dy * cosA - dz * sinA);
        const sashWorldZ = zPivot + (dy * sinA + dz * cosA);
        const sashTarget = new THREE.Vector3(sashLocalAttachment.x, sashWorldY, sashWorldZ);

        // Vector from frame mount to sash attachment
        const dir = new THREE.Vector3().subVectors(sashTarget, frameMountPos);
        const totalDist = dir.length();

        // Orient cylinderArmGroup to point towards sashTarget
        cylinderArmGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

        // Update piston rod length and position
        const visibleRodLen = Math.max(0.15, totalDist - bodyLength);
        rodMesh.scale.set(1, visibleRodLen / 0.70, 1);
      };

      updateKinematicActuator(leftActuator);
      updateKinematicActuator(rightActuator);

      // B. Idle Rotation Speed Interpolation
      // When hovered, decelerate to 0; when closed and not hovered, resume idle rotation
      if (isHoveredRef.current) {
        targetIdleSpeed.current = 0.0;
      } else {
        // Only re-accelerate idle rotation once panel is nearly closed
        if (currentAng < 0.08) {
          targetIdleSpeed.current = 0.28;
        }
      }
      idleSpeed.current += (targetIdleSpeed.current - idleSpeed.current) * 0.04;

      // Apply continuous idle rotation if enabled and not actively dragging
      if (isRotatingRef.current && !isDraggingRef.current) {
        targetRotation.current.y += delta * idleSpeed.current;
      }

      // C. Smooth Perspective Rotation Damping
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      assemblyGroup.rotation.y = currentRotation.current.y;

      // Subtle mechanical floating motion (subtle pitch & levitation)
      const floatOffsetY = Math.sin(time * 0.0014) * 0.045;
      const floatTiltX = Math.sin(time * 0.0011) * 0.015;
      assemblyGroup.position.y = floatOffsetY;
      assemblyGroup.rotation.x = currentRotation.current.x + floatTiltX;

      // D. Periodic React UI Status Update (throttled for high FPS)
      statusUpdateThrottle += delta;
      if (statusUpdateThrottle > 0.08) {
        statusUpdateThrottle = 0;
        const angleDeg = (currentAng * (180 / Math.PI));
        setCurrentAngleDeg(Math.round(angleDeg * 10) / 10);

        if (targetOpeningAngle.current > 0.5) {
          if (currentAng >= 0.95) {
            setPanelStatus('OPEN');
          } else {
            setPanelStatus('OPENING');
          }
        } else {
          if (currentAng <= 0.04) {
            setPanelStatus('CLOSED');
          } else {
            setPanelStatus('CLOSING');
          }
        }
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // ---------------------------------------------------------
    // 12. CLEANUP
    // ---------------------------------------------------------
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      outerFrameMat.dispose();
      sashFrameMat.dispose();
      trimMat.dispose();
      hardwareMat.dispose();
      pistonRodMat.dispose();
      glassMat.dispose();
      actuatorIndicatorMat.dispose();
      cadEdgeMat.dispose();
      subtleCadEdgeMat.dispose();
      topRailGeo.dispose();
      botRailGeo.dispose();
      stileGeo.dispose();
      sashTopRailGeo.dispose();
      sashBotRailGeo.dispose();
      sashStileGeo.dispose();
      glassGeo.dispose();
      dripLipGeo.dispose();
      groundGrid.dispose();
    };
  }, []);

  // Update SMA Actuator Core illumination when temperature changes
  useEffect(() => {
    if (kinematicRefs.current.actuatorIndicatorMat) {
      const mat = kinematicRefs.current.actuatorIndicatorMat;
      if (temperature > 40) {
        const heatRatio = Math.min(1, (temperature - 40) / 35);
        mat.emissive.setRGB(0.9 * heatRatio, 0.9 * heatRatio, 0.9 * heatRatio);
        mat.emissiveIntensity = 0.2 + heatRatio * 0.4;
      } else {
        mat.emissive.setRGB(0.15, 0.15, 0.15);
        mat.emissiveIntensity = 0.15;
      }
    }
  }, [temperature]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '920px',
        margin: '0 auto',
      }}
    >
      {/* 1. Specimen Frame Header / Technical Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'rgba(10, 10, 10, 0.92)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          border: '1px solid var(--border-medium)',
          borderBottom: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        }}
      >
        {/* Left: Device & Assembly Identification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#ffffff',
              borderRadius: '50%',
              boxShadow: panelStatus === 'OPEN' || panelStatus === 'OPENING'
                ? '0 0 10px rgba(255, 255, 255, 1)'
                : '0 0 5px rgba(255, 255, 255, 0.5)',
              transition: 'box-shadow 0.3s ease',
            }}
          />
          <span className="font-mono" style={{ fontSize: '0.80rem', color: '#ffffff', letterSpacing: '0.08em', fontWeight: 600 }}>
            SMA THERMAL VENT
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              borderLeft: '1px solid var(--border-subtle)',
              paddingLeft: '10px',
            }}
          >
            HINGED PANEL ASSEMBLY [VENT-60]
          </span>
        </div>

        {/* Right: Status Badges & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Actuator Status Badge */}
          <div
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: panelStatus === 'OPEN' || panelStatus === 'OPENING'
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-medium)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#ffffff',
              transition: 'all 0.3s ease',
            }}
          >
            <Wind size={12} />
            <span>SMA ACTUATOR: {panelStatus}</span>
          </div>

          {/* Calibrated Temperature Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--border-medium)',
            }}
          >
            <Gauge size={12} color="#ffffff" />
            <span className="font-mono" style={{ fontSize: '0.76rem', fontWeight: 700, color: '#ffffff' }}>
              {temperature.toFixed(2)}°C
            </span>
            <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
              {isSimulated ? 'SIMULATED' : 'CALIBRATED'}
            </span>
          </div>

          {/* Rotation Toggle */}
          <button
            onClick={handleToggleRotation}
            style={{
              background: isRotating ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              border: '1px solid var(--border-medium)',
              color: '#ffffff',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={isRotating ? 'Pause Idle Auto-Rotation' : 'Resume Idle Auto-Rotation'}
          >
            <RotateCw size={13} style={{ transform: isRotating ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s ease' }} />
          </button>

          {/* Reset Perspective */}
          <button
            onClick={handleResetPerspective}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-medium)',
              color: '#ffffff',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Reset 3D Perspective"
          >
            <Compass size={13} />
          </button>
        </div>
      </div>

      {/* 2. 3D Canvas Viewport (Hover Target for Actuation) */}
      <div
        ref={mountRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: 'relative',
          width: '100%',
          height: '460px',
          background: 'radial-gradient(circle at 50% 45%, #101114 0%, #050507 55%, #000000 100%)',
          borderLeft: '1px solid var(--border-medium)',
          borderRight: '1px solid var(--border-medium)',
          borderBottom: '1px solid var(--border-medium)',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          cursor: isDragging ? 'grabbing' : isHovered ? 'pointer' : 'grab',
          overflow: 'hidden',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        {/* HUD Overlay: Top-Left Technical Telemetry */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '20px',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.74rem',
              color: '#ffffff',
              letterSpacing: '0.08em',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>SMA THERMAL VENT</span>
            <span style={{ color: 'var(--text-muted)' }}>//</span>
            <span style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>ACTUATION: INTERACTIVE</span>
          </div>

          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            PANEL STATUS:{' '}
            <strong
              style={{
                color: panelStatus === 'OPEN' || panelStatus === 'OPENING' ? '#ffffff' : 'var(--text-muted)',
                letterSpacing: '0.06em',
              }}
            >
              {panelStatus}
            </strong>
            <span style={{ marginLeft: '8px', color: 'var(--text-muted)' }}>
              ({currentAngleDeg.toFixed(1)}° / 60.0°)
            </span>
          </div>

          <div className="font-mono" style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
            TEMPERATURE: <span style={{ color: '#ffffff', fontWeight: 600 }}>{temperature.toFixed(2)} °C</span>
            <span style={{ marginLeft: '6px' }}>({isSimulated ? 'SIMULATED SENSOR' : 'CALIBRATED HARDWARE'})</span>
          </div>
        </div>

        {/* HUD Overlay: Top-Right Material & Kinematic Specs */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            right: '20px',
            pointerEvents: 'none',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            MECHANISM: DUAL SMA LINEAR PISTONS
          </div>
          <div className="font-mono" style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
            ALLOY PHASE: <span style={{ color: '#ffffff' }}>{phase.toUpperCase()}</span> ({recoveryPct}% RECOVERY)
          </div>
          <div className="font-mono" style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
            FRAME: GRAPHITE ANODIZED ALUMINUM
          </div>
        </div>

        {/* Center Optical CAD Crosshair */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            width: '28px',
            height: '28px',
            opacity: 0.18,
          }}
        >
          <div style={{ position: 'absolute', top: '13px', left: 0, right: 0, height: '1px', background: '#fff' }} />
          <div style={{ position: 'absolute', left: '13px', top: 0, bottom: 0, width: '1px', background: '#fff' }} />
        </div>

        {/* Bottom Interactive Guide Pill & Accessibility Button */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(5, 5, 5, 0.82)',
            border: '1px solid var(--border-medium)',
            padding: '6px 16px',
            borderRadius: '20px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: '0.68rem',
              color: isHovered ? '#ffffff' : 'var(--text-secondary)',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isHovered ? '#ffffff' : '#666666',
                display: 'inline-block',
              }}
            />
            {isHovered ? 'SMA ACTUATION ENGAGED • LEAVE TO CLOSE' : 'HOVER TO ACTUATE VENTILATION PANEL • DRAG TO ROTATE'}
          </span>

          {/* Accessible Touch / Click Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleActuation();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid var(--border-bright)',
              borderRadius: '12px',
              color: '#ffffff',
              padding: '2px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {targetOpeningAngle.current > 0.1 ? 'Close Vent' : 'Open Vent'}
          </button>
        </div>
      </div>
    </div>
  );
}
