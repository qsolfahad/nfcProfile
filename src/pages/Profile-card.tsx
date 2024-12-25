import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Facebook,
  Instagram,
  Map,
  MapPinned,
  MessageCircle,
  Pin,
  Twitter,
} from "lucide-react";
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
import { SocialMediaInfo, UserProfile } from "@/lib/user-types";
import { dummyData } from "./dummy-data";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { allIcons } from "./icons";
import { UserProfileSkeleton } from "./Skeleton-data-loader";
import { useNavigate } from "react-router-dom";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
function base64ToImage(base64String: string): HTMLImageElement {
  const img = new Image();
  img.src = `data:image/png;base64,${base64String}`; // Set the src to the base64 string
  return img; // Return the Image element
}

export default function ProfilePage() {
  const { toast } = useToast();

  const [isCopied, setIsCopied] = useState(false);

  const { profileId } = useParams<{ profileId: string }>();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<HTMLImageElement | null>(
    null
  );
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (profileId) {
      const profileRef = doc(db, "userInfo", profileId);
      getDoc(profileRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data() as UserProfile;
            setProfileData(data);

            if (data.additionalInfo.personal.background_image) {
              setBgImage(
                base64ToImage(data.additionalInfo.personal.background_image)
              );
            }
            if (data.additionalInfo.personal.profile_image) {
              setProfileImage(
                base64ToImage(data.additionalInfo.personal.profile_image)
              );
            }
            setTheme(data.additionalInfo.personal.theme);
          } else {
            setProfileData(dummyData);
          }
        })
        .catch(() => setProfileData(dummyData));
    }
  }, [profileId]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${profileData?.contactInfo.phoneNumber}`)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
          title: "Copied Successfully",
        }); // Reset after 2 seconds
      });
  };

  const paymentMethods = [
    {
      name: "paypal",
      icon: "fa-brands fa-paypal",
      method: profileData?.paymentInfo.paypal,
    },
    {
      name: "venmo",
      icon: "fa-brands fa-vimeo",
      method: profileData?.paymentInfo.venmo,
    },
    {
      name: "gCash",
      icon: "fa-solid fa-money-bill",
      method: profileData?.paymentInfo.gCash,
    },
    {
      name: "payoneer",
      icon: "fa-solid fa-credit-card",
      method: profileData?.paymentInfo.payoneer,
    },
    {
      name: "stripe",
      icon: "fa-brands fa-stripe",
      method: profileData?.paymentInfo.stripe,
    },
    {
      name: "wise",
      icon: "fa-regular fa-credit-card",
      method: profileData?.paymentInfo.wise,
    },
    {
      name: "cryptocurrency",
      icon: "fa-brands fa-btc",
      method: profileData?.paymentInfo.cryptocurrency,
    }
  ];

  const ecommerceMethods = [
    {
      name: "Amazon Store",
      icon: "fa-brands fa-amazon",
      method: profileData?.ecommerceInfo.amazonStore,
    },
    {
      name: "eBay Store",
      icon: "fa-brands fa-ebay",
      method: profileData?.ecommerceInfo.ebay,
    },
    {
      name: "Etsy Store",
      icon: "fa-brands fa-etsy",
      method: profileData?.ecommerceInfo.etsy,
    },
    {
      name: "Shopee Store",
      icon: "fa-solid fa-store",
      method: profileData?.ecommerceInfo.shopee,
    },
    {
      name: "Lazada Store",
      icon: "fa-solid fa-store",
      method: profileData?.ecommerceInfo.lazada,
    },

    {
      name: "Shopify Store",
      icon: "fa-brands fa-shopify",
      method: profileData?.ecommerceInfo.shopifyStore,
    },
  ];

  const additionalMethods = [
    {
      name: "Personal Website",
      icon: "fa-solid fa-globe", // Icon for event
      method: profileData?.additionalInfo.website_link,
    },
    {
      name: "Custom Landing",
      icon: "fa-solid fa-laptop-code", // Icon for custom landing page
      method: profileData?.additionalInfo.customLanding,
    },
    {
      name: "Blog",
      icon: "fa-solid fa-pencil-alt", // Icon for blog
      method: profileData?.additionalInfo.blog,
    },
    {
      name: "Event",
      icon: "fa-solid fa-calendar-alt", // Icon for event
      method: profileData?.additionalInfo.event,
    },
    {
      name: "File Sharing",
      icon: "fa-solid fa-cloud-upload-alt", // Icon for file sharing
      method: profileData?.additionalInfo.fileSharing,
    },
    {
      name: "Resume",
      icon: "fa-solid fa-file-alt", // Icon for resume
      method: profileData?.additionalInfo.resume,
    }
  ];
  const socialMediaOrder: (keyof SocialMediaInfo)[] = [
    "facebook",
    "instagram",
    "twitter",
    "linkedin",
    "tiktok",
    "youtube",
    "pinterest",
    "snapchat",
    "github",
    "behance",
    "dribble",
    "medium",
    "substack",
    "fiver",
    "upwork",
    "freelancer",
    "spotify",
    "soundCloud",
    "appleMusic",
    "amazon"
  ];
  const socialMediaIcons: Record<keyof SocialMediaInfo, string> = {
    facebook: "fab fa-facebook",
    instagram: "fab fa-instagram",
    twitter: "fab fa-twitter",
    linkedin: "fab fa-linkedin",
    tiktok: "fab fa-tiktok",
    youtube: "fab fa-youtube",
    pinterest: "fab fa-pinterest",
    snapchat: "fab fa-snapchat",
    github: "fab fa-github",
    behance: "fab fa-behance",
    dribble: "fab fa-dribbble",
    medium: "fab fa-medium",
    substack: "fab fa-stack-overflow",
    fiver: "fa-solid fa-link",
    upwork: "fab fa-upwork",
    freelancer: "fas fa-user-tie",
    spotify: "fab fa-spotify",
    soundCloud: "fab fa-soundcloud",
    appleMusic: "fab fa-apple",
    amazon: "fab fa-amazon"
  }
  if (!profileData) {
    return (
      <div>
        <UserProfileSkeleton />
      </div>
    ); // Loading state while data is being fetched
  }

  // const getPlatformColor = (platform: string) => {
  //   switch (platform.toLowerCase()) {
  //     case "facebook":
  //       return "#1877F2"; // Facebook Blue
  //     case "twitter":
  //       return "#1DA1F2"; // Twitter Blue
  //     case "instagram":
  //       return "#C13584"; // Instagram Pink
  //     case "linkedin":
  //       return "#0A66C2"; // LinkedIn Blue
  //     case "youtube":
  //       return "#FF0000"; // YouTube Red
  //     case "pinterest":
  //       return "#E60023"; // Pinterest Red
  //     case "snapchat":
  //       return "#FFFC00"; // Snapchat Yellow
  //     case "upwork":
  //       return "#006ED4"; // Upwork Blue
  //     case "applemusic":
  //       return "#FE7423"; // Apple Music Orange
  //     case "amazon":
  //       return "#FF9900"; // Amazon Orange
  //     case "substack":
  //       return "#F37C30"; // Substack Orange
  //     case "spotify":
  //       return "#1DB954"; // Spotify Green
  //     case "soundcloud":
  //       return "#FF5500"; // SoundCloud Orange
  //     case "medium":
  //       return "#00AB6B"; // Medium Green
  //     case "dribble":
  //       return "#EA4C89"; // Dribbble Pink
  //     case "fiver":
  //       return "#00AEEF"; // Fiverr Blue
  //     case "github":
  //       return "#181717"; // GitHub Black
  //     case "linkedin":
  //       return "#0A66C2"; // LinkedIn Blue
  //     case "behance":
  //       return "#1769FF"; // Behance Blue
  //     case "tiktok":
  //       return "#69C9D0"; // TikTok Teal
  //     case "freelancer":
  //       return "#009EE3"; // Freelancer Blue
  //     default:
  //       return "#FFFFFF"; // Default White
  //   }
  // };
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage
          ? bgImage.src
          : dummyData.additionalInfo.personal.background_image
          })`,
        backgroundSize: "cover", // Ensures the image fits within the card without stretching
        backgroundPosition: "center", // Centers the image
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat", // Ensures no repeat of background image
        backgroundColor: "#2C5364", // Background color beneath the image
        backdropFilter: "blur(8px)", // Increases blur intensity for the content
        margin: "auto",
        minHeight: "100vh",
      }}
      className="flex flex-col justify-center items-center overflow-y-auto"
    >
      <Card className=" bg-transparent border-none">
        <div className="w-fit  px-4 py-8 flex flex-col items-center justify-center space-y-6">
          {/* Profile Image */}
          <Avatar
            className={`w-56 h-56 border-4 ${theme == "dark" ? "border-black" : "border-white"
              }`}
          >
            <AvatarImage
              src={
                profileImage?.src ||
                dummyData.additionalInfo.personal.profile_image
              }
              alt="Profile Picture"
              onClick={handleImageClick} // Open image in modal when clicked
            />
            <AvatarFallback>PF</AvatarFallback>
          </Avatar>

          {/* Social Media Icons */}


          <div
            className={`overflow-x-auto scrollbar-hide w-[280px] flex ${Object.entries(profileData?.socialMediaInfo || {}).filter(
              ([, link]) => link !== null
            ).length <= 4
              ? "justify-center"
              : "justify-start"
              }`}
          >
            <div className="flex space-x-6 items-center">
              {socialMediaOrder.slice(0, 8).map((key) => {
                console.log(key);
                const link = profileData?.socialMediaInfo?.[key];

                if (link === null || link === undefined) return null;

                const iconClass = socialMediaIcons[key];

                return (
                  <a
                    key={key}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white flex justify-center items-center hover:text-gray-300"
                  >
                    <div
                      className={`w-12 h-12 rounded-full border-2 ${theme === "dark" ? "border-black" : "border-white"
                        } flex items-center justify-center`}
                    >
                      <i
                        style={{
                          color: `${theme === "dark" ? "black" : "white"}`,
                        }}
                        className={`${iconClass} text-center text-2xl w-full h-full flex items-center justify-center ${theme === "dark" ? "text-black" : "text-white"
                          }`}
                      ></i>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>




          {/* Bio Card */}
          <Card
            className={`w-[320px] max-w-[320px]
  ${theme == "dark" ? "border-black bg-white/50" : "border-white bg-black/50"}
  border p-4 rounded-3xl bg-transparent
  sm:max-w-sm sm:p-3`}
          >
            <h1
              className={`text-2xl font-bold text-center
    ${theme == "dark" ? "text-black" : "text-white"}
    sm:text-xl`}
              style={{
                fontSize: `${profileData?.additionalInfo.personal.font_size ||
                  dummyData.additionalInfo.personal.font_size}px`,
                fontFamily:
                  profileData?.additionalInfo.personal.font_family ||
                  dummyData.additionalInfo.personal.font_family,
                marginBottom: "-6px", // Negative margin for reduced spacing
              }}
            >
              {profileData?.additionalInfo.personal.fullname || "Name"}
            </h1>
            <h1
              className={`text-2xl font-bold text-center
    ${theme == "dark" ? "text-black" : "text-white"}
    sm:text-xl`}
              style={{
                fontSize: `${profileData?.additionalInfo.personal.font_size ||
                  dummyData.additionalInfo.personal.font_size}px`,
                fontFamily:
                  profileData?.additionalInfo.personal.font_family ||
                  dummyData.additionalInfo.personal.font_family,
                marginTop: "0px",  // Negative margin for reduced spacing
                marginBottom: "0px", // Negative margin for reduced spacing
              }}
            >
              {profileData?.additionalInfo.personal.designation || "Designation"}
            </h1>
            <p
              className={`${theme == "dark" ? "text-black/90" : "text-white/90"}
    text-center sm:text-base`}
              style={{
                fontSize: `${profileData?.additionalInfo.personal.font_size ||
                  dummyData.additionalInfo.personal.font_size}px`,
                fontFamily:
                  profileData?.additionalInfo.personal.font_family ||
                  dummyData.additionalInfo.personal.font_family,
                marginTop: "-2px", // Negative margin for reduced spacing
              }}
            >
              {profileData?.additionalInfo.personal.description || "Description here"}
            </p>
          </Card>


          {additionalMethods.map(
            ({ name, icon, method }) =>
              method &&
              method !== null &&
              method.length > 0 && (
                <Button
                  key={name}
                  variant="outline"
                  onClick={() => {
                    const url = method;
                    window.open(url, "_blank");
                  }}
                  style={{
                    fontSize: `${profileData?.additionalInfo.personal.font_size ||
                      dummyData.additionalInfo.personal.font_size
                      }px`,
                    fontFamily:
                      profileData?.additionalInfo.personal.font_family ||
                      dummyData.additionalInfo.personal.font_family,
                  }}
                  className={`w-full h-14 flex items-center justify-center relative ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                    } rounded-2xl flex justify-center items-center bg-transparent`}
                >
                  <i
                    className={`${icon} text-xl absolute left-4  ${theme === "dark" ? "text-black" : "text-white"
                      }`}
                  />

                  <span className="mx-auto">{name}</span>
                </Button>
              )
          )}


          {/* Action Buttons */}
          <div className="w-full w-[320px] max-w-[320px] space-y-4 h-auto md:h-52 scrollbar-hide">
            {profileData?.contactInfo.email && (
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `mailto:${profileData?.contactInfo.email}`,
                    "_blank"
                  )
                }
                className={`w-full h-14 flex items-center justify-center relative
        ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10"
                    : "text-white bg-black/50 border-white hover:bg-white/10"
                  } rounded-2xl bg-transparent`}
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
              >
                {/* Icon on the left */}
                <i
                  className={`fa-solid fa-envelope text-2xl absolute left-4
        ${theme === "dark" ? "text-black" : "text-white"}
        `}
                ></i>
                {/* Centered text */}
                <span>
                  {profileData?.contactInfo.email}
                </span>
              </Button>
            )}






            {profileData?.contactInfo.whatsapp && (
              <Button
                variant="outline"
                onClick={() => {
                  window.open(
                    `https://wa.me/${profileData?.contactInfo.phoneNumber}`,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
                  ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
              >
                <i
                  className={`text-2xl fa-brands fa-whatsapp absolute left-4  ${theme == "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">
                  {profileData?.contactInfo.whatsapp}
                </span>
              </Button>
            )}

            {profileData?.contactInfo.telegram && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    `${profileData.contactInfo.telegram.startsWith(
                      "https://t.me/"
                    )
                      ? profileData.contactInfo.telegram
                      : "https://t.me/" + profileData.contactInfo.telegram
                    }`,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-brands fa-telegram absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Telegram</span>
              </Button>
            )}


            {profileData?.contactInfo.skype && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(`skype:live:${profileData?.contactInfo.skype}?call`, "_blank");
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-brands fa-skype absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Skype</span>
              </Button>
            )}

            {/* Zoom Button */}
            {profileData?.contactInfo.zoom && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(profileData?.contactInfo.zoom, "_blank");
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-solid fa-video absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Zoom</span>
              </Button>
            )}

            {/* Telegram Button */}

            {/* Google Meet Button */}
            {profileData?.contactInfo.googleMeet && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.contactInfo.googleMeet as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-solid fa-video absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Google Meet</span>
              </Button>
            )}

            {/* Calendar Button */}
            {profileData?.contactInfo.calender && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.contactInfo.calender as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fa-calendar absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Calendar</span>
              </Button>
            )}
            {/* Calendar Button */}
            {profileData?.socialMediaInfo.github && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.github as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fab fa-github absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Github</span>
              </Button>
            )}

            {profileData?.socialMediaInfo.behance && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.behance as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fab fa-behance absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Behance</span>
              </Button>
            )}
            {profileData?.socialMediaInfo.dribble && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.dribble as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fab fa-dribbble absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Dribble</span>
              </Button>
            )}
            {profileData?.socialMediaInfo.medium && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.medium as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fab fa-medium absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Medium Blog</span>
              </Button>
            )}
            {profileData?.socialMediaInfo.substack && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.substack as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fab fa-stack-overflow absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Substack</span>
              </Button>
            )}
            {profileData?.socialMediaInfo.fiver && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.fiver as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fa-solid fa-link absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Fiverr</span>
              </Button>
            )}
            {profileData?.socialMediaInfo.upwork && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.upwork as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fab fa-upwork absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Upwork</span>
              </Button>
            )}
            {profileData?.socialMediaInfo.freelancer && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.freelancer as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fas fa-user-tie absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Freelance</span>
              </Button>
            )}
            {profileData?.socialMediaInfo.spotify && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.spotify as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fab fa-spotify absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Spotify</span>
              </Button>
            )}
            {profileData?.socialMediaInfo.soundCloud && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.soundCloud as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fab fa-soundcloud absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">SoundCloud</span>
              </Button>
            )}
            {profileData?.socialMediaInfo.appleMusic && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.appleMusic as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fab fa-apple absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Apple Music</span>
              </Button>
            )}
            {profileData?.socialMediaInfo.amazon && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.socialMediaInfo.amazon as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14 flex items-center justify-center relative
          ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 "
                    : "text-white bg-black/50 border-white hover:bg-white/10 "
                  } rounded-2xl bg-transparent`}
              >
                <i
                  className={`text-2xl fa-regular fab fa-amazon absolute left-4 ${theme === "dark"
                    ? "text-black "
                    : "text-white "
                    }`}
                />
                <span className="mx-auto">Amazon Music</span>
              </Button>
            )}
            {paymentMethods.map(
              ({ name, icon, method }) =>
                method &&
                method !== null &&
                method.length > 0 && (
                  <Button
                    key={name}
                    variant="outline"
                    style={{
                      fontSize: `${profileData?.additionalInfo.personal.font_size ||
                        dummyData.additionalInfo.personal.font_size
                        }px`,
                      fontFamily:
                        profileData?.additionalInfo.personal.font_family ||
                        dummyData.additionalInfo.personal.font_family,
                    }}
                    onClick={() => {
                      const url = `${method}`;
                      window.open(url, "_blank");
                    }}
                    className={`w-full h-14 flex items-center justify-center relative${theme === "dark"
                      ? "text-black bg-white/50 border-black hover:bg-black/10 "
                      : "text-white bg-black/50 border-white hover:bg-white/10 "
                      } rounded-2xl flex justify-center items-center bg-transparent`}
                  >
                    <div className="w-8 h-8 text-xl capitalize mr-2 flex justify-center items-center">
                      <i
                        className={`${icon} text-2xl absolute left-4 ${theme === "dark" ? "text-black" : "text-white"
                          }`}
                      />
                    </div>
                    <span className="mx-auto">{name}</span>
                  </Button>
                )
            )}

            {ecommerceMethods.map(
              ({ name, icon, method }) =>
                method &&
                method !== null &&
                method.length > 0 && (
                  <Button
                    key={name}
                    variant="outline"
                    style={{
                      fontSize: `${profileData?.additionalInfo.personal.font_size ||
                        dummyData.additionalInfo.personal.font_size
                        }px`,
                      fontFamily:
                        profileData?.additionalInfo.personal.font_family ||
                        dummyData.additionalInfo.personal.font_family,
                    }}
                    onClick={() => {
                      const url = `${method}`;
                      window.open(url, "_blank");
                    }}
                    className={`w-full h-14 flex items-center justify-center relative${theme === "dark"
                      ? "text-black bg-white/50 border-black hover:bg-black/10 "
                      : "text-white bg-black/50 border-white hover:bg-white/10 "
                      } rounded-2xl flex justify-center items-center bg-transparent`}
                  >
                    <div className="w-8 h-8 text-xl capitalize mr-2 flex justify-center items-center">
                      <i
                        className={`${icon} text-2xl absolute left-4 ${theme === "dark" ? "text-black" : "text-white"
                          }`}
                      />
                    </div>
                    <span className="mx-auto">{name}</span>
                  </Button>
                )
            )}
            {profileData?.contactInfo.googleMeet && (
              <Button
                variant="outline"
                onClick={() => {
                  window.open(`${profileData?.contactInfo.maplink}`, "_blank");
                }}
                className={`w-full h-14 flex items-center justify-center relative
               ${theme === "dark"
                    ? "text-black bg-white/50 border-black hover:bg-black/10"
                    : "text-white bg-black/50 border-white hover:bg-white/10"
                  } rounded-2xl bg-transparent`}
                style={{
                  fontSize: `${profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                    }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
              >
                {/* Icon on the left */}
                <svg
                  className="w-8 h-8 absolute left-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={`${theme === "dark" ? "black" : "white"}`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M12 2a7 7 0 0 1 7 7c0 4.418-7 13-7 13s-7-8.582-7-13a7 7 0 0 1 7-7z"></path>
                  <circle cx="12" cy="9" r="2.5"></circle>
                </svg>
                {/* Address text */}
                <span>
                  {profileData?.contactInfo.physicalAddress || "Address not available"}
                </span>
              </Button>
            )}


          </div>

          {/* Footer */}
        </div>
      </Card >
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={closeModal} // Close modal when clicked outside
        >
          <img
            src={
              profileImage?.src ||
              dummyData.additionalInfo.personal.profile_image
            }
            alt="Profile Preview"
            style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
          />
        </div>
      )
      }
    </div >
  );
}