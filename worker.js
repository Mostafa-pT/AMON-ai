ll```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // التعامل مع طلبات CORS المبدئية
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // فحص حالة AMON
    if (url.pathname === "/health") {
      return Response.json(
        {
          status: "online",
          name: "AMON AI",
          version: "1.0.0"
        },
        { headers: corsHeaders }
      );
    }

    // معلومات AMON
    if (url.pathname === "/api/amon" && request.method === "GET") {
      return Response.json(
        {
          name: "AMON AI",
          role: "Central Thinking Core",
          status: "ready",
          ownerControl: true
        },
        { headers: corsHeaders }
      );
    }

    // استقبال رسالة المستخدم من index.html
    if (url.pathname === "/" && request.method === "POST") {
      let body;

      try {
        body = await request.json();
      } catch (error) {
        return Response.json(
          {
            success: false,
            message: "صيغة البيانات غير صحيحة."
          },
          {
            status: 400,
            headers: corsHeaders
          }
        );
      }

      const userMessage =
        typeof body.message === "string"
          ? body.message.trim()
          : "";

      if (!userMessage) {
        return Response.json(
          {
            success: false,
            message: "الرسالة فارغة."
          },
          {
            status: 400,
            headers: corsHeaders
          }
        );
      }

      // رد AMON المؤقت
      // سيتم ربط AMON بمحرك ذكاء اصطناعي فعلي لاحقًا.
      const amonReply =
        `تم استلام رسالتك بنجاح. أنا AMON AI، ` +
        `والرسالة التي أرسلتها هي: ${userMessage}`;

      return Response.json(
        {
          success: true,
          name: "AMON AI",
          status: "online",
          message: amonReply,
          response: amonReply,
          reply: amonReply
        },
        {
          status: 200,
          headers: corsHeaders
        }
      );
    }

    // اختبار كلمة مرور المالك
    if (url.pathname === "/api/owner" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));

      if (!body.password) {
        return Response.json(
          {
            success: false,
            message: "كلمة المرور مطلوبة."
          },
          {
            status: 400,
            headers: corsHeaders
          }
        );
      }

      if (body.password !== env.AMON_OWNER_PASSWORD) {
        return Response.json(
          {
            success: false,
            message: "كلمة المرور غير صحيحة."
          },
          {
            status: 401,
            headers: corsHeaders
          }
        );
      }

      return Response.json(
        {
          success: true,
          message: "تم التحقق من المالك."
        },
        {
          status: 200,
          headers: corsHeaders
        }
      );
    }

    // الرد الافتراضي
    return Response.json(
      {
        name: "AMON AI",
        status: "online",
        message: "AMON Worker is running."
      },
      {
        status: 200,
        headers: corsHeaders
      }
    );
  }
};
```
l
