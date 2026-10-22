/* Osteon service worker. Version: 20261022-123303 */
var VER="20261022-123303",CACHE="anatomy-drill-"+VER;
var CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png","icon-maskable-512.png","favicon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE&&k.indexOf("anatomy-drill-")===0}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET")return;
  var u=new URL(r.url);
  if(r.mode==="navigate"||(u.origin===location.origin&&(u.pathname.endsWith("/")||u.pathname.endsWith("index.html")))){
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put("index.html",cp)});return res}).catch(function(){return caches.match("index.html").then(function(m){return m||caches.match("./")})}));
    return;
  }
  if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open(CACHE).then(function(c){return c.match(r).then(function(m){var f=fetch(r).then(function(res){c.put(r,res.clone());return res}).catch(function(){return m});return m||f})}));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)});return res})}));
  }
});
