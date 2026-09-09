'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { TextStyle, FontFamily } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { type Editor } from '@tiptap/react';
import './tiptap.css';

export interface TiptapEditorProps {
    /** Initial HTML content. */
    initialContent?: string;
    placeholder?: string;
    /** Called on every content change with the latest HTML. */
    onUpdate?: (html: string) => void;
    /** Called when the editor instance is ready — parent can read editor.getHTML() at save time. */
    onReady?: (editor: Editor) => void;
}

export function TiptapEditor({
    initialContent = '',
    placeholder = 'Start writing…',
    onUpdate,
    onReady,
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Headings up to H3
                heading: { levels: [1, 2, 3] },
                // Code block with default styling
                codeBlock: { languageClassPrefix: 'language-' },
            }),
            Placeholder.configure({ placeholder }),
            Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
            Image.configure({ inline: false, allowBase64: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight.configure({ multicolor: false }),
            TextStyle,
            FontFamily,
            Color,
            Underline,
        ],
        content: initialContent || undefined,
        editorProps: {
            attributes: {
                // aria
                role: 'textbox',
                'aria-multiline': 'true',
                'aria-label': 'Post body',
            },
        },
        onUpdate: ({ editor }) => {
            onUpdate?.(editor.getHTML());
        },
        onCreate: ({ editor }) => {
            onReady?.(editor as unknown as Editor);
        },
        immediatelyRender: false,
    });

    return (
        <EditorContent
            editor={editor}
            className="tiptap-editor-root"
        />
    );
}
