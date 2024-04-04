import TaskListContainer from '@/components/containers/task-list.container'
import TaskDetailContainer from '@/components/containers/task-detail.container';
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth';

const DashboardHome = () => {
    const { logout } = useAuth()
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const handleTaskSelect = (id: string | null) => {
        setSelectedTaskId(id);
    }

    return (
        <section className='flex flex-col lg:flex-row bg-[#FEF5F7] gap-2 p-2'>
            <div className="flex-none bg-slate-100 flex lg:flex-col justify-between items-center border p-2 rounded-md w-auto">
                <img src="/logo_icon.svg" alt="taskmate_icon" className='w-[45px]' />
                <div className='flex lg:flex-col gap-2 justify-center items-center'>
                    <button onClick={logout} className='text-red-400 font-medium'>Logout</button>
                </div>
            </div>
            <div className="w-full flex-grow overflow-hidden flex flex-col lg:flex-row gap-2 bg-slate-100 border rounded-md p-2">
                <div className="w-full lg:w-1/3 xl:w-1/4 bg-white border rounded-md">
                    <TaskListContainer selectedTaskId={selectedTaskId} handleTaskSelect={handleTaskSelect} />
                </div>
                <div className="flex-grow w-full lg:flex-auto bg-white border rounded-md overflow-hidden">
                    <TaskDetailContainer handleSelectedTask={handleTaskSelect} taskId={selectedTaskId} />
                </div>

            </div>
        </section>
    )
}

export default DashboardHome