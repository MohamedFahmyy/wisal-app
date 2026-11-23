# Wisal RSVP Backend — دليل التشغيل على خادم Linux

خادم RSVP مخصص لمنصة **وِصال (Wisal)** مبني بواسطة Node.js و Express و MySQL 8 مع حماية كاملة ومزامنة مع Vercel.

---

## التشغيل السريع التلقائي (الأسهل والأسرع 🚀)

بعد عمل `git clone` أو `git pull` للكود على سيرفرك:
```bash
cd wisal-app/backend
sudo bash setup-server.sh
```
يقوم هذا السكربت تلقائياً بكل شيء:
1. التحقق من تثبيت Node.js 20 و MySQL وجدار الحماية UFW وتثبيتها إذا كانت ناقصة.
2. إنشاء قاعدة البيانات `wisal_rsvp` وتعيين الصلاحيات تلقائياً.
3. توليد ملف `.env` مشفر بكلمات سر قوية وتوكن أدمن فريد (`ADMIN_TOKEN`).
4. تثبيت حزم npm وتشغيل الـ migration للجداول.
5. إنشاء وتشغيل خدمة systemd (`wisal-backend.service`) لتعمل بالخلفية بشكل مستمر ومع إعادة تشغيل تلقائية.
6. فتح المنفذ `8585/tcp` في جدار الحماية UFW.
7. إجراء فحص ذاتي عبر cURL للتأكد من استجابة `/health` وطباعة التوكن وأوامر الاختبار فوراً!

---

## للتحديثات المستقبلية السريعة:
عند رفع أي تعديلات جديدة على Git، نفّذ فقط:
```bash
cd wisal-app/backend
sudo bash deploy-update.sh
```

---

## 1. الخطوات اليدوية (إذا أردت التنفيذ خطوة بخطوة بدلاً من السكربت)
- **Node.js**: إصدار 18 أو أحدث (`node -v`)
- **MySQL**: إصدار 8 أو MariaDB
- **UFW Firewall**

---

## 2. إعداد قاعدة البيانات في MySQL
سجّل الدخول إلى MySQL وأنشئ المستخدم وقاعدة البيانات:
```bash
sudo mysql -u root -p
```
ثم نفّذ الأوامر التالية:
```sql
CREATE DATABASE IF NOT EXISTS wisal_rsvp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'wisal_user'@'localhost' IDENTIFIED BY 'STRONG_SECRET_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON wisal_rsvp.* TO 'wisal_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 3. تثبيت الحزم وإعداد البيئة
انقل مجلد `backend` إلى السيرفر (مثلاً في `/var/www/wisal-backend`):
```bash
cd /var/www/wisal-backend
npm install --production
cp .env.example .env
nano .env
```
املأ بيانات `.env`:
```env
PORT=8585
ADMIN_TOKEN=ضع_هنا_توكن_أدمن_قوي_لا_يقل_عن_32_حرف
ALLOWED_ORIGIN=https://wisal-app-six.vercel.app
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=wisal_user
DB_PASSWORD=STRONG_SECRET_PASSWORD_HERE
DB_NAME=wisal_rsvp
```

---

## 4. تشغيل المايجريشن (إنشاء الجداول)
```bash
npm run migrate
```
ستظهر رسالة:
```
✓ [Wisal Backend] Migration completed successfully. Tables are ready!
```

---

## 5. فتح البورت 8585 في جدار الحماية (UFW)
للسماح لـ Vercel بالاتصال بالـ API:
```bash
sudo ufw allow 8585/tcp
sudo ufw reload
sudo ufw status
```

---

## 6. التشغيل التلقائي عبر Systemd
انسخ ملف الخدمة إلى مجلد systemd:
```bash
sudo cp wisal-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable wisal-backend
sudo systemctl start wisal-backend
```
للتحقق من حالة الخدمة وسجلاتها:
```bash
sudo systemctl status wisal-backend
journalctl -u wisal-backend -f
```

---

## 7. فحص السيرفر عبر cURL
```bash
curl -i http://localhost:8585/health
```
النتيجة المتوقعة:
```json
{"ok":true,"status":"healthy","uptime":12,"timestamp":"..."}
```
