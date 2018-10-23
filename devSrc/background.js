/**
 * Created by zhengliuyang on 2018/7/31.
 */
import axios from 'axios';
let HOST = '';
class App {
    constructor() {
        this.webToken = '';
        this.getConfig();
    }

    getConfig() {
        chrome.storage.sync.get((data) => {
            if(data.hasOwnProperty('apiHost') && data.apiHost) {
                HOST = data.apiHost;
            }
            this.addEventListener();
        })
    }

    addEventListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            let event = request.event;
            switch (event) {
                case 'login':
                    this.saveLoginState(request.data);
                    break;
                case 'addToPasscan':
                    chrome.tabs.query({
                        active: true,
                        currentWindow: true,
                        windowType: 'normal'
                    }, (tabs) => {
                        if(tabs.length > 0) {
                            let url = tabs[0].url;
                            let account = request.account;
                            let password = request.pass;
                            window.open(chrome.runtime.getURL(`console.html?action=add&url=${url}&n=${account}&p=${password}`));
                        }
                    });
                    sendResponse({status: 200});
                    return true;
                    break;
                case 'toPasscan':
                    window.open(chrome.runtime.getURL('console.html'));
                    sendResponse({status: 200});
                    break;
                case 'updateAPI':
                    let apiHost = request.apiHost;
                    HOST = apiHost;
                    break;
                case 'getSuggest':
                    let host = request.host;
                    chrome.storage.sync.get((data) => {
                        if(data.hasOwnProperty('webToken') && data.webToken) {
                            let items = [];
                            if(data.hasOwnProperty('webItem') && data.webItem) {
                                let store = JSON.parse(data.webItem);
                                for(let i in store) {
                                    if(i.indexOf(host) > -1) {
                                        items = store[i];
                                    }
                                }
                            }
                            sendResponse({
                                status: 200,
                                data: items,
                            });
                        }else {
                            sendResponse({
                                status: 501,
                                msg: 'should login first',
                            });
                        }
                    });
                    return true;
                    break;
            }
        });

        chrome.runtime.onInstalled.addListener(() => {
            // this.checkConfig();
        })
    }

    saveToStorage(source) {
        let store = {};
        source.map((data) => {
            if(store.hasOwnProperty(data.web.url)) {
                let val = store[data.web.url];
                val.push({
                    uname: data.web.username,
                    pwd: data.web.password,
                });
                store[data.web.url] = val;
            }else {
                store[data.web.url] = [{
                    uname: data.web.username,
                    pwd: data.web.password,
                }]
            }
        });
        chrome.storage.sync.set({webItem: JSON.stringify(store)}, () => {
        });
        console.log(store)
    }

    getWeb() {
        axios.get(`${HOST}/api/web?api_token=${this.webToken}`)
            .then((response) => {
                let data = response.data;
                if(data.code == 200) {
                    this.saveToStorage(data.data);
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    getUserInfo() {
        axios.get(`${HOST}/api/user?api_token=${this.webToken}`)
            .then((response) => {
                let data = response.data;
                console.log(data);
                if(data.code == 200) {
                    let uname = data.data.username;
                    let uid = data.data.userid;
                    chrome.storage.sync.set({uname: uname}, () => {
                    });
                    chrome.storage.sync.set({uid: uid}, () => {
                    });
                }
            }).catch((error) => {
            console.log(error);
        });
    }

    saveLoginState(token) {
        this.webToken = token;
        this.getWeb();
        this.getUserInfo();
        chrome.storage.sync.set({webToken: token}, () => {
        });
        chrome.browserAction.setIcon({
            path: 'icon3.png'
        }, () => {});
        chrome.browserAction.setPopup({
            popup: 'popup.html'
        });
    }
}

let app = new App();