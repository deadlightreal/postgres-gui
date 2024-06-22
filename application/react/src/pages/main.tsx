import { memo, useEffect, useState } from "react"
import axios from "axios"

const Main = () => {
  const [databases, setDatabases] = useState<Array<Map<string, any>> | null>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<number>(-1);
  const [query, setQuery] = useState<string>("");
  const [queryResults, setQueryResults] = useState<any | null>(null);

  const loadDatabases = () => {
    axios({
      url: "http://localhost:8940/loadDatabases",
      method: "GET",
    }).then(response => {
      setDatabases(response.data["data"]);
    })
  }

  const executeSelect = () => {
    axios({
      url: `http://localhost:8940/executeSelect?query=${query}&database=${databases[selectedDatabase]["name"]}`,
      method: "GET",
    }).then(response => {
        setQueryResults(response.data);
    })
  }

  const executeQuery = () => {
    axios({
      url: "http://localhost:8940/executeQuery",
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      data: JSON.stringify({"database": databases[selectedDatabase]["name"], "query": query}),
    }).then(response => {
    })
  }

  useEffect(() => {
    loadDatabases();
  }, [])

  return (
    <div className="w-full h-full absolute left-0 top-0">
      <div className="w-[15vw] h-full border-black border-2 absolute left-0 top-0 flex flex-col">
        {databases != null && databases.map((database : Map<String, any>, index : number) => (
          <div onClick={() => setSelectedDatabase(index)} key={index} className="flex flex-col w-full h-fit border-1 border-black">
            <div className={`flex items-center px-[4%] cursor-pointer ${selectedDatabase == index ? 'bg-red-200' : ''}`}>{database["name"]}</div>
            <div className="flex flex-col">
              {database["tables"] != null && selectedDatabase == index && database["tables"].map((table : Map<String, any>, tindex : number) => (
                <div key={tindex} className="flex items-center px-[8%]">{table["name"]}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="w-[85vw] h-full absolute right-0 top-0 flex flex-col items-center justify-between py-[5%]">
        <textarea className="resize-none w-[60vw] h-[30vh] border-none outline outline-black outline-1" onChange={e => setQuery(e.target.value)} placeholder="Query"/>
        <div className="w-[60vw] h-[30vh] outline outline-black outline-1] flex flex-col overflow-x-auto">
          <div className="w-[60vw] h-[6vh] border border-black border-1 flex flex-row">
            {queryResults != null && queryResults["names"] != null && queryResults["names"].map((name, index) => (
              <div key={index} className="h-[6vh] min-w-[12vw] max-w-[12vw] p-0 border border-black border-1 px-[3%] font-bold flex items-center justify-center overflow-hidden whitespace-normal text-overflow-ellipsis">{name}</div>
            ))}
          </div>
          {queryResults != null && queryResults["data"] != null && queryResults["data"].map((row, rindex) => (
            <div className="w-[60vw] h-[6vh] border border-black border-1 flex flex-row" key={rindex}>
              {row.map((col, cindex) => (
                <div key={cindex} className="h-[6vh] min-w-[12vw] max-w-[12vw] p-0 border border-black border-1 px-[3%] font-bold flex items-center justify-center overflow-hidden whitespace-normal text-overflow-ellipsis text-[70%]">{col == null ? "" : col.toString()}</div>
              ))}
            </div>
          ))}
        </div>
        <button onClick={() => {
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
