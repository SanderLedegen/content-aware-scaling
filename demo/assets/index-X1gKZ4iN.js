var O=Object.defineProperty;var A=(e,t,n)=>t in e?O(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var S=(e,t,n)=>A(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const E=e=>{const t=new Array(e.width*e.height);for(let n=0;n<e.height;n+=1)for(let o=0;o<e.width;o+=1){if(n===0){t[n*e.width+o]=e.data[n*4*e.width+o*4];continue}const s=o>0?t[(n-1)*e.width+o-1]:1/0,r=t[(n-1)*e.width+o],i=o<e.width-1?t[(n-1)*e.width+o+1]:1/0;t[n*e.width+o]=e.data[n*4*e.width+o*4]+Math.min(s,r,i)}return t},R=(e,t,n)=>{const o=[],s=e.slice((n-1)*t,n*t),r=Math.min(...s);let i=s.indexOf(r);o.push(i);for(let c=n-2;c>=0;c-=1){const w=i>0?e[c*t+i-1]:1/0,d=e[c*t+i],h=i<t-1?e[c*t+i+1]:1/0,a=i+[w,d,h].indexOf(Math.min(w,d,h))-1;o.push(a),i=a}return o.reverse()},P=e=>{const t=new Uint8ClampedArray(e.data.length);for(let n=0;n<e.data.length;n+=4){const o=e.data[n+0],s=e.data[n+1],r=e.data[n+2],i=e.data[n+3],c=o*.2126+s*.7152+r*.0722;t[n+0]=c,t[n+1]=c,t[n+2]=c,t[n+3]=i}return new ImageData(t,e.width,e.height)},M=(e,t)=>{const n=Uint8ClampedArray.from(e.data);for(let o=0;o<t.length;o+=1){const s=o*4*e.width+t[o]*4;n[s+0]=255,n[s+1]=0,n[s+2]=0,n[s+3]=255}return new ImageData(n,e.width,e.height)},$=(e,t)=>{const n=new Uint8ClampedArray((e.width-1)*e.height*4);for(let o=0;o<e.height;o+=1){const s=e.data.slice(o*e.width*4,o*e.width*4+t[o]*4),r=e.data.slice(o*e.width*4+(t[o]+1)*4,(o+1)*e.width*4);n.set(s,o*(e.width-1)*4),n.set(r,o*(e.width-1)*4+s.length)}return new ImageData(n,e.width-1,e.height)};class U{constructor(t,n=2){S(this,"workers",[]);this.imageData=t,this.numWorkers=n;for(let o=0;o<this.numWorkers;o+=1){const s=new Worker(new URL("./convolve-worker-DOqd__nT.js",import.meta.url),{type:"module"});this.workers.push(s)}}async runIteration(){const t=P(this.imageData),n=await this.convolve(t),o=E(n),s=R(o,n.width,n.height),r=M(this.imageData,s),i=$(this.imageData,s);return this.imageData=i,{grayscaleImage:t,sobelImage:n,seamsImage:r,shrunkImage:i}}stop(){for(const t of this.workers)t.terminate()}convolve(t){const n=t.width*t.height,o=Math.floor(n/this.numWorkers),s=n%this.numWorkers;let r=0;const i=new Uint8ClampedArray(n*4);return new Promise((c,w)=>{for(let d=0;d<this.numWorkers;d+=1){const h=this.workers[d];h.onerror=f=>w(f),h.onmessageerror=f=>w(f),h.onmessage=f=>{const{data:q,start:C}=f.data;if(r+=1,i.set(q,C),r===this.numWorkers){const W=new ImageData(i,t.width,t.height);c(W)}};const a=d===this.numWorkers-1;h.postMessage({imageData:t.data,start:o*4*d,end:o*4*(d+1)+(a?s*4:0),width:t.width,height:t.height})}})}}const l=document.querySelector("#canvas-input"),b=l==null?void 0:l.getContext("2d"),u=document.querySelector("#canvas-output"),z=u==null?void 0:u.getContext("2d"),g=document.querySelector("#canvas-sobel"),I=document.querySelector("#canvas-seams"),m=document.querySelector("#go"),y=document.querySelector("#stop"),N=document.querySelector("#iterations"),x=document.querySelectorAll(".thumbnail"),T=document.querySelector("#input-dimensions"),v=document.querySelector("#output-dimensions"),B=document.querySelector("#numWorkers");let k;m.addEventListener("click",async()=>{const e=b.getImageData(0,0,l.width,l.height),t=+B.value;k=new U(e,t),m.disabled=!0,y.disabled=!1;const n=+N.value;console.log(`Running ${n} iterations using ${t} workers`),console.time("Resizing image");for(let o=0;o<n;o+=1){const{sobelImage:s,seamsImage:r,shrunkImage:i}=await k.runIteration();p(s,g),p(r,I),p(i,u)}m.disabled=!1,y.disabled=!0,console.timeEnd("Resizing image")});y.addEventListener("click",()=>{k.stop(),y.disabled=!0,m.disabled=!1});function p(e,t){t.width=e.width,t.height=e.height,v.textContent=`(${e.width} x ${e.height})`,t.getContext("2d").putImageData(e,0,0)}async function L(e){const t=new Image;t.src=e.src,await t.decode(),l.width=t.width,l.height=t.height,T.textContent=`(${t.width} x ${t.height})`,b.drawImage(t,0,0),v.textContent="",u.width=t.width,u.height=t.height,z.reset(),I.width=t.width,I.height=t.height,g.width=t.width,g.height=t.height,x.forEach(n=>n.classList.remove("selected")),e.classList.add("selected")}for(const e of x)e.addEventListener("click",async()=>{L(e)});L(x[0]);
