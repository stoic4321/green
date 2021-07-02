import './item_picker.scss'
//----|||||||||||||||-------------------------------------------
const DefaultPickItem = ({pick,idx,item,i,bem,itemClz}) => {
  // console.log("ACTIVE", (idx === i ? 'active' : null))
  const btnText = (bem === 'lessons')  ?  i + 1  :  item?.text?.title
  const actClz = (idx === i) ? 'active' : null
  return (
    <button
      onClick={ ()=>pick(item, i) }
      className={`item-picker__button ${bem}__button ${actClz} ${itemClz}`}
    >
      {btnText}
    </button>
  )
}
//----|||||||||||||||-------------------------------------------
const DefaultPickList = ({label,idx,bem,children,listClz}) => (
  <div key={'item_picker_papa_' + label + idx} className={`d-flex flex-column ${bem} ${listClz}`}>
    <span className={`${bem}__label`}>
      <p className='m-0 text-uppercase'>
        <b>{label}</b>
      </p>
    </span>
    <div className={`d-flex flex-column ${bem}__list`}>
      {children}
    </div>
  </div>
)
//-----------||||||||||------------------------------------------------
export const ItemPicker = ({ label, idx, pick, list, CompItem=DefaultPickItem, CompList=DefaultPickList, listClz='', itemClz='' }) => {
  const bem = label.toLowerCase().replace(/[^\w\s\-_]/g,'')
  return (
    <CompList      {...{idx,pick, label,   bem, listClz, key:(bem+'_CompList')}}>
      {list.map((item, i) => (
        <CompItem  {...{idx,pick, item,i,  bem, itemClz, key:(bem+'_CompItem_'+i)}} />
      ))}
    </CompList>
  )
}

