import React, { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { addNewTask, deleteTask, fetchPaginatedUserTasks, fetchUserTaskStats, updateTaskStatus } from '@/lib/fetch'
import Card from '../ui/card'
import Spinner from '../ui/spinner'
import { getPageRange, sortTasksByStatus } from '@/lib/utils'
import { StatusType, TaskType } from '@/type'
import Pagination from '../ui/pagination'
import { DialogHeader, DialogTrigger, Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import NewTaskForm from '../forms/new-task.form'
import { debounce } from 'lodash'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TaskListProps {
    handleTaskSelect: (id: string | null) => void;
    selectedTaskId: string | null;
}

const TaskListContainer = ({ handleTaskSelect, selectedTaskId }: TaskListProps) => {
    const [page, setPage] = useState<number>(1)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [filter, setFilter] = useState<StatusType | "all">("all")
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [tasks, setTasks] = useState<any[]>([]);
    const queryClient = useQueryClient();

    const { isLoading, isError, error } = useQuery({
        queryKey: ["tasks", page, debouncedSearchTerm, filter], queryFn: () => fetchPaginatedUserTasks({ page: page, pageSize: 10, searchTerm: searchTerm, filter: filter }), select: data => ({
            ...data,
            tasks: data.tasks.slice().sort(sortTasksByStatus)
        }),
        onSuccess: (data) => {
            setTasks(data.tasks)
        }
    })

    const { isLoading: isTaskStatsLoading, data: taskStats } = useQuery({
        queryKey: "taskStats", queryFn: () => fetchUserTaskStats(10)
    })

    const totalPages = taskStats ? taskStats.totalPages : 0;
    const visiblePageNumbers = totalPages
        ? getPageRange(totalPages, page)
        : [1];

    const updateTaskStatusMutation = useMutation(({ taskId, status }: any) => updateTaskStatus({ taskId, status }))
    const addnewTaskMutation = useMutation(({ title, dueDate, reminderTime }: any) => addNewTask({ title, dueDate, reminderTime }))
    const deleteTaskMutation = useMutation((taskId: string) => deleteTask(taskId))


    const refetchTasks = () => {
        queryClient.invalidateQueries({ queryKey: "tasks" })
    };

    useEffect(() => {
        const debouncedUpdate = debounce((searchTerm) => {
            setDebouncedSearchTerm(searchTerm);
        }, 1000);

        debouncedUpdate(searchTerm);

        return () => {
            debouncedUpdate.cancel();
        };
    }, [searchTerm]);


    const handleAddNewTask = (title: string, dueDate: string, reminderTime: string) => {
        addnewTaskMutation.mutate({ title, dueDate, reminderTime }, {
            onSuccess: () => {
                refetchTasks();
                setShowDialog(false)
            },
            onError: () => {
                console.log("error adding new task");
            }
        })
    }

    const handleUpdateTaskStatus = (taskId: string, status: string) => {
        updateTaskStatusMutation.mutate({ taskId, status }, {
            onSuccess: () => {
                refetchTasks();
            },
            onError: () => {
                console.log("error updating task");
            }

        })
    }

    const handleDeletetask = (taskId: string) => {
        deleteTaskMutation.mutate(taskId, {
            onSuccess: () => {
                if (selectedTaskId) {
                    const currentTaskIndex = tasks.findIndex(task => task.id === taskId);
                    const nextTask = tasks[currentTaskIndex + 1] || tasks[currentTaskIndex - 1] || null;

                    if (nextTask) {
                        handleTaskSelect(nextTask.id);
                    } else {
                        handleTaskSelect(null);
                    }
                }
                refetchTasks();

            },
            onError: () => {
                console.log("error deleting task");
            }
        })
    }


    const renderTasks = (tasks: TaskType[]) => {
        if (tasks.length === 0) {
            return <div className='flex justify-center items-center min-h-screen'>No tasks found.</div>;
        }

        return tasks.map((task: TaskType) => (

            <Card
                handleDeletetask={handleDeletetask}
                handleTaskSelect={handleTaskSelect}
                key={task.id}
                selectedId={selectedTaskId}
                taskId={task.id}
                updateTaskStatus={handleUpdateTaskStatus}
                title={task.title}
                status={task.status}
                dueDate={task.dueDate}
                reminderTime={task.reminderTime}
            />
        ));
    };


    return (
        <Dialog open={showDialog} onOpenChange={() => setShowDialog(!showDialog)}>
            <div className='flex relative flex-col '>
                <div className="flex flex-col justify-between items-center">
                    <div className="flex items-center p-2 border-b w-full justify-between">
                        <h1>All Tasks</h1>
                        <DialogTrigger onClick={() => setShowDialog(true)} className='w-auto h-auto p-1 bg-[#34495E] rounded-md text-white'>
                            <Plus size="18px" />
                        </DialogTrigger>
                    </div>
                    <div className="flex items-center p-2 border-b w-full justify-between">
                        <div className="flex flex-col w-[180px] h-full">
                            <label htmlFor="search" className='sr-only'>Search</label>
                            <input type="text" id='search' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} placeholder="search" className='bg-slate-100 px-2 py-1  text-sm   rounded-md w-full' />
                        </div>
                        <Select onValueChange={(value) => setFilter(value as StatusType)}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className='z-20 cursor-pointer'>
                                <SelectGroup>
                                    <SelectItem value="all" className='cursor-pointer'>All</SelectItem>
                                    <SelectItem value="TODO" className='cursor-pointer'>TODO</SelectItem>
                                    <SelectItem value="DOING" className='cursor-pointer'>DOING</SelectItem>
                                    <SelectItem value="DONE" className='cursor-pointer'>DONE</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className='flex flex-col h-full min-h-screen bg-slate-200 overflow-hidden gap-[1px]'>
                    {isLoading ? <Spinner /> : isError ? <div>Error: {(error as any).message}</div> : renderTasks(tasks || [])}
                </div>
                <div className='p-2 flex justify-center items-center text-xs border-t'>
                    <Pagination
                        visiblePageNumbers={visiblePageNumbers}
                        currentPage={page}
                        setCurrentPage={setPage}
                        totalPages={totalPages}
                        isStatsLoading={isTaskStatsLoading}
                    />
                </div>
            </div>
            <DialogContent className="sm:max-w-[425px] p-0">
                <DialogHeader className='border-b bg-[#F4F7F7] rounded-t p-2 justify-center'>
                    <DialogTitle>New Task</DialogTitle>
                </DialogHeader>
                <NewTaskForm handleAddNewTask={handleAddNewTask} />
            </DialogContent>
        </Dialog>
    )
}

export default TaskListContainer