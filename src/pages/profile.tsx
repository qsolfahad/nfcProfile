import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  ChevronRight,
  FileText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { useEffect, useState } from "react";
import { db } from "./firebase"; // Assume you have Firebase initialized
import { UserProfile } from "@/lib/user-types";
import { dummyData } from "./dummy-data";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { allIcons } from "./icons";
import { UserProfileSkeleton } from "./Skeleton-data-loader";
import { useNavigate } from "react-router-dom";
function base64ToImage(base64String: string): HTMLImageElement {
  const img = new Image();
  img.src = `data:image/png;base64,${base64String}`; // Set the src to the base64 string
  return img; // Return the Image element
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>(); // Get profileId from the URL
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<HTMLImageElement | null>(
    null
  );
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (profileId) {
      const profileRef = doc(db, "userInfo", profileId);
      getDoc(profileRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            console.log("doc", docSnapshot.data());
            const data = docSnapshot.data() as UserProfile;
            setProfileData(data);

            // Convert Base64 to Image once profileData is set
            if (data.additionalInfo.personal.background_image) {
              const bgImageElement = base64ToImage(
                data.additionalInfo.personal.background_image
              );
              setBgImage(bgImageElement);
            }
            if (data.additionalInfo.personal.profile_image) {
              const profileImageElement = base64ToImage(
                data.additionalInfo.personal.profile_image
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
    return (
      <div>
        <UserProfileSkeleton />
      </div>
    ); // Loading state while data is being fetched
  }

  const activeSocialLinks = Object.entries(profileData.socialMediaInfo)
    .filter(([_, value]) => value !== null)
    .slice(0, 20);

  const activePersonal = Object.entries(profileData.additionalInfo)
    .filter(([key, value]) => key !== "personal" && value !== null)
    .slice(0, 20);

  const activePaymentLinks = Object.entries(profileData.paymentInfo)
    .filter(([_, value]) => value !== null)
    .slice(0, 7);

  const activeEcommerceLinks = Object.entries(profileData.ecommerceInfo)
    .filter(([_, value]) => value !== null)
    .slice(0, 7);

  const getIconClass = (platform: string): string => {
    const icon = allIcons.find((item) => item.name === platform);
    console.log("icon", icon?.icon);
    return icon ? icon.icon : "fa-solid fa-link"; // Default to "link" icon if not found
  };

  console.log("img", bgImage?.src, profileImage?.src);
  return (
    <div
      style={{
        backgroundImage: `url(${
          bgImage
            ? bgImage.src
            : dummyData.additionalInfo.personal.background_image
        })`,
        backgroundSize: "cover", // Ensures the image fits within the card without stretching
        backgroundPosition: "center", // Centers the image
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat", // Ensures no repeat of background image
        backgroundColor: "#2C5364", // Background color beneath the image
        backdropFilter: "blur(8px)", // Increases blur intensity for the content
      }}
      className="min-h-screen text-white p-4 flex items-center justify-center "
    >
      {/* bg-gradient-to-r from-blue-500 to-purple-600 border none */}
      <Card
        style={{
          background: `rgba(255, 255, 255, 0.1)`, // Semi-transparent white background
          backdropFilter: "blur(4px)", // Optional: Applies blur effect behind the card
        }}
        className="w-full max-w-md mx-auto p-6 space-y-6 border-gray-400 rounded-3xl"
      >
        {/* Profile Image */}
        <div className="relative flex justify-center items-center rounded-full w-60 h-60 mx-auto mb-4">
          <img
            src={
              profileImage?.src ||
              dummyData.additionalInfo.personal.profile_image
            }
            alt={profileImage?.alt || "User's profile image"} // Provide meaningful alt text
            width={192}
            height={192}
            className="rounded-md border-none h-56 object-top w-56 border-4 border-gray-200 shadow-sm object-cover"
          />
        </div>

        {/* Name and Description */}
        <div className="space-y-2">
          <motion.div
            initial={false}
            animate={{ height: activeSocialLinks.length > 0 ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-flow-col gap-8  p-3 overflow-x-auto scrollbar-hide">
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
                    className="flex flex-col items-center text-black hover:text-indigo-200 transition-colors"
                  >
                    <div
                      className={`
      w-12 h-12 flex items-center justify-center 
      ${
        profileData.additionalInfo.personal.button_style === "Rounded"
          ? "rounded-full border-2 border-current"
          : ""
      }
      ${
        profileData.additionalInfo.personal.button_style === "Flat"
          ? "rounded-md"
          : ""
      }
      ${
        profileData.additionalInfo.personal.button_style === "Outlined"
          ? "rounded-md border-2 border-white"
          : ""
      }
    `}
                    >
                      {" "}
                      <i
                        className={`text-3xl ${getIconClass(platform)}`}
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
            animate={{ height: activePaymentLinks.length > 0 ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {activePaymentLinks.length > 0 && (
              <h1 className="text-black text-base font-medium">Payment Info</h1>
            )}{" "}
            <div className="grid grid-flow-col gap-8  p-1 overflow-x-auto scrollbar-hide">
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
                    className="flex flex-col items-center text-black hover:text-indigo-200 transition-colors"
                  >
                    <div
                      className={`
      w-12 h-12 flex items-center justify-center 
      ${
        profileData.additionalInfo.personal.button_style === "Rounded"
          ? "rounded-full border-2 border-current"
          : ""
      }
      ${
        profileData.additionalInfo.personal.button_style === "Flat"
          ? "rounded-md"
          : ""
      }
      ${
        profileData.additionalInfo.personal.button_style === "Outlined"
          ? "rounded-md border-2 border-white"
          : ""
      }
    `}
                    >
                      {" "}
                      <i
                        className={`text-3xl ${getIconClass(platform)}`}
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
            animate={{ height: activeEcommerceLinks.length > 0 ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {activeEcommerceLinks.length > 0 && (
              <h1 className="text-black text-base font-medium">
                Ecommerce Info
              </h1>
            )}
            <div className="grid grid-flow-col gap-8  p-1 overflow-x-auto scrollbar-hide">
              {activeEcommerceLinks.map(([platform, url]) => {
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
                    className="flex flex-col items-center text-black hover:text-indigo-200 transition-colors"
                  >
                    <div
                      className={`
      w-12 h-12 flex items-center justify-center 
      ${
        profileData.additionalInfo.personal.button_style === "Rounded"
          ? "rounded-full border-2 border-current"
          : ""
      }
      ${
        profileData.additionalInfo.personal.button_style === "Flat"
          ? "rounded-md"
          : ""
      }
      ${
        profileData.additionalInfo.personal.button_style === "Outlined"
          ? "rounded-md border-2 border-white"
          : ""
      }
    `}
                    >
                      {" "}
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
            animate={{ height: activePersonal.length > 0 ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {activePersonal.length > 0 && (
              <h1 className="text-black text-base font-medium">
                Personal Info
              </h1>
            )}

            <div className="grid grid-flow-col gap-8  p-1 overflow-x-auto scrollbar-hide">
              {activePersonal.map(([platform, url]) => {
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
                    className="flex flex-col items-center text-black hover:text-indigo-200 transition-colors"
                  >
                    <div
                      className={`
      w-12 h-12 flex items-center justify-center 
      ${
        profileData.additionalInfo.personal.button_style === "Rounded"
          ? "rounded-full border-2 border-current"
          : ""
      }
      ${
        profileData.additionalInfo.personal.button_style === "Flat"
          ? "rounded-md"
          : ""
      }
      ${
        profileData.additionalInfo.personal.button_style === "Outlined"
          ? "rounded-md border-2 border-white"
          : ""
      }
    `}
                    >
                      {" "}
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

          <div className="border rounded-xl p-4">
            <p
              className={`text-lg text-center text-gray-600 ${
                profileData.additionalInfo.personal.font_style === "Bold"
                  ? "font-bold"
                  : ""
              } ${
                profileData.additionalInfo.personal.font_style === "Italic"
                  ? "italic"
                  : ""
              }`}
              style={{
                fontSize: `${profileData.additionalInfo.personal.font_size}px`,
              }}
            >
              {profileData.additionalInfo.personal.fullname}
            </p>
            <p
              className={`text-lg text-center text-gray-600 ${
                profileData.additionalInfo.personal.font_style === "Bold"
                  ? "font-bold"
                  : ""
              } ${
                profileData.additionalInfo.personal.font_style === "Italic"
                  ? "italic"
                  : ""
              }`}
              style={{
                fontSize: `${profileData.additionalInfo.personal.font_size}px`,
              }}
            >
              {profileData.additionalInfo.personal.designation}
            </p>

            <p
              className={`text-sm text-center text-gray-600 leading-relaxed ${
                profileData.additionalInfo.personal.font_style === "Bold"
                  ? "font-bold"
                  : ""
              } ${
                profileData.additionalInfo.personal.font_style === "Italic"
                  ? "italic"
                  : ""
              }`}
              style={{
                fontSize: `${profileData.additionalInfo.personal.font_size}px`,
              }}
            >
              {profileData.additionalInfo.personal.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {profileData.contactInfo.email && (
              <button
                onClick={() => {
                  window.open(
                    profileData?.contactInfo.email as string,
                    "_blank"
                  );
                }}
                className="w-full 
                
                flex items-center justify-center gap-2 p-4 border rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-6 h-6 text-gray-500" />
                <span className="text-gray-700 font-medium">Email</span>
              </button>
            )}
            {profileData.additionalInfo.resume && (
              <button
                onClick={() => {
                  window.open(
                    profileData?.additionalInfo.resume as string,
                    "_blank"
                  );
                }}
                className="w-full flex items-center justify-center gap-2 p-4 border rounded-xl hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-6 h-6 text-gray-500" />
                <span className="text-gray-700 font-medium">RESUMÈ</span>
              </button>
            )}

            {profileData.contactInfo.phoneNumber && (
              <button
                onClick={() => {
                  window.open(
                    `https://wa.me/${profileData.contactInfo.phoneNumber}`,
                    "_blank"
                  );
                }}
                className="w-full flex items-center justify-center gap-2 p-4 border rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-6 h-6 text-gray-500" />
                <span className="text-gray-700 font-medium">WHATSAPP</span>
              </button>
            )}

            {profileData.contactInfo.skype && (
              <button
                onClick={() => {
                  window.open(profileData.contactInfo.skype, "_blank");
                }}
                className="w-full flex items-center justify-center gap-2 p-4 border rounded-xl hover:bg-gray-50 transition-colors"
              >
                <i className="w-6 h-6 text-xl text-gray-500 fa-brands fa-skype">
                  {" "}
                </i>
                <span className="text-gray-700 font-medium">Skype</span>
              </button>
            )}

            {profileData.contactInfo.zoom && (
              <button className="w-full flex items-center justify-center gap-2 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                <Link target="_blank" to={profileData.contactInfo.zoom}>
                  <span className="flex items-center w-full text-black">
                    <Calendar className="mr-2 h-4 w-4 text-black" />
                    Schedule a Zoom meeting
                  </span>
                </Link>
              </button>
            )}

            {profileData.contactInfo.googleMeet && (
              <button className="w-full flex items-center justify-center gap-2 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                <Link target="_blank" to={profileData.contactInfo.googleMeet}>
                  <span className="flex items-center w-full text-black">
                    <Calendar className="mr-2 h-4 w-4 text-black" />
                    Google Meet
                  </span>
                </Link>
              </button>
            )}

            {profileData.contactInfo.calender && (
              <button className="w-full flex items-center justify-center gap-2 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                <Link target="_blank" to={profileData.contactInfo.calender}>
                  <span className="flex items-center w-full text-black">
                    <Calendar className="mr-2 h-4 w-4 text-black" />
                    Calender
                  </span>
                </Link>
              </button>
            )}

            {profileData.contactInfo.telegram && (
              <button className="w-full flex items-center justify-center gap-2 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                <Link
                  to={`${
                    profileData.contactInfo.telegram.startsWith("https://t.me/")
                      ? profileData.contactInfo.telegram
                      : "https://t.me/" + profileData.contactInfo.telegram
                  }`}
                  target="_blank"
                >
                  <span className="flex items-center w-full text-black">
                    <i className="mr-2 fa-brands fa-telegram"></i> Chat on
                    Telegram
                  </span>
                </Link>
              </button>
            )}
          </div>
          {profileData.contactInfo.physicalAddress && (
            <div className="mt-6 text-center">
              <p className="text-lg text-center text-black flex items-center justify-center">
                <Link
                  className="w-full flex  justify-center items-center font-semibold"
                  to={profileData.contactInfo.maplink}
                  target="_blank"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {profileData.contactInfo.physicalAddress}
                </Link>
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
