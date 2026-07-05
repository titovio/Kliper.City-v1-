const places = [
  {
    id: 'district',
    type: 'район',
    name: 'Европейский берег',
    subtitle: 'Тюмень · за рекой',
    story: 'Новый городской маршрут: набережная, кофейни, ЖК и места для прогулки в одном сценарии.',
    cardText: 'Страница района собирает объекты, истории, рекомендации жителей и важные события рядом.',
    dot: { x: 70, y: 34 },
    metrics: ['12 ЖК', '48 мест', '1.8к ❤']
  },
  {
    id: 'card',
    type: 'ЖК',
    name: 'Квартал у леса',
    subtitle: 'новостройка · рядом парк',
    story: 'Показываем объект как историю: вид сверху, двор, входные группы, планировки и советы жителей.',
    cardText: 'После истории пользователь получает обычную карточку с лайком, подпиской, галереей и переходом внутрь.',
    dot: { x: 42, y: 66 },
    metrics: ['326 ❤', '89 подписок', '+24%']
  },
  {
    id: 'company',
    type: 'компания',
    name: 'Кофейня у дома',
    subtitle: 'место рядом · рекомендации',
    story: 'Каждая компания может раскрыться не просто карточкой, а маленькой городской историей.',
    cardText: 'Лайк добавляет место в любимые, подписка открывает новости, акции и сообщения от компании.',
    dot: { x: 23, y: 42 },
    metrics: ['4.2к ❤', '612 подписок', '18 советов']
  }
];

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const segment = (progress, start, end) => clamp((progress - start) / (end - start));

const journeysEl = document.querySelector('#journeys');
const approachEl = document.querySelector('.city-approach');
const effectToggleEl = document.querySelector('.effect-toggle');
const cityCanvasEl = document.querySelector('.city-webgl');
let threeCity = null;
let threeCityProgress = 0;

function makeSeededRandom(seed = 7) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function initThreeCity() {
  if (!cityCanvasEl) return;

  import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js')
    .then((THREE) => {
      const renderer = new THREE.WebGLRenderer({
        canvas: cityCanvasEl,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.06;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xc5ac84, 880, 2800);

      const sky = document.createElement('canvas');
      sky.width = 32;
      sky.height = 512;
      const ctx = sky.getContext('2d');
      const skyGradient = ctx.createLinearGradient(0, 0, 0, sky.height);
      skyGradient.addColorStop(0, '#f4c98c');
      skyGradient.addColorStop(.24, '#d9b38b');
      skyGradient.addColorStop(.48, '#81919a');
      skyGradient.addColorStop(.72, '#3f514d');
      skyGradient.addColorStop(1, '#1a241f');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, sky.width, sky.height);
      const skyTexture = new THREE.CanvasTexture(sky);
      skyTexture.colorSpace = THREE.SRGBColorSpace;
      scene.background = skyTexture;

      const camera = new THREE.PerspectiveCamera(44, 1, 2, 5000);
      const world = new THREE.Group();
      scene.add(world);

      const hemi = new THREE.HemisphereLight(0xffe3bd, 0x1b2b28, 1.9);
      scene.add(hemi);
      const sun = new THREE.DirectionalLight(0xffc071, 3.2);
      sun.position.set(-820, 980, 620);
      scene.add(sun);

      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x223128,
        roughness: .92,
        metalness: 0
      });
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(3600, 2600, 12, 12), groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -8;
      world.add(ground);

      const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x345c68,
        roughness: .28,
        metalness: .12,
        transparent: true,
        opacity: .96
      });

      const riverPoints = [
        new THREE.Vector3(-1700, 0, -560),
        new THREE.Vector3(-1050, 0, -410),
        new THREE.Vector3(-460, 0, -270),
        new THREE.Vector3(160, 0, -100),
        new THREE.Vector3(820, 0, 120),
        new THREE.Vector3(1700, 0, 430)
      ];

      function makeRiverStrip(points, width) {
        const vertices = [];
        const uvs = [];
        const indices = [];

        points.forEach((point, index) => {
          const prev = points[Math.max(0, index - 1)];
          const next = points[Math.min(points.length - 1, index + 1)];
          const tangent = new THREE.Vector3().subVectors(next, prev).normalize();
          const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
          const left = point.clone().addScaledVector(normal, width);
          const right = point.clone().addScaledVector(normal, -width);
          vertices.push(left.x, .2, left.z, right.x, .2, right.z);
          uvs.push(0, index / (points.length - 1), 1, index / (points.length - 1));

          if (index < points.length - 1) {
            const base = index * 2;
            indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
          }
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        return geometry;
      }

      const river = new THREE.Mesh(makeRiverStrip(riverPoints, 220), waterMaterial);
      world.add(river);

      const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x4e4a3c, roughness: .86 });
      const promenadeMaterial = new THREE.MeshStandardMaterial({ color: 0xb18a5a, roughness: .72 });

      function makeCurveTube(points, radius, material) {
        const curve = new THREE.CatmullRomCurve3(points);
        const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 72, radius, 8, false), material);
        world.add(mesh);
        return mesh;
      }

      const bankOffsetA = riverPoints.map((point) => point.clone().add(new THREE.Vector3(0, 6, -170)));
      const bankOffsetB = riverPoints.map((point) => point.clone().add(new THREE.Vector3(0, 5, 170)));
      makeCurveTube(bankOffsetA, 8, promenadeMaterial);
      makeCurveTube(bankOffsetB, 5, roadMaterial);

      function makeRoad(x, z, length, width, rot = 0) {
        const road = new THREE.Mesh(new THREE.BoxGeometry(length, 3, width), roadMaterial);
        road.position.set(x, 1.5, z);
        road.rotation.y = rot;
        world.add(road);
      }

      makeRoad(-340, -450, 1320, 24, .18);
      makeRoad(280, -280, 980, 20, -.45);
      makeRoad(260, 70, 1250, 18, .1);
      makeRoad(-760, -40, 960, 18, -.72);

      const buildingMaterials = [
        new THREE.MeshStandardMaterial({ color: 0x7b614a, roughness: .78 }),
        new THREE.MeshStandardMaterial({ color: 0xa58b6d, roughness: .76 }),
        new THREE.MeshStandardMaterial({ color: 0x5e594e, roughness: .82 }),
        new THREE.MeshStandardMaterial({ color: 0xbf9b72, roughness: .72 }),
        new THREE.MeshStandardMaterial({ color: 0x3f3d38, roughness: .86 })
      ];
      const districtMaterial = new THREE.MeshStandardMaterial({ color: 0xc59b69, roughness: .68 });
      const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x2d302d, roughness: .88 });
      const windowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd090,
        transparent: true,
        opacity: .92
      });
      const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x24452f, roughness: .9 });
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5b3b23, roughness: .8 });
      const random = makeSeededRandom(41);

      function addBuilding(x, z, w, d, h, material) {
        const building = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
        building.position.set(x, h / 2, z);
        building.castShadow = false;
        building.receiveShadow = true;
        world.add(building);

        const roof = new THREE.Mesh(new THREE.BoxGeometry(w * .92, 3, d * .92), roofMaterial);
        roof.position.set(x, h + 1.8, z);
        world.add(roof);
        return building;
      }

      for (let row = 0; row < 7; row += 1) {
        for (let col = 0; col < 13; col += 1) {
          if (random() < .18) continue;
          const x = -1040 + col * 150 + (random() - .5) * 26;
          const z = -720 + row * 150 + (random() - .5) * 30;
          const nearRiver = z > -260 && x > 120;
          const w = 54 + random() * 54;
          const d = 44 + random() * 62;
          const h = (nearRiver ? 60 : 28) + random() * (nearRiver ? 170 : 90);
          addBuilding(x, z, w, d, h, buildingMaterials[Math.floor(random() * buildingMaterials.length)]);
        }
      }

      const districtBlocks = [
        [250, -190, 90, 84, 150],
        [360, -170, 76, 110, 210],
        [470, -150, 96, 86, 180],
        [310, -40, 112, 80, 120],
        [430, -20, 82, 96, 160],
        [555, -30, 70, 90, 145],
        [220, 80, 84, 70, 90],
        [355, 95, 115, 72, 115],
        [500, 96, 78, 72, 108]
      ];
      districtBlocks.forEach(([x, z, w, d, h]) => addBuilding(x, z, w, d, h, districtMaterial));

      const courtyard = new THREE.Mesh(
        new THREE.CircleGeometry(118, 36),
        new THREE.MeshStandardMaterial({ color: 0x35533a, roughness: .8 })
      );
      courtyard.rotation.x = -Math.PI / 2;
      courtyard.position.set(405, .6, -78);
      world.add(courtyard);

      const windowFrame = new THREE.Mesh(
        new THREE.PlaneGeometry(54, 42),
        windowMaterial
      );
      windowFrame.position.set(432, 92, -68);
      windowFrame.rotation.y = -0.18;
      world.add(windowFrame);

      const windowHalo = new THREE.PointLight(0xffb35e, 2.8, 420, 1.7);
      windowHalo.position.set(420, 96, -30);
      world.add(windowHalo);

      for (let i = 0; i < 130; i += 1) {
        const x = -1050 + random() * 1900;
        const z = -520 + random() * 820;
        if (Math.abs(x - 390) < 260 && Math.abs(z + 60) < 220 && random() < .55) continue;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2, 3, 16, 5), trunkMaterial);
        trunk.position.set(x, 8, z);
        const crown = new THREE.Mesh(new THREE.ConeGeometry(14 + random() * 10, 32 + random() * 18, 7), treeMaterial);
        crown.position.set(x, 28, z);
        world.add(trunk, crown);
      }

      for (let i = 0; i < 34; i += 1) {
        addBuilding(-1500 + i * 90, -1120 + random() * 140, 44, 42, 40 + random() * 120, buildingMaterials[i % buildingMaterials.length]);
      }

      const target = new THREE.Object3D();
      target.position.set(410, 0, -90);
      world.add(target);

      const cameraCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1120, 860, 1580),
        new THREE.Vector3(-780, 640, 1080),
        new THREE.Vector3(-300, 455, 700),
        new THREE.Vector3(95, 310, 430),
        new THREE.Vector3(285, 205, 210),
        new THREE.Vector3(390, 128, 35),
        new THREE.Vector3(425, 96, -30)
      ]);
      const targetCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-120, 0, -260),
        new THREE.Vector3(80, 10, -210),
        new THREE.Vector3(270, 18, -150),
        new THREE.Vector3(390, 24, -92),
        new THREE.Vector3(418, 44, -70),
        new THREE.Vector3(432, 82, -68),
        new THREE.Vector3(438, 96, -66)
      ]);

      threeCity = {
        THREE,
        renderer,
        scene,
        camera,
        cameraCurve,
        targetCurve,
        sun,
        world,
        width: 0,
        height: 0
      };

      document.body.classList.add('three-city-ready');
      resizeThreeCity();
      updateThreeCity(threeCityProgress);
      window.addEventListener('resize', resizeThreeCity);
    })
    .catch(() => {
      document.body.classList.remove('three-city-ready');
    });
}

function resizeThreeCity() {
  if (!threeCity || !cityCanvasEl) return;
  const width = cityCanvasEl.clientWidth || window.innerWidth;
  const height = cityCanvasEl.clientHeight || window.innerHeight;
  if (width === threeCity.width && height === threeCity.height) return;

  threeCity.width = width;
  threeCity.height = height;
  threeCity.renderer.setSize(width, height, false);
  threeCity.camera.aspect = width / Math.max(1, height);
  threeCity.camera.updateProjectionMatrix();
  threeCity.renderer.render(threeCity.scene, threeCity.camera);
}

function updateThreeCity(progress) {
  threeCityProgress = progress;
  if (!threeCity) return;

  resizeThreeCity();
  const t = ease(clamp(progress));
  const cameraPoint = threeCity.cameraCurve.getPoint(t);
  const targetPoint = threeCity.targetCurve.getPoint(t);

  threeCity.camera.position.copy(cameraPoint);
  threeCity.camera.fov = lerp(42, 48, ease(segment(progress, .45, 1)));
  threeCity.camera.updateProjectionMatrix();
  threeCity.camera.lookAt(targetPoint);
  threeCity.camera.rotation.z += lerp(-.018, .026, ease(segment(progress, .18, .82)));
  threeCity.sun.position.set(lerp(-820, -420, t), 980, lerp(620, 260, t));
  threeCity.renderer.render(threeCity.scene, threeCity.camera);
}

function createJourney(place, index) {
  const el = document.createElement('section');
  el.className = 'journey';
  el.dataset.index = index;
  el.id = place.id;
  el.innerHTML = `
    <div class="stage" style="--dot-x:${place.dot.x}%;--dot-y:${place.dot.y}%;--focus-x:${place.dot.x}%;--focus-y:${place.dot.y}%">
      <div class="progress-rail"><span></span></div>
      <div class="city-map" aria-hidden="true">
        <div class="river"></div>
        <div class="block"></div><div class="block"></div><div class="block"></div><div class="block"></div>
        <div class="block"></div><div class="block"></div><div class="block"></div>
        <div class="focus-dot" data-name="${place.name}"></div>
      </div>
      <div class="scene-title">
        <small>${place.subtitle}</small>
        <h2>${place.name}</h2>
      </div>
      <p class="scene-copy">${place.story}</p>
      <article class="story-panel" aria-label="История ${place.name}">
        <div class="story-progress"><span></span></div>
        <div class="story-panel__type">${place.type} · история</div>
        <h3>${place.name}</h3>
        <p>${place.story}</p>
      </article>
      <article class="final-card" aria-label="Карточка ${place.name}">
        <div class="final-card__image"></div>
        <h3>${place.name}</h3>
        <p>${place.cardText}</p>
        <div class="metrics">
          ${place.metrics.map((m) => {
            const [first, ...rest] = m.split(' ');
            return `<div class="metric"><b>${first}</b><span>${rest.join(' ')}</span></div>`;
          }).join('')}
        </div>
        <div class="card-actions">
          <a class="button button--filled" href="#${place.id}">Открыть</a>
          <a class="button button--ghost" href="#${place.id}">Подписаться</a>
        </div>
      </article>
      <div class="side-label">KLIPER.CITY · SCROLL SCENE ${String(index + 1).padStart(2, '0')}</div>
    </div>
  `;
  journeysEl.appendChild(el);
  return el;
}

const journeys = places.map(createJourney);

function setEffectEnabled(enabled) {
  document.body.classList.toggle('effect-off', !enabled);

  if (effectToggleEl) {
    effectToggleEl.textContent = enabled ? 'Эффект вкл' : 'Эффект выкл';
    effectToggleEl.setAttribute('aria-pressed', String(enabled));
  }

  try {
    localStorage.setItem('kliperTopEffect', enabled ? 'on' : 'off');
  } catch (error) {
    // Local storage can be unavailable in strict browser modes.
  }
}

function getSavedEffectState() {
  try {
    return localStorage.getItem('kliperTopEffect') !== 'off';
  } catch (error) {
    return true;
  }
}

if (effectToggleEl) {
  effectToggleEl.addEventListener('click', () => {
    const enabled = document.body.classList.contains('effect-off');
    setEffectEnabled(enabled);

    if (enabled) {
      approachEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    updateAll();
  });
}

setEffectEnabled(getSavedEffectState());
initThreeCity();

function updateApproach() {
  if (!approachEl || document.body.classList.contains('effect-off')) {
    document.body.classList.remove('city-effect-active');
    return;
  }

  const rect = approachEl.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;
  const progress = clamp(-rect.top / scrollable);
  document.body.classList.toggle('city-effect-active', rect.top <= 4 && rect.bottom > window.innerHeight * .2);
  const cameraProgress = ease(segment(progress, .02, .72));
  updateThreeCity(cameraProgress);

  const zoomT = ease(segment(progress, .04, .72));
  const cityScale = lerp(1, 1.08, zoomT);
  const cityX = lerp(0, -1.4, zoomT);
  const cityY = lerp(0, -1.8, zoomT);
  const cityOpacity = clamp(1 - ease(segment(progress, .66, .78)));
  const storiesInT = ease(segment(progress, .72, .82));
  const storiesOutT = ease(segment(progress, .94, 1));
  const storiesOpacity = clamp(storiesInT - storiesOutT);
  const storiesY = lerp(82, 0, storiesInT) + lerp(0, -18, storiesOutT);
  const storiesScale = lerp(.82, 1, storiesInT);
  const storiesX = lerp(0, -16, ease(segment(progress, .88, .98)));
  const storiesGap = lerp(38, 24, storiesInT);

  const layer1 = 1 - ease(segment(progress, .1, .26));
  const layer2 = Math.min(ease(segment(progress, .1, .26)), 1 - ease(segment(progress, .34, .5)));
  const layer3 = Math.min(ease(segment(progress, .34, .5)), 1 - ease(segment(progress, .58, .74)));
  const layer4 = ease(segment(progress, .58, .74));

  approachEl.style.setProperty('--city-scale', cityScale.toFixed(3));
  approachEl.style.setProperty('--city-x', `${cityX.toFixed(2)}vw`);
  approachEl.style.setProperty('--city-y', `${cityY.toFixed(2)}vh`);
  approachEl.style.setProperty('--city-tilt', '0deg');
  approachEl.style.setProperty('--city-rotate', `${lerp(-.8, .8, zoomT).toFixed(1)}deg`);
  approachEl.style.setProperty('--city-opacity', cityOpacity.toFixed(3));
  approachEl.style.setProperty('--stories-opacity', storiesOpacity.toFixed(3));
  approachEl.style.setProperty('--stories-x', `${storiesX.toFixed(2)}vw`);
  approachEl.style.setProperty('--stories-y', `${storiesY.toFixed(2)}vh`);
  approachEl.style.setProperty('--stories-scale', storiesScale.toFixed(3));
  approachEl.style.setProperty('--stories-gap', `${storiesGap.toFixed(1)}px`);
  approachEl.style.setProperty('--layer-1-opacity', layer1.toFixed(3));
  approachEl.style.setProperty('--layer-2-opacity', layer2.toFixed(3));
  approachEl.style.setProperty('--layer-3-opacity', layer3.toFixed(3));
  approachEl.style.setProperty('--layer-4-opacity', layer4.toFixed(3));
}

function updateJourney(el) {
  const rect = el.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;
  const progress = clamp(-rect.top / scrollable);

  const zoomT = ease(segment(progress, .05, .38));
  const storyInT = ease(segment(progress, .34, .58));
  const storyOutT = ease(segment(progress, .68, .82));
  const cardT = ease(segment(progress, .72, .94));

  const scale = lerp(1, 3.35, zoomT);
  const x = lerp(0, 50 - parseFloat(el.querySelector('.stage').style.getPropertyValue('--dot-x')), zoomT);
  const y = lerp(0, 50 - parseFloat(el.querySelector('.stage').style.getPropertyValue('--dot-y')), zoomT);

  const titleOpacity = clamp(1 - segment(progress, .22, .42));
  const copyOpacity = clamp(1 - segment(progress, .16, .34));
  const storyOpacity = clamp(storyInT - storyOutT);
  const cardOpacity = cardT;

  el.style.setProperty('--map-scale', scale.toFixed(3));
  el.style.setProperty('--map-x', `${x.toFixed(2)}vw`);
  el.style.setProperty('--map-y', `${y.toFixed(2)}vh`);
  el.style.setProperty('--title-opacity', titleOpacity.toFixed(3));
  el.style.setProperty('--title-y', `${lerp(0, 40, 1 - titleOpacity).toFixed(1)}px`);
  el.style.setProperty('--copy-opacity', copyOpacity.toFixed(3));
  el.style.setProperty('--story-opacity', storyOpacity.toFixed(3));
  el.style.setProperty('--story-scale', lerp(.78, 1, storyInT).toFixed(3));
  el.style.setProperty('--story-y', `${lerp(80, -120, storyOutT).toFixed(1)}px`);
  el.style.setProperty('--story-progress', `${Math.round(segment(progress, .38, .7) * 100)}%`);
  el.style.setProperty('--card-opacity', cardOpacity.toFixed(3));
  el.style.setProperty('--card-scale', lerp(.88, 1, cardT).toFixed(3));
  el.style.setProperty('--card-y', `${lerp(80, 0, cardT).toFixed(1)}px`);
  el.style.setProperty('--rail-progress', `${Math.round(progress * 100)}%`);
}

function updateAll() {
  updateApproach();
  journeys.forEach(updateJourney);
}

window.addEventListener('scroll', updateAll, { passive: true });
window.addEventListener('resize', updateAll);
updateAll();

function syncApproachFrame() {
  updateApproach();
  window.requestAnimationFrame(syncApproachFrame);
}

window.requestAnimationFrame(syncApproachFrame);
