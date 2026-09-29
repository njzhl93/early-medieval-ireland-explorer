const fallback = document.getElementById('mapFallback');
const mapNode = document.getElementById('irelandMap');

try {
  const maplibregl = await import('https://unpkg.com/maplibre-gl@^6.11.2/dist/maplibre-gl.mjs');
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
    center: [-7.75, 53.25],
    zoom: 5.25,
    minZoom: 4.5,
    maxZoom: 10,
    attributionControl: false
  });
  map.addControl(new maplibregl.AttributionControl({compact:true}), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({showCompass:false}), 'top-right');
  const marker = document.createElement('a');
  marker.className = 'dublin-marker';
  marker.href = 'dublin.html';
  marker.setAttribute('aria-label', '打开 Dublin / Dyflin 深度页');
  marker.innerHTML = '<span></span><b>Dublin</b>';
  new maplibregl.Marker({element: marker, anchor:'bottom-left'})
    .setLngLat([-6.267462,53.342286])
    .addTo(map);
} catch (err) {
  mapNode.hidden = true;
  fallback.hidden = false;
}
