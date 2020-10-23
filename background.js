/*
var isFormioFound;
function initExtension(tabId = undefined){
    isFormioFound = false;
    if(tabId){
        chrome.tabs.sendMessage(tabId, JSON.stringify({message: 'init'}));
        //console.log('init message sent for tab: ', tabId);
    }
    else{
        chrome.tabs.query({active: true}, function(arrTabs){
            let activeTab = arrTabs[0];
            chrome.tabs.sendMessage(activeTab.id, JSON.stringify({message: 'init'}));
            //console.log('init message sent for tab: ', activeTab.id);
        });
    }
}
/////////

chrome.tabs.onUpdated.addListener(function(tabID, activeInfo, tab){
    if(activeInfo.status == "complete"){
        
        //console.log('tab updated & complete !!!');
        //console.log('tabID = ' , tabID);
        //console.log('activeInfo = ' , activeInfo);
        //console.log('tab = ' , tab);
        //console.log('--------------');
        
        initExtension(tabID);
    }
});
///
chrome.tabs.onActivated.addListener(function(activeInfo){
    
    //console.log('tabs.onActivated event');
    //console.log('activeInfo = ' , activeInfo);//
    //console.log('--------------');
    initExtension(activeInfo.tabId);
    
})
///
chrome.runtime.onInstalled.addListener(function(obj){
    
    //console.log('runtime.onInstalled event');
    //console.log('obj = ' , obj);
    //console.log('--------------');

    initExtension();
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        let msgObj = JSON.parse(request);
        //console.log('msgObj = ' , msgObj );
        if (msgObj.message == 'initResponse'){//init response from contentscript
            if(msgObj.status == 'success'){
                //console.log('background.js initResponse = success');
                isFormioFound = true;
            }
            else if(msgObj.status == 'fail'){//nothing? lolz
            }
        }
    }
);
*/