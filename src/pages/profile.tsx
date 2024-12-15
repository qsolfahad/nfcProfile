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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          backgroundImage: `url(${
            profileImage
              ? profileImage.src
              : dummyData.additionalInfo.personal.background_image
          })`,
          backgroundSize: "100% 100%", // Stretch image to fill the container (like object-fill)
          backgroundPosition: "center", // Centers the image
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat", // Ensures no repeat of background image
          backgroundColor: "#2C5364", // Background color beneath the image
          backdropFilter: "blur(8px)", // Increases blur intensity for the content
        }}
        className="w-full max-w-md mx-auto p-6 opacity-70 space-y-6 border-gray-400 rounded-3xl"
      >
        {/* Profile Image */}
        <div className="relative flex justify-center items-center rounded-full w-60 h-60 mx-auto mb-4"></div>

        {/* Name and Description */}
        <div className="space-y-2  h-[26rem] ">
          <div className="backdrop-blur-sm bg-white/30 rounded-3xl">
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
                      <TooltipProvider>
                        <Tooltip>
                          <div
                            className={`
                        w-12 h-12 mb-2 flex items-center justify-center hover:text-black rounded-full border-2 border-current
                      `}
                          >
                            {" "}
                            <i
                              className={`text-3xl hover:text-black ${getIconClass(
                                platform
                              )}`}
                              aria-hidden="true"
                            />
                          </div>
                          <TooltipContent>
                            <p>{platform}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>
          <div
            className={`
              flex flex-col  
                        gap-1 text-black backdrop-blur-sm bg-white/30
              w-full items-center justify-start p-3
              ${
                profileData.additionalInfo.personal.button_style === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? " rounded-none"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? "text-white"
                  : ""
              }
            `}
          >
            <p
              className={`text-lg text-center text-black ${
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
              className={`text-lg text-center text-black ${
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
              className={`text-lg text-center text-black ${
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
          <div className="overflow-x-auto h-52 scrollbar-hide">
            <div className={`${activePersonal.length > 0 ? "" : "hidden"} `}>
              {activePersonal.length > 0 && (
                <h1
                  className="text-black 
              text-xl font-medium "
                >
                  Personal Info
                </h1>
              )}
              <div className="grid grid-cols-1 gap-2 p-1">
                {activePersonal.map(([platform, url]) => {
                  const fixedUrl =
                    url?.startsWith("http://") || url?.startsWith("https://")
                      ? url
                      : `https://${url}`; // Add https:// if missing

                  const buttonStyle =
                    profileData.additionalInfo.personal.button_style;
                  const fontSize =
                    profileData.additionalInfo.personal.font_size;
                  const fontStyle =
                    profileData.additionalInfo.personal.font_style;

                  return (
                    <>
                      <div>
                        <div
                          onClick={() => {
                            window.open(fixedUrl, "_blank");
                          }}
                          className={`
                        gap-2 text-black backdrop-blur-sm bg-white/30
              w-full h-12 flex items-center justify-center
              ${
                buttonStyle === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${buttonStyle === "Flat" ? " rounded-none" : ""}
              ${
                buttonStyle === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${buttonStyle === "Flat" ? "text-white" : ""}
            `}
                        >
                          <i
                            className={`text-3xl text-black ${getIconClass(
                              platform
                            )}`}
                            aria-hidden="true"
                          />
                          <span
                            className={`text-xs text-black capitalize
                        
                        `}
                            style={{
                              fontSize: `${fontSize}px`,
                              fontStyle:
                                fontStyle === "Italic" ? "italic" : "normal", // Apply italic if the fontStyle is "Italic"
                              fontWeight:
                                fontStyle === "Bold" ? "bold" : "normal", // Apply bold if the fontWeight is "Bold"
                            }}
                          >
                            {platform}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
            <div
              className={` ${activePaymentLinks.length > 0 ? "" : "hidden"} `}
            >
              {activePaymentLinks.length > 0 && (
                <h1
                  className="text-black 
              text-xl font-medium "
                >
                  Payment Info
                </h1>
              )}
              <div className="grid grid-cols-1 gap-2 p-1">
                {activePaymentLinks.map(([platform, url]) => {
                  const fixedUrl =
                    url?.startsWith("http://") || url?.startsWith("https://")
                      ? url
                      : `https://${url}`; // Add https:// if missing

                  const buttonStyle =
                    profileData.additionalInfo.personal.button_style;
                  const fontSize =
                    profileData.additionalInfo.personal.font_size;
                  const fontStyle =
                    profileData.additionalInfo.personal.font_style;

                  return (
                    <>
                      <div>
                        <div
                          onClick={() => {
                            window.open(fixedUrl, "_blank");
                          }}
                          className={`
                        gap-2 text-black backdrop-blur-sm bg-white/30
              w-full h-12 flex items-center justify-center
              ${
                buttonStyle === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${buttonStyle === "Flat" ? " rounded-none" : ""}
              ${
                buttonStyle === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${buttonStyle === "Flat" ? "text-white" : ""}
            `}
                        >
                          <i
                            className={`text-3xl text-black ${getIconClass(
                              platform
                            )}`}
                            aria-hidden="true"
                          />
                          <span
                            className={`text-xs text-black capitalize
                        
                        `}
                            style={{
                              fontSize: `${fontSize}px`,
                              fontStyle:
                                fontStyle === "Italic" ? "italic" : "normal", // Apply italic if the fontStyle is "Italic"
                              fontWeight:
                                fontStyle === "Bold" ? "bold" : "normal", // Apply bold if the fontWeight is "Bold"
                            }}
                          >
                            {platform}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="space-y-3">
              {profileData.contactInfo.email && (
                <button
                  onClick={() => {
                    window.open(
                      `mailto:${profileData?.contactInfo.email}`,
                      "_blank"
                    );
                  }}
                  className={`
                        gap-2 text-black backdrop-blur-sm bg-white/30
              w-full h-12 flex items-center justify-center
              ${
                profileData.additionalInfo.personal.button_style === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? " rounded-none"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? "text-white"
                  : ""
              }
            `}
                >
                  <Mail className="w-6 h-6 text-black" />
                  <span
                    className={`text-center text-black`}
                    style={{
                      fontSize: `${profileData.additionalInfo.personal.font_size}px`,
                      fontStyle:
                        profileData.additionalInfo.personal.font_style ===
                        "Italic"
                          ? "italic"
                          : "normal", // Apply italic if the fontStyle is "Italic"
                      fontWeight:
                        profileData.additionalInfo.personal.font_style ===
                        "Bold"
                          ? "bold"
                          : "normal", // Apply bold if the fontWeight is "Bold"
                    }}
                  >
                    Email
                  </span>
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
                  className={`
                        gap-2 text-black backdrop-blur-sm bg-white/30
              w-full h-12 flex items-center justify-center
              ${
                profileData.additionalInfo.personal.button_style === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? " rounded-none"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? "text-white"
                  : ""
              }
            `}
                >
                  <FileText className="w-6 h-6 text-black" />
                  <span
                    className={`text-center text-black`}
                    style={{
                      fontSize: `${profileData.additionalInfo.personal.font_size}px`,
                      fontStyle:
                        profileData.additionalInfo.personal.font_style ===
                        "Italic"
                          ? "italic"
                          : "normal", // Apply italic if the fontStyle is "Italic"
                      fontWeight:
                        profileData.additionalInfo.personal.font_style ===
                        "Bold"
                          ? "bold"
                          : "normal", // Apply bold if the fontWeight is "Bold"
                    }}
                  >
                    RESUMÈ
                  </span>
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
                  className={`
                        gap-2 text-black backdrop-blur-sm bg-white/30
              w-full h-12 flex items-center justify-center
              ${
                profileData.additionalInfo.personal.button_style === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? " rounded-none"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? "text-white"
                  : ""
              }
            `}
                >
                  <Phone className="w-6 h-6 text-black" />
                  <span
                    className={`text-center text-black`}
                    style={{
                      fontSize: `${profileData.additionalInfo.personal.font_size}px`,
                      fontStyle:
                        profileData.additionalInfo.personal.font_style ===
                        "Italic"
                          ? "italic"
                          : "normal", // Apply italic if the fontStyle is "Italic"
                      fontWeight:
                        profileData.additionalInfo.personal.font_style ===
                        "Bold"
                          ? "bold"
                          : "normal", // Apply bold if the fontWeight is "Bold"
                    }}
                  >
                    WHATSAPP
                  </span>
                </button>
              )}

              {profileData.contactInfo.skype && (
                <button
                  onClick={() => {
                    window.open(profileData.contactInfo.skype, "_blank");
                  }}
                  className={`
                        gap-2 text-black backdrop-blur-sm bg-white/30
              w-full h-12 flex items-center justify-center
              ${
                profileData.additionalInfo.personal.button_style === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? " rounded-none"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? "text-white"
                  : ""
              }
            `}
                >
                  <i className=" text-3xl text-black fa-brands fa-skype"> </i>
                  <span
                    className={`text-center text-black`}
                    style={{
                      fontSize: `${profileData.additionalInfo.personal.font_size}px`,
                      fontStyle:
                        profileData.additionalInfo.personal.font_style ===
                        "Italic"
                          ? "italic"
                          : "normal", // Apply italic if the fontStyle is "Italic"
                      fontWeight:
                        profileData.additionalInfo.personal.font_style ===
                        "Bold"
                          ? "bold"
                          : "normal", // Apply bold if the fontWeight is "Bold"
                    }}
                  >
                    Skype
                  </span>
                </button>
              )}

              {profileData.contactInfo.zoom && (
                <button
                  className={`
                        gap-2 text-black backdrop-blur-sm bg-white/30
              w-full h-12 flex items-center justify-center
              ${
                profileData.additionalInfo.personal.button_style === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? " rounded-none"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? "text-white"
                  : ""
              }
            `}
                >
                  <Link target="_blank" to={profileData.contactInfo.zoom}>
                    <span
                      className={`text-center flex items-center w-full text-black`}
                      style={{
                        fontSize: `${profileData.additionalInfo.personal.font_size}px`,
                        fontStyle:
                          profileData.additionalInfo.personal.font_style ===
                          "Italic"
                            ? "italic"
                            : "normal", // Apply italic if the fontStyle is "Italic"
                        fontWeight:
                          profileData.additionalInfo.personal.font_style ===
                          "Bold"
                            ? "bold"
                            : "normal", // Apply bold if the fontWeight is "Bold"
                      }}
                    >
                      <Calendar className="mr-2 h-6 w-6 text-black" />
                      Schedule a Zoom meeting
                    </span>
                  </Link>
                </button>
              )}

              {profileData.contactInfo.googleMeet && (
                <button
                  className={`
                        gap-2 text-black backdrop-blur-sm bg-white/30
              w-full h-12 flex items-center justify-center
              ${
                profileData.additionalInfo.personal.button_style === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? " rounded-none"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? "text-white"
                  : ""
              }
            `}
                >
                  <Link target="_blank" to={profileData.contactInfo.googleMeet}>
                    <span
                      className={`text-center flex items-center w-full text-black`}
                      style={{
                        fontSize: `${profileData.additionalInfo.personal.font_size}px`,
                        fontStyle:
                          profileData.additionalInfo.personal.font_style ===
                          "Italic"
                            ? "italic"
                            : "normal", // Apply italic if the fontStyle is "Italic"
                        fontWeight:
                          profileData.additionalInfo.personal.font_style ===
                          "Bold"
                            ? "bold"
                            : "normal", // Apply bold if the fontWeight is "Bold"
                      }}
                    >
                      {" "}
                      <Calendar className="mr-2 h-6 w-6 text-black" />
                      Google Meet
                    </span>
                  </Link>
                </button>
              )}

              {profileData.contactInfo.calender && (
                <button
                  className={`
                        gap-2 text-black backdrop-blur-sm bg-white/30
              w-full h-12 flex items-center justify-center
              ${
                profileData.additionalInfo.personal.button_style === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? " rounded-none"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? "text-white"
                  : ""
              }
            `}
                >
                  <Link target="_blank" to={profileData.contactInfo.calender}>
                    <span
                      className={`text-center flex items-center w-full text-black`}
                      style={{
                        fontSize: `${profileData.additionalInfo.personal.font_size}px`,
                        fontStyle:
                          profileData.additionalInfo.personal.font_style ===
                          "Italic"
                            ? "italic"
                            : "normal", // Apply italic if the fontStyle is "Italic"
                        fontWeight:
                          profileData.additionalInfo.personal.font_style ===
                          "Bold"
                            ? "bold"
                            : "normal", // Apply bold if the fontWeight is "Bold"
                      }}
                    >
                      {" "}
                      <Calendar className="mr-2 h-6 w-6 text-black" />
                      Calender
                    </span>
                  </Link>
                </button>
              )}

              {profileData.contactInfo.telegram && (
                <button
                  className={`
                        gap-2 text-black backdrop-blur-sm bg-white/30
              w-full h-12 flex items-center justify-center
              ${
                profileData.additionalInfo.personal.button_style === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? " rounded-none"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? "text-white"
                  : ""
              }
            `}
                >
                  <Link
                    to={`${
                      profileData.contactInfo.telegram.startsWith(
                        "https://t.me/"
                      )
                        ? profileData.contactInfo.telegram
                        : "https://t.me/" + profileData.contactInfo.telegram
                    }`}
                    target="_blank"
                  >
                    <span
                      className={`text-center flex items-center w-full text-black`}
                      style={{
                        fontSize: `${profileData.additionalInfo.personal.font_size}px`,
                        fontStyle:
                          profileData.additionalInfo.personal.font_style ===
                          "Italic"
                            ? "italic"
                            : "normal", // Apply italic if the fontStyle is "Italic"
                        fontWeight:
                          profileData.additionalInfo.personal.font_style ===
                          "Bold"
                            ? "bold"
                            : "normal", // Apply bold if the fontWeight is "Bold"
                      }}
                    >
                      {" "}
                      <i className="mr-2 text-3xl fa-brands fa-telegram"></i>{" "}
                      Chat on Telegram
                    </span>
                  </Link>
                </button>
              )}
            </div>
            {profileData.contactInfo.physicalAddress && (
              <div
                className={` mt-2
                        gap-2 text-black backdrop-blur-sm bg-white/30
              w-full h-12 flex items-center justify-center
              ${
                profileData.additionalInfo.personal.button_style === "Rounded"
                  ? "rounded-full border-2 border-current"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? " rounded-none"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Outlined"
                  ? "rounded-md border-2 border-white"
                  : ""
              }
              ${
                profileData.additionalInfo.personal.button_style === "Flat"
                  ? "text-white"
                  : ""
              }
            `}
              >
                <p className="text-lg text-center text-black flex items-center justify-center">
                  <Link
                    className="w-full flex  justify-center items-center font-semibold"
                    to={profileData.contactInfo.maplink}
                    target="_blank"
                  >
                    <MapPin className="mr-2 h-8 w-8" />
                    <span
                      className={`text-center flex items-center w-full text-black`}
                      style={{
                        fontSize: `${profileData.additionalInfo.personal.font_size}px`,
                        fontStyle:
                          profileData.additionalInfo.personal.font_style ===
                          "Italic"
                            ? "italic"
                            : "normal", // Apply italic if the fontStyle is "Italic"
                        fontWeight:
                          profileData.additionalInfo.personal.font_style ===
                          "Bold"
                            ? "bold"
                            : "normal", // Apply bold if the fontWeight is "Bold"
                      }}
                    >
                      {profileData.contactInfo.physicalAddress}
                    </span>
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
