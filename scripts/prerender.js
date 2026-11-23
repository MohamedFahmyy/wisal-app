import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const indexHtmlPath = path.resolve(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('[Prerender] Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

function safeWriteFileSync(filePath, content) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      return;
    } catch (err) {
      if ((err.code === 'EPERM' || err.code === 'EBUSY') && attempt < 4) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 80 * (attempt + 1));
        continue;
      }
      throw err;
    }
  }
}

// Import invitations data
const { invitations } = await import('../src/data/invitations.js');

console.log(`[Prerender] Generating static HTML with bespoke Open Graph metadata for ${invitations.length} invitations...`);

function toAbsoluteUrl(urlOrPath, base = 'https://wisal-app-six.vercel.app') {
  if (!urlOrPath) return `${base}/images/og/mohamed-salma-engagement.png`;
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    return urlOrPath;
  }
  return `${base}${urlOrPath.startsWith('/') ? '' : '/'}${urlOrPath}`;
}

function injectMetadata(html, {
  title,
  description,
  image,
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt,
  url,
  type = 'website'
}) {
  let modified = html;
  const absImage = toAbsoluteUrl(image);
  const altText = imageAlt || title;

  // Title tag
  modified = modified.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);

  // Meta description
  if (/<meta\s+name=["']description["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="description" content="${description}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta name="description" content="${description}" />\n  </head>`);
  }

  // Canonical link
  if (/<link\s+rel=["']canonical["']/i.test(modified)) {
    modified = modified.replace(
      /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i,
      `<link rel="canonical" href="${url}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <link rel="canonical" href="${url}" />\n  </head>`);
  }

  // Open Graph Type
  if (/<meta\s+property=["']og:type["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+property=["']og:type["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:type" content="${type}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta property="og:type" content="${type}" />\n  </head>`);
  }

  // Open Graph Title
  if (/<meta\s+property=["']og:title["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:title" content="${title}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta property="og:title" content="${title}" />\n  </head>`);
  }

  // Open Graph Description
  if (/<meta\s+property=["']og:description["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:description" content="${description}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta property="og:description" content="${description}" />\n  </head>`);
  }

  // Open Graph Image
  if (/<meta\s+property=["']og:image["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:image" content="${absImage}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta property="og:image" content="${absImage}" />\n  </head>`);
  }

  // Open Graph Image Width
  if (/<meta\s+property=["']og:image:width["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+property=["']og:image:width["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:image:width" content="${imageWidth}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta property="og:image:width" content="${imageWidth}" />\n  </head>`);
  }

  // Open Graph Image Height
  if (/<meta\s+property=["']og:image:height["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+property=["']og:image:height["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:image:height" content="${imageHeight}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta property="og:image:height" content="${imageHeight}" />\n  </head>`);
  }

  // Open Graph Image Alt
  if (/<meta\s+property=["']og:image:alt["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+property=["']og:image:alt["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:image:alt" content="${altText}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta property="og:image:alt" content="${altText}" />\n  </head>`);
  }

  // Open Graph URL
  if (/<meta\s+property=["']og:url["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:url" content="${url}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta property="og:url" content="${url}" />\n  </head>`);
  }

  // Twitter Card
  if (/<meta\s+name=["']twitter:card["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+name=["']twitter:card["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:card" content="summary_large_image" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta name="twitter:card" content="summary_large_image" />\n  </head>`);
  }

  // Twitter Title
  if (/<meta\s+name=["']twitter:title["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:title" content="${title}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta name="twitter:title" content="${title}" />\n  </head>`);
  }

  // Twitter Description
  if (/<meta\s+name=["']twitter:description["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:description" content="${description}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta name="twitter:description" content="${description}" />\n  </head>`);
  }

  // Twitter Image
  if (/<meta\s+name=["']twitter:image["']/i.test(modified)) {
    modified = modified.replace(
      /<meta\s+name=["']twitter:image["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:image" content="${absImage}" />`
    );
  } else {
    modified = modified.replace('</head>', `  <meta name="twitter:image" content="${absImage}" />\n  </head>`);
  }

  return modified;
}

// 1. Generate static HTML files for all 14 invitations
for (const inv of invitations) {
  const isMohamedSalma =
    inv.slug === 'mohamed-salma' ||
    inv.id === 'inv_mohamed_salma' ||
    inv.slug === 'mohamed-salma-v2' ||
    inv.id === 'inv_mohamed_salma_v2';
  let title;
  let description;
  let image;
  let imageWidth = 1200;
  let imageHeight = 630;
  let imageAlt;

  if (isMohamedSalma) {
    title = 'حفل خطوبه محمد وسلمى.';
    description = 'يسعدنا مشاركتكم فرحتنا.';
    image = '/images/og/mohamed-salma-engagement.png';
    imageWidth = 1024;
    imageHeight = 576;
    imageAlt = 'حفل خطوبه محمد وسلمى.';
  } else if (inv.slug === 'velvet') {
    title = 'خطوبة عبدالرحمن و آية 💍 | وِصال';
    description = 'دعوة خطوبة أونلاين: ظرف عنابي بختم شمع دهبي وصورتكم بولارويد، ورد، عد تنازلي، تأكيد حضور وتهاني.';
    image = '/images/og/velvet.jpg';
    imageWidth = 1200;
    imageHeight = 630;
    imageAlt = 'خطوبة عبدالرحمن و آية 💍';
  } else if (inv.slug === 'rosearch') {
    title = 'حفل زفاف يحيى و ليلى 🌹 | وِصال';
    description = 'على عتبة الحلم… افتح الدعوة 🌹 — قوس ورد وبوابة حديقة ساحرة، خط زمني متعرج، وخريطة مرسومة.';
    image = '/images/og/rosearch.jpg';
    imageWidth = 1200;
    imageHeight = 630;
    imageAlt = 'حفل زفاف يحيى و ليلى 🌹';
  } else if (inv.slug === 'pearl') {
    title = 'عقد قران وحفل زفاف · يوسف وليلى 🤍 | وِصال';
    description = 'اضغط على الختم وافتح الظرف 🤍 — عقد قران وحفل زفاف يوسف وليلى، بطاقة كشط التاريخ، تفاصيل اليوم، وتأكيد الحضور.';
    image = '/images/og/pearl.jpg';
    imageWidth = 1200;
    imageHeight = 630;
    imageAlt = 'عقد قران وحفل زفاف يوسف وليلى 🤍';
  } else if (inv.slug === 'veil') {
    title = 'عقد قران وحفل زفاف · عبدالرحمن وآية 🤍 | وِصال';
    description = 'طرحة عروس رقيقة تنفتح عند اللمس 🤍 — عقد قران وحفل زفاف عبدالرحمن وآية، كشط التاريخ، شريط الصور، وتأكيد الحضور.';
    image = '/images/og/veil.jpg';
    imageWidth = 1200;
    imageHeight = 630;
    imageAlt = 'عقد قران وحفل زفاف عبدالرحمن وآية 🤍';
  } else if (inv.slug === 'sage-garden') {
    title = 'حفل زفاف يوسف وأميرة 🤍 | حديقة المريمية — وِصال';
    description = 'دعوة زفاف فاخرة بظرف كريمي ومفرش دانتيل وكولاج فينتاج ساحر بألوان الأخضر الهادي والأوف وايت 🤍';
    image = '/images/og/sage-garden.jpg';
    imageWidth = 1200;
    imageHeight = 630;
    imageAlt = 'حفل زفاف يوسف وأميرة 🤍';
  } else if (inv.slug === 'velvet-voice') {
    title = 'حفل زفاف يوسف وأميرة 🤍 | Velvet Voice — وِصال';
    description = 'دعوة زفاف ملكية بظرف مخملي أحمر دافئ، ختم شمعي ثلاثي الأبعاد، تسجيل تهنئة صوتية تفاعلي، وبطاقات تنقل سلسة 🤍';
    image = '/images/og/velvet-voice.jpg';
    imageWidth = 640;
    imageHeight = 1385;
    imageAlt = 'حفل زفاف يوسف وأميرة 🤍 | Velvet Voice';
  } else if (inv.slug === 'lune') {
    title = 'حفل زفاف يوسف و ليلى 🌙 | وِصال';
    description = 'تحت نور القمر، ندعوكم لفرحنا — أبواب ثلاثية الأبعاد تنفتح على ليلة البدر فوق البحر، عد تنازلي، خط زمني، وتأكيد حضور.';
    image = '/images/og/lune.jpg';
    imageWidth = 1200;
    imageHeight = 630;
    imageAlt = 'حفل زفاف يوسف و ليلى 🌙';
  } else {
    const p = inv.people || {};
    const names = `${p.firstPerson || ''} ${p.relation || '&'} ${p.secondPerson || ''}`.trim();
    const eventTitle = inv.event?.title || 'دعوة خاصة';
    title = `دعوة ${names} — ${eventTitle} | وِصال`;
    description = `${inv.description || ''} — موعدنا يوم ${inv.event?.dateFormatted || ''} في ${inv.venue?.name || ''}.`;
    image = inv.media?.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
    imageAlt = title;
  }

  const url = `https://wisal-app-six.vercel.app/invite/${inv.slug}`;

  const invHtml = injectMetadata(baseHtml, {
    title,
    description,
    image,
    imageWidth,
    imageHeight,
    imageAlt,
    url
  });

  const targetDir = path.resolve(distDir, 'invite', inv.slug);
  fs.mkdirSync(targetDir, { recursive: true });
  safeWriteFileSync(path.resolve(targetDir, 'index.html'), invHtml);
  // Also write slug.html for direct clean-URL resolution on static hosts
  safeWriteFileSync(path.resolve(distDir, 'invite', `${inv.slug}.html`), invHtml);
}

// 2. Generate static HTML files for all marketing & tool pages
const staticPages = [
  {
    path: 'demos',
    title: `معرض التصميمات (${invitations.length} قالب استثنائي) — وِصال`,
    description: 'استكشفوا مجموعة تصميمات وِصال الحصرية. كل تصميم يقدم تجربة فتح بصرية مستقلة لمناسباتكم السعيدة.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    url: 'https://wisal-app-six.vercel.app/demos'
  },
  {
    path: 'features',
    title: 'مميزات منصة وِصال — تفاصيل استثنائية تصنع الفرق',
    description: 'تعرفوا على مميزات دعوات وِصال: حركات فتح ثلاثية الأبعاد، عداد تنازلي دقيق، تكامل خرائط Google، ومشغل موسيقى رومانسي.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    url: 'https://wisal-app-six.vercel.app/features'
  },
  {
    path: 'packages',
    title: 'باقات وأسعار الدعوات الإلكترونية — وِصال',
    description: 'باقات مصممة لتناسب مختلف التطلعات: Essential و Signature و Bespoke مع تفاصيل شفافة ودعم متكامل.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    url: 'https://wisal-app-six.vercel.app/packages'
  },
  {
    path: 'faq',
    title: 'الأسئلة الشائعة — منصة وِصال للدعوات',
    description: 'إجابات واضحة وشاملة حول كيفية عمل الدعوات، خطوات التخصيص، التوافق مع الهواتف الذكية، والمشاركة عبر واتساب.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    url: 'https://wisal-app-six.vercel.app/faq'
  },
  {
    path: 'mazen-farida',
    title: 'عقد قران و حفل زفاف مازن & فريدة | وِصال',
    description: 'اضغط على الختم وافتح الدعوة 🤍 — 14 يناير 2027 بقاعة الياسمين على كورنيش النيل.',
    image: '/farha/mf-intro-poster.jpg',
    url: 'https://wisal-app-six.vercel.app/mazen-farida'
  },
  {
    path: 'mohamed-salma',
    title: 'حفل خطوبه محمد وسلمى.',
    description: 'يسعدنا مشاركتكم فرحتنا.',
    image: '/images/og/mohamed-salma-engagement.png',
    imageWidth: 1024,
    imageHeight: 576,
    imageAlt: 'حفل خطوبه محمد وسلمى.',
    url: 'https://wisal-app-six.vercel.app/mohamed-salma'
  },
  {
    path: 'mohamed-salma-v2',
    title: 'حفل خطوبه محمد وسلمى.',
    description: 'يسعدنا مشاركتكم فرحتنا.',
    image: '/images/og/mohamed-salma-engagement.png',
    imageWidth: 1024,
    imageHeight: 576,
    imageAlt: 'حفل خطوبه محمد وسلمى.',
    url: 'https://wisal-app-six.vercel.app/mohamed-salma-v2'
  },
  {
    path: 'velvet',
    title: 'خطوبة عبدالرحمن و آية 💍 | وِصال',
    description: 'دعوة خطوبة أونلاين: ظرف عنابي بختم شمع دهبي وصورتكم بولارويد، ورد، عد تنازلي، تأكيد حضور وتهاني.',
    image: '/images/og/velvet.jpg',
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'خطوبة عبدالرحمن و آية 💍',
    url: 'https://wisal-app-six.vercel.app/velvet'
  },
  {
    path: 'rosearch',
    title: 'حفل زفاف يحيى و ليلى 🌹 | وِصال',
    description: 'على عتبة الحلم… افتح الدعوة 🌹 — قوس ورد وبوابة حديقة ساحرة، خط زمني متعرج، وخريطة مرسومة.',
    image: '/images/og/rosearch.jpg',
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'حفل زفاف يحيى و ليلى 🌹',
    url: 'https://wisal-app-six.vercel.app/rosearch'
  },
  {
    path: 'lune',
    title: 'حفل زفاف يوسف و ليلى 🌙 | وِصال',
    description: 'تحت نور القمر، ندعوكم لفرحنا — أبواب ثلاثية الأبعاد تنفتح على ليلة البدر فوق البحر، عد تنازلي، خط زمني، وتأكيد حضور.',
    image: '/images/og/lune.jpg',
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'حفل زفاف يوسف و ليلى 🌙',
    url: 'https://wisal-app-six.vercel.app/lune'
  },
  {
    path: 'pearl',
    title: 'عقد قران وحفل زفاف · يوسف وليلى 🤍 | وِصال',
    description: 'اضغط على الختم وافتح الظرف 🤍 — عقد قران وحفل زفاف يوسف وليلى، بطاقة كشط التاريخ، تفاصيل اليوم، وتأكيد الحضور.',
    image: '/images/og/pearl.jpg',
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'عقد قران وحفل زفاف يوسف وليلى 🤍',
    url: 'https://wisal-app-six.vercel.app/pearl'
  },
  {
    path: 'veil',
    title: 'عقد قران وحفل زفاف · عبدالرحمن وآية 🤍 | وِصال',
    description: 'طرحة عروس رقيقة تنفتح عند اللمس 🤍 — عقد قران وحفل زفاف عبدالرحمن وآية، كشط التاريخ، شريط الصور، وتأكيد الحضور.',
    image: '/images/og/veil.jpg',
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'عقد قران وحفل زفاف عبدالرحمن وآية 🤍',
    url: 'https://wisal-app-six.vercel.app/veil'
  },
  {
    path: 'sage-garden',
    title: 'حفل زفاف يوسف وأميرة 🤍 | حديقة المريمية — وِصال',
    description: 'دعوة زفاف فاخرة بظرف كريمي ومفرش دانتيل وكولاج فينتاج ساحر بألوان الأخضر الهادي والأوف وايت 🤍',
    image: '/images/og/sage-garden.jpg',
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'حفل زفاف يوسف وأميرة 🤍',
    url: 'https://wisal-app-six.vercel.app/sage-garden'
  },
  {
    path: 'velvet-voice',
    title: 'حفل زفاف يوسف وأميرة 🤍 | Velvet Voice — وِصال',
    description: 'دعوة زفاف ملكية بظرف مخملي أحمر دافئ، ختم شمعي ثلاثي الأبعاد، تسجيل تهنئة صوتية تفاعلي، وبطاقات تنقل سلسة 🤍',
    image: '/images/og/velvet-voice.jpg',
    imageWidth: 640,
    imageHeight: 1385,
    imageAlt: 'حفل زفاف يوسف وأميرة 🤍 | Velvet Voice',
    url: 'https://wisal-app-six.vercel.app/velvet-voice'
  },
  {
    path: 'guests',
    title: 'لوحة إدارة قائمة الضيوف وتأكيد الحضور — وِصال',
    description: 'متابعة حية لتأكيدات الحضور واعتذارات المعازيم، إجمالي الأفراد، ورسائل التهاني مع إمكانية مشاركتها ستوري وتصدير ملف Excel.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    url: 'https://wisal-app-six.vercel.app/guests'
  },
  {
    path: 'links',
    title: 'صانع روابط المعازيم المخصصة عبر واتساب — وِصال',
    description: 'أداة مجانية لتوليد روابط دعوات شخصية باسم كل ضيف مع رسالة جاهزة للإرسال المباشر على واتساب بنقرة واحدة.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    url: 'https://wisal-app-six.vercel.app/links'
  },
  {
    path: 'card',
    title: 'كروت QR المطبوعة للترابيزات والدعوات (A6) — وِصال',
    description: 'كارت للدعوة وكارت للترابيزات بنفس هوية وألوان دعوتكم: يمسح الضيف الكود لفتح الدعوة أو كتابة تهنئة تصلكم في لوحة التحكم.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    url: 'https://wisal-app-six.vercel.app/card'
  }
];

for (const page of staticPages) {
  const pageHtml = injectMetadata(baseHtml, page);
  const targetDir = path.resolve(distDir, page.path);
  fs.mkdirSync(targetDir, { recursive: true });
  safeWriteFileSync(path.resolve(targetDir, 'index.html'), pageHtml);
  safeWriteFileSync(path.resolve(distDir, `${page.path}.html`), pageHtml);
}

console.log(`[Prerender] Successfully generated static entrypoints for ${invitations.length} invitations and ${staticPages.length} pages!`);
