# AMON AI — Deployment Checklist

## Cloudflare Worker
المسار الرئيسي الحالي: worker.js
اسم الـ Worker في wrangler.toml: amon-ai
Assets: ./public

## Bindings المطلوبة أو المحتملة
- AI: موجود في wrangler.toml.
- ASSETS: موجود في wrangler.toml.
- AMON_MEMORY: غير مثبت حاليًا.
- AMON_KNOWLEDGE: غير مثبت حاليًا.
- AMON_USER_SESSION_KEY: Secret مطلوب للجلسات الموقعة.
- Provider API keys: Secrets اختيارية حسب المزود.

## التحقق قبل اعتبار النشر ناجحًا
1. /health
2. /api/capabilities
3. /api/providers
4. /api/models
5. /api/self-test بعد مصادقة المالك
6. /api/final-audit بعد مصادقة المالك
7. اختبار محادثة حقيقي.
8. مراجعة Logs وDeployments في Cloudflare.

## قاعدة
نجاح فحص الكود لا يثبت نجاح النشر السحابي. نجاح النشر لا يثبت اتصال الخدمات الخارجية.
