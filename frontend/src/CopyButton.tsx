import { useState } from "react";
import CheckIcon from "./assets/check.svg";
import CopyIcon from "./assets/copy.svg";

type CopyButtonPropsT = {
    text: string;
}

export const CopyButton = ({ text }: CopyButtonPropsT) => {

    const [copyIcon, setCopyIcon] = useState(CopyIcon)

    function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    }
    
    
    
  return (
    <div
        className="w-8 cursor-pointer rounded bg-slate-100 p-2 transition-colors duration-300 hover:bg-slate-300"
        onClick={() => {
            setCopyIcon(CheckIcon)
            setTimeout(() => {
                setCopyIcon(CopyIcon)
            }, 1000)

            copyToClipboard(text)
        }}
        >
        <img src={copyIcon} alt="" />
    </div>
  )
}
