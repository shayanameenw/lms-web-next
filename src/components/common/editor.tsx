import type {ReactNode} from "react";
import {useMemo} from "react";
import {default as dynamic} from "next/dynamic"
import {cn} from "~/lib/utils";
import "react-quill/dist/quill.snow.css"

interface EditorProps {
  onChange: (value: string) => void
  value?: string
}

export function Editor({value, onChange}: Readonly<EditorProps>): ReactNode {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), {ssr: false}), [])

  return (
    <div className={cn("bg-background")}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
