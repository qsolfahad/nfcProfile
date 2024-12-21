// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Calendar,
//   ChevronRight,
//   FileText,
//   Mail,
//   MapPin,
//   Phone,
// } from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// import { useParams } from "react-router-dom"; // Assuming you're using React Router
// import { doc, getDoc } from "firebase/firestore"; // Firestore functions
// import { useEffect, useState } from "react";
// import { db } from "./firebase"; // Assume you have Firebase initialized
// import { UserProfile } from "@/lib/user-types";
// import { dummyData } from "./dummy-data";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { allIcons } from "./icons";
// import { UserProfileSkeleton } from "./Skeleton-data-loader";
// import { useNavigate } from "react-router-dom";

// function base64ToImage(base64String: string): string {
//   return `data:image/png;base64,${base64String}`;
// }

// export default function ProfilePage() {
//   const { profileId } = useParams<{ profileId: string }>();
//   const [profileData, setProfileData] = useState<UserProfile | null>(null);
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const [bgImage, setBgImage] = useState<string | null>(null);
  
  
//   useEffect(() => {
//     if (profileId) {
//       const profileRef = doc(db, "userInfo", profileId);
//       getDoc(profileRef)
//       .then((docSnapshot) => {
//         if (docSnapshot.exists()) {
//           const data = docSnapshot.data() as UserProfile;
//           setProfileData(data);
          
//           if (data.additionalInfo.personal.background_image) {
//             setBgImage(
//               base64ToImage(data.additionalInfo.personal.background_image)
//             );
//             }
//             if (data.additionalInfo.personal.profile_image) {
//               setProfileImage(
//                 base64ToImage(data.additionalInfo.personal.profile_image)
//               );
//             }
//           } else {
//             setProfileData(dummyData);
//           }
//         })
//         .catch(() => setProfileData(dummyData));
//       }
//     }, [profileId]);
//     console.log(dummyData.additionalInfo.personal.theme);
//     const [theme, setTheme] = useState<string>(dummyData.additionalInfo.personal.theme); // Theme state
//     const handleImageClick = () => {
//       setIsModalOpen(true);
//     };
//     const [isModalOpen, setIsModalOpen] = useState(false);

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   const getIconClass = (platform: string): string => {
//     const icon = allIcons.find((item) => item.name === platform);
//     console.log("icon", icon?.icon);
//     return icon ? icon.icon : "fa-solid fa-link"; // Default to "link" icon if not found
//   };

//   const activeSocialLinks = Object.entries(profileData?.socialMediaInfo || dummyData.socialMediaInfo)
//     .filter(([_, value]) => value !== null)
//     .slice(0, 20);
//   const getPlatformColor = (platform: string) => {
//     switch (platform.toLowerCase()) {
//       case "facebook":
//         return "#1877F2"; // Facebook Blue
//       case "twitter":
//         return "#1DA1F2"; // Twitter Blue
//       case "instagram":
//         return "#C13584"; // Instagram Pink
//       case "linkedin":
//         return "#0A66C2"; // LinkedIn Blue
//       case "youtube":
//         return "#FF0000"; // YouTube Red
//       case "pinterest":
//         return "#E60023"; // Pinterest Red
//       case "snapchat":
//         return "#FFFC00"; // Snapchat Yellow
//       case "upwork":
//         return "#006ED4"; // Upwork Blue
//       case "applemusic":
//         return "#FE7423"; // Apple Music Orange
//       case "amazon":
//         return "#FF9900"; // Amazon Orange
//       case "substack":
//         return "#F37C30"; // Substack Orange
//       case "spotify":
//         return "#1DB954"; // Spotify Green
//       case "soundcloud":
//         return "#FF5500"; // SoundCloud Orange
//       case "medium":
//         return "#00AB6B"; // Medium Green
//       case "dribble":
//         return "#EA4C89"; // Dribbble Pink
//       case "fiver":
//         return "#00AEEF"; // Fiverr Blue
//       case "github":
//         return "#181717"; // GitHub Black
//       case "linkedin":
//         return "#0A66C2"; // LinkedIn Blue
//       case "behance":
//         return "#1769FF"; // Behance Blue
//       case "tiktok":
//         return "#69C9D0"; // TikTok Teal
//       case "freelancer":
//         return "#009EE3"; // Freelancer Blue
//       default:
//         return "#FFFFFF"; // Default White
//     }
//   };

//   return (
//     <div
//       style={{
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         overflowY: "scroll",
//         backgroundColor: theme === "light" ? "#fff" : "#333",
//         color: theme === "light" ? "#000" : "#fff",
//       }}
//     >
//       {/* Stack Layout */}
//       <div style={{ flex: 1, position: "relative" }}>
//         {/* Profile Image */}
//         <div
//           style={{
//             width: "100%",
//             height: "100%",
//             backgroundImage: `url(${profileImage || dummyData.additionalInfo.personal.profile_image})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             position: "relative",
//             cursor: "pointer",
//             transition: "background-image 0.5s ease-in-out", // Smooth transition
//           }}
//           onClick={handleImageClick} // Open image in modal when clicked
//         >
//           {/* Top Shade Overlay */}
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               width: "100%",
//               height: "20%", // Adjust the height of the shade overlay
//               background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0))`, // Shade overlay
//             }}
//           ></div>

//           {/* Transparent Gradient Overlay */}
//           <div
//             style={{
//               position: "absolute",
//               bottom: 0,
//               width: "100%",
//               height: "30%", // Adjust gradient height for smoother transition
//               background: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(255, 255, 255, 100))`, // Shade overlay
//             }}
//           ></div>
//         </div>

//         {/* Background Image at the Bottom */}
//         <div
//           style={{
//             position: "absolute",
//             bottom: 0,
//             width: "100%",
//             height: "50%", // Adjust according to your layout needs
//             backgroundImage: `url(${bgImage || dummyData.additionalInfo.personal.background_image})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             opacity: 0.7, // Adjust opacity for better visibility
//             transition: "opacity 0.5s ease-in-out", // Smooth transition for opacity change
//           }}

//         >
//           <div
//             style={{
//               width: "80%",
//               marginLeft: "10%",
//               marginTop: "2%",
//               marginBottom: "2%",
//             }}
//           >
//             <motion.div
//               initial={false}
//               animate={{ height: activeSocialLinks.length > 0 ? "auto" : 0 }}
//               transition={{ duration: 0.3 }}
//               className="overflow-hidden"
//             >
//               <div className="grid grid-flow-col gap-8 p-3 overflow-x-auto scrollbar-hide">
//                 {activeSocialLinks.map(([platform, url]) => {
//                   const fixedUrl =
//                     url?.startsWith("http://") || url?.startsWith("https://")
//                       ? url
//                       : `https://${url}`; // Add https:// if missing

//                   return (
//                     <a
//                       key={platform}
//                       href={fixedUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex flex-col items-center text-black hover:text-indigo-200 transition-colors"
//                     >
//                       <TooltipProvider>
//                         <Tooltip>
//                           <div
//                             className={`
//                     w-12 h-12 mb-2 flex items-center justify-center
//                     rounded-full border-2 border-current
//                     bg-black hover:bg-gray-800 transition-all
//                   `}
//                           >
//                             <i
//                               className={`text-3xl text-current ${getIconClass(
//                                 platform
//                               )}`}
//                               style={{ color: getPlatformColor(platform) }} // Set dynamic color for the icon
//                               aria-hidden="true"
//                             />
//                           </div>
//                           <TooltipContent>
//                             <p>{platform}</p>
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     </a>
//                   );
//                 })}
//               </div>
//             </motion.div>
//           </div>


//           {/* Header Section for Full Name, Designation, and Description */}
//           <div style={{ flex: 1, position: "relative" }}>
//             <div
//               style={{
//                 padding: "20px",
//                 textAlign: "center",
//                 backgroundColor: theme === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
//                 width: "80%",
//                 marginLeft: "10%",
//                 marginTop: "2%",
//                 marginBottom: "2%", // Adding margin at the bottom
//                 borderRadius: "8px",
//                 boxShadow: theme === "light" ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "0 4px 6px rgba(255, 255, 255, 0.1)",
//                 backdropFilter: "blur(10px)",
//                 transition: "all 0.3s ease-in-out",
//               }}
//             >
//               <h1 style={{ margin: 0, fontSize: profileData?.additionalInfo.personal.font_size || dummyData.additionalInfo.personal.font_size, fontFamily: profileData?.additionalInfo.personal.font_family || dummyData.additionalInfo.personal.font_family }}>
//                 {profileData?.additionalInfo.personal.fullname || dummyData.additionalInfo.personal.fullname}
//               </h1>
//               <p style={{ margin: "5px 0", fontSize: profileData?.additionalInfo.personal.font_size || dummyData.additionalInfo.personal.font_size, color: theme === "light" ? "#666" : "#ccc", fontFamily: profileData?.additionalInfo.personal.font_family || dummyData.additionalInfo.personal.font_family }}>
//                 {profileData?.additionalInfo.personal.designation || dummyData.additionalInfo.personal.designation}
//               </p>
//               <p style={{ margin: 0, fontSize: profileData?.additionalInfo.personal.font_size || dummyData.additionalInfo.personal.font_size, color: theme === "light" ? "#333" : "#bbb", fontFamily: profileData?.additionalInfo.personal.font_family || dummyData.additionalInfo.personal.font_family }}>
//                 {profileData?.additionalInfo.personal.description || dummyData.additionalInfo.personal.description}
//               </p>
//             </div>


//           </div>
//           <div style={{ height: "120px", overflow: "auto" }}> <div className="space-y-3" style={{
//             textAlign: "center",
//             backgroundColor: theme === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
//             width: "80%",
//             marginLeft: "10%",
//             marginTop: "2%",
//             marginBottom: "2%", // Adding margin at the bottom
//             borderRadius: "8px",
//             boxShadow: theme === "light" ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "0 4px 6px rgba(255, 255, 255, 0.1)",
//             backdropFilter: "blur(10px)",
//             transition: "all 0.3s ease-in-out",
//           }}>
//             {profileData?.contactInfo.email && (
//               <button
//                 onClick={() => {
//                   window.open(
//                     `mailto:${profileData?.contactInfo.email}`,
//                     "_blank"
//                   );
//                 }}
//                 className={`
//                         gap-2 text-black backdrop-blur-sm bg-white/30
//               w-full h-12 flex items-center justify-center
//               ${profileData.additionalInfo.personal.button_style === "Rounded"
//                     ? "rounded-full border-2 border-current"
//                     : ""
//                   }
//               ${profileData.additionalInfo.personal.button_style === "Flat"
//                     ? " rounded-none"
//                     : ""
//                   }
//               ${profileData.additionalInfo.personal.button_style === "Outlined"
//                     ? "rounded-md border-2 border-white"
//                     : ""
//                   }
//               ${profileData.additionalInfo.personal.button_style === "Flat"
//                     ? "text-white"
//                     : ""
//                   }
//             `}
//               >
//                 <Mail className="w-6 h-6 text-black" />
//                 <span
//                   className={`text-center text-black`}
//                   style={{
//                     fontSize: `${profileData.additionalInfo.personal.font_size}px`,
//                     fontFamily: profileData.additionalInfo.personal.font_family
//                   }}
//                 >
//                   Email
//                 </span>
//               </button>)}
//           </div>

//           </div>

//         </div>
//       </div>


//       {/* Profile Image Modal */}
//       {
//         isModalOpen && (
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               backgroundColor: "rgba(0, 0, 0, 0.8)",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//             onClick={closeModal} // Close modal when clicked outside
//           >
//             <img
//               src={profileImage || dummyData.additionalInfo.personal.profile_image}
//               alt="Profile Preview"
//               style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
//             />
//           </div>
//         )
//       }

//       <footer

//       >
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <motion.div
//                   style={{
//                     cursor: "pointer",
//                     display: "flex",
//                     alignItems: "center",
//                     borderRadius: "8px",
//                     overflow: "hidden", // Ensures content does not overflow
//                   }}
//                   whileHover={{ scale: 1.1 }}
//                 >
//                   <MapPin size={18} />
//                   <Link
//                     className="w-full flex justify-center items-center font-semibold"
//                     to={profileData?.contactInfo.maplink || dummyData.contactInfo.maplink}
//                     target="_blank"
//                   >
//                     <span style={{ marginLeft: "5px", whiteSpace: "nowrap", fontSize: profileData?.additionalInfo.personal.font_size || dummyData.additionalInfo.personal.font_size, fontFamily: profileData?.additionalInfo.personal.font_family || dummyData.additionalInfo.personal.font_family }}>
//                       {profileData?.contactInfo.physicalAddress || dummyData.contactInfo.physicalAddress}
//                     </span>
//                   </Link>
//                 </motion.div>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <Link
//                   className="w-full flex justify-center items-center font-semibold"
//                   to={profileData?.contactInfo.physicalAddress ?? dummyData?.contactInfo.physicalAddress}
//                   target="_blank"
//                 >
//                   <span>Address</span>
//                 </Link>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>




//           {/* Divider */}
//           <hr
//             style={{
//               width: "80%",
//               border: "1px solid #ccc",

//             }}
//           />
//         </div>
//       </footer>

//     </div >
//   );
// }
