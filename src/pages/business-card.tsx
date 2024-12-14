
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, FileText, Phone } from 'lucide-react'
import { UserProfile } from "@/lib/user-types";

interface BusinessCardProps {
  profile: UserProfile | undefined;
}

export default function BusinessCard({ profile }: BusinessCardProps) {
  if (!profile) {
    return <Card className="w-full max-w-md mx-auto bg-white p-6 text-center">Loading...</Card>
  }

  return (
    <Card className="relative w-full max-w-md mx-auto h-[600px] overflow-hidden">
      {/* Background Image */}
      <img
        src={"https://picsum.photos/800/1200"}
        alt={"Profile"}
        className="object-contain"
      />
      
      {/* Blur and Color Overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-purple-600/30" />
      
      {/* Card Content */}
      <CardContent className="relative h-full flex flex-col justify-end p-6 text-white z-10">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Muhammad Waqar
          </h2>
          {profile.personalInfo?.description && (
            <p className="text-sm text-gray-200">
              {profile.personalInfo.description}
            </p>
          )}
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-4 mb-6">
          {profile.socialMediaInfo?.facebook && (
            <a href={profile.socialMediaInfo.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
              <Facebook className="w-6 h-6" />
            </a>
          )}
          {profile.socialMediaInfo?.instagram && (
            <a href={profile.socialMediaInfo.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {profile.socialMediaInfo?.twitter && (
            <a href={profile.socialMediaInfo.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
              <Twitter className="w-6 h-6" />
            </a>
          )}
        </div>

        {/* Additional Info: Resume and WhatsApp */}
        <div className="space-y-3">
          {profile.additionalInfo?.resume && (
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 bg-white/10 hover:bg-white/20 text-white border-white/20"
              asChild
            >
              <FileText className="mr-2 h-5 w-5" />
              View Resume
            </Button>
          )}
          {profile.contactInfo?.whatsapp && (
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 bg-white/10 hover:bg-white/20 text-white border-white/20"
              asChild
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact on WhatsApp
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
