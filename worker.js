// ==========================================
// AMON AI WORKER
// الاتصال الحقيقي بالنموذج
// FREE-ONLY MODE
// ==========================================

const MODEL = "@cf/zai-org/glm-4.7-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};


// ==========================================
// Response Helper
// ==========================================

function json(data, status = 200) {

  return Response.json(
    data,
    {
      status,
      headers: corsHeaders
    }
  );

}


// ==========================================
// Main Worker
// ==========================================

export default {

  async fetch(request, env) {

    const url =
      new URL(request.url);


    // ==========================================
    // CORS
    // ==========================================

    if (request.method === "OPTIONS") {

      return new Response(
        null,
        {
          status: 204,
          headers: corsHeaders
        }
      );

    }


    // ==========================================
    // HEALTH
    // ==========================================

    if (
      url.pathname === "/health" &&
      request.method === "GET"
    ) {

      return json({

        status: "online",

        name: "AMON AI",

        version: "1.0.0",

        ai: Boolean(env.AI),

        mode: "FREE_ONLY",

        model: MODEL

      });

    }


    // ==========================================
    // AMON INFORMATION
    // ==========================================

    if (
      url.pathname === "/api/amon" &&
      request.method === "GET"
    ) {

      return json({

        name: "AMON AI",

        role: "Central Thinking Core",

        status: "ready",

        ownerControl: true,

        aiProvider: "Cloudflare Workers AI",

        model: MODEL,

        mode: "FREE_ONLY"

      });

    }


    // ==========================================
    // CHAT
    // ==========================================

    if (
      url.pathname === "/" &&
      request.method === "POST"
    ) {

      // ------------------------------------------
      // التأكد من وجود Workers AI
      // ------------------------------------------

      if (!env.AI) {

        return json(
          {
            success: false,

            message:
              "Workers AI غير مربوط بـAMON. أضف AI Binding أولًا."
          },
          503
        );

      }


      // ------------------------------------------
      // قراءة البيانات
      // ------------------------------------------

      let body;

      try {

        body =
          await request.json();

      } catch (error) {

        return json(
          {
            success: false,

            message:
              "صيغة البيانات غير صحيحة."
          },
          400
        );

      }


      // ------------------------------------------
      // رسالة المستخدم
      // ------------------------------------------

      const userMessage =
        typeof body.message === "string"
          ? body.message.trim()
          : "";


      if (!userMessage) {

        return json(
          {
            success: false,

            message:
              "الرسالة فارغة."
          },
          400
        );

      }


      // ==========================================
      // AMON SYSTEM PROMPT
      // ==========================================

      const systemPrompt = `

أنت AMON AI.

أنت مساعد ذكاء اصطناعي يعمل داخل منصة AMON.

مهمتك:
- فهم طلب المستخدم.
- تقديم إجابة واضحة ومفيدة.
- عدم اختلاق المعلومات.
- عند عدم معرفة شيء، صرّح بعدم التأكد.
- عند الحاجة إلى معلومات حديثة، يجب استخدام أدوات البحث التي سيتم ربطها بك لاحقًا.
- لا تدّعي امتلاك صلاحيات غير موجودة.
- لا تعدّل نظام الأمان.
- لا تمنح نفسك صلاحيات.
- لا تنفذ أوامر خطرة.
- لا تكشف الأسرار أو مفاتيح API.
- تعامل مع المعلومات الدينية والسياسية والدولية بحياد واحترام.
- لا تعتبر أي مصدر صحيحًا لمجرد أنه مشهور؛ عند توفر مصادر متعددة قارن بينها.

أنت حاليًا في المرحلة الأولى من AMON.
سيتم لاحقًا ربطك بالذاكرة، والمخطط، والمقارنة بين عدة نماذج وأدوات.

`;


      // ==========================================
      // AI REQUEST
      // ==========================================

      try {

        const result =
          await env.AI.run(
            MODEL,
            {
              messages: [

                {
                  role: "system",

                  content:
                    systemPrompt
                },

                {
                  role: "user",

                  content:
                    userMessage
                }

              ],

              max_tokens: 1024,

              temperature: 0.3
            }
          );


        // ========================================
        // استخراج الإجابة
        // ========================================

        let answer = "";


        if (
          result &&
          typeof result.response === "string"
        ) {

          answer =
            result.response;

        } else if (
          result &&
          typeof result.text === "string"
        ) {

          answer =
            result.text;

        } else {

          answer =
            JSON.stringify(result);

        }


        // ========================================
        // نجاح
        // ========================================

        return json({

          success: true,

          name: "AMON AI",

          status: "online",

          mode: "FREE_ONLY",

          model: MODEL,

          message: answer,

          response: answer,

          reply: answer

        });


      } catch (error) {

        console.error(
          "AMON AI Error:",
          error
        );


        // ----------------------------------------
        // انتهاء الحصة المجانية
        // ----------------------------------------

        const errorText =
          String(
            error?.message ||
            error
          );


        if (
          errorText.includes("3036") ||
          errorText.includes("10,000") ||
          errorText.toLowerCase()
            .includes("daily free allocation")
        ) {

          return json(
            {
              success: false,

              code:
                "FREE_DAILY_LIMIT_REACHED",

              message:
                "تم الوصول إلى الحد المجاني اليومي لـAMON. حاول مرة أخرى بعد تجدد الحصة."

            },
            429
          );

        }


        // ----------------------------------------
        // النموذج غير متاح في الخطة
        // ----------------------------------------

        if (
          errorText.includes("5035") ||
          errorText
            .toLowerCase()
            .includes("workers paid plan")
        ) {

          return json(
            {
              success: false,

              code:
                "MODEL_REQUIRES_PAID_PLAN",

              message:
                "النموذج الحالي غير متاح في الخطة المجانية."
            },
            403
          );

        }


        // ----------------------------------------
        // خطأ عام
        // ----------------------------------------

        return json(
          {
            success: false,

            code:
              "AI_REQUEST_FAILED",

            message:
              "تعذر الاتصال بنموذج AMON.",

            details:
              errorText

          },
          500
        );

      }

    }


    // ==========================================
    // OWNER AUTHENTICATION
    // ==========================================

    if (
      url.pathname === "/api/owner" &&
      request.method === "POST"
    ) {

      const body =
        await request
          .json()
          .catch(
            () => ({})
          );


      if (!body.password) {

        return json(
          {
            success: false,

            message:
              "كلمة المرور مطلوبة."
          },
          400
        );

      }


      if (
        body.password !==
        env.AMON_OWNER_PASSWORD
      ) {

        return json(
          {
            success: false,

            message:
              "كلمة المرور غير صحيحة."
          },
          401
        );

      }


      return json({

        success: true,

        message:
          "تم التحقق من المالك."

      });

    }


    // ==========================================
    // DEFAULT
    // ==========================================

    return json({

      name: "AMON AI",

      status: "online",

      mode: "FREE_ONLY",

      message:
        "AMON Worker is running."

    });

  }

};
