(() => {
  "use strict";

  const API = "";
  const SESSION_KEY = "amon_owner_session_v1";
  const UI_KEY = "amon_owner_ui_v1";

  const token = () => sessionStorage.getItem(SESSION_KEY) || "";
  const authHeaders = () => ({ "Authorization": "Bearer " + token() });

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  function readUI() {
    try {
      return JSON.parse(localStorage.getItem(UI_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveUI(next) {
    localStorage.setItem(UI_KEY, JSON.stringify(next));
  }

  function openPanel(title, html) {
    const panel = document.getElementById("panel");
    const overlay = document.getElementById("overlay");
    document.getElementById("panelTitle").textContent = title;
    document.getElementById("panelBody").innerHTML = html;
    overlay.classList.remove("hidden");
    panel.classList.remove("hidden");
  }

  async function api(path, options = {}) {
    const response = await fetch(API + path, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...authHeaders()
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
      throw new Error(data?.message || "تعذر تنفيذ الطلب.");
    }

    return data;
  }

  function login() {
    openPanel("👑 دخول المالك", `
      <div class="card">
        <h3>AMON OWNER ACCESS</h3>
        <p>أدخل كلمة مرور المالك لتفعيل جلسة التحكم. كلمة المرور لا تُرسل إلى المحادثة ولا تُحفظ في سجل الرسائل.</p>
        <input id="amonOwnerPassword" type="password" autocomplete="current-password"
          placeholder="كلمة مرور المالك"
          style="width:100%;margin-top:12px;padding:12px;border:1px solid #dbe1ea;border-radius:10px">
        <button id="amonOwnerLogin"
          style="width:100%;margin-top:10px;padding:11px;border:0;border-radius:10px;background:#111827;color:#fff;font-weight:700">
          تفعيل وضع المالك
        </button>
        <p id="amonOwnerLoginMsg" style="margin-top:9px"></p>
      </div>
    `);

    const password = document.getElementById("amonOwnerPassword");
    const button = document.getElementById("amonOwnerLogin");
    const message = document.getElementById("amonOwnerLoginMsg");

    async function submit() {
      const value = password.value;
      if (!value) {
        message.textContent = "أدخل كلمة مرور المالك.";
        return;
      }

      button.disabled = true;
      message.textContent = "جارٍ التحقق…";

      try {
        const response = await fetch(API + "/api/owner/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: value })
        });

        const data = await response.json().catch(() => null);
        password.value = "";

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || "تعذر التحقق.");
        }

        sessionStorage.setItem(SESSION_KEY, data.token);
        dashboard();
      } catch (error) {
        message.textContent = error.message;
      } finally {
        button.disabled = false;
      }
    }

    button.onclick = submit;
    password.onkeydown = event => {
      if (event.key === "Enter") submit();
    };
    password.focus();
  }

  function ownerNav(active) {
    const items = [
      ["overview", "📊", "نظرة عامة"],
      ["access", "🧩", "الوصول والخطط"],
      ["users", "👥", "المستخدمون"],
      ["groups", "🏷️", "المجموعات"],
      ["features", "⚙️", "الميزات"],
      ["limits", "📈", "الحدود"],
      ["security", "🛡️", "الأمان"],
      ["system", "🖥️", "النظام"],
      ["session", "🚪", "الجلسة"]
    ];

    return `
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
        ${items.map(([id, icon, label]) => `
          <button type="button" data-owner-tab="${id}"
            style="padding:8px 10px;border:1px solid #dbe1ea;border-radius:9px;background:${id===active?"#111827":"#fff"};color:${id===active?"#fff":"#334155"}">
            ${icon} ${label}
          </button>`).join("")}
      </div>
    `;
  }

  function plansHTML(plans) {
    return Object.entries(plans).map(([id, plan]) => `
      <div class="card">
        <h3>${escapeHTML(plan.name)}</h3>
        <p>الرسائل: <b>${escapeHTML(plan.messages)}</b><br>الصور: <b>${escapeHTML(plan.images)}</b></p>
        <small>المعرف: ${escapeHTML(id)}</small>
      </div>
    `).join("");
  }

  function page(tab, data) {
    const ui = readUI();

    const common = ownerNav(tab);

    if (tab === "overview") {
      return common + `
        <div class="card"><h3>مرحبًا سيدي 👑</h3><p>وضع المالك مفعل. هذه لوحة التحكم المركزية لـ AMON.</p></div>
        <div class="card"><h3>حالة AMON</h3>
          <p><b>${escapeHTML(data.system.status)}</b> — الإصدار ${escapeHTML(data.system.version)}<br>
          المحرك: ${data.system.ai ? "متصل" : "غير متصل"}<br>
          النموذج: ${escapeHTML(data.system.model)}</p>
        </div>
        <div class="card"><h3>حالة البيانات</h3><p>${escapeHTML(data.storage.note)}</p></div>
      `;
    }

    if (tab === "access") {
      return common + `
        <div class="card"><h3>نظام الوصول</h3><p>هذه هي مستويات AMON الأساسية. التطبيق الفعلي لكل مستخدم يحتاج تخزينًا دائمًا قبل النشر العام.</p></div>
        ${plansHTML(data.plans)}
      `;
    }

    if (tab === "users") {
      return common + `
        <div class="card"><h3>إدارة المستخدمين</h3>
          <p>المرحلة القادمة ستربط هذا القسم بقاعدة بيانات حقيقية لعرض عدد المستخدمين، البحث عن مستخدم محدد، وتعديل صلاحياته بشكل فردي.</p>
          <p><b>الحالة الحالية:</b> لا توجد بيانات مستخدمين موصولة، لذلك لا يعرض AMON أرقامًا وهمية.</p>
        </div>
      `;
    }

    if (tab === "groups") {
      return common + `
        <div class="card"><h3>إدارة المجموعات</h3>
          <p>المجموعات المخطط لها: المستخدمون العاديون، Pro، Elite، والمستخدمون المخصصون.</p>
          <p>بعد ربط التخزين الدائم ستتمكن من وضع مستخدم في مجموعة أو منحه استثناءً فرديًا.</p>
        </div>
      `;
    }

    if (tab === "features") {
      const maintenance = Boolean(ui.maintenance);
      return common + `
        <div class="card"><h3>إعدادات الميزات</h3>
          <p>واجهة التحكم جاهزة. المفاتيح الدائمة التي تؤثر على جميع المستخدمين ستُربط بالتخزين في المرحلة التالية.</p>
          <label style="display:flex;justify-content:space-between;gap:10px;align-items:center">
            <span><b>تفضيل واجهة وضع الصيانة</b><br><small>اختبار محلي للوحة المالك فقط في هذه المرحلة.</small></span>
            <input id="ownerMaintenanceUI" type="checkbox" ${maintenance?"checked":""}>
          </label>
          <p id="ownerFeatureMsg" style="margin-top:10px"></p>
        </div>
      `;
    }

    if (tab === "limits") {
      return common + `
        <div class="card"><h3>حدود الاستخدام</h3>
          <p>الحدود المعروضة الآن هي تعريفات الخطط. تطبيقها على المستخدمين بشكل موثوق يحتاج معرف مستخدم وتخزينًا على الخادم، وليس localStorage فقط.</p>
        </div>
        ${plansHTML(data.plans)}
      `;
    }

    if (tab === "security") {
      return common + `
        <div class="card"><h3>حماية المالك</h3>
          <ul style="padding-right:18px;line-height:1.9">
            <li>كلمة مرور المالك لا تدخل إلى سجل المحادثة.</li>
            <li>الجلسة الموقعة تنتهي تلقائيًا بعد 12 ساعة.</li>
            <li>الخروج يمسح رمز الجلسة من هذا المتصفح.</li>
            <li>واجهة العميل لا تحتوي كلمة مرور المالك.</li>
          </ul>
        </div>
        <div class="card"><h3>تنبيه مهم</h3><p>لا تكتب كلمة مرور المالك داخل رسالة الدردشة. استخدم مركز المالك فقط.</p></div>
      `;
    }

    if (tab === "system") {
      return common + `
        <div class="card"><h3>تشخيص النظام</h3>
          <p>AMON: ${escapeHTML(data.system.name)}<br>
          الإصدار: ${escapeHTML(data.system.version)}<br>
          الحالة: ${escapeHTML(data.system.status)}<br>
          Workers AI: ${data.system.ai ? "متاح" : "غير متاح"}<br>
          النموذج: ${escapeHTML(data.system.model)}</p>
        </div>
        <div class="card"><h3>المكونات المستقبلية</h3>
          <p>المستخدمون، المجموعات، الصلاحيات الفردية، الإحصاءات، التحكم الدائم، الذاكرة، البحث والمصادر يجب ربطها بخدمات فعلية قبل إعلانها كمفعلة.</p>
        </div>
      `;
    }

    return common + `
      <div class="card"><h3>الجلسة</h3><p>يمكنك إنهاء جلسة المالك على هذا الجهاز في أي وقت.</p>
      <button id="amonOwnerLogout" style="width:100%;padding:11px;border:1px solid #fecaca;border-radius:10px;background:#fff;color:#b91c1c">تسجيل الخروج من وضع المالك</button></div>
    `;
  }

  async function dashboard(tab = "overview") {
    try {
      const data = await api("/api/owner/overview");

      openPanel("👑 AMON COMMAND CENTER", page(tab, data));

      document.querySelectorAll("[data-owner-tab]").forEach(button => {
        button.onclick = () => dashboard(button.dataset.ownerTab);
      });

      const maintenance = document.getElementById("ownerMaintenanceUI");
      if (maintenance) {
        maintenance.onchange = () => {
          const next = { ...readUI(), maintenance: maintenance.checked };
          saveUI(next);
          const message = document.getElementById("ownerFeatureMsg");
          if (message) {
            message.textContent = "تم حفظ هذا التفضيل محليًا للوحة المالك. لم يتم تغيير النظام العام بعد.";
          }
        };
      }

      const logout = document.getElementById("amonOwnerLogout");
      if (logout) {
        logout.onclick = () => {
          sessionStorage.removeItem(SESSION_KEY);
          login();
        };
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      login();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.createElement("button");
    button.className = "side-btn";
    button.id = "openOwner";
    button.type = "button";
    button.textContent = "👑 مركز المالك";

    const info = document.getElementById("openInfo");
    info?.parentElement?.appendChild(button);

    button.onclick = () => token() ? dashboard() : login();
  });
})();