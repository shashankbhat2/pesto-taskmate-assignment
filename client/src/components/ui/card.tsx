import React, { useState } from 'react'
import { Badge } from './badge'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock, Trash } from 'lucide-react'
import { Button } from "./button"
import { Checkbox } from './checkbox'

type Props = {
    taskId: string,
    title: string
    status: string
    dueDate: string
    selectedId: string | null,
    handleTaskSelect: (id: string) => void;
    handleDeletetask: (id: string) => void;
    updateTaskStatus: (id: string, status: string) => void;
    reminderTime?: Date
}

const Card = ({ title, status, dueDate, reminderTime, taskId, selectedId, updateTaskStatus, handleDeletetask, handleTaskSelect }: Props) => {
    const [isChecked, setIsChecked] = useState(false);


    const toggleDoneCheck = () => {
        const newStatus = isChecked ? "TODO" : "DONE";
        setIsChecked(!isChecked);
        updateTaskStatus(taskId, newStatus)
    }

    return (
        <div onClick={() => handleTaskSelect(taskId)} className={` ${selectedId === taskId ? "bg-[#34495E] text-white" : "bg-white text-[#34495E]"} h-full transition-opacity flex flex-col gap-4 items-center cursor-pointer  hover:bg-[#34495E] hover:text-white focus:bg-[#34495E] focus:text-white`}>
            <div className="flex w-full gap-2 p-2 justify-start items-center">
                <Checkbox onClick={toggleDoneCheck} id={`checkbox-${taskId}`} checked={isChecked || status === "DONE"} className='bg-white border-slate-400' />
                <div className="flex flex-col items-start gap-4 w-3/4">
                    <h3 className={`text-lg font-medium break-words w-full ${isChecked || status === "DONE" ? "text-green-400 line-through" : ""}`}>{title}</h3>
                </div>
            </div>

            <div className="flex justify-between p-2 border-t items-center w-full">
                <div className="flex gap-2">
                    <div className='capitalize gap-1 items-center text-xs font-medium flex'>
                        <Calendar size="14px" />
                        <span className={`${Date.now() > new Date(dueDate).getTime() && status !== "DONE" ? "text-red-500" : ""}`}> {formatDate(dueDate)}</span>
                    </div>
                    {reminderTime && <Clock size="14px" />}
                </div>
                <div className="flex gap-2">
                    <Badge variant="secondary" className={`${status === "DONE" ? "bg-green-50 text-green-400" : ""}`}>{status}</Badge>
                    <Button variant="ghost" className='p-1 h-8 w-8 text-red-500' onClick={() => handleDeletetask(taskId)}>
                        <Trash size="16px" />
                    </Button>
                </div>
            </div>
        </div>


    )
}

export default Card