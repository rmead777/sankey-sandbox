import{i as e,n as t,r as n,t as r}from"./index-C-o5ui0U.js";var i=r(`download`,[[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}],[`polyline`,{points:`7 10 12 15 17 10`,key:`2ggqvy`}],[`line`,{x1:`12`,x2:`12`,y1:`15`,y2:`3`,key:`1vk2je`}]]),a=r(`folder-open`,[[`path`,{d:`m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2`,key:`usdka0`}]]),o=r(`image`,[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`,ry:`2`,key:`1m3agn`}],[`circle`,{cx:`9`,cy:`9`,r:`2`,key:`af1f0g`}],[`path`,{d:`m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21`,key:`1xmnt7`}]]),s=r(`library`,[[`path`,{d:`m16 6 4 14`,key:`ji33uf`}],[`path`,{d:`M12 6v14`,key:`1n7gus`}],[`path`,{d:`M8 8v12`,key:`1gg7y9`}],[`path`,{d:`M4 4v16`,key:`6qkkli`}]]),c=r(`link`,[[`path`,{d:`M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71`,key:`1cjeqo`}],[`path`,{d:`M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71`,key:`19qd67`}]]),l=r(`maximize-2`,[[`polyline`,{points:`15 3 21 3 21 9`,key:`mznyad`}],[`polyline`,{points:`9 21 3 21 3 15`,key:`1avn1i`}],[`line`,{x1:`21`,x2:`14`,y1:`3`,y2:`10`,key:`ota7mn`}],[`line`,{x1:`3`,x2:`10`,y1:`21`,y2:`14`,key:`1atl0r`}]]),u=r(`x`,[[`path`,{d:`M18 6 6 18`,key:`1bl5f8`}],[`path`,{d:`m6 6 12 12`,key:`d8bk6v`}]]),d=e(n(),1);function f(e){return Math.round(e*1e6)/1e6}function p(e,t){if(!Number.isFinite(e))return`—`;let n=Math.min(4,Math.max(0,t.decimals)),r=f(e).toLocaleString(`en-US`,{minimumFractionDigits:n,maximumFractionDigits:n});return`${t.prefix}${r}${t.suffix}`}function m(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)||`flume`}function h(e){return`&${e};`}function g(e){return e.replace(/&/g,h(`amp`)).replace(/</g,h(`lt`)).replace(/>/g,h(`gt`)).replace(/"/g,h(`quot`))}function _(e){let t=e.toLowerCase();return t.length===3?`#${t[0]}${t[0]}${t[1]}${t[1]}${t[2]}${t[2]}`:`#${t}`}var v=1e-6;function y(e){let t=e.lastIndexOf(`#`);if(t<0||t>0&&!/\s/.test(e[t-1]))return{name:e.trim(),color:null,opacity:null};let n=e.slice(t).trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?:\s*\.\s*(\d*\.?\d+))?$/);if(!n)return{name:e.trim(),color:null,opacity:null};let r=null;if(n[2]){let e=Number(n[2]);Number.isFinite(e)&&(r=Math.min(1,Math.max(0,e)))}return{name:e.slice(0,t).trim(),color:_(n[1]),opacity:r}}function b(e){let t=e.trim();if(t===`*`)return{kind:`rest`,amount:null};if(t===`?`)return{kind:`need`,amount:null};let n=Number(t.replace(/,/g,``));return!Number.isFinite(n)||n<=0?null:{kind:`value`,amount:n}}function x(e,t){let n=e.indexOf(`[`),r=e.indexOf(`]`,n+1);if(n<=0||r<0)return{error:`Expected Source [amount] Target`};let i=e.slice(0,n).trim();if(!i)return{error:`That flow needs a source.`};let a=b(e.slice(n+1,r));if(!a)return{error:`Amount should be a positive number, [*], or [?].`};let{name:o,color:s,opacity:c}=y(e.slice(r+1));return o?i===o?{error:`A flow can't start and end in the same place.`}:{flow:{line:t,source:i,target:o,color:s,opacity:c,...a}}:{error:`That flow needs a target.`}}function S(e){let t=e.slice(1).trim(),n=!1,r=!1,i=t.match(/^(.*?)(?:\s+((?:<<|>>)(?:\s*(?:<<|>>))*))\s*$/);i?.[2]&&(t=i[1].trim(),n=i[2].includes(`<<`),r=i[2].includes(`>>`));let{name:a,color:o}=y(t);return a?{style:{name:a,style:{color:o,paintIn:n,paintOut:r}}}:{error:`A node line needs a name, like :Rent #c4622d`}}function C(e){let t=[],n=new Map,r=[],i=e.split(/\r?\n/);for(let e=0;e<i.length;e++){let a=(i[e]??``).trim(),o=e+1;if(!a||a.startsWith(`//`))continue;if(a.startsWith(`:`)){let e=S(a);e.error?r.push({line:o,message:e.error}):e.style&&n.set(e.style.name,e.style.style);continue}let s=x(a,o);s.error||!s.flow?r.push({line:o,message:s.error??`Could not read that line.`}):t.push(s.flow)}return{flows:t,styles:n,errors:r}}function w(e){let t=0;for(let n of e)t+=n.value??0;return t}function T(e){let t=e.map(e=>({line:e.line,source:e.source,target:e.target,kind:e.kind,color:e.color,opacity:e.opacity,value:e.kind===`value`?e.amount:null})),n=[],r=[],i=new Set;for(let e of t)i.add(e.source),i.add(e.target);let a=new Set,o=t.length+3;for(;o-->0;){let e=!1;for(let r of i)E(r,t,n,a)&&(e=!0),D(r,t,n,a)&&(e=!0);if(!e)break}let s=[];for(let e of t){if(e.value==null){r.push({line:e.line,message:e.kind===`rest`?`Couldn't compute the remainder leaving ${e.source}. Give that step a numeric inflow first.`:`Couldn't compute the shortfall into ${e.target}. That step needs a known outflow.`});continue}let t=f(e.value);t<=v?n.push(`${e.source} → ${e.target} is zero, so it isn't drawn.`):s.push({...e,value:t})}return{flows:s,warnings:n,errors:r}}function E(e,t,n,r){let i=t.filter(t=>t.source===e),a=t.filter(t=>t.target===e),o=i.filter(e=>e.value==null),s=o.filter(e=>e.kind===`rest`);if(s.length===0||o.length!==s.length||a.some(e=>e.value==null)||a.length===0&&i.every(e=>e.value==null))return!1;let c=f(w(a)-w(i.filter(e=>e.value!=null)));if(c<0){let t=`over:${e}`;r.has(t)||(r.add(t),n.push(`${e} already sends more than it receives. The remainder is zero.`)),c=0}s.length>1&&!r.has(`split:${e}`)&&(r.add(`split:${e}`),n.push(`${e} has ${s.length} remainder flows. The leftover is split evenly.`));let l=c/s.length;for(let e of s)e.value=l;return!0}function D(e,t,n,r){let i=t.filter(t=>t.source===e),a=t.filter(t=>t.target===e),o=a.filter(e=>e.value==null),s=o.filter(e=>e.kind===`need`);if(s.length===0||o.length!==s.length||i.length===0||i.some(e=>e.value==null))return!1;let c=f(w(i)-w(a.filter(e=>e.value!=null)));if(c<0){let t=`under:${e}`;r.has(t)||(r.add(t),n.push(`${e} already receives more than it sends. The shortfall is zero.`)),c=0}s.length>1&&!r.has(`needs:${e}`)&&(r.add(`needs:${e}`),n.push(`${e} has ${s.length} shortfall flows. The gap is split evenly.`));let l=c/s.length;for(let e of s)e.value=l;return!0}function O(e){let t=new Map;for(let n of e){let e=t.get(n.source);e?e.push(n.target):t.set(n.source,[n.target])}let n=new Map,r=[];function i(e){n.set(e,1),r.push(e);for(let a of t.get(e)??[]){let e=n.get(a)??0;if(e===1){let e=r.indexOf(a);return[...r.slice(e),a]}if(e===0){let e=i(a);if(e)return e}}return r.pop(),n.set(e,2),null}for(let e of t.keys()){if((n.get(e)??0)!==0)continue;let t=i(e);if(t)return`These flows loop (${t.join(` → `)}). A diagram needs a direction.`}return null}function k(e){let t=e.trim().split(/\r?\n/).map(e=>e.trim()).filter(Boolean);if(t.length===0||t.some(e=>e.includes(`[`)))return null;let n=t.map(e=>(e.includes(`	`)?e.split(`	`):A(e)).map(e=>e.trim()));if(n.some(e=>e.length<3))return null;let r=n[0].map(e=>e.toLowerCase()),i=r.some(e=>[`source`,`from`,`target`,`to`,`amount`,`value`].includes(e))&&n.length>1?n.slice(1):n;if(i.length===0)return null;let a=[0,1,2].find(e=>i.filter(t=>j(t[e]??``)).length>=Math.ceil(i.length*.8));if(a==null)return null;let o=[0,1,2].filter(e=>e!==a),s=o[0],c=o[1];return r[s]?.match(/target|to/)&&r[c]?.match(/source|from/)&&([s,c]=[c,s]),i.map(e=>{let t=(e[a]??``).replace(/[$,\s]/g,``);return`${e[s]} [${t}] ${e[c]}`}).join(`
`)}function A(e){let t=[],n=``,r=!1;for(let i of e)i===`"`?r=!r:i===`,`&&!r?(t.push(n),n=``):n+=i;return t.push(n),t}function j(e){let t=Number(e.replace(/[$,\s]/g,``));return Number.isFinite(t)&&t>0}var M=[`#1f4b4a`,`#c4622d`,`#3d5a3d`,`#8c3a3a`,`#3a4a6b`,`#8a6232`,`#4a4458`,`#2f6f6a`,`#7a4e3a`,`#3e5c48`],ee={cream:{bg:`#f3eee6`,fg:`#1c1915`,muted:`#6f675e`,rule:`#e39a62`},white:{bg:`#fbfbfa`,fg:`#1a1a1a`,muted:`#5e5a55`,rule:`#e39a62`},ink:{bg:`#1c1915`,fg:`#f4efe6`,muted:`#b3a89c`,rule:`#e39a62`}},N={prefix:``,suffix:``,decimals:0,width:1120,height:680,nodeWidth:16,nodeGap:20,flowOpacity:.5,align:`justify`,sort:`entry`,showLabels:!0,showValues:!0,paper:`cream`},P=`flume.project.v1`;function F(e){return!!e&&typeof e==`object`&&!Array.isArray(e)}function te(e){let t=F(e)?e:{},n=t.align,r=t.sort,i=t.paper;return{...N,prefix:typeof t.prefix==`string`?t.prefix:N.prefix,suffix:typeof t.suffix==`string`?t.suffix:N.suffix,decimals:I(t.decimals,0,4,N.decimals),width:I(t.width,640,2400,N.width),height:I(t.height,420,2400,N.height),nodeWidth:I(t.nodeWidth,6,40,N.nodeWidth),nodeGap:I(t.nodeGap,4,64,N.nodeGap),flowOpacity:I(t.flowOpacity,.08,.95,N.flowOpacity),align:n===`left`||n===`right`||n===`center`||n===`justify`?n:N.align,sort:r===`value`||r===`entry`?r:N.sort,showLabels:typeof t.showLabels==`boolean`?t.showLabels:N.showLabels,showValues:typeof t.showValues==`boolean`?t.showValues:N.showValues,paper:i===`cream`||i===`white`||i===`ink`?i:N.paper}}function I(e,t,n,r){let i=typeof e==`number`?e:typeof e==`string`?Number(e):NaN;return Number.isFinite(i)?Math.min(n,Math.max(t,i)):r}function L(e){if(!F(e)||typeof e.source!=`string`)return null;let t={};if(F(e.offsets))for(let[n,r]of Object.entries(e.offsets))typeof r==`number`&&Number.isFinite(r)&&(t[n]=r);return{v:1,title:typeof e.title==`string`?e.title:`Untitled`,subtitle:typeof e.subtitle==`string`?e.subtitle:``,source:e.source,settings:te(e.settings),offsets:t}}function ne(){try{let e=localStorage.getItem(P);return e?L(JSON.parse(e)):null}catch{return null}}function re(e){try{localStorage.setItem(P,JSON.stringify(e))}catch{}}async function ie(e){let t=new Blob([JSON.stringify(e)]).stream().pipeThrough(new CompressionStream(`gzip`)),n=new Uint8Array(await new Response(t).arrayBuffer()),r=``;for(let e of n)r+=String.fromCharCode(e);return btoa(r).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/g,``)}async function ae(e){let t=e.replace(/-/g,`+`).replace(/_/g,`/`)+`===`.slice((e.length+3)%4),n=atob(t),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);let i=new Blob([r]).stream().pipeThrough(new DecompressionStream(`gzip`)),a=await new Response(i).text();return L(JSON.parse(a))}async function oe(){let e=window.location.hash;if(!e.startsWith(`#f=`))return null;try{return await ae(e.slice(3))}catch{return null}}function R(e,t){let n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=e,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(n)}async function se(e,t){let n=new DOMParser().parseFromString(e,`image/svg+xml`).documentElement,r=Number(n.getAttribute(`width`)),i=Number(n.getAttribute(`height`));if(!r||!i)throw Error(`This diagram has no size yet.`);let a=URL.createObjectURL(new Blob([e],{type:`image/svg+xml;charset=utf-8`}));try{let e=new Image;e.decoding=`async`,await new Promise((t,n)=>{e.onload=()=>t(),e.onerror=()=>n(Error(`Could not draw the image.`)),e.src=a});let n=document.createElement(`canvas`);n.width=Math.round(r*t),n.height=Math.round(i*t);let o=n.getContext(`2d`);if(!o)throw Error(`Could not draw the image.`);o.drawImage(e,0,0,n.width,n.height);let s=await new Promise(e=>n.toBlob(e,`image/png`));if(!s)throw Error(`Could not encode the PNG.`);return s}finally{URL.revokeObjectURL(a)}}function z(e,t){let n;if(t===void 0)for(let t of e)t!=null&&(n<t||n===void 0&&t>=t)&&(n=t);else{let r=-1;for(let i of e)(i=t(i,++r,e))!=null&&(n<i||n===void 0&&i>=i)&&(n=i)}return n}function ce(e,t){let n;if(t===void 0)for(let t of e)t!=null&&(n>t||n===void 0&&t>=t)&&(n=t);else{let r=-1;for(let i of e)(i=t(i,++r,e))!=null&&(n>i||n===void 0&&i>=i)&&(n=i)}return n}function B(e,t){let n=0;if(t===void 0)for(let t of e)(t=+t)&&(n+=t);else{let r=-1;for(let i of e)(i=+t(i,++r,e))&&(n+=i)}return n}function le(e){return e.target.depth}function ue(e){return e.depth}function de(e,t){return t-1-e.height}function V(e,t){return e.sourceLinks.length?e.depth:t-1}function fe(e){return e.targetLinks.length?e.depth:e.sourceLinks.length?ce(e.sourceLinks,le)-1:0}function H(e){return function(){return e}}function U(e,t){return W(e.source,t.source)||e.index-t.index}function pe(e,t){return W(e.target,t.target)||e.index-t.index}function W(e,t){return e.y0-t.y0}function G(e){return e.value}function me(e){return e.index}function he(e){return e.nodes}function ge(e){return e.links}function _e(e,t){let n=e.get(t);if(!n)throw Error(`missing: `+t);return n}function ve({nodes:e}){for(let t of e){let e=t.y0,n=e;for(let n of t.sourceLinks)n.y0=e+n.width/2,e+=n.width;for(let e of t.targetLinks)e.y1=n+e.width/2,n+=e.width}}function ye(){let e=0,t=0,n=1,r=1,i=24,a=8,o,s=me,c=V,l,u,d=he,f=ge,p=6;function m(){let e={nodes:d.apply(null,arguments),links:f.apply(null,arguments)};return h(e),g(e),_(e),v(e),x(e),ve(e),e}m.update=function(e){return ve(e),e},m.nodeId=function(e){return arguments.length?(s=typeof e==`function`?e:H(e),m):s},m.nodeAlign=function(e){return arguments.length?(c=typeof e==`function`?e:H(e),m):c},m.nodeSort=function(e){return arguments.length?(l=e,m):l},m.nodeWidth=function(e){return arguments.length?(i=+e,m):i},m.nodePadding=function(e){return arguments.length?(a=o=+e,m):a},m.nodes=function(e){return arguments.length?(d=typeof e==`function`?e:H(e),m):d},m.links=function(e){return arguments.length?(f=typeof e==`function`?e:H(e),m):f},m.linkSort=function(e){return arguments.length?(u=e,m):u},m.size=function(i){return arguments.length?(e=t=0,n=+i[0],r=+i[1],m):[n-e,r-t]},m.extent=function(i){return arguments.length?(e=+i[0][0],n=+i[1][0],t=+i[0][1],r=+i[1][1],m):[[e,t],[n,r]]},m.iterations=function(e){return arguments.length?(p=+e,m):p};function h({nodes:e,links:t}){for(let[t,n]of e.entries())n.index=t,n.sourceLinks=[],n.targetLinks=[];let n=new Map(e.map((t,n)=>[s(t,n,e),t]));for(let[e,r]of t.entries()){r.index=e;let{source:t,target:i}=r;typeof t!=`object`&&(t=r.source=_e(n,t)),typeof i!=`object`&&(i=r.target=_e(n,i)),t.sourceLinks.push(r),i.targetLinks.push(r)}if(u!=null)for(let{sourceLinks:t,targetLinks:n}of e)t.sort(u),n.sort(u)}function g({nodes:e}){for(let t of e)t.value=t.fixedValue===void 0?Math.max(B(t.sourceLinks,G),B(t.targetLinks,G)):t.fixedValue}function _({nodes:e}){let t=e.length,n=new Set(e),r=new Set,i=0;for(;n.size;){for(let e of n){e.depth=i;for(let{target:t}of e.sourceLinks)r.add(t)}if(++i>t)throw Error(`circular link`);n=r,r=new Set}}function v({nodes:e}){let t=e.length,n=new Set(e),r=new Set,i=0;for(;n.size;){for(let e of n){e.height=i;for(let{source:t}of e.targetLinks)r.add(t)}if(++i>t)throw Error(`circular link`);n=r,r=new Set}}function y({nodes:t}){let r=z(t,e=>e.depth)+1,a=(n-e-i)/(r-1),o=Array(r);for(let n of t){let t=Math.max(0,Math.min(r-1,Math.floor(c.call(null,n,r))));n.layer=t,n.x0=e+t*a,n.x1=n.x0+i,o[t]?o[t].push(n):o[t]=[n]}if(l)for(let e of o)e.sort(l);return o}function b(e){let n=ce(e,e=>(r-t-(e.length-1)*o)/B(e,G));for(let i of e){let e=t;for(let t of i){t.y0=e,t.y1=e+t.value*n,e=t.y1+o;for(let e of t.sourceLinks)e.width=e.value*n}e=(r-e+o)/(i.length+1);for(let t=0;t<i.length;++t){let n=i[t];n.y0+=e*(t+1),n.y1+=e*(t+1)}O(i)}}function x(e){let n=y(e);o=Math.min(a,(r-t)/(z(n,e=>e.length)-1)),b(n);for(let e=0;e<p;++e){let t=.99**e,r=Math.max(1-t,(e+1)/p);C(n,t,r),S(n,t,r)}}function S(e,t,n){for(let r=1,i=e.length;r<i;++r){let i=e[r];for(let e of i){let n=0,r=0;for(let{source:t,value:i}of e.targetLinks){let a=i*(e.layer-t.layer);n+=k(t,e)*a,r+=a}if(!(r>0))continue;let i=(n/r-e.y0)*t;e.y0+=i,e.y1+=i,D(e)}l===void 0&&i.sort(W),w(i,n)}}function C(e,t,n){for(let r=e.length-2;r>=0;--r){let i=e[r];for(let e of i){let n=0,r=0;for(let{target:t,value:i}of e.sourceLinks){let a=i*(t.layer-e.layer);n+=A(e,t)*a,r+=a}if(!(r>0))continue;let i=(n/r-e.y0)*t;e.y0+=i,e.y1+=i,D(e)}l===void 0&&i.sort(W),w(i,n)}}function w(e,n){let i=e.length>>1,a=e[i];E(e,a.y0-o,i-1,n),T(e,a.y1+o,i+1,n),E(e,r,e.length-1,n),T(e,t,0,n)}function T(e,t,n,r){for(;n<e.length;++n){let i=e[n],a=(t-i.y0)*r;a>1e-6&&(i.y0+=a,i.y1+=a),t=i.y1+o}}function E(e,t,n,r){for(;n>=0;--n){let i=e[n],a=(i.y1-t)*r;a>1e-6&&(i.y0-=a,i.y1-=a),t=i.y0-o}}function D({sourceLinks:e,targetLinks:t}){if(u===void 0){for(let{source:{sourceLinks:e}}of t)e.sort(pe);for(let{target:{targetLinks:t}}of e)t.sort(U)}}function O(e){if(u===void 0)for(let{sourceLinks:t,targetLinks:n}of e)t.sort(pe),n.sort(U)}function k(e,t){let n=e.y0-(e.sourceLinks.length-1)*o/2;for(let{target:r,width:i}of e.sourceLinks){if(r===t)break;n+=i+o}for(let{source:r,width:i}of t.targetLinks){if(r===e)break;n-=i}return n}function A(e,t){let n=t.y0-(t.targetLinks.length-1)*o/2;for(let{source:r,width:i}of t.targetLinks){if(r===e)break;n+=i+o}for(let{target:r,width:i}of e.sourceLinks){if(r===t)break;n-=i}return n}return m}var K=1e-4,be={justify:V,left:ue,right:de,center:fe};function xe(e){let t=[],n=new Map,r=new Map,i=e=>{n.has(e)||(n.set(e,0),r.set(e,0),t.push(e))};for(let t of e)i(t.source),i(t.target),r.set(t.source,(r.get(t.source)??0)+t.value),n.set(t.target,(n.get(t.target)??0)+t.value);return t.map(e=>{let t=f(n.get(e)??0),i=f(r.get(e)??0);return{name:e,inn:t,out:i,gap:f(t-i)}})}function Se(e,t){return e.length*t*.56}function Ce(e,t,n,r,i){let a=Math.max(i,0)/2,o=(e+t)/2,s=e=>Math.round(e*100)/100;return[`M${s(e)},${s(n-a)}`,`C${s(o)},${s(n-a)} ${s(o)},${s(r-a)} ${s(t)},${s(r-a)}`,`L${s(t)},${s(r+a)}`,`C${s(o)},${s(r+a)} ${s(o)},${s(n+a)} ${s(e)},${s(n+a)}`,`Z`].join(``)}function we(e){let t=C(e.source),n=T(t.flows),r=[...n.warnings],i=[...t.errors,...n.errors],a={scene:null,meta:{errors:i,warnings:r,balances:[],computed:[],totalIn:0,totalOut:0}};if(n.flows.length===0)return a;let o=O(n.flows);if(o)return i.push({line:0,message:o}),{scene:null,meta:{...a.meta,errors:i}};let s=xe(n.flows);for(let[e]of t.styles)s.some(t=>t.name===e)||r.push(`${e} is styled, but it isn't in a flow.`);let c=new Map,l=0;for(let e of s){let n=t.styles.get(e.name)?.color;c.set(e.name,n??M[l++%M.length])}let u=e.settings,d=ee[u.paper],m=s.filter(e=>e.inn<=K&&e.out>K),h=s.filter(e=>e.out<=K&&e.inn>K),g=f(m.reduce((e,t)=>e+t.out,0)),_=f(h.reduce((e,t)=>e+t.inn,0)),v=e=>{if(!u.showLabels)return 0;let t=p(Math.max(s.find(t=>t.name===e)?.inn??0,s.find(t=>t.name===e)?.out??0),u);return Math.max(Se(e,13),u.showValues?Se(t,11):0)},y=32+(u.showLabels?Math.max(0,...m.map(e=>v(e.name))):0),b=32+(u.showLabels?Math.max(0,...h.map(e=>v(e.name)),...s.map(e=>v(e.name)*0)):0),x=e.title&&e.subtitle?84:e.title?68:28,S=Math.max(m.length,h.length,1),w=Math.max(u.width,y+b+u.nodeWidth*3+80),E=Math.max(u.height,x+32+S*26+Math.max(0,S-1)*u.nodeGap),D=ye().nodeId(e=>String(e.id)).nodeWidth(u.nodeWidth).nodePadding(u.nodeGap).nodeAlign(be[u.align]).iterations(32).extent([[y,x],[w-b,E-32]]).nodeSort(u.sort===`value`?(e,t)=>(t.value??0)-(e.value??0):null),k;try{k=D({nodes:s.map(e=>({id:e.name})),links:n.flows.map(e=>({source:e.source,target:e.target,value:e.value,color:e.color,opacity:e.opacity,kind:e.kind}))})}catch(e){let t=e instanceof Error?e.message:`Could not lay out these flows.`,a=t.toLowerCase().includes(`circular`)?`These flows loop. A diagram needs a direction.`:t;return i.push({line:0,message:a}),{scene:null,meta:{errors:i,warnings:r,balances:s,computed:Te(n.flows),totalIn:g,totalOut:_}}}for(let t of k.nodes){let n=e.offsets[String(t.id)]??0;if(!n||t.y0==null||t.y1==null)continue;let r=t.y1-t.y0,i=Math.max(x,Math.min(E-32-r,t.y0+n));t.y0=i,t.y1=i+r}D.update(k);let A=k.nodes.map(e=>({id:String(e.id),x:e.x0??0,y:e.y0??0,w:(e.x1??0)-(e.x0??0),h:Math.max(0,(e.y1??0)-(e.y0??0)),color:c.get(String(e.id))??M[0],value:e.value??0})),j=new Map(A.map(e=>[e.id,e])),N=k.nodes.reduce((e,t)=>Math.max(e,t.layer??0),0),P=[];k.links.forEach((e,n)=>{let r=e.source,i=e.target;if(typeof r==`string`||typeof i==`string`)return;let a=String(r.id),o=String(i.id),s=j.get(a),c=j.get(o);if(!s||!c||e.y0==null||e.y1==null||e.width==null)return;let l=t.styles.get(a),d=t.styles.get(o),f=typeof e.color==`string`?e.color:null,p=typeof e.opacity==`number`?e.opacity:u.flowOpacity,m=null,h=f??s.color;if(!f&&l?.paintOut&&l.color)h=l.color;else if(!f&&d?.paintIn&&d.color)h=d.color;else if(!f){let t=`g${n}`;m={id:t,x1:s.x+s.w,y1:e.y0,x2:c.x,y2:e.y1,from:s.color,to:c.color},h=`url(#${t})`}P.push({id:`${a}->${o}:${n}`,d:Ce(s.x+s.w,c.x,e.y0,e.y1,e.width),fill:h,opacity:p,source:a,target:o,gradient:m})});let F=u.showLabels?k.nodes.flatMap(e=>{let t=String(e.id),n=j.get(t);if(!n||e.y0==null||e.y1==null||e.layer==null)return[];let r=e.layer===0&&N>0;return[{id:t,x:r?n.x-10:n.x+n.w+10,y:n.y+n.h/2,anchor:r?`end`:`start`,name:t,value:p(e.value??0,u),showValue:u.showValues}]}):[];return{scene:{width:w,height:E,paper:d,title:e.title,subtitle:e.subtitle,links:P,nodes:A,labels:F},meta:{errors:i,warnings:r,balances:s,computed:Te(n.flows),totalIn:g,totalOut:_}}}function Te(e){let t=[];for(let n of e)n.kind!==`value`&&t.push({source:n.source,target:n.target,value:n.value,kind:n.kind});return t}var Ee=`Source Sans 3, Segoe UI, Helvetica, sans-serif`,De=`Fraunces, Georgia, Times New Roman, serif`;function Oe(e){let{paper:t}=e,n=e.links.filter(e=>e.gradient).map(e=>{let t=e.gradient;return`<linearGradient id="${t.id}" gradientUnits="userSpaceOnUse" x1="${t.x1}" y1="${t.y1}" x2="${t.x2}" y2="${t.y2}"><stop offset="0%" stop-color="${t.from}"/><stop offset="100%" stop-color="${t.to}"/></linearGradient>`}).join(``),r=e.links.map(e=>`<path data-flow="${g(e.id)}" data-source="${g(e.source)}" data-target="${g(e.target)}" data-opacity="${e.opacity}" d="${e.d}" fill="${e.fill}" opacity="${e.opacity}"/>`).join(``),i=e.nodes.map(e=>`<rect data-node="${g(e.id)}" x="${e.x}" y="${e.y}" width="${e.w}" height="${Math.max(e.h,.8)}" rx="2" fill="${e.color}"/>`).join(``),a=e.labels.map(e=>{let n=e.showValue?`<tspan x="${e.x}" dy="1.2em" fill="${t.muted}" font-size="11">${g(e.value)}</tspan>`:``,r=e.showValue?`-0.45em`:`0.35em`;return`<text data-label="${g(e.id)}" x="${e.x}" y="${e.y}" text-anchor="${e.anchor}" fill="${t.fg}" font-family="${Ee}" font-size="13" stroke="${t.bg}" stroke-width="3" paint-order="stroke fill" stroke-linejoin="round"><tspan x="${e.x}" dy="${r}">${g(e.name)}</tspan>${n}</text>`}).join(``),o=e.title?`<text x="32" y="40" fill="${t.fg}" font-family="${De}" font-size="${e.title.length>42?22:28}" font-weight="560">${g(e.title)}</text>`:``,s=e.subtitle?`<text x="32" y="62" fill="${t.muted}" font-family="${Ee}" font-size="14">${g(e.subtitle)}</text>`:``,c=e.title&&e.subtitle?74:e.title?56:0,l=e.title?`<rect x="32" y="${c}" width="36" height="2" fill="${t.rule}"/>`:``;return`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${e.width}" height="${e.height}" viewBox="0 0 ${e.width} ${e.height}" role="img" aria-label="${g(e.title||`Sankey diagram`)}">
<style>text{font-variant-numeric:tabular-nums}</style>
<rect width="100%" height="100%" fill="${t.bg}"/>
${o}${s}${l}
<defs>${n}</defs>
<g class="flows">${r}</g>
<g class="nodes">${i}</g>
<g class="labels">${a}</g>
</svg>`}function ke(e){let t=we(e);return{scene:t.scene,svg:t.scene?Oe(t.scene):``,meta:t.meta}}function q(e,t,n,r){return{v:1,title:e,subtitle:t,source:n.trim()+`
`,settings:{...N,...r},offsets:{}}}var J=[{id:`year`,name:`Where the year went`,blurb:`A company, source to profit`,project:q(`Where the year went`,`Thousands. Illustrative.`,`
// Money in
Product [4200] Revenue
Services [1800] Revenue
Licensing [640] Revenue

// What it cost to deliver
Revenue [2100] Cost of revenue
Revenue [*] Gross profit

// Running the company
Gross profit [980] People
Gross profit [310] Go to market
Gross profit [240] Infrastructure
Gross profit [150] General & admin
Gross profit [*] Operating profit

// What remained
Operating profit [740] Tax
Operating profit [*] Net profit

:Product #1f6a62
:Services #3d8b78
:Licensing #7e9a72
:Revenue #1c2e2c
:Cost of revenue #8f3d32
:Gross profit #1f4b4a
:People #c4622d
:Go to market #c48a3a
:Infrastructure #3a4a6b
:General & admin #8a7564
:Operating profit #1f4b4a
:Tax #6e3b3b
:Net profit #143f3a
`,{align:`left`,width:1180,height:700,prefix:``,decimals:0})},{id:`home`,name:`A month at home`,blurb:`Income, spending, what remains`,project:q(`A month at home`,`After tax. Illustrative.`,`
// A month, after tax
Wages [6400] Budget
Side work [480] Budget

Budget [2100] Rent
Budget [860] Food
Budget [420] Transport
Budget [310] Utilities
Budget [240] Health
Budget [180] Everything else
Budget [*] Savings

:Wages #1f4b4a
:Side work #3d8b78
:Budget #1c2e2c
:Rent #8f3d32
:Food #c4622d
:Transport #c48a3a
:Utilities #3a4a6b
:Health #6e3b3b
:Everything else #8a7564
:Savings #143f3a
`,{align:`justify`,prefix:`$`,decimals:0,width:1080,height:640})},{id:`grid`,name:`A small grid`,blurb:`Fuel, generation, end use`,project:q(`A small grid`,`Units of energy. Illustrative.`,`
// Fuel in
Coal [12] Generation
Gas [31] Generation
Nuclear [18] Generation
Wind [16] Generation
Solar [9] Generation
Oil [28] Engines
Biofuel [4] Engines

Generation [8] Losses
Generation [*] Grid

Grid [24] Homes
Grid [21] Industry
Grid [*] Shops

Engines [*] Mobility

:Coal #3a3532
:Gas #c4622d
:Nuclear #3a4a6b
:Wind #3d8b78
:Solar #c48a3a
:Oil #6e3b3b
:Biofuel #7e9a72
:Generation #1c2e2c
:Engines #243044
:Losses #8a7564
:Grid #1f4b4a
:Homes #c4622d
:Industry #3a4a6b
:Shops #8a6232
:Mobility #143f3a
`,{align:`left`,decimals:0,width:1120,height:760,nodeGap:16})},{id:`cherry`,name:`Cherry to cup`,blurb:`Shrinkage, step by step`,project:q(`Cherry to cup`,`One hundred units of fruit.`,`
// One hundred units of fruit, and where they go
Harvest [100] Cherry

Cherry [82] Washed
Cherry [*] Rejected fruit

Washed [70] Green bean
Washed [*] Pulp and water

Green bean [64] Roaster
Green bean [*] Dockage

Roaster [52] Bags
Roaster [*] Roast loss

Bags [28] Cafes
Bags [15] Grocers
Bags [*] Subscriptions

:Harvest #7e9a72
:Cherry #8f3d32
:Rejected fruit #8a7564
:Washed #c4622d
:Pulp and water #6e3b3b
:Green bean #3d5a3d
:Dockage #8a7564
:Roaster #1c2e2c
:Roast loss #6e3b3b
:Bags #c48a3a
:Cafes #1f4b4a
:Grocers #3a4a6b
:Subscriptions #143f3a
`,{align:`left`,decimals:0,width:1180,height:720})}],Ae=J[0].project,je='"use strict";var FlumeEngine=(()=>{var ot=Object.defineProperty;var Nt=Object.getOwnPropertyDescriptor;var Ft=Object.getOwnPropertyNames;var It=Object.prototype.hasOwnProperty;var Tt=(e,n)=>{for(var r in n)ot(e,r,{get:n[r],enumerable:!0})},Ct=(e,n,r,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let s of Ft(n))!It.call(e,s)&&s!==r&&ot(e,s,{get:()=>n[s],enumerable:!(o=Nt(n,s))||o.enumerable});return e};var Rt=e=>Ct(ot({},"__esModule",{value:!0}),e);var Kt={};Tt(Kt,{render:()=>Mt});function V(e,n){let r;if(n===void 0)for(let o of e)o!=null&&(r<o||r===void 0&&o>=o)&&(r=o);else{let o=-1;for(let s of e)(s=n(s,++o,e))!=null&&(r<s||r===void 0&&s>=s)&&(r=s)}return r}function C(e,n){let r;if(n===void 0)for(let o of e)o!=null&&(r>o||r===void 0&&o>=o)&&(r=o);else{let o=-1;for(let s of e)(s=n(s,++o,e))!=null&&(r>s||r===void 0&&s>=s)&&(r=s)}return r}function R(e,n){let r=0;if(n===void 0)for(let o of e)(o=+o)&&(r+=o);else{let o=-1;for(let s of e)(s=+n(s,++o,e))&&(r+=s)}return r}function Pt(e){return e.target.depth}function st(e){return e.depth}function it(e,n){return n-1-e.height}function G(e,n){return e.sourceLinks.length?e.depth:n-1}function at(e){return e.targetLinks.length?e.depth:e.sourceLinks.length?C(e.sourceLinks,Pt)-1:0}function P(e){return function(){return e}}function ct(e,n){return Y(e.source,n.source)||e.index-n.index}function dt(e,n){return Y(e.target,n.target)||e.index-n.index}function Y(e,n){return e.y0-n.y0}function lt(e){return e.value}function At(e){return e.index}function Dt(e){return e.nodes}function Ot(e){return e.links}function mt(e,n){let r=e.get(n);if(!r)throw new Error("missing: "+n);return r}function gt({nodes:e}){for(let n of e){let r=n.y0,o=r;for(let s of n.sourceLinks)s.y0=r+s.width/2,r+=s.width;for(let s of n.targetLinks)s.y1=o+s.width/2,o+=s.width}}function Z(){let e=0,n=0,r=1,o=1,s=24,u=8,m,c=At,g=G,b,f,w=Dt,p=Ot,F=6;function x(){let t={nodes:w.apply(null,arguments),links:p.apply(null,arguments)};return W(t),A(t),H(t),U(t),q(t),gt(t),t}x.update=function(t){return gt(t),t},x.nodeId=function(t){return arguments.length?(c=typeof t=="function"?t:P(t),x):c},x.nodeAlign=function(t){return arguments.length?(g=typeof t=="function"?t:P(t),x):g},x.nodeSort=function(t){return arguments.length?(b=t,x):b},x.nodeWidth=function(t){return arguments.length?(s=+t,x):s},x.nodePadding=function(t){return arguments.length?(u=m=+t,x):u},x.nodes=function(t){return arguments.length?(w=typeof t=="function"?t:P(t),x):w},x.links=function(t){return arguments.length?(p=typeof t=="function"?t:P(t),x):p},x.linkSort=function(t){return arguments.length?(f=t,x):f},x.size=function(t){return arguments.length?(e=n=0,r=+t[0],o=+t[1],x):[r-e,o-n]},x.extent=function(t){return arguments.length?(e=+t[0][0],r=+t[1][0],n=+t[0][1],o=+t[1][1],x):[[e,n],[r,o]]},x.iterations=function(t){return arguments.length?(F=+t,x):F};function W({nodes:t,links:i}){for(let[d,l]of t.entries())l.index=d,l.sourceLinks=[],l.targetLinks=[];let a=new Map(t.map((d,l)=>[c(d,l,t),d]));for(let[d,l]of i.entries()){l.index=d;let{source:h,target:y}=l;typeof h!="object"&&(h=l.source=mt(a,h)),typeof y!="object"&&(y=l.target=mt(a,y)),h.sourceLinks.push(l),y.targetLinks.push(l)}if(f!=null)for(let{sourceLinks:d,targetLinks:l}of t)d.sort(f),l.sort(f)}function A({nodes:t}){for(let i of t)i.value=i.fixedValue===void 0?Math.max(R(i.sourceLinks,lt),R(i.targetLinks,lt)):i.fixedValue}function H({nodes:t}){let i=t.length,a=new Set(t),d=new Set,l=0;for(;a.size;){for(let h of a){h.depth=l;for(let{target:y}of h.sourceLinks)d.add(y)}if(++l>i)throw new Error("circular link");a=d,d=new Set}}function U({nodes:t}){let i=t.length,a=new Set(t),d=new Set,l=0;for(;a.size;){for(let h of a){h.height=l;for(let{source:y}of h.targetLinks)d.add(y)}if(++l>i)throw new Error("circular link");a=d,d=new Set}}function D({nodes:t}){let i=V(t,l=>l.depth)+1,a=(r-e-s)/(i-1),d=new Array(i);for(let l of t){let h=Math.max(0,Math.min(i-1,Math.floor(g.call(null,l,i))));l.layer=h,l.x0=e+h*a,l.x1=l.x0+s,d[h]?d[h].push(l):d[h]=[l]}if(b)for(let l of d)l.sort(b);return d}function O(t){let i=C(t,a=>(o-n-(a.length-1)*m)/R(a,lt));for(let a of t){let d=n;for(let l of a){l.y0=d,l.y1=d+l.value*i,d=l.y1+m;for(let h of l.sourceLinks)h.width=h.value*i}d=(o-d+m)/(a.length+1);for(let l=0;l<a.length;++l){let h=a[l];h.y0+=d*(l+1),h.y1+=d*(l+1)}nt(a)}}function q(t){let i=D(t);m=Math.min(u,(o-n)/(V(i,a=>a.length)-1)),O(i);for(let a=0;a<F;++a){let d=Math.pow(.99,a),l=Math.max(1-d,(a+1)/F);z(i,d,l),K(i,d,l)}}function K(t,i,a){for(let d=1,l=t.length;d<l;++d){let h=t[d];for(let y of h){let L=0,$=0;for(let{source:M,value:E}of y.targetLinks){let I=E*(y.layer-M.layer);L+=J(M,y)*I,$+=I}if(!($>0))continue;let N=(L/$-y.y0)*i;y.y0+=N,y.y1+=N,T(y)}b===void 0&&h.sort(Y),j(h,a)}}function z(t,i,a){for(let d=t.length,l=d-2;l>=0;--l){let h=t[l];for(let y of h){let L=0,$=0;for(let{target:M,value:E}of y.sourceLinks){let I=E*(M.layer-y.layer);L+=rt(y,M)*I,$+=I}if(!($>0))continue;let N=(L/$-y.y0)*i;y.y0+=N,y.y1+=N,T(y)}b===void 0&&h.sort(Y),j(h,a)}}function j(t,i){let a=t.length>>1,d=t[a];B(t,d.y0-m,a-1,i),S(t,d.y1+m,a+1,i),B(t,o,t.length-1,i),S(t,n,0,i)}function S(t,i,a,d){for(;a<t.length;++a){let l=t[a],h=(i-l.y0)*d;h>1e-6&&(l.y0+=h,l.y1+=h),i=l.y1+m}}function B(t,i,a,d){for(;a>=0;--a){let l=t[a],h=(l.y1-i)*d;h>1e-6&&(l.y0-=h,l.y1-=h),i=l.y0-m}}function T({sourceLinks:t,targetLinks:i}){if(f===void 0){for(let{source:{sourceLinks:a}}of i)a.sort(dt);for(let{target:{targetLinks:a}}of t)a.sort(ct)}}function nt(t){if(f===void 0)for(let{sourceLinks:i,targetLinks:a}of t)i.sort(dt),a.sort(ct)}function J(t,i){let a=t.y0-(t.sourceLinks.length-1)*m/2;for(let{target:d,width:l}of t.sourceLinks){if(d===i)break;a+=l+m}for(let{source:d,width:l}of i.targetLinks){if(d===t)break;a-=l}return a}function rt(t,i){let a=i.y0-(i.targetLinks.length-1)*m/2;for(let{source:d,width:l}of i.targetLinks){if(d===t)break;a+=l+m}for(let{target:d,width:l}of t.sourceLinks){if(d===i)break;a-=l}return a}return x}function k(e){return Math.round(e*1e6)/1e6}function ut(e,n){if(!Number.isFinite(e))return"\\u2014";let r=Math.min(4,Math.max(0,n.decimals)),o=k(e).toLocaleString("en-US",{minimumFractionDigits:r,maximumFractionDigits:r});return`${n.prefix}${o}${n.suffix}`}function Q(e){return`&${e};`}function v(e){return e.replace(/&/g,Q("amp")).replace(/</g,Q("lt")).replace(/>/g,Q("gt")).replace(/"/g,Q("quot"))}function pt(e){let n=e.toLowerCase();return n.length===3?`#${n[0]}${n[0]}${n[1]}${n[1]}${n[2]}${n[2]}`:`#${n}`}var zt=1e-6;function ht(e){let n=e.lastIndexOf("#");if(n<0)return{name:e.trim(),color:null,opacity:null};if(n>0&&!/\\s/.test(e[n-1]))return{name:e.trim(),color:null,opacity:null};let o=e.slice(n).trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?:\\s*\\.\\s*(\\d*\\.?\\d+))?$/);if(!o)return{name:e.trim(),color:null,opacity:null};let s=null;if(o[2]){let u=Number(o[2]);Number.isFinite(u)&&(s=Math.min(1,Math.max(0,u)))}return{name:e.slice(0,n).trim(),color:pt(o[1]),opacity:s}}function jt(e){let n=e.trim();if(n==="*")return{kind:"rest",amount:null};if(n==="?")return{kind:"need",amount:null};let r=Number(n.replace(/,/g,""));return!Number.isFinite(r)||r<=0?null:{kind:"value",amount:r}}function Bt(e,n){let r=e.indexOf("["),o=e.indexOf("]",r+1);if(r<=0||o<0)return{error:"Expected Source [amount] Target"};let s=e.slice(0,r).trim();if(!s)return{error:"That flow needs a source."};let u=jt(e.slice(r+1,o));if(!u)return{error:"Amount should be a positive number, [*], or [?]."};let{name:m,color:c,opacity:g}=ht(e.slice(o+1));return m?s===m?{error:"A flow can\'t start and end in the same place."}:{flow:{line:n,source:s,target:m,color:c,opacity:g,...u}}:{error:"That flow needs a target."}}function Et(e){let n=e.slice(1).trim(),r=!1,o=!1,s=n.match(/^(.*?)(?:\\s+((?:<<|>>)(?:\\s*(?:<<|>>))*))\\s*$/);s?.[2]&&(n=s[1].trim(),r=s[2].includes("<<"),o=s[2].includes(">>"));let{name:u,color:m}=ht(n);return u?{style:{name:u,style:{color:m,paintIn:r,paintOut:o}}}:{error:"A node line needs a name, like :Rent #c4622d"}}function yt(e){let n=[],r=new Map,o=[],s=e.split(/\\r?\\n/);for(let u=0;u<s.length;u++){let c=(s[u]??"").trim(),g=u+1;if(!c||c.startsWith("//"))continue;if(c.startsWith(":")){let f=Et(c);f.error?o.push({line:g,message:f.error}):f.style&&r.set(f.style.name,f.style.style);continue}let b=Bt(c,g);b.error||!b.flow?o.push({line:g,message:b.error??"Could not read that line."}):n.push(b.flow)}return{flows:n,styles:r,errors:o}}function _(e){let n=0;for(let r of e)n+=r.value??0;return n}function xt(e){let n=e.map(g=>({line:g.line,source:g.source,target:g.target,kind:g.kind,color:g.color,opacity:g.opacity,value:g.kind==="value"?g.amount:null})),r=[],o=[],s=new Set;for(let g of n)s.add(g.source),s.add(g.target);let u=new Set,m=n.length+3;for(;m-- >0;){let g=!1;for(let b of s)Vt(b,n,r,u)&&(g=!0),Gt(b,n,r,u)&&(g=!0);if(!g)break}let c=[];for(let g of n){if(g.value==null){o.push({line:g.line,message:g.kind==="rest"?`Couldn\'t compute the remainder leaving ${g.source}. Give that step a numeric inflow first.`:`Couldn\'t compute the shortfall into ${g.target}. That step needs a known outflow.`});continue}let b=k(g.value);if(b<=zt){r.push(`${g.source} \\u2192 ${g.target} is zero, so it isn\'t drawn.`);continue}c.push({...g,value:b})}return{flows:c,warnings:r,errors:o}}function Vt(e,n,r,o){let s=n.filter(p=>p.source===e),u=n.filter(p=>p.target===e),m=s.filter(p=>p.value==null),c=m.filter(p=>p.kind==="rest");if(c.length===0||m.length!==c.length||u.some(p=>p.value==null)||u.length===0&&s.every(p=>p.value==null))return!1;let g=_(u),b=_(s.filter(p=>p.value!=null)),f=k(g-b);if(f<0){let p=`over:${e}`;o.has(p)||(o.add(p),r.push(`${e} already sends more than it receives. The remainder is zero.`)),f=0}c.length>1&&!o.has(`split:${e}`)&&(o.add(`split:${e}`),r.push(`${e} has ${c.length} remainder flows. The leftover is split evenly.`));let w=f/c.length;for(let p of c)p.value=w;return!0}function Gt(e,n,r,o){let s=n.filter(p=>p.source===e),u=n.filter(p=>p.target===e),m=u.filter(p=>p.value==null),c=m.filter(p=>p.kind==="need");if(c.length===0||m.length!==c.length||s.length===0||s.some(p=>p.value==null))return!1;let g=_(s),b=_(u.filter(p=>p.value!=null)),f=k(g-b);if(f<0){let p=`under:${e}`;o.has(p)||(o.add(p),r.push(`${e} already receives more than it sends. The shortfall is zero.`)),f=0}c.length>1&&!o.has(`needs:${e}`)&&(o.add(`needs:${e}`),r.push(`${e} has ${c.length} shortfall flows. The gap is split evenly.`));let w=f/c.length;for(let p of c)p.value=w;return!0}function bt(e){let n=new Map;for(let u of e){let m=n.get(u.source);m?m.push(u.target):n.set(u.source,[u.target])}let r=new Map,o=[];function s(u){r.set(u,1),o.push(u);for(let m of n.get(u)??[]){let c=r.get(m)??0;if(c===1){let g=o.indexOf(m);return[...o.slice(g),m]}if(c===0){let g=s(m);if(g)return g}}return o.pop(),r.set(u,2),null}for(let u of n.keys()){if((r.get(u)??0)!==0)continue;let m=s(u);if(m)return`These flows loop (${m.join(" \\u2192 ")}). A diagram needs a direction.`}return null}var tt=["#1f4b4a","#c4622d","#3d5a3d","#8c3a3a","#3a4a6b","#8a6232","#4a4458","#2f6f6a","#7a4e3a","#3e5c48"],wt={cream:{bg:"#f3eee6",fg:"#1c1915",muted:"#6f675e",rule:"#e39a62"},white:{bg:"#fbfbfa",fg:"#1a1a1a",muted:"#5e5a55",rule:"#e39a62"},ink:{bg:"#1c1915",fg:"#f4efe6",muted:"#b3a89c",rule:"#e39a62"}};var et=1e-4,Wt={justify:G,left:st,right:it,center:at};function Ht(e){let n=[],r=new Map,o=new Map,s=u=>{r.has(u)||(r.set(u,0),o.set(u,0),n.push(u))};for(let u of e)s(u.source),s(u.target),o.set(u.source,(o.get(u.source)??0)+u.value),r.set(u.target,(r.get(u.target)??0)+u.value);return n.map(u=>{let m=k(r.get(u)??0),c=k(o.get(u)??0);return{name:u,inn:m,out:c,gap:k(m-c)}})}function $t(e,n){return e.length*n*.56}function Ut(e,n,r,o,s){let u=Math.max(s,0)/2,m=(e+n)/2,c=g=>Math.round(g*100)/100;return[`M${c(e)},${c(r-u)}`,`C${c(m)},${c(r-u)} ${c(m)},${c(o-u)} ${c(n)},${c(o-u)}`,`L${c(n)},${c(o+u)}`,`C${c(m)},${c(o+u)} ${c(m)},${c(r+u)} ${c(e)},${c(r+u)}`,"Z"].join("")}function vt(e){let n=yt(e.source),r=xt(n.flows),o=[...r.warnings],s=[...n.errors,...r.errors],u={scene:null,meta:{errors:s,warnings:o,balances:[],computed:[],totalIn:0,totalOut:0}};if(r.flows.length===0)return u;let m=bt(r.flows);if(m)return s.push({line:0,message:m}),{scene:null,meta:{...u.meta,errors:s}};let c=Ht(r.flows);for(let[t]of n.styles)c.some(i=>i.name===t)||o.push(`${t} is styled, but it isn\'t in a flow.`);let g=new Map,b=0;for(let t of c){let i=n.styles.get(t.name)?.color;g.set(t.name,i??tt[b++%tt.length])}let f=e.settings,w=wt[f.paper],p=c.filter(t=>t.inn<=et&&t.out>et),F=c.filter(t=>t.out<=et&&t.inn>et),x=k(p.reduce((t,i)=>t+i.out,0)),W=k(F.reduce((t,i)=>t+i.inn,0)),A=t=>{if(!f.showLabels)return 0;let i=ut(Math.max(c.find(a=>a.name===t)?.inn??0,c.find(a=>a.name===t)?.out??0),f);return Math.max($t(t,13),f.showValues?$t(i,11):0)},H=32+(f.showLabels?Math.max(0,...p.map(t=>A(t.name))):0),U=32+(f.showLabels?Math.max(0,...F.map(t=>A(t.name)),...c.map(t=>A(t.name)*0)):0),D=e.title&&e.subtitle?84:e.title?68:28,O=32,q=Math.max(p.length,F.length,1),K=Math.max(f.width,H+U+f.nodeWidth*3+80),z=Math.max(f.height,D+O+q*26+Math.max(0,q-1)*f.nodeGap),j=Z().nodeId(t=>String(t.id)).nodeWidth(f.nodeWidth).nodePadding(f.nodeGap).nodeAlign(Wt[f.align]).iterations(32).extent([[H,D],[K-U,z-O]]).nodeSort(f.sort==="value"?(t,i)=>(i.value??0)-(t.value??0):null),S;try{S=j({nodes:c.map(t=>({id:t.name})),links:r.flows.map(t=>({source:t.source,target:t.target,value:t.value,color:t.color,opacity:t.opacity,kind:t.kind}))})}catch(t){let i=t instanceof Error?t.message:"Could not lay out these flows.",a=i.toLowerCase().includes("circular")?"These flows loop. A diagram needs a direction.":i;return s.push({line:0,message:a}),{scene:null,meta:{errors:s,warnings:o,balances:c,computed:kt(r.flows),totalIn:x,totalOut:W}}}for(let t of S.nodes){let i=e.offsets[String(t.id)]??0;if(!i||t.y0==null||t.y1==null)continue;let a=t.y1-t.y0,d=Math.max(D,Math.min(z-O-a,t.y0+i));t.y0=d,t.y1=d+a}j.update(S);let B=S.nodes.map(t=>({id:String(t.id),x:t.x0??0,y:t.y0??0,w:(t.x1??0)-(t.x0??0),h:Math.max(0,(t.y1??0)-(t.y0??0)),color:g.get(String(t.id))??tt[0],value:t.value??0})),T=new Map(B.map(t=>[t.id,t])),nt=S.nodes.reduce((t,i)=>Math.max(t,i.layer??0),0),J=[];S.links.forEach((t,i)=>{let a=t.source,d=t.target;if(typeof a=="string"||typeof d=="string")return;let l=String(a.id),h=String(d.id),y=T.get(l),L=T.get(h);if(!y||!L||t.y0==null||t.y1==null||t.width==null)return;let $=n.styles.get(l),N=n.styles.get(h),M=typeof t.color=="string"?t.color:null,E=typeof t.opacity=="number"?t.opacity:f.flowOpacity,I=null,X=M??y.color;if(!M&&$?.paintOut&&$.color)X=$.color;else if(!M&&N?.paintIn&&N.color)X=N.color;else if(!M){let ft=`g${i}`;I={id:ft,x1:y.x+y.w,y1:t.y0,x2:L.x,y2:t.y1,from:y.color,to:L.color},X=`url(#${ft})`}J.push({id:`${l}->${h}:${i}`,d:Ut(y.x+y.w,L.x,t.y0,t.y1,t.width),fill:X,opacity:E,source:l,target:h,gradient:I})});let rt=f.showLabels?S.nodes.flatMap(t=>{let i=String(t.id),a=T.get(i);if(!a||t.y0==null||t.y1==null||t.layer==null)return[];let d=t.layer===0&&nt>0;return[{id:i,x:d?a.x-10:a.x+a.w+10,y:a.y+a.h/2,anchor:d?"end":"start",name:i,value:ut(t.value??0,f),showValue:f.showValues}]}):[];return{scene:{width:K,height:z,paper:w,title:e.title,subtitle:e.subtitle,links:J,nodes:B,labels:rt},meta:{errors:s,warnings:o,balances:c,computed:kt(r.flows),totalIn:x,totalOut:W}}}function kt(e){let n=[];for(let r of e)r.kind!=="value"&&n.push({source:r.source,target:r.target,value:r.value,kind:r.kind});return n}var St="Source Sans 3, Segoe UI, Helvetica, sans-serif",qt="Fraunces, Georgia, Times New Roman, serif";function Lt(e){let{paper:n}=e,r=e.links.filter(f=>f.gradient).map(f=>{let w=f.gradient;return`<linearGradient id="${w.id}" gradientUnits="userSpaceOnUse" x1="${w.x1}" y1="${w.y1}" x2="${w.x2}" y2="${w.y2}"><stop offset="0%" stop-color="${w.from}"/><stop offset="100%" stop-color="${w.to}"/></linearGradient>`}).join(""),o=e.links.map(f=>`<path data-flow="${v(f.id)}" data-source="${v(f.source)}" data-target="${v(f.target)}" data-opacity="${f.opacity}" d="${f.d}" fill="${f.fill}" opacity="${f.opacity}"/>`).join(""),s=e.nodes.map(f=>`<rect data-node="${v(f.id)}" x="${f.x}" y="${f.y}" width="${f.w}" height="${Math.max(f.h,.8)}" rx="2" fill="${f.color}"/>`).join(""),u=e.labels.map(f=>{let w=f.showValue?`<tspan x="${f.x}" dy="1.2em" fill="${n.muted}" font-size="11">${v(f.value)}</tspan>`:"",p=f.showValue?"-0.45em":"0.35em";return`<text data-label="${v(f.id)}" x="${f.x}" y="${f.y}" text-anchor="${f.anchor}" fill="${n.fg}" font-family="${St}" font-size="13" stroke="${n.bg}" stroke-width="3" paint-order="stroke fill" stroke-linejoin="round"><tspan x="${f.x}" dy="${p}">${v(f.name)}</tspan>${w}</text>`}).join(""),m=e.title?`<text x="32" y="40" fill="${n.fg}" font-family="${qt}" font-size="${e.title.length>42?22:28}" font-weight="560">${v(e.title)}</text>`:"",c=e.subtitle?`<text x="32" y="62" fill="${n.muted}" font-family="${St}" font-size="14">${v(e.subtitle)}</text>`:"",g=e.title&&e.subtitle?74:e.title?56:0,b=e.title?`<rect x="32" y="${g}" width="36" height="2" fill="${n.rule}"/>`:"";return`<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${e.width}" height="${e.height}" viewBox="0 0 ${e.width} ${e.height}" role="img" aria-label="${v(e.title||"Sankey diagram")}">\n<style>text{font-variant-numeric:tabular-nums}</style>\n<rect width="100%" height="100%" fill="${n.bg}"/>\n${m}${c}${b}\n<defs>${r}</defs>\n<g class="flows">${o}</g>\n<g class="nodes">${s}</g>\n<g class="labels">${u}</g>\n</svg>`}function Mt(e){let n=vt(e);return{scene:n.scene,svg:n.scene?Lt(n.scene):"",meta:n.meta}}return Rt(Kt);})();\n';function Me(e){return JSON.stringify(e).replace(/</g,`\\u003c`)}function Ne(e){let t=e.title||`Flume diagram`,n=je.replace(/<\/script/gi,`<\\/script`);return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${g(t)}</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    background: #221e1a;
    color: #f4efe6;
    font: 16px/1.45 "Segoe UI", Helvetica, sans-serif;
    min-height: 100%;
  }
  header, main { max-width: 1180px; margin: 0 auto; }
  header { display: flex; gap: 16px; align-items: flex-end; padding: 28px 20px 8px; }
  .mark { font-family: Georgia, "Times New Roman", serif; font-size: 28px; letter-spacing: -0.03em; }
  .mark span { color: #e39a62; }
  h1 { font-family: Georgia, "Times New Roman", serif; font-weight: 560; font-size: 28px; margin: 0; letter-spacing: -0.03em; }
  .sub { margin: 4px 0 0; color: #b3a89c; }
  main { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 18px; padding: 12px 20px 40px; align-items: start; }
  #stage { background: #f3eee6; border-radius: 12px; overflow: auto; box-shadow: 0 18px 50px rgb(0 0 0 / 0.28); }
  #stage svg { display: block; width: 100%; height: auto; }
  #stage path { transition: opacity 160ms ease; }
  aside { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
  label { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #b3a89c; }
  textarea {
    width: 100%; min-height: 280px; resize: vertical; border-radius: 10px;
    border: 1px solid #463e36; background: #2c2722; color: #f4efe6;
    font: 13px/1.5 ui-monospace, Menlo, Consolas, monospace; padding: 12px;
  }
  textarea:focus { outline: 2px solid #e39a62; outline-offset: 1px; }
  .status { font-size: 14px; }
  .status.off { color: #f0b2a4; }
  .row { font-size: 14px; color: #b3a89c; }
  .row strong { color: #f4efe6; font-weight: 600; }
  .warn { color: #e39a62; font-size: 14px; margin: 0; }
  .hint { color: #b3a89c; font-size: 13px; margin: 8px 0 0; }
  button {
    font: inherit; color: #2a160c; background: #e39a62; border: 0; border-radius: 999px;
    min-height: 44px; padding: 0 16px; cursor: pointer;
  }
  @media (max-width: 860px) {
    main { grid-template-columns: 1fr; }
    header { flex-direction: column; align-items: flex-start; }
  }
  @media (prefers-reduced-motion: reduce) {
    #stage path { transition: none; }
  }
  @media print {
    body { background: white; }
    aside, .hint, button { display: none !important; }
    main { display: block; max-width: none; padding: 0; }
    #stage { box-shadow: none; }
  }
</style>
</head>
<body>
<header>
  <div class="mark">Fl<span>u</span>me</div>
  <div>
    <h1 id="title">${g(t)}</h1>
    <p class="sub" id="sub">${g(e.subtitle)}</p>
  </div>
</header>
<main>
  <div id="stage"></div>
  <aside>
    <label for="source">Flows</label>
    <textarea id="source" spellcheck="false" aria-label="Flows"></textarea>
    <div id="status" class="status"></div>
    <div id="extra"></div>
    <button id="png" type="button">Download PNG</button>
    <p class="hint">This file is the whole instrument. Edit a line, or drag a bar. Nothing to install, and nothing leaves the browser.</p>
  </aside>
</main>
<script id="flume-project" type="application/json">${Me(e)}<\/script>
<script>${n}<\/script>
<script>
(function () {
  var project = JSON.parse(document.getElementById("flume-project").textContent);
  var stage = document.getElementById("stage");
  var source = document.getElementById("source");
  var status = document.getElementById("status");
  var extra = document.getElementById("extra");
  source.value = project.source;
  var drag = null;

  function money(n) {
    var d = project.settings.decimals || 0;
    var body = Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
    return (project.settings.prefix || "") + body + (project.settings.suffix || "");
  }

  function draw() {
    var out = FlumeEngine.render(project);
    stage.innerHTML = out.svg || '<p style="color:#1c1915;padding:28px;font-family:Georgia,serif">Add a flow to draw the diagram.</p>';
    var gap = Math.abs(out.meta.totalIn - out.meta.totalOut) > 0.0001;
    status.className = "status" + (gap ? " off" : "");
    status.textContent = gap
      ? "Off by " + money(out.meta.totalIn - out.meta.totalOut) + " · " + money(out.meta.totalIn) + " in, " + money(out.meta.totalOut) + " out"
      : "Balances · " + money(out.meta.totalIn) + " in and out";
    var bits = [];
    out.meta.computed.forEach(function (row) {
      var text = row.kind === "rest"
        ? row.target + " is the remainder of " + row.source
        : row.source + " fills the shortfall into " + row.target;
      bits.push('<p class="row"><strong>' + escapeText(text) + '</strong> · ' + money(row.value) + '</p>');
    });
    out.meta.errors.forEach(function (err) {
      bits.push('<p class="warn">' + escapeText(err.line ? "Line " + err.line + ": " : "") + escapeText(err.message) + '</p>');
    });
    out.meta.warnings.forEach(function (warning) {
      bits.push('<p class="warn">' + escapeText(warning) + '</p>');
    });
    out.meta.balances.forEach(function (row) {
      if (Math.abs(row.gap) < 0.0001) return;
      bits.push('<p class="warn">' + escapeText(row.name) + ' is off by ' + money(row.gap) + '</p>');
    });
    extra.innerHTML = bits.join("");
    document.getElementById("title").textContent = project.title || "Untitled";
    document.getElementById("sub").textContent = project.subtitle || "";
    document.title = project.title || "Flume diagram";
  }

  function escapeText(value) {
    function entity(name) { return "&" + name + ";"; }
    return String(value).replace(/&/g, entity("amp")).replace(/</g, entity("lt")).replace(/>/g, entity("gt"));
  }

  function highlight(nodeId, flow) {
    var flows = stage.querySelectorAll("[data-flow]");
    var nodes = stage.querySelectorAll("[data-node]");
    var labels = stage.querySelectorAll("[data-label]");
    flows.forEach(function (el) {
      var base = Number(el.getAttribute("data-opacity") || "0.5");
      var on = !nodeId && !flow
        || (flow && el === flow)
        || (nodeId && (el.getAttribute("data-source") === nodeId || el.getAttribute("data-target") === nodeId));
      el.style.opacity = String(on ? Math.min(0.92, base + 0.25) : base * 0.12);
    });
    nodes.forEach(function (el) {
      var id = el.getAttribute("data-node");
      var on = !nodeId && !flow || id === nodeId || (flow && (flow.getAttribute("data-source") === id || flow.getAttribute("data-target") === id));
      if (nodeId && id !== nodeId) {
        var linked = false;
        flows.forEach(function (f) {
          if (f.getAttribute("data-source") === nodeId && f.getAttribute("data-target") === id) linked = true;
          if (f.getAttribute("data-target") === nodeId && f.getAttribute("data-source") === id) linked = true;
        });
        on = linked || id === nodeId;
      }
      el.style.opacity = on || (!nodeId && !flow) ? "1" : "0.25";
    });
    labels.forEach(function (el) {
      var id = el.getAttribute("data-label");
      var bar = stage.querySelector('[data-node="' + CSS.escape(id) + '"]');
      el.style.opacity = bar ? bar.style.opacity : "1";
    });
  }

  source.addEventListener("input", function () {
    project.source = source.value;
    project.offsets = {};
    draw();
  });

  stage.addEventListener("pointerover", function (event) {
    var node = event.target.closest && event.target.closest("[data-node]");
    var flow = event.target.closest && event.target.closest("[data-flow]");
    highlight(node && node.getAttribute("data-node"), flow);
  });
  stage.addEventListener("pointerleave", function () { highlight(null, null); });

  stage.addEventListener("pointerdown", function (event) {
    var node = event.target.closest && event.target.closest("[data-node]");
    if (!node) return;
    var svg = stage.querySelector("svg");
    if (!svg) return;
    event.preventDefault();
    var rect = svg.getBoundingClientRect();
    var id = node.getAttribute("data-node");
    drag = {
      id: id,
      y: event.clientY,
      scale: svg.viewBox.baseVal.height / rect.height,
      base: project.offsets[id] || 0
    };
  });
  window.addEventListener("pointermove", function (event) {
    if (!drag) return;
    project.offsets[drag.id] = drag.base + (event.clientY - drag.y) * drag.scale;
    draw();
  });
  window.addEventListener("pointerup", function () { drag = null; });
  stage.addEventListener("dblclick", function (event) {
    var node = event.target.closest && event.target.closest("[data-node]");
    if (!node) return;
    delete project.offsets[node.getAttribute("data-node")];
    draw();
  });

  document.getElementById("png").addEventListener("click", function () {
    var svg = stage.querySelector("svg");
    if (!svg) return;
    var xml = new XMLSerializer().serializeToString(svg);
    var w = svg.viewBox.baseVal.width;
    var h = svg.viewBox.baseVal.height;
    var url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = w * 2;
      canvas.height = h * 2;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (blob) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = ${JSON.stringify(m(e.title))}.replace(/[^a-z0-9-]/g, "") || "flume";
        a.download += ".png";
        a.click();
      }, "image/png");
    };
    img.src = url;
  });

  draw();
})();
<\/script>
</body>
</html>`}var Y=t(),X=`Source Sans 3, Segoe UI, Helvetica, sans-serif`,Pe=`Fraunces, Georgia, Times New Roman, serif`;function Fe(e,t){return t?t.kind===`link`?e.id===t.id:e.source===t.id||e.target===t.id:!0}function Ie(e,t,n){if(!t)return!0;if(t.kind===`node`)return e===t.id||n.some(n=>(n.source===t.id||n.target===t.id)&&(n.source===e||n.target===e));let r=n.find(e=>e.id===t.id);return r?.source===e||r?.target===e}function Le({scene:e,focus:t,offsets:n,onFocus:r,onOffset:i}){let a=(0,d.useRef)(null),o=(0,d.useRef)(null),s=(0,d.useRef)(i);s.current=i,(0,d.useEffect)(()=>{let e=e=>{let t=o.current;t&&s.current(t.id,t.base+(e.clientY-t.y)*t.scale)},t=()=>{o.current=null};return window.addEventListener(`pointermove`,e),window.addEventListener(`pointerup`,t),()=>{window.removeEventListener(`pointermove`,e),window.removeEventListener(`pointerup`,t)}},[]);let c=e.title&&e.subtitle?74:e.title?56:0;return(0,Y.jsxs)(`svg`,{ref:a,viewBox:`0 0 ${e.width} ${e.height}`,width:e.width,height:e.height,className:`block h-auto w-full select-none`,role:`group`,"aria-label":e.title||`Sankey diagram`,onPointerLeave:()=>r(null),children:[(0,Y.jsx)(`rect`,{width:`100%`,height:`100%`,fill:e.paper.bg}),e.title?(0,Y.jsx)(`text`,{x:32,y:40,fill:e.paper.fg,fontFamily:Pe,fontSize:e.title.length>42?22:28,fontWeight:560,children:e.title}):null,e.subtitle?(0,Y.jsx)(`text`,{x:32,y:62,fill:e.paper.muted,fontFamily:X,fontSize:14,children:e.subtitle}):null,e.title?(0,Y.jsx)(`rect`,{x:32,y:c,width:36,height:2,fill:e.paper.rule}):null,(0,Y.jsx)(`defs`,{children:e.links.map(e=>e.gradient?(0,Y.jsxs)(`linearGradient`,{id:e.gradient.id,gradientUnits:`userSpaceOnUse`,x1:e.gradient.x1,y1:e.gradient.y1,x2:e.gradient.x2,y2:e.gradient.y2,children:[(0,Y.jsx)(`stop`,{offset:`0%`,stopColor:e.gradient.from}),(0,Y.jsx)(`stop`,{offset:`100%`,stopColor:e.gradient.to})]},e.gradient.id):null)}),(0,Y.jsx)(`g`,{children:e.links.map(e=>{let n=Fe(e,t);return(0,Y.jsx)(`path`,{d:e.d,fill:e.fill,opacity:n?Math.min(.92,e.opacity+(t?.28:0)):e.opacity*.12,className:`cursor-pointer transition-opacity duration-150`,onPointerEnter:()=>r({kind:`link`,id:e.id}),children:(0,Y.jsx)(`title`,{children:`${e.source} → ${e.target}`})},e.id)})}),(0,Y.jsx)(`g`,{children:e.nodes.map(s=>{let c=Ie(s.id,t,e.links),l=Math.max(s.h,18);return(0,Y.jsxs)(`g`,{opacity:c?1:.22,className:`transition-opacity duration-150`,children:[(0,Y.jsx)(`rect`,{x:s.x,y:s.y,width:s.w,height:Math.max(s.h,.8),rx:2,fill:s.color,pointerEvents:`none`}),(0,Y.jsx)(`rect`,{x:s.x-8,y:s.y-(l-s.h)/2,width:s.w+16,height:l,fill:`transparent`,className:`cursor-ns-resize touch-none`,onPointerEnter:()=>r({kind:`node`,id:s.id}),onPointerDown:e=>{let t=a.current;if(!t)return;e.preventDefault();let r=t.getBoundingClientRect(),i=t.viewBox.baseVal;o.current={id:s.id,y:e.clientY,scale:i.height/r.height,base:n[s.id]??0}},onDoubleClick:e=>{e.preventDefault(),o.current=null,i(s.id,0)},children:(0,Y.jsx)(`title`,{children:`${s.id}. Drag to nudge, double-click to reset.`})})]},s.id)})}),(0,Y.jsx)(`g`,{pointerEvents:`none`,style:{fontVariantNumeric:`tabular-nums`},children:e.labels.map(n=>{let r=Ie(n.id,t,e.links);return(0,Y.jsxs)(`text`,{x:n.x,y:n.y,textAnchor:n.anchor,fill:e.paper.fg,fontFamily:X,fontSize:13,stroke:e.paper.bg,strokeWidth:3,paintOrder:`stroke fill`,strokeLinejoin:`round`,opacity:r?1:.28,className:`transition-opacity duration-150`,children:[(0,Y.jsx)(`tspan`,{x:n.x,dy:n.showValue?`-0.45em`:`0.35em`,children:n.name}),n.showValue?(0,Y.jsx)(`tspan`,{x:n.x,dy:`1.2em`,fill:e.paper.muted,fontSize:11,stroke:e.paper.bg,children:n.value}):null]},n.id)})})]})}var Re=[{label:`Standard`,width:1120,height:680},{label:`Wide`,width:1440,height:740},{label:`Tall`,width:900,height:1040}];function ze(){let[e,t]=(0,d.useState)(Ae),[n,r]=(0,d.useState)(!1),[f,h]=(0,d.useState)(null),[g,_]=(0,d.useState)(!1),[v,y]=(0,d.useState)(null),[b,x]=(0,d.useState)(null),[S,C]=(0,d.useState)(`diagram`),w=(0,d.useRef)(null);(0,d.useEffect)(()=>{let e=!1;return(async()=>{let n=await oe()??ne()??Ae;e||(t(n),r(!0))})(),()=>{e=!0}},[]),(0,d.useEffect)(()=>{n&&re(e)},[e,n]),(0,d.useEffect)(()=>{if(!b)return;let e=window.setTimeout(()=>x(null),3600);return()=>window.clearTimeout(e)},[b]),(0,d.useEffect)(()=>{if(!g)return;let e=e=>{e.key===`Escape`&&_(!1)};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[g]);let{meta:T,scene:E,svg:D}=(0,d.useMemo)(()=>ke(e),[e]),O=Math.abs(T.totalIn-T.totalOut)<1e-4,A=Object.values(e.offsets).some(e=>Math.abs(e)>.5);function j(e){t(t=>({...t,...e}))}function M(e){t(t=>({...t,settings:{...t.settings,...e}}))}function ee(e){let n=J.find(t=>t.id===e);n&&(t(structuredClone(n.project)),y(null),h(null),C(`diagram`),x(n.name))}async function N(){let t=await ie(e);if(t.length>7e3){x(`Too big for a link. Download the HTML page instead.`),h(`download`);return}let n=new URL(window.location.href);n.hash=`f=${t}`;try{await navigator.clipboard.writeText(n.toString()),x(`Link copied.`)}catch{window.location.hash=`f=${t}`,x(`Link is in the address bar. Copy it from there.`)}h(null)}async function P(t){if(!D)return;let n=await se(D,t);R(`${m(e.title)}@${t}x.png`,n),h(null)}function F(){D&&(R(`${m(e.title)}.svg`,new Blob([D],{type:`image/svg+xml`})),h(null))}function te(){let t=Ne(e);R(`${m(e.title)}.html`,new Blob([t],{type:`text/html`})),h(null),x(`HTML page downloaded. It still edits, with no install.`)}function I(){R(`${m(e.title)}.flume.json`,new Blob([JSON.stringify(e,null,2)],{type:`application/json`})),h(null)}async function ae(e){let n=await e.text(),r=n.trim();if(r.startsWith(`{`))try{let e=L(JSON.parse(r));if(e){t(e),x(`Project opened.`),h(null);return}}catch{}let i=k(n);j({source:(i??n).replace(/\s+$/,``)+`
`,offsets:{}}),x(i?`Turned that table into flows.`:`Flows loaded.`),h(null),C(`edit`)}let z=E?(0,Y.jsx)(Le,{scene:E,focus:v,offsets:e.offsets,onFocus:y,onOffset:(e,n)=>{t(t=>{let r={...t.offsets};return Math.abs(n)<.5?delete r[e]:r[e]=n,{...t,offsets:r}})}}):(0,Y.jsxs)(`div`,{className:`bg-paper text-ink px-8 py-16`,children:[(0,Y.jsx)(`p`,{className:`font-display text-2xl`,children:`Nothing to draw yet.`}),(0,Y.jsxs)(`p`,{className:`text-paper-muted mt-3 max-w-sm text-base`,children:[`One line is a flow. Try `,(0,Y.jsx)(`span`,{className:`font-mono`,children:`Wages [6400] Rent`}),`, or open a sample.`]})]});return(0,Y.jsxs)(`div`,{className:`bg-bg text-fg flex h-dvh flex-col`,children:[(0,Y.jsx)(`h1`,{className:`sr-only`,children:e.title||`Flume`}),(0,Y.jsxs)(`header`,{className:`border-line relative z-30 border-b`,children:[(0,Y.jsxs)(`div`,{className:`flex items-center gap-2 px-3 pt-2`,children:[(0,Y.jsx)(`img`,{src:`/favicon.svg`,alt:``,className:`size-8 shrink-0`}),(0,Y.jsx)(`p`,{className:`font-display shrink-0 text-xl tracking-tight`,children:`Flume`}),(0,Y.jsxs)(`div`,{className:`ml-auto flex items-center gap-1`,children:[(0,Y.jsx)(Z,{label:`Samples`,icon:(0,Y.jsx)(s,{className:`size-4`}),onClick:()=>h(f===`samples`?null:`samples`),pressed:f===`samples`}),(0,Y.jsx)(Z,{label:`Present`,icon:(0,Y.jsx)(l,{className:`size-4`}),onClick:()=>{E&&(h(null),_(!0))}}),(0,Y.jsx)(Z,{label:`Copy link`,icon:(0,Y.jsx)(c,{className:`size-4`}),onClick:()=>void N()}),(0,Y.jsx)(Z,{label:`Download`,icon:(0,Y.jsx)(i,{className:`size-4`}),onClick:()=>h(f===`download`?null:`download`),pressed:f===`download`})]})]}),(0,Y.jsx)(`div`,{className:`px-3 pt-1 pb-2`,children:(0,Y.jsx)(`input`,{"aria-label":`Diagram title`,value:e.title,placeholder:`Untitled`,onChange:e=>j({title:e.target.value}),className:`font-display placeholder:text-muted w-full bg-transparent text-xl tracking-tight outline-none`})}),f?(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsx)(`button`,{className:`fixed inset-0 z-20 cursor-default`,"aria-label":`Close menu`,onClick:()=>h(null)}),(0,Y.jsx)(`div`,{className:`border-line bg-surface absolute top-full right-3 z-30 mt-1 w-72 rounded-lg border p-2 shadow-sheet`,children:f===`samples`?(0,Y.jsx)(`ul`,{children:J.map(e=>(0,Y.jsx)(`li`,{children:(0,Y.jsxs)(`button`,{className:`hover:bg-raised w-full rounded-md px-3 py-2 text-left`,onClick:()=>ee(e.id),children:[(0,Y.jsx)(`span`,{className:`block text-base`,children:e.name}),(0,Y.jsx)(`span`,{className:`text-muted block text-sm`,children:e.blurb})]})},e.id))}):(0,Y.jsxs)(`div`,{className:`flex flex-col`,children:[(0,Y.jsx)($,{onClick:te,icon:(0,Y.jsx)(i,{className:`size-4`}),title:`HTML page`,detail:`One file. Still editable offline.`}),(0,Y.jsx)($,{onClick:()=>void P(2),icon:(0,Y.jsx)(o,{className:`size-4`}),title:`PNG`,detail:`Sharp enough for a slide.`}),(0,Y.jsx)($,{onClick:()=>void P(4),icon:(0,Y.jsx)(o,{className:`size-4`}),title:`PNG, large`,detail:`Four times the pixels.`}),(0,Y.jsx)($,{onClick:F,icon:(0,Y.jsx)(o,{className:`size-4`}),title:`SVG`,detail:`Vectors, for a layout tool.`}),(0,Y.jsx)($,{onClick:I,icon:(0,Y.jsx)(a,{className:`size-4`}),title:`Project file`,detail:`Open it here later.`}),(0,Y.jsx)($,{onClick:()=>w.current?.click(),icon:(0,Y.jsx)(a,{className:`size-4`}),title:`Open project or table`,detail:`JSON, flows, or a spreadsheet paste.`})]})})]}):null]}),(0,Y.jsxs)(`div`,{className:`border-line flex border-b md:hidden`,children:[(0,Y.jsx)(Be,{active:S===`diagram`,onClick:()=>C(`diagram`),children:`Diagram`}),(0,Y.jsx)(Be,{active:S===`edit`,onClick:()=>C(`edit`),children:`Edit`})]}),(0,Y.jsxs)(`div`,{className:`flex min-h-0 flex-1`,children:[(0,Y.jsxs)(`section`,{className:`${S===`edit`?`flex`:`hidden`} border-line min-h-0 w-full flex-col border-r md:flex md:w-96`,children:[(0,Y.jsxs)(`div`,{className:`flex items-baseline justify-between px-4 pt-4`,children:[(0,Y.jsx)(`label`,{htmlFor:`flows`,className:`text-muted text-sm tracking-widest uppercase`,children:`Flows`}),(0,Y.jsx)(`span`,{className:`text-muted text-sm`,children:`Source [amount] Target`})]}),(0,Y.jsx)(`textarea`,{id:`flows`,value:e.source,spellCheck:!1,autoCapitalize:`off`,autoCorrect:`off`,onChange:e=>j({source:e.target.value}),onPaste:e=>{let t=k(e.clipboardData.getData(`text/plain`));if(!t)return;e.preventDefault();let n=e.currentTarget;j({source:n.value.slice(0,n.selectionStart)+t+n.value.slice(n.selectionEnd)}),x(`Turned that table into flows.`)},className:`border-line bg-bg font-mono text-fg mx-3 mt-2 min-h-48 flex-1 resize-none rounded-md border p-3 text-sm leading-6 outline-none`}),(0,Y.jsxs)(`p`,{className:`text-muted px-4 pt-2 text-sm`,children:[(0,Y.jsx)(`span`,{className:`font-mono`,children:`[*]`}),` remainder · `,(0,Y.jsx)(`span`,{className:`font-mono`,children:`[?]`}),` shortfall · `,(0,Y.jsx)(`span`,{className:`font-mono`,children:`:Name #color`})]}),(0,Y.jsxs)(`div`,{className:`max-h-40 space-y-1 overflow-auto px-4 py-3 text-sm`,children:[(0,Y.jsx)(`p`,{className:O?`text-fg`:`text-danger`,children:T.totalIn===0&&T.totalOut===0?`No flows yet.`:O?`Balances · ${p(T.totalIn,e.settings)} in and out`:`Off by ${p(T.totalIn-T.totalOut,e.settings)} · ${p(T.totalIn,e.settings)} in, ${p(T.totalOut,e.settings)} out`}),T.computed.map(t=>(0,Y.jsxs)(`p`,{className:`text-muted`,children:[(0,Y.jsx)(`span`,{className:`text-fg`,children:t.kind===`rest`?`${t.target} is the remainder of ${t.source}`:`${t.source} fills the shortfall into ${t.target}`}),` · `,p(t.value,e.settings)]},`${t.kind}:${t.source}:${t.target}`)),T.errors.map(e=>(0,Y.jsxs)(`p`,{className:`text-danger`,children:[e.line?`Line ${e.line}: `:``,e.message]},`${e.line}:${e.message}`)),T.warnings.map(e=>(0,Y.jsx)(`p`,{className:`text-brass`,children:e},e)),T.balances.filter(e=>Math.abs(e.gap)>=1e-4).map(t=>(0,Y.jsxs)(`p`,{className:`text-danger`,children:[t.name,` received `,p(t.inn,e.settings),` and sent `,p(t.out,e.settings),`.`]},t.name))]}),(0,Y.jsxs)(`details`,{className:`border-line border-t px-4 py-3`,children:[(0,Y.jsx)(`summary`,{className:`text-sm`,children:`Tune the sheet`}),(0,Y.jsxs)(`div`,{className:`mt-3 flex flex-col gap-3`,children:[(0,Y.jsxs)(`label`,{className:`flex flex-col gap-1 text-sm`,children:[(0,Y.jsx)(`span`,{className:`text-muted`,children:`Subtitle`}),(0,Y.jsx)(`input`,{value:e.subtitle,onChange:e=>j({subtitle:e.target.value}),className:`border-line bg-bg rounded-md border px-2 py-2`})]}),(0,Y.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:[`left`,`justify`,`right`].map(t=>(0,Y.jsx)(Q,{active:e.settings.align===t,onClick:()=>M({align:t}),children:t===`justify`?`Spread`:t===`left`?`As entered`:`To the right`},t))}),(0,Y.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:Re.map(t=>(0,Y.jsx)(Q,{active:e.settings.width===t.width&&e.settings.height===t.height,onClick:()=>M({width:t.width,height:t.height}),children:t.label},t.label))}),(0,Y.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,Y.jsx)(Q,{active:e.settings.showLabels,onClick:()=>M({showLabels:!e.settings.showLabels}),children:`Labels`}),(0,Y.jsx)(Q,{active:e.settings.showValues,onClick:()=>M({showValues:!e.settings.showValues}),children:`Values`}),(0,Y.jsx)(Q,{active:e.settings.sort===`value`,onClick:()=>M({sort:e.settings.sort===`value`?`entry`:`value`}),children:`Largest first`})]}),(0,Y.jsx)(`div`,{className:`flex gap-2`,children:[`cream`,`white`,`ink`].map(t=>(0,Y.jsx)(Q,{active:e.settings.paper===t,onClick:()=>M({paper:t}),children:t===`cream`?`Cream`:t===`white`?`White`:`Ink`},t))}),(0,Y.jsxs)(`div`,{className:`grid grid-cols-2 gap-2`,children:[(0,Y.jsx)(Ve,{label:`Prefix`,value:e.settings.prefix,onChange:e=>M({prefix:e})}),(0,Y.jsx)(Ve,{label:`Suffix`,value:e.settings.suffix,onChange:e=>M({suffix:e})})]}),(0,Y.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:[0,1,2].map(t=>(0,Y.jsx)(Q,{active:e.settings.decimals===t,onClick:()=>M({decimals:t}),children:t===0?`Whole numbers`:`${t} decimal${t>1?`s`:``}`},t))}),(0,Y.jsx)(He,{label:`Gap`,min:8,max:40,step:1,value:e.settings.nodeGap,onChange:e=>M({nodeGap:e})}),(0,Y.jsx)(He,{label:`Ribbon`,min:.2,max:.85,step:.05,value:e.settings.flowOpacity,onChange:e=>M({flowOpacity:e})}),A?(0,Y.jsx)(`button`,{className:`text-brass min-h-11 text-left text-sm`,onClick:()=>j({offsets:{}}),children:`Reset nudged bars`}):null]})]})]}),(0,Y.jsx)(`section`,{className:`${S===`diagram`?`flex`:`hidden`} min-h-0 min-w-0 flex-1 flex-col md:flex`,children:(0,Y.jsxs)(`div`,{className:`min-h-0 flex-1 overflow-auto p-3 md:p-6`,children:[(0,Y.jsx)(`div`,{className:`shadow-sheet mx-auto overflow-hidden rounded-lg`,children:g?null:z}),(0,Y.jsx)(`p`,{className:`text-muted mx-auto mt-3 max-w-xl text-sm`,children:`Drag a bar to nudge it. Hover a ribbon to see only that path. The numbers beside the source are the check: if it balances, every unit is accounted for.`})]})})]}),b?(0,Y.jsx)(`p`,{className:`border-line bg-surface text-fg fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border px-4 py-2 text-sm shadow-sheet`,role:`status`,children:b}):null,(0,Y.jsx)(`input`,{ref:w,type:`file`,accept:`.json,.txt,.csv,.tsv,text/plain`,className:`hidden`,onChange:e=>{let t=e.target.files?.[0];t&&ae(t),e.target.value=``}}),g&&E?(0,Y.jsxs)(`div`,{className:`bg-bg fixed inset-0 z-50 flex flex-col`,children:[(0,Y.jsxs)(`div`,{className:`flex items-center justify-between px-4 py-3`,children:[(0,Y.jsx)(`p`,{className:`font-display text-xl`,children:`Flume`}),(0,Y.jsxs)(`button`,{className:`border-line hover:bg-raised flex min-h-11 items-center gap-2 rounded-full border px-4`,onClick:()=>_(!1),children:[(0,Y.jsx)(u,{className:`size-4`}),`Close`]})]}),(0,Y.jsx)(`div`,{className:`min-h-0 flex-1 overflow-auto px-4 pb-8`,children:(0,Y.jsx)(`div`,{className:`shadow-sheet mx-auto max-w-6xl overflow-hidden rounded-lg`,children:z})})]}):null]})}function Z({label:e,icon:t,onClick:n,pressed:r}){return(0,Y.jsxs)(`button`,{type:`button`,"aria-label":e,"aria-pressed":r,onClick:n,className:`flex min-h-11 items-center gap-2 rounded-full px-3 ${r?`bg-brass text-brass-ink`:`hover:bg-raised`}`,children:[t,(0,Y.jsx)(`span`,{className:`hidden text-sm sm:inline`,children:e})]})}function Be({active:e,onClick:t,children:n}){return(0,Y.jsx)(`button`,{type:`button`,onClick:t,className:`min-h-11 flex-1 text-sm ${e?`border-brass text-fg border-b-2`:`text-muted`}`,children:n})}function Q({active:e,onClick:t,children:n}){return(0,Y.jsx)(`button`,{type:`button`,"aria-pressed":e,onClick:t,className:`min-h-11 rounded-full px-3 text-sm ${e?`bg-brass text-brass-ink`:`border-line hover:bg-raised border`}`,children:n})}function $({onClick:e,icon:t,title:n,detail:r}){return(0,Y.jsxs)(`button`,{type:`button`,onClick:e,className:`hover:bg-raised flex min-h-11 items-start gap-3 rounded-md px-2 py-2 text-left`,children:[(0,Y.jsx)(`span`,{className:`text-brass mt-1`,children:t}),(0,Y.jsxs)(`span`,{children:[(0,Y.jsx)(`span`,{className:`block text-sm`,children:n}),(0,Y.jsx)(`span`,{className:`text-muted block text-sm`,children:r})]})]})}function Ve({label:e,value:t,onChange:n}){return(0,Y.jsxs)(`label`,{className:`flex flex-col gap-1 text-sm`,children:[(0,Y.jsx)(`span`,{className:`text-muted`,children:e}),(0,Y.jsx)(`input`,{value:t,onChange:e=>n(e.target.value),className:`border-line bg-bg rounded-md border px-2 py-2`})]})}function He({label:e,min:t,max:n,step:r,value:i,onChange:a}){return(0,Y.jsxs)(`label`,{className:`flex items-center gap-3 text-sm`,children:[(0,Y.jsx)(`span`,{className:`text-muted w-16`,children:e}),(0,Y.jsx)(`input`,{type:`range`,min:t,max:n,step:r,value:i,onChange:e=>a(Number(e.target.value)),className:`min-h-11 flex-1`})]})}function Ue(){return(0,Y.jsx)(ze,{})}export{Ue as component};