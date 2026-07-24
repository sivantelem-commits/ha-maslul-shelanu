// ============================================================
// שכבת אחסון - Supabase
// כל שאר קובץ app.js לא צריך לדעת שום דבר על Supabase - הוא רק
// קורא ל-sGet(key) ו-sSet(key, value), בדיוק כמו קודם.
// ============================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const TABLE = 'app_data';

export async function sGet(key){
  try{
    const { data, error } = await supabase.from(TABLE).select('value').eq('key', key).maybeSingle();
    if(error){ console.error('sGet error for', key, error); return null; }
    return data ? data.value : null;
  }catch(e){
    console.error('sGet failed for', key, e);
    return null;
  }
}

export async function sSet(key, value){
  try{
    const { error } = await supabase.from(TABLE).upsert({ key, value, updated_at: new Date().toISOString() });
    if(error) console.error('sSet error for', key, error);
  }catch(e){
    console.error('sSet failed for', key, e);
  }
}

// נתון מכשיר-מקומי בלבד (איזה פרופיל נבחר במכשיר הזה) - לא צריך סנכרון,
// כך שהוא נשמר ב-localStorage הרגיל של הדפדפן ולא ב-Supabase.
export function getDeviceProfile(){
  try{ return localStorage.getItem('current-profile-device'); }catch(e){ return null; }
}
export function setDeviceProfile(name){
  try{ localStorage.setItem('current-profile-device', name); }catch(e){ /* ignore */ }
}
