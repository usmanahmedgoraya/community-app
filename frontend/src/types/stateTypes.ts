import { groupType, messageType, roomType, userType } from "./basicTypes"

export type stateType = {
    groups: groupType[],
    suggestGroups: groupType[],
    allGroups: groupType[],
    user : userType,
    allUsers : userType[],
    rooms : roomType[],
    selectedRoom : roomType,
    currentMessages : messageType[],
    currentGroupMessages : messageType[],
    selectGroup:groupType,

}