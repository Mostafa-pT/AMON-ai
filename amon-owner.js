(() => {
"use strict";
const SESSION_KEY="amon_owner_session_v2";
const token=()=>sessionStorage.getItem(SESSION_KEY)||"";
const H=()=>({"Content-Type":"application/json","Authorization":"Bearer "+token()});
const E=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function api(path,opt={}){const r=await fetch(path,{...opt,headers:{...H(),...(opt.headers||{})}});const d=await r.json().catch(()=>null);if(!r.ok||!d?.success)throw new Error(d?.message||"تعذر تنفيذ العملية.");return d}
function panel(title,html){document.getElementById("panelTitle").textContent=title;document.getElementById("panelBody").innerHTML=html;document.getElementById("overlay").classList.remove("hidden");document.getElementById("panel").classList.remove("hidden")}
function nav(active){const x=[["home","🧩","لوحة التطوير"],["chat","💬","شات المطور"],["search","🔎","البحث"],["users","👥","المستخدمون"],["groups","🏷️","المجموعات"],["access","🔐","الصلاحيات"],["limits","📊","الحدود"],["features","⚙️","الميزات"],["security","🛡️","الأمان"],["system","🖥️","التشخيص"],["session","🚪","الخروج"]];return '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-bottom:14px">'+x.map(([id,i,n])=>'<button data-ot="'+id+'" style="padding:10px;border:1px solid #dbe1ea;border-radius:10px;background:'+(id===active?"#111827":"#fff")+';color:'+(id===active?"#fff":"#334155")+'">'+i+' '+n+'</button>').join("")+"</div>"}
function bind(){document.querySelectorAll("[data-ot]").forEach(b=>b.onclick=()=>dashboard(b.dataset.ot))}
function login(){panel("👑 دخول المالك",'<div class="card"><h3>AMON OWNER ACCESS</h3><p>بوابة الإدارة الخاصة بالنظام.</p><input id="op" type="password" placeholder="كلمة مرور المالك" style="width:100%;padding:12px;border:1px solid #dbe1ea;border-radius:10px"><button id="ol" style="width:100%;margin-top:9px;padding:11px;border:0;border-radius:10px;background:#111827;color:#fff">تفعيل وضع المالك</button><p id="om"></p></div>');const p=document.getElementById("op"),b=document.getElementById("ol"),m=document.getElementById("om");const go=async()=>{b.disabled=true;m.textContent="جارٍ التحقق…";try{const r=await fetch("/api/owner/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:p.value})});const d=await r.json();p.value="";if(!r.ok||!d.success)throw new Error(d.message);sessionStorage.setItem(SESSION_KEY,d.token);dashboard("home")}catch(e){m.textContent=e.message}finally{b.disabled=false}};b.onclick=go;p.onkeydown=e=>e.key==="Enter"&&go();p.focus()}
async function dashboard(tab="home"){let data;try{data=await api("/api/owner/overview")}catch(e){sessionStorage.removeItem(SESSION_KEY);return login()}let body=nav(tab);
if(tab==="home")body+='<div class="card"><h3>مرحبًا سيدي 👑</h3><p>غرفة القيادة المركزية لـ AMON. كل نافذة هنا لها وظيفة مستقلة، وما يحتاج خدمة خارجية يظهر بوضوح كمخطط حتى يتم ربطه فعليًا.</p></div><div class="card"><h3>الحالة المباشرة</h3><p>AMON: <b>'+E(data.system.status)+'</b><br>AI: '+(data.system.ai?"متصل":"غير متصل")+'<br>النموذج: '+E(data.system.model)+'</p></div>';
if(tab==="chat")body+='<div class="owner-chat-shell"><div class="owner-chat-top"><div><div class="owner-chat-title">💬 شات المطور</div><div class="owner-chat-sub">مساحة تطوير احترافية لإدارة AMON، تحليل القرارات، مراجعة الأفكار، وبناء الخطط.</div></div><div class="owner-status">● وضع المطور نشط</div></div><div id="oc" class="owner-chat-messages"><div class="owner-chat-empty"><b>مرحبًا بك في AMON DEVELOPERS AI</b>اكتب فكرتك أو المشكلة أو الهدف. سيعمل AMON كمساعد تطوير وتحليل احترافي، مع تنظيم الإجابة إلى خطوات وقرارات عملية عند الحاجة.</div></div><div class="owner-chat-composer"><div class="owner-input-wrap"><textarea id="oi" rows="3" placeholder="اكتب طلبك إلى AMON…"></textarea><button id="os" type="button">إرسال ➤</button></div></div></div>';
if(tab==="search")body+='<div class="card"><h3>🔎 مركز بحث المالك</h3><p>واجهة مستقلة للبحث والتحقق من المصادر. البحث الخارجي غير موصول بعد، لذلك لن نعرض نتائج وهمية.</p><input placeholder="موضوع البحث" style="width:100%;padding:11px;border:1px solid #dbe1ea;border-radius:10px"><button disabled style="width:100%;margin-top:8px;padding:10px">سيتم تفعيله بعد ربط محرك بحث فعلي</button></div>';
if(tab==="users")body+='<div class="card"><h3>👥 مركز المستخدمين</h3><p>سيعرض عدد المستخدمين الحقيقي والبحث والتعديل الفردي بعد ربط نظام حسابات وتخزين دائم. لا توجد أرقام وهمية الآن.</p></div>';
if(tab==="groups")body+='<div class="card"><h3>🏷️ المجموعات</h3><p>البنية: Free، Pro، Elite، Custom. لاحقًا يمكن تطبيق سياسات مختلفة لكل مجموعة مع استثناء لمستخدم محدد.</p></div>';
if(tab==="access")body+='<div class="card"><h3>🔐 الصلاحيات الفردية</h3><p>الشات، الصور، البحث، الذاكرة، الأدوات، المشاريع والحدود المخصصة ستكون قابلة للتحكم لكل مستخدم بعد إضافة الحسابات والتخزين.</p></div>';
if(tab==="limits")body+='<div class="card"><h3>📊 حدود الاستخدام</h3>'+Object.values(data.plans).map(p=>'<p><b>'+E(p.name)+'</b><br>الرسائل: '+E(p.messages)+' — الصور: '+E(p.images)+'</p>').join("<hr>")+'<p>النسخة العامة الحالية: 50 رسالة و5 صور لكل نافذة 24 ساعة.</p></div>';
if(tab==="features")body+='<div class="card"><h3>⚙️ مركز الميزات</h3><p>نقطة التحكم المستقبلية لتفعيل الميزات على مستوى النظام أو المجموعة أو مستخدم واحد. الربط الدائم يحتاج تخزينًا على الخادم.</p></div>';
if(tab==="security")body+='<div class="card"><h3>🛡️ أمن المالك</h3><p>جلسة المالك موقعة وتنتهي تلقائيًا. تسجيل الخروج يمسح الجلسة من هذا الجهاز.</p><p>لا تشارك كلمة مرور المالك ولا تضعها في الشات.</p></div>';
if(tab==="system")body+='<div class="card"><h3>🖥️ التشخيص</h3><button id="od" style="width:100%;padding:10px;border:0;border-radius:10px;background:#111827;color:#fff">فحص النظام الآن</button><pre id="or" style="white-space:pre-wrap;font-size:11px"></pre></div>';
if(tab==="session")body+='<div class="card"><h3>🚪 إنهاء جلسة المالك</h3><button id="oo" style="width:100%;padding:11px;border:1px solid #fecaca;border-radius:10px;background:#fff;color:#b91c1c">تسجيل الخروج ومسح الجلسة</button></div>';
panel("👑 AMON DEVELOPERS AI",body);document.getElementById("panel").classList.toggle("owner-chat-panel",tab==="chat");bind();
if(tab==="chat"){
  const hist=[],$=id=>document.getElementById(id),box=$("oc"),input=$("oi"),send=$("os");
  let busy=false;
  const copyText=async text=>{try{await navigator.clipboard.writeText(text);toast("تم نسخ الرسالة")}catch{toast("تعذر النسخ تلقائيًا")}};
  const shareText=async text=>{try{if(navigator.share){await navigator.share({title:"AMON DEVELOPERS AI",text})}else{await copyText(text);toast("تم نسخ النص للمشاركة")}}catch{}};
  const add=(role,text,meta={})=>{
    const empty=box.querySelector(".owner-chat-empty");if(empty)empty.remove();
    const wrap=document.createElement("div");wrap.className="owner-msg "+role;
    const content=document.createElement("div");content.className="owner-msg-content";content.textContent=text;
    const label=document.createElement("span");label.className="owner-msg-label";label.textContent=role==="user"?"أنت — المطور":"🧠 AMON";
    const actions=document.createElement("div");actions.className="owner-msg-actions";
    const make=(name,icon,fn)=>{const btn=document.createElement("button");btn.type="button";btn.className="owner-msg-action";btn.textContent=icon+" "+name;btn.onclick=fn;actions.appendChild(btn)};
    make("نسخ","⧉",()=>copyText(text));
    make("مشاركة","↗",()=>shareText(text));
    if(role==="user") make("إعادة الإرسال","↻",()=>sendMessage(text,{reuse:true}));
    else make("إعادة التوليد","↻",()=>meta.prompt&&sendMessage(meta.prompt,{regenerate:true}));
    wrap.append(label,content,actions);box.appendChild(wrap);box.scrollTop=box.scrollHeight;return wrap;
  };
  const sendMessage=async(raw,opt={})=>{
    const msg=String(raw||"").trim();if(!msg||busy)return;
    busy=true;send.disabled=true;send.textContent=opt.regenerate?"جارٍ إعادة التوليد…":"جارٍ التفكير…";
    if(!opt.regenerate){add("user",msg);hist.push({role:"user",content:msg});input.value=""}
    const typing=add("amon","يقوم AMON بتحليل الطلب وصياغة إجابة احترافية…");
    try{
      const d=await api("/api/owner/chat",{method:"POST",body:JSON.stringify({message:msg,history:hist})});
      typing.remove();
      hist.push({role:"assistant",content:d.response});
      add("amon",d.response,{prompt:msg});
    }catch(e){typing.remove();add("amon","حدث خطأ أثناء تنفيذ الطلب: "+e.message)}
    finally{busy=false;send.disabled=false;send.textContent="إرسال ➤";input.focus()}
  };
  send.onclick=()=>sendMessage(input.value);
  input.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input.value)}};
  input.focus()
}
if(tab==="system")document.getElementById("od").onclick=async()=>{const r=document.getElementById("or");r.textContent="جارٍ الفحص…";try{const d=await api("/api/owner/diagnostics");r.textContent=JSON.stringify(d.diagnostics,null,2)}catch(e){r.textContent=e.message}};
if(tab==="session")document.getElementById("oo").onclick=()=>{sessionStorage.removeItem(SESSION_KEY);login()}}
document.addEventListener("DOMContentLoaded",()=>{const b=document.createElement("button");b.className="side-btn";b.id="openOwner";b.type="button";b.textContent="👑 مطوري AMON AI";document.getElementById("openInfo")?.parentElement?.appendChild(b);b.onclick=()=>token()?dashboard():login()});
})();