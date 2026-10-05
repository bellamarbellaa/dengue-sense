/* Real street basemap with explicitly simulated observations. */
const mapBaseRender=render;
let streetMap=null;
const mapView={center:null,zoom:11};
const mapSites=[
 {area:0,name:'Cakung',lat:-6.185,lng:106.934},
 {area:0,name:'Duren Sawit',lat:-6.235,lng:106.917},
 {area:0,name:'Jatinegara',lat:-6.215,lng:106.868},
 {area:1,name:'Kebon Jeruk',lat:-6.193,lng:106.768},
 {area:1,name:'Cengkareng',lat:-6.145,lng:106.741},
 {area:1,name:'Grogol',lat:-6.163,lng:106.794},
 {area:2,name:'Tebet',lat:-6.232,lng:106.853},
 {area:2,name:'Pasar Minggu',lat:-6.287,lng:106.845},
 {area:2,name:'Cilandak',lat:-6.291,lng:106.799},
 {area:3,name:'Menteng',lat:-6.195,lng:106.833},
 {area:3,name:'Kemayoran',lat:-6.157,lng:106.854}
];
const layerInfo={
 'Current risk':{title:'Simulated risk',labels:['Lower','Moderate','Elevated'],colors:['#49a788','#e6b746','#d04a42']},
 'Rainfall heatmap':{title:'Simulated rainfall',labels:['Lower','Medium','Higher'],colors:['#9cd6e7','#559fc7','#315eaa']},
 'Population density':{title:'Illustrative density',labels:['Lower','Medium','Higher'],colors:['#c9bce0','#9270bb','#604287']},
 'Mosquito suitability':{title:'Illustrative suitability',labels:['Lower','Medium','Higher'],colors:['#c4d8a1','#8bac51','#4f783e']}
};
// Transparent scenario generator; no fitted epidemiological model.
function mapProjection(area,day=state.day){
 const a=areas[area],step=day==='14-day'?2:day==='7-day'?1:0;
 const density=[16000,19500,12500,22000][area],temperature=+(parseFloat(a.temp)+step*[.45,.3,.5,.2][area]).toFixed(1),rainfall=Math.round(parseFloat(a.rain)*(1+step*[.18,.12,.2,.08][area]));
 const temperatureEffect=Math.max(0,temperature-27)*.035,rainEffect=rainfall/100*.065,densityEffect=density/20000*.045;
 const growth=step*(temperatureEffect+rainEffect+densityEffect);
 const cases=Math.round(a.cases*(1+growth)),score=+Math.min(9.8,[7.1,6.4,4.7,3.1][area]+growth*5).toFixed(1);
 return {temperature,rainfall,density,cases,score,growth:Math.round(growth*100),risk:score>=7?'Elevated':score>=4?'Moderate':'Lower'};
}
function updateProjectionPanel(){const p=mapProjection(state.area),panel=$('.area-detail');if(!panel)return;
 panel.querySelector('.panel-head .pill').outerHTML=badge(p.risk);
 panel.querySelector('.risk-score').innerHTML=`<span>${state.day} simulated risk score</span><strong>${p.score}<small> / 10</small></strong>`;
 panel.querySelector('.mini-grid').innerHTML=`<div><span>Scenario temperature</span><strong>${p.temperature}°C</strong></div><div><span>Scenario rainfall</span><strong>${p.rainfall} mm</strong></div>`;
 panel.querySelector('.area-facts').insertAdjacentHTML('afterbegin',`<li><strong>${p.cases} demo cases / week</strong> · ${p.growth?`+${p.growth}% versus Today`:'scenario baseline'}</li><li>Population density: ${p.density.toLocaleString()} people/km² (demo)</li>`);
 panel.querySelector('.context').innerHTML=`<strong>${state.day==='Today'?'Baseline scenario':state.day+' outlook'}</strong><p class="muted">${state.day==='Today'?'Select 7-day or 14-day to see the projected change.':'Warmer temperatures, increased rainfall and population density raise the simulated case outlook.'} These are generated demo values, not observed conditions or a validated forecast.</p><button class="secondary full" id="scenario-method">How this demo is calculated</button>`;
 $('#scenario-method').onclick=()=>modal('Demo scenario method','<p>Starting from sample weekly cases, the scenario adds a temperature, rainfall and density growth term for each 7-day step. Population density stays fixed; temperature and rainfall vary by area.</p><p>Growth per step = max(temperature − 27, 0) × 0.035 + rainfall / 100 × 0.065 + density / 20,000 × 0.045. Projected cases = baseline × (1 + step × growth). Risk score adds five times total growth to a sample baseline, capped at 9.8.</p><p>All inputs and coefficients are illustrative. This demonstrates interaction, not scientific accuracy.</p>');
}
mapGraphic=function(){return `<div id="street-map" role="region" aria-label="Interactive Jakarta street map"><div class="map-loading">Loading Jakarta street map…</div></div><div class="street-map-legend"><strong>${layerInfo[state.mapLayer].title}</strong><div>${layerInfo[state.mapLayer].labels.map((v,i)=>`<span><i style="background:${layerInfo[state.mapLayer].colors[i]}"></i>${v}</span>`).join('')}</div><small>Coloured circles are demo overlays, not district boundaries.</small></div>`};
function areaSelector(){return `<div class="map-area-selector"><label for="map-area">Selected area</label><select id="map-area">${options()}</select><button id="fit-jakarta" title="Show all demo locations">⌖ Show Jakarta</button></div>`}
function setupStreetMap(){if(!$('#street-map'))return;const toolbar=$('.map-toolbar');toolbar.insertAdjacentHTML('beforeend',areaSelector());$('#map-area').onchange=e=>{state.area=Number(e.target.value);render()};if(!window.L){$('#street-map').innerHTML='<div class="map-unavailable"><h2>Street map unavailable</h2><p>Connect to the internet to load the basemap. You can still select an area and review its demo information.</p></div>';return}
 $('#street-map').innerHTML='';
 streetMap=L.map('street-map',{zoomControl:false,scrollWheelZoom:true}).setView(mapView.center||[-6.215,106.84],mapView.zoom);
 L.control.zoom({position:'topright'}).addTo(streetMap);
 const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,minZoom:9,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'}).addTo(streetMap);
 let tileCount=0;tiles.on('tileload',()=>tileCount++);tiles.on('tileerror',()=>{if(tileCount===0)toast('Some street tiles could not load. Check your internet connection.')});
 const colors=layerInfo[state.mapLayer].colors,selected=state.area;
 mapSites.forEach((site,i)=>{const p=mapProjection(site.area),offset=[.4,.1,-.3,.3,-.2,.1,.4,0,-.4,-.2,.2][i],score=Math.min(9.9,p.score+offset),metric=state.mapLayer==='Rainfall heatmap'?p.rainfall:state.mapLayer==='Population density'?p.density:score,level=state.mapLayer==='Rainfall heatmap'?(metric>=150?2:metric>=110?1:0):state.mapLayer==='Population density'?(metric>=19000?2:metric>=14000?1:0):(metric>=7?2:metric>=4?1:0),color=colors[level];L.circle([site.lat,site.lng],{radius:state.mapLayer==='Population density'?1400:850+score*100,color,fillColor:color,weight:1,fillOpacity:.12+score*.022,interactive:false}).addTo(streetMap);
 const marker=L.marker([site.lat,site.lng],{title:`Select ${site.name}, ${areas[site.area].name}`,alt:`Select ${site.name}, ${areas[site.area].name}`,icon:L.divIcon({className:'site-marker-shell',html:`<span class="site-marker ${site.area===selected?'selected':''}" style="--marker:${color}"></span>`,iconSize:[30,30],iconAnchor:[15,15]})}).addTo(streetMap);
 marker.options.title=`Select ${site.name}, ${areas[site.area].name}`;
 marker.bindTooltip(`<strong>${site.name}</strong><br>${areas[site.area].name}<br><small>${state.day}: ${layerInfo[state.mapLayer].labels[level]}<br>${p.cases} demo cases/week · score ${score.toFixed(1)}</small>`,{direction:'top',offset:[0,-10]});marker.on('click',()=>{state.area=site.area;render()});
 });
 streetMap.on('moveend',()=>{mapView.center=[streetMap.getCenter().lat,streetMap.getCenter().lng];mapView.zoom=streetMap.getZoom()});
 $('#fit-jakarta').onclick=()=>streetMap.fitBounds([[-6.33,106.70],[-6.10,106.98]],{padding:[30,30]});
 const attribution=document.createElement('div');attribution.className='basemap-disclosure';attribution.textContent='Real street basemap · simulated risk overlays';$('#street-map').appendChild(attribution);
 const label=document.querySelector('.area-detail .risk-score>span');if(label)label.textContent='Simulated risk score';
}
render=function(){if(streetMap){streetMap.remove();streetMap=null}mapBaseRender();if(state.country==='Indonesia'&&state.tab==='visualize'){setupStreetMap();updateProjectionPanel()}};
render();
