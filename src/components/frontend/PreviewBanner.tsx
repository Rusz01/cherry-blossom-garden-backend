import React from 'react'

export const PreviewBanner: React.FC<{ path: string }> = ({ path }) => (
  <div className="preview-banner" role="status">
    <span>
      <strong>Preview mode</strong> — you are viewing unpublished draft content.
    </span>
    <a href={`/next/exit-preview?path=${encodeURIComponent(path)}`}>Exit preview</a>
  </div>
)
