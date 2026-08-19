// ==========================================
// AMON ROUTER
// موجّه واختيار مزود الذكاء
// ==========================================

const AMON_PROVIDERS =
  require("./amon-providers.js");

const AMON_ROUTER = {

  version: "1.0.0",

  mode: "FREE_ONLY",

  // ==========================================
  // ترتيب الأولوية
  // ==========================================

  priorities: [],


  // ==========================================
  // إضافة مزود إلى قائمة الأولوية
  // ==========================================

  addProvider(name, priority = 100) {

    const authorization =
      AMON_PROVIDERS.authorize(name);

    if (!authorization.allowed) {

      return {
        success: false,
        reason: authorization.reason
      };

    }

    this.priorities.push({
      name,
      priority
    });

    this.priorities.sort(
      (a, b) =>
        a.priority - b.priority
    );

    return {
      success: true,
      provider: name
    };
  },


  // ==========================================
  // الحصول على المزود المناسب
  // ==========================================

  selectProvider(task) {

    if (
      typeof task !== "string" ||
      !task.trim()
    ) {
      return {
        success: false,
        reason: "INVALID_TASK"
      };
    }

    const available =
      AMON_PROVIDERS.getFreeProviders();

    if (!available.length) {

      return {
        success: false,
        reason: "NO_FREE_PROVIDER_AVAILABLE"
      };
    }

    // البحث أولًا في قائمة الأولوية
    for (const item of this.priorities) {

      const provider =
        available.find(
          p => p.name === item.name
        );

      if (provider) {

        return {
          success: true,
          provider
        };
      }
    }

    // إذا لم توجد أولوية محددة
    return {
      success: true,
      provider: available[0]
    };
  },


  // ==========================================
  // فحص قبل التنفيذ
  // ==========================================

  authorizeProvider(name) {

    return AMON_PROVIDERS.authorize(name);

  },


  // ==========================================
  // توجيه المهمة
  // ==========================================

  route(task) {

    const selection =
      this.selectProvider(task);

    if (!selection.success) {

      return {
        success: false,
        reason: selection.reason
      };
    }

    const provider =
      selection.provider;

    const authorization =
      this.authorizeProvider(
        provider.name
      );

    if (!authorization.allowed) {

      return {
        success: false,
        reason: authorization.reason
      };
    }

    return {

      success: true,

      mode: this.mode,

      task,

      provider: provider.name,

      endpoint:
        provider.endpoint || null,

      model:
        provider.model || null,

      message:
        "تم اختيار مزود مجاني للمهمة."

    };
  },


  // ==========================================
  // معلومات الموجّه
  // ==========================================

  info() {

    return {

      name: "AMON ROUTER",

      version: this.version,

      mode: this.mode,

      freeOnly: true,

      priorityProviders:
        this.priorities.map(
          item => item.name
        ),

      availableProviders:
        AMON_PROVIDERS
          .getFreeProviders()
          .map(
            provider =>
              provider.name
          )

    };
  }

};


// ==========================================
// التصدير
// ==========================================

if (
  typeof module !== "undefined"
) {

  module.exports =
    AMON_ROUTER;

        }

