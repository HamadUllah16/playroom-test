'use client'
import React, { useEffect, useState } from 'react'

function CopyMarkdown({slugs}: {slugs: string[]}) {
    const [isCopied, setIsCopied] = useState(false);
    async function handleCopyMarkdown() {
        const pageContent = await fetch(`/docs/${slugs.join('/')}/llms.txt`);
        const content = await pageContent.text();
        navigator.clipboard.writeText(content);
        setIsCopied(true);
    }

    useEffect(() => {
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }, [isCopied])

    return (
        <button
            type='button'
            className='border rounded-md w-fit text-sm px-2 py-1 cursor-pointer'
            onClick={handleCopyMarkdown}
        >
            {isCopied ? 'Copied' : 'Copy Markdown'}
        </button>
    )
}

export default CopyMarkdown