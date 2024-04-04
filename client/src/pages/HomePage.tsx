import { Button } from '@/components/ui/button'
import { Link } from "react-router-dom";
import React from 'react'

const HomePage = () => {
    return (
        <section className='min-h-screen gap-4 bg-indigo-600  flex flex-col justify-center items-center'>
            <img src="logo.png" alt="Logo" className='w-[250px]' />
            <h1 className='text-white text-2xl font-medium'>Super Simple Task Manager </h1>
            <div className="flex gap-2 justify-center items-center">
                <Button asChild variant="ghost" className='bg-[#ee1b44] text-white font-semibold'>
                    <Link to="/signup">
                        Manage Tasks Now!
                    </Link>
                </Button>
                <Button asChild variant="ghost" className='bg-white font-semibold'>
                    <Link to="/login">
                        Login
                    </Link>
                </Button>
            </div>
            <img src="/dashboard.png" alt="Taskmate App" className='shadow-2xl w-1/2	 rounded-[20px]' />
        </section>
    )
}

export default HomePage