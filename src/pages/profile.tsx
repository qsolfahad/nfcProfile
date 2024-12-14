import { useState, useEffect } from 'react'
import BusinessCard from './business-card'
import { dummyData } from './dummy-data'
import { UserProfile } from "@/lib/user-types";

export default function Page() {
  const [profileData, setProfileData] = useState<UserProfile>()

  useEffect(() => {
    // Simulate an API call
    setTimeout(() => {
      setProfileData(
        dummyData)
    }, 1000) // Simulate a 1-second delay
  }, [])

  console.log("profile data",profileData)
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <BusinessCard profile={profileData} />
    </div>
  )
}

