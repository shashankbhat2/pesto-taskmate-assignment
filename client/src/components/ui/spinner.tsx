import React from 'react'


const Spinner = () => {
    return (
        <div className="flex justify-center min-h-screen items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    )
}

export default Spinner