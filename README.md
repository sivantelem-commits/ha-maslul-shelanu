# המסלול שלנו 🌿

אפליקציית ווב אישית למעקב תזונה, מים, משקל ותגי הישגים - לשימוש של שני משתמשים
(במקרה הזה: סיון ומורן) עם נתונים משותפים ומסונכרנים בין המכשירים.

## מה יש באפליקציה
- פרופיל אישי לכל משתמש/ת
- תפריט שבועי (6 ארוחות ליום) בשלוש רמות קלוריות: 1200 / 1500 / 1800, עם אפשרות
  להחליף כל ארוחה מרשימה, וגם להוסיף תחליפים אישיים
- מעקב מים יומי מול יעד של 2.5 ליטר, עם תזכורת אם עברה שעה בלי שתייה
- מעקב משקל שבועי + גרף מגמה + חישוב BMI
- תגי הישגים (ירידה במשקל, כמות מים מצטברת, רצפים)
- רשימת קניות אוטומטית לפי התפריט השבועי
- אתגר משותף שבועי (יעד מים משותף לשתיכן)
- ניתנת להתקנה כאפליקציה במסך הבית (PWA) ועובדת חלקית גם ללא אינטרנט

## מבנה הפרויקט
```
index.html              - העמוד הראשי
css/style.css           - כל העיצוב
js/app.js               - כל הלוגיקה של האפליקציה
js/storage.js           - שכבת החיבור ל-Supabase
js/supabase-config.js   - כאן שמים את פרטי הפרויקט שלכם ב-Supabase (ראו למטה)
manifest.json           - הגדרות PWA (התקנה למסך הבית)
sw.js                   - Service Worker לתמיכה חלקית באופליין
icon-192.png / icon-512.png - אייקונים לאפליקציה
```

## שלב 1: הקמת Supabase (כ-10 דקות, חד-פעמי)
הנתונים (מים, משקל, תפריט וכו') צריכים להישמר איפשהו כדי שיהיו משותפים בין
שני הטלפונים. משתמשים כאן ב-Supabase (אותו שירות ששימש את פרויקט הדירות /
apt-manager) - יש לו מסלול חינמי (Free plan) שמספיק בענק לשימוש אישי כזה.

1. גשו ל-https://supabase.com/ והתחברו (אפשר עם GitHub).
2. **"New project"** -> תנו שם (למשל `ha-maslul-shelanu`), בחרו סיסמה למסד
   הנתונים (שמרו אותה בצד, לא נחוצה בקוד אבל טוב שתהיה לכם), ובחרו region קרוב
   אליכם (למשל Frankfurt). המתינו דקה-שתיים עד שהפרויקט מוכן.
3. בתפריט הצד: **Project Settings -> API**. משם העתיקו:
   - **Project URL**
   - **anon public** key
   לתוך הקובץ `js/supabase-config.js` בפרויקט הזה (במקום הערכים לדוגמה שיש שם).
4. בתפריט הצד: **SQL Editor -> New query**, הדביקו את הקוד הבא ולחצו Run:
   ```sql
   create table app_data (
     key text primary key,
     value jsonb,
     updated_at timestamptz default now()
   );

   alter table app_data enable row level security;

   create policy "allow all access"
     on app_data
     for all
     using (true)
     with check (true);
   ```
   **הערה על פרטיות:** ה-anon key ציבורי מטבעו (הוא רץ בדפדפן) - כך עובד Supabase
   תמיד, וזה בדיוק כמו בפרויקט הדירות. ה-policy למעלה פותחת גישה מלאה לטבלה הזו
   בלבד - מספיק טוב לשימוש אישי בין שתיכן. אם בעתיד תרצו הגנה חזקה יותר (למשל
   login עם Supabase Auth), אפשר לחזור ולבקש עזרה בהמשך.

## שלב 2: העלאה ל-GitHub
```bash
cd ha-maslul-shelanu          # התיקייה של הפרויקט הזה
git init
git add .
git commit -m "גרסה ראשונה של המסלול שלנו"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```
(צריך קודם ליצור ריפו ריק ב-GitHub דרך האתר, ולהחליף `USERNAME/REPO_NAME`
בשם המשתמש והריפו שלכם.)

## שלב 3: הפעלת GitHub Pages
1. בריפו ב-GitHub: **Settings -> Pages**.
2. תחת "Build and deployment" -> Source: **Deploy from a branch**.
3. Branch: **main**, תיקייה: **/ (root)** -> Save.
4. אחרי דקה-שתיים האתר יהיה זמין בכתובת:
   `https://USERNAME.github.io/REPO_NAME/`

## שלב 4: התקנה על הטלפון כאפליקציה
- **אנדרואיד (Chrome):** נכנסים לכתובת, לוחצים על תפריט שלוש הנקודות -> "התקן אפליקציה".
- **iPhone (Safari):** נכנסים לכתובת, לוחצים על כפתור השיתוף -> "הוספה למסך הבית".

## בדיקה מקומית לפני העלאה
קבצי ES modules לא נטענים ישירות מ-`file://` בדפדפן (מגבלת דפדפנים), אז כדי
לבדוק מקומית צריך שרת קטן:
```bash
cd ha-maslul-shelanu
python3 -m http.server 8000
```
ואז לפתוח בדפדפן: `http://localhost:8000`

## הערות
- שינוי בתפריטים, במתכונים או בתגים נעשה בקובץ `js/app.js` (בראש הקובץ, תחת
  `MEAL_DATA` ו-`BADGE_DEFS`).
- הצבעים והפונטים נמצאים ב-`css/style.css` תחת `:root`.
