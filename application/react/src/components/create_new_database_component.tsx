import { memo, useState } from "react"

interface CreateNewDatabaseComponentProps {
  enabled: boolean;
  createNewDatabase : (name : string) => void;
}

const CreateNewDatabaseComponent : React.FC<CreateNewDatabaseComponentProps> = ({ enabled, createNewDatabase }) => {
  const [newDatabaseName, setNewDatabaseName] = useState<string>("");

  return (
    <div className={`absolute w-[22.5vw] h-[30%] left-[38.75vw] top-[30%] z-10 rounded-lg bg-white shadow-lg shadow-secondary flex flex-col items-center justify-between py-[1%] ${enabled ? '' : 'hidden'}`}>
      <div className="font-bold text-xl">Create Database</div>
      <div className="flex flex-col">
        <input className="h-[4vh] border-2 rounded mb-[1.5vh] focus:placeholder-main focus:border-main outline-none px-2 focus:text-main" defaultValue={newDatabaseName} onChange={e => setNewDatabaseName(e.target.value)} placeholder="Database name" />
        <button className="px-[2vw] bg-main py-[0.8vh] rounded text-white font-bold hover:scale-[1.02] ease duration-150" onClick={() => {createNewDatabase(newDatabaseName); setNewDatabaseName("");}}>Create New Database</button>
      </div>
    </div>
  )
}

export default memo(CreateNewDatabaseComponent)
