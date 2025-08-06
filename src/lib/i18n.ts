import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// English translations
const enTranslations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    close: 'Close',
    yes: 'Yes',
    no: 'No'
  },
  nav: {
    home: 'Home',
    dashboard: 'Dashboard',
    signOut: 'Sign Out',
    language: 'Language'
  },
  landing: {
    title: 'WeddingPro',
    subtitle: 'Your Perfect Wedding Journey',
    tagline: 'Make Your Wedding Unforgettable',
    description: 'Plan your wedding with us! Create stunning wedding pages, manage RSVPs effortlessly, and collect precious memories from your special day. Everything you need for your perfect wedding planning.',
    startPlanning: '🚀 Start Planning Free →',
    noCredit: 'No credit card required • Free forever',
    everythingYouNeed: 'Everything You Need',
    featuresSubtitle: 'Powerful features to make your wedding planning seamless',
    features: {
      pages: {
        title: 'Beautiful Wedding Pages',
        description: 'Create stunning, personalized wedding pages with all your details, photos, and information. Share your love story beautifully.'
      },
      rsvp: {
        title: 'Smart RSVP System',
        description: 'Let guests RSVP online with dietary restrictions, song requests, and plus-ones. Track responses in real-time.'
      },
      photos: {
        title: 'Photo Collection',
        description: 'Collect and organize photos from guests during your wedding day. Download all memories in one click.'
      }
    },
    readyToStart: 'Ready to Start Planning?',
    joinThousands: 'Join thousands of couples who\'ve made their wedding planning stress-free',
    createPage: 'Create Your Wedding Page',
    signIn: 'Sign In to WeddingPro',
    heroCaption: 'Your perfect wedding moments, beautifully planned and shared'
  },
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    enterEmail: 'Enter your email',
    sendCode: 'Send Verification Code',
    verificationCode: 'Verification Code',
    enterCode: 'Enter the 6-digit code sent to your email',
    verify: 'Verify & Sign In',
    codeSent: 'Verification code sent!',
    checkEmail: 'Check your email for the verification code.',
    resendCode: 'Resend Code',
    signOut: 'Sign Out'
  },
  dashboard: {
    title: 'Wedding Dashboard',
    welcome: 'Welcome to your wedding planning hub',
    createWedding: 'Create Wedding',
    myWeddings: 'My Weddings',
    noWeddings: 'No weddings created yet',
    getStarted: 'Create your first wedding to get started!',
    viewPublic: 'View Public Page',
    manageRSVPs: 'Manage RSVPs',
    editWedding: 'Edit Wedding'
  },
  wedding: {
    title: 'Wedding Title',
    brideName: 'Bride Name',
    groomName: 'Groom Name',
    weddingDate: 'Wedding Date',
    weddingTime: 'Wedding Time',
    venue: 'Venue',
    address: 'Address',
    description: 'Description',
    createWedding: 'Create Wedding',
    updateWedding: 'Update Wedding',
    deleteWedding: 'Delete Wedding',
    publicUrl: 'Public URL',
    shareLink: 'Share this link with your guests',
    gettingMarried: 'are getting married!',
    daysToGo: '{{count}} days to go',
    tomorrow: 'Tomorrow',
    today: 'Today!',
    messageFromUs: 'A Message From Us'
  },
  rsvp: {
    title: 'RSVP',
    pleaseRsvp: 'Please RSVP',
    cantWait: 'We can\'t wait to celebrate with you! Let us know if you\'ll be joining us.',
    guestName: 'Your Name',
    email: 'Email',
    attending: 'Will you be attending?',
    yesAttending: 'Yes, I\'ll be there! 🎉',
    notAttending: 'Sorry, can\'t make it 😔',
    dietaryRestrictions: 'Dietary Restrictions',
    songRequest: 'Song Request',
    message: 'Message for the Couple',
    plusOne: 'Bringing a plus one?',
    plusOneName: 'Plus One Name',
    submitRsvp: 'Submit RSVP',
    thankYou: 'Thank You!',
    rsvpSubmitted: 'Your RSVP has been submitted successfully.',
    viewRsvps: 'View RSVPs',
    pending: 'Pending',
    approved: 'Approved'
  },
  photos: {
    title: 'Photos',
    guestPhotos: 'Guest Photos',
    shareMemories: 'Share Your Memories',
    uploadPhotos: 'Help us capture every beautiful moment of our special day!',
    noPhotos: 'No photos shared yet. Be the first to share a memory!',
    uploadButton: 'Upload Photos',
    selectPhotos: 'Select photos to upload',
    uploading: 'Uploading...',
    uploadSuccess: 'Photos uploaded successfully!',
    sharedBy: 'Shared by: {{name}}',
    anonymous: 'Anonymous',
    weddingPhotos: '{{count}} wedding {{count, plural, one {photo} other {photos}}}'
  },
  timeline: {
    title: 'Our Love Story',
    subtitle: 'The journey that brought us together',
    addEvent: 'Add Event',
    editEvent: 'Edit Event',
    eventTitle: 'Event Title',
    eventDate: 'Date',
    eventDescription: 'Description',
    saveEvent: 'Save Event',
    noEvents: 'No timeline events yet. Add your first milestone!',
    deleteEvent: 'Delete Event'
  },
  countdown: {
    title: 'Countdown to Our Big Day',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    justMarried: 'Just Married! 💕'
  },
  footer: {
    thankYou: 'Thank you for being part of our journey. Your presence (virtual or in-person) means the world to us!',
    couple: '— {{bride}} & {{groom}}',
    happyCouple: '— The Happy Couple'
  }
}

// Hindi translations
const hiTranslations = {
  common: {
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    delete: 'डिलीट करें',
    edit: 'एडिट करें',
    back: 'वापस',
    next: 'अगला',
    submit: 'सबमिट करें',
    close: 'बंद करें',
    yes: 'हाँ',
    no: 'नहीं'
  },
  nav: {
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    signOut: 'साइन आउट',
    language: 'भाषा'
  },
  landing: {
    title: 'वेडिंगप्रो',
    subtitle: 'आपकी परफेक्ट शादी का सफर',
    tagline: 'अपनी शादी को अविस्मरणीय बनाएं',
    description: 'हमारे साथ अपनी शादी की प्लानिंग करें! शानदार शादी के पेज बनाएं, आसानी से RSVP मैनेज करें, और अपने विशेष दिन की कीमती यादों को इकट्ठा करें। आपकी परफेक्ट शादी की प्लानिंग के लिए सब कुछ।',
    startPlanning: '🚀 मुफ्त में प्लानिंग शुरू करें →',
    noCredit: 'कोई क्रेडिट कार्ड की जरूरत नहीं • हमेशा के लिए मुफ्त',
    everythingYouNeed: 'आपकी हर जरूरत',
    featuresSubtitle: 'आपकी शादी की प्लानिंग को सरल बनाने वाले शक्तिशाली फीचर्स',
    features: {
      pages: {
        title: 'खूबसूरत शादी के पेज',
        description: 'अपनी सभी जानकारी, फोटो और विवरण के साथ शानदार, व्यक्तिगत शादी के पेज बनाएं। अपनी प्रेम कहानी को खूबसूरती से शेयर करें।'
      },
      rsvp: {
        title: 'स्मार्ट RSVP सिस्टम',
        description: 'मेहमानों को डायटरी रिस्ट्रिक्शन, गाने की रिक्वेस्ट और प्लस-वन के साथ ऑनलाइन RSVP करने दें। रियल-टाइम में रिस्पॉन्स ट्रैक करें।'
      },
      photos: {
        title: 'फोटो कलेक्शन',
        description: 'अपनी शादी के दिन मेहमानों से फोटो इकट्ठा करें और व्यवस्थित करें। एक क्लिक में सभी यादों को डाउनलोड करें।'
      }
    },
    readyToStart: 'प्लानिंग शुरू करने के लिए तैयार हैं?',
    joinThousands: 'हजारों कपल्स के साथ जुड़ें जिन्होंने अपनी शादी की प्लानिंग को तनावमुक्त बनाया है',
    createPage: 'अपना शादी का पेज बनाएं',
    signIn: 'वेडिंगप्रो में साइन इन करें',
    heroCaption: 'आपके परफेक्ट शादी के पल, खूबसूरती से प्लान और शेयर किए गए'
  },
  auth: {
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    email: 'ईमेल',
    enterEmail: 'अपना ईमेल डालें',
    sendCode: 'वेरिफिकेशन कोड भेजें',
    verificationCode: 'वेरिफिकेशन कोड',
    enterCode: 'अपने ईमेल पर भेजा गया 6 अंकों का कोड डालें',
    verify: 'वेरिफाई करें और साइन इन करें',
    codeSent: 'वेरिफिकेशन कोड भेज दिया गया!',
    checkEmail: 'वेरिफिकेशन कोड के लिए अपना ईमेल चेक करें।',
    resendCode: 'कोड दोबारा भेजें',
    signOut: 'साइन आउट'
  },
  dashboard: {
    title: 'शादी डैशबोर्ड',
    welcome: 'अपने शादी प्लानिंग हब में आपका स्वागत है',
    createWedding: 'शादी बनाएं',
    myWeddings: 'मेरी शादियां',
    noWeddings: 'अभी तक कोई शादी नहीं बनाई गई',
    getStarted: 'शुरुआत करने के लिए अपनी पहली शादी बनाएं!',
    viewPublic: 'पब्लिक पेज देखें',
    manageRSVPs: 'RSVP मैनेज करें',
    editWedding: 'शादी एडिट करें'
  },
  wedding: {
    title: 'शादी का टाइटल',
    brideName: 'दुल्हन का नाम',
    groomName: 'दूल्हे का नाम',
    weddingDate: 'शादी की तारीख',
    weddingTime: 'शादी का समय',
    venue: 'वेन्यू',
    address: 'पता',
    description: 'विवरण',
    createWedding: 'शादी बनाएं',
    updateWedding: 'शादी अपडेट करें',
    deleteWedding: 'शादी डिलीट करें',
    publicUrl: 'पब्लिक URL',
    shareLink: 'अपने मेहमानों के साथ यह लिंक शेयर करें',
    gettingMarried: 'शादी कर रहे हैं!',
    daysToGo: '{{count}} दिन बाकी',
    tomorrow: 'कल',
    today: 'आज!',
    messageFromUs: 'हमारी तरफ से एक संदेश'
  },
  rsvp: {
    title: 'RSVP',
    pleaseRsvp: 'कृपया RSVP करें',
    cantWait: 'हम आपके साथ सेलिब्रेट करने का इंतजार नहीं कर सकते! बताएं कि क्या आप आ रहे हैं।',
    guestName: 'आपका नाम',
    email: 'ईमेल',
    attending: 'क्या आप आएंगे?',
    yesAttending: 'हां, मैं आऊंगा! 🎉',
    notAttending: 'सॉरी, नहीं आ सकता 😔',
    dietaryRestrictions: 'डायट की पाबंदी',
    songRequest: 'गाने की रिक्वेस्ट',
    message: 'कपल के लिए मैसेज',
    plusOne: 'प्लस वन ला रहे हैं?',
    plusOneName: 'प्लस वन का नाम',
    submitRsvp: 'RSVP सबमिट करें',
    thankYou: 'धन्यवाद!',
    rsvpSubmitted: 'आपका RSVP सफलतापूर्वक सबमिट हो गया है।',
    viewRsvps: 'RSVPs देखें',
    pending: 'पेंडिंग',
    approved: 'अप्रूव्ड'
  },
  photos: {
    title: 'फोटोज',
    guestPhotos: 'मेहमानों की फोटो',
    shareMemories: 'अपनी यादें शेयर करें',
    uploadPhotos: 'हमारे विशेष दिन के हर खूबसूरत पल को कैप्चर करने में हमारी मदद करें!',
    noPhotos: 'अभी तक कोई फोटो शेयर नहीं की गई। यादों को शेयर करने वाले पहले व्यक्ति बनें!',
    uploadButton: 'फोटो अपलोड करें',
    selectPhotos: 'अपलोड करने के लिए फोटो सेलेक्ट करें',
    uploading: 'अपलोड हो रहा है...',
    uploadSuccess: 'फोटो सफलतापूर्वक अपलोड हो गईं!',
    sharedBy: 'शेयर किया गया: {{name}}',
    anonymous: 'अज्ञात',
    weddingPhotos: '{{count}} शादी {{count, plural, one {फोटो} other {फोटोज}}'
  },
  timeline: {
    title: 'हमारी प्रेम कहानी',
    subtitle: 'वह यात्रा जो हमें साथ लेकर आई',
    addEvent: 'इवेंट जोड़ें',
    editEvent: 'इवेंट एडिट करें',
    eventTitle: 'इवेंट का टाइटल',
    eventDate: 'तारीख',
    eventDescription: 'विवरण',
    saveEvent: 'इवेंट सेव करें',
    noEvents: 'अभी तक कोई टाइमलाइन इवेंट नहीं। अपना पहला मील का पत्थर जोड़ें!',
    deleteEvent: 'इवेंट डिलीट करें'
  },
  countdown: {
    title: 'हमारे बड़े दिन का काउंटडाउन',
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    justMarried: 'अभी शादी हुई! 💕'
  },
  footer: {
    thankYou: 'हमारी यात्रा का हिस्सा बनने के लिए धन्यवाद। आपकी उपस्थिति (वर्चुअल या व्यक्तिगत) हमारे लिए दुनिया भर का मतलब रखती है!',
    couple: '— {{bride}} और {{groom}}',
    happyCouple: '— खुश जोड़ा'
  }
}

// Spanish translations
const esTranslations = {
  common: {
    loading: 'Cargando...',
    error: 'Error',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Atrás',
    next: 'Siguiente',
    submit: 'Enviar',
    close: 'Cerrar',
    yes: 'Sí',
    no: 'No'
  },
  nav: {
    home: 'Inicio',
    dashboard: 'Panel',
    signOut: 'Cerrar Sesión',
    language: 'Idioma'
  },
  landing: {
    title: 'WeddingPro',
    subtitle: 'Tu Viaje de Boda Perfecto',
    tagline: 'Haz Tu Boda Inolvidable',
    description: '¡Planifica tu boda con nosotros! Crea páginas de boda impresionantes, gestiona RSVPs sin esfuerzo y recoge recuerdos preciosos de tu día especial. Todo lo que necesitas para la planificación perfecta de tu boda.',
    startPlanning: '🚀 Empezar Gratis →',
    noCredit: 'Sin tarjeta de crédito • Gratis para siempre',
    everythingYouNeed: 'Todo lo que Necesitas',
    featuresSubtitle: 'Funciones poderosas para hacer tu planificación de boda sin problemas',
    features: {
      pages: {
        title: 'Páginas de Boda Hermosas',
        description: 'Crea páginas de boda impresionantes y personalizadas con todos tus detalles, fotos e información. Comparte tu historia de amor de manera hermosa.'
      },
      rsvp: {
        title: 'Sistema RSVP Inteligente',
        description: 'Permite a los invitados confirmar su asistencia en línea con restricciones dietéticas, solicitudes de canciones y acompañantes. Rastrea las respuestas en tiempo real.'
      },
      photos: {
        title: 'Colección de Fotos',
        description: 'Recoge y organiza fotos de los invitados durante tu día de boda. Descarga todos los recuerdos con un clic.'
      }
    },
    readyToStart: '¿Listo para Empezar a Planificar?',
    joinThousands: 'Únete a miles de parejas que han hecho su planificación de boda libre de estrés',
    createPage: 'Crea Tu Página de Boda',
    signIn: 'Iniciar Sesión en WeddingPro',
    heroCaption: 'Tus momentos de boda perfectos, bellamente planificados y compartidos'
  },
  auth: {
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    email: 'Correo Electrónico',
    enterEmail: 'Ingresa tu correo electrónico',
    sendCode: 'Enviar Código de Verificación',
    verificationCode: 'Código de Verificación',
    enterCode: 'Ingresa el código de 6 dígitos enviado a tu correo',
    verify: 'Verificar e Iniciar Sesión',
    codeSent: '¡Código de verificación enviado!',
    checkEmail: 'Revisa tu correo para el código de verificación.',
    resendCode: 'Reenviar Código',
    signOut: 'Cerrar Sesión'
  },
  dashboard: {
    title: 'Panel de Boda',
    welcome: 'Bienvenido a tu centro de planificación de boda',
    createWedding: 'Crear Boda',
    myWeddings: 'Mis Bodas',
    noWeddings: 'No hay bodas creadas aún',
    getStarted: '¡Crea tu primera boda para empezar!',
    viewPublic: 'Ver Página Pública',
    manageRSVPs: 'Gestionar RSVPs',
    editWedding: 'Editar Boda'
  },
  wedding: {
    title: 'Título de la Boda',
    brideName: 'Nombre de la Novia',
    groomName: 'Nombre del Novio',
    weddingDate: 'Fecha de la Boda',
    weddingTime: 'Hora de la Boda',
    venue: 'Lugar',
    address: 'Dirección',
    description: 'Descripción',
    createWedding: 'Crear Boda',
    updateWedding: 'Actualizar Boda',
    deleteWedding: 'Eliminar Boda',
    publicUrl: 'URL Pública',
    shareLink: 'Comparte este enlace con tus invitados',
    gettingMarried: '¡se van a casar!',
    daysToGo: '{{count}} días restantes',
    tomorrow: 'Mañana',
    today: '¡Hoy!',
    messageFromUs: 'Un Mensaje de Nosotros'
  },
  rsvp: {
    title: 'RSVP',
    pleaseRsvp: 'Por Favor Confirma',
    cantWait: '¡No podemos esperar a celebrar contigo! Házanos saber si nos acompañarás.',
    guestName: 'Tu Nombre',
    email: 'Correo Electrónico',
    attending: '¿Asistirás?',
    yesAttending: '¡Sí, estaré ahí! 🎉',
    notAttending: 'Lo siento, no puedo ir 😔',
    dietaryRestrictions: 'Restricciones Dietéticas',
    songRequest: 'Solicitud de Canción',
    message: 'Mensaje para la Pareja',
    plusOne: '¿Traes acompañante?',
    plusOneName: 'Nombre del Acompañante',
    submitRsvp: 'Enviar RSVP',
    thankYou: '¡Gracias!',
    rsvpSubmitted: 'Tu RSVP se ha enviado exitosamente.',
    viewRsvps: 'Ver RSVPs',
    pending: 'Pendiente',
    approved: 'Aprobado'
  },
  photos: {
    title: 'Fotos',
    guestPhotos: 'Fotos de Invitados',
    shareMemories: 'Comparte Tus Recuerdos',
    uploadPhotos: '¡Ayúdanos a capturar cada momento hermoso de nuestro día especial!',
    noPhotos: 'No hay fotos compartidas aún. ¡Sé el primero en compartir un recuerdo!',
    uploadButton: 'Subir Fotos',
    selectPhotos: 'Selecciona fotos para subir',
    uploading: 'Subiendo...',
    uploadSuccess: '¡Fotos subidas exitosamente!',
    sharedBy: 'Compartido por: {{name}}',
    anonymous: 'Anónimo',
    weddingPhotos: '{{count}} {{count, plural, one {foto} other {fotos}}} de boda'
  },
  timeline: {
    title: 'Nuestra Historia de Amor',
    subtitle: 'El viaje que nos unió',
    addEvent: 'Agregar Evento',
    editEvent: 'Editar Evento',
    eventTitle: 'Título del Evento',
    eventDate: 'Fecha',
    eventDescription: 'Descripción',
    saveEvent: 'Guardar Evento',
    noEvents: 'No hay eventos en la cronología aún. ¡Agrega tu primer hito!',
    deleteEvent: 'Eliminar Evento'
  },
  countdown: {
    title: 'Cuenta Regresiva para Nuestro Gran Día',
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    justMarried: '¡Recién Casados! 💕'
  },
  footer: {
    thankYou: 'Gracias por ser parte de nuestro viaje. ¡Tu presencia (virtual o en persona) significa el mundo para nosotros!',
    couple: '— {{bride}} y {{groom}}',
    happyCouple: '— La Pareja Feliz'
  }
}

// French translations
const frTranslations = {
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    back: 'Retour',
    next: 'Suivant',
    submit: 'Envoyer',
    close: 'Fermer',
    yes: 'Oui',
    no: 'Non'
  },
  nav: {
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    signOut: 'Se déconnecter',
    language: 'Langue'
  },
  landing: {
    title: 'WeddingPro',
    subtitle: 'Votre Voyage de Mariage Parfait',
    tagline: 'Rendez Votre Mariage Inoubliable',
    description: 'Planifiez votre mariage avec nous! Créez de superbes pages de mariage, gérez les RSVP sans effort et collectez de précieux souvenirs de votre jour spécial. Tout ce dont vous avez besoin pour votre planification de mariage parfaite.',
    startPlanning: '🚀 Commencer Gratuitement →',
    noCredit: 'Aucune carte de crédit requise • Gratuit pour toujours',
    everythingYouNeed: 'Tout ce dont Vous Avez Besoin',
    featuresSubtitle: 'Des fonctionnalités puissantes pour rendre la planification de votre mariage fluide',
    features: {
      pages: {
        title: 'Belles Pages de Mariage',
        description: 'Créez de superbes pages de mariage personnalisées avec tous vos détails, photos et informations. Partagez votre histoire d\'amour magnifiquement.'
      },
      rsvp: {
        title: 'Système RSVP Intelligent',
        description: 'Permettez aux invités de confirmer en ligne avec des restrictions alimentaires, des demandes de chansons et des accompagnateurs. Suivez les réponses en temps réel.'
      },
      photos: {
        title: 'Collection de Photos',
        description: 'Collectez et organisez les photos des invités pendant votre jour de mariage. Téléchargez tous les souvenirs en un clic.'
      }
    },
    readyToStart: 'Prêt à Commencer la Planification?',
    joinThousands: 'Rejoignez des milliers de couples qui ont rendu leur planification de mariage sans stress',
    createPage: 'Créez Votre Page de Mariage',
    signIn: 'Se Connecter à WeddingPro',
    heroCaption: 'Vos moments de mariage parfaits, magnifiquement planifiés et partagés'
  },
  auth: {
    signIn: 'Se connecter',
    signUp: 'S\'inscrire',
    email: 'Email',
    enterEmail: 'Entrez votre email',
    sendCode: 'Envoyer le Code de Vérification',
    verificationCode: 'Code de Vérification',
    enterCode: 'Entrez le code à 6 chiffres envoyé à votre email',
    verify: 'Vérifier et Se Connecter',
    codeSent: 'Code de vérification envoyé!',
    checkEmail: 'Vérifiez votre email pour le code de vérification.',
    resendCode: 'Renvoyer le Code',
    signOut: 'Se déconnecter'
  },
  dashboard: {
    title: 'Tableau de Bord Mariage',
    welcome: 'Bienvenue dans votre centre de planification de mariage',
    createWedding: 'Créer un Mariage',
    myWeddings: 'Mes Mariages',
    noWeddings: 'Aucun mariage créé encore',
    getStarted: 'Créez votre premier mariage pour commencer!',
    viewPublic: 'Voir la Page Publique',
    manageRSVPs: 'Gérer les RSVPs',
    editWedding: 'Modifier le Mariage'
  },
  wedding: {
    title: 'Titre du Mariage',
    brideName: 'Nom de la Mariée',
    groomName: 'Nom du Marié',
    weddingDate: 'Date du Mariage',
    weddingTime: 'Heure du Mariage',
    venue: 'Lieu',
    address: 'Adresse',
    description: 'Description',
    createWedding: 'Créer un Mariage',
    updateWedding: 'Mettre à jour le Mariage',
    deleteWedding: 'Supprimer le Mariage',
    publicUrl: 'URL Publique',
    shareLink: 'Partagez ce lien avec vos invités',
    gettingMarried: 'se marient!',
    daysToGo: '{{count}} jours restants',
    tomorrow: 'Demain',
    today: 'Aujourd\'hui!',
    messageFromUs: 'Un Message de Notre Part'
  },
  rsvp: {
    title: 'RSVP',
    pleaseRsvp: 'Veuillez Confirmer',
    cantWait: 'Nous avons hâte de célébrer avec vous! Faites-nous savoir si vous nous rejoindrez.',
    guestName: 'Votre Nom',
    email: 'Email',
    attending: 'Assisterez-vous?',
    yesAttending: 'Oui, je serai là! 🎉',
    notAttending: 'Désolé, je ne peux pas venir 😔',
    dietaryRestrictions: 'Restrictions Alimentaires',
    songRequest: 'Demande de Chanson',
    message: 'Message pour le Couple',
    plusOne: 'Amenez-vous un accompagnateur?',
    plusOneName: 'Nom de l\'Accompagnateur',
    submitRsvp: 'Envoyer RSVP',
    thankYou: 'Merci!',
    rsvpSubmitted: 'Votre RSVP a été envoyé avec succès.',
    viewRsvps: 'Voir les RSVPs',
    pending: 'En attente',
    approved: 'Approuvé'
  },
  photos: {
    title: 'Photos',
    guestPhotos: 'Photos des Invités',
    shareMemories: 'Partagez Vos Souvenirs',
    uploadPhotos: 'Aidez-nous à capturer chaque beau moment de notre jour spécial!',
    noPhotos: 'Aucune photo partagée encore. Soyez le premier à partager un souvenir!',
    uploadButton: 'Télécharger des Photos',
    selectPhotos: 'Sélectionnez des photos à télécharger',
    uploading: 'Téléchargement...',
    uploadSuccess: 'Photos téléchargées avec succès!',
    sharedBy: 'Partagé par: {{name}}',
    anonymous: 'Anonyme',
    weddingPhotos: '{{count}} {{count, plural, one {photo} other {photos}}} de mariage'
  },
  timeline: {
    title: 'Notre Histoire d\'Amour',
    subtitle: 'Le voyage qui nous a réunis',
    addEvent: 'Ajouter un Événement',
    editEvent: 'Modifier l\'Événement',
    eventTitle: 'Titre de l\'Événement',
    eventDate: 'Date',
    eventDescription: 'Description',
    saveEvent: 'Sauvegarder l\'Événement',
    noEvents: 'Aucun événement dans la chronologie encore. Ajoutez votre premier jalon!',
    deleteEvent: 'Supprimer l\'Événement'
  },
  countdown: {
    title: 'Compte à Rebours vers Notre Grand Jour',
    days: 'Jours',
    hours: 'Heures',
    minutes: 'Minutes',
    seconds: 'Secondes',
    justMarried: 'Juste Mariés! 💕'
  },
  footer: {
    thankYou: 'Merci de faire partie de notre voyage. Votre présence (virtuelle ou en personne) signifie le monde pour nous!',
    couple: '— {{bride}} et {{groom}}',
    happyCouple: '— Le Couple Heureux'
  }
}

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  es: {
    translation: esTranslations
  },
  fr: {
    translation: frTranslations
  },
  de: {
    translation: enTranslations // Fallback to English for now
  },
  it: {
    translation: enTranslations // Fallback to English for now
  },
  pt: {
    translation: enTranslations // Fallback to English for now
  },
  ru: {
    translation: enTranslations // Fallback to English for now
  },
  ja: {
    translation: enTranslations // Fallback to English for now
  },
  ko: {
    translation: enTranslations // Fallback to English for now
  },
  zh: {
    translation: enTranslations // Fallback to English for now
  },
  ar: {
    translation: enTranslations // Fallback to English for now
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'weddingpro-language',
      caches: ['localStorage']
    }
  })

export default i18n