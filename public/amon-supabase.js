(function(){
"use strict";
const SB_URL="https://sjnlowidnqsbnnsagnnw.supabase.co";
const SB_KEY="sb_publishable_k1kpge870px4sk2VqvE96w_5b6Y9XX8";
const LS="amon_supabase_session_v1";
let session=null,currentConversationId=null;

function esc(s){return String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function load(){try{session=JSON.parse(localStorage.getItem(LS)||"null");}catch{session=null;}}
function save(){try{localStorage.setItem(LS,JSON.stringify(session));}catch{}}
function authHeaders(extra={}){return {...extra,apikey:SB_KEY,Authorization:"Bearer "+(session?.access_token||SB_KEY)}}
async function api(path,opt={}){
 const r=await fetch(SB_URL+path,{...opt,headers:authHeaders(opt.headers||{})});
 const text=await r.text(); let data=null; try{data=text?JSON.parse(text):null}catch{data=text}
 if(!r.ok) throw new Error(data?.message||data?.msg||text||"Supabase request failed");
 return data;
}
async function refreshUser(){
 if(!session?.access_token)return null;
 try{
  const user=await api("/auth/v1/user");
  session.user=user; save(); return user;
 }catch{session=null;localStorage.removeItem(LS);return null}
}
function inject(){
 const style=document.createElement("style");
 style.textContent=".amon-account{position:fixed;left:18px;bottom:18px;z-index:9999;border:1px solid rgba(0,0,0,.12);border-radius:999px;padding:10px 14px;background:var(--panel,#fff);color:var(--text,#111);box-shadow:0 8px 28px rgba(0,0,0,.14);font:inherit}.amon-auth-modal{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;z-index:10000;padding:18px}.amon-auth-modal.open{display:flex}.amon-auth-card{width:min(430px,100%);background:var(--panel,#fff);color:var(--text,#111);border-radius:22px;padding:22px;box-shadow:0 24px 80px rgba(0,0,0,.3)}.amon-auth-card input{width:100%;padding:12px;margin:7px 0;border:1px solid #d1d5db;border-radius:12px;background:transparent;color:inherit}.amon-auth-actions{display:flex;gap:8px;margin-top:10px}.amon-auth-actions button{flex:1;padding:11px;border:0;border-radius:12px;background:#2563eb;color:white}.amon-auth-note{font-size:13px;opacity:.72;margin-top:10px}.amon-conversations{max-height:45vh;overflow:auto;margin-top:12px}.amon-conv{display:block;width:100%;text-align:right;border:1px solid #e5e7eb;background:transparent;border-radius:12px;padding:10px;margin:6px 0;color:inherit}";
 document.head.appendChild(style);
 const b=document.createElement("button");b.className="amon-account";b.id="amonAccountButton";b.textContent="◉ حساب AMON";document.body.appendChild(b);
 const m=document.createElement("div");m.className="amon-auth-modal";m.id="amonAuthModal";
 m.innerHTML='<div class="amon-auth-card"><h2 style="margin-top:0">حساب AMON</h2><div id="amonAuthStatus"></div><div id="amonAuthForm"><input id="amonAuthEmail" type="email" placeholder="البريد الإلكتروني"><input id="amonAuthPassword" type="password" placeholder="كلمة المرور (6 أحرف أو أكثر)"><div class="amon-auth-actions"><button id="amonLogin">تسجيل الدخول</button><button id="amonSignup">إنشاء حساب</button></div><div class="amon-auth-note">بعد تسجيل الدخول، تُحفظ محادثاتك ورسائلك في قاعدة بيانات AMON الخاصة بك.</div></div><div id="amonAccountData" hidden><div class="amon-auth-actions"><button id="amonRefreshChats">محادثاتي</button><button id="amonLogout">تسجيل الخروج</button></div><div id="amonConversations" class="amon-conversations"></div></div><button id="amonClose" style="margin-top:12px;width:100%;padding:10px;border:0;border-radius:12px;background:#e5e7eb;color:#111">إغلاق</button></div>';
 document.body.appendChild(m);
 b.onclick=()=>{m.classList.add("open");renderAccount()};
 document.getElementById("amonClose").onclick=()=>m.classList.remove("open");
 document.getElementById("amonLogin").onclick=login;
 document.getElementById("amonSignup").onclick=signup;
 document.getElementById("amonLogout").onclick=logout;
 document.getElementById("amonRefreshChats").onclick=renderChats;
}
function status(t){const x=document.getElementById("amonAuthStatus");if(x)x.textContent=t||""}
function renderAccount(){
 const logged=!!session?.access_token;
 document.getElementById("amonAuthForm").hidden=logged;
 document.getElementById("amonAccountData").hidden=!logged;
 status(logged?("متصل: "+(session.user?.email||"مستخدم AMON")):"");
 if(logged)renderChats();
}
async function login(){
 const email=document.getElementById("amonAuthEmail").value.trim(),password=document.getElementById("amonAuthPassword").value;
 if(!email||!password){status("أدخل البريد الإلكتروني وكلمة المرور.");return}
 try{status("جارٍ تسجيل الدخول…");session=await api("/auth/v1/token?grant_type=password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});await refreshUser();status("تم تسجيل الدخول.");renderAccount()}catch(e){status("تعذر تسجيل الدخول: "+e.message)}
}
async function signup(){
 const email=document.getElementById("amonAuthEmail").value.trim(),password=document.getElementById("amonAuthPassword").value;
 if(!email||password.length<6){status("استخدم بريدًا صحيحًا وكلمة مرور من 6 أحرف أو أكثر.");return}
 try{status("جارٍ إنشاء الحساب…");const out=await api("/auth/v1/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});if(out.access_token){session=out;await refreshUser();renderAccount();status("تم إنشاء الحساب وتسجيل الدخول.")}else status("تم إنشاء الحساب. تحقق من بريدك الإلكتروني إذا طُلب التأكيد ثم سجّل الدخول.");}catch(e){status("تعذر إنشاء الحساب: "+e.message)}
}
function logout(){session=null;currentConversationId=null;localStorage.removeItem(LS);status("تم تسجيل الخروج.");renderAccount()}
async function ensureConversation(title){
 if(!session?.user?.id)return null;
 if(currentConversationId)return currentConversationId;
 const row={user_id:session.user.id,title:(title||"محادثة جديدة").slice(0,120),last_message_at:new Date().toISOString()};
 const out=await api("/rest/v1/conversations",{method:"POST",headers:{"Content-Type":"application/json","Prefer":"return=representation"},body:JSON.stringify(row)});
 currentConversationId=Array.isArray(out)?out[0]?.id:null;return currentConversationId;
}
async function saveMessage(role,content){
 if(!session?.user?.id||!content)return;
 const cid=await ensureConversation(content);
 if(!cid)return;
 await api("/rest/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({conversation_id:cid,user_id:session.user.id,role,content:String(content).slice(0,50000)})});
 await api("/rest/v1/conversations?id=eq."+encodeURIComponent(cid),{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({last_message_at:new Date().toISOString()})});
}
async function renderChats(){
 const box=document.getElementById("amonConversations");if(!box)return;
 if(!session?.user?.id){box.innerHTML="";return}
 try{
  const rows=await api("/rest/v1/conversations?select=id,title,last_message_at,pinned,archived&archived=eq.false&order=last_message_at.desc.nullslast&limit=50");
  box.innerHTML=(rows||[]).map(x=>'<button class="amon-conv" data-cid="'+esc(x.id)+'">'+(x.pinned?"📌 ":"")+esc(x.title||"محادثة جديدة")+'</button>').join("")||"<div class='amon-auth-note'>لا توجد محادثات محفوظة بعد.</div>";
  box.querySelectorAll("[data-cid]").forEach(btn=>btn.onclick=async()=>{
    currentConversationId=btn.dataset.cid;
    try{
      const rows=await api("/rest/v1/messages?select=role,content,created_at&conversation_id=eq."+encodeURIComponent(currentConversationId)+"&order=created_at.asc&limit=500");
      const conv=(rows||[]);
      const title=btn.textContent.replace(/^📌\s*/,"").trim()||"محادثة";
      if(window.AMONChat?.loadPersistedConversation){
        await window.AMONChat.loadPersistedConversation(currentConversationId,title,conv);
      }
      status("تم فتح المحادثة.");
      document.getElementById("amonAuthModal").classList.remove("open");
    }catch(e){status("تعذر فتح المحادثة: "+e.message)}
  });
 }catch(e){box.innerHTML="<div class='amon-auth-note'>تعذر تحميل المحادثات.</div>"}
}
function hookChat(){
 const original=window.fetch.bind(window);
 window.fetch=async function(input,init){
  const url=typeof input==="string"?input:(input?.url||"");
  const method=(init?.method||input?.method||"GET").toUpperCase();
  let userText=null,isChat=method==="POST"&&(url==="/"||url.endsWith("/api/amon")||url.endsWith("/api/amon/"));
  if(isChat&&init?.body){try{const b=typeof init.body==="string"?JSON.parse(init.body):null;userText=b?.message||null}catch{}}
  if(isChat&&userText&&session?.access_token){try{await saveMessage("user",userText)}catch(e){console.warn("AMON persistence user message",e)}}
  const response=await original(input,init);
  if(isChat&&userText&&session?.access_token){
   try{const clone=response.clone();const data=await clone.json();const answer=data?.response||data?.reply||data?.message;if(answer)await saveMessage("assistant",answer)}catch(e){console.warn("AMON persistence assistant message",e)}
  }
  return response;
 };
}
function hookNewChat(){document.addEventListener("click",e=>{if(e.target.closest("#newChat"))currentConversationId=null})}
load();
document.addEventListener("DOMContentLoaded",async()=>{inject();await refreshUser();hookChat();hookNewChat()});
window.AMONSupabase={get session(){return session},get conversationId(){return currentConversationId},newConversation(){currentConversationId=null}};
})();