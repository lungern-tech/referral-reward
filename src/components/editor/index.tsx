import React, { Ref, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import Quill, { EmitterSource, QuillOptions, Range } from 'quill';
import Delta from 'quill-delta';
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "./index.css";


// Editor is an uncontrolled React component

interface Props {
  className?: string
  style?: React.CSSProperties
  readOnly?: boolean
  defaultValue?: Delta
  options?: Partial<QuillOptions>
  onTextChange?: (delta: Delta, oldDelta: Delta, source: string) => void
  onSelectionChange?: (
    range: Range,
    oldRange: Range,
    emit: EmitterSource
  ) => void
}

// Editor is an uncontrolled React component
const Editor = forwardRef<Quill, Props>(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange, options }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      // @ts-ignore
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
        theme: 'snow',
        ...options
      });

      // @ts-ignore
      ref.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        // @ts-ignore
        ref.current = null;
        container.innerHTML = '';
      };
    }, [ref]);

    return <div ref={containerRef}></div>;
  },
);

Editor.displayName = 'Editor';

export default Editor;