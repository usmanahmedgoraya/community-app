"use client"

import { stateType } from "@/types/stateTypes"
import { useSelector } from "react-redux"


export const getUserStateData = ()=>{
    const user = useSelector((state : stateType) => state.user)

    return user
}