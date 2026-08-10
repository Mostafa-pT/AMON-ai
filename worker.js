export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // فحص حالة AMON
    if (url.pathname === "/health") {
      return Response.json({
        status: "online",
        name: "AMON AI",
        version: "1.0.0"
      });
    }

    // معلومات AMON
    if (url.pathname === "/api/amon" && request.method === "GET") {
      return Response.json({
        name: "AMON AI",
        role: "Central Thinking Core",
        status: "ready",
        ownerControl: true
      });
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
          { status: 400 }
        );
      }

      if (body.password !== env.AMON_OWNER_PASSWORD) {
        return Response.json(
          {
            success: false,
            message: "كلمة المرور غير صحيحة."
          },
          { status: 401 }
        );
      }

      return Response.json({
        success: true,
        message: "تم التحقق من المالك."
      });
    }

    return Response.json(
      {
        name: "AMON AI",
        status: "online",
        message: "AMON Worker is running."
      },
      { status: 200 }
    );
  }
};
