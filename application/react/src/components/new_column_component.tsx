import { memo, useState } from "react"
import NewTableColumn from "../types/new_table_column"

interface NewColumnComponentProps {
  onCreateNewColumn: (data: NewTableColumn) => void;
  enabled: boolean;
}

const NewColumnComponent: React.FC<NewColumnComponentProps> = ({ onCreateNewColumn, enabled }) => {

  const [newColumnData, setNewColumnData] = useState<NewTableColumn>({ name: "", type: "bigint", key_type: "none", default_value: "" });

  const onButtonClick = () => {
    onCreateNewColumn(newColumnData);
  }

  return (
    <div className={`${enabled ? "" : "hidden"} absolute w-[80vw] h-[40vh] left-[10vw] top-[30vh] border-2 border-black rounded-md flex flex-col items-center justify-between z-50 bg-white py-[1%]`}>
      <div className="flex flex-row">
        <input placeholder="name" value={newColumnData.name} onChange={e => {
          const clone = { ...newColumnData }
          clone.name = e.target.value
          setNewColumnData(clone);
        }} className="w-[15%] h-[100%] rounded-md outline-none placeholder-black focus:text-main focus:font-bold focus:border-main focus:placeholder-main border-2 pl-[0.7%]" />
        <select value={newColumnData.type} onChange={e => {
          const clone = { ...newColumnData }
          clone.type = e.target.value
          setNewColumnData(clone)
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
        <select value={newColumnData.key_type} onChange={e => {
          const clone = { ...newColumnData }
          clone.key_type = e.target.value
          setNewColumnData(clone)
        }} name="key_type" className="w-[15%] h-[100%] rounded-md">
          <option value="none">None</option>
          <option value="primary">Primary Key</option>
          <option value="foreign">Foreign Key</option>
          <option value="unique">Unique Constraint</option>
        </select>
        <input value={newColumnData.default_value} onChange={e => {
          const clone = { ...newColumnData }
          clone.default_value = e.target.value
          setNewColumnData(clone)
        }} placeholder="default value" className="w-[15%] h-[100%] rounded-md outline-none placeholder-black focus:text-main focus:font-bold focus:border-main focus:placeholder-main border-2 pl-[0.7%]" />
      </div>
      <button onClick={onButtonClick} className="bg-main-light rounded-md hover:bg-main text-white font-bold px-[3%] py-[1%]">Create Column</button>
    </div>
  )
}

export default memo(NewColumnComponent)
