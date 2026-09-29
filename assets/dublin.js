const WATER = {
  liffey:[[0,20],[18,21],[36,23],[55,22],[74,20],[100,18],[100,34],[76,35],[55,37],[34,36],[17,34],[0,33]],
  poddle:[[51,100],[50,86],[50,73],[52,63],[55,57],[59,52],[62,45],[64,35]],
  dubh:[[50,59],[54,54],[60,53],[64,56],[63,62],[58,66],[53,64]]
};
const PHASES = {
  900:{title:'Dublin / Dyflin c. AD 900',summary:'902 年放逐前的早期 Viking settlement / longphort 语境。精确 occupied extent 与 defence circuit 尚未解决。',defence:'Pre-Bank 2 · unresolved',urban:'limited / unresolved',urbanShape:[[44,41],[58,38],[66,44],[67,58],[61,69],[48,72],[39,64],[38,50]],bank:null,street:false,buildings:['early Norse timber dwelling','workshop / outbuilding'],prohibitions:['Bank 2 / Bank 3','mature Fishamble plot grid','continuous large quay','11th-century High Street expansion']},
  950:{title:'Dublin / Dyflin c. AD 950',summary:'917 年后快速城市化的紧凑核心。Bank 2、木构地块组织和 Liffey–Poddle–Dubh Linn 水文关系构成当前复原重点。',defence:'Bank 2',urban:'compact post-917 core',urbanShape:[[34,39],[56,36],[70,40],[75,53],[72,69],[60,79],[41,78],[30,68],[28,52]],bank:[[31,44],[28,52],[30,67],[41,77],[59,78],[71,68],[74,54],[70,42]],street:true,buildings:['type 1 Hiberno-Viking house','timber outbuilding','workshop','post-and-wattle plot fence'],prohibitions:['Bank 3 dominance','continuous water-filled moat','late-11th-century stone wall','13th-century quay fronts','fully built-out High Street']},
  1000:{title:'Dublin / Dyflin c. AD 1000',summary:'成熟的 Fishamble / Christchurch / Wood Quay 核心。Bank 3 已进入相位，向 High Street 的西扩仍然表现为过渡状态。',defence:'Bank 3',urban:'mature core + westward transition',urbanShape:[[27,37],[54,34],[73,38],[80,50],[79,69],[67,81],[43,84],[25,74],[20,57]],bank:[[24,41],[20,54],[24,73],[42,83],[67,80],[78,67],[79,49],[72,39]],street:true,buildings:['type 1 Hiberno-Viking house','three-aisled house','timber outbuilding','craft workshop','plot fence'],prohibitions:['late-11th-century stone wall','13th-century quays','fully mature AD1050 High Street district']},
  1050:{title:'Dublin / Dyflin c. AD 1050',summary:'高密度 mid-11th-century Hiberno-Norse town。重复重建、内部排水、后院和工艺活动增加，但仍不能提前使用晚 11 世纪石墙。',defence:'Late earthen Bank 3 tradition',urban:'expanded dense core',urbanShape:[[17,36],[49,33],[73,36],[84,48],[84,69],[69,83],[39,87],[16,77],[10,58]],bank:[[24,41],[20,54],[24,73],[42,83],[67,80],[78,67],[79,49],[72,39]],street:true,buildings:['11th-century type 1 variant','three-aisled house','timber outbuilding','craft workshop','yard / pit complex'],prohibitions:['post-1059 evidence by default','late-11th-century stone wall','12th–13th-century quays']}
};
const STREET=[[57,42],[55,52],[53,64],[52,76]];
const CONTROLS=[
  {name:'Patrick Street',e:715058,n:733662,evidence:'A',geometry:'B',note:'GSI River Poddle control'},
  {name:'Dublin Castle / Dubh Linn',e:715370,n:733850,evidence:'B',geometry:'B',note:'Historic-core / Black Pool investigation control'},
  {name:'Palace Street',e:715426,n:734039,evidence:'A',geometry:'B',note:'Medieval Poddle riverbed context'},
  {name:'East Essex Street',e:715479,n:734174,evidence:'A',geometry:'B',note:'Poddle / Liffey estuarine context'}
];
const NS='http://www.w3.org/2000/svg';
const pts=a=>a.map(p=>p.join(',')).join(' ');
function shape(tag,points,cls){const e=document.createElementNS(NS,tag);e.setAttribute('points',pts(points));e.setAttribute('class',cls);return e}
function renderYear(year){
  const p=PHASES[year];
  document.querySelectorAll('.phase-control button').forEach(b=>{const active=+b.dataset.year===year;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))});
  document.getElementById('phaseTitle').textContent=p.title;
  document.getElementById('phaseSummary').textContent=p.summary;
  document.getElementById('phaseDefence').textContent=p.defence;
  document.getElementById('phaseUrban').textContent=p.urban;
  document.getElementById('buildingList').innerHTML=p.buildings.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('prohibitionList').innerHTML=p.prohibitions.map(x=>`<li>${x}</li>`).join('');
  const svg=document.getElementById('dublinSvg');svg.replaceChildren();
  svg.append(shape('polygon',WATER.liffey,'geo-water'));
  const poddle=shape('polyline',WATER.poddle,'geo-poddle');svg.append(poddle);
  svg.append(shape('polygon',WATER.dubh,'geo-dubh'));
  const halo=shape('polyline',WATER.poddle,'geo-uncertainty');svg.insertBefore(halo,poddle);
  svg.append(shape('polygon',p.urbanShape,'geo-urban'));
  if(p.bank) svg.append(shape('polyline',p.bank,'geo-bank'));
  if(p.street) svg.append(shape('polyline',STREET,'geo-street'));
  const north=document.createElementNS(NS,'text');north.setAttribute('x','92');north.setAttribute('y','92');north.setAttribute('class','north-label');north.textContent='N ↑';svg.append(north);
  history.replaceState(null,'',`#phase-${year}`);
}

document.querySelectorAll('.phase-control button').forEach(b=>b.addEventListener('click',()=>renderYear(+b.dataset.year)));
const hashYear=+(location.hash.match(/phase-(900|950|1000|1050)/)||[])[1];
renderYear(PHASES[hashYear]?hashYear:950);

function renderControls(){
  const svg=document.getElementById('controlPlot');
  const margin={l:82,r:40,t:42,b:58}, w=720-margin.l-margin.r, h=460-margin.t-margin.b;
  const es=CONTROLS.map(x=>x.e), ns=CONTROLS.map(x=>x.n), minE=Math.min(...es)-70,maxE=Math.max(...es)+70,minN=Math.min(...ns)-70,maxN=Math.max(...ns)+70;
  const x=e=>margin.l+(e-minE)/(maxE-minE)*w; const y=n=>margin.t+h-(n-minN)/(maxN-minN)*h;
  const bg=document.createElementNS(NS,'rect');bg.setAttribute('x',margin.l);bg.setAttribute('y',margin.t);bg.setAttribute('width',w);bg.setAttribute('height',h);bg.setAttribute('class','plot-bg');svg.append(bg);
  for(let i=0;i<4;i++){
    const gx=margin.l+w*i/3, gy=margin.t+h*i/3;
    const vl=document.createElementNS(NS,'line');vl.setAttribute('x1',gx);vl.setAttribute('x2',gx);vl.setAttribute('y1',margin.t);vl.setAttribute('y2',margin.t+h);vl.setAttribute('class','plot-grid');svg.append(vl);
    const hl=document.createElementNS(NS,'line');hl.setAttribute('x1',margin.l);hl.setAttribute('x2',margin.l+w);hl.setAttribute('y1',gy);hl.setAttribute('y2',gy);hl.setAttribute('class','plot-grid');svg.append(hl);
  }
  const rel=document.createElementNS(NS,'polyline');rel.setAttribute('points',CONTROLS.map(c=>`${x(c.e)},${y(c.n)}`).join(' '));rel.setAttribute('class','plot-link');svg.append(rel);
  CONTROLS.forEach((c,i)=>{
    const g=document.createElementNS(NS,'g');g.setAttribute('class','plot-control');
    const circle=document.createElementNS(NS,'circle');circle.setAttribute('cx',x(c.e));circle.setAttribute('cy',y(c.n));circle.setAttribute('r','7');g.append(circle);
    const label=document.createElementNS(NS,'text');label.setAttribute('x',x(c.e)+12);label.setAttribute('y',y(c.n)+(i===0?4:-8));label.textContent=c.name;g.append(label);svg.append(g);
  });
  const xlab=document.createElementNS(NS,'text');xlab.setAttribute('x','360');xlab.setAttribute('y','442');xlab.setAttribute('class','axis-label');xlab.textContent='ITM Easting · EPSG:2157';svg.append(xlab);
  const ylab=document.createElementNS(NS,'text');ylab.setAttribute('transform','translate(22 270) rotate(-90)');ylab.setAttribute('class','axis-label');ylab.textContent='ITM Northing';svg.append(ylab);
  document.getElementById('controlTable').innerHTML=CONTROLS.map(c=>`<article><div><b>${c.name}</b><small>${c.note}</small></div><span>E ${c.e}<br>N ${c.n}</span><em>Evidence ${c.evidence}<br>Geometry ${c.geometry}</em></article>`).join('');
}
renderControls();
