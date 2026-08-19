// ==========================================
// AMON AI
// اتصال AMON بنموذج OpenAI
// ==========================================

const AMON_AI = {

  version: "1.0.0",

  status: "READY",

  provider: "OpenAI",

  model: "gpt-5",


  // ==========================================
  // إرسال مهمة إلى OpenAI
  // ==========================================

  async ask(message, env) {

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return {
        success: false,
        reason: "INVALID_MESSAGE"
      };
    }

    if (
      !env ||
      !env.OPENAI_API_KEY
    ) {
      return {
        success: false,
        reason: "OPENAI_API_KEY_MISSING",
        message:
          "لم يتم إعداد مفتاح OpenAI في Cloudflare."
      };
    }


    try {

      const response = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "Authorization":
              `Bearer ${env.OPENAI_API_KEY}`
          },

          body: JSON.stringify({

            model: this.model,

            input: [
              {
                role: "system",

                content:
                  "أنت محرك الذكاء الاصطناعي داخل نظام AMON. " +
                  "أجب بدقة ووضوح. " +
                  "لا تدّعي تنفيذ إجراءات لم تنفذها. " +
                  "عند وجود معلومات متعارضة، وضح التعارض."
              },

              {
                role: "user",

                content:
                  message.trim()
              }
            ]

          })
        }
      );


      if (!response.ok) {

        const errorText =
          await response.text();

        return {
          success: false,
          reason: "OPENAI_REQUEST_FAILED",
          status: response.status,
          error: errorText
        };

      }


      const data =
        await response.json();


      let output = "";


      if (
        typeof data.output_text === "string"
      ) {

        output =
          data.output_text;

      } else {

        output =
          extractOutputText(data);

      }


      return {

        success: true,

        provider:
          this.provider,

        model:
          this.model,

        response:
          output,

        raw:
          data

      };

    } catch (error) {

      return {

        success: false,

        reason:
          "OPENAI_CONNECTION_ERROR",

        message:
          error.message

      };

    }

  }

};


// ==========================================
// استخراج النص من استجابة Responses API
// ==========================================

function extractOutputText(data) {

  if (
    !data ||
    !Array.isArray(data.output)
  ) {
    return "";
  }

  const parts = [];

  for (
    const item of data.output
  ) {

    if (
      !Array.isArray(item.content)
    ) {
      continue;
    }

    for (
      const content of item.content
    ) {

      if (
        content &&
        typeof content.text === "string"
      ) {

        parts.push(
          content.text
        );

      }

    }

  }

  return parts.join("\n");

}


// ==========================================
// التصدير
// ==========================================

if (
  typeof module !== "undefined"
) {

  module.exports =
    AMON_AI;

}


if (
  typeof globalThis !== "undefined"
) {

  globalThis.AMON_AI =
    AMON_AI;

}


console.log(
  "AMON AI: LOADED"
);
