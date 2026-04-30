export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'Missing messages' });

  const SYSTEM = `أنت المساعد الداخلي لمكتب MODULE للعمارة في الرياض. اسمك MODULE Assistant.
مهمتك: تجيب على أسئلة فريق العمل حول إجراءات المكتب، السياسات، الصلاحيات، والأنظمة الداخلية.
أجب بنفس لغة السؤال. إجابات مختصرة وعملية. لا تخترع إجراءات غير موجودة.

المؤسس: فهد غشيان — Founder فقط.
الأقسام: التصميم (Danny)، PMO (Mahmoud)، الفنية (Mujahid)، المالية (Mohammed)، الإدارة (Bim + PA للمؤسس)، HR (Sara)، BD (شاغر).
Team A: Joudat قائد، Rajab، Vishnu. Team B: Iyad قائد، Adam. Joud: نائبة DM + Interior Lead.

ساعات الفيلا: Concept 120 · SD Plans 60 · SD Facades 60 · DD 120 · CD 80 · PMO 40 = 480 ساعة.
تكلفة الساعة: 120 SAR. طاقة المكتب: 1548 ساعة/شهر. هامش ربح: 30%.
تنبيه 70%: يُبلّغ Danny. تنبيه 90%: يُبلّغ المؤسس نفس اليوم.

بروتوكول تأخر العميل: يوم 5 تذكير رسمي · يوم 6 إشعار كتابي · يوم 11 تجميد · يوم 15 إجراء تعاقدي.
بروتوكول فاتورة غير مدفوعة: 10 أيام بعد الإصدار يوقف PMO العمل ويُبلّغ المؤسس.

الصلاحيات: مدير القسم يتصرف داخل النظام ويُبلّغ. يرجع للمؤسس في: فسخ عقد، توظيف، دفعات فوق 20,000 SAR، قرارات استثنائية.
الإجازات تحت 5 أيام: مدير القسم يوافق. فوق 5 أيام: المؤسس يوافق.
التدريب تحت 3,000: مدير القسم يوافق. فوق 3,000: المؤسس يوافق.
الرواتب: المالية تحول مباشرة.

التايم شيت: يومي في Google Sheet. إرسال كل أحد قبل 12 ظهراً.
Bench Tasks: يوم = الموظف يختار · يومان-ثلاثة = Team Lead يوافق · أسبوع = Danny يحدد الخميس.

الاجتماعات: الأحد 2-2:45 Leadership · الاثنين صباحاً Design Session · الثلاثاء 12-2 Coffee with Founder · الأربعاء صباحاً Design Review · الأربعاء بعده Cross-Dept Sync · الخميس Sprint Planning.
قاعدة PMO: Mahmoud لا يتواصل مع المصممين مباشرة — كل شيء عبر Danny.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: 'claude-sonnet-4-5, max_tokens: 1000, system: SYSTEM, messages })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.status(200).json({ reply: data.content[0]?.text || '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
