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
mapGraphic=function(){return `<div id="street-map" role="region" aria-label="Interactive Jakarta street map"><div class="map-loading">Loading Jakarta street map…</div></div><div class="street-map-legend"><strong>${layerInfo[state.mapLayer].title}</strong><div>${layerInfo[state.mapLayer].labels.map((v,i)=>`<span><i style="background:${layerInfo[state.mapLayer].colors[i]}"></i>${v}</span>`).join('')}</div><small>Coloured circles are demo overlays, not district boundaries.</small></div>`};
function areaSelector(){return `<div class="map-area-selector"><label for="map-area">Selected area</label><select id="map-area">${options()}</select><button id="fit-jakarta" title="Show all demo locations">⌖ Show Jakarta</button></div>`}
function setupStreetMap(){if(!$('#street-map'))return;const toolbar=$('.map-toolbar');toolbar.insertAdjacentHTML('beforeend',areaSelector());$('#map-area').onchange=e=>{state.area=Number(e.target.value);render()};if(!window.L){$('#street-map').innerHTML='<div class="map-unavailable"><h2>Street map unavailable</h2><p>Connect to the internet to load the basemap. You can still select an area and review its demo information.</p></div>';return}
 $('#street-map').innerHTML='';
 streetMap=L.map('street-map',{zoomControl:false,scrollWheelZoom:true}).setView(mapView.center||[-6.215,106.84],mapView.zoom);
 L.control.zoom({position:'topright'}).addTo(streetMap);
 const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,minZoom:9,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'}).addTo(streetMap);
 let tileCount=0;tiles.on('tileload',()=>tileCount++);tiles.on('tileerror',()=>{if(tileCount===0)toast('Some street tiles could not load. Check your internet connection.')});
 const colors=layerInfo[state.mapLayer].colors,selected=state.area;
 mapSites.forEach((site,i)=>{const raw=[2,2,1,2,1,1,1,1,0,0,1][i],level=state.day==='14-day'?Math.min(2,raw+1):raw,color=colors[level];const circle=L.circle([site.lat,site.lng],{radius:state.mapLayer==='Population density'?1400:state.day==='7-day'?1150:900,color,fillColor:color,weight:1,fillOpacity:.18,interactive:false}).addTo(streetMap);
 const marker=L.marker([site.lat,site.lng],{title:`Select ${site.name}, ${areas[site.area].name}`,alt:`Select ${site.name}, ${areas[site.area].name}`,icon:L.divIcon({className:'site-marker-shell',html:`<span class="site-marker ${site.area===selected?'selected':''}" style="--marker:${color}"></span>`,iconSize:[30,30],iconAnchor:[15,15]})}).addTo(streetMap);
 marker.options.title=`Select ${site.name}, ${areas[site.area].name}`;
 marker.bindTooltip(`<strong>${site.name}</strong><br>${areas[site.area].name}<br><small>Simulated ${layerInfo[state.mapLayer].labels[level].toLowerCase()} overlay</small>`,{direction:'top',offset:[0,-10]});marker.on('click',()=>{state.area=site.area;render()});
 });
 streetMap.on('moveend',()=>{mapView.center=[streetMap.getCenter().lat,streetMap.getCenter().lng];mapView.zoom=streetMap.getZoom()});
 $('#fit-jakarta').onclick=()=>streetMap.fitBounds([[-6.33,106.70],[-6.10,106.98]],{padding:[30,30]});
 const attribution=document.createElement('div');attribution.className='basemap-disclosure';attribution.textContent='Real street basemap · simulated risk overlays';$('#street-map').appendChild(attribution);
 const label=document.querySelector('.area-detail .risk-score>span');if(label)label.textContent='Simulated risk score';
}
render=function(){if(streetMap){streetMap.remove();streetMap=null}mapBaseRender();if(state.country==='Indonesia'&&state.tab==='visualize')setupStreetMap()};
render();
