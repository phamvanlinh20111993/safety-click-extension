document.addEventListener('DOMContentLoaded', () => {
    const dialogBox = document.getElementById('dialog-box');
    const query = { active: true, currentWindow: true };

    chrome.tabs.query(query, (tabs) => {
        dialogBox.innerHTML = 'hello my name is Linh';
    });

    chrome.storage.sync.set({key: 'hie'}, function() {
        console.log('Value is set to ');
    });
});
