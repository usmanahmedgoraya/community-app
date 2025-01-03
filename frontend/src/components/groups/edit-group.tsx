'use client'
import { ChevronLeft, PlusCircle, X } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Cookies from "js-cookie"
import { getAllUsers } from "@/API/users"
import { editGroupInfoAPI, getAllGroups } from "@/API/rooms"
import { setAllUsers } from "@/redux/slices/allUsers"
import { stateType } from "@/types/stateTypes"
import { userType } from "@/types/basicTypes"
import closeSvg from "../../../public/svgs/cross.svg"
import { groupRoomT } from "./add-group"
import { updateGroups } from "@/redux/slices/groupRoomSlice"

export default function Component({ setIsModal, isModal }: groupRoomT) {
    const router = useRouter()
    const dispatch = useDispatch()
    const [groupName, setGroupName] = useState("")
    const [groupGoals, setGroupGoals] = useState("")
    const [groupPicture, setGroupPicture] = useState<File | null>(null)
    const [groupPicturePreview, setGroupPicturePreview] = useState<string | null>(null)
    const [selectedUsers, setSelectedUsers] = useState<any>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [showAddMember, setShowAddMember] = useState(false)
    const currentGroup = useSelector((state: stateType) => state.selectGroup)
    const allUsers = useSelector((state: stateType) => state.allUsers);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const users = await getAllUsers(Cookies.get("userToken"))
                setGroupName(currentGroup.name || "")
                setGroupGoals(currentGroup?.goal || "")
                setSelectedUsers(currentGroup?.members || [])
                dispatch(setAllUsers(users))
            } catch (error) {
                console.error("Error fetching initial data:", error)
            }
        }
        fetchInitialData()
    }, [dispatch, currentGroup._id])

    const filteredUsers = allUsers && allUsers
        .filter((user: userType) => user._id && !selectedUsers.includes(user._id))
        .filter((user: userType) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )

    const handleUserSelect = (userId: string | null) => {
        setSelectedUsers((prev:any) => [...prev, userId])
        setShowAddMember(false)
        setSearchTerm("")
    }

    const handleRemoveUser = (userId: string | null) => {
        if (userId?.toString() === currentGroup?.admin?.toString()) return
        setSelectedUsers((prev:any)=> prev.filter((id:any) => id !== userId))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!currentGroup._id) throw new Error("Group ID is required");
    
            // Create a FormData object to handle file upload
            const formData = new FormData();
            formData.append("name", groupName);
            formData.append("goal", groupGoals);
            formData.append("members", JSON.stringify(selectedUsers)); // Assuming your API expects members as a JSON string
            if (groupPicture) {
                formData.append("imageURL", groupPicture); // Append the image file
            }
    
            await editGroupInfoAPI(Cookies.get("userToken"), currentGroup._id, formData as unknown as Record<string, unknown>);
            const updatedGroups = await getAllGroups(Cookies.get("userToken"));
            dispatch(updateGroups(updatedGroups));
            setIsModal({
                addGroup: false,
                createGroup: false,
                suggestGroup: false,
                editGroup: false,
            });
        } catch (error) {
            console.error("Error updating group:", error);
        } finally {
            setLoading(false);
        }
    };
    

    

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

    const isAdminUser = (userId: string | null, adminId: string) => userId === adminId

    const sortedUserIds = (() => {
        if (!selectedUsers.length) return []
        const adminUser = selectedUsers.find((userId: string) => isAdminUser(userId, currentGroup.admin))
        const otherUsers = selectedUsers.filter((userId: string) => !isAdminUser(userId, currentGroup.admin))
        const sortedOtherUsers = otherUsers.sort((a: string | undefined, b: string | undefined) => {
            const userA = allUsers.find(u => u._id === a)
            const userB = allUsers.find(u => u._id === b)
            return (userA?.name || "").localeCompare(userB?.name || "")
        })
        return adminUser ? [adminUser, ...sortedOtherUsers] : sortedOtherUsers
    })()

    if (!isModal.editGroup) return null

    return (
        <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur flex justify-center items-center pt-10">
            <div className="h-[85%] w-[900px] overflow-y-scroll max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Edit Group</h5>
                    <Image
                        className="w-10 h-10 cursor-pointer"
                        onClick={() => setIsModal({ addGroup: false, createGroup: false, suggestGroup: false, editGroup: false })}
                        src={closeSvg}
                        alt="Close"
                    />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <label htmlFor="groupPicture" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Group Picture</label>
                        <input
                            type="file"
                            id="groupPicture"
                            onChange={handleFileChange}
                            className="mt-1 cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            accept="image/*"
                        />
                        <div className="mt-8 w-32 h-32 overflow-hidden rounded-full border-2 border-gray-300 flex items-center justify-center">
                            {groupPicturePreview ? (
                                <img
                                    src={groupPicturePreview}
                                    alt="Group Picture Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : currentGroup.imageUrl ? (
                                <img
                                    src={currentGroup.imageUrl}
                                    alt="Current Group Picture"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-400">No image</span>
                            )}
                            <button
                                type="button"
                                onClick={() => { setGroupPicture(null); setGroupPicturePreview(null) }}
                                className="absolute top-20 left-2 bg-red-600 z-50 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
                                aria-label="Remove Image"
                            >
                                <X size={16} className="text-white" />
                            </button>
                        </div>
                    </div>
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
                        />
                    </div>
                    {showAddMember && (
                        <div className="my-4">
                            <label htmlFor="userSearch" className="block my-2 font-medium text-gray-700 dark:text-white text-xl">Search Users</label>
                            <input
                                type="text"
                                id="userSearch"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="Search by user name..."
                            />
                            <div className="space-y-2 mt-4">
                                {filteredUsers && filteredUsers.map((user: userType) => (
                                    <div
                                        key={user._id}
                                        className="cursor-pointer p-2 hover:bg-gray-100  rounded-md text-white hover:text-black flex justify-between items-center"
                                        onClick={() => handleUserSelect(user?._id || null)}
                                    >
                                        {user.name}
                                        <span><PlusCircle size={20} className="text-green-500"/></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Members</label>
                        <ul className="space-y-2">
                            {sortedUserIds.map((userId :string) => {
                                const user = allUsers.find((u) => u._id === userId)
                                if (!user) return null
                                return (
                                    <li
                                        key={user._id}
                                        className="flex justify-between items-center p-2 text-white rounded-md shadow "
                                    >
                                        {user.name}
                                        {!isAdminUser(user._id || null, currentGroup.admin)? (

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveUser(user._id || null)}
                                                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                                aria-label="Remove User"
                                            >
                                                <X size={16} className="text-white" />
                                            </button>
                                        ):<span>admin</span>}
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="mt-4">
                            <button
                                type="button"
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                                onClick={() => setShowAddMember(!showAddMember)}
                            >
                                <PlusCircle size={20} />
                                Add Member
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? "Updating..." : "Update Group"}
                    </button>
                </form>
            </div>
        </div>
    )
}
