import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';

type Props = {
    handleAddNewNote: (content: string, taskId: string) => void;
    taskId: string;
}

const NewTaskSchema = z.object({
    content: z.string().min(1, { message: "Please provide content" }),
});

const NewNoteForm = ({ handleAddNewNote, taskId }: Props) => {
    const { register, handleSubmit, formState } = useForm<z.infer<typeof NewTaskSchema>>({
        resolver: zodResolver(NewTaskSchema),
        mode: "onChange",
        defaultValues: {
            content: "",
        },
    });

    const { errors, isValid, isLoading } = formState;



    const onSubmit = (data: any) => {
        handleAddNewNote(data.content, taskId)
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='p-2 gap-2 flex flex-col'>
            <div className='flex flex-col gap-2'>
                <label htmlFor="content" className='text-sm'>Note</label>
                <input {...register("content")} type="text" id="content" className='bg-slate-100 p-1 rounded-md w-full' />
                {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}
            </div>
            <Button disabled={!isValid || isLoading} type="submit" className='bg-indigo-500 hover:bg-indigo-600 text-white mt-2'>Add Note</Button>
        </form>
    )
}

export default NewNoteForm