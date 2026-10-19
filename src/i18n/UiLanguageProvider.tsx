"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type UiLanguage = "en" | "ar";
const STORAGE_KEY = "folio:ui-language:v1";
const ar: Record<string, string> = {
  "A portfolio maker for every kind of creative": "منشئ بورتفوليو لكل المبدعين",
  "Open the studio": "افتح الاستوديو", "Build my portfolio": "أنشئ بورتفوليوي",
  "Free, forever.": "مجاني دائمًا.", "No account. No subscription.": "بدون حساب أو اشتراك.",
  "YOUR WORK DESERVES A BETTER STAGE": "أعمالك تستحق مساحة أفضل",
  "Make your work<br/>impossible to <em>scroll past.</em>": "اعرض أعمالك بطريقة<br/>تستحق أن <em>يتوقف عندها الجميع.</em>",
  "Create a portfolio that feels unmistakably yours. Choose a look, add your story and projects, and watch the whole site come together.": "أنشئ بورتفوليو يعبر عنك. اختر التصميم، أضف قصتك ومشاريعك، وشاهد موقعك يكتمل أمامك.",
  "40+ distinctive themes": "أكثر من 40 تصميمًا", "20 gradient styles": "20 تدرجًا لونيًا", "Responsive by default": "متجاوب تلقائيًا",
  "FROM FIRST IDEA TO YOUR OWN WEBSITE": "من أول فكرة إلى موقعك الخاص", "Less setup.<br/><em>More you.</em>": "إعداد أقل.<br/><em>مساحة أكبر لك.</em>",
  "Start with a style": "ابدأ بالتصميم", "Pick from expressive themes, rich gradients, and flexible layouts. Every detail stays yours to change.": "اختر من تصاميم مميزة وتدرجات غنية وتنسيقات مرنة. كل التفاصيل قابلة للتعديل.",
  "Add what matters": "أضف ما يهم", "Tell your story, add project images and links, and shape the sections around your work.": "اكتب قصتك وأضف صور مشاريعك وروابطها، ورتب الأقسام حول أعمالك.",
  "Take it anywhere": "خذه إلى أي مكان", "Preview desktop and mobile, then export one responsive HTML file you can keep and share.": "عاين على الكمبيوتر والموبايل، ثم صدّر ملف HTML متجاوبًا واحتفظ به وشاركه.",
  "Your work, beautifully yours.": "أعمالك، بأسلوبك.", "Start creating": "ابدأ الإنشاء",
  "YOUR PORTFOLIO": "بورتفوليوك", "Let's get started": "لنبدأ", "One click gives you a complete, ready-to-edit portfolio. Just replace the example text with your own.": "بنقرة واحدة تحصل على بورتفوليو جاهز للتعديل. استبدل النصوص التجريبية بمعلوماتك.",
  "Introduction": "مقدمة", "Your name and what you do": "اسمك ومجال عملك", "About me": "نبذة عني", "A short bio": "نبذة قصيرة", "Show the work you love": "اعرض أعمالك المميزة", "Skills": "المهارات", "What you bring to the table": "ما الذي تتميز به", "Experience": "الخبرات", "Your career and education": "خبراتك وتعليمك", "Contact": "التواصل", "Make it easy to reach you": "سهّل التواصل معك",
  "Portfolio sections": "أقسام البورتفوليو", "sections": "أقسام", "What would you like to add?": "ما القسم الذي تريد إضافته؟", "Build my portfolio →": "أنشئ بورتفوليوي ←", "+ Add a section": "+ أضف قسمًا", "Close": "إغلاق", "Move section up": "حرّك القسم لأعلى", "Move section down": "حرّك القسم لأسفل", "Duplicate section": "كرّر القسم", "Remove section": "احذف القسم", "Move up": "لأعلى", "Move down": "لأسفل", "Duplicate": "تكرار", "Remove": "حذف",
  "Your name": "اسمك", "What do you do?": "ما مجال عملك؟", "required": "مطلوب", "optional": "اختياري", "One sentence about your work": "جملة واحدة عن عملك", "First project": "أول مشروع", "Project website": "رابط المشروع", "What did you make?": "ماذا أنجزت؟", "Choose a starting style": "اختر تصميم البداية", "Each option previews its colors and typography. You can change everything later.": "شاهد ألوان وخطوط كل تصميم. يمكنك تعديل كل شيء لاحقًا.", "Warm editorial": "تحريري دافئ", "Soft paper, terracotta, and serif type": "ورق هادئ وطوبي وخط أنيق", "Dark modern": "عصري داكن", "Deep navy with a clean mint accent": "كحلي عميق ولمسة نعناع", "Electric studio": "استوديو نابض", "Confident blue with crisp contrast": "أزرق جريء وتباين واضح", "Soft creative": "إبداعي هادئ", "Lilac, airy space, and gentle color": "ليلكي ومساحات واسعة وألوان ناعمة", "Selected": "محدد", "Choose any accent color. You can enter the editor’s full color controls later.": "اختر أي لون مميز، ويمكنك ضبط بقية الألوان من المحرر.", "Choose any accent color": "اختر اللون المميز",
  "Choose your sections": "اختر أقسامك", "About": "نبذة", "My work": "أعمالي", "Create my free draft": "أنشئ مسودتك المجانية", "LIVE PREVIEW": "معاينة مباشرة", "Changes appear as you edit": "تظهر التعديلات فورًا",
  "Edit content": "تعديل المحتوى", "Design": "التصميم", "Editor panels": "لوحات المحرر", "Select a block to edit it.": "اختر قسمًا لتعديله.", "Or add one from the left panel.": "أو أضف قسمًا من اللوحة الجانبية.", "Block editor": "محرر الأقسام",
  "History": "السجل", "Viewport": "حجم المعاينة", "desktop": "كمبيوتر", "tablet": "جهاز لوحي", "mobile": "موبايل", "Undo": "تراجع", "Redo": "إعادة", "Save backup": "حفظ نسخة احتياطية", "Open backup": "فتح نسخة احتياطية", "Generate with AI": "إنشاء بالذكاء الاصطناعي", "Clear all": "مسح الكل", "Export": "تصدير", "Saved on this device": "محفوظ على هذا الجهاز", "Saving…": "جارٍ الحفظ…", "Not saved — storage full": "لم يُحفظ — مساحة التخزين ممتلئة", "Your work is saved in this browser": "يُحفظ عملك في هذا المتصفح", "Switch interface to Arabic": "حوّل الواجهة إلى العربية", "Switch interface to English": "حوّل الواجهة إلى الإنجليزية",
  "Choose a look": "اختر تصميمًا", "designs": "تصميم", "Filter designs": "تصفية التصاميم", "All": "الكل", "Light": "فاتح", "Dark": "داكن", "Expressive": "حيوي", "Minimal": "بسيط", "Apply": "تطبيق",
  "Make it yours": "اجعله يعبر عنك", "Pick a look. You can change it any time.": "اختر مظهرًا ويمكنك تغييره في أي وقت.", "20 gradient looks + solid": "20 تدرجًا وخلفية موحدة", "Pick a look, then adjust the colors below.": "اختر مظهرًا ثم اضبط ألوانه أدناه.", "Solid page": "خلفية موحدة", "Background": "الخلفية", "Surface": "السطح", "Accent": "اللون المميز", "Text": "النص", "Website experience": "تجربة الموقع", "Small finishing touches across the whole portfolio.": "لمسات نهائية على كامل البورتفوليو.", "Show section navigation": "إظهار قائمة الأقسام", "Keep navigation visible while scrolling": "تثبيت القائمة أثناء التمرير", "Navigation theme": "نمط القائمة", "Menu alignment": "محاذاة القائمة", "Menu scale": "حجم القائمة", "Next to name": "بجوار الاسم", "Right side": "اليمين", "Compact": "صغير", "Standard": "قياسي", "Large": "كبير", "Show name / logo": "إظهار الاسم أو الشعار", "Navigation name": "اسم القائمة", "Use your portfolio name": "استخدم اسم البورتفوليو", "Choose and rename menu links": "اختر روابط القائمة وأعد تسميتها", "Add a section to make it available in your menu.": "أضف قسمًا لإتاحته في القائمة.", "Menu order follows the section order on the left.": "ترتيب القائمة يطابق ترتيب الأقسام يسارًا.", "Motion effects": "الحركة والتأثيرات", "No motion": "بدون حركة", "Subtle and smooth": "هادئة وسلسة", "More expressive": "أكثر حيوية", "Show page reading progress": "إظهار تقدم القراءة", "Add a back-to-top button": "إضافة زر العودة للأعلى", "Open portfolio images in a viewer": "فتح الصور في عارض", "Show closing footer": "إظهار التذييل الختامي", "Custom colors, layout and type": "ألوان وتنسيق وخطوط مخصصة", "Portfolio content language": "لغة محتوى البورتفوليو", "English · left to right": "الإنجليزية · من اليسار لليمين", "Arabic · right to left": "العربية · من اليمين لليسار", "Corner style": "شكل الزوايا", "Sharp": "حادة", "Soft": "ناعمة", "Round": "دائرية", "Page spacing": "مسافات الصفحة", "Balanced": "متوازنة", "Airy": "واسعة", "Layout style": "نمط التخطيط", "Typography": "الخطوط", "Website title and description": "عنوان الموقع ووصفه", "Website title": "عنوان الموقع", "Portfolio language and direction": "لغة البورتفوليو واتجاهه",
  "Portfolio review": "مراجعة البورتفوليو", "FREE · PRIVATE · INSTANT": "مجاني · خاص · فوري", "A local checklist to help your work make a stronger first impression.": "قائمة مراجعة تساعد أعمالك على ترك انطباع أقوى.", "Name and role": "الاسم والمجال", "Make it clear who you are and what you do.": "وضّح من أنت وماذا تعمل.", "A short introduction": "نبذة قصيرة", "Give visitors a little context about your approach.": "عرّف الزوار بأسلوبك.", "A featured project": "مشروع مميز", "Show at least one project with a useful description.": "اعرض مشروعًا واحدًا على الأقل مع وصف مفيد.", "A visual highlight": "لمسة بصرية", "A portrait or project image makes the page memorable.": "صورة شخصية أو صورة مشروع تجعل الصفحة أعلق بالذاكرة.", "A way to reach you": "وسيلة للتواصل", "Add one working email or social link.": "أضف بريدًا أو رابطًا اجتماعيًا صالحًا.", "Improve": "تحسين", "Review": "مراجعة", "This review runs in your browser. Your content is not sent anywhere.": "تتم هذه المراجعة في متصفحك ولا يُرسل محتواك إلى أي مكان.",
  "FIRST IMPRESSION": "الانطباع الأول", "Shape your introduction": "صمّم مقدمتك", "Write your story, then choose how it should look.": "اكتب قصتك ثم اختر طريقة عرضها.", "Your name or headline": "اسمك أو عنوانك", "Small label above your name": "عبارة قصيرة فوق اسمك", "Optional": "اختياري", "A little about what you do": "نبذة قصيرة عن عملك", "Choose a layout": "اختر تنسيقًا", "Text + photo": "نص وصورة", "Centered": "في المنتصف", "Photo first": "الصورة أولًا", "Big cover": "غلاف كبير", "Introduction layout": "تنسيق المقدمة", "Type my headline on arrival": "اكتب العنوان تدريجيًا عند الفتح", "Your photo": "صورتك", "Add a portrait, artwork, or anything that represents you.": "أضف صورة شخصية أو عملًا فنيًا أو ما يمثلك.", "Choose or drop a photo": "اختر صورة أو أفلتها هنا", "Photo shape": "شكل الصورة", "Photo focal point": "موضع التركيز في الصورة", "Background image and button": "صورة الخلفية والزر", "Wide background image": "صورة خلفية عريضة", "Add a cover image": "أضف صورة غلاف", "Works best with a wide photo or artwork": "تبدو أفضل مع صورة عريضة أو عمل فني", "Image focal point": "موضع التركيز في الصورة", "Button label": "نص الزر", "Button destination": "وجهة الزر", "Photo description (accessibility)": "وصف الصورة لإمكانية الوصول", "About section": "قسم نبذة", "Section heading": "عنوان القسم", "Supporting image": "صورة إضافية", "Add a portrait or workspace photo": "أضف صورة شخصية أو لمساحة عملك", "Body text": "النص", "Key Facts": "معلومات مهمة", "Label": "العنوان", "Value": "القيمة", "+ Add fact": "+ أضف معلومة", "Projects": "المشاريع", "Heading": "العنوان", "Work layout": "تنسيق الأعمال", "Even grid": "شبكة متساوية", "Featured first project": "إبراز المشروع الأول", "Editorial list": "قائمة تحريرية", "Try a different layout and see it update in the preview.": "جرّب تنسيقًا مختلفًا وشاهد المعاينة تتحدث.", "Items": "العناصر", "Name": "الاسم", "Description": "الوصف", "Project cover image": "صورة غلاف المشروع", "Choose or drop a project image": "اختر صورة للمشروع أو أفلتها هنا", "Tags (separate with commas)": "وسوم (افصل بينها بفواصل)", "Live URL": "رابط المشروع المنشور", "Repo URL": "رابط المستودع", "+ Add project": "+ أضف مشروعًا",
  "Preparing your image…": "جارٍ تجهيز الصورة…", "Choose a file": "اختر ملفًا", "Use image link": "استخدم رابط الصورة", "Change image": "تغيير الصورة", "Remove image": "إزالة الصورة", "Choose an image file such as JPG, PNG, or WebP.": "اختر صورة بصيغة JPG أو PNG أو WebP.", "Saved": "تم الحفظ", "Cancel": "إلغاء", "Start over": "ابدأ من جديد", "Are you sure you want to clear the entire canvas? This cannot be undone.": "هل تريد مسح مساحة العمل بالكامل؟ لا يمكن التراجع عن ذلك.", "Clear Canvas": "امسح مساحة العمل",
  "A few details could make this portfolio stronger": "بعض التفاصيل قد تجعل البورتفوليو أقوى", "Nothing is blocking your export. You can download now or review these suggestions first.": "يمكنك التصدير الآن أو مراجعة هذه الاقتراحات أولًا.", "Keep editing": "تابع التعديل", "Open review": "افتح المراجعة", "Export anyway": "صدّر على أي حال", "READY TO PUBLISH?": "هل أنت جاهز للنشر؟",
};

ar["Editor panels"] = "لوحات المحرر";
ar["FREE PORTFOLIO STUDIO"] = "استوديو البورتفوليو المجاني";
ar["Start with a few details."] = "ابدأ ببعض التفاصيل.";
ar["Get a polished first draft."] = "واحصل على مسودة أنيقة جاهزة.";
ar["No account, subscription, or AI key needed. Choose your sections and look; everything stays editable."] = "لا تحتاج إلى حساب أو اشتراك أو مفتاح ذكاء اصطناعي. اختر الأقسام والتصميم، ويمكنك تعديل كل شيء لاحقًا.";
ar["Portfolio site language"] = "لغة الموقع المنشور";
ar["of"] = "من";
ar["Your essential details are in place."] = "بياناتك الأساسية جاهزة.";
ar["portfolio essentials are ready."] = "من عناصر البورتفوليو الأساسية جاهز.";
ar["Drop a file, paste an image, or choose a link."] = "اسحب ملفًا أو الصق صورة أو أضف رابطًا.";
ar["Choose an image file such as JPG, PNG, or WebP."] = "اختر صورة بصيغة JPG أو PNG أو WebP.";
ar["Optimized as WebP and ready for your portfolio."] = "تم تحسين الصورة بصيغة WebP وأصبحت جاهزة للبورتفوليو.";
ar["Image optimized as WebP and embedded in your portfolio."] = "تم تحسين الصورة بصيغة WebP وإضافتها إلى البورتفوليو.";
ar["Image link added. Its host prevents WebP conversion here, but the image will still display."] = "تمت إضافة رابط الصورة. لا يسمح مصدرها بتحويل WebP، لكنها ستظهر بشكل طبيعي.";
ar["Paste a full image link that starts with https://"] = "الصق رابط صورة كاملًا يبدأ بـ https://";
ar["Portfolio site language"] = "لغة الموقع المنشور";
ar["English"] = "الإنجليزية";
ar["Arabic"] = "العربية";
ar["styles"] = "أنماط";
ar["theme"] = "السمة";
ar["Next to name"] = "بجوار الاسم";
ar["Choose and rename menu links"] = "اختر روابط القائمة وأعد تسميتها";
ar["Add a section to make it available in your menu."] = "أضف قسمًا ليظهر في القائمة.";
ar["Menu order follows the section order on the left."] = "ترتيب القائمة يتبع ترتيب الأقسام على اليسار.";
ar["Show page reading progress"] = "إظهار تقدم القراءة";
ar["Add a back-to-top button"] = "إضافة زر للعودة إلى الأعلى";
ar["Open portfolio images in a viewer"] = "فتح صور البورتفوليو في عارض الصور";
ar["Show closing footer"] = "إظهار تذييل الصفحة";
ar["Custom colors, layout and type"] = "ألوان وتنسيق وخطوط مخصصة";
ar["Website title and description"] = "عنوان الموقع ووصفه";
ar["English · left to right"] = "الإنجليزية · من اليسار لليمين";
ar["Arabic · right to left"] = "العربية · من اليمين لليسار";
ar["Add fact"] = "أضف معلومة";
ar["Remove"] = "حذف";
ar["New Project"] = "مشروع جديد";
ar["Add project"] = "أضف مشروعًا";
ar["Skill Groups"] = "مجموعات المهارات";
ar["Skills (comma separated)"] = "المهارات (افصل بينها بفواصل)";
ar["Add skill group"] = "أضف مجموعة مهارات";
ar["Entries"] = "الخبرات";
ar["Company"] = "الشركة";
ar["Organization"] = "المؤسسة";
ar["Period"] = "الفترة";
ar["Add entry"] = "أضف خبرة";
ar["My website"] = "موقعي";
ar["Note"] = "ملاحظة";
ar["Links"] = "الروابط";
ar["Platform icon"] = "أيقونة المنصة";
ar["Email address"] = "البريد الإلكتروني";
ar["Phone number"] = "رقم الهاتف";
ar["Profile or website URL"] = "رابط الحساب أو الموقع";
ar["Add link"] = "أضف رابطًا";
ar["Change image"] = "تغيير الصورة";
ar["Remove image"] = "إزالة الصورة";
ar["Choose a file"] = "اختر ملفًا";
ar["Use image link"] = "استخدم رابط الصورة";
ar["Portfolio site language"] = "لغة الموقع المنشور";
ar["Edit content"] = "تعديل المحتوى";
ar["Design"] = "التصميم";
ar["Make it yours"] = "اجعله يعبر عنك";
ar["Pick a look. You can change it any time."] = "اختر مظهرًا ويمكنك تغييره في أي وقت.";
ar["20 gradient looks + solid"] = "20 تدرجًا لونيًا ولونًا ثابتًا";
ar["Pick a look, then adjust the colors below."] = "اختر تدرجًا ثم عدّل الألوان بالأسفل.";
ar["Use a solid background"] = "استخدم خلفية بلون ثابت";
ar["Solid page"] = "خلفية ثابتة";
ar["Background gradient styles"] = "أنماط تدرجات الخلفية";
ar["Website experience"] = "تجربة الموقع";
ar["Small finishing touches across the whole portfolio."] = "لمسات بسيطة لتحسين تجربة الموقع بالكامل.";
ar["Show section navigation"] = "إظهار قائمة أقسام الموقع";
ar["Keep navigation visible while scrolling"] = "إبقاء القائمة ظاهرة أثناء التمرير";
ar["Portfolio content language"] = "لغة محتوى البورتفوليو";

ar["Section separators"] = "فواصل الأقسام";
ar["Match my template"] = "حسب تصميم القالب";
ar["Soft glow"] = "توهج ناعم";
ar["Center diamond"] = "ماسة في المنتصف";
ar["Double line"] = "خط مزدوج";
ar["Dashes"] = "خطوط متقطعة";
ar["No separator"] = "بدون فاصل";
ar["Choose how each content section connects while scrolling."] = "اختر شكل الانتقال بين الأقسام أثناء التمرير.";
ar["Motion preview"] = "معاينة الحركة";
ar["Scroll reveal preview"] = "معاينة ظهور العناصر أثناء التمرير";

const additionalArabic: Record<string, string> = {
  "Portfolio design": "تصميم البورتفوليو", "Navigation theme": "تصميم قائمة التنقل", "styles": "تصميمات",
  "Editorial Story": "قصة تحريرية", "Swiss Editorial": "تحرير سويسري", "Magazine Cover": "غلاف مجلة", "Gallery Essay": "مقال معرض", "Archive Index": "فهرس أرشيف", "Fashion Campaign": "حملة أزياء",
  "Midnight Glass": "زجاج منتصف الليل", "Aurora Orbit": "مدار الشفق", "Liquid Chrome": "كروم سائل", "Prism Gallery": "معرض المنشور", "Noir Cinema": "سينما نوار", "Soft Depth": "عمق ناعم",
  "Brutalist Poster": "ملصق بروتالي", "Neo Brutal": "بروتالي حديث", "Swiss Grid": "شبكة سويسرية", "Color Block": "كتل لونية", "Kinetic Type": "خطوط حركية", "Bold Collage": "كولاج جريء",
  "Terminal": "طرفية", "Command Center": "مركز أوامر", "Signal Grid": "شبكة الإشارات", "Blueprint": "مخطط هندسي", "Data Atlas": "أطلس البيانات", "Pixel Noir": "بيكسل نوار",
  "Editorial": "تحريري", "Atmosphere": "أجواء", "Graphic": "رسومي", "Digital": "رقمي", "About": "نبذة", "Work": "الأعمال", "Skills": "المهارات", "Experience": "الخبرات", "Contact": "تواصل",
  "Show in navigation": "إظهار في القائمة", "Navigation label": "اسم الرابط", "Match my design": "حسب التصميم", "No divider": "بدون فاصل",
  "Custom colors, layout and type": "ألوان وتنسيق وخطوط مخصصة", "Website title and description": "عنوان الموقع ووصفه", "Text color": "لون النص", "Page spacing": "مسافات الصفحة", "Compact": "مضغوط", "Balanced": "متوازن", "Airy": "واسع", "Typography": "الخطوط", "Sharp": "حاد", "Soft": "ناعم", "Round": "دائري",
  "Atmosphere glass": "زجاجي هادئ", "Color pills": "أزرار ملونة", "Quiet minimal": "بسيط", "Animated underline": "خط سفلي متحرك", "Solid accent bar": "شريط بلون مميز", "Floating dock": "قائمة عائمة", "Aurora gradient": "تدرج الشفق", "Outlined capsule": "إطار دائري", "Editorial rules": "خطوط تحريرية", "Command terminal": "أوامر رقمية", "Segmented tabs": "تبويبات مقسمة",
};
Object.assign(ar, additionalArabic);

interface LanguageContextValue { language: UiLanguage; setLanguage: (language: UiLanguage) => void; toggleLanguage: () => void; t: (english: string) => string; }
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function UiLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<UiLanguage>("en");
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") setLanguage(stored);
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.uiLanguage = language;
    try { window.localStorage.setItem(STORAGE_KEY, language); } catch { /* Private browsing may disable storage. */ }
  }, [language]);
  const value = useMemo<LanguageContextValue>(() => ({ language, setLanguage, toggleLanguage: () => setLanguage((current) => current === "en" ? "ar" : "en"), t: (english) => language === "ar" ? (ar[english] ?? english) : english }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useUiLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useUiLanguage must be used inside UiLanguageProvider");
  return context;
}

export function LanguageToggle({ className }: { className?: string | undefined }) {
  const { language, toggleLanguage, t } = useUiLanguage();
  const target = language === "en" ? "Arabic" : "English";
  return <button type="button" className={className} onClick={toggleLanguage} lang={target === "Arabic" ? "ar" : "en"} aria-label={t(`Switch interface to ${target}`)} title={t(`Switch interface to ${target}`)}>{target === "Arabic" ? "عربي" : "English"}</button>;
}
