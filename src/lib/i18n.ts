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
    description: 'Create stunning wedding pages, manage RSVPs effortlessly, and collect precious memories from your special day. Everything you need to plan and share your perfect wedding, all in one beautiful platform.',
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
    signIn: 'Sign In to WeddingPro'
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
    description: 'शानदार शादी के पेज बनाएं, आसानी से RSVP मैनेज करें, और अपने विशेष दिन की कीमती यादों को इकट्ठा करें। अपनी परफेक्ट शादी को प्लान और शेयर करने के लिए आपको जो कुछ भी चाहिए, सब एक ही खूबसूरत प्लेटफॉर्म पर।',
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
    signIn: 'वेडिंगप्रो में साइन इन करें'
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

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
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