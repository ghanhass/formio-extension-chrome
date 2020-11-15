var selectedForm;
function alertMsg(alertsSpan, msg){
    alertsSpan.textContent = msg;
    window.setTimeout(function(){
        alertsSpan.textContent='';
    }, 2000);
}

function restoreUI(popupUIState){
    if(popupUIState){
        let obj = JSON.parse(popupUIState);
        //console.log('obj = ', obj);
        let formioFormsList = document.querySelector('#formio-forms-list');
        let actionsMenuSelect = document.querySelector('#actionsMenuSelect');
        var formioFormsListOptions = formioFormsList.children;
        for(let index = 0; index < formioFormsListOptions.length; index++){
            if(formioFormsListOptions[index].value == obj.selectedForm){
                actionsMenuSelect.value = obj.selectedItem;
                formioFormsList.value = obj.selectedForm;
                selectedForm = formioFormsList.value;
                let shownActionsMenuItem = document.querySelector(obj.shownActionsMenuItem);
                let shownPreElement = document.querySelector(obj.shownPreElement);
                if(shownActionsMenuItem){
                    shownActionsMenuItem.classList.add('actionsMenuItemSelected');
                }
                if(shownPreElement){
                    shownPreElement.textContent = obj.preElementText;
                }
                break;
            }
        }
        actionsMenuSelect.disabled = (formioFormsList.value.length > 0) ? false:true;
    }
}

function saveUI(){
    let formioFormsList = document.querySelector('#formio-forms-list');
    let actionsMenuSelect = document.querySelector('#actionsMenuSelect');
    let selectedItem = document.querySelector('.actionsMenuItem.actionsMenuItemSelected');
    //if (actionsMenuSelect.value){
    if(selectedItem){
        selectedItem.classList.remove('actionsMenuItemSelected');
    }
    selectedItem = document.querySelector('.actionsMenuItem[data-actionid="' + actionsMenuSelect.value + '"]');
    if(selectedItem){
        selectedItem.classList.add('actionsMenuItemSelected');
    }
    let shownActionsMenuItem = '.actionsMenuItem[data-actionid="' + actionsMenuSelect.value + '"]';
    let shownPreElement = 'pre[data-actionid="' + actionsMenuSelect.value + '"] ';
    let preElement = document.querySelector(shownPreElement);
    let preElementText = preElement ? preElement.textContent : ""
    chrome.tabs.query({active: true, currentWindow: true}, function(arrTabs){
        let activeTab = arrTabs[0];
        let obj = {
            'selectedForm': formioFormsList.value,
            'selectedItem': actionsMenuSelect.value,
            'shownActionsMenuItem': shownActionsMenuItem,
            'shownPreElement': shownPreElement,
            "preElementText": preElementText
        };
        chrome.tabs.sendMessage(activeTab.id, JSON.stringify({message: 'extSaveUIMessage', popupUIState: JSON.stringify(obj)}
        ));
        //console.log('extSaveUIMessage sent for tab: ', activeTab.id);
        //console.log(obj);
    });
    //}
}

document.addEventListener('DOMContentLoaded', function(){
    document.querySelector("#custom-youtube").addEventListener("click", (event)=>{
        chrome.tabs.query({active: true, currentWindow: true}, function(arrTabs){
            let activeTab = arrTabs[0];
            chrome.tabs.sendMessage(activeTab.id, JSON.stringify({message: 'extCustomYoutubeStyle'}));
            //console.log('init message sent for tab: ', activeTab.id);
        });
    });
    //console.log("inside DOMContentLoaded event!");
    var isFormFoundAtAll = false;
    chrome.tabs.query({active: true, currentWindow: true}, function(arrTabs){
        let activeTab = arrTabs[0];
        chrome.tabs.sendMessage(activeTab.id, JSON.stringify({message: 'extInitMessage'}));
        var port = chrome.tabs.connect(activeTab.id, {name: "popup"}); // initiate connector named "popup"
        //console.log('init message sent for tab: ', activeTab.id);
    });

    //console.log('DOMContentLoaded!');
    var alertsSpan = document.querySelector('#alerts');
    var formioDetectionStatus = document.querySelector('#formioDetectionStatus');
    var actionsMenuSelect = document.querySelector('#actionsMenuSelect');
    var formioFormsList = document.querySelector('#formio-forms-list');
    formioFormsList.innerHTML = '<option value="">--Select a form--</option>';

    var btnGetComponentsObject = document.querySelector('#btnGetComponentsObject');
    var copyComponentsObject = document.querySelector('#copyComponentsObject');
    var componentsObjectTextarea =  document.querySelector("textarea[data-actionid='1']");
    var componentsObjectPre =  document.querySelector("pre[data-actionid='1']");

    var btnGetFormData = document.querySelector('#btnGetFormData');
    var btnCopyFormData = document.querySelector('#btnCopyFormData');
    var formDataTextarea =  document.querySelector("textarea[data-actionid='4']");
    var formDataPre =  document.querySelector("pre[data-actionid='4']");

    var btnExecuteFunction = document.querySelector('#btnExecuteFunction');
    var functionOnTraversePre =  document.querySelector("pre[data-actionid='3']");

    var btnExecuteFormioFunction = document.querySelector('#btnExecuteFormioFunction');
    var btnRestoreOriginalForm = document.querySelector('#btnRestoreOriginalForm');
    var btnEmptyForm = document.querySelector('#btnEmptyForm');

    var setComponentsObjectBtn = document.querySelector('#setComponentsObjectBtn');
    var setComponentsObjectPre =  document.querySelector("pre[data-actionid='1']");

    var setFormDataBtn = document.querySelector('#setFormDataBtn');
    var setFormDataPre =  document.querySelector("pre[data-actionid='4']");



    //START listening for extension events
    chrome.runtime.onMessage.addListener(function(request, sender, response){
        let msgObj = JSON.parse(request);
        if (msgObj.message == 'extSaveUIResponseMessage'){//extSaveUIResponseMessage extension message from contentscript
            //console.log('extSaveUIResponseMessage: ', msgObj);
        }

        else  if (msgObj.message == 'extInitResponseMessage'){//extInitResponseMessage extension message from contentscript
            //console.log('extInitResponseMessage: ', msgObj);
            if(msgObj.status == 'success'){
                isFormFoundAtAll = true;
                formioDetectionStatus.classList.remove('formioNotFound');
                formioDetectionStatus.classList.add('formioFound');
                
                //actionsMenuSelect.disabled = (msgObj.forms.length > 0) ? false:true;
                actionsMenuSelect.querySelector("option[value='']").textContent = '--Select an action--';

                formioFormsList.disabled = (msgObj.forms.length > 0) ? false:true;
                

                let data = JSON.parse(msgObj.data);
                let forms = JSON.parse(msgObj.forms);
                
                forms.forEach((el)=>{
                    formioFormsList.innerHTML += "<option value='"+el.windowId+"...."+el.formid+"'>"+el.formid+"</option>";
                });

                if(data.popupUIState){
                    restoreUI(data.popupUIState);
                    //console.log("data.popupUIState = ", data.popupUIState)
                }
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, JSON.stringify({message: 'extSelectFormMessage', selectedForm: formioFormsList.value}));
                });
                  
            }
            else if(msgObj.status == 'fail' && !isFormFoundAtAll){//nothing at all? lolz
                formioDetectionStatus.classList.add('formioNotFound');
                formioDetectionStatus.classList.remove('formioFound');
                formioFormsList.disabled = true;
                formioFormsList.innerHTML = '<option value="">--No formio found--</option>';

                actionsMenuSelect.value = ''
                actionsMenuSelect.disabled = true;
                actionsMenuSelect.querySelector("option[value='']").textContent = 'No formio found';
            }
        }  
        else if (msgObj.message == 'extGetComponentsObjectResponseMessage'){//extGetComponentsObjectResponseMessage extension message from contentscript
            if(msgObj.status == 'success'){
                if(msgObj.data){
                    componentsObjectPre.textContent = msgObj.data;
                    saveUI();
                }
            }
            else if(msgObj.status == 'fail'){//nothing? lolz
            }
        }  
        else if (msgObj.message == 'extGetFormDataResponseMessage'){//extGetFormDataResponseMessage extension message from contentscript
            if(msgObj.status == 'success'){
                if(msgObj.data){
                    document.querySelector("pre[contenteditable='true'][data-actionid='4']").textContent = msgObj.data;
                    saveUI();
                }
            }
            else if(msgObj.status == 'fail'){//nothing? lolz
            }
        } 
        else if (msgObj.message == 'extEmptyFormResponseMessage'){//extEmptyFormResponseMessage extension message from contentscript
            if(msgObj.status == 'success'){
                if(msgObj.data){
                    alertMsg(alertsSpan, 'Form emptied!');
                }
            }
            else if(msgObj.status == 'fail'){//nothing? lolz
            }
        }
        else if (msgObj.message == 'extRestoreOriginalFormResponseMessage'){//extRestoreOriginalFormResponseMessage extension message from contentscript
            if(msgObj.status == 'success'){
                if(msgObj.data){
                    alertMsg(alertsSpan, 'Form restored!');
                }
            }
            else if(msgObj.status == 'fail'){//nothing? lolz
            }
        }
    });
    //END listening for extension events

    //START listening for DOM events
    Array.from(document.querySelectorAll("pre[data-actionid]")).forEach((element)=>{
        element.addEventListener("keyup", saveUI);
    });
    ////
    formioFormsList.addEventListener('change', function(event){
        var selectedItems = document.querySelectorAll('.actionsMenuItem');
        selectedForm = event.target.value;
        if(event.target.value !== ""){//a form is selected
            actionsMenuSelect.disabled = false;
            for(var index = 0; index < selectedItems.length; index++){
                selectedItems[index].classList.remove("no-form-selected");
            }
        }
        else{//no form is selected
            actionsMenuSelect.disabled = true;
            for(var index = 0; index < selectedItems.length; index++){
                selectedItems[index].classList.add("no-form-selected");
            }
        }

        chrome.tabs.query({active: true, currentWindow: true}, function(arrTabs){
            let activeTab = arrTabs[0];
            chrome.tabs.sendMessage(activeTab.id, JSON.stringify({message: 'extSelectFormMessage', selectedForm: selectedForm}));
        });
        saveUI();
    });
    ////
    actionsMenuSelect.addEventListener('change', function(event){
        let selectedItem = document.querySelector('.actionsMenuItem.actionsMenuItemSelected');
        if (this.value){
            if(selectedItem){
                selectedItem.classList.remove('actionsMenuItemSelected');
            }
            document.querySelector('.actionsMenuItem[data-actionid="' + this.value + '"]').classList.add('actionsMenuItemSelected');
            saveUI();
        }
    });
    ////
    btnGetComponentsObject.addEventListener('click', function(event){// get form components object
        //console.log("get form components object");
        chrome.tabs.query({active: true, currentWindow: true}, function(arrTabs){
            chrome.tabs.sendMessage(arrTabs[0].id, JSON.stringify({message: 'extGetComponentsObjectMessage', selectedForm: selectedForm}))
        });
    });
    ////
    copyComponentsObject.addEventListener('click', function(event){// copy form components object
        componentsObjectTextarea.value = componentsObjectPre.textContent;
        componentsObjectTextarea.select();
        if(document.execCommand('copy', null)){
            alertMsg(alertsSpan, 'Object copied!');
        }
    });
    ////
    btnGetFormData.addEventListener('click', function(event){// get form data
        chrome.tabs.query({active: true, currentWindow: true}, function(arrTabs){
            chrome.tabs.sendMessage(arrTabs[0].id, JSON.stringify({message: 'extGetFormDataMessage', selectedForm: selectedForm}))
        });
    });
    ////
    btnCopyFormData.addEventListener('click', function(event){// copy form data object
        formDataTextarea.value = formDataPre.textContent;
        formDataTextarea.select();
        if(document.execCommand('copy', null)){
            alertMsg(alertsSpan, 'Object copied!');
        }

    });
    ////
    btnEmptyForm.addEventListener('click', function(event){// empty form data
        chrome.tabs.query({active: true, currentWindow: true}, function(arrTabs){
            chrome.tabs.sendMessage(arrTabs[0].id, JSON.stringify({
                message: 'extEmptyFormMessage', 
                selectedForm: selectedForm
            }))
        });
    });
    ////
    btnRestoreOriginalForm.addEventListener('click', function(event){// restore original formio function
        chrome.tabs.query({active: true, currentWindow: true}, function(arrTabs){
            chrome.tabs.sendMessage(arrTabs[0].id, JSON.stringify({
                message: 'extRestoreOriginalFormMessage',
                selectedForm: selectedForm
            }))
        });
    });
    ////
    btnExecuteFunction.addEventListener('click', function(event){// run a function on formio components on global traverse
        chrome.tabs.query({active: true, currentWindow: true}, function(arrTabs){
            chrome.tabs.sendMessage(arrTabs[0].id, JSON.stringify({
                message: 'extRunFunctionOnTraverseMessage', 
                data: functionOnTraversePre.textContent, 
                selectedForm: selectedForm
            }))
        });
    });
    ////
    setComponentsObjectBtn.addEventListener('click', function(event){// set formio's components array
        chrome.tabs.query({active: true, currentWindow: true}, function(arrTabs){
            chrome.tabs.sendMessage(arrTabs[0].id, JSON.stringify({
                message: 'extSetComponentsObjectMessage', 
                data: setComponentsObjectPre.textContent,
                selectedForm: selectedForm
            }))
        });
    });
    ////
    setFormDataBtn.addEventListener('click', function(event){// set formio's form data object
        chrome.tabs.query({active: true, currentWindow: true}, function(arrTabs){
            chrome.tabs.sendMessage(arrTabs[0].id, JSON.stringify({
                message: 'extSetFormDataObjectMessage', 
                data: setFormDataPre.textContent,
                selectedForm: selectedForm
            }))
        });
    });
    
    //END listening for DOM events
});
