// ==========================================
// AMON PROVIDERS
// مدير مزودي الذكاء الاصطناعي
// ==========================================

const AMON_PROVIDERS = {

  version: "1.0.0",

  mode: "FREE_ONLY",

  providers: {},


  // ==========================================
  // إضافة مزود مجاني
  // ==========================================

  register(provider) {

    if (!provider || !provider.name) {
      return {
        success: false,
        reason: "INVALID_PROVIDER"
      };
    }

    if (provider.free !== true) {
      return {
        success: false,
        reason: "PAID_PROVIDER_BLOCKED"
      };
    }

    this.providers[provider.name] = {
      ...provider,
      enabled: true
    };

    return {
      success: true,
      provider: provider.name
    };
  },


  // ==========================================
  // تعطيل مزود
  // ==========================================

  disable(name) {

    if (!this.providers[name]) {
      return {
        success: false,
        reason: "PROVIDER_NOT_FOUND"
      };
    }

    this.providers[name].enabled = false;

    return {
      success: true
    };
  },


  // ==========================================
  // تفعيل مزود
  // ==========================================

  enable(name) {

    if (!this.providers[name]) {
      return {
        success: false,
        reason: "PROVIDER_NOT_FOUND"
      };
    }

    if (this.providers[name].free !== true) {
      return {
        success: false,
        reason: "PAID_PROVIDER_BLOCKED"
      };
    }

    this.providers[name].enabled = true;

    return {
      success: true
    };
  },


  // ==========================================
  // الحصول على المزودين المجانيين
  // ==========================================

  getFreeProviders() {

    return Object.values(this.providers)
      .filter(provider =>
        provider.free === true &&
        provider.enabled === true
      );

  },


  // ==========================================
  // فحص المزود قبل الاستخدام
  // ==========================================

  authorize(name) {

    const provider =
      this.providers[name];

    if (!provider) {
      return {
        allowed: false,
        reason: "PROVIDER_NOT_FOUND"
      };
    }

    if (provider.free !== true) {
      return {
        allowed: false,
        reason: "PAID_PROVIDER_BLOCKED"
      };
    }

    if (provider.enabled !== true) {
      return {
        allowed: false,
        reason: "PROVIDER_DISABLED"
      };
    }

    return {
      allowed: true,
      provider
    };
  },


  // ==========================================
  // حالة النظام
  // ==========================================

  info() {

    const providers =
      this.getFreeProviders();

    return {

      name: "AMON PROVIDERS",

      version: this.version,

      mode: this.mode,

      freeOnly: true,

      activeProviders:
        providers.length,

      providers:
        providers.map(provider =>
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
    AMON_PROVIDERS;
}


// ==========================================
// الاستخدام العالمي
// ==========================================

if (
  typeof globalThis !== "undefined"
) {
  globalThis.AMON_PROVIDERS =
    AMON_PROVIDERS;
}


console.log(
  "AMON PROVIDERS: FREE-ONLY MODE"
);
