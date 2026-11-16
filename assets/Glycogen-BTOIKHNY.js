import{o as m,r as i,n as d,M as E,C as g,l as S,al as I,I as b,k as F,f as C,j as R}from"./index-tEXWBQbA.js";import{a as A,d as D}from"./Modal3DShell-CL_civU4.js";const f=9,V=14,x=.85,h=2,w=f-1.7,j={sarcolemma:"#3E4C66",sarcolemmaEdge:"#CBD5E1",sarcoplasm:"#141D30",myofibril:"#C98F86",sr:"#2DD4BF",ttubule:"#94A3B8",calcium:"#F5F5F4"},p=(()=>{const e=[];for(let s=-6;s<=6;s++)for(let n=-6;n<=6;n++){const t=n*h+(s%2===0?0:h/2),o=s*h*.866;Math.hypot(t,o)<=w&&e.push([t,o])}return e})(),_=(e,s)=>p.reduce((n,[t,o])=>Math.min(n,Math.hypot(e-t,s-o)),1/0),G=(()=>{const e=m(2011711),s=[],n=(t,o,r)=>s.push({x:t,y:o,z:.12+e()*.08,pool:r,reveal:e(),deplete:e()});for(;s.filter(t=>t.pool===0).length<260;){const t=e()*Math.PI*2,o=f-.35-e()*1.05;n(Math.cos(t)*o,Math.sin(t)*o,0)}for(;s.filter(t=>t.pool===1).length<300;){const t=e()*Math.PI*2,o=Math.sqrt(e())*(w+.4),r=Math.cos(t)*o,c=Math.sin(t)*o;_(r,c)>x+.2&&n(r,c,1)}for(;s.filter(t=>t.pool===2).length<76;){const[t,o]=p[Math.floor(e()*p.length)],r=e()*Math.PI*2,c=Math.sqrt(e())*(x-.22);n(t+Math.cos(r)*c,o+Math.sin(r)*c,2)}return s})(),H=(()=>{const e=m(1995);return Array.from({length:44},(s,n)=>({a:n/44*Math.PI*2+e()*.08,r:f-2.2-e()*.6,seed:e()}))})(),T=(()=>{const e=m(5817);return Array.from({length:90},()=>({a:-.6+e()*2.4,z:-.8-e()*11,seed:e()}))})(),P=.17,z=`
attribute vec3 aG;
uniform vec3 uShow, uDeplete;
${A}
`,B=e=>`
#include <begin_vertex>
{
    float pool = aG.x;
    float show = pool < 0.5 ? uShow.x : (pool < 1.5 ? uShow.y : uShow.z);
    float dep = pool < 0.5 ? uDeplete.x : (pool < 1.5 ? uDeplete.y : uDeplete.z);
    float s = clamp((show * 1.4 - aG.y * 0.4) * 2.5, 0.0, 1.0);
    s *= clamp((aG.z - dep) * 12.0, 0.0, 1.0);
    vec3 c = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float px = screenPx((modelViewMatrix * vec4(c, 1.0)).xyz, ${e.toFixed(2)});
    transformed *= s * clamp(1.5 / max(px, 0.01), 1.0, 3.0);
}
`,Y=({params:e,ramp:s,granules:n=G,radius:t=P})=>{const o=i.useMemo(()=>{const c={uShow:{value:new d},uDeplete:{value:new d},uViewportH:{value:720}},l=new E({color:g.glycogen,gradientMap:s});l.onBeforeCompile=a=>{Object.assign(a.uniforms,c),a.vertexShader=z+a.vertexShader.replace("#include <begin_vertex>",B(t))},l.customProgramCacheKey=()=>`fibra-glicogenio-graos-v1-${t.toFixed(2)}`;const M=new S(t,1);M.setAttribute("aG",new I(new Float32Array(n.flatMap(a=>[a.pool,a.reveal,a.deplete])),3));const u=new b(M,l,n.length),y=new F;return n.forEach((a,v)=>u.setMatrixAt(v,y.makeTranslation(a.x,a.y,a.z))),u.frustumCulled=!1,{mesh:u,uniforms:c}},[s,n,t]),r=i.useRef(o.uniforms);return i.useEffect(()=>{r.current=o.uniforms},[o]),i.useEffect(()=>()=>{o.mesh.geometry.dispose(),o.mesh.material.dispose(),o.mesh.dispose()},[o]),C(c=>{const l=r.current;l.uViewportH.value=D(c),l.uShow.value.set(e.show0,e.show1,e.show2),l.uDeplete.value.set(e.dep0,e.dep1,e.dep2)}),R.jsx("primitive",{object:o.mesh})};export{j as C,f as F,Y as G,x as M,T as P,H as V,p as a,V as b};
