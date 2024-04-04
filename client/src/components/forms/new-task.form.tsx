import React from 'react'
import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
    handleAddNewTask: (title: string, dueDate: string, reminderTime: string) => void;
}

const NewTaskSchema = z.object({
    title: z.string().min(1, { message: "Please provide a title" }),
    dueDate: z.string().optional(),
    reminderTime: z.string().optional(),
});


const NewTaskForm = ({handleAddNewTask}: Props) => {
    const { register, handleSubmit, formState } = useForm<z.infer<typeof NewTaskSchema>>({
        resolver: zodResolver(NewTaskSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            reminderTime: "",
        },
    });

    const { errors, isValid, isLoading } = formState;


    const onSubmit = (data: any) => {
        handleAddNewTask(data.title, data.dueDate, data.reminderTime)
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='p-2 gap-2 flex flex-col'>
            <div className='flex flex-col gap-2'>
                <label htmlFor="title" className='text-sm'>Title</label>
                <input {...register("title")} type="text" id="title" className='bg-slate-100 p-1 rounded-md w-full' />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="dueDate" className='text-sm'>Due Date</label>
                    <input
                        {...register("dueDate")}
                        type="date"
                        id="dueDate"
                        className='bg-slate-100 p-1 rounded-md w-full'
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="reminderTime" className='text-sm'>Reminder Time</label>
                    <input {...register("reminderTime")} type="time" id="dueDate" className='bg-slate-100 p-1 rounded-md w-full' />
                </div>
            </div>
            <Button disabled={!isValid || isLoading} type="submit" className='bg-indigo-500 hover:bg-indigo-600 text-white mt-2'>Add Task</Button>
        </form>
    )
}

export default NewTaskForm