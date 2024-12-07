import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import { useParams } from "react-router-dom";  // Assuming you're using React Router
import { doc, getDoc } from "firebase/firestore";  // Firestore functions
import { useEffect, useState } from "react";
import { db } from "./firebase";  // Assume you have Firebase initialized
import { UserProfile } from "@/lib/user-types";
import { dummyData } from "./dummy-data";
import { motion } from "framer-motion"
import { Link } from "react-router-dom";
import { allIcons } from "./icons";
import { UserProfileSkeleton } from "./Skeleton-data-loader";

function base64ToImage(base64String: string): HTMLImageElement {
  const img = new Image();
  img.src = `data:image/png;base64,${base64String}`;; // Set the src to the base64 string
  return img; // Return the Image element
}

export default function ProfilePage() {
  const { profileId } = useParams<{ profileId: string }>(); // Get profileId from the URL
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isExpanded, setIsExpanded] = useState(false)
    const [profileImage, setProfileImage] = useState<HTMLImageElement | null>(
      null
    );
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [isPaymentExpand, setIsPaymentExpanded] = useState(false);

 useEffect(() => {
   if (profileId) {
     const profileRef = doc(db, "userInfo", profileId);
     getDoc(profileRef)
       .then((docSnapshot) => {
         if (docSnapshot.exists()) {
           const data = docSnapshot.data() as UserProfile;
           setProfileData(data);

           // Convert Base64 to Image once profileData is set
           if (data.personalInfo.background_image) {
             const bgImageElement = base64ToImage(
               data.personalInfo.background_image
             );
             setBgImage(bgImageElement);
           }
           if (data.personalInfo.profile_image) {
             const profileImageElement = base64ToImage(
               data.personalInfo.profile_image
             );
             setProfileImage(profileImageElement);
           }
         } else {
           setProfileData(dummyData); // Fallback to dummy data if no document found
         }
       })
       .catch((error) => {
         console.error("Error fetching document: ", error);
         setProfileData(dummyData); // Fallback in case of error
       });
   }
 }, [profileId]);
  if (!profileData) {
    return <div><UserProfileSkeleton/></div>; // Loading state while data is being fetched
  }

  const activeSocialLinks = Object.entries(profileData.socialMediaInfo)
    .filter(([_, value]) => value !== null)
    .slice(0, 20)

    const activePaymentLinks=Object.entries(profileData.paymentInfo).filter(([_, value]) => value !== null)
    .slice(0, 7)

    const getIconClass = (platform: string): string => {
      const icon = allIcons.find((item) => item.name === platform);
      console.log("icon",icon?.icon)
      return icon ? icon.icon : "fa-solid fa-link" // Default to "link" icon if not found
    };


    console.log("img",bgImage?.src,profileImage?.src)
  return (
    <div className="min-h-screen bg-[#2C5364] text-white p-4 flex items-center justify-center">
      {/* <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-none shadow-xl rounded-3xl overflow-hidden"> */}
      <Card className="w-full max-w-md mx-auto bg-[#0c3354] backdrop-blur-md border-none shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-48 flex item-center justify-center">
            {/* Render background image if available */}
            {bgImage ? (
              <img
                src={bgImage.src}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <img
                src={dummyData.personalInfo.background_image as string}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            )}
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex justify-center">
              <div className="relative -mt-20 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {/* Render profile image if available */}
                {profileImage ? (
                  <img
                    src={profileImage.src}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <img
                    src={dummyData.personalInfo.profile_image as string}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                )}
              </div>
            </div>

            <div className="mt-4 text-center space-y-2">
              <h2 className="text-2xl font-bold">
                {profileData.personalInfo.fullname}
              </h2>
              <p className="text-lg font-medium text-indigo-200">
                {profileData.personalInfo.designation}
              </p>
              <p className="text-sm text-gray-300">
                {profileData.personalInfo.description}
              </p>
            </div>

            <motion.div
              initial={false}
              animate={{ height: isExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid grid-cols-3 gap-4">
                {activeSocialLinks.map(([platform, url]) => {
                  const fixedUrl =
                    url?.startsWith("http://") || url?.startsWith("https://")
                      ? url
                      : `https://${url}`; // Add https:// if missing

                  return (
                    <a
                      key={platform}
                      href={fixedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center text-white hover:text-indigo-200 transition-colors"
                    >
                      <div className="w-12 h-12 border-2 border-current rounded-full flex items-center justify-center mb-2">
                        <i
                          className={`text-xl ${getIconClass(platform)}`}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-xs capitalize">{platform}</span>
                    </a>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ height: isPaymentExpand ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid grid-cols-3 gap-4">
                {activePaymentLinks.map(([platform, url]) => {
                  const fixedUrl =
                    url?.startsWith("http://") || url?.startsWith("https://")
                      ? url
                      : `https://${url}`; // Add https:// if missing

                  return (
                    <a
                      key={platform}
                      href={fixedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center text-white hover:text-indigo-200 transition-colors"
                    >
                      <div className="w-12 h-12 border-2 border-current rounded-full flex items-center justify-center mb-2">
                        <i
                          className={`text-xl ${getIconClass(platform)}`}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-xs capitalize">{platform}</span>
                    </a>
                  );
                })}
              </div>
            </motion.div>

            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                className="w-full text-white border-white/20 hover:bg-white/10 transition-all duration-300 ease-in-out transform hover:scale-105"
                asChild
              >
                <Link to={`mailto:${profileData.contactInfo.email}`}>
                  <span className="flex items-center w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    {profileData.contactInfo.email}
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full text-white border-white/20 hover:bg-white/10 transition-all duration-300 ease-in-out transform hover:scale-105"
                asChild
              >
                <Link to={`tel:${profileData.contactInfo.phoneNumber}`}>
                  <span className="flex items-center w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    {profileData.contactInfo.phoneNumber}
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </span>
                </Link>
              </Button>
              {profileData.contactInfo.calender && (
                <Button
                  variant="outline"
                  className="w-full text-white border-white/20 hover:bg-white/10 transition-all duration-300 ease-in-out transform hover:scale-105"
                  asChild
                >
                  <Link to={profileData.contactInfo.zoom}>
                    <span className="flex items-center w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule a Zoom meeting
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              )}
            </div>

            {profileData.contactInfo.physicalAddress && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-300 flex items-center justify-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {profileData.contactInfo.physicalAddress}
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                {isExpanded ? "Hide Socials" : "Show Socials"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsPaymentExpanded(!isPaymentExpand)}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                {isExpanded ? "Hide Payment Info" : "Show Payment Info"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
