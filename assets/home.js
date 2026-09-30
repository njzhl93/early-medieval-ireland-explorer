const fallback = document.getElementById('mapFallback');
const mapNode = document.getElementById('irelandMap');

async function loadRegistry() {
  const response = await fetch('data/cities.json');
  if (!response.ok) throw new Error('Unable to load city registry');
  return response.json();
}

function addWaterfordCard(registry) {
  const waterford = registry.cities.find(city => city.id === 'waterford');
  const dublinCard = document.querySelector('.map-card-link');
  if (!waterford || !dublinCard || document.querySelector('.waterford-pilot-link')) return;
  const card = document.createElement('a');
  card.className = 'map-card-link waterford-pilot-link';
  card.href = waterford.page;
  card.innerHTML = '<span>AD1050 pre-production ready</span><b>Waterford / Veðrafjǫrðr · first Geometry D candidate next</b><i>→</i>';
  dublinCard.insertAdjacentElement('afterend', card);
}

function renderCityNetwork(registry) {
  if (document.getElementById('cities')) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const dublin = registry.cities.find(city => city.id === 'dublin');
  const waterford = registry.cities.find(city => city.id === 'waterford');
  const planned = registry.planned || [];

  const section = document.createElement('section');
  section.id = 'cities';
  section.className = 'section shell city-network';
  section.innerHTML = `
    <header class="section-heading">
      <p class="eyebrow">CITY NETWORK · v0.25</p>
      <h2>从多城市研究，进入第二座城市的图像预生产</h2>
      <p>Dublin 是当前深度复原基准；Waterford 已把 AD1050 的水文、街轴、城市范围、防御和 waterfront 不确定性转换成可执行 Geometry D 约束，下一阶段可以生成第一张受控候选图，但仍不是最终历史定稿。</p>
    </header>
    <div class="city-network-grid">
      <article class="city-network-card featured">
        <span class="status">Deep reconstruction</span>
        <h3>${dublin.modern_name} / ${dublin.historic_name}</h3>
        <p>AD900–1050 四阶段、AD950 鸟瞰复原、真实空间控制与 B point / C link / D render 方法。</p>
        <a href="${dublin.page}">Open Dublin →</a>
      </article>
      <article class="city-network-card research">
        <span class="status">AD1050 pre-production</span>
        <h3>${waterford.modern_name} / ${waterford.historic_name}</h3>
        <p>六个 generation gates 已转换为明确的复原规则：Suir / St John’s marsh、Peter / High Street、Geometry D 西向包络、非测量式防御、非连续 quay，以及 St Olaf’s 的谨慎处理。</p>
        <a href="${waterford.page}#gate">Open Waterford AD1050 gate →</a>
      </article>
      <article class="city-network-card planned">
        <span class="status">Planned</span>
        <h3>Next network</h3>
        <p>${planned.map(city => city.modern_name).join(' · ')}</p>
        <span class="status">No speculative reconstruction yet</span>
      </article>
    </div>
    <div class="city-status-key"><span class="deep">deep reconstruction</span><span class="research">pre-production</span><span class="planned">planned</span></div>
  `;
  hero.insertAdjacentElement('afterend', section);

  const stats = document.querySelectorAll('.hero-stats > div');
  if (stats[0]) stats[0].innerHTML = '<dt>2</dt><dd>city datasets</dd>';
  if (stats[2]) stats[2].innerHTML = '<dt>10</dt><dd>public controls</dd>';

  const milestone = document.querySelector('.site-footer span');
  if (milestone) milestone.textContent = 'Become the High King · v0.25 Waterford AD1050 pre-production';
}

try {
  const [maplibregl, registry] = await Promise.all([
    import('https://unpkg.com/maplibre-gl@^6.11.2/dist/maplibre-gl.mjs'),
    loadRegistry()
  ]);

  renderCityNetwork(registry);

  const map = new maplibregl.Map({
    container: 'irelandMap',
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [{id:'osm',type:'raster',source:'osm'}]
    },
    center: [-7.55, 52.95],
    zoom: 5.45,
    minZoom: 4.5,
    maxZoom: 10,
    attributionControl: false
  });

  map.addControl(new maplibregl.AttributionControl({compact:true}), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({showCompass:false}), 'top-right');

  registry.cities.forEach(city => {
    const marker = document.createElement('a');
    marker.className = `${city.id}-marker`;
    marker.href = city.page;
    marker.setAttribute('aria-label', `打开 ${city.modern_name} / ${city.historic_name} 页面`);
    marker.innerHTML = `<span></span><b>${city.modern_name}</b>`;
    new maplibregl.Marker({element: marker, anchor:'bottom-left'})
      .setLngLat(city.navigation_anchor)
      .addTo(map);
  });

  addWaterfordCard(registry);
} catch (err) {
  console.error(err);
  mapNode.hidden = true;
  fallback.hidden = false;
  loadRegistry().then(registry => {
    renderCityNetwork(registry);
    addWaterfordCard(registry);
  }).catch(() => {});
}
