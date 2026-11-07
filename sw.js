function db(){return new Promise((res,rej)=>{const r=indexedDB.open('pushlog',1);r.onupgradeneeded=()=>r.result.createObjectStore('log',{keyPath:'id',autoIncrement:true});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{
  let d={};try{d=e.data.json();}catch(_){}
  const receivedAt=Date.now();
  e.waitUntil((async()=>{
    const x=await db();
    await new Promise(res=>{const t=x.transaction('log','readwrite');t.objectStore('log').add({seq:d.seq,sentAt:d.sentAt,receivedAt});t.oncomplete=res;});
    await self.registration.showNotification('TradeForge test #'+d.seq,{body:'Incoming test push',requireInteraction:true,tag:'tf-'+d.seq});
  })());
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.openWindow('./'));});
