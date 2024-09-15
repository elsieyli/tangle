import React from "react"
import { CardStack } from "../@/components/ui/card-stack"

interface ModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  suggestedPeople: any,
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

// We need id, name, and content

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, suggestedPeople }) => {

  if (!isOpen) return null



  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close the modal when clicking outside
    >
      <div
        className="relative bg-black p-6 rounded shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside
      >
        <CardStack items={suggestedPeople} />
      </div>
    </div>
  )
}

export default Modal
