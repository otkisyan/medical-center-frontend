import { useEffect, useRef } from "react";

function useAutosizeTextArea(textAreaRef: any, value: any) {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.height = "auto";
      textAreaRef.style.height = `${textAreaRef.scrollHeight}px`;
    }
  }, [textAreaRef, value]);
}

export default useAutosizeTextArea;
