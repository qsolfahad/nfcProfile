import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { Link, useParams } from "react-router-dom";  // Assuming you're using React Router
import { doc, getDoc, Firestore } from "firebase/firestore";  // Firestore functions
import { useEffect, useState } from "react";
import { db } from "./firebase";  // Assume you have Firebase initialized

// Define the types for the profile data
interface PersonalInfo {
  fullname: string;
  designation: string;
  description: string | null;
  avatar:string|null
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
  personal: PersonalInfo;
  customLanding: string | null;
  blog: string | null;
  event: string | null;
  fileSharing: string | null;
  qrCode: string | null;
}

interface ProfileData {
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  socialMediaInfo: SocialMediaInfo;
  ecommerceInfo: EcommerceInfo;
  paymentInfo: PaymentInfo;
  additionalInfo: AdditionalInfo;
}

const defaultData: ProfileData = {
  personalInfo: {
    fullname: "Fahad",
    designation: "software",
    description: null,
    avatar:"string"
  },
  contactInfo: {
    phoneNumber: "+923352437245",
    email: "abc@gmail.com",
    whatsapp: "+923352432745",
    telegram: "www.telegram.com",
    physicalAddress: "abc road",
    lat: null,
    long: null,
    skype: "585",
    zoom: "https://www.zoom.com/",
    googleMeet: "https://www.google.com/",
    calender: null,
  },
  socialMediaInfo: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    twitter: "https://www.twitter.com/",
    linkedin: null,
    tiktok: null,
    youtube: null,
    pinterest: null,
    snapchat: null,
    github: null,
    behance: null,
    dribble: null,
    medium: null,
    substack: null,
    fiver: null,
    upwork: null,
    freelancer: null,
    spotify: null,
    soundCloud: null,
    appleMusic: null,
    amazon: null,
  },
  ecommerceInfo: {
    amazonStore: null,
    ebay: null,
    etsy: null,
    shopee: null,
    lazada: null,
    shopifyStore: null,
  },
  paymentInfo: {
    paypal: null,
    venmo: null,
    gCash: null,
    payoneer: null,
    stripe: null,
    wise: null,
    cryptocurrency: null,
  },
  additionalInfo: {
    personal: {
      fullname: "Fahad",
      designation: "software",
      description: null,
      avatar:""
    },
    customLanding: null,
    blog: null,
    event: null,
    fileSharing: null,
    qrCode: null,
  },
};

export default function ProfilePage() {
  const { profileId } = useParams<{ profileId: string }>(); // Get profileId from the URL
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (profileId) {
      // Fetch profile data from Firestore using the profileId
      const profileRef = doc(db, "userInfo", profileId); // Assuming you have a collection named 'profiles'
      
      getDoc(profileRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            setProfileData(docSnapshot.data() as ProfileData); // Set the profile data from Firestore
            console.log("data",docSnapshot.data())
          } else {
            console.log("No such document!");
            setProfileData(defaultData); // Fallback to default data if no document found
          }
        })
        .catch((error) => {
          console.error("Error fetching document: ", error);
          setProfileData(defaultData); // Fallback in case of error
        });
    }
  }, [profileId]);

  if (!profileData) {
    return <div>Loading...</div>; // Loading state while data is being fetched
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <Card className="max-w-md mx-auto bg-transparent border-none shadow-none">
        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-500">PRAX</h1>
            <Button variant="ghost" size="icon" className="text-white">
              <MoreVertical className="h-6 w-6" />
            </Button>
          </div>

          {/* Profile Section */}
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
              <img
                src={profileData.personalInfo.avatar || "/placeholder.svg"} // Fallback to a placeholder if avatar is not provided
                alt={profileData.personalInfo.fullname}
                
                className="object-cover fill-current"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{profileData.personalInfo.fullname}</h2>
              <p className="text-lg font-medium">{profileData.personalInfo.designation}</p>
              <p className="text-sm text-gray-300">{profileData.personalInfo.description || "No description provided."}</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            {profileData.socialMediaInfo && Object.entries(profileData.socialMediaInfo).map(([platform, url]) => 
              url ? (
                <Link
                  key={platform}
                  to={url}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <div className="w-8 h-8 border rounded-full flex items-center justify-center">
                    <span className="sr-only">{platform}</span>
                    <i className={`bi bi-${platform}`} aria-hidden="true" />
                  </div>
                </Link>
              ) : null
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Additional buttons or links can be added based on the profile data */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
