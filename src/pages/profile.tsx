import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronRight, Mail, MapPin, MoreVertical, Phone, Share2 } from "lucide-react";
import { useParams } from "react-router-dom";  // Assuming you're using React Router
import { doc, getDoc, Firestore } from "firebase/firestore";  // Firestore functions
import { useEffect, useState } from "react";
import { db } from "./firebase";  // Assume you have Firebase initialized
import { UserProfile } from "@/lib/user-types";
import { dummyData } from "./dummy-data";
import { motion } from "framer-motion"
import { Link } from "react-router-dom";
import { allIcons } from "./icons";
import { UserProfileSkeleton } from "./Skeleton-data-loader";
import placeholder from "./placeholder.svg";

export default function ProfilePage() {
  const { profileId } = useParams<{ profileId: string }>(); // Get profileId from the URL
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (profileId) {
      // Fetch profile data from Firestore using the profileId
      const profileRef = doc(db, "userInfo", profileId); // Assuming you have a collection named 'profiles'
      
      getDoc(profileRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            setProfileData(docSnapshot.data() as UserProfile); // Set the profile data from Firestore
            console.log("data",docSnapshot.data())
          } else {
            console.log("No such document!");
            setProfileData(dummyData); // Fallback to default data if no document found
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
    .slice(0, 6)

    const getIconClass = (platform: string): string => {
      const icon = allIcons.find((item) => item.name === platform);
      return icon ? icon.icon : "fas fa-link"; // Default to "link" icon if not found
    };
  return (
    <div className="min-h-screen bg-white text-white p-4 flex items-center justify-center">
      {/* <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-none shadow-xl rounded-3xl overflow-hidden"> */}
      <Card className="w-full max-w-md mx-auto bg-[#0c3354] backdrop-blur-md border-none shadow-xl rounded-3xl overflow-hidden">

        <CardContent className="p-0">
          <div className="relative h-48 flex item-center justify-center">
            <img
              src={profileData.personalInfo.background_image as string}
              alt={placeholder}
              className="absolute inset-0 w-full h-full object-cover" 
              loading="eager" // Ensures the image is loaded immediately
            />
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex justify-center">
              <div className="relative -mt-20 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={profileData.personalInfo.profile_image|| "/placeholder.svg?height=400&width=400"}
                  alt={profileData.personalInfo.fullname}
                  className="absolute inset-0 w-full h-full object-cover" 
              loading="eager" // Ensures the image is loaded immediately
            />
              </div>
            </div>

            <div className="mt-4 text-center space-y-2">
              <h2 className="text-2xl font-bold">{profileData.personalInfo.fullname}</h2>
              <p className="text-lg font-medium text-indigo-200">{profileData.personalInfo.designation}</p>
              <p className="text-sm text-gray-300">{profileData.personalInfo.description}</p>
            </div>

            <motion.div
              initial={false}
              animate={{ height: isExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid grid-cols-3 gap-4">
                {activeSocialLinks.map(([platform, url]) => (
                  <Link
                    key={platform}
                    to={url || "#"}
                    className="flex flex-col items-center text-white hover:text-indigo-200 transition-colors"
                  >
                    <div className="w-12 h-12 border-2 border-current rounded-full flex items-center justify-center mb-2">
                      {/* <i className={`text-xl bi bi-${socialIcons[platform] || 'link'}`} aria-hidden="true" /> */}
                      <i className={`text-xl ${getIconClass(platform)}`} aria-hidden="true" />;

                    </div>
                    <span className="text-xs capitalize">{platform}</span>
                  </Link>
                ))}
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
                  <Link to={profileData.contactInfo.calender}>
                    <span className="flex items-center w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule a meeting
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
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
