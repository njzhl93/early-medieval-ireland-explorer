const fallback = document.getElementById('mapFallback');
const mapNode = document.getElementById('irelandMap');

async function loadRegistry() {
  const response = await fetch('data/cities.json');
  if (!response.ok) throw new Error('Unable to load city registry');
  return response.json();
}

function addResearchPilotCard(registry) {
  const waterford = registry.cities.find(city => city.id === 'waterford');
  const dublinCard = document.querySelector('.map-card-link');
  if (!waterford || !dublinCard || document.querySelector('.waterford-pilot-link')) return;
  const card = document.createElement('a');
  card.className = 'map-card-link waterford-pilot-link';
  card.href = waterford.page;
  card.innerHTML = '<span>Research pilot</span><b>Waterford / Veðrafjǫrðr · AD 900 → 1050</b><i>→</i>';
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
      <p class="eyebrow">CITY NETWORK · v0.23</p>
      <h2>从单城复原，进入多城市比较</h2>
      <p>Dublin 是当前深度复原基准；Waterford 是第二个研究试点。新城市只有在 evidence / geometry 合同足够明确后，才会从 research pilot 升级为 deep reconstruction。</p>
    </header>
    <div class="city-network-grid">
      <article class="city-network-card featured">
        <span class="status">Deep reconstruction</span>
        <h3>${dublin.modern_name} / ${dublin.historic_name}</h3>
        <p>AD900–1050 四阶段、AD950 鸟瞰复原、真实空间控制与 B point / C link / D render 方法。</p>
        <a href="${dublin.page}">Open Dublin →</a>
      </article>
      <article class="city-network-card research">
        <span class="status">Research pilot</span>
        <h3>${waterford.modern_name} / ${waterford.historic_name}</h3>
        <p>优先处理 Dundory 东端核心、Suir / St John’s River 地形、11 世纪城市扩张与晚 11 世纪城防年代。</p>
        <a href="${waterford.page}">Open Waterford →</a>
      </article>
      <article class="city-network-card planned">
        <span class="status">Planned</span>
        <h3>Next network</h3>
        <p>${planned.map(city => city.modern_name).join(' · ')}</p>
        <span class="status">No speculative reconstruction yet</span>
      </article>
    </div>
    <div class="city-status-key"><span class="deep">deep reconstruction</span><span class="research">research pilot</span><span class="planned">planned</span></div>
  `;
  hero.insertAdjacentElement('afterend', section);

  const stats = document.querySelectorAll('.hero-stats > div');
  if (stats[0]) stats[0].innerHTML = '<dt>2</dt><dd>city datasets</dd>';
  if (stats[2]) stats[2].innerHTML = '<dt>7</dt><dd>public controls</dd>';
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

  addResearchPilotCard(registry);
} catch (err) {
  console.error(err);
  mapNode.hidden = true;
  fallback.hidden = false;
  loadRegistry().then(registry => {
    renderCityNetwork(registry);
    addResearchPilotCard(registry);
  }).catch(() => {});
}
