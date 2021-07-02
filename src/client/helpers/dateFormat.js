function padZeroByLen(str){
  return ('00'+ str).substr((''+ str).length)
}
export function dateFormat(date=(new Date()), format='yyyy-MM-dd_hh-mm-ss_Z') {
  const locStr = date.toLocaleString('en-us',{timeZoneName:'short', hour12:true})
  // console.log({locStr})
  var replacers = {
    "M+" : date.getMonth()+1,
    "d+" : date.getDate(),
    "h+" : date.getHours(),
    "m+" : date.getMinutes(),
    "s+" : date.getSeconds(),
    "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
    "S" : date.getMilliseconds(),
    "Z" : locStr.slice(-3),
  }
  // Year as yyyy or yy
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear()+"").substr(4 - RegExp.$1.length)
    )
  }
  for(var k in replacers) {
    if (new RegExp("("+ k +")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length==1 ? replacers[k] : padZeroByLen(replacers[k])
      )
    }
  }
  return format;
}