import { useState } from 'react';

export const useIdx = (dflt, max) => {
  const [idx, setIdx] = useState(dflt);
  const nextIdx = () => setIdx(i => Math.min(i + 1, max - 1));
  const prevIdx = () => setIdx(i => Math.max(i - 1, 0));
  return [idx, setIdx, nextIdx, prevIdx];
};
