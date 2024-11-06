export type userType = {
    email?: string,
    password?: string,
    name?: string,
    phone_number?: number,
    gender?: string,
    life_style_goals?: string,
    interests?: any[],
    _id? : string,
    createdAt? : string,
    updatedAt? : string,
    password_key? : string
    user? : any
  }

  export type loginDataType = {
    email? : string,
    password? : string
  }

  export type interestType ={
    _id : string,
    name : string,
    createdAt : string,
    updatedAt : string
  }

  export type roomType = {
    _id? : string,
    type? : string,
    name? : string,
    members? : userType[],
    recentMessages? : messageType[]
  }
  export type groupType = {
    _id? : string,
    type? : string,
    name? : string,
    admin : string,
    imageUrl? : string,
    goal? : string,
    members? : userType[],
    recentMessages? : messageType[]
  }


  export type messageType = {
    room? : string,
    _id? : string,
    content? : string,
    sender? : string,
    timestamp : string | number | Date
  }