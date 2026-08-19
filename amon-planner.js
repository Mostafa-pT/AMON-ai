// ==========================================
// AMON PLANNER
// مخطط AMON AI
// ==========================================

const AMON_PLANNER = {

  version: "1.0.0",

  status: "READY",

  // ==========================================
  // إنشاء خطة لمهمة
  // ==========================================

  createPlan(task) {

    if (
      typeof task !== "string" ||
      !task.trim()
    ) {
      return {
        success: false,
        reason: "INVALID_TASK"
      };
    }

    const cleanTask = task.trim();

    const plan = {

      id:
        "PLAN-" + Date.now(),

      task:
        cleanTask,

      status:
        "PLANNED",

      steps: [

        {
          id: 1,
          name: "ANALYZE",
          description:
            "تحليل المهمة وفهم المطلوب.",
          status: "PENDING"
        },

        {
          id: 2,
          name: "CHECK_SECURITY",
          description:
            "فحص المهمة والتأكد من عدم تجاوز الصلاحيات.",
          status: "PENDING"
        },

        {
          id: 3,
          name: "DESIGN",
          description:
            "تحديد أفضل طريقة لتنفيذ المهمة.",
          status: "PENDING"
        },

        {
          id: 4,
          name: "TEST",
          description:
            "اختبار التغيير في بيئة آمنة.",
          status: "PENDING"
        },

        {
          id: 5,
          name: "VERIFY",
          description:
            "التحقق من نتيجة الاختبار.",
          status: "PENDING"
        },

        {
          id: 6,
          name: "APPROVE",
          description:
            "طلب موافقة المالك إذا كانت العملية حساسة.",
          status: "PENDING"
        },

        {
          id: 7,
          name: "DEPLOY",
          description:
            "النشر فقط بعد اجتياز الفحوصات.",
          status: "PENDING"
        }

      ],

      createdAt:
        new Date().toISOString()

    };

    return {
      success: true,
      plan
    };

  },


  // ==========================================
  // تحديد الخطوة التالية
  // ==========================================

  getNextStep(plan) {

    if (
      !plan ||
      !Array.isArray(plan.steps)
    ) {
      return null;
    }

    return plan.steps.find(
      step => step.status === "PENDING"
    ) || null;

  },


  // ==========================================
  // بدء خطوة
  // ==========================================

  startStep(plan, stepId) {

    if (
      !plan ||
      !Array.isArray(plan.steps)
    ) {
      return {
        success: false,
        reason: "INVALID_PLAN"
      };
    }

    const step =
      plan.steps.find(
        item => item.id === stepId
      );

    if (!step) {

      return {
        success: false,
        reason: "STEP_NOT_FOUND"
      };

    }

    step.status = "RUNNING";

    plan.status = "RUNNING";

    return {
      success: true,
      step
    };

  },


  // ==========================================
  // إنهاء خطوة
  // ==========================================

  completeStep(plan, stepId, result = null) {

    if (
      !plan ||
      !Array.isArray(plan.steps)
    ) {
      return {
        success: false,
        reason: "INVALID_PLAN"
      };
    }

    const step =
      plan.steps.find(
        item => item.id === stepId
      );

    if (!step) {

      return {
        success: false,
        reason: "STEP_NOT_FOUND"
      };

    }

    step.status = "COMPLETED";

    step.result = result;

    step.completedAt =
      new Date().toISOString();

    const remaining =
      plan.steps.some(
        item => item.status !== "COMPLETED"
      );

    if (!remaining) {
      plan.status = "COMPLETED";
    }

    return {
      success: true,
      step,
      plan
    };

  },


  // ==========================================
  // فشل خطوة
  // ==========================================

  failStep(plan, stepId, reason) {

    if (
      !plan ||
      !Array.isArray(plan.steps)
    ) {
      return {
        success: false,
        reason: "INVALID_PLAN"
      };
    }

    const step =
      plan.steps.find(
        item => item.id === stepId
      );

    if (!step) {

      return {
        success: false,
        reason: "STEP_NOT_FOUND"
      };

    }

    step.status = "FAILED";

    step.error =
      String(
        reason || "UNKNOWN_ERROR"
      );

    plan.status = "FAILED";

    return {
      success: false,
      step,
      plan
    };

  },


  // ==========================================
  // فحص الخطة
  // ==========================================

  validatePlan(plan) {

    if (
      !plan ||
      !Array.isArray(plan.steps)
    ) {

      return {
        valid: false,
        reason: "INVALID_PLAN"
      };

    }

    if (plan.steps.length === 0) {

      return {
        valid: false,
        reason: "NO_STEPS"
      };

    }

    return {
      valid: true,
      reason: "PLAN_VALID"
    };

  },


  // ==========================================
  // حالة المخطط
  // ==========================================

  statusInfo() {

    return {

      name:
        "AMON PLANNER",

      version:
        this.version,

      status:
        this.status

    };

  }

};


// ==========================================
// التصدير
// ==========================================

if (typeof module !== "undefined") {

  module.exports =
    AMON_PLANNER;

}


// ==========================================
// الاستخدام العالمي
// ==========================================

if (typeof globalThis !== "undefined") {

  globalThis.AMON_PLANNER =
    AMON_PLANNER;

}

console.log(
  "🧭 AMON PLANNER: LOADED"
);
