/* Osteon service worker. Version: 20261103-163737 */
var VER="20261103-163737",CACHE="anatomy-drill-"+VER,MODELS="osteon-models-1";
var CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png","icon-maskable-512.png","favicon.png"];
var BLIMG=["atlas_s.webp", "axis_a.webp", "axis_l.webp", "calcaneus_l.webp", "calcaneus_m.webp", "capitate_r.webp", "capitate_u.webp", "cervical_l.webp", "cervical_s.webp", "clavicle_i.webp", "clavicle_s.webp", "coccyx_a.webp", "coccyx_p.webp", "concha_l.webp", "concha_m.webp", "cuboid_a.webp", "cuboid_l.webp", "dphalanx_p.webp", "ethmoid_l.webp", "ethmoid_s.webp", "femur_a.webp", "femur_p.webp", "fibula_a.webp", "fibula_p.webp", "frontal_a.webp", "frontal_k.webp", "hamate_d.webp", "hamate_x.webp", "hip_l.webp", "hip_m.webp", "humerus_a.webp", "humerus_p.webp", "hyoid_a.webp", "incus_a.webp", "intcun_p.webp", "lacrimal_o.webp", "latcun_p.webp", "lumbar_l.webp", "lumbar_s.webp", "lunate_r.webp", "lunate_u.webp", "malleus_a.webp", "mandible_a.webp", "mandible_l.webp", "mandible_p.webp", "maxilla_l.webp", "maxilla_m.webp", "medcun_p.webp", "metacarpal1_l.webp", "metacarpal1_p.webp", "metacarpal_a.webp", "metacarpal_p.webp", "metatarsal1_l.webp", "metatarsal1_m.webp", "metatarsal5_l.webp", "metatarsal5_m.webp", "metatarsal_p.webp", "nasal_a.webp", "nasal_p.webp", "navicular_a.webp", "occipital_i.webp", "occipital_k.webp", "occipital_p.webp", "palatine_l.webp", "palatine_m.webp", "parietal_k.webp", "parietal_l.webp", "patella_a.webp", "patella_p.webp", "phalanx_a.webp", "phalanx_p.webp", "pisiform_a.webp", "pisiform_p.webp", "radius_a.webp", "radius_p.webp", "rib1112_p.webp", "rib1_s.webp", "rib2_s.webp", "rib_a.webp", "rib_p.webp", "sacrum_a.webp", "sacrum_l.webp", "sacrum_p.webp", "scaphoid_a.webp", "scaphoid_p.webp", "scapula_a.webp", "scapula_l.webp", "scapula_p.webp", "skull_a.webp", "skull_f.webp", "skull_i.webp", "skull_l.webp", "skull_s.webp", "sphenoid_a.webp", "sphenoid_s.webp", "stapes_a.webp", "sternum_a.webp", "sternum_p.webp", "talus_i.webp", "talus_s.webp", "temporal_i.webp", "temporal_k.webp", "temporal_l.webp", "thoracic_l.webp", "thoracic_s.webp", "tibia_a.webp", "tibia_p.webp", "toephalanx_p.webp", "trapezium_d.webp", "trapezium_u.webp", "trapezoid_r.webp", "trapezoid_u.webp", "triquetrum_a.webp", "triquetrum_r.webp", "ulna_a.webp", "ulna_p.webp", "vomer_l.webp", "zygomatic_a.webp", "zygomatic_m.webp"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
/* bone drawings are fetched in the background so the bone lab also works offline */
function warm(){return caches.open(CACHE).then(function(c){var i=0;function next(){if(i>=BLIMG.length)return;var u="blimg/"+BLIMG[i++];return c.match(u).then(function(m){if(m)return;return fetch(u).then(function(res){if(res.ok)return c.put(u,res)}).catch(function(){})}).then(next)}return next()}).catch(function(){})}
self.addEventListener("activate",function(e){e.waitUntil(Promise.all([caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE&&k.indexOf("anatomy-drill-")===0}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}),warm()]))});
/* network first for the page, but never wait more than a few seconds on a bad connection */
function pageFetch(r){return new Promise(function(res,rej){var done=false,t=setTimeout(function(){if(!done){done=true;rej(new Error("slow"))}},3500);
  fetch(r).then(function(x){if(done)return;done=true;clearTimeout(t);if(x.ok){var cp=x.clone();caches.open(CACHE).then(function(c){c.put("index.html",cp)});res(x)}else rej(new Error("status "+x.status))},function(err){if(done)return;done=true;clearTimeout(t);rej(err)})})}
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET")return;
  var u=new URL(r.url);
  if(r.mode==="navigate"||(u.origin===location.origin&&(u.pathname.endsWith("/")||u.pathname.endsWith("index.html")))){
    e.respondWith(pageFetch(r).catch(function(){return caches.match("index.html").then(function(m){return m||caches.match("./")}).then(function(m){return m||fetch(r)})}));
    return;
  }
  if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open(CACHE).then(function(c){return c.match(r).then(function(m){var f=fetch(r).then(function(res){if(res.ok||res.type==="opaque")c.put(r,res.clone());return res}).catch(function(){return m});return m||f})}));
    return;
  }
  if(u.origin===location.origin&&u.pathname.indexOf("/models/")>=0){
    if(/\.bin$/.test(u.pathname)){
      e.respondWith(caches.open(MODELS).then(function(c){return c.match(r).then(function(m){return m||fetch(r).then(function(res){if(res.ok)c.put(r,res.clone());return res})})}));
    }else{
      e.respondWith(fetch(r).then(function(res){if(res.ok){var cp=res.clone();caches.open(MODELS).then(function(c){c.put(r,cp)})}return res}).catch(function(){return caches.open(MODELS).then(function(c){return c.match(r)})}));
    }
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){if(res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}return res})}));
  }
});
