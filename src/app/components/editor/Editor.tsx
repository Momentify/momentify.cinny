/* eslint-disable no-param-reassign */
import React, {
  ClipboardEventHandler,
  KeyboardEventHandler,
  ReactNode,
  forwardRef,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react';
import { Box, Scroll, Text } from 'folds';
import { Descendant, Editor, createEditor } from 'slate';
import { debounce } from 'lodash';
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps,
  RenderPlaceholderProps,
} from 'slate-react';
import { withHistory } from 'slate-history';
import { BlockType } from './types';
import { RenderElement, RenderLeaf } from './Elements';
import { CustomElement } from './slate';
import * as css from './Editor.css';
import { toggleKeyboardShortcut } from './keyboard';

const initialValue: CustomElement[] = [
  {
    type: BlockType.Paragraph,
    children: [{ text: '' }],
  },
];

const withInline = (editor: Editor): Editor => {
  const { isInline } = editor;

  editor.isInline = (element) =>
    [BlockType.Mention, BlockType.Emoticon, BlockType.Link, BlockType.Command].includes(
      element.type
    ) || isInline(element);

  return editor;
};

const withVoid = (editor: Editor): Editor => {
  const { isVoid } = editor;

  editor.isVoid = (element) =>
    [BlockType.Mention, BlockType.Emoticon, BlockType.Command].includes(element.type) ||
    isVoid(element);

  return editor;
};

export const useEditor = (): Editor => {
  const [editor] = useState(() => withInline(withVoid(withReact(withHistory(createEditor())))));
  return editor;
};

export type EditorChangeHandler = (value: Descendant[]) => void;
type CustomEditorProps = {
  editableName?: string;
  top?: ReactNode;
  bottom?: ReactNode;
  before?: ReactNode;
  after?: ReactNode;
  maxHeight?: string;
  editor: Editor;
  placeholder?: string;
  onKeyDown?: KeyboardEventHandler;
  onKeyUp?: KeyboardEventHandler;
  onChange?: EditorChangeHandler;
  onPaste?: ClipboardEventHandler;
};
export const CustomEditor = forwardRef<HTMLDivElement, CustomEditorProps>(
  (
    {
      editableName,
      top,
      bottom,
      before,
      after,
      maxHeight = '50vh',
      editor,
      placeholder,
      onKeyDown,
      onKeyUp,
      onChange,
      onPaste,
    },
    ref
  ) => {
    const renderElement = useCallback(
      (props: RenderElementProps) => <RenderElement {...props} />,
      []
    );

    const renderLeaf = useCallback((props: RenderLeafProps) => <RenderLeaf {...props} />, []);

    const handleKeydown: KeyboardEventHandler = useCallback(
      (evt) => {
        onKeyDown?.(evt);
        const shortcutToggled = toggleKeyboardShortcut(editor, evt);
        if (shortcutToggled) evt.preventDefault();
      },
      [editor, onKeyDown]
    );

    const renderPlaceholder = useCallback(({ attributes, children }: RenderPlaceholderProps) => {
      // drop style attribute as we use our custom placeholder css.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { style, ...props } = attributes;
      return (
        <Text
          as="span"
          {...props}
          className={css.EditorPlaceholder}
          contentEditable={false}
          truncate
        >
          {children}
        </Text>
      );
    }, []);

    // fix from https://www.codemzy.com/blog/sticky-fixed-header-ios-keyboard-fix
    useLayoutEffect(() => {
      let fixPosition = 0; // the fix
      const toolbarWrap = document.querySelector('.header-wrap'); // the toolbar wrap
      const toolbar = document.querySelector('.header'); // the toolbar
      const editorTextArea = Array.from(document.getElementsByClassName(css.EditorTextarea))[0]; // the editor

      if (toolbarWrap && toolbar && editorTextArea) {
        // function to set the margin to show the toolbar if hidden
        const setMargin = () => {
          // if toolbar wrap is hidden
          const newPosition = toolbarWrap.getBoundingClientRect().top;
          if (newPosition < -1) {
            // add a margin to show the toolbar
            toolbar.classList.add('down'); // add class so toolbar can be animated
            fixPosition = Math.abs(newPosition); // this is new position we need to fix the toolbar in the display
            // if at the bottom of the page take a couple of pixels off due to gap
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
              fixPosition -= 2;
            }
            // set the margin to the new fixed position
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            toolbar.style['margin-top'] = `${fixPosition}px`;
          }
        };

        // use lodash debounce to stop flicker
        const debounceMargin = debounce(setMargin, 150);

        // function to run on scroll and blur
        const showToolbar = () => {
          // remove animation and put toolbar back in default position
          if (fixPosition > 0) {
            toolbar.classList.remove('down');
            fixPosition = 0;
            // setPos(0);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            toolbar.style['margin-top'] = 0;
          }
          // will check if toolbar needs to be fixed
          debounceMargin();
        };

        // add an event listener to scroll to check if
        // toolbar position has moved off the page
        window.addEventListener('scroll', showToolbar);
        // add an event listener to blur as iOS keyboard may have closed
        // and toolbar postition needs to be checked again
        editorTextArea.addEventListener('blur', showToolbar);
      }
    }, []);

    return (
      <div className={css.Editor} ref={ref}>
        <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
          {top}
          <Box alignItems="Start">
            {before && (
              <Box className={css.EditorOptions} alignItems="Center" gap="100" shrink="No">
                {before}
              </Box>
            )}
            <Scroll
              className={css.EditorTextareaScroll}
              variant="SurfaceVariant"
              style={{ maxHeight }}
              size="300"
              visibility="Hover"
              hideTrack
            >
              <Editable
                data-editable-name={editableName}
                className={css.EditorTextarea}
                placeholder={placeholder}
                renderPlaceholder={renderPlaceholder}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={handleKeydown}
                onKeyUp={onKeyUp}
                onPaste={onPaste}
              />
            </Scroll>
            {after && (
              <Box className={css.EditorOptions} alignItems="Center" gap="100" shrink="No">
                {after}
              </Box>
            )}
          </Box>
          {bottom}
        </Slate>
      </div>
    );
  }
);
