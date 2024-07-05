import { memo } from "react"
import Database from "../types/database";
import Table from "../types/table";

interface NavigationTreeProps {
  databases : Array<Database> | null;
  selectedDatabase : number;
  selectedDatabaseColumn : number;
  setSelectedDatabase : (n : number) => void;
  setDropDatabaseIndex : (n : number) => void;
  setAreYouSureDropDatabaseWindowEnabled : (e : boolean) => void;
  setCreateNewDatabaseWindowEnabled : (e : boolean) => void;
  setNewTableScreenEnabled : (e : boolean) => void;
  setSelectedDatabaseColumn : (n : number) => void;
  loadTableColumns : (i : number) => void;
  setNewColumnScreenEnabled : (e : boolean) => void;
}

const NavigationTree: React.FC<NavigationTreeProps> = ({ databases, selectedDatabase, setSelectedDatabase, setDropDatabaseIndex, setAreYouSureDropDatabaseWindowEnabled, setCreateNewDatabaseWindowEnabled, selectedDatabaseColumn, setNewTableScreenEnabled, setSelectedDatabaseColumn, loadTableColumns, setNewColumnScreenEnabled }) => {
  return (
    <div className="w-[15vw] h-full border-black border-2 absolute left-0 top-0 flex flex-col">
      {databases != null && databases.map((database: Database, index: number) => (
        <div key={index} className="flex flex-col w-full h-fit border-1 border-black">
          <div onClick={() => selectedDatabase == index ? setSelectedDatabase(-1) : setSelectedDatabase(index)} className={`flex items-center justify-between px-[4%] hover:bg-main-light duration-200 cursor-pointer ${selectedDatabase == index ? 'bg-main' : ''}`}>
            <div>{database["name"]}</div>
            <button onClick={() => {
              setDropDatabaseIndex(index);
              setAreYouSureDropDatabaseWindowEnabled(true);
            }}>drop</button>
          </div>
          <div className="flex flex-col">
            {database["tables"] != null && selectedDatabase == index && database["tables"].map((table: Table, tindex: number) => (
              <>
                <div onClick={() => { selectedDatabaseColumn == tindex ? setSelectedDatabaseColumn(-1) : setSelectedDatabaseColumn(tindex); loadTableColumns(tindex); }} key={tindex} className={`flex items-center px-[8%] hover:bg-main-light cursor-pointer ${selectedDatabaseColumn == tindex ? "bg-main" : ""}`}>{table["name"]}</div>
                <div className={`flex flex-col`}>
                  {selectedDatabaseColumn == tindex && columns != null && columns.map((column, cindex) => (
                    <div className="hover:bg-main-light cursor-pointer px-[12%] flex flex-row items-center justify-between" key={cindex}>
                      <div>{column.Name}</div>
                      <div>{column.Type}</div>
                    </div>
                  ))}
                  <div onClick={() => { setNewColumnScreenEnabled(true) }} className={`${selectedDatabaseColumn == tindex ? "" : "hidden"} hover:bg-main-light cursor-pointer px-[12%]`}>new column</div>
                </div>
              </>
            ))}
            <div onClick={() => setNewTableScreenEnabled(true)} className={`flex items-center px-[8%] hover:bg-main-light cursor-pointer ${selectedDatabase == index ? "" : "hidden"}`}>new table</div>
          </div>
        </div>
      ))}
      <div onClick={() => setCreateNewDatabaseWindowEnabled(true)} className="flex w-full h-fit border-1 border-black items-center px-[4%] cursor-pointer">
        create new database
      </div>
    </div>
  )
}

export default memo(NavigationTree);
