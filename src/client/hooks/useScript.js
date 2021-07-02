import { useEffect } from 'react';

export const useScript = (url, code, asc=true) => {
  useEffect(() => {
    const script = document.createElement('script')
    if(url)  script.src = url
    if(code) script.text = code
    script.async = asc
    script.defer = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [url,code])
};
