var webForm;
var formioApi;
var formComponentsOriginal = [];
var formDataOriginal = [];
var windowId = Math.random().toString(10).substring(2);

window.getFormdata = function(componentKey){
    var result;
    var fct1 = function(obj,key){
        if(key === componentKey){
            result= obj[key];
        }
    }
    searchFormDataExtension(webForm.data, [fct1]);
    return result;
}

window.setFormdata = function(componentKey, newValue){
    var fct1 = function(obj,key){
        if(key === componentKey){
            console.log("obj = ", obj);
            console.log("key = ", key);
            console.log("obj[key] = ", obj[key]);
            obj[key] = newValue;
        }
    }
    let data = {};
    Object.keys(webForm.data).forEach((key)=>{data[key] = webForm.data[key]});
    searchFormDataExtension(data, [fct1]);
    webForm.setSubmission({data: data}).then(()=>{});
}

function isMatch(el, match){//cross plateform Element.matches() workaround
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, match);
}
//
function getDOMClosest(elem, selector){//DOM closest ancestor speified by a CSS selector
  for ( ; elem && elem !== document; elem = elem.parentNode ) {
    if ( isMatch(elem, selector) ) return elem;
  }
  return null;
}
  
/**
 * Traverse Formio's form components and apply on each one a set of user-defined functions
 * @param formComponents - Formio components array;
 * @param callbacksArray - Array of calback functions to execute consecutively
 * @param _COMPONENT - Reference angular component for this call
 */
function traverseFormioComponentsExtension(formComponents, callbacksArray, exit = false, usefulParam = undefined){
    if(!exit){
      for(var index = 0; index < formComponents.length; index++){
        //START traversing
        var element = formComponents[index];
        for(let i = (callbacksArray.length -1); i>=0; i--){ //execute provided callback functions according to their priorities
          callbacksArray[i](element, exit, usefulParam);
        }
        if(element.components){
            traverseFormioComponentsExtension(element.components, callbacksArray, usefulParam);
        }
        else if(element.columns){
            traverseFormioComponentsExtension(element.columns, callbacksArray, usefulParam);
        }
        if(element.rows && typeof(element.rows) == 'object' && element.rows.length !== undefined){ //element.rows is an array ?
          element.rows.forEach( (row)=>{traverseFormioComponentsExtension(row, callbacksArray, usefulParam)} )
        }
        //element['transversed'] = true; 
        //END traversing
      }
    }
}

/**
 * A Recursive Function to search for the submission data of any formio component by key or scan traverse the form data object to apply specific data.
 * @param {Object} formDataContentObject form data object used in every recursion phase
 * @param {Array} callbacksArray Array of callbacks to apply on every node of the formdata tree object
 */
function searchFormDataExtension(formDataContentObject, callbacksArray){
    /*console.log("key = ", key);
    console.log("formDataContentObject = ", formDataContentObject);
    console.log("formDataContentValuesArray = ", formDataContentValuesArray);
    console.log("obj = ", obj);
    console.log("--------------------------------");*/
    let formDataArrayValues = Object.values(formDataContentObject);
    let formDataArrayKeys = Object.keys(formDataContentObject);
    formDataArrayValues.forEach((element, index)=>{
        if(element === null || element === undefined){
            for(let i = (callbacksArray.length -1); i>=0; i--){ //execute provided callback functions according to their priorities
                callbacksArray[i](formDataContentObject, formDataArrayKeys[index]);
            }
        }
        else if(typeof(element) == 'object' && element.length === undefined){//object
            searchFormDataExtension( element, callbacksArray);
        }
        else if(typeof(element) == 'object' && element.length !== undefined){//Array
            element.forEach((element, index)=>{
                searchFormDataExtension( element, callbacksArray);
            });
        }
        else{
          for(let i = (callbacksArray.length -1); i>=0; i--){ //execute provided callback functions according to their priorities
            callbacksArray[i](formDataContentObject, formDataArrayKeys[index]);
          }
        }
    });
  }
function getSelectedForm(webForms, selectedForm){
    if(selectedForm !== undefined){ //valid seleted form ?
        var selectedWindowId = selectedForm.split("....")[0];
        var selectedFormid = selectedForm.split("....")[1];
        //console.log("selectedFormid = ",selectedFormid);$
        var formidsArr = Object.keys(webForms);
        for(var index = 0; index < formidsArr.length; index++){
            var currentFormId = formidsArr[index];
            if(windowId == selectedWindowId && currentFormId == selectedFormid){
                return (webForms[currentFormId]);
            }            
        }
    }
    return undefined;
}

function highlightSelectedForm(webForms, selectedForm){
    if(selectedForm !== undefined){//highlight the selected form
        var selectedWindowId = selectedForm.split("....")[0];
        var selectedFormid = selectedForm.split("....")[1];
        console.log("selectedFormid = ",selectedFormid);
        Object.keys(webForms).forEach((id)=>{
            if(windowId == selectedWindowId && id == selectedFormid){
                webForms[id].element.classList.add("ext-selected-form");
                webForms[id].element.scrollIntoView(true);

            }
            else{
                webForms[id].element.classList.remove("ext-selected-form");
            }
        });
    }
    else{//unhighlight all forms
        Object.keys(webForms).forEach((id)=>{
            webForms[id].element.classList.remove("ext-selected-form");
        });
    }
}

function initNewStyleSheet(){
    var newStyleSheet = document.querySelector("#ext-style-sheet");
    if(!newStyleSheet){
        newStyleSheet = document.createElement('style');
        newStyleSheet.setAttribute("id", "ext-style-sheet");
        document.head.appendChild(newStyleSheet);
        let currentSheet = newStyleSheet.sheet;
        currentSheet.insertRule(".ext-selected-form{box-shadow: 0 0 10px 5px red}");
    }
}
///////////


///////////////

document.addEventListener("domCustomYoutubeStyle", function(event){ //domCustomYoutubeStyle event's handler
//console.log("AA");
if(window.youtubeStyleSheet === undefined){
    //console.log("BB");
    window.youtubeStyleSheet = document.createElement("style");
    document.head.appendChild(window.youtubeStyleSheet);
    let styleSheet = youtubeStyleSheet.sheet;
    styleSheet.insertRule("img, iframe{opacity:0.05 !important;}", styleSheet.cssRules.length);
    styleSheet.insertRule("#logo,.ytp-ce-element{visibility:hidden !important;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".ytp-cued-thumbnail-overlay-image{visibility:hidden !important;}", styleSheet.cssRules.length);
}
});


document.addEventListener("domInitEvent", function(event){ //domInitEvent event's handler
    formioApi = window.Formio;
    console.log("inside domInitEvent event: ", event);
    if(formioApi){  //formio API is set ?
        console.log("A");
        initNewStyleSheet();
        var forms = formioApi.forms;
        if(forms !== undefined){
            var formIds = Object.keys(forms);
            var foundForms = formIds.map((id)=>{
                return ({"windowId": window.windowId, "formid": id});
            });
            if(!formComponentsOriginal.length && !formDataOriginal.length){
                for(var index = 0; index < formIds.length; index++){
                    var form = forms[formIds[index]];
                    if(form.id){ //formio's webfom is set ??
                        //save original form components objects
                        formComponentsOriginal.push({"formid": form.id, "components": JSON.stringify({components: form.component.components})});
                        //save original form data objects
                        formDataOriginal.push( {"formid": form.id, "data": JSON.stringify({data: form.data})} );
                    }
                }
            }
            document.dispatchEvent( new CustomEvent('domInitResponseEvent',{
                detail:{
                    status : 'success',
                    foundForms: JSON.stringify(foundForms)
                }
            }));
        }
    }
    else{
        //console.log("C");
        document.dispatchEvent( new CustomEvent('domInitResponseEvent',{
            detail:{
                status : 'fail'
            }
        })
        );
    }
});

document.addEventListener("domPopupDisconnectEvent", function(event){ //domSelectFormEvent event's handler
    if(formioApi){
        var webForms = formioApi.forms;
        highlightSelectedForm(webForms, undefined);
    }
    else{
        document.dispatchEvent( new CustomEvent('domPopupDisconnectResponseEvent',{
            detail:{
                status : 'fail: formioApi is undefined'
            }
        })
        );
    }
});

document.addEventListener("domSelectFormEvent", function(event){ //domSelectFormEvent event's handler
    if(formioApi){
        var webForms = formioApi.forms;
        var data = JSON.parse(event.detail.selectedForm);
        highlightSelectedForm(webForms, data.selectedForm);
    }
    else{
        document.dispatchEvent( new CustomEvent('domSelectFormResponseEvent',{
            detail:{
                status : 'fail'
            }
        })
        );
    }
});
//
document.addEventListener("domGetComponentsObjectEvent", function(event){ //domGetComponentsObjectEvent event's handler
    if(formioApi){
        var selectedForm = JSON.parse(event.detail.selectedForm).selectedForm;
        var webForm = getSelectedForm(formioApi.forms, selectedForm);
        if(webForm !== undefined){
            let componentsObj = JSON.stringify({components: webForm.component.components}, undefined, 4);
            document.dispatchEvent( new CustomEvent('domGetComponentsObjectResponseEvent',{
                detail:{
                    status : 'success',
                    data: componentsObj
                }
            })
            );
        }
    }
    else{
        document.dispatchEvent( new CustomEvent('domGetComponentsObjectResponseEvent',{
            detail:{
                status : 'fail'
            }
        })
        );
    }
});
//
document.addEventListener("domGetFormDataEvent", function(event){ //domGetFormDataEvent event's handler
    if(formioApi){
        var selectedForm = JSON.parse(event.detail.selectedForm).selectedForm;
        var webForm = getSelectedForm(formioApi.forms, selectedForm);
        if(webForm !== undefined){
            let formData = JSON.stringify(webForm.submission.data, undefined, 4);
            document.dispatchEvent( new CustomEvent('domGetFormDataResponseEvent',{
                detail:{
                    status : 'success',
                    data: formData
                }
            })
            );
        }
    }
    else{
        document.dispatchEvent( new CustomEvent('domGetFormDataResponseEvent',{
            detail:{
                status : 'fail'
            }
        })
        );
    }
});    
//
document.addEventListener("domRunFunctionOnTraverseEvent", function(event){ //domRunFunctionOnTraverseEvent event's handler
    if(formioApi){
        var eventData = JSON.parse(event.detail.data);
        var selectedForm = eventData.selectedForm;
        var webForm = getSelectedForm(formioApi.forms, selectedForm);
        if(webForm){
            //console.log(webForm, 'inside domRunFunctionOnTraverseEvent event!');
            //console.log('inside domRunFunctionOnTraverseEvent event info: ', event );
            let componentsArray = webForm.component.components;
            let callbacksArray = [];

            let testFunction = new Function('component',
            /*'var formdata = '+JSON.stringify(webForm.data)+ ";"+ */eventData.data);
            callbacksArray.push(testFunction);
            //console.log('webForm.data = ', webForm.data);
            traverseFormioComponentsExtension(componentsArray, callbacksArray);

            //console.log('componentsArray = ', componentsArray);
            webForm.setForm({components: componentsArray});
        }
    }
    else{
        document.dispatchEvent( new CustomEvent('domRunFunctionOnTraverseEvent',{
            detail:{
                status : 'fail'
            }
        })
        );
    }
});    
//
document.addEventListener("domEmptyFormEvent", function(event){ //domEmptyFormEvent event's handler
    if(formioApi){
        var eventData = JSON.parse(event.detail.data);
        var selectedForm = eventData.selectedForm;
        var webForm = getSelectedForm(formioApi.forms, selectedForm);
        if(webForm){
            let data = {};
            Object.keys(webForm.data).forEach((key)=>{data[key] = webForm.data[key]});
            var fct1 = (obj, key)=>{
                if(typeof(obj[key]) === 'boolean'){
                    console.log("obj[key] = ", obj[key]);
                    obj[key] = false;
                }
                else{
                    obj[key] = ""  ;
                }
		    }
            searchFormDataExtension(data, [fct1]);
            webForm.setSubmission({data: data}).then(()=>{});
            document.dispatchEvent( new CustomEvent('domEmptyFormResponseEvent',{
                detail:{
                    status : 'success'
                }
            })
            );
        }
        else{
            document.dispatchEvent( new CustomEvent('domEmptyFormResponseEvent',{
                detail:{
                    status : 'fail'
                }
            })
            );
        }
    }
    else{
        document.dispatchEvent( new CustomEvent('domEmptyFormResponseEvent',{
            detail:{
                status : 'fail'
            }
        })
        );
    }
}); 
//
document.addEventListener("domRestoreOriginalFormEvent", function(event){ //domRestoreOriginalFormEvent event's handler
    if(formioApi){
        var eventData = JSON.parse(event.detail.data);
        var selectedForm = eventData.selectedForm;
        var webForm = getSelectedForm(formioApi.forms, selectedForm);
        console.log('eventData = ', eventData);
        if(webForm !== undefined){
            if(formComponentsOriginal.length && formDataOriginal.length){
                var originalWebForm = undefined;
                var originalFormData = undefined;
                originalWebForm = formComponentsOriginal.find(function(form){
                    return (form.formid === webForm.id);
                });
                originalFormData = formDataOriginal.find(function(formdata){
                    return (formdata.formid === webForm.id);
                });

                if(originalWebForm !== undefined){
                    webForm.setForm(JSON.parse(originalWebForm.components));
                }
                if(originalFormData !== undefined){
                    webForm.setSubmission(JSON.parse(originalFormData.data));
                }

                console.log('webForm = ', webForm);
                console.log('originalWebForm = ', originalWebForm);
                console.log('originalFormData = ', originalFormData);
            }
            document.dispatchEvent( new CustomEvent('domRestoreOriginalFormResponseEvent',{
                detail:{
                    status : 'success'
                }
            })
            );
        }
        else{
            document.dispatchEvent( new CustomEvent('domRestoreOriginalFormResponseEvent',{
                detail:{
                    status : 'fail'
                }
            })
            );
        }
    }
    else{
        document.dispatchEvent( new CustomEvent('domRestoreOriginalFormResponseEvent',{
            detail:{
                status : 'fail'
            }
        })
        );
    }
}); 
//
document.addEventListener("domSetComponentsObjectEvent", function(event){ //domSetComponentsObjectEvent event's handler
    //console.log('domSetComponentsObjectEvent\'s event.detail = ',event.detail);
    if(event.detail.data){
        if(formioApi){
            var eventData = JSON.parse(event.detail.data);
            var selectedForm = eventData.selectedForm;
            var webForm = getSelectedForm(formioApi.forms, selectedForm);
            if(webForm !== undefined){
                webForm.setForm(JSON.parse(eventData.data));
                document.dispatchEvent( new CustomEvent('domSetComponentsObjectResponseEvent',{
                    detail:{
                        status : 'success'
                    }
                })
                );
            }
            else{
                document.dispatchEvent( new CustomEvent('domSetComponentsObjectResponseEvent',{
                    detail:{
                        status : 'fail'
                    }
                })
                );
            }
        }
        else{
            document.dispatchEvent( new CustomEvent('domSetComponentsObjectResponseEvent',{
                detail:{
                    status : 'fail'
                }
            })
            );
        }
    }
});
//
document.addEventListener("domSetFormDataObjectEvent", function(event){ //domSetFormDataObjectEvent event's handler
    //console.log('domSetFormDataObjectEvent\'s event.detail = ',event.detail);
    if(event.detail.data){
        if(formioApi){
            var eventData = JSON.parse(event.detail.data);
            var selectedForm = eventData.selectedForm;
            var webForm = getSelectedForm(formioApi.forms, selectedForm);
            if(webForm !== undefined){
                webForm.setSubmission({data: JSON.parse(eventData.data)});
                document.dispatchEvent( new CustomEvent('domSetFormDataObjectResponseEvent',{
                    detail:{
                        status : 'success'
                    }
                })
                );
                ///console.log("formioApi", formioApi);
                ///console.log("webForm", webForm);
                ///console.log("event.detail.data", event.detail.data);
            }
            else{
                document.dispatchEvent( new CustomEvent('domSetFormDataObjectResponseEvent',{
                    detail:{
                        status : 'fail'
                    }
                })
                );
                //console.log("B: domSetFormDataObjectResponseEvent");
            }
        }
        else{
            document.dispatchEvent( new CustomEvent('domSetFormDataObjectResponseEvent',{
                detail:{
                    status : 'fail'
                }
            })
            );
            //console.log("C: domSetFormDataObjectResponseEvent");
        }
    }
});