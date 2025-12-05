import React from 'react';

type TProps = {
  text: string;
  query: string;
};

export function HighlightText({ text, query }: TProps) {
  if (!query) return <>{text}</>;

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className="text-base font-normal text-night-sky inline">
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <b key={i} className="font-bold inline">
            {part}
          </b>
        ) : (
          <span key={i} className="inline">
            {part}
          </span>
        )
      )}
    </span>
  );
}
