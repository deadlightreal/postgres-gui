import { lazy, memo, useEffect, useState } from "react"
import axios from "axios"
import Database from "../types/database.tsx";
import Table from "../types/table.tsx";
import Config from "../config";
import Column from "../types/column.tsx";
import NewTableData from "../types/new_table_data.tsx";
import NewTableColumn from "../types/new_table_column.tsx";
const NewColumnComponent = lazy(() => import("../components/new_column_component.tsx"));
const NewTableComponent = lazy(() => import("../components/new_table_component.tsx"));

const Main = () => {
  const [databases, setDatabases] = useState<Array<Database> | null>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<number>(-1);
  const [query, setQuery] = useState<string>("");
  const [queryResults, setQueryResults] = useState<any | null>(null);
  const [createNewDatabaseWindowEnabled, setCreateNewDatabaseWindowEnabled] = useState<boolean>(false);
  const [newDatabaseName, setNewDatabaseName] = useState<string>("");
  const [areYouSureDropDatabaseWindowEnabled, setAreYouSureDropDatabaseWindowEnabled] = useState<boolean>(false);
  const [dropDatabaseIndex, setDropDatabaseIndex] = useState<number>(-1);
  const [selectedDatabaseColumn, setSelectedDatabaseColumn] = useState<number>(-1);
  const [columns, setColumns] = useState<Array<Column> | null>();
  const [newTableScreenEnabled, setNewTableScreenEnabled] = useState<boolean>(false);
  const [newColumnScreenEnabled, setNewColumnScreenEnabled] = useState<boolean>(false); 

  const loadDatabases = () => {
    axios({
      url: "http://localhost:8940/loadDatabases",
      method: "GET",
    }).then(response => {
      setDatabases(response.data["data"]);
      console.log(response.data["data"]);
    })
  }

  const executeSelect = () => {
    if(databases == null || selectedDatabase == -1) return;
    axios({
      url: `http://localhost:8940/executeSelect?query=${query}&database=${databases[selectedDatabase]["name"]}`,
      method: "GET",
    }).then(response => {
        setQueryResults(response.data);
    })
  }

  const executeQuery = () => {
    if(databases == null || selectedDatabase == -1) return;
    axios({
      url: "http://localhost:8940/executeQuery",
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      data: JSON.stringify({"database": databases[selectedDatabase]["name"], "query": query}),
    }).then(response => {
    })
  }

  const createNewTable = (data: NewTableData) => {
    if(databases == null) { return }
    axios({
      url: `${Config.url}/createNewTable`,
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify({"database": databases[selectedDatabase].name, "new_table_data": data}),
    })
  }

  const dropDatabase = (index : number) => {
    if(databases == null) return;
    axios({
      url: `${Config["url"]}/dropDatabase`,
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      data: JSON.stringify({"database": databases[index].name}),
    }).then(response => {
      if(response.status == 200) {
        const clone = [...databases];
        clone.splice(index, 1);
          setDatabases(clone);
      }
    })
  }

  const loadTableColumns = (index : number) => {
    if (databases == null) return

    const name = databases[selectedDatabase].tables[index].name;

    axios({
      url: `${Config.url}/loadColumns?table=${name}&database=${databases[selectedDatabase].name}`,
      method: "GET",
    }).then(response => {
      if(response.status == 200) {
        setColumns(response.data["data"]);  
      }
    })
  }

  const createNewColumn = (data : NewTableColumn) => {
    if(databases == null) return
    axios({
      url: `${Config.url}/createNewColumn`,
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      data: {"data": data, "database": databases[selectedDatabase].name, "table": databases[selectedDatabase].tables[selectedDatabaseColumn].name},
    }).then(response => {
      if(response.status == 200) {
        setNewColumnScreenEnabled(false);
        if(columns != null) {
          const clone = [...columns];
          const newCol : Column = {Type: data.type, Name: data.name};
          clone.push(newCol);
          setColumns(clone);
        } else {
          const newCol : Column = {Type: data.type, Name: data.name};
          const newColumns = [newCol];
          setColumns(newColumns);
        }
      }
    })
  }

  const createNewDatabase = () => {
    axios({
      url: "http://localhost:8940/createNewDatabase",
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      data: JSON.stringify({"name": newDatabaseName}),
    }).then(response => {
      if(response.status == 200) {
        setNewColumnScreenEnabled(false);
        let clone : Array<Database> = [];
        if(databases != null) {
          clone = [...databases];
        }
        const newDB : Database = {name: newDatabaseName, tables: []};
        clone.push(newDB);
        setNewDatabaseName("");
        setDatabases(clone);
        setCreateNewDatabaseWindowEnabled(false);
      }
    })
  }

  useEffect(() => {
    loadDatabases();
  }, [])

  return (
    <div className="w-full h-full absolute left-0 top-0">
      <NewColumnComponent enabled={newColumnScreenEnabled} onCreateNewColumn={data => createNewColumn(data)} />
      <NewTableComponent enabled={newTableScreenEnabled} onCreateNewTable={data => createNewTable(data)} />     
      <div className={`z-[5] w-full h-full absolute left-0 cursor-pointer top-0 ${createNewDatabaseWindowEnabled ? '' : 'hidden'}`} onClick={() => {
        setCreateNewDatabaseWindowEnabled(false);
      }}></div>
      <div className={`absolute w-[22.5vw] h-[30%] left-[38.75vw] top-[30%] z-10 rounded-lg bg-white shadow-lg shadow-secondary flex flex-col items-center justify-between py-[1%] ${createNewDatabaseWindowEnabled ? '' : 'hidden'}`}>
        <div className="font-bold text-xl">Create Database</div>
        <div className="flex flex-col">
          <input className="h-[4vh] border-2 rounded mb-[1.5vh] focus:placeholder-main focus:border-main outline-none px-2 focus:text-main" defaultValue={newDatabaseName} onChange={e => setNewDatabaseName(e.target.value)} placeholder="Database name"/>
          <button className="px-[2vw] bg-main py-[0.8vh] rounded text-white font-bold hover:scale-[1.02] ease duration-150" onClick={() => createNewDatabase()}>Create New Database</button>
        </div>
      </div>
      <div className={`absolute w-[22.5vw] h-[30%] left-[38.75vw] top-[30%] z-10 rounded-lg bg-white shadow-lg shadow-secondary flex flex-col items-center justify-between py-[1%] ${areYouSureDropDatabaseWindowEnabled ? '' : 'hidden'}`}>
        <div className="font-bold text-center">Are you sure you want to drop database {databases == null || dropDatabaseIndex == -1 ? "" : databases[dropDatabaseIndex].name}?</div>
        <div className="flex flex-row w-full h-[17.5%] items-center justify-center">
          <button onClick={() => {dropDatabase(dropDatabaseIndex); setDropDatabaseIndex(-1); setAreYouSureDropDatabaseWindowEnabled(false)}} className="w-[45%] h-full bg-red-300 mr-[1.5%] font-bold text-white hover:bg-red-400 duration-200 rounded">Yes</button>
          <button onClick={() => {setDropDatabaseIndex(-1); setAreYouSureDropDatabaseWindowEnabled(false);}} className="w-[45%] h-full bg-gray-200 ml-[1.5%] font-bold text-white hover:bg-gray-300 duration-200 rounded">No</button>
        </div>
      </div>
      <div className="w-[15vw] h-full border-black border-2 absolute left-0 top-0 flex flex-col">
        {databases != null && databases.map((database : Database, index : number) => (
          <div key={index} className="flex flex-col w-full h-fit border-1 border-black">
            <div onClick={() => selectedDatabase == index ? setSelectedDatabase(-1) : setSelectedDatabase(index)} className={`flex items-center justify-between px-[4%] hover:bg-main-light duration-200 cursor-pointer ${selectedDatabase == index ? 'bg-main' : ''}`}>
              <div>{database["name"]}</div>
              <button onClick={() => {
                setDropDatabaseIndex(index);
                setAreYouSureDropDatabaseWindowEnabled(true);
              }}>drop</button>
            </div>
            <div className="flex flex-col">
              {database["tables"] != null && selectedDatabase == index && database["tables"].map((table : Table ,tindex : number) => (
                <>
                  <div onClick={() => { selectedDatabaseColumn == tindex ? setSelectedDatabaseColumn(-1) : setSelectedDatabaseColumn(tindex); loadTableColumns(tindex); }} key={tindex} className={`flex items-center px-[8%] hover:bg-main-light cursor-pointer ${selectedDatabaseColumn == tindex ? "bg-main" : ""}`}>{table["name"]}</div>
                  <div className={`flex flex-col`}>
                    {selectedDatabaseColumn == tindex && columns != null && columns.map((column, cindex) => (
                      <div className="hover:bg-main-light cursor-pointer px-[12%] flex flex-row items-center justify-between" key={cindex}>
                        <div>{column.Name}</div>
                        <div>{column.Type}</div>
                      </div>
                    ))}
                    <div onClick={() => {setNewColumnScreenEnabled(true)}} className={`${selectedDatabaseColumn == tindex ? "" : "hidden"} hover:bg-main-light cursor-pointer px-[12%]`}>new column</div>
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
      <div className="w-[85vw] h-full absolute right-0 top-0 flex flex-col items-center justify-between py-[5%]">
        <textarea className="resize-none w-[60vw] h-[30vh] border-none outline outline-black outline-1" onChange={e => setQuery(e.target.value)} placeholder="Query"/>
        <div className="w-[60vw] h-[30vh] outline outline-black outline-1] flex flex-col overflow-x-auto">
          <div className="w-[60vw] h-[6vh] border border-black border-1 flex flex-row">
            {queryResults != null && queryResults["names"] != null && queryResults["names"].map((name : string, index : number) => (
              <div key={index} className="h-[6vh] min-w-[12vw] max-w-[12vw] p-0 border border-black border-1 px-[3%] font-bold flex items-center justify-center overflow-hidden whitespace-normal text-overflow-ellipsis">{name}</div>
            ))}
          </div>
          {queryResults != null && queryResults["data"] != null && queryResults["data"].map((row, rindex : number) => (
            <div className="w-[60vw] h-[6vh] border border-black border-1 flex flex-row" key={rindex}>
              {row.map((col, cindex : number) => (
                <div key={cindex} className="h-[6vh] min-w-[12vw] max-w-[12vw] p-0 border border-black border-1 px-[3%] font-bold flex items-center justify-center overflow-hidden whitespace-normal text-overflow-ellipsis text-[70%]">{col == null ? "null" : col.toString()}</div>
              ))}
            </div>
          ))}
        </div>
        <button className="bg-main-light hover:bg-main hover:scale-[1.01] duration-200 text-white font-bold px-[3.5vw] py-[1.2vh] rounded-md"
          onClick={() => {
          const trimmedString = query.trim();
          const words = trimmedString.split(/\s+/);

          if(words[0].toUpperCase() == "SELECT") {
            executeSelect();
          } else {
            executeQuery();
          }
        }}>Execute</button>
      </div>
    </div>
  )
}

export default memo(Main)
