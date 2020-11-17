window.popupUIState = undefined;
var script = document.createElement('script');
script.src = chrome.extension.getURL('script.js');
(document.head || document.documentElement).appendChild(script);
script.onload = function(){
    console.log('script.js loaded and executed !');
    window.isScriptLoaded = true;
};
/*START chrome.runtime events/messages */
chrome.runtime.onConnect.addListener(function(port){ //listen to connector events/messages
    console.log("onConnect port = ", port);
    if(port.name == 'popup'){ 
        port.onDisconnect.addListener((port)=>{//popup disconnected ?
            console.log('port disconnect!', port);
            document.dispatchEvent(new Event("domPopupDisconnectEvent"));
        });
    }
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){//extension-specific events listeners
    let msgObj = JSON.parse(request);
    //console.log("msgObj: ", msgObj);
    if (window.isScriptLoaded)//prevent multiple 
    {
        switch(msgObj.message){
            case 'extCustomYoutubeStyle': document.dispatchEvent(new Event("domCustomYoutubeStyle"));
            break;
            
            case 'extSaveUIMessage': window.popupUIState = msgObj.popupUIState//savePopupUI(msgObj.data) //trigger domSaveUIEvent event in the shared DOM
            break;
            case 'extInitMessage': document.dispatchEvent(new Event ('domInitEvent')); //trigger domInitEvent event in the shared DOM
            //console.log('window.popupUIState = ', window.popupUIState);
            break;
            case 'extSelectFormMessage': 
            var selectedForm = msgObj.selectedForm;
            //console.log('selected Form: ', selectedForm);
            document.dispatchEvent(new CustomEvent ('domSelectFormEvent', {
                detail:{
                    selectedForm: request
                }
            })); //trigger domSelectFormEvent event in the shared DOM
            break;
            case 'extGetComponentsObjectMessage': document.dispatchEvent(new CustomEvent ('domGetComponentsObjectEvent',{
                detail:{
                    selectedForm: request
                }
            })); //trigger domGetComponentsObjectEvent event in the shared DOM
            //console.log('extGetComponentsObjectMessage extension event detected!');
            break;
            case 'extGetFormDataMessage': document.dispatchEvent(new CustomEvent ('domGetFormDataEvent',{
                detail:{
                    selectedForm: request
                }
            })); //trigger domGetFormDataEvent event in the shared DOM
            break;
            case 'extRunFunctionOnTraverseMessage': document.dispatchEvent(new CustomEvent ('domRunFunctionOnTraverseEvent', { //trigger domRunFunctionOnTraverseEvent event in the shared DOM
                detail:{
                    data: request
                }
            }));
            break;
            case 'extEmptyFormMessage': document.dispatchEvent(new CustomEvent('domEmptyFormEvent', {
                detail:{
                    data: request
                }
            })); //trigger domEmptyFormEvent event in the shared DOM
            break;
            case 'extRestoreOriginalFormMessage': document.dispatchEvent(new CustomEvent('domRestoreOriginalFormEvent',{
                detail:{
                    data: request
                }
            })); //trigger domRestoreOriginalFormEvent event in the shared DOM
            break;
            case 'extSetComponentsObjectMessage': document.dispatchEvent(new CustomEvent('domSetComponentsObjectEvent', { //trigger domSetComponentsObjectEvent event in the shared DOM
                detail:{
                    data: request
                }
            }));
            break;
            
            case 'extSetFormDataObjectMessage': document.dispatchEvent(new CustomEvent('domSetFormDataObjectEvent', { //trigger domSetFormDataObjectEvent event in the shared DOM
                detail:{
                    data: request
                }
            }));
            break;
        }
    }
});
/*END chrome.runtime events/messages */
////////////
/*START DOM events*/
document.addEventListener('domInitResponseEvent', function(event){
    //console.log("domInitResponseEvent event: ", event);
    if(event.detail.status == 'success'){
        let obj = JSON.stringify({popupUIState: window.popupUIState});
        let forms = event.detail.foundForms;
        chrome.runtime.sendMessage(JSON.stringify({message: 'extInitResponseMessage', status: 'success', data: obj, forms: forms}));
    }
    else if (event.detail.status == 'fail'){
        chrome.runtime.sendMessage(JSON.stringify({message: 'extInitResponseMessage', status: 'fail'}));
    }
});
document.addEventListener('domGetComponentsObjectResponseEvent', function(event){
    if(event.detail.status == 'success'){
        //console.log('event.detail.data = ', event.detail.data);
        chrome.runtime.sendMessage(JSON.stringify({message: 'extGetComponentsObjectResponseMessage', status: 'success', data: event.detail.data}));
    }
    else if (event.detail.status == 'fail'){
        chrome.runtime.sendMessage(JSON.stringify({message: 'extGetComponentsObjectResponseMessage', status: 'fail'}));
    }
});
document.addEventListener('domGetFormDataResponseEvent', function(event){
    if(event.detail.status == 'success'){
        //console.log('event.detail.data = ', event.detail.data);
        chrome.runtime.sendMessage(JSON.stringify({message: 'extGetFormDataResponseMessage', status: 'success', data: event.detail.data}));
    }
    else if (event.detail.status == 'fail'){
        chrome.runtime.sendMessage(JSON.stringify({message: 'extGetFormDataResponseMessage', status: 'fail'}));
    }
});
document.addEventListener('domEmptyFormResponseEvent', function(event){
    if(event.detail.status == 'success'){
        //console.log('event.detail.data = ', event.detail.data);
        chrome.runtime.sendMessage(JSON.stringify({message: 'extEmptyFormResponseMessage', status: 'success'}));
    }
    else if (event.detail.status == 'fail'){
        chrome.runtime.sendMessage(JSON.stringify({message: 'extEmptyFormResponseMessage', status: 'fail'}));
    }
});
document.addEventListener('domRestoreOriginalFormResponseEvent', function(event){
    if(event.detail.status == 'success'){
        //console.log('event.detail.data = ', event.detail.data);
        chrome.runtime.sendMessage(JSON.stringify({message: 'extRestoreOriginalFormResponseMessage', status: 'success'}));
    }
    else if (event.detail.status == 'fail'){
        chrome.runtime.sendMessage(JSON.stringify({message: 'extRestoreOriginalFormResponseMessage', status: 'fail'}));
    }
});
/*END DOM events*/