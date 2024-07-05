import { useState, memo } from 'react';

interface QueryComponentProps {
  executeQuery : (data: string) => void;
  executeSelect : (data: string) => void;
  queryResults : any | null;
}

const QueryComponent : React.FC<QueryComponentProps> = ({ executeQuery, executeSelect, queryResults }) => {
  const [query, setQuery] = useState<string>("");

  return (
    <div className="w-[85vw] h-full absolute right-0 top-0 flex flex-col items-center justify-between py-[5%]">
      <textarea className="resize-none w-[60vw] h-[30vh] border-none outline outline-black outline-1" onChange={e => setQuery(e.target.value)} placeholder="Query" />
      <div className="w-[60vw] h-[30vh] outline outline-black outline-1] flex flex-col overflow-x-auto">
        <div className="w-[60vw] h-[6vh] border border-black border-1 flex flex-row">
          {queryResults != null && queryResults["names"] != null && queryResults["names"].map((name: string, index: number) => (
            <div key={index} className="h-[6vh] min-w-[12vw] max-w-[12vw] p-0 border border-black border-1 px-[3%] font-bold flex items-center justify-center overflow-hidden whitespace-normal text-overflow-ellipsis">{name}</div>
          ))}
        </div>
        {queryResults != null && queryResults["data"] != null && queryResults["data"].map((row, rindex: number) => (
          <div className="w-[60vw] h-[6vh] border border-black border-1 flex flex-row" key={rindex}>
            {row.map((col, cindex: number) => (
              <div key={cindex} className="h-[6vh] min-w-[12vw] max-w-[12vw] p-0 border border-black border-1 px-[3%] font-bold flex items-center justify-center overflow-hidden whitespace-normal text-overflow-ellipsis text-[70%]">{col == null ? "null" : col.toString()}</div>
            ))}
          </div>
        ))}
      </div>
      <button className="bg-main-light hover:bg-main hover:scale-[1.01] duration-200 text-white font-bold px-[3.5vw] py-[1.2vh] rounded-md"
        onClick={() => {
          const trimmedString = query.trim();
          const words = trimmedString.split(/\s+/);

          if (words[0].toUpperCase() == "SELECT") {
            executeSelect(query);
          } else {
            executeQuery(query);
          }
        }}>Execute</button>
    </div>
  )
}

export default memo(QueryComponent)
