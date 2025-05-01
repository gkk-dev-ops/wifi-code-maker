import { useState } from "react";
import CheckIcon from "./assets/check.svg";
import CopyIcon from "./assets/copy.svg";

type CopyButtonPropsT = {
    text: string;
}

export const CopyButton = ({ text }: CopyButtonPropsT) => {

    const [copyIcon, setCopyIcon] = useState(CopyIcon)
    
    const unsecuredCopyToClipboard = (text: string) => { const textArea = document.createElement("textarea"); textArea.value=text; document.body.appendChild(textArea); textArea.focus();textArea.select(); try{document.execCommand('copy')}catch(err){console.error('Unable to copy to clipboard',err)}document.body.removeChild(textArea)};

    /**
     * Copies the text passed as param to the system clipboard
     * Check if using HTTPS and navigator.clipboard is available
     * Then uses standard clipboard API, otherwise uses fallback
    */
    const copyToClipboard = (content: string) => {
      if (window.isSecureContext && navigator.clipboard) {
        navigator.clipboard.writeText(content);
      } else {
        unsecuredCopyToClipboard(content);
      }
    };

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
