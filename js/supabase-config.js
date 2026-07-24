// ============================================================
// הגדרות Supabase
// ============================================================
// 1. גשו ל-https://supabase.com/ והתחברו (אפשר עם GitHub, כמו בפרויקט הדירות).
// 2. "New project" -> תנו שם, בחרו סיסמה למסד הנתונים (שמרו אותה, לא נחוצה כאן
//    אבל כדאי לשמור למקרה שתרצו לגשת ל-DB ישירות) ובחרו region קרוב (למשל Frankfurt).
// 3. אחרי שהפרויקט נוצר (לוקח דקה) -> בתפריט הצד: Project Settings -> API.
// 4. העתיקו משם את ה-"Project URL" ואת ה-"anon public" key לתוך הערכים למטה.
// 5. לפני שהאפליקציה תעבוד, צריך ליצור טבלה - ראו README.md בפרויקט (שלב 1).
//
// הערה: כמו בכל פרויקט Supabase (כולל פרויקט הדירות), המפתח ה-anon הזה
// ציבורי מטבעו ומיועד לרוץ בדפדפן - ההגנה על הנתונים היא ברמת ה-RLS policies
// בטבלה (מוגדר ב-README), לא בהסתרת המפתח.

export const SUPABASE_URL = "https://zsdhhjjjibevtbumgmha.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGhoampqaWJldnRidW1nbWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4OTAwNzUsImV4cCI6MjEwMDQ2NjA3NX0.2IkznAtiTjMUcm9bwFcYT8-ZUs3hW4j6jWelw8cUOz4";
