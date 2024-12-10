interface PersonalInfo {
    fullname: string;
    designation: string;
    profile_image: string | null;
    background_image: string | null;
    description: string | null;
  }
  
  interface ContactInfo {
    phoneNumber: string;
    email: string;
    whatsapp: string;
    telegram: string;
    physicalAddress: string;
    lat: number | null;
    long: number | null;
    skype: string;
    zoom: string;
    googleMeet: string;
    calender: string | null;
  }
  
  interface SocialMediaInfo {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    tiktok: string | null;
    youtube: string | null;
    pinterest: string | null;
    snapchat: string | null;
    github: string | null;
    behance: string | null;
    dribble: string | null;
    medium: string | null;
    substack: string | null;
    fiver: string | null;
    upwork: string | null;
    freelancer: string | null;
    spotify: string | null;
    soundCloud: string | null;
    appleMusic: string | null;
    amazon: string | null;
  }
  
  interface EcommerceInfo {
    amazonStore: string | null;
    ebay: string | null;
    etsy: string | null;
    shopee: string | null;
    lazada: string | null;
    shopifyStore: string | null;
  }
  
  interface PaymentInfo {
    paypal: string | null;
    venmo: string | null;
    gCash: string | null;
    payoneer: string | null;
    stripe: string | null;
    wise: string | null;
    cryptocurrency: string | null;
  }
  
  interface AdditionalInfo {
    personal: {
      fullname: string;
      designation: string;
      description: string | null;
      profile_image: string | null;
      background_image: string | null;
    };
    customLanding: string | null;
    blog: string | null;
    event: string | null;
    fileSharing: string | null;
    qrCode: string | null;
  }
  
  export interface UserProfile {
    personalInfo: PersonalInfo;
    contactInfo: ContactInfo;
    socialMediaInfo: SocialMediaInfo;
    ecommerceInfo: EcommerceInfo;
    paymentInfo: PaymentInfo;
    additionalInfo: AdditionalInfo;
  }
  