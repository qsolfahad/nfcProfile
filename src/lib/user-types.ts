interface EcommerceInfo {
  amazonStore: string | null;
  ebay: string | null;
  shopee: string | null;
  shopifyStore: string | null;
  lazada: string | null;
  etsy: string | null;
}

interface AdditionalInfo {
  fileSharing: string | null;
  blog: string;
  personal: PersonalInfo;
  resume: string | null;
  customLanding: string | null;
  event: string;
}

interface PersonalInfo {
  font_size: number;
  font_family: string;
  theme: "light"|"dark";
  profile_image: string;
  description: string | null;
  background_image: string;
  designation: string;
  fullname: string;
}

interface PaymentInfo {
  gCash: string | null;
  payoneer: string | null;
  paypal: string | null;
  venmo: string | null;
  wise: string | null;
  cryptocurrency: string | null;
  stripe: string | null;
}

interface ContactInfo {
  skype: string;
  zoom: string;
  calender: string | null;
  googleMeet: string | null;
  telegram: string;
  whatsapp: string;
  phoneNumber: string;
  maplink: string;
  email: string;
  physicalAddress: string;
}

export interface SocialMediaInfo {
  pinterest: string | null;
  youtube: string | null;
  snapchat: string | null;
  twitter: string | null;
  upwork: string | null;
  appleMusic: string | null;
  amazon: string | null;
  facebook: string | null;
  substack: string | null;
  instagram: string | null;
  spotify: string | null;
  soundCloud: string | null;
  medium: string | null;
  dribble: string | null;
  fiver: string | null;
  github: string | null;
  linkedin: string | null;
  behance: string | null;
  tiktok: string | null;
  freelancer: string | null;
}

export interface UserProfile {
  ecommerceInfo: EcommerceInfo;
  additionalInfo: AdditionalInfo;
  paymentInfo: PaymentInfo;
  contactInfo: ContactInfo;
  socialMediaInfo: SocialMediaInfo;
}
