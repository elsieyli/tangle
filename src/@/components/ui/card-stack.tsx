/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export type Card = {
  id?: string
  name?: string
  content?: string
}

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[]
  offset?: number
  scaleFactor?: number
}) => {
  const CARD_OFFSET = offset || 10
  const SCALE_FACTOR = scaleFactor || 0.06
  console.log(items)
  const [cards, setCards] = useState<any>(items)

  useEffect(() => {
    setCards(items.slice(1, 4))
  }, [items])

  // Function to move to the next card
  const nextCard = () => {
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards]
      newArray.unshift(newArray.pop()!) // Move the last card to the front
      return newArray
    })
  }

  function capitalizeWords(sentence: string) {
    return sentence
      .split(" ") // Split the sentence into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" ") // Join the words back together
  }

  return (
    <div className="relative h-60 w-60 md:h-60 md:w-96">
      {console.log(cards)}
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.name}
            className="absolute bg-black h-60 w-60 md:h-60 md:w-96 rounded-3xl p-4 shadow-xl border border-neutral-200 shadow-black/[0.1] flex flex-col justify-between"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // Decrease scale for cards that are behind
              zIndex: cards.length - index, // Decrease z-index for the cards that are behind
            }}
          >
            <div className="font-normal text-neutral-300">
              {card.content.slice(0, 180)}
              {card.content.length > 180 && "..."}
            </div>
            <div>
              <p className="text-neutral-500 font-medium">
                <div className="flex justify-between">
                  <div className="text-3xl">
                    <Highlight>{capitalizeWords(card.name)}</Highlight>
                  </div>
                  <button
                    onClick={nextCard}
                    className="text-white px-4 py-2 rounded-full"
                  >
                    next
                  </button>
                </div>
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-purple-700 text-white px-1 py-0.5 rounded-xl ",
        className
      )}
    >
      {children}
    </span>
  )
}
