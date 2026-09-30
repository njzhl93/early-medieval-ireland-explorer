const CITY_ID = document.body.dataset.city;
const NS = 'http://www.w3.org/2000/svg';

const pts = points => points.map(p => p.join(',')).join(' ');
function svgShape(tag, points, cls) {
  const el = document.createElementNS(NS, tag);
  el.setAttribute('points', pts(points));
  el.setAttribute('class', cls);
  return el;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '—';
}

function setList(id, items = []) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = items.map(item => `<li>${item}</li>`).join('');
}

function renderSchematic(data, phase) {
  const svg = document.getElementById('citySvg');
  if (!svg) return;
  svg.replaceChildren();

  const s = data.schematic || {};
  if (s.river_suir) svg.append(svgShape('polygon', s.river_suir, 'geo-water'));
  if (s.st_john_marsh) svg.append(svgShape('polygon', s.st_john_marsh, 'geo-dubh'));

  if (s.apex_hint) {
    const apex = svgShape('polygon', s.apex_hint, 'geo-uncertainty-zone');
    svg.append(apex);
  }

  if (phase.urbanShape) svg.append(svgShape('polygon', phase.urbanShape, 'geo-urban'));
  if (phase.defenceLine) svg.append(svgShape('polyline', phase.defenceLine, 'geo-bank'));

  if (s.axis && (+phase.year >= 1000 || phase.urban.includes('westward'))) {
    svg.append(svgShape('polyline', s.axis, 'geo-street'));
  }

  const north = document.createElementNS(NS, 'text');
  north.setAttribute('x', '92');
  north.setAttribute('y', '92');
  north.setAttribute('class', 'north-label');
  north.textContent = 'N ↑';
  svg.append(north);
}

function renderPhase(data, year) {
  const raw = data.phases[String(year)];
  if (!raw) return;
  const phase = {...raw, year};

  document.querySelectorAll('.phase-control button').forEach(button => {
    const active = +button.dataset.year === +year;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });

  setText('phaseTitle', phase.title);
  setText('phaseSummary', phase.summary);
  setText('phaseDefence', phase.defence);
  setText('phaseUrban', phase.urban);
  setText('phaseEvidence', phase.evidence);
  setText('phaseGeometry', `Geometry ${phase.geometry}`);
  setList('mustShowList', phase.must_show);
  setList('mayShowList', phase.may_show);
  setList('buildingList', phase.buildings);
  setList('prohibitionList', phase.prohibitions);
  renderSchematic(data, phase);
  history.replaceState(null, '', `#phase-${year}`);
}

function renderControls(data) {
  const svg = document.getElementById('controlPlot');
  const table = document.getElementById('controlTable');
  const controls = data.controls || [];
  if (!svg || !table || !controls.length) return;

  const margin = {l:82, r:40, t:42, b:58};
  const width = 720 - margin.l - margin.r;
  const height = 460 - margin.t - margin.b;
  const eastings = controls.map(c => c.itm[0]);
  const northings = controls.map(c => c.itm[1]);
  const minE = Math.min(...eastings) - 45;
  const maxE = Math.max(...eastings) + 45;
  const minN = Math.min(...northings) - 45;
  const maxN = Math.max(...northings) + 45;
  const x = e => margin.l + (e - minE) / (maxE - minE) * width;
  const y = n => margin.t + height - (n - minN) / (maxN - minN) * height;

  svg.replaceChildren();
  const bg = document.createElementNS(NS, 'rect');
  bg.setAttribute('x', margin.l); bg.setAttribute('y', margin.t);
  bg.setAttribute('width', width); bg.setAttribute('height', height);
  bg.setAttribute('class', 'plot-bg'); svg.append(bg);

  for (let i = 0; i < 4; i++) {
    const gx = margin.l + width * i / 3;
    const gy = margin.t + height * i / 3;
    const vl = document.createElementNS(NS, 'line');
    vl.setAttribute('x1', gx); vl.setAttribute('x2', gx);
    vl.setAttribute('y1', margin.t); vl.setAttribute('y2', margin.t + height);
    vl.setAttribute('class', 'plot-grid'); svg.append(vl);
    const hl = document.createElementNS(NS, 'line');
    hl.setAttribute('x1', margin.l); hl.setAttribute('x2', margin.l + width);
    hl.setAttribute('y1', gy); hl.setAttribute('y2', gy);
    hl.setAttribute('class', 'plot-grid'); svg.append(hl);
  }

  controls.forEach((control, index) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'plot-control');
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', x(control.itm[0]));
    circle.setAttribute('cy', y(control.itm[1]));
    circle.setAttribute('r', '7');
    g.append(circle);
    const label = document.createElementNS(NS, 'text');
    label.setAttribute('x', x(control.itm[0]) + 12);
    label.setAttribute('y', y(control.itm[1]) + (index % 2 === 0 ? -8 : 15));
    label.textContent = control.name;
    g.append(label);
    svg.append(g);
  });

  const xlab = document.createElementNS(NS, 'text');
  xlab.setAttribute('x', '360'); xlab.setAttribute('y', '442');
  xlab.setAttribute('class', 'axis-label'); xlab.textContent = 'ITM Easting · EPSG:2157'; svg.append(xlab);
  const ylab = document.createElementNS(NS, 'text');
  ylab.setAttribute('transform', 'translate(22 270) rotate(-90)');
  ylab.setAttribute('class', 'axis-label'); ylab.textContent = 'ITM Northing'; svg.append(ylab);

  table.innerHTML = controls.map(control => `
    <article>
      <div>
        <b>${control.name}</b>
        <small>${control.role}</small>
        ${control.interpretation_limit ? `<small class="interpretation-limit">Limit: ${control.interpretation_limit}</small>` : ''}
      </div>
      <span>E ${control.itm[0]}<br>N ${control.itm[1]}</span>
      <em>Evidence ${control.evidence}<br>Geometry ${control.geometry}</em>
    </article>`).join('');
}

function renderClaims(data) {
  const root = document.getElementById('claimsTable');
  if (!root) return;
  root.innerHTML = (data.claims || []).map(claim => `
    <article class="claim-row">
      <div><b>${claim.id}</b><p>${claim.claim}</p></div>
      <span>Evidence ${claim.evidence_level}</span>
      <span>${claim.geometry_level ? `Geometry ${claim.geometry_level}` : 'Non-spatial'}</span>
    </article>`).join('');
}

function renderSources(data) {
  const root = document.getElementById('sourceGrid');
  if (!root) return;
  root.innerHTML = (data.sources || []).map(source => `
    <article>
      <span>${source.publisher}</span>
      <h3>${source.title}</h3>
      <p>${source.rights}</p>
      <a class="text-link" href="${source.url}" target="_blank" rel="noreferrer">Source ↗</a>
    </article>`).join('');
}

function renderReconstructionGate(data) {
  const gate = data.reconstruction_gate;
  if (!gate) return;
  setText('birdseyeStatus', gate.birdseye_status);
  setText('preferredBirdseyePhase', gate.preferred_first_candidate);
  setText('birdseyeReason', gate.reason);
  setList('birdseyeReviewList', gate.required_reviews);
}

function renderPreproduction(pack) {
  if (!pack) return;

  setText('birdseyeStatus', pack.status);
  setText('preferredBirdseyePhase', pack.target_phase);
  setText('birdseyeReason', pack.rationale);
  setList('birdseyeReviewList', pack.candidate_1_visual_qa || []);

  const gate = document.getElementById('gate');
  if (!gate || document.getElementById('preproduction')) return;

  const section = document.createElement('section');
  section.id = 'preproduction';
  section.className = 'section shell';
  section.innerHTML = `
    <header class="section-heading">
      <p class="eyebrow">AD1050 PRE-PRODUCTION · v${pack.version}</p>
      <h2>不确定性已经被转换成复原规则</h2>
      <p>${pack.scope}</p>
    </header>
    <div class="focus-grid">
      ${(pack.gate_resolution || []).map((item, index) => `
        <article>
          <span>${String(index + 1).padStart(2, '0')}</span>
          <h3>${item.id.replaceAll('_', ' ')}</h3>
          <p><b>${item.status}</b></p>
          <p>${item.rule}</p>
        </article>`).join('')}
    </div>
    <div class="birdseye-gate" style="margin-top:24px">
      <div class="gate-status">
        <span class="status-pill">${pack.status}</span>
        <h3>Candidate target: ${pack.target_phase}</h3>
        <p>${pack.rationale}</p>
        <p class="research-pack-link"><a class="text-link" href="research/waterford-ad1050-master-constraints-v025.md">Open AD1050 master constraints ↗</a></p>
        <p class="research-pack-link"><a class="text-link" href="research/waterford-ad1050-image-prompt-v025.txt">Open Candidate 1 image prompt ↗</a></p>
      </div>
      <div class="gate-review">
        <h3>Candidate 1 hard negatives</h3>
        <ul>${(pack.master_constraints?.must_not_show || []).map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
    </div>
  `;
  gate.insertAdjacentElement('afterend', section);
}

async function loadOptionalPreproduction() {
  if (!CITY_ID) return null;
  try {
    const response = await fetch(`data/${CITY_ID}-ad1050-preproduction.json`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function init() {
  if (!CITY_ID) return;
  const response = await fetch(`data/${CITY_ID}.json`);
  if (!response.ok) throw new Error(`Unable to load city data: ${CITY_ID}`);
  const data = await response.json();

  document.querySelectorAll('.phase-control button').forEach(button => {
    button.addEventListener('click', () => renderPhase(data, +button.dataset.year));
  });

  renderControls(data);
  renderClaims(data);
  renderSources(data);
  renderReconstructionGate(data);

  const preproduction = await loadOptionalPreproduction();
  if (preproduction) renderPreproduction(preproduction);

  const hashYear = +(location.hash.match(/phase-(900|950|1000|1050)/) || [])[1];
  renderPhase(data, data.phases[String(hashYear)] ? hashYear : 950);
}

init().catch(error => {
  console.error(error);
  const notice = document.getElementById('runtimeNotice');
  if (notice) {
    notice.hidden = false;
    notice.textContent = 'City research data could not be loaded. The static source notes below remain available.';
  }
});
