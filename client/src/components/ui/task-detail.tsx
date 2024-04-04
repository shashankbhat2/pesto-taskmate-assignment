import { NoteType } from '@/type';
import React from 'react'
import { DialogTrigger } from './dialog';
import NotesContainer from '../containers/notes.container';
import { Calendar, Clock, Plus, Trash } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
type Props = {
    taskId: string | null
    handleUpdateTask: () => void;
    handleDeleteNote: (noteId: string) => void
    handleUpdateTaskStatus: (taskId: string, value: string) => void;
    edit: boolean;
    isNotesLoading: boolean;
    isNotesError: boolean;
    noteError: any;
    register: any;
    data: {
        id: string;
        title: string;
        dueDate: string;
        reminderTime: string;
        status: string;
    };
    setEdit: (value: boolean) => void;
    setShowDialog: (value: boolean) => void;
    reminderTime: string | null;
    notes: NoteType[];
}

const TaskDetail = ({ taskId, handleDeleteNote, isNotesLoading,
    isNotesError,
    noteError, reminderTime, edit, register, data, setShowDialog, handleUpdateTaskStatus, handleUpdateTask, setEdit, notes }: Props) => {
    return (
        <div className='hidden md:flex w-full flex-col overflow-hidden h-full'>
            {data &&
                <div className="flex flex-col justify-between min-h-[100px] h-auto gap-2">
                    <form onSubmit={handleUpdateTask}>
                        <div className="flex flex-col justify-between p-4 min-h-[100px] h-auto border-b gap-2">
                            <div className="flex flex-col items-start gap-4 justify-start w-75">
                                {edit ? <input type="text" {...register("title")} id="title" className="text-xl outline-none focus:outline-none focus:ring-0 font-medium border-b-2 break-words w-full" /> : <h3 className="text-xl font-medium break-words w-full">{data.title}</h3>}
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col gap-2 items-start">
                                    <div className='capitalize gap-1 items-center text-xs font-medium flex'>
                                        <Calendar size="14px" />
                                        {edit ? <input
                                            type="date"
                                            id="dueDate"
                                            {...register("dueDate")}
                                            className='bg-slate-100 p-1 rounded-md w-full'
                                        /> :
                                            <span className={`${Date.now() > new Date(data.dueDate).getTime() && data.status !== "DONE" ? "text-red-500" : ""}`}> {formatDate(data.dueDate)}</span>}
                                    </div>

                                    <div className='flex gap-2 text-xs items-center'>
                                        <Clock size="14px" />
                                        {edit ? <input type="time" {...register("reminderTime")} id="reminderTime" className='bg-slate-100 p-1 rounded-md w-full' /> : <span>{reminderTime}</span>}
                                    </div>

                                </div>
                                <div className='flex flex-col md:flex-row justify-center items-end gap-2'>
                                    <Select value={data.status} onValueChange={(value) => handleUpdateTaskStatus(taskId!, value)}>
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent className='z-20 cursor-pointer'>
                                            <SelectGroup>
                                                <SelectItem value="TODO" className='cursor-pointer'>TODO</SelectItem>
                                                <SelectItem value="DOING" className='cursor-pointer'>DOING</SelectItem>
                                                <SelectItem value="DONE" className='cursor-pointer'>DONE</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {edit ? (
                                        <Button type="submit" className="your-button-class">Save</Button>
                                    ) : (
                                        <Button type="button" onClick={(e) => { e.preventDefault(); setEdit(true) }} className="your-button-class">Edit</Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className='flex p-2 border-b justify-between items-center'>
                        <p>Add Note</p>
                        <DialogTrigger onClick={() => setShowDialog(true)} className='w-auto h-auto p-1 bg-[#34495E] rounded-md text-white'>
                            <Plus size="18px" />
                        </DialogTrigger>
                    </div>
                    <NotesContainer notes={notes} noteError={noteError} isNotesError={isNotesError} isNotesLoading={isNotesLoading} handleDeleteNote={handleDeleteNote} />
                </div>
            }
        </div>
    )
}

export default TaskDetail