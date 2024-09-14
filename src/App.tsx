import "./App.css";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const people = useQuery(api.people.get);
  return (
    <div className="App">
      {people?.map(({_id,  name, notes }) => <div key={_id}>{name} - {notes}</div>)}
    </div>
  );
}

export default App;
