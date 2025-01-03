import React from 'react'
import { Loader2 } from 'lucide-react'

const page = () => {
  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="text-center space-y-6 p-8 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-2xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white animate-pulse">
          Coming Soon
        </h1>
        <p className="text-xl md:text-2xl text-white opacity-75">
          We're working hard to bring you something amazing!
        </p>
        <Loader2 className="animate-spin text-white mx-auto" size={48} />
      </div>
    </div>  )
}

export default page