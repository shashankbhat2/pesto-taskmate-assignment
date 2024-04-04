import { addNewNote, deleteNote, getNotesByTaskId, getTaskById, updateTask, updateTaskStatus } from '@/lib/fetch'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Spinner from '../ui/spinner'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import NewNoteForm from '../forms/new-note.form'
import TaskDrawer from '../ui/drawer'
import { NoteType } from '@/type'
import { toast } from 'sonner'
import TaskDetail from '../ui/task-detail'

type TaskDetailProps = {
    taskId: string | null
    handleSelectedTask: (taskId: string | null) => void
}

const UpdateTaskSchema = z.object({
    title: z.string().min(1, { message: "Please provide a title" }),
    dueDate: z.string().optional(),
    reminderTime: z.string().optional(),
});

const TaskDetailContainer = ({ taskId, handleSelectedTask }: TaskDetailProps) => {
    const [edit, setEdit] = useState<boolean>(false)
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const { isLoading, data, isError, error } = useQuery(['task', taskId], () => getTaskById(taskId), {
        enabled: !!taskId,
    });
    const { isLoading: isNotesLoading, isError: isNotesError, error: noteError } = useQuery(['notes', taskId], () => getNotesByTaskId(taskId), {
        enabled: !!taskId,
        onSuccess: (data) => {
            setNotes(data)
        }
    });
    const { register, watch, handleSubmit, reset } = useForm<z.infer<typeof UpdateTaskSchema>>({
        resolver: zodResolver(UpdateTaskSchema),
        mode: "onChange",
    });

    const queryClient = useQueryClient();
    const addnewTaskMutation = useMutation(({ content, taskId }: any) => addNewNote({ content, taskId }))
    const updateTaskStatusMutation = useMutation(({ taskId, status }: any) => updateTaskStatus({ taskId, status }))
    const deleteNoteMutation = useMutation(({ noteId }: any) => deleteNote(noteId))

    const editTaskMutation = useMutation(({ taskId,
        title,
        dueDate,
        reminderTime }: any) => updateTask({
            taskId,
            title,
            dueDate,
            reminderTime
        }), {})





    useEffect(() => {
        if (data) {
            reset({
                title: data.title,
                reminderTime: data.reminderTime,
                dueDate: data.dueDate,
            });
        }
    }, [data]);

    useEffect(() => {
        if (taskId) {
            setEdit(false);
        }
    }, [taskId]);

    const handleUpdateTask = async (formValues: any) => {
        setEdit(false);
        const { title, dueDate, reminderTime } = formValues;
        console.log(title, dueDate, reminderTime)
        editTaskMutation.mutate({ taskId, title, dueDate, reminderTime }, {
            onSuccess: () => {
                toast.success("Task updated successfully")
                queryClient.invalidateQueries({ queryKey: "tasks" })
                queryClient.invalidateQueries(["task", taskId]);
            },
            onError: () => {
                toast.error("Error updating task")
            }

        })
    }

    const handleUpdateTaskStatus = (taskId: string, status: string) => {
        updateTaskStatusMutation.mutate({ taskId, status }, {
            onSuccess: () => {
                toast.success("Task status updated successfully")
                queryClient.invalidateQueries({ queryKey: "tasks" })
                queryClient.invalidateQueries(["task", taskId]);
            },
            onError: () => {
                toast.error("Error updating task status")
            }

        })
    }



    const handleAddNewNote = (content: string, taskId: string) => {
        addnewTaskMutation.mutate({ content, taskId }, {
            onSuccess: () => {
                setShowDialog(false)
                toast.success("Note added successfully")
                queryClient.invalidateQueries(["notes", taskId])
            },
            onError: () => {
                toast.error("Error adding new task");
            }
        })
    }

    const handleDeleteNote = (noteId: string) => {
        deleteNoteMutation.mutate({ noteId }, {
            onSuccess: () => {
                toast.success("Note deleted successfully")
                queryClient.invalidateQueries(["notes", taskId])
            },
            onError: () => {
                toast.error("Error deleting note");
                console.log("error adding new task");
            }

        })
    }




    if (!taskId) {
        return (
            <img className="hidden md:block object-cover w-full h-full" src="https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=2078&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Select a task" />
        );
    }

    if (isLoading) {
        return <Spinner />
    }

    if (isError) {
        return (
            <div className='flex w-full flex-col h-full items-center justify-center'>
                <p>Error: {(error as any)?.message}</p>
            </div>
        );
    }

    const reminderTime = data.reminderTime ? format(parseISO(data.reminderTime), "do MMMM p") : null;

    const onSubmit = handleSubmit((formValues) => {
        console.log(formValues)
        handleUpdateTask(formValues);
    });


    return (
        <Dialog open={showDialog} onOpenChange={() => setShowDialog(!showDialog)}>
            <TaskDetail handleDeleteNote={handleDeleteNote} isNotesError={isNotesError} isNotesLoading={isNotesLoading} noteError={noteError} notes={notes} taskId={taskId} setShowDialog={setShowDialog} handleUpdateTaskStatus={handleUpdateTaskStatus} handleUpdateTask={onSubmit} setEdit={setEdit} reminderTime={reminderTime} edit={edit} register={register} data={data} />
            {window.innerWidth <= 768 ? <TaskDrawer handleDeleteNote={handleDeleteNote} isNotesError={isNotesError} isNotesLoading={isNotesLoading} noteError={noteError} notes={notes} taskId={taskId} handleSelectedTask={handleSelectedTask} setShowDialog={setShowDialog} handleUpdateTaskStatus={handleUpdateTaskStatus} handleUpdateTask={onSubmit} setEdit={setEdit} reminderTime={reminderTime} edit={edit} register={register} data={data} /> : null}
            <DialogContent className="sm:max-w-[425px] p-0">
                <DialogHeader className='border-b bg-[#F4F7F7] rounded-t p-2 justify-center'>
                    <DialogTitle>New Note</DialogTitle>
                </DialogHeader>
                <NewNoteForm handleAddNewNote={handleAddNewNote} taskId={taskId} />
            </DialogContent>
        </Dialog>
    )
}

export default TaskDetailContainer