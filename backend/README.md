# Wisal RSVP Backend — دليل التشغيل على خادم Linux

خادم RSVP مخصص لمنصة **وِصال (Wisal)** مبني بواسطة Node.js و Express و MySQL 8 مع حماية كاملة ومزامنة مع Vercel.

---

## 1. المتطلبات الأولية على السيرفر
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
