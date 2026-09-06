(() => {
  const API="";
  const key="amon_owner_session_v1";
  const token=()=>sessionStorage.getItem(key)||"";
  const headers=()=>({"Authorization":"Bearer "+token()});
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function panel(title,html){
    const p=document.getElementById("panel"), o=document.getElementById("overlay");
    document.getElementById("panelTitle").textContent=title;
    document.getElementById("panelBody").innerHTML=html;
    o.classList.remove("hidden");p.classList.remove("hidden");
  }
  async function request(path,options={}){
    const r=await fetch(API+path,{...options,headers:{...(options.headers||{}),...headers()}});
    const d=await r.json().catch(()=>null);
    if(!r.ok||!d?.success) throw new Error(d?.message||"تعذر تنفيذ الطلب");
    return d;
  }
  function loginUI(){
    panel("👑 دخول المالك",`<div class="card"><h3>AMON OWNER</h3><p>أدخل كلمة مرور المالك. لا يتم إرسالها إلى المحادثة ولا حفظها في سجل الرسائل.</p><input id="amonOwnerPassword" type="password" autocomplete="current-password" placeholder="كلمة مرور المالك" style="width:100%;margin-top:12px;padding:12px;border:1px solid #dbe1ea;border-radius:10px"><button id="amonOwnerLogin" style="width:100%;margin-top:10px;padding:11px;border:0;border-radius:10px;background:#111827;color:#fff;font-weight:700">تفعيل وضع المالك</button><p id="amonOwnerLoginMsg" style="margin-top:9px"></p></div>`);
    document.getElementById("amonOwnerLogin").onclick=async()=>{
      const password=document.getElementById("amonOwnerPassword").value;
      const msg=document.getElementById("amonOwnerLoginMsg");
      if(!password){msg.textContent="أدخل كلمة المرور.";return;}
      msg.textContent="جارٍ التحقق…";
      try{
        const r=await fetch(API+"/api/owner/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});
        const d=await r.json().catch(()=>null);
        document.getElementById("amonOwnerPassword").value="";
        if(!r.ok||!d?.success) throw new Error(d?.message||"تعذر التحقق");
        sessionStorage.setItem(key,d.token);
        dashboard();
      }catch(e){msg.textContent=e.message;}
    };
  }
  async function dashboard(){
    try{
      const d=await request("/api/owner/overview");
      const plans=Object.entries(d.plans).map(([id,p])=>`<div class="card"><h3>${esc(p.name)}</h3><p>الرسائل: ${p.messages} / الصور: ${p.images}</p></div>`).join("");
      panel("👑 AMON COMMAND CENTER",`
        <div class="card"><h3>مرحبًا سيدي</h3><p>تم تفعيل جلسة المالك بنجاح.</p></div>
        <div class="card"><h3>حالة النظام</h3><p><b>${esc(d.system.status)}</b> — الإصدار ${esc(d.system.version)}<br>الذكاء: ${d.system.ai?"متصل":"غير متصل"}</p></div>
        <div class="card"><h3>مركز التحكم</h3><p>إدارة المستخدمين، المجموعات، الصلاحيات الفردية، حدود الاستخدام، الميزات ووضع الصيانة هي بنية التحكم التي سيتم ربطها بالتخزين الدائم في المرحلة التالية.</p></div>
        <h3 style="margin:16px 0 8px">خطط الوصول</h3>${plans}
        <div class="card"><h3>⚠️ حالة التخزين</h3><p>${esc(d.storage.note)}</p></div>
        <button id="amonOwnerLogout" style="width:100%;padding:11px;border:1px solid #fecaca;border-radius:10px;background:#fff;color:#b91c1c">تسجيل الخروج من وضع المالك</button>`);
      document.getElementById("amonOwnerLogout").onclick=()=>{sessionStorage.removeItem(key);loginUI();};
    }catch(e){sessionStorage.removeItem(key);loginUI();}
  }
  document.addEventListener("DOMContentLoaded",()=>{
    const b=document.createElement("button");
    b.className="side-btn";b.id="openOwner";b.type="button";b.textContent="👑 مركز المالك";
    const info=document.getElementById("openInfo");info?.parentElement?.appendChild(b);
    b.onclick=()=>token()?dashboard():loginUI();
  });
})();