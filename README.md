//Events guide
1) extInitMessage (popup.js  TO  contentScript.js)  ->  
domInitEvent (contentScript.js  TO  script.js)  ->  
domInitResponseEvent (script.js  TO  contentScript.js) ->  
extInitResponseMessage (contentScript.js  TO  popup.js )

2) extGetComponentsObjectMessage (popup.js  TO  contentScript.js)  ->  
domGetComponentsObjectEvent (contentScript.js  TO  script.js)  ->  
domGetComponentsObjectResponseEvent (script.js  TO  contentScript.js) ->  
extGetComponentsObjectResponseMessage (contentScript.js  TO  popup.js )

3) extGetFormDataMessage (popup.js  TO  contentScript.js)  ->  
domGetFormDataEvent (contentScript.js  TO  script.js)  ->  
domGetFormDataResponseEvent (script.js  TO  contentScript.js) ->  
extGetFormDataResponseMessage (contentScript.js  TO  popup.js )

4) extEmptyFormMessage (popup.js  TO  contentScript.js)  ->  
domEmptyFormEvent (contentScript.js  TO  script.js)  ->  
domEmptyFormResponseEvent (script.js  TO  contentScript.js) ->  
extEmptyFormResponseMessage (contentScript.js  TO  popup.js )

5) extRestoreOriginalFormMessage (popup.js  TO  contentScript.js)  ->  
domRestoreOriginalFormEvent (contentScript.js  TO  script.js)  ->  
domRestoreOriginalFormResponseEvent (script.js  TO  contentScript.js) ->  
extRestoreOriginalFormResponseMessage (contentScript.js  TO  popup.js )

6) extRunFunctionOnTraverseMessage (popup.js  TO  contentScript.js)  ->  
domGetComponentsObjectEvent (contentScript.js  TO  script.js)  ->  
domGetComponentsObjectResponseEvent (script.js  TO  contentScript.js) ->  
extGetComponentsObjectResponseMessage (contentScript.js  TO  popup.js )

7) extSetComponentsObjectMessage (popup.js  TO  contentScript.js)  ->  
domSetComponentsObjectEvent (contentScript.js  TO  script.js) 

8) extSetFormDataObjectMessage (popup.js  TO  contentScript.js)  ->  
domSetFormDataObjectEvent (contentScript.js  TO  script.js) 

9) extSaveUIMessage (popup.js  TO  contentScript.js) -> .
