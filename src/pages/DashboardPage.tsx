import CustomForceGraph3D from "../components/3DForceGraph"
import { PlaceholdersAndVanishInput } from "../@/components/ui/placeholders-and-vanish-input"
import { useConvex, useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useEffect, useState } from "react"
import { peopleToGraphData } from "../mappers/connectionToLink"
import { GraphData } from "../components/data"
import { Doc } from "../../convex/_generated/dataModel"

const DashboardPage = () => {
  const convex = useConvex()
  const [gData, setGData] = useState<GraphData>()
  const [highlightedNodeIds, setHighLightedNodes] = useState<string[]>()
  const people = useQuery(api.people.get)
  const addPeopleMutation = useMutation(api.people.insert)
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
        if(data.length == 0) {
          const relatedPeople = await convex.action(api.people.similarPeopleSearch, {
            searchQuery: name
          })
          setHighLightedNodes(relatedPeople.map(p => p._id))

          console.log(relatedPeople)
        }
      } catch (error) {
        console.error("Error fetching search results:", error)
      }
    } else {
      console.error("Name input is empty or invalid.")
    }
  }
  
  useEffect(() => {
    if (people)
      setGData(peopleToGraphData(people as Doc<"people">[]))
  }, [people])

  const [isFormVisible, setFormVisible] = useState(false);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const handleFormToggle = () => {
    setFormVisible(!isFormVisible);
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log('Name:', name);
    console.log('Notes:', notes);
    addPeopleMutation({name, notes})
    // After submission, you might want to reset the form and hide it
    setName('');
    setNotes('');
    setFormVisible(false);

    
  };

  return (
    <div className="w-screen h-screen bg-[#000012] text-white relative">
      {/* The input */}
      <div className="pt-6 pb-5 flex flex-row justify-between items-center z-20 relative">
        {/* Set opacity of this to 0, it's just a dummy to align the Search bar in the middle */}
        <div className="p-[3px] relative opacity-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
            To Align Search bar to middle
          </div>
        </div>
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
        <div>
          <button className="p-[3px] relative mr-10" onClick={handleFormToggle}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
              Add Someone You Met!
            </div>
          </button>
          {isFormVisible && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-30">
    <div className="bg-gradient-to-br from-[#2a003e] to-[#3a005c] p-6 rounded-lg shadow-lg relative">
      <h2 className="text-xl mb-4 text-white">Add a New Connection!</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Name:</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded bg-[#4b007d] text-white border-[#5e008e] focus:border-[#7a00b3]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Notes:</label>
          <textarea
            className="w-full px-3 py-2 border rounded bg-[#4b007d] text-white border-[#5e008e] focus:border-[#7a00b3]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="mr-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            onClick={handleFormToggle}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <CustomForceGraph3D graphData={gData ?? { nodes: [], links: [] }} highlightedNodeIds={highlightedNodeIds ?? []} />
      </div>
    </div>
  )
}

export default DashboardPage
