import CustomForceGraph3D from "./components/3DForceGraph"
import { PlaceholdersAndVanishInput } from "./@/components/ui/placeholders-and-vanish-input"

const App = () => {
  const placeholders = [
    "Search yourself up!",
    "What kind of person do you want to meet?",
    "Find someone who's also working with AI!",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitted")
  }
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
        <CustomForceGraph3D />
      </div>
    </div>
  )
}

export default App
