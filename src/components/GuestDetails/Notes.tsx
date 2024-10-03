import React, { useState } from 'react'

interface NotesProps {
  notes: Note[]
  onAddNote: (newNote: Omit<Note, 'id'>) => void
}

const Notes: React.FC<NotesProps> = ({ notes, onAddNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newNote.trim()) {
      onAddNote({ content: newNote.trim(), date: new Date().toISOString() })
      setNewNote('')
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Notes</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Add a new note..."
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark">
          Add Note
        </button>
      </form>
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-600 mb-2">{new Date(note.date).toLocaleString()}</p>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notes