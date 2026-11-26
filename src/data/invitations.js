/**
 * Centralized structured invitation configurations for Wisal.
 * Complies with the schema required by Section 5 of the Master Prompt.
 */

export const invitations = [
  {
    id: 'inv_mazen_farida',
    slug: 'mazen-farida',
    template: 'mazen-farida',
    category: 'wedding',
    categoryLabel: 'زفاف',
    categoryLabelEn: 'Wedding',
    language: 'ar',
    tag: 'تجربة وِصال التفاعلية',
    tagEn: 'Interactive Experience',
    description: 'تجربة زفاف مازن وفريدة الاستثنائية: افتتاحية فيديو الختم الشمعي، بطاقات مسح التاريخ التفاعلية، الجدول الزمني المتحرك بزهرة اللوتس، ونموذج الحضور الملكي.',
    descriptionEn: 'The authentic interactive experience of Mazen & Farida: wax seal video intro, scratch-to-reveal date cards, scroll-bound flower timeline, and ceremonial RSVP arch.',
    
    people: {
      firstPerson: 'مازن',
      secondPerson: 'فريدة',
      firstPersonEn: 'Mazen',
      secondPersonEn: 'Farida',
      relation: '&'
    },

    event: {
      title: 'عقد قران و حفل زفاف',
      titleEn: 'Wedding Celebration',
      subtitle: 'حكاية حب ولقاء يكتمل بحضوركم الغالي',
      subtitleEn: 'A story of love and joy made whole by your presence',
      date: '2027-01-14',
      time: '19:00',
      dateFormatted: 'الخميس، 14 يناير 2027',
      dateFormattedEn: 'Thursday, January 14, 2027',
      timeFormatted: '7:00 مساءً',
      timeFormattedEn: '7:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '06:45 PM', timeEn: '06:45 PM', title: 'وصول الضيوف', titleEn: 'Guest Arrival' },
        { time: '07:30 PM', timeEn: '07:30 PM', title: 'دخول العروس', titleEn: 'Bridal Entrance' },
        { time: '08:00 PM', timeEn: '08:00 PM', title: 'كتب الكتاب', titleEn: 'Marriage Contract Ceremony' },
        { time: '08:30 PM', timeEn: '08:30 PM', title: 'افتتاح البوفيه والعشاء', titleEn: 'Dinner Buffet Opening' },
        { time: '09:00 PM', timeEn: '09:00 PM', title: 'الحفله وتقطيع الكعكة', titleEn: 'Party & Celebration' }
      ]
    },

    venue: {
      name: 'Al-Yasmine Banquet Hall',
      nameAr: 'قاعة الياسمين',
      address: 'كورنيش النيل — القاهرة، مصر',
      addressEn: 'Corniche El Nile, Cairo, Egypt',
      city: 'القاهرة، مصر',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=%D9%83%D9%88%D8%B1%D9%86%D9%8A%D8%B4+%D8%A7%D9%84%D9%86%D9%8A%D9%84+%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9',
      coordinates: '30.0444, 31.2357'
    },

    media: {
      coverImage: '/farha/mf-intro-poster.jpg',
      gallery: [
        '/farha/mf-intro-poster.jpg',
        '/farha/B20D1599-6455-4B98-8EE9-8A5FB2ADE06F-crop.webp'
      ]
    },

    closing: {
      dua: 'وجودكم معنا ودعواتكم الطيبة هما أجمل هدية لنا، ومشاركتكم يومنا تجعل فرحتنا أجمل وأكمل.',
      duaEn: 'Your presence and sincere prayers are the greatest gift to us on our special day.',
      signoff: 'ننتظركم بكل حب',
      signoffEn: 'With all our love'
    },

    settings: {
      showCountdown: true,
      showRSVP: true,
      showMap: true,
      showTimeline: true,
      showMusic: true,
      musicTrackUrl: '/audio/pearl.mp3'
    }
  },
  {
    id: 'inv_mohamed_salma',
    slug: 'mohamed-salma',
    template: 'mohamed-salma',
    category: 'engagement',
    categoryLabel: 'خطوبة',
    categoryLabelEn: 'Engagement',
    language: 'ar',
    tag: 'تجربة الخطوبة التفاعلية',
    tagEn: 'Interactive Engagement Experience',
    titleAr: 'حفل خطوبه محمد وسلمى.',
    titleEn: 'Mohamed & Salma Engagement Invitation | Wisal',
    description: 'يسعدنا مشاركتكم فرحتنا.',
    descriptionEn: 'Join us in celebrating the engagement of Mohamed & Salma on Monday, November 30, 2026.',
    
    people: {
      firstPerson: 'محمد',
      secondPerson: 'سلمى',
      firstPersonEn: 'Mohamed',
      secondPersonEn: 'Salma',
      relation: '&'
    },

    event: {
      title: 'حفل خطوبة',
      titleEn: 'Engagement Celebration',
      subtitle: 'فرحتنا تكتمل بوجودكم معنا في يوم خطوبتنا',
      subtitleEn: 'Our joy is made whole with your presence on our engagement day',
      date: '2026-11-30',
      time: '19:00',
      dateFormatted: 'الإثنين، 30 نوفمبر 2026',
      dateFormattedEn: 'Monday, November 30, 2026',
      timeFormatted: '7:00 مساءًا',
      timeFormattedEn: '7:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '07:00 PM', timeEn: '07:00 PM', title: 'دخول العروسين', titleEn: 'Couples Grand Entrance' },
        { time: '09:00 PM', timeEn: '09:00 PM', title: 'افتتاح البوفيه', titleEn: 'Buffet Opening' },
        { time: '09:30 PM', timeEn: '09:30 PM', title: 'تكمله الحفله', titleEn: 'Celebration Continuation' }
      ]
    },

    venue: {
      name: 'Joya',
      nameAr: 'Joya',
      address: 'Joya',
      addressEn: 'Joya',
      city: 'القاهرة، مصر',
      mapUrl: 'https://maps.app.goo.gl/V8zopCkLW2ua231J9',
      coordinates: '30.094501, 31.3441249'
    },

    media: {
      coverImage: '/images/og/mohamed-salma-engagement.png',
      ogImage: '/images/og/mohamed-salma-engagement.png',
      ogImageWidth: 1024,
      ogImageHeight: 576,
      ogImageAlt: 'حفل خطوبه محمد وسلمى.',
      gallery: [
        '/images/og/mohamed-salma-engagement.png',
        '/farha/B20D1599-6455-4B98-8EE9-8A5FB2ADE06F-crop.webp'
      ],
      music: 'https://www.youtube.com/watch?v=zs0sH8yIEEE&list=RDzs0sH8yIEEE&start_radio=1'
    },

    music: {
      title: 'زينة شباب العيلة',
      artist: 'دنيا سمير غانم',
      youtubeUrl: 'https://www.youtube.com/watch?v=zs0sH8yIEEE&list=RDzs0sH8yIEEE&start_radio=1',
      youtubeId: 'zs0sH8yIEEE'
    },

    closing: {
      dua: 'وجودكم معنا ودعواتكم الصادقة هما سر سعادتنا.. ننتظركم بكل حب لنصنع معًا أجمل الذكريات.',
      duaEn: 'Your presence and sincere prayers are the secret to our happiness.',
      signoff: 'ننتظركم بكل حب 🤍',
      signoffEn: 'Waiting for you with love'
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#b8914f',
      secondaryAccent: '#d4af37',
      bgMuted: '#fff1db',
      sealLetter: 'م & س'
    }
  },
  {
    id: 'inv_mohamed_salma_v2',
    slug: 'mohamed-salma-v2',
    template: 'mohamed-salma',
    category: 'engagement',
    categoryLabel: 'خطوبة',
    categoryLabelEn: 'Engagement',
    language: 'ar',
    tag: 'تجربة الخطوبة التفاعلية (الوردي)',
    tagEn: 'Interactive Engagement Experience (Blush Pink)',
    titleAr: 'حفل خطوبه محمد وسلمى. (V2)',
    titleEn: 'Mohamed & Salma Engagement Invitation (Pink V2) | Wisal',
    description: 'يسعدنا مشاركتكم فرحتنا.',
    descriptionEn: 'Join us in celebrating the engagement of Mohamed & Salma on Monday, November 30, 2026.',
    
    people: {
      firstPerson: 'محمد',
      secondPerson: 'سلمى',
      firstPersonEn: 'Mohamed',
      secondPersonEn: 'Salma',
      relation: '&'
    },

    event: {
      title: 'حفل خطوبة',
      titleEn: 'Engagement Celebration',
      subtitle: 'فرحتنا تكتمل بوجودكم معنا في يوم خطوبتنا',
      subtitleEn: 'Our joy is made whole with your presence on our engagement day',
      date: '2026-11-30',
      time: '19:00',
      dateFormatted: 'الإثنين، 30 نوفمبر 2026',
      dateFormattedEn: 'Monday, November 30, 2026',
      timeFormatted: '7:00 مساءًا',
      timeFormattedEn: '7:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '07:00 PM', timeEn: '07:00 PM', title: 'دخول العروسين', titleEn: 'Couples Grand Entrance' },
        { time: '09:00 PM', timeEn: '09:00 PM', title: 'افتتاح البوفيه', titleEn: 'Buffet Opening' },
        { time: '09:30 PM', timeEn: '09:30 PM', title: 'تكمله الحفله', titleEn: 'Celebration Continuation' }
      ]
    },

    venue: {
      name: 'Joya',
      nameAr: 'Joya',
      address: 'Joya',
      addressEn: 'Joya',
      city: 'القاهرة، مصر',
      mapUrl: 'https://maps.app.goo.gl/V8zopCkLW2ua231J9',
      coordinates: '30.094501, 31.3441249'
    },

    media: {
      coverImage: '/images/og/mohamed-salma-engagement.png',
      ogImage: '/images/og/mohamed-salma-engagement.png',
      ogImageWidth: 1024,
      ogImageHeight: 576,
      ogImageAlt: 'حفل خطوبه محمد وسلمى.',
      gallery: [
        '/images/og/mohamed-salma-engagement.png',
        '/farha/B20D1599-6455-4B98-8EE9-8A5FB2ADE06F-crop.webp'
      ],
      music: 'https://www.youtube.com/watch?v=zs0sH8yIEEE&list=RDzs0sH8yIEEE&start_radio=1'
    },

    music: {
      title: 'زينة شباب العيلة',
      artist: 'دنيا سمير غانم',
      youtubeUrl: 'https://www.youtube.com/watch?v=zs0sH8yIEEE&list=RDzs0sH8yIEEE&start_radio=1',
      youtubeId: 'zs0sH8yIEEE'
    },

    closing: {
      dua: 'وجودكم معنا ودعواتكم الصادقة هما سر سعادتنا.. ننتظركم بكل حب لنصنع معًا أجمل الذكريات.',
      duaEn: 'Your presence and sincere prayers are the secret to our happiness.',
      signoff: 'ننتظركم بكل حب 🤍',
      signoffEn: 'Waiting for you with love'
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#c96582',
      secondaryAccent: '#db6d89',
      bgMuted: '#fff0f3',
      sealLetter: 'م & س'
    }
  },

  {
    id: 'inv_karim_hagar',
    slug: 'karim-hagar',
    template: 'garden',
    category: 'wedding',
    categoryLabel: 'زفاف',
    categoryLabelEn: 'Wedding',
    language: 'ar',
    tag: 'جديد ومميز',
    tagEn: 'New Release',
    description: 'بوابات حديدية مزخرفة بورود الحديقة الإنجليزية تنفتح بسلاسة على باحة احتفال ساحرة.',
    descriptionEn: 'Ornate wrought-iron garden gates entwined with English roses gently swing open.',
    
    people: {
      firstPerson: 'كريم',
      secondPerson: 'هاجر',
      firstPersonEn: 'Karim',
      secondPersonEn: 'Hagar',
      relation: '&'
    },

    event: {
      title: 'ليلة من الورد والضوء',
      titleEn: 'A Night of Blooms & Light',
      subtitle: 'ندعوكم لمشاركتنا ليلة يزهر فيها الحب بين عبق الزهور',
      subtitleEn: 'We invite you to share a magical night surrounded by blooming flowers',
      date: '2027-02-18',
      time: '19:30',
      dateFormatted: 'الخميس، 18 فبراير 2027',
      dateFormattedEn: 'Thursday, February 18, 2027',
      timeFormatted: '7:30 مساءً',
      timeFormattedEn: '7:30 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '07:30 PM', timeEn: '07:30 PM', title: 'استقبال في الحديقة الخارجية', titleEn: 'Outdoor Garden Reception' },
        { time: '08:30 PM', timeEn: '08:30 PM', title: 'مراسم الزفة والورود', titleEn: 'Floral Zaffa & Entrance' },
        { time: '09:30 PM', timeEn: '09:30 PM', title: 'العشاء المفتوح والموسيقى', titleEn: 'Open Buffet & Acoustic Music' }
      ]
    },

    venue: {
      name: 'Gardenia Palace',
      nameAr: 'قصر جاردينيا — Gardenia Palace',
      address: 'طريق مصر الإسماعيلية، القاهرة',
      addressEn: 'Ismailia Desert Road, Cairo, Egypt',
      city: 'القاهرة، مصر',
      mapUrl: 'https://maps.google.com/?q=Gardenia+Palace+Cairo'
    },

    media: {
      coverImage: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      music: ''
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#9c786c',
      secondaryAccent: '#7e9680',
      bgMuted: '#f4f7f2'
    }
  },

  {
    id: 'inv_omar_eman',
    slug: 'omar-eman',
    template: 'rose',
    category: 'wedding',
    categoryLabel: 'زفاف',
    categoryLabelEn: 'Wedding',
    language: 'ar',
    tag: 'رومانسي حالم',
    tagEn: 'Romantic Arch',
    description: 'قوس من الورود الطبيعية والبتلات المتطايرة في الهواء مع لوحة ألوان بودرية دافئة.',
    descriptionEn: 'Lush rose floral archway with drifting petals against a warm blush palette.',
    
    people: {
      firstPerson: 'عمر',
      secondPerson: 'إيمان',
      firstPersonEn: 'Omar',
      secondPersonEn: 'Eman',
      relation: '&'
    },

    event: {
      title: 'بكل الحب ندعوكم',
      titleEn: 'With Love We Invite You',
      subtitle: 'حضوركم يكمل فرحتنا ويزين ليلتنا بأجمل الذكريات',
      subtitleEn: 'Your presence completes our joy and creates cherished memories',
      date: '2027-03-12',
      time: '20:00',
      dateFormatted: 'الجمعة، 12 مارس 2027',
      dateFormattedEn: 'Friday, March 12, 2027',
      timeFormatted: '8:00 مساءً',
      timeFormattedEn: '8:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '08:00 PM', timeEn: '08:00 PM', title: 'استقبال الحضور', titleEn: 'Welcome Reception' },
        { time: '09:00 PM', timeEn: '09:00 PM', title: 'دخول العروسين', titleEn: 'Couples Grand Entrance' },
        { time: '10:00 PM', timeEn: '10:00 PM', title: 'العشاء والسهرة السعيدة', titleEn: 'Dinner & Festive Evening' }
      ]
    },

    venue: {
      name: 'The Palace Giza',
      nameAr: 'ذا بالاس — The Palace',
      address: 'شارع الهرم، الجيزة، مصر',
      addressEn: 'Al Haram Street, Giza, Egypt',
      city: 'الجيزة، مصر',
      mapUrl: 'https://maps.google.com/?q=The+Palace+Giza'
    },

    media: {
      coverImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      music: ''
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#b2756a',
      secondaryAccent: '#e2b4ab',
      bgMuted: '#faf4f2'
    }
  },

  {
    id: 'inv_youssef_laila',
    slug: 'youssef-laila',
    template: 'midnight',
    category: 'wedding',
    categoryLabel: 'زفاف',
    categoryLabelEn: 'Wedding',
    language: 'ar',
    tag: 'ملكي فاخر',
    tagEn: 'Royal Velvet',
    description: 'سماء ليلية مخملية ونجوم براقة مع تفاصيل مذهبة وقوس ملكي استثنائي.',
    descriptionEn: 'Deep midnight navy canvas with shimmering celestial stars and gold leaf ornaments.',
    
    people: {
      firstPerson: 'يوسف',
      secondPerson: 'ليلى',
      firstPersonEn: 'Youssef',
      secondPersonEn: 'Laila',
      relation: '&'
    },

    event: {
      title: 'موعدنا تحت النجوم',
      titleEn: 'Beneath the Starlight',
      subtitle: 'ليلة استثنائية تحت بريق النجوم للاحتفال بعقد القلوب',
      subtitleEn: 'A magical gala celebration under celestial stars to unite two souls',
      date: '2027-05-21',
      time: '20:00',
      dateFormatted: 'الجمعة، 21 مايو 2027',
      dateFormattedEn: 'Friday, May 21, 2027',
      timeFormatted: '8:00 مساءً',
      timeFormattedEn: '8:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '08:00 PM', timeEn: '08:00 PM', title: 'سجادة الاستقبال الملكية', titleEn: 'Royal Red Carpet Reception' },
        { time: '09:00 PM', timeEn: '09:00 PM', title: 'الموكب الملكي والزفة', titleEn: 'Imperial Entrance & Zaffa' },
        { time: '10:00 PM', timeEn: '10:00 PM', title: 'المأدبة والسهرة الموسيقية', titleEn: 'Gala Banquet & Musical Night' }
      ]
    },

    venue: {
      name: 'Royal Garden Alexandria',
      nameAr: 'حدائق المنتزه الملكية',
      address: 'كورنيش الإسكندرية، مصر',
      addressEn: 'Corniche El Nile, Alexandria, Egypt',
      city: 'الإسكندرية، مصر',
      mapUrl: 'https://maps.google.com/?q=Royal+Garden+Alexandria'
    },

    media: {
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      music: ''
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#dfba76',
      secondaryAccent: '#9faec4',
      bgMuted: '#0e1626'
    }
  },

  {
    id: 'inv_salma_omar',
    slug: 'salma-omar',
    template: 'ring',
    category: 'engagement',
    categoryLabel: 'خطوبة',
    categoryLabelEn: 'Engagement',
    language: 'ar',
    tag: 'حفل خطوبة',
    tagEn: 'Engagement',
    description: 'علبة مجوهرات مخملية ثلاثية الأبعاد تنفتح لتكشف عن خاتم متلألئ وبطاقة خطوبة رقيقة.',
    descriptionEn: 'Interactive luxury velvet jewelry box opening to reveal a sparkling diamond solitaire.',
    
    people: {
      firstPerson: 'سلمى',
      secondPerson: 'عمر',
      firstPersonEn: 'Salma',
      secondPersonEn: 'Omar',
      relation: '&'
    },

    event: {
      title: 'لحظة تستحق الاحتفال',
      titleEn: 'A Moment to Treasure',
      subtitle: 'خطوتنا الأولى نحو الأبدية تبدأ بوجودكم ومحبتكم',
      subtitleEn: 'Our first step towards forever begins surrounded by your love',
      date: '2027-01-09',
      time: '18:00',
      dateFormatted: 'السبت، 9 يناير 2027',
      dateFormattedEn: 'Saturday, January 9, 2027',
      timeFormatted: '6:00 مساءً',
      timeFormattedEn: '6:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '06:00 PM', timeEn: '06:00 PM', title: 'استقبال الأهل والأصدقاء', titleEn: 'Family & Friends Gathering' },
        { time: '07:00 PM', timeEn: '07:00 PM', title: 'مراسم لبس الخواتم والشبكة', titleEn: 'Ring Exchange Ceremony' },
        { time: '08:00 PM', timeEn: '08:00 PM', title: 'حفل العشاء والاحتفال', titleEn: 'Cocktails, Dinner & Celebration' }
      ]
    },

    venue: {
      name: 'The Address Downtown',
      nameAr: 'فندق ذا أدريس — The Address',
      address: 'القاهرة الجديدة، مصر',
      addressEn: 'New Cairo, Egypt',
      city: 'القاهرة، مصر',
      mapUrl: 'https://maps.google.com/?q=The+Address+Cairo'
    },

    media: {
      coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      music: ''
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#b88b83',
      secondaryAccent: '#f5d5cc',
      bgMuted: '#fbf7f6'
    }
  },

  {
    id: 'inv_ahmed_nour',
    slug: 'ahmed-nour',
    template: 'katbketab',
    category: 'katbketab',
    categoryLabel: 'كتب كتاب',
    categoryLabelEn: 'Katb Ketab',
    language: 'ar',
    tag: 'عقد قران مبارك',
    tagEn: 'Spiritual Bond',
    description: 'عمارة إسلامية أندلسية راقية، زخارف هندسية مذهبة وفانوس مضيء بروحانية دافئة.',
    descriptionEn: 'Ornate Andalusian Islamic arches with golden arabesques and glowing heritage lanterns.',
    
    people: {
      firstPerson: 'أحمد',
      secondPerson: 'نور',
      firstPersonEn: 'Ahmed',
      secondPersonEn: 'Nour',
      relation: '&'
    },

    event: {
      title: 'على سنة الله ورسوله',
      titleEn: 'In Sacred Union',
      subtitle: 'بارك الله لهما وبارك عليهما وجمع بينهما في خير',
      subtitleEn: 'May Allah bless them and unite them in love and enduring grace',
      date: '2027-04-02',
      time: '17:00',
      dateFormatted: 'الجمعة، 2 أبريل 2027',
      dateFormattedEn: 'Friday, April 2, 2027',
      timeFormatted: '5:00 مساءً',
      timeFormattedEn: '5:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '05:00 PM', timeEn: '05:00 PM', title: 'استقبال الحضور والضيافة', titleEn: 'Welcome & Traditional Hospitality' },
        { time: '05:45 PM', timeEn: '05:45 PM', title: 'مراسم عقد القران وإشهار الزواج', titleEn: 'Islamic Marriage Contract Ceremony' },
        { time: '06:30 PM', timeEn: '06:30 PM', title: 'التهاني وتوزيع الحلوى التذكارية', titleEn: 'Congratulations & Traditional Sweets' }
      ]
    },

    venue: {
      name: 'Al Noor Hall',
      nameAr: 'قاعة ودار مناسبات النور',
      address: 'ميدان العباسية، القاهرة',
      addressEn: 'Abbassia, Cairo, Egypt',
      city: 'القاهرة، مصر',
      mapUrl: 'https://maps.google.com/?q=Cairo'
    },

    media: {
      coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      music: ''
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#aa8651',
      secondaryAccent: '#4c654f',
      bgMuted: '#f8f5ee'
    }
  },

  {
    id: 'inv_nour_birthday',
    slug: 'nour-birthday',
    template: 'birthday',
    category: 'birthday',
    categoryLabel: 'عيد ميلاد',
    categoryLabelEn: 'Birthday',
    language: 'ar',
    tag: 'بهجة واحتفال',
    tagEn: 'Celebration',
    description: 'صندوق هدايا أنيق ينفتح مع وابل من الكونفيتي المرح والعد التنازلي المبهج.',
    descriptionEn: 'Chic celebration gift box opening with confetti burst and vibrant party countdown.',
    
    people: {
      firstPerson: 'نور',
      secondPerson: '',
      firstPersonEn: 'Nour',
      secondPersonEn: '',
      relation: ''
    },

    event: {
      title: 'Thirty, Flirty & Thriving!',
      titleEn: 'Thirty, Flirty & Thriving!',
      subtitle: 'سنة جديدة، ضحكات جديدة، وليلة مستحيل تتنسي مع أغلى الناس',
      subtitleEn: 'A milestone year filled with laughter, great music, and vibrant memories',
      date: '2027-06-10',
      time: '20:00',
      dateFormatted: 'الخميس، 10 يونيو 2027',
      dateFormattedEn: 'Thursday, June 10, 2027',
      timeFormatted: '8:00 مساءً',
      timeFormattedEn: '8:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '08:00 PM', timeEn: '08:00 PM', title: 'وصول الضيوف ومشروبات الترحيب', titleEn: 'Guest Arrival & Welcome Cocktails' },
        { time: '09:00 PM', timeEn: '09:00 PM', title: 'مفاجأة الاحتفال والكعكة', titleEn: 'Surprise Reveal & Cake Cutting' },
        { time: '10:00 PM', timeEn: '10:00 PM', title: 'موسيقى، رقص، وتصوير', titleEn: 'DJ, Dance Floor & Photo Booth' }
      ]
    },

    venue: {
      name: 'The Rooftop Garden',
      nameAr: 'حديقة الرووف — المعادي',
      address: 'شارع 9، المعادي، القاهرة',
      addressEn: 'Road 9, Maadi, Cairo, Egypt',
      city: 'القاهرة، مصر',
      mapUrl: 'https://maps.google.com/?q=Cairo'
    },

    media: {
      coverImage: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      music: ''
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#d26a7e',
      secondaryAccent: '#f5c66e',
      bgMuted: '#fdf3f5'
    }
  },

  {
    id: 'inv_adam_jana',
    slug: 'adam-jana',
    template: 'blanc',
    category: 'wedding',
    categoryLabel: 'زفاف',
    categoryLabelEn: 'Wedding',
    language: 'ar',
    tag: 'مينيمال معاصر',
    tagEn: 'Modern Minimal',
    description: 'أناقة البساطة البيضاء، خطوط طباعية نقية، وبتلات زهور بيضاء تسقط بهدوء سحري.',
    descriptionEn: 'Pure aesthetic editorial minimalism with blind embossing and delicate white petals.',
    
    people: {
      firstPerson: 'آدم',
      secondPerson: 'جنى',
      firstPersonEn: 'Adam',
      secondPersonEn: 'Jana',
      relation: '&'
    },

    event: {
      title: 'A Little Forever',
      titleEn: 'A Little Forever',
      subtitle: 'نقاء البدايات وصدق المشاعر في احتفال هادئ ومميز',
      subtitleEn: 'The purity of beginnings and honest emotion in an intimate celebration',
      date: '2027-09-04',
      time: '19:00',
      dateFormatted: 'السبت، 4 سبتمبر 2027',
      dateFormattedEn: 'Saturday, September 4, 2027',
      timeFormatted: '7:00 مساءً',
      timeFormattedEn: '7:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '07:00 PM', timeEn: '07:00 PM', title: 'استقبال هادئ', titleEn: 'Quiet Reception' },
        { time: '08:00 PM', timeEn: '08:00 PM', title: 'مراسم الوعود', titleEn: 'Vow Ceremony' },
        { time: '09:00 PM', timeEn: '09:00 PM', title: 'عشاء تحت الأضواء الخافتة', titleEn: 'Intimate Candlelit Dinner' }
      ]
    },

    venue: {
      name: 'The Glasshouse',
      nameAr: 'القاعة الزجاجية البيضاء',
      address: 'طريق الواحات، 6 أكتوبر، الجيزة',
      addressEn: 'Wahat Road, 6th of October, Giza',
      city: 'الجيزة، مصر',
      mapUrl: 'https://maps.google.com/?q=Cairo'
    },

    media: {
      coverImage: 'https://images.unsplash.com/photo-1519225424424-69970c679233?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      music: ''
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#7a7369',
      secondaryAccent: '#c3b49f',
      bgMuted: '#faf8f5'
    }
  },

  {
    id: 'inv_seif_malak',
    slug: 'seif-malak',
    template: 'provence',
    category: 'wedding',
    categoryLabel: 'زفاف',
    categoryLabelEn: 'Wedding',
    language: 'ar',
    tag: 'طبيعة ولافندر',
    tagEn: 'Provence Meadow',
    description: 'نافذة فرنسية كلاسيكية تنفتح على حقول اللافندر الساحرة في وقت الغروب الذهبي.',
    descriptionEn: 'Rustic French shuttered windows opening to sun-drenched lavender hills at golden hour.',
    
    people: {
      firstPerson: 'سيف',
      secondPerson: 'ملك',
      firstPersonEn: 'Seif',
      secondPersonEn: 'Malak',
      relation: '&'
    },

    event: {
      title: 'حيث يزهر الحب',
      titleEn: 'Where Love Blooms',
      subtitle: 'وسط نسمات الهواء النقي وألوان الغروب الدافئة، نحتفل بعهدنا',
      subtitleEn: 'Amidst gentle country breezes and golden sunset hues, we celebrate our vows',
      date: '2027-10-16',
      time: '18:30',
      dateFormatted: 'السبت، 16 أكتوبر 2027',
      dateFormattedEn: 'Saturday, October 16, 2027',
      timeFormatted: '6:30 مساءً',
      timeFormattedEn: '6:30 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '06:30 PM', timeEn: '06:30 PM', title: 'مشروبات وقت الغروب', titleEn: 'Golden Hour Cocktails' },
        { time: '07:30 PM', timeEn: '07:30 PM', title: 'عقد القران وتبادل العهود', titleEn: 'Sunset Ceremony' },
        { time: '08:30 PM', timeEn: '08:30 PM', title: 'عشاء ريفي فاخر وموسيقى', titleEn: 'Rustic Gourmet Feast' }
      ]
    },

    venue: {
      name: 'Lavender Estate',
      nameAr: 'مزرعة اللافندر — بحيرة قارون',
      address: 'طريق تونس، الفيوم، مصر',
      addressEn: 'Tunis Village, Fayoum, Egypt',
      city: 'الفيوم، مصر',
      mapUrl: 'https://maps.google.com/?q=Fayoum'
    },

    media: {
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      music: ''
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#7b688c',
      secondaryAccent: '#929b7a',
      bgMuted: '#f6f3f8'
    }
  },

  {
    id: 'inv_hana_karim',
    slug: 'hana-karim',
    template: 'letter',
    category: 'anniversary',
    categoryLabel: 'ذكرى سنوية',
    categoryLabelEn: 'Anniversary',
    language: 'ar',
    tag: 'رسالة رومانسية',
    tagEn: 'Love Letter',
    description: 'خطاب عاطفي فاخر ينساب من ظرف أنيق ليحكي ذكريات 10 سنوات من المحبة والوفاء.',
    descriptionEn: 'Folded stationery love letter uncreasing from a tailored calligraphy envelope.',
    
    people: {
      firstPerson: 'هنا',
      secondPerson: 'كريم',
      firstPersonEn: 'Hana',
      secondPersonEn: 'Karim',
      relation: '&'
    },

    event: {
      title: 'عشر سنوات من الحكايات',
      titleEn: 'Ten Years of Beautiful Stories',
      subtitle: 'نحتفل بعقد كامل من المودة والشراكة الجميلة مع كل من شاركونا الرحلة',
      subtitleEn: 'Celebrating a full decade of affection, devotion, and wonderful memories',
      date: '2027-08-14',
      time: '19:00',
      dateFormatted: 'السبت، 14 أغسطس 2027',
      dateFormattedEn: 'Saturday, August 14, 2027',
      timeFormatted: '7:00 مساءً',
      timeFormattedEn: '7:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '07:00 PM', timeEn: '07:00 PM', title: 'معرض ذكريات العشر سنوات', titleEn: 'Decade of Memories Gallery' },
        { time: '08:00 PM', timeEn: '08:00 PM', title: 'كلمات المحبة وتجديد الوعود', titleEn: 'Toasts & Renewed Vows' },
        { time: '09:00 PM', timeEn: '09:00 PM', title: 'العشاء الموسيقي', titleEn: 'Romantic Musical Dinner' }
      ]
    },

    venue: {
      name: 'Villa Belle Epoque',
      nameAr: 'فيلا بيل إيبوك — المعادي',
      address: 'شارع 13، المعادي، القاهرة',
      addressEn: 'Road 13, Maadi, Cairo, Egypt',
      city: 'القاهرة، مصر',
      mapUrl: 'https://maps.google.com/?q=Cairo'
    },

    media: {
      coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      music: ''
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#a16d5e',
      secondaryAccent: '#d5b99e',
      bgMuted: '#fbf6f0'
    }
  },

  {
    id: 'inv_malek_nour',
    slug: 'malek-nour',
    template: 'doors',
    category: 'wedding',
    categoryLabel: 'زفاف',
    categoryLabelEn: 'Wedding',
    language: 'ar',
    tag: 'أبواب القصر',
    tagEn: 'Grand Palace Doors',
    description: 'أبواب قصر مزدوجة ضخمة مزخرفة بأكاليل الورود تنفتح على قاعة الاحتفال الكبرى.',
    descriptionEn: 'Double-winged majestic palace doors entwined with hydrangeas swinging wide open.',
    
    people: {
      firstPerson: 'مالك',
      secondPerson: 'نور',
      firstPersonEn: 'Malek',
      secondPersonEn: 'Nour',
      relation: '&'
    },

    event: {
      title: 'باب إلى حكايتنا الأبدية',
      titleEn: 'A Gateway to Forever',
      subtitle: 'تنفتح أبواب الفرح لنلتقي بكل الأحباب في أبهى ليلة',
      subtitleEn: 'The doors of joy swing open as we welcome our beloved guests to our night',
      date: '2027-11-06',
      time: '19:00',
      dateFormatted: 'السبت، 6 نوفمبر 2027',
      dateFormattedEn: 'Saturday, November 6, 2027',
      timeFormatted: '7:00 مساءً',
      timeFormattedEn: '7:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '07:00 PM', timeEn: '07:00 PM', title: 'فتح الأبواب واستقبال الضيوف', titleEn: 'Doors Open & Reception' },
        { time: '08:00 PM', timeEn: '08:00 PM', title: 'المراسم والزفة الملكية', titleEn: 'Grand Royal Entrance' },
        { time: '09:00 PM', timeEn: '09:00 PM', title: 'العشاء والاحتفال الساهر', titleEn: 'Imperial Banquet & Celebration' }
      ]
    },

    venue: {
      name: 'Kempinski Royal Hall',
      nameAr: 'قاعة كمبنسكي الكبرى',
      address: 'القاهرة الجديدة، التجمع الأول',
      addressEn: 'First Settlement, New Cairo, Egypt',
      city: 'القاهرة، مصر',
      mapUrl: 'https://maps.google.com/?q=Cairo'
    },

    media: {
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      music: ''
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#9c735d',
      secondaryAccent: '#bf9b7a',
      bgMuted: '#f7f2ea'
    }
  },

  {
    id: 'inv_yara_graduation',
    slug: 'yara-graduation',
    template: 'modern',
    category: 'graduation',
    categoryLabel: 'تخرج',
    categoryLabelEn: 'Graduation',
    language: 'ar',
    tag: 'احتفال تخرج',
    tagEn: 'Graduation Gala',
    description: 'تصميم تحريري عصري يجمع بين صور البطولة وتأثيرات الزجاج الشفاف ومعرض صور راقٍ.',
    descriptionEn: 'High-fashion editorial layout featuring full-bleed photography and sleek glassmorphism.',
    
    people: {
      firstPerson: 'يارا',
      secondPerson: '',
      firstPersonEn: 'Yara',
      secondPersonEn: '',
      relation: ''
    },

    event: {
      title: 'The Next Chapter',
      titleEn: 'The Next Chapter',
      subtitle: 'نهاية مشوار دراسي وبداية انطلاقة لمستقبل مشرق نصنعه بالطموح',
      subtitleEn: 'Celebrating hard-earned success, scholastic dedication, and the dawn of a bright future',
      date: '2027-07-01',
      time: '18:00',
      dateFormatted: 'الخميس، 1 يوليو 2027',
      dateFormattedEn: 'Thursday, July 1, 2027',
      timeFormatted: '6:00 مساءً',
      timeFormattedEn: '6:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '06:00 PM', timeEn: '06:00 PM', title: 'استقبال الزملاء والأصدقاء', titleEn: 'Welcome Reception & Cocktails' },
        { time: '07:00 PM', timeEn: '07:00 PM', title: 'مراسم التكريم وتوزيع الشهادات', titleEn: 'Graduation Honors Ceremony' },
        { time: '08:00 PM', timeEn: '08:00 PM', title: 'حفل العشاء والاحتفال المسائي', titleEn: 'Celebration Dinner & Music' }
      ]
    },

    venue: {
      name: 'AUC New Cairo Campus',
      nameAr: 'قاعة الاحتفالات الكبرى — الجامعة الأمريكية',
      address: 'شارع التسعين الجنوبي، القاهرة الجديدة',
      addressEn: 'South Teseen St, New Cairo, Egypt',
      city: 'القاهرة، مصر',
      mapUrl: 'https://maps.google.com/?q=Cairo'
    },

    media: {
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
      ],
      music: ''
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#4c645b',
      secondaryAccent: '#9fae9a',
      bgMuted: '#f3f6f4'
    }
  },
  {
    id: 'inv_velvet',
    slug: 'velvet',
    template: 'velvet',
    category: 'engagement',
    categoryLabel: 'خطوبة',
    categoryLabelEn: 'Engagement',
    language: 'ar',
    tag: 'تجربة الڤيلڤيت الفاخرة',
    tagEn: 'Velvet Luxury Experience',
    titleAr: 'حفل خطوبة عبدالرحمن و آية 💍',
    titleEn: 'Abdelrahman & Aya Engagement Invitation | Wisal',
    description: 'دعوة خطوبة أونلاين: ظرف عنابي بختم شمع دهبي وصورتكم بولارويد، ورد، عد تنازلي، تأكيد حضور وتهاني.',
    descriptionEn: 'Luxury velvet burgundy envelope with wax seal, polaroid reveal, 3D gallery, countdown and live wishes wall.',

    people: {
      firstPerson: 'عبدالرحمن',
      secondPerson: 'آية',
      firstPersonEn: 'Abdelrahman',
      secondPersonEn: 'Aya',
      relation: '&'
    },

    event: {
      title: 'حفل خطوبة',
      titleEn: 'Engagement Celebration',
      subtitle: 'بكل الحب، ندعوكم لمشاركتنا فرحتنا بليلة العمر',
      subtitleEn: 'With all our love, we invite you to share our joy',
      date: '2026-12-20',
      time: '20:00',
      dateFormatted: 'الأحد، 20 ديسمبر 2026',
      dateFormattedEn: 'Sunday, December 20, 2026',
      timeFormatted: '8:00 مساءً',
      timeFormattedEn: '8:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '07:30 PM', timeEn: '07:30 PM', title: 'وصول الضيوف', titleEn: 'Guest Arrival' },
        { time: '08:00 PM', timeEn: '08:00 PM', title: 'مراسم الخطوبة وتلبيس الدبل', titleEn: 'Engagement Rings Ceremony' },
        { time: '09:00 PM', timeEn: '09:00 PM', title: 'العشاء والاحتفال', titleEn: 'Dinner & Celebration' }
      ]
    },

    venue: {
      name: 'قاعة الياسمين',
      nameAr: 'قاعة الياسمين',
      nameEn: 'Al Yasmine Hall',
      address: 'مصر الجديدة، القاهرة',
      addressEn: 'Heliopolis, Cairo, Egypt',
      city: 'القاهرة، مصر',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Heliopolis+Cairo+Egypt',
      coordinates: '30.0914, 31.2585'
    },

    media: {
      coverImage: '/img/velvet/cover.webp',
      ogImage: '/images/og/velvet.jpg',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      ogImageAlt: 'خطوبة عبدالرحمن و آية 💍',
      gallery: [
        '/img/velvet/p1.webp',
        '/img/velvet/p2.webp',
        '/img/velvet/p3.webp',
        '/img/velvet/p4.webp',
        '/img/velvet/p5.webp'
      ],
      music: '/audio/envelope.mp3'
    },

    closing: {
      dua: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
      duaEn: 'And among His signs is that He created for you mates, that you may find tranquility in them, and He placed between you affection and mercy.',
      signoff: 'With love, we await you',
      signoffEn: 'With love, we await you'
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#5c1422',
      secondaryAccent: '#c9a265',
      bgMuted: '#f7efe6'
    }
  },
  {
    id: 'inv_rosearch',
    slug: 'rosearch',
    template: 'rosearch',
    category: 'wedding',
    categoryLabel: 'زفاف',
    categoryLabelEn: 'Wedding',
    language: 'ar',
    tag: 'تجربة قوس الورد الرومانسية',
    tagEn: 'Rose Arch Experience',
    titleAr: 'حفل زفاف يحيى و ليلى 🌹',
    titleEn: 'Yehia & Laila Wedding Invitation | Wisal',
    description: 'قوس ورد وبوابة حديقة ساحرة، خط زمني متعرج، وخريطة مرسومة أنيقة مع نموذج حضور رومانسي.',
    descriptionEn: 'Rose Arch romantic wedding experience: botanical arch, blooming garden gate, watercolor milestones, and illustrated map.',

    people: {
      firstPerson: 'يحيى',
      secondPerson: 'ليلى',
      firstPersonEn: 'Yehia',
      secondPersonEn: 'Laila',
      relation: '&'
    },

    event: {
      title: 'حفل زفاف',
      titleEn: 'Wedding Celebration',
      subtitle: 'وراء كل باب حكاية، وحكايتنا بدأت من هنا… افتحوا الباب وشاركونا الفرحة',
      subtitleEn: 'Behind every door is a story, and ours began here… Open the door and share our joy',
      date: '2027-05-08',
      time: '19:00',
      dateFormatted: 'السبت، 8 مايو 2027',
      dateFormattedEn: 'Saturday, May 8, 2027',
      timeFormatted: '7:00 مساءً',
      timeFormattedEn: '7:00 PM',
      timezone: 'Africa/Cairo',
      schedule: [
        { time: '07:00 PM', timeEn: '07:00 PM', title: 'استقبال الضيوف', titleEn: 'Guest Reception' },
        { time: '07:30 PM', timeEn: '07:30 PM', title: 'كتب الكتاب', titleEn: 'Marriage Contract' },
        { time: '08:30 PM', timeEn: '08:30 PM', title: 'دخول العروسين', titleEn: 'Couples Grand Entrance' },
        { time: '09:00 PM', timeEn: '09:00 PM', title: 'الرقصة الأولى', titleEn: 'First Dance' },
        { time: '09:30 PM', timeEn: '09:30 PM', title: 'العشاء', titleEn: 'Dinner' },
        { time: '10:30 PM', timeEn: '10:30 PM', title: 'تقطيع التورتة', titleEn: 'Cake Cutting' }
      ]
    },

    venue: {
      name: 'حديقة الورد',
      nameAr: 'حديقة الورد',
      nameEn: 'The Rose Garden',
      address: 'المعادي، القاهرة',
      addressEn: 'Maadi, Cairo, Egypt',
      city: 'القاهرة، مصر',
      mapUrl: 'https://maps.google.com/?q=Maadi+Cairo+Egypt',
      coordinates: '29.9602, 31.2569'
    },

    media: {
      coverImage: '/img/rosearch/arch-pink-roses.webp',
      ogImage: '/images/og/rosearch.jpg',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      ogImageAlt: 'حفل زفاف يحيى و ليلى 🌹',
      gallery: [
        '/img/rosearch/arch-pink-roses.webp',
        '/img/rosearch/gate-pink-roses.webp',
        '/img/rosearch/corner-blush-roses.webp',
        '/img/rosearch/couple-blush.webp'
      ],
      music: '/audio/veil.mp3'
    },

    closing: {
      dua: 'بارك الله لكما، وبارك عليكما، وجمع بينكما في خير. اللهم اجعل بيتهما عامرًا بالمودة والرحمة، واجعل أيامهما كلها فرح وسكينة.',
      duaEn: 'May Allah bless you, shower His blessings upon you, and unite you both in goodness.',
      signoff: 'مستنيينكم بكل الحب',
      signoffEn: 'With all our love'
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#7A4E55',
      secondaryAccent: '#C2A267',
      bgMuted: '#FBF7F4'
    }
  },
  {
    id: 'inv_lune',
    slug: 'lune',
    template: 'lune',
    category: 'wedding',
    categoryLabel: 'زفاف',
    categoryLabelEn: 'Wedding',
    language: 'ar',
    tag: 'تجربة ليلة القمر الرومانسية',
    tagEn: 'Under The Moonlight Experience',
    titleAr: 'حفل زفاف يوسف و ليلى 🌙',
    titleEn: 'Youssef & Laila Wedding Invitation | Wisal',
    description: 'تحت نور القمر، ندعوكم لفرحنا — أبواب ثلاثية الأبعاد تنفتح على ليلة البدر فوق البحر، عد تنازلي، خط زمني، وتأكيد حضور.',
    descriptionEn: 'Under the moonlight, join us as we wed — 3D opening doors, full moon terrace above the sea, live countdown, timeline, and RSVP.',

    people: {
      firstPerson: 'يوسف',
      secondPerson: 'ليلى',
      firstPersonEn: 'Youssef',
      secondPersonEn: 'Laila',
      firstPersonTitle: 'العريس',
      secondPersonTitle: 'العروس',
      firstPersonTitleEn: 'The Groom',
      secondPersonTitleEn: 'The Bride',
      parentsAr: 'تتشرف عائلتا يوسف وليلى بدعوتكم',
      parentsEn: 'Together with their families, Youssef & Laila'
    },

    event: {
      type: 'wedding',
      title: 'حفل زفاف يوسف و ليلى',
      titleEn: 'Youssef & Laila Wedding',
      date: '2027-08-21',
      time: '20:00',
      timeFormatted: '٨:٠٠ مساءً',
      timeFormattedEn: '8:00 PM',
      dateFormatted: 'السبت، ٢١ أغسطس ٢٠٢٧',
      dateFormattedEn: 'Saturday, 21 August 2027',
      hijriDate: '١٨ صفر ١٤٤٩ هـ',
      hijriDateEn: '18 Safar 1449 AH',
      epochMs: 1818867600000,
      description: 'على تراس فوق البحر وتحت ضوء القمر، هنرقص أول رقصة في حياتنا سوا. وجودكم هيكمّل الليلة.'
    },

    venue: {
      name: 'تراس القمر',
      nameEn: 'Moonlight Terrace',
      hall: 'التراس المفتوح',
      hallEn: 'Open Sea Terrace',
      city: 'العلمين الجديدة',
      cityEn: 'New Alamein',
      address: 'العلمين الجديدة، الساحل الشمالي',
      addressEn: 'New Alamein, North Coast',
      mapEmbedUrl: 'https://maps.google.com/maps?q=New%20Alamein&z=14&output=embed',
      mapUrl: 'https://maps.google.com/?q=New+Alamein',
      coordinates: '30.8358, 28.9536'
    },

    media: {
      coverImage: '/img/lune/gate.jpg',
      ogImage: '/images/og/lune.jpg',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      ogImageAlt: 'حفل زفاف يوسف و ليلى 🌙',
      gallery: [
        '/img/lune/gate.jpg',
        '/img/lune/scene-couple.jpg'
      ],
      music: '/audio/veil.mp3'
    },

    closing: {
      dua: 'بارك الله لكما، وبارك عليكما، وجمع بينكما في خير.',
      duaEn: 'May Allah bless you and unite you in goodness.',
      signoff: 'وجودكم معانا هو اللي هيكمل فرحتنا',
      signoffEn: 'Your presence is the greatest gift of all'
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#d9c08a',
      secondaryAccent: '#1c2642',
      bgMuted: '#0e1424'
    }
  },
  {
    id: 'inv_ahmed_mia',
    slug: 'ahmed-mia',
    aliases: ['ahmed-adel-mia-khalifa', 'ahmed-mia-khalifa', 'ahmed-nancy', 'ahmed-adel-nancy-ajram'],
    template: 'lune',
    category: 'wedding',
    categoryLabel: 'زفاف',
    categoryLabelEn: 'Wedding',
    language: 'ar',
    tag: 'تجربة ليلة القمر الرومانسية',
    tagEn: 'Under The Moonlight Experience',
    titleAr: 'حفل زفاف أحمد عادل و ميا خليفه 🌙',
    titleEn: 'Ahmed Adel & Mia Khalifa Wedding Invitation | Wisal',
    description: 'تحت نور القمر، ندعوكم لفرحنا — حفل زفاف أحمد عادل وميا خليفه. أبواب ثلاثية الأبعاد تنفتح على ليلة البدر فوق البحر، عد تنازلي، خط زمني، وتأكيد حضور.',
    descriptionEn: 'Under the moonlight, join us as we wed — Ahmed Adel & Mia Khalifa. 3D opening doors, full moon terrace above the sea, live countdown, timeline, and RSVP.',

    people: {
      firstPerson: 'أحمد عادل',
      secondPerson: 'ميا خليفه',
      firstPersonEn: 'Ahmed Adel',
      secondPersonEn: 'Mia Khalifa',
      firstPersonTitle: 'العريس',
      secondPersonTitle: 'العروس',
      firstPersonTitleEn: 'The Groom',
      secondPersonTitleEn: 'The Bride',
      parentsAr: 'تتشرف عائلتا أحمد عادل وميا خليفه بدعوتكم',
      parentsEn: 'Together with their families, Ahmed Adel & Mia Khalifa'
    },

    event: {
      type: 'wedding',
      title: 'حفل زفاف أحمد عادل و ميا خليفه',
      titleEn: 'Ahmed Adel & Mia Khalifa Wedding',
      date: '2027-08-21',
      time: '20:00',
      timeFormatted: '٨:٠٠ مساءً',
      timeFormattedEn: '8:00 PM',
      dateFormatted: 'السبت، ٢١ أغسطس ٢٠٢٧',
      dateFormattedEn: 'Saturday, 21 August 2027',
      hijriDate: '١٨ صفر ١٤٩ هـ',
      hijriDateEn: '18 Safar 1449 AH',
      epochMs: 1818867600000,
      description: 'على تراس فوق البحر وتحت ضوء القمر، هنرقص أول رقصة في حياتنا سوا. وجودكم هيكمّل الليلة.'
    },

    venue: {
      name: 'تراس القمر',
      nameEn: 'Moonlight Terrace',
      hall: 'التراس المفتوح',
      hallEn: 'Open Sea Terrace',
      city: 'العلمين الجديدة',
      cityEn: 'New Alamein',
      address: 'العلمين الجديدة، الساحل الشمالي',
      addressEn: 'New Alamein, North Coast',
      mapEmbedUrl: 'https://maps.google.com/maps?q=New%20Alamein&z=14&output=embed',
      mapUrl: 'https://maps.google.com/?q=New+Alamein',
      coordinates: '30.8358, 28.9536'
    },

    media: {
      coverImage: '/img/lune/gate.jpg',
      ogImage: '/images/og/lune.jpg',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      ogImageAlt: 'حفل زفاف أحمد عادل و ميا خليفه 🌙',
      gallery: [
        '/img/lune/gate.jpg',
        '/img/lune/scene-couple.jpg'
      ],
      music: '/audio/farhy.m4a'
    },

    closing: {
      dua: 'بارك الله لكما، وبارك عليكما، وجمع بينكما في خير.',
      duaEn: 'May Allah bless you and unite you in goodness.',
      signoff: 'وجودكم معانا هو اللي هيكمل فرحتنا',
      signoffEn: 'Your presence is the greatest gift of all'
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#d9c08a',
      secondaryAccent: '#1c2642',
      bgMuted: '#0e1424'
    }
  },
  {
    id: 'inv_pearl',
    slug: 'pearl',
    template: 'pearl',
    category: 'wedding',
    categoryLabel: 'عقد قران وزفاف',
    categoryLabelEn: 'Katb el-Ketab & Wedding',
    language: 'ar',
    tag: 'ختم الشمع العاجي وكشط التاريخ',
    tagEn: 'Ivory Wax Seal & Scratch Card',
    titleAr: 'عقد قران وحفل زفاف · يوسف وليلى 🤍',
    titleEn: 'Youssef & Laila — Katb el-Ketab & Wedding | Wisal',
    description: 'اضغط على الختم وافتح الظرف 🤍 — عقد قران وحفل زفاف يوسف وليلى، بطاقة كشط التاريخ، تفاصيل اليوم، وتأكيد الحضور.',
    descriptionEn: 'Tap the wax seal and open the embossed ivory envelope — scratch card to reveal the date, schedule of the day, live countdown, and RSVP.',

    people: {
      firstPerson: 'يوسف',
      secondPerson: 'ليلى',
      firstPersonEn: 'Youssef',
      secondPersonEn: 'Laila',
      firstPersonTitle: 'العريس',
      secondPersonTitle: 'العروس',
      firstPersonTitleEn: 'The Groom',
      secondPersonTitleEn: 'The Bride',
      parentsAr: 'تتشرف عائلتا يوسف وليلى بدعوتكم',
      parentsEn: 'Together with their families, Youssef & Laila'
    },

    event: {
      type: 'wedding',
      title: 'عقد قران وحفل زفاف يوسف وليلى',
      titleEn: 'Katb el-Ketab & Wedding of Youssef & Laila',
      date: '2027-02-18',
      time: '19:00',
      timeFormatted: '٧:٠٠ مساءً',
      timeFormattedEn: '7:00 PM',
      dateFormatted: 'الخميس، ١٨ فبراير ٢٠٢٧',
      dateFormattedEn: 'Thursday, 18 February 2027',
      hijriDate: '١١ شعبان ١٤٤٨ هـ',
      hijriDateEn: '11 Sha\'ban 1448 AH',
      epochMs: 1771434000000,
      description: 'بسم الله وعلى بركة الله، يتشرف أهل العروسين بدعوتكم لحضور عقد القران وحفل الزفاف.'
    },

    venue: {
      name: 'قاعة الياقوت',
      nameEn: 'Al Yaqout Hall',
      hall: 'القاعة الكبرى',
      hallEn: 'Grand Hall',
      city: 'مصر الجديدة، القاهرة',
      cityEn: 'Heliopolis, Cairo',
      address: 'مصر الجديدة، القاهرة',
      addressEn: 'Heliopolis, Cairo, Egypt',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Heliopolis%20Cairo&z=14&output=embed',
      mapUrl: 'https://maps.google.com/?q=Heliopolis+Cairo',
      coordinates: '30.0875, 31.3285'
    },

    media: {
      coverImage: '/img/wedding/cover.jpg',
      ogImage: '/images/og/pearl.jpg',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      ogImageAlt: 'عقد قران وحفل زفاف يوسف وليلى 🤍',
      gallery: [
        '/img/wedding/cover.jpg'
      ],
      music: '/audio/pearl.mp3'
    },

    closing: {
      dua: 'وجودكم معانا هو اللي هيكمل فرحتنا. شكرًا من قلبنا إنكم جزء من يومنا.',
      duaEn: 'Having you with us is what will make our day complete. Thank you, from our hearts.',
      signoff: 'يوسف وليلى',
      signoffEn: 'Youssef & Laila'
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#b8944f',
      secondaryAccent: '#86672d',
      bgMuted: '#f5f0e6'
    }
  },
  {
    id: 'inv_veil',
    slug: 'veil',
    template: 'veil',
    category: 'wedding',
    categoryLabel: 'عقد قران وزفاف',
    categoryLabelEn: 'Katb el-Ketab & Wedding',
    language: 'ar',
    tag: 'طرحة العروس البيضاء وكشط الميعاد',
    tagEn: 'Bridal Veil & Scratch Card',
    titleAr: 'عقد قران وحفل زفاف · عبدالرحمن وآية 🤍',
    titleEn: 'Abdelrahman & Aya — Katb el-Ketab & Wedding | Wisal',
    description: 'طرحة عروس رقيقة تنفتح عند اللمس 🤍 — عقد قران وحفل زفاف عبدالرحمن وآية، كشط التاريخ، شريط الصور، وتأكيد الحضور.',
    descriptionEn: 'A delicate sheer bridal veil parts on tap — katb el-ketab & wedding of Abdelrahman & Aya with scratch card, photo strip, and RSVP.',

    people: {
      firstPerson: 'عبدالرحمن',
      secondPerson: 'آية',
      firstPersonEn: 'Abdelrahman',
      secondPersonEn: 'Aya',
      firstPersonTitle: 'العريس',
      secondPersonTitle: 'العروس',
      firstPersonTitleEn: 'The Groom',
      secondPersonTitleEn: 'The Bride',
      parentsAr: 'تتشرف عائلتا عبدالرحمن وآية بدعوتكم',
      parentsEn: 'Together with their families, Abdelrahman & Aya'
    },

    event: {
      type: 'wedding',
      title: 'عقد قران وحفل زفاف عبدالرحمن وآية',
      titleEn: 'Katb el-Ketab & Wedding of Abdelrahman & Aya',
      date: '2027-06-24',
      time: '18:45',
      timeFormatted: '٦:٤٥ مساءً',
      timeFormattedEn: '6:45 PM',
      dateFormatted: 'الخميس، ٢٤ يونيو ٢٠٢٧',
      dateFormattedEn: 'Thursday, 24 June 2027',
      hijriDate: '١٩ محرم ١٤٤٩ هـ',
      hijriDateEn: '19 Muharram 1449 AH',
      epochMs: 1813851900000,
      description: 'بفرحة كبيرة، ندعوكم تشاركونا كتب كتابنا وفرحنا في يوم واحد.'
    },

    venue: {
      name: 'فيلا الياسمين',
      nameEn: 'Villa Yasmine',
      hall: 'الجنينة المفتوحة',
      hallEn: 'The Garden',
      city: 'الزمالك، القاهرة',
      cityEn: 'Zamalek, Cairo',
      address: 'الزمالك، القاهرة · الجنينة',
      addressEn: 'Zamalek, Cairo, Egypt · The garden',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Zamalek%20Cairo&z=14&output=embed',
      mapUrl: 'https://maps.google.com/?q=Zamalek+Cairo',
      coordinates: '30.0617, 31.2195'
    },

    media: {
      coverImage: '/img/ivory/walk.jpg',
      ogImage: '/images/og/veil.jpg',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      ogImageAlt: 'عقد قران وحفل زفاف عبدالرحمن وآية 🤍',
      gallery: [
        '/img/ivory/walk.jpg',
        '/img/ivory/stairs.jpg',
        '/img/ivory/arcade.jpg',
        '/img/ivory/lift.jpg',
        '/img/ivory/gazebo.jpg'
      ],
      music: '/audio/veil.mp3'
    },

    closing: {
      dua: 'وجودكم معانا هو اللي هيكمل فرحتنا. شكرًا من قلبنا إنكم جزء من يومنا.',
      duaEn: 'Having you with us is what will make our day complete. Thank you, from our hearts.',
      signoff: 'عبدالرحمن وآية',
      signoffEn: 'Abdelrahman & Aya'
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#c7837a',
      secondaryAccent: '#9d5d55',
      bgMuted: '#f7f1ee'
    }
  },
  {
    id: 'inv_sage_garden',
    slug: 'sage-garden',
    template: 'sage-garden',
    category: 'wedding',
    categoryLabel: 'دعوة زفاف فاخرة',
    categoryLabelEn: 'Luxury Wedding Invitation',
    language: 'ar',
    tag: 'ظرف كريمي وكولاج فينتاج بألوان الحديقة',
    tagEn: 'Cream Envelope & Vintage Garden Collage',
    titleAr: 'حفل زفاف يوسف وأميرة 🤍 | حديقة المريمية',
    titleEn: 'Yusuf & Amira — Sage Garden Wedding Invitation | Wisal',
    description: 'دعوة زفاف فاخرة بظرف كريمي ومفرش دانتيل وكولاج فينتاج ساحر بألوان الأخضر الهادي والأوف وايت 🤍',
    descriptionEn: 'A luxury vintage wedding invitation with wax-sealed envelope, lace doily, live countdown, order of the day, venue map, dress code, RSVP and memories.',

    people: {
      firstPerson: 'يوسف',
      secondPerson: 'أميرة',
      firstPersonEn: 'Yusuf',
      secondPersonEn: 'Amira',
      firstPersonTitle: 'العريس',
      secondPersonTitle: 'العروس',
      firstPersonTitleEn: 'The Groom',
      secondPersonTitleEn: 'The Bride',
      parentsAr: 'تتشرف عائلتا يوسف وأميرة بدعوتكم',
      parentsEn: 'Together with their families, Yusuf & Amira'
    },

    event: {
      type: 'wedding',
      title: 'حفل زفاف يوسف وأميرة',
      titleEn: 'Wedding of Yusuf & Amira',
      date: '2027-01-15',
      time: '18:00',
      timeFormatted: '٦:٠٠ مساءً',
      timeFormattedEn: '6:00 PM',
      dateFormatted: 'الجمعة، ١٥ يناير ٢٠٢٧',
      dateFormattedEn: 'Friday, 15 January 2027',
      hijriDate: '٧ شعبان ١٤٤٨ هـ',
      hijriDateEn: '7 Shaban 1448 AH',
      epochMs: 1799942400000,
      description: 'يسعدنا ويشرفنا حضوركم لتشاركونا فرحتنا ببداية حياتنا معاً.'
    },

    venue: {
      name: 'قاعة روز جاردن',
      nameEn: 'Rose Garden Hall',
      hall: 'الحديقة المفتوحة',
      hallEn: 'Open Garden',
      city: 'القاهرة الجديدة، مصر',
      cityEn: 'New Cairo, Egypt',
      address: 'القاهرة الجديدة، مصر · قاعة روز جاردن',
      addressEn: 'New Cairo, Egypt · Rose Garden Hall',
      mapEmbedUrl: 'https://www.google.com/maps?q=Cairo&hl=en&output=embed',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cairo',
      coordinates: '30.0444, 31.2357'
    },

    media: {
      coverImage: '/templates/sage-garden/p-story.webp',
      ogImage: '/images/og/sage-garden.jpg',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      ogImageAlt: 'حفل زفاف يوسف وأميرة 🤍',
      gallery: [
        '/templates/sage-garden/p-strip-1.webp',
        '/templates/sage-garden/p-strip-2.webp',
        '/templates/sage-garden/p-strip-3.webp',
        '/templates/sage-garden/p-venue.webp',
        '/templates/sage-garden/p-story.webp'
      ],
      music: '/audio/sage-garden.mp3'
    },

    closing: {
      dua: 'وجودكم معنا يكتمل به سرورنا. شكرًا لمشاركتكم فرحتنا.',
      duaEn: 'We cannot wait to celebrate this special day with you. Thank you for being part of our story.',
      signoff: 'يوسف وأميرة',
      signoffEn: 'Yusuf & Amira'
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#7c8a6a',
      secondaryAccent: '#5f6c4f',
      bgMuted: '#fbf8f2'
    }
  },
  {
    id: 'inv_velvet_voice',
    slug: 'velvet-voice',
    template: 'velvet-voice',
    category: 'wedding',
    categoryLabel: 'دعوة زفاف مخملية فاخرة',
    categoryLabelEn: 'Luxury Velvet & Voice Wedding Invitation',
    language: 'ar',
    tag: 'ظرف مخملي ملكي وتسجيل صوتي تفاعلي',
    tagEn: 'Royal Velvet Envelope & Interactive Voice Note',
    titleAr: 'حفل زفاف يوسف وأميرة 🤍 | المخمل الملكي',
    titleEn: 'Yusuf & Amira — Velvet Voice Wedding Invitation | Wisal',
    description: 'دعوة زفاف ملكية بظرف مخملي أحمر دافئ، ختم شمعي ثلاثي الأبعاد، تسجيل تهنئة صوتية تفاعلي، وبطاقات تنقل سلسة 🤍',
    descriptionEn: 'A luxury royal velvet wedding invitation with 3D folding flap, wax seal, interactive voice note recorder, countdown, venue map, and RSVP.',

    people: {
      firstPerson: 'يوسف',
      secondPerson: 'أميرة',
      firstPersonEn: 'Yusuf',
      secondPersonEn: 'Amira',
      firstPersonTitle: 'العريس',
      secondPersonTitle: 'العروس',
      firstPersonTitleEn: 'The Groom',
      secondPersonTitleEn: 'The Bride',
      parentsAr: 'تتشرف عائلتا يوسف وأميرة بدعوتكم',
      parentsEn: 'Together with their families, Yusuf & Amira'
    },

    event: {
      type: 'wedding',
      title: 'حفل زفاف يوسف وأميرة',
      titleEn: 'Wedding of Yusuf & Amira',
      date: '2027-01-15',
      time: '18:00',
      timeFormatted: '٦:٠٠ مساءً',
      timeFormattedEn: '6:00 PM',
      dateFormatted: 'الجمعة، ١٥ يناير ٢٠٢٧',
      dateFormattedEn: 'Friday, 15 January 2027',
      hijriDate: '٧ شعبان ١٤٤٨ هـ',
      hijriDateEn: '7 Shaban 1448 AH',
      epochMs: 1799942400000,
      description: 'هذه ليلتنا، تكتمل بها فرحتنا. سعادتنا لن تكتمل إلا بوجودكم معنا.'
    },

    venue: {
      name: 'قاعة روز جاردن',
      nameEn: 'Rose Garden Hall',
      hall: 'القاعة الملكية',
      hallEn: 'Royal Hall',
      city: 'القاهرة الجديدة، مصر',
      cityEn: 'New Cairo, Egypt',
      address: 'القاهرة الجديدة، مصر · قاعة روز جاردن',
      addressEn: 'New Cairo, Egypt · Rose Garden Hall',
      mapEmbedUrl: 'https://www.google.com/maps?q=Cairo&hl=en&output=embed',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cairo',
      coordinates: '30.0444, 31.2357'
    },

    media: {
      coverImage: '/templates/velvet-voice/envelope.webp',
      ogImage: '/images/og/velvet-voice.jpg',
      ogImageWidth: 640,
      ogImageHeight: 1385,
      ogImageAlt: 'حفل زفاف يوسف وأميرة 🤍 | Velvet Voice',
      gallery: [
        '/templates/velvet-voice/envelope.webp',
        '/templates/velvet-voice/cover-bg.webp',
        '/templates/velvet-voice/scene-sharp.webp'
      ],
      music: '/audio/velvet-voice.mp3'
    },

    closing: {
      dua: 'يسعدنا ويشرفنا حضوركم لتشاركونا أجمل لحظات العمر.',
      duaEn: 'We look forward to celebrating this unforgettable night together.',
      signoff: 'يوسف وأميرة',
      signoffEn: 'Yusuf & Amira'
    },

    settings: {
      showCountdown: true,
      showLocation: true,
      showRSVP: true,
      showMusic: true,
      showCalendar: true,
      enableAnimations: true
    },

    theme: {
      primaryAccent: '#b49a6a',
      secondaryAccent: '#4a1b21',
      bgMuted: '#3b161b'
    }
  }
];

export function getInvitationBySlug(slug) {
  return invitations.find((inv) => inv.slug === slug || inv.id === slug || (inv.aliases && inv.aliases.includes(slug)));
}

export function getInvitationById(id) {
  return invitations.find((inv) => inv.id === id || inv.slug === id || (inv.aliases && inv.aliases.includes(id)));
}

export function resolveInvitationId(slugOrId) {
  if (!slugOrId) return 'inv_general';
  const found = invitations.find((inv) => inv.id === slugOrId || inv.slug === slugOrId || (inv.aliases && inv.aliases.includes(slugOrId)));
  return found ? found.id : ('inv_' + String(slugOrId).replace(/[^a-zA-Z0-9_]/g, '_'));
}
