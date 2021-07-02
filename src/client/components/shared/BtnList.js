export const BtnList = ({ list, prefix, emit, highlightMatch, clz }) => (
  <div>
    {list.filter(x => (x||'').startsWith(prefix)).map((item, i) => (
      <button
        className={'btn btn-outline-info btn-sm '+((highlightMatch==item)?'glowing':'') + ' ' + (clz||'')}
        onClick={() => emit.ev(item)}
        key={'waited_' + i}
      >
        {(item.includes('3d') ? ' ❒ ' : '') + item}
      </button>
    ))}
  </div>
);
