import { memo } from "react";
import { useState } from "react";
import NewTableData from "../types/new_table_data";
import NewTableColumn from "../types/new_table_column";

interface NewTableComponentProps {
  enabled: boolean;
  onCreateNewTable: (data: NewTableData) => void; 
}

const NewTableComponent : React.FC<NewTableComponentProps> = ({ enabled, onCreateNewTable }) => {
  const [newTableData, setNewTableData] = useState<NewTableData>({name: "", columns: []});

  const createNewTable = () => {
    onCreateNewTable(newTableData);
    setNewTableData({name: "", columns: []});
  }

  return (
    <div className={`${enabled ? "" : "hidden"} absolute left-[5vw] top-[7.5vh] w-[90vw] h-[85vh] z-20 rounded-md border-2 border-black bg-white flex flex-col items-center`}>
      <input value={newTableData.name} onChange={e => {
        const clone = { ...newTableData }
        clone.name = e.target.value
        setNewTableData(clone)
      }} className="w-[90%] h-[5vh] border-2 border-black rounded-md mt-[4vh] outline-none pl-[0.7%] placeholder-black focus:placeholder-main focus:border-main focus:text-main focus:font-bold" placeholder="Table Name" />
      {newTableData.columns != null && newTableData.columns.length >= 1 && newTableData.columns.map((col, index) => (
        <div key={index} className="flex flex-row w-[90%] h-[5vh] border-2 border-black rounded-md mt-[4vh] items-center justify-between">
          <input placeholder="name" value={col.name} onChange={e => {
            const clone = { ...newTableData }
            clone.columns[index].name = e.target.value
            setNewTableData(clone);
          }} className="w-[15%] h-[100%] rounded-md outline-none placeholder-black focus:text-main focus:font-bold focus:border-main focus:placeholder-main border-2 pl-[0.7%]" />
          <select value={col.type} onChange={e => {
            const clone = { ...newTableData }
            clone.columns[index].type = e.target.value
            setNewTableData(clone)
          }} name="type" className="w-[15%] h-[100%] rounded-md">
            <option value="bigint">bigint (int8)</option>
            <option value="bigserial">bigserial (serial8)</option>
            <option value="bit">bit</option>
            <option value="varbit">bit varying (varbit)</option>
            <option value="boolean">boolean (bool)</option>
            <option value="box">box</option>
            <option value="bytea">bytea</option>
            <option value="char">character (char)</option>
            <option value="varchar">character varying (varchar)</option>
            <option value="cidr">cidr</option>
            <option value="circle">circle</option>
            <option value="date">date</option>
            <option value="double precision">double precision (float8)</option>
            <option value="inet">inet</option>
            <option value="integer">integer (int, int4)</option>
            <option value="interval">interval</option>
            <option value="json">json</option>
            <option value="jsonb">jsonb</option>
            <option value="line">line</option>
            <option value="lseg">lseg</option>
            <option value="macaddr">macaddr</option>
            <option value="macaddr8">macaddr8</option>
            <option value="money">money</option>
            <option value="numeric">numeric (decimal)</option>
            <option value="path">path</option>
            <option value="pg_lsn">pg_lsn</option>
            <option value="pg_snapshot">pg_snapshot</option>
            <option value="point">point</option>
            <option value="polygon">polygon</option>
            <option value="real">real (float4)</option>
            <option value="smallint">smallint (int2)</option>
            <option value="smallserial">smallserial (serial2)</option>
            <option value="serial">serial (serial4)</option>
            <option value="text">text</option>
            <option value="time">time without time zone</option>
            <option value="timetz">time with time zone (timetz)</option>
            <option value="timestamp">timestamp without time zone</option>
            <option value="timestamptz">timestamp with time zone (timestamptz)</option>
            <option value="tsquery">tsquery</option>
            <option value="tsvector">tsvector</option>
            <option value="txid_snapshot">txid_snapshot</option>
            <option value="uuid">uuid</option>
            <option value="xml">xml</option>
          </select>
          <select value={col.key_type} onChange={e => {
            const clone = { ...newTableData }
            clone.columns[index].key_type = e.target.value
            setNewTableData(clone)
          }} name="key_type" className="w-[15%] h-[100%] rounded-md">
            <option value="none">None</option>
            <option value="primary">Primary Key</option>
            <option value="foreign">Foreign Key</option>
            <option value="unique">Unique Constraint</option>
          </select>
          <input value={col.default_value} onChange={e => {
            const clone = { ...newTableData }
            clone.columns[index].default_value = e.target.value
            setNewTableData(clone)
          }} placeholder="default value" className="w-[15%] h-[100%] rounded-md outline-none placeholder-black focus:text-main focus:font-bold focus:border-main focus:placeholder-main border-2 pl-[0.7%]" />
        </div>
      ))}
      <button className="w-[90%] h-[5vh] border-2 border-black rounded-md mt-[4vh] text-white font-bold bg-main-light hover:bg-main" onClick={() => {
        const clone = { ...newTableData }
        const newColumn: NewTableColumn = {
          name: "",
          type: "bigint",
          key_type: "none",
          default_value: "",
        };
        clone.columns.push(newColumn)
        setNewTableData(clone);
      }}>new column</button>
      <button onClick={() => createNewTable()} className="w-[90%] h-[5vh] rounded-md bg-main-light hover:bg-main text-white font-bold mt-auto mb-[2%]">Create New Table</button>
    </div>
  )
}

export default memo(NewTableComponent)
