var myWindowId;
const contentBox = document.querySelector("#content");

function logTabs(tabs) {
    for (let tab of tabs) {
        // tab.url requires the `tabs` permission
        console.log(tab.url);
    }
}

function onError(error) {
    console.log(`Error: ${error}`);
}

let querying = browser.tabs.query({});
querying.then(logTabs, onError);


window.addEventListener("mouseover", () => {
    contentBox.setAttribute("contenteditable", true);
});

/*
When the user mouses out, save the current contents of the box.
*/
window.addEventListener("mouseout", () => {
    contentBox.setAttribute("contenteditable", false);
    browser.tabs.query({ windowId: myWindowId, active: true }).then((tabs) => {
        let contentToStore = {};
        contentToStore[tabs[0].url] = contentBox.textContent;
        browser.storage.local.set(contentToStore);
    });
});

/*
Update the sidebar's content.

1) Get the active tab in this sidebar's window.
2) Get its stored content.
3) Put it in the content box.
*/
function updateContent() {
    browser.tabs.query({ windowId: myWindowId, active: true })
        .then((tabs) => {
            return browser.storage.local.get([0].url);
        })
        .then((storedInfo) => {
            contentBox.textContent = storedInfo[Object.keys(storedInfo)[0]];
        });
}

/*
Update content when a new tab becomes active.
*/
browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
browser.tabs.onUpdated.addListener(updateContent);

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({ populate: true }).then((windowInfo) => {
    myWindowId = windowInfo.id;
    console.log(`windowid ${myWindowId}`);
    updateContent();
});
