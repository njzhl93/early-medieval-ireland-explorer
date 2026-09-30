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

try {
  const [maplibregl, registry] = await Promise.all([
    import('https://unpkg.com/maplibre-gl@^6.11.2/dist/maplibre-gl.mjs'),
    loadRegistry()
  ]);

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
  loadRegistry().then(addResearchPilotCard).catch(() => {});
}
