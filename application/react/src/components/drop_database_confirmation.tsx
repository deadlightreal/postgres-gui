import { memo } from "react";

interface DropDatabaseConfirmationProps {
  enabled : boolean
  databaseName : string
  onYes : () => void;
  onNo : () => void;
}

const DropDatabaseConfirmation : React.FC<DropDatabaseConfirmationProps> = ({ enabled, databaseName, onYes, onNo }) => {
  return (
    <div className={`absolute w-[22.5vw] h-[30%] left-[38.75vw] top-[30%] z-10 rounded-lg bg-white shadow-lg shadow-secondary flex flex-col items-center justify-between py-[1%] ${enabled ? '' : 'hidden'}`}>
      <div className="font-bold text-center">Are you sure you want to drop database {databaseName}?</div>
      <div className="flex flex-row w-full h-[17.5%] items-center justify-center">
        <button onClick={() => onYes()} className="w-[45%] h-full bg-red-300 mr-[1.5%] font-bold text-white hover:bg-red-400 duration-200 rounded">Yes</button>
        <button onClick={() => onNo()} className="w-[45%] h-full bg-gray-200 ml-[1.5%] font-bold text-white hover:bg-gray-300 duration-200 rounded">No</button>
      </div>
    </div>
  )
}

export default memo(DropDatabaseConfirmation);
