import { upload } from '@/service/upload'
import Quill, { EmitterSource, QuillOptions, Range } from 'quill'
import Delta from 'quill-delta'
// import ImageUploader from "quill-image-uploader";
import QuillResizeImage from 'quill-resize-image'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react'
import './index.scss'
import ImageHandler from './toolbar/Image'
Quill.register('modules/resize', QuillResizeImage)
Quill.register('modules/imageUploader', ImageHandler)

interface Props {
  className?: string
  style?: React.CSSProperties
  readOnly?: boolean
  defaultValue?: Delta
  rawContent?: string
  options?: Partial<QuillOptions>
  onTextChange?: (latest: string) => void
  onSelectionChange?: (
    range: Range,
    oldRange: Range,
    emit: EmitterSource
  ) => void
}

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['link', 'image', 'video', 'formula'], // add's image support
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ['clean'], // remove formatting button
]

// Editor is an uncontrolled React component
const Editor = forwardRef<Quill, Props>(
  (
    {
      readOnly,
      defaultValue,
      onTextChange,
      onSelectionChange,
      options,
      className,
      rawContent,
    },
    ref
  ) => {
    const containerRef = useRef(null)
    const defaultValueRef = useRef(defaultValue)
    const rawContentRef = useRef(rawContent)
    const onTextChangeRef = useRef(onTextChange)
    const onSelectionChangeRef = useRef(onSelectionChange)
    const localRef = useRef<Quill>()

    useLayoutEffect(() => {
      onTextChangeRef.current = () => {
        let latest = localRef.current.getSemanticHTML()
        onTextChange(latest)
      }
      onSelectionChangeRef.current = onSelectionChange
    })

    useEffect(() => {
      localRef?.current?.enable(!readOnly)
    }, [localRef, readOnly])

    useEffect(() => {
      const container = containerRef.current
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div')
      )
      const quill = new Quill(editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
          imageUploader: {
            upload: (file) => {
              return upload(file, file.name).then((res) => {
                return res.filename
              })
            },
          },
          resize: {},
        },
        ...options,
      })
      localRef.current = quill
      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current)
      }
      if (rawContentRef.current) {
        const delta = quill.clipboard.convert({ html: rawContentRef.current })
        quill.setContents(delta)
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.('')
      })

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args)
      })

      return () => {
        container.innerHTML = ''
      }
      // }
    }, [])

    return (
      <div
        className={className}
        ref={containerRef}
      ></div>
    )
  }
)

Editor.displayName = 'Editor'

export default Editor
