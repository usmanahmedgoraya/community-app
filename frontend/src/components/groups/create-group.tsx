'use client'

import { createGroupAPI, getAllGroups, getGroupRooms } from "@/API/rooms"
import { getAllUsers } from "@/API/users"
import { setAllUsers } from "@/redux/slices/allUsers"
import { userType } from "@/types/basicTypes"
import { stateType } from "@/types/stateTypes"
import Cookies from "js-cookie"
import { ChevronLeft, PlusCircle, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { updateAllGroups, updateGroups } from "@/redux/slices/groupRoomSlice"
import closeSvg from "../../../public/svgs/cross.svg"
import userSvg from "../../../public/svgs/user.svg"
import { groupRoomT } from "./add-group"

export default function CreateGroup({ setIsModal, isModal }: groupRoomT) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [groupName, setGroupName] = useState("")
  const [groupGoals, setGroupGoals] = useState("")
  const [groupPicture, setGroupPicture] = useState<File | null>(null)
  const [groupPicturePreview, setGroupPicturePreview] = useState<string | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const allUsers = useSelector((state: stateType) => state.allUsers)
  const currentUser = useSelector((state: stateType) => state.user.user)

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers(Cookies.get("userToken"))
      dispatch(setAllUsers(users))
    }
    fetchUsers()
  }, [dispatch])

  const filteredUsers = currentUser && allUsers
    .filter((user: userType) => user._id !== currentUser?._id) // Exclude current user
    .filter((user: userType) =>
      user && user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", groupName)
      formData.append("goal", groupGoals)
      formData.append("members", JSON.stringify(selectedUsers))
      formData.append("type", "group")

      if (groupPicture) {
        formData.append("imageURL", groupPicture)
      }

      const result = await createGroupAPI(Cookies.get("userToken"), formData)
      const newGroups = await getGroupRooms(Cookies.get("userToken"))
      const allGroups = await getAllGroups(Cookies.get("userToken"))
      dispatch(updateGroups(newGroups))
      dispatch(updateAllGroups(allGroups))
      setIsModal({
        addGroup: false,
        createGroup: false,
        suggestGroup: false,
      })
    } catch (error) {
      console.error("Error creating group:", error)
    }
    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setGroupPicture(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGroupPicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setGroupPicturePreview(null)
    }
  }

  if (!isModal.createGroup) return null

  return (
    <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur flex justify-center items-center pt-10">
      <div className="h-[85%] w-[500px] overflow-y-scroll max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              onClick={() =>
                setIsModal({
                  createGroup: false,
                  addGroup: true,
                  suggestGroup: false,
                })
              }
            >
              <ChevronLeft
                size={32}
                className="text-white cursor-pointer hover:text-blue-700"
              />
            </span>
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Create New Group
            </h5>
          </div>
          <Image
            className="w-10 h-10 cursor-pointer"
            onClick={() =>
              setIsModal({
                addGroup: false,
                createGroup: false,
                suggestGroup: false,
              })
            }
            src={closeSvg}
            alt="Close"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="groupGoals"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Group Goals
            </label>
            <input
              id="groupGoals"
              type="text"
              value={groupGoals}
              onChange={(e) => setGroupGoals(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            ></input>
          </div>
          <div className="relative">
            <label
              htmlFor="groupPicture"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Group Picture
            </label>
            <input
              type="file"
              id="groupPicture"
              onChange={handleFileChange}
              className="mt-1 cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              accept="image/*"
            />
            {groupPicturePreview && (
              <div className="mt-8 w-32 h-32 overflow-hidden rounded-full border-2 border-gray-300 flex items-center justify-center relative">
                <img
                  src={groupPicturePreview}
                  alt="Group Picture Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setGroupPicture(null)
                    setGroupPicturePreview(null)
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
                  aria-label="Remove Image"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="userSearch"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Add Users
            </label>
            <input
              type="text"
              id="userSearch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="max-h-[15rem] scroll-px-3 overflow-y-auto">
            {filteredUsers && filteredUsers?.map((user: userType) => (
              <div
                key={user._id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center">
                  <Image
                    src={userSvg}
                    alt={user.name || ""}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-white">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleUserSelect(user._id ?? "")}
                  className={`p-0.5 flex justify-center items-center rounded-full ${
                    selectedUsers.includes(user._id ?? "")
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                >
                  {selectedUsers.includes(user._id ?? "") ? (
                    <X size={16} />
                  ) : (
                    <PlusCircle size={16} />
                  )}
                </button>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full text-white ${
              loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
            } py-2 px-4 rounded focus:outline-none`}
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  )
}
