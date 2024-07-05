import { memo } from "react";

interface InvisibleWindowCloserProps {
  enabled : boolean;
  closeWindows : () => void;
}

const InvisibleWindowCloser : React.FC<InvisibleWindowCloserProps> = ({ enabled, closeWindows }) => {
  return (
    <div className={`z-[5] w-full h-full absolute left-0 cursor-pointer top-0 ${enabled ? '' : 'hidden'}`} onClick={() => {
      closeWindows();
    }}></div>
  )
}

export default memo(InvisibleWindowCloser)
