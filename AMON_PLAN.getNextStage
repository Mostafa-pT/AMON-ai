// ==========================================
// AMON TASK ENGINE
// محرك مهام AMON AI
// ==========================================

let AMON_PLAN;

try {
  if (typeof require !== "undefined") {
    AMON_PLAN = require("./amon-plan.js");
  }
} catch (error) {
  AMON_PLAN = null;
}


// ==========================================
// محرك المهام
// ==========================================

const AMON_TASK_ENGINE = {

  version: "1.0.0",

  status: "READY",

  currentTask: null,

  completedTasks: [],

  failedTasks: [],


  // ==========================================
  // الحصول على الخطة
  // ==========================================

  getPlan() {

    if (!AMON_PLAN) {

      return {
        success: false,
        message: "لم يتم تحميل خطة AMON."
      };

    }

    return {
      success: true,
      plan: AMON_PLAN
    };

  },


  // ==========================================
  // الحصول على المرحلة التالية
  // ==========================================

  getNextStage() {

    if (!AMON_PLAN) {
      return null;
    }

    if (typeof AMON_PLAN.getNextStage === "function") {
      return AMON_PLAN.getNextStage();
    }

    if (Array.isArray(AMON_PLAN.stages)) {

      return AMON_PLAN.stages.find(
        stage => stage.status === "PENDING"
      ) || null;

    }

    return null;

  },


  // ==========================================
  // إنشاء مهمة من المرحلة
  // ==========================================

  createTask(stage) {

    if (!stage) {

      return {
        success: false,
        message: "لا توجد مرحلة متاحة."
      };

    }

    const task = {

      id:
        "AMON-TASK-" +
        Date.now(),

      stageId:
        stage.id,

      stageName:
        stage.name,

      tasks:
        Array.isArray(stage.tasks)
          ? [...stage.tasks]
          : [],

      status:
        "PENDING",

      createdAt:
        new Date().toISOString()

    };

    this.currentTask = task;

    return {
      success: true,
      task
    };

  },


  // ==========================================
  // بدء المهمة
  // ==========================================

  startTask() {

    if (!this.currentTask) {

      const stage =
        this.getNextStage();

      if (!stage) {

        return {
          success: false,
          message: "لا توجد مهام معلقة."
        };

      }

      this.createTask(stage);

    }

    this.currentTask.status = "RUNNING";

    this.status = "RUNNING";

    return {
      success: true,
      task: this.currentTask
    };

  },


  // ==========================================
  // إنهاء المهمة بنجاح
  // ==========================================

  completeTask(result = null) {

    if (!this.currentTask) {

      return {
        success: false,
        message: "لا توجد مهمة نشطة."
      };

    }

    this.currentTask.status = "COMPLETED";

    this.currentTask.result = result;

    this.currentTask.completedAt =
      new Date().toISOString();

    this.completedTasks.push(
      this.currentTask
    );

    const completed =
      this.currentTask;

    this.currentTask = null;

    this.status = "READY";

    return {
      success: true,
      task: completed
    };

  },


  // ==========================================
  // تسجيل فشل المهمة
  // ==========================================

  failTask(errorMessage) {

    if (!this.currentTask) {

      return {
        success: false,
        message: "لا توجد مهمة نشطة."
      };

    }

    this.currentTask.status = "FAILED";

    this.currentTask.error =
      String(errorMessage || "خطأ غير معروف");

    this.currentTask.failedAt =
      new Date().toISOString();

    this.failedTasks.push(
      this.currentTask
    );

    const failed =
      this.currentTask;

    this.currentTask = null;

    this.status = "READY";

    return {
      success: false,
      task: failed
    };

  },


  // ==========================================
  // التحقق من صلاحيات المهمة
  // ==========================================

  checkPermissions(action) {

    const blockedActions = [

      "DELETE_PROJECT",

      "DELETE_ALL_FILES",

      "MODIFY_SECRETS",

      "MODIFY_SECURITY_CORE",

      "CHANGE_OWNER_CONTROL",

      "DISABLE_SECURITY",

      "BYPASS_OWNER",

      "DIRECT_PRODUCTION_CHANGE"

    ];

    if (
      typeof action !== "string"
    ) {

      return {
        allowed: false,
        reason: "INVALID_ACTION"
      };

    }

    const normalized =
      action.trim().toUpperCase();

    if (
      blockedActions.includes(normalized)
    ) {

      return {
        allowed: false,
        reason: "ACTION_BLOCKED"
      };

    }

    return {
      allowed: true,
      reason: "ACTION_ALLOWED"
    };

  },


  // ==========================================
  // التحقق قبل تنفيذ التغيير
  // ==========================================

  authorizeChange(change) {

    if (!change) {

      return {
        allowed: false,
        reason: "INVALID_CHANGE"
      };

    }

    if (
      change.action
    ) {

      const permission =
        this.checkPermissions(
          change.action
        );

      if (!permission.allowed) {
        return permission;
      }

    }

    return {
      allowed: true,
      reason: "CHANGE_REQUIRES_TESTING"
    };

  },


  // ==========================================
  // حالة المحرك
  // ==========================================

  statusInfo() {

    return {

      engine:
        "AMON TASK ENGINE",

      version:
        this.version,

      status:
        this.status,

     
