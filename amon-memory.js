// ==========================================
// AMON MEMORY
// ذاكرة AMON AI
// ==========================================

const AMON_MEMORY = {

  version: "1.0.0",

  status: "READY",

  conversations: [],
  tasks: [],
  knowledge: [],
  decisions: [],


  // ==========================================
  // حفظ رسالة
  // ==========================================

  rememberMessage(role, message) {

    if (
      typeof role !== "string" ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return {
        success: false,
        reason: "INVALID_MESSAGE"
      };
    }

    this.conversations.push({
      role: role,
      message: message.trim(),
      timestamp: new Date().toISOString()
    });

    return {
      success: true
    };
  },


  // ==========================================
  // حفظ مهمة
  // ==========================================

  rememberTask(task) {

    if (!task) {
      return {
        success: false,
        reason: "INVALID_TASK"
      };
    }

    this.tasks.push({
      task: task,
      timestamp: new Date().toISOString()
    });

    return {
      success: true
    };
  },


  // ==========================================
  // حفظ معلومة
  // ==========================================

  rememberKnowledge(topic, information, source = null) {

    if (
      typeof topic !== "string" ||
      typeof information !== "string"
    ) {
      return {
        success: false,
        reason: "INVALID_KNOWLEDGE"
      };
    }

    this.knowledge.push({
      topic: topic,
      information: information,
      source: source,
      timestamp: new Date().toISOString()
    });

    return {
      success: true
    };
  },


  // ==========================================
  // حفظ قرار AMON
  // ==========================================

  rememberDecision(decision, reason = "") {

    if (
      typeof decision !== "string" ||
      !decision.trim()
    ) {
      return {
        success: false,
        reason: "INVALID_DECISION"
      };
    }

    this.decisions.push({
      decision: decision.trim(),
      reason: String(reason),
      timestamp: new Date().toISOString()
    });

    return {
      success: true
    };
  },


  // ==========================================
  // آخر المحادثات
  // ==========================================

  getRecentMessages(limit = 20) {

    return this.conversations.slice(-limit);

  },


  // ==========================================
  // آخر المهام
  // ==========================================

  getRecentTasks(limit = 20) {

    return this.tasks.slice(-limit);

  },


  // ==========================================
  // البحث في المعرفة
  // ==========================================

  searchKnowledge(query) {

    if (
      typeof query !== "string" ||
      !query.trim()
    ) {
      return [];
    }

    const search =
      query.toLowerCase();

    return this.knowledge.filter(item => {

      return (
        item.topic.toLowerCase().includes(search) ||
        item.information.toLowerCase().includes(search)
      );

    });

  },


  // ==========================================
  // حالة الذاكرة
  // ==========================================

  statusInfo() {

    return {

      name: "AMON MEMORY",

      version: this.version,

      status: this.status,

      conversations:
        this.conversations.length,

      tasks:
        this.tasks.length,

      knowledge:
        this.knowledge.length,

      decisions:
        this.decisions.length

    };

  }

};


// ==========================================
// التصدير
// ==========================================

if (typeof module !== "undefined") {

  module.exports = AMON_MEMORY;

}


// ==========================================
// الاستخدام العالمي
// ==========================================

if (typeof globalThis !== "undefined") {

  globalThis.AMON_MEMORY = AMON_MEMORY;

}


console.log(
  "AMON MEMORY: LOADED"
);
