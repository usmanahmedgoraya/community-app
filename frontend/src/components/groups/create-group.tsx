'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Cookies from "js-cookie"
import { ChevronLeft, PlusCircle, X } from "lucide-react"
import { getAllUsers } from "@/API/users"
import { createGroupAPI, createRoomAPI, getAllGroups } from "@/API/rooms"
import { setAllUsers } from "@/redux/slices/allUsers"
import { stateType } from "@/types/stateTypes"
import { userType } from "@/types/basicTypes"

import closeSvg from "../../../public/svgs/cross.svg"
import userSvg from "../../../public/svgs/user.svg"
import { groupRoomT } from "./add-group"
import { button } from "@material-tailwind/react"
import { updateGroups } from "@/redux/slices/groupRoomSlice"

export default function CreateGroup({ setIsModal, isModal }: groupRoomT) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [groupName, setGroupName] = useState("")
  const [groupGoals, setGroupGoals] = useState("")
  const [groupPicture, setGroupPicture] = useState<File | null>(null)
  const [groupPicturePreview, setGroupPicturePreview] = useState<string | null>(null) // New state for image preview
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const allUsers = useSelector((state: stateType) => state.allUsers)

  useEffect(() => {
    console.log(allUsers, "users");

    const fetchUsers = async () => {
      const users = await getAllUsers(Cookies.get("userToken"))
      dispatch(setAllUsers(users))
    }
    fetchUsers()
  }, [dispatch])

  const filteredUsers = allUsers.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const formData = new FormData(); // Create a FormData instance
        formData.append("name", groupName);
        formData.append("goal", groupGoals);
        formData.append("members", JSON.stringify(selectedUsers)); // If your server expects this as a JSON string
        formData.append("type", "group");
        
        if (groupPicture) {
            formData.append("imageURL", groupPicture); // Append the image file
        }

        const result = await createGroupAPI(Cookies.get("userToken"), formData);
        const newGroups = await getAllGroups(Cookies.get("userToken"));
        dispatch(updateGroups(newGroups));
        setIsModal({
            addGroup: false,
            createGroup: false,
            suggestGroup: false
        });
    } catch (error) {
        console.error("Error creating group:", error);
    }
    setLoading(false);
};

  

  // Update image preview when a new file is selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setGroupPicture(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGroupPicturePreview(reader.result as string) // Set the preview URL
      }
      reader.readAsDataURL(file)
    } else {
      setGroupPicturePreview(null) // Clear the preview if no file is selected
    }
  }

  if (!isModal.createGroup) return null

  return (
    <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur flex justify-center items-center pt-10">
      <div className="h-[85%] w-[500px] overflow-y-scroll max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span onClick={() => {
              setIsModal({
                createGroup: false,
                addGroup: true,
                suggestGroup: false
              })
            }}><ChevronLeft size={32} className="text-white cursor-pointer hover:text-blue-700" /></span>
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Create New Group</h5>
          </div>
          <Image
            className="w-10 h-10 cursor-pointer"
            onClick={() => {
              setIsModal({
                addGroup: false,
                createGroup: false,
                suggestGroup: false
              })
            }}
            src={closeSvg}
            alt="Close"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Group Name</label>
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
            <label htmlFor="groupGoals" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Group Goals</label>
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
            <label htmlFor="groupPicture" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Group Picture</label>
            <input
              type="file"
              id="groupPicture"
              onChange={handleFileChange} // Update the file change handler
              className="mt-1 cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              accept="image/*"
            />
            {/* Render image preview */}
            {/* Render image preview */}
            {groupPicturePreview && (
              <div className="mt-8 w-32 h-32 overflow-hidden rounded-full border-2 border-gray-300 flex items-center justify-center ">
                <img
                  src={groupPicturePreview}
                  alt="Group Picture Preview"
                  className="w-full h-full object-cover"
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => {
                    setGroupPicture(null); // Clear the image file state
                    setGroupPicturePreview(null); // Clear the image preview
                  }}
                  className="absolute top-20 left-2 bg-red-600 z-50 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
                  aria-label="Remove Image"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            )}

          </div>
          <div>
            <label htmlFor="userSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Add Users</label>
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
            {filteredUsers.map((user: userType) => (
              <div key={user._id} className="flex items-center justify-between py-2">
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
                  onClick={() => handleUserSelect(user._id ?? '')}
                  className={`p-0.5 flex justify-center items-center rounded-full ${selectedUsers.includes(user._id ?? '') ? 'bg-[#615EF0] text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {selectedUsers.includes(user._id ?? '') ? <X size={24} /> : <PlusCircle size={24} />}
                </button>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center text-white rounded-md py-2 font-medium text-lg bg-[#615EF0] hover:bg-[#4F4CC9] disabled:bg-[#A5A3F7]"
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  )
}
