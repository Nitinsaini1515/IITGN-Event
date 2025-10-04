"use client"

import { useState, useEffect } from "react"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import Button from "@/components/ui/Button"
import { profileApi } from "@/lib/mockApi"
import type { UserProfile } from "@/lib/mockData"
import { CardSkeleton } from "@/components/ui/LoadingSkeleton"
import toast from "react-hot-toast"

interface UserProfileProps {
  userId: string
}

export default function UserProfileComponent({ userId }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const data = await profileApi.getUserProfile(userId)
      if (data) {
        setProfile(data)
        setFormData(data)
      }
    } catch (error) {
      toast.error("Failed to load profile")
      console.error("Failed to fetch profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await profileApi.updateUserProfile(userId, formData)
      if (result.success && result.profile) {
        setProfile(result.profile)
        setIsEditing(false)
        toast.success("Profile updated successfully!")
      } else {
        toast.error(result.error || "Failed to update profile")
      }
    } catch (error) {
      toast.error("Failed to update profile")
      console.error("Failed to update profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile || {})
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
        <CardSkeleton />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
        {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
      </div>

      <Card>
        <div className="space-y-4">
          <Input
            label="Name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isEditing}
          />

          <Input
            label="Email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!isEditing}
          />

          <Input
            label="Phone"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!isEditing}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Role" value={profile.role} disabled />

            <Input
              label="Department"
              value={formData.department || ""}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          {profile.role === "employee" && (
            <Input
              label="Manager"
              value={formData.manager || ""}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              disabled={!isEditing}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              value={formData.company || ""}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              disabled={!isEditing}
            />

            <Select
              label="Currency"
              value={formData.currency || "USD"}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              disabled={!isEditing}
              options={[
                { value: "USD", label: "USD ($)" },
                { value: "EUR", label: "EUR (€)" },
                { value: "GBP", label: "GBP (£)" },
                { value: "INR", label: "INR (₹)" },
              ]}
            />
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
