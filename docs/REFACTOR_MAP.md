# AMON AI — Professional Refactor Map

هذا الملف يحدد البنية المستهدفة قبل تقسيم runtime الحالي، لتجنب كسر النسخة العاملة.

## المرحلة 1 — تثبيت الأساس
الحالي: worker.js كبير لكنه هو runtime الفعلي.
الإجراء: لا ننقل أجزاء منه عشوائيًا قبل وجود اختبارات CI وواجهات واضحة.
الحالة: بدأ.

## المرحلة 2 — تقسيم الخلفية
البنية المستهدفة:
- src/worker.js — نقطة دخول Worker فقط.
- src/core/ — هوية AMON وفهم الطلب والسياق.
- src/reasoning/ — المسارات والمجلس والتحقق.
- src/memory/ — الذاكرة.
- src/knowledge/ — قاعدة المعرفة.
- src/tools/ — الأدوات وTool Router.
- src/providers/ — Cloudflare والمزوّدون الخارجيون.
- src/research/ — البحث ومصادر الإنترنت.
- src/security/ — الجلسات والأمان والحدود.
- src/recovery/ — التعافي من الأخطاء.
- src/diagnostics/ — self-test وfinal-audit والقياسات.
- src/routes/ — API handlers.

## المرحلة 3 — تقسيم الواجهة
البنية المستهدفة:
- public/index.html — HTML فقط قدر الإمكان.
- public/assets/ — الصور والشعار.
- public/css/ — theme وcomponents.
- public/js/ — chat وsettings وfiles وowner bridge.

## المرحلة 4 — البيانات والبنية الخارجية
- Cloudflare AI binding.
- KV للذاكرة.
- KV أو datastore لقاعدة المعرفة.
- Secrets للمزوّدين.
- Supabase للحسابات والحفظ عند الحاجة.

## المرحلة 5 — Internet Intelligence
- countries/ — ملفات الدول.
- sources/ — سجل المصادر.
- providers/ — سجل المزودين والنماذج.
- policies/ — قواعد الجمع والتحديث والخصوصية.

## قاعدة refactor
كل عملية نقل يجب أن تنتهي بـ:
1. اختبار syntax.
2. اختبار unit أو behavior مناسب.
3. مقارنة API قبل وبعد.
4. مراجعة security.
5. نشر منفصل.
6. اختبار live.
7. rollback plan.
