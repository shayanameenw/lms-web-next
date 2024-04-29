import type {ReactNode} from "react";
import {useMemo} from "react";
import {default as dynamic} from "next/dynamic"
import "react-quill/dist/quill.bubble.css"

interface PreviewProps {
  value?: string
}

export function Preview({value}: Readonly<PreviewProps>): ReactNode {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), {ssr: false}), [])

  return (
    <ReactQuill
      theme="bubble"
      value={value}
      readOnly
    />
  )
}
