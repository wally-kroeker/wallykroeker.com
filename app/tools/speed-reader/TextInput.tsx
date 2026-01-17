import { useState } from 'react'

const SAMPLE_TEXT = `Speed reading is a collection of techniques which attempt to increase reading speed without an unacceptable reduction in comprehension or retention. RSVP (Rapid Serial Visual Presentation) is one of the most effective methods. It presents text one word at a time at a fixed location, eliminating the need for eye movement. The Optimal Recognition Point (ORP) is the specific character in a word that the eye naturally focuses on for fastest recognition. By aligning the ORP with a fixed focal point, reading speed can increase from typical 200-300 words per minute to 500-1000+ words per minute.`

interface TextInputProps {
  onTextSubmit: (text: string) => void
}

export function TextInput({ onTextSubmit }: TextInputProps) {
  const [inputText, setInputText] = useState('')

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0

  const handleLoad = () => {
    if (inputText.trim()) {
      onTextSubmit(inputText)
    }
  }

  const handleLoadSample = () => {
    setInputText(SAMPLE_TEXT)
    onTextSubmit(SAMPLE_TEXT)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-300">
        Paste your text here
      </label>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full h-64 md:h-[300px] p-4 bg-zinc-900 text-zinc-100
                   border border-zinc-800 rounded-lg resize-none
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                   placeholder:text-zinc-600 text-base"
        placeholder="Paste article, blog post, or any text you want to read faster..."
      />

      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-500">
          Words: {wordCount.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleLoad}
          disabled={!inputText.trim()}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700
                     disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed
                     rounded-lg transition-colors font-medium text-base"
        >
          Load Text
        </button>

        <button
          onClick={handleLoadSample}
          className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700
                     rounded-lg transition-colors text-base"
        >
          Load Sample
        </button>
      </div>
    </div>
  )
}
