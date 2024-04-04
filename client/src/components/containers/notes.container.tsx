import { NoteType } from '@/type'
import React from 'react'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import Spinner from '../ui/spinner'

type Props = {
    notes: NoteType[],
    isNotesLoading: boolean,
    isNotesError: boolean,
    noteError: any,
    handleDeleteNote: (id: string) => void
}

const NotesContainer = ({notes, isNotesLoading, noteError, handleDeleteNote, isNotesError}: Props) => {
    return (
        <div className='flex flex-col max-h-[100px] overflow-auto'>
            {notes && notes.length > 0 &&
                notes.map((note) => (
                    <div key={note.id} className='flex gap-2 p-2 w-full justify-between items-center border-b'>
                        <p className='text-md font-medium'>{note.content}</p>
                        <Button variant="ghost" className='p-1 h-8 w-8 text-red-500' onClick={() => handleDeleteNote(note.id)}>
                            <Trash size="16px" />
                        </Button>
                    </div>

                ))

            }
            {isNotesLoading ? <Spinner /> : null}
            {isNotesError ? <p>{(noteError as any).message}</p> : null}

        </div>)
}

export default NotesContainer