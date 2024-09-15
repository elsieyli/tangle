import CustomForceGraph3D from "../components/3DForceGraph"
import { PlaceholdersAndVanishInput } from "../@/components/ui/placeholders-and-vanish-input"
import { useConvex, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import {useEffect, useState } from "react"
import { peopleToGraphData } from "../mappers/connectionToLink"
import { GraphData } from "../components/data"
import { Doc } from "../../convex/_generated/dataModel"

const DashboardPage = () => {
  const convex = useConvex()
  const [gData, setGData] = useState<GraphData>()
  const people = useQuery(api.people.get)
  const placeholders = [
    "Search yourself up!",
    "What kind of person do you want to meet?",
    "Find someone who's also working with AI!",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e)
    e.preventDefault() // Prevent form from submitting and reloading the page
    const formData = new FormData(e.currentTarget)
    const name = (formData.get("name") as string).toLowerCase()// Get the name from form data

    // Ensure that name is a valid string (default to an empty string if null)
    if (name) {
        console.log("PLEASEEE", name)
      try {
        
        const data = await convex.query(api.people.searchByName, { name })
        console.log("Search results:", data)
      } catch (error) {
        console.error("Error fetching search results:", error)
      }
    } else {
      console.error("Name input is empty or invalid.")
    }
  }
  useEffect(() => {
    if(people)
      setGData(peopleToGraphData(people as Doc<"people">[]))
  }, [people])
  return (
    <div className="w-screen h-screen bg-[#000012] text-white">
      {/* The input */}
      <div className="pt-6 pb-5 flex flex-row justify-between items-center">
        {/* Set opacity of this to 0, it's just a dummy to align the Search bar in the middle */}
        <div className="p-[3px] relative opacity-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            To Align Search bar to middle
          </div>
        </div>
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
        <button className="p-[3px] relative mr-10">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            Add Yourself!
          </div>
        </button>
      </div>
      <div>
        <CustomForceGraph3D graphData={gData?? {nodes: [], links: []}} />
      </div>
    </div>
  )
}

export default DashboardPage
