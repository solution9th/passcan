/**
 * Created by zhengliuyang on 2018/7/26.
 */
import $ from 'jquery';
let HOST = '';
const reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
class Popup {
    constructor() {
        this.loginState = false;
        this.webToken = '';
        this.uname = '';
        this.uid = '';
        this.snackbar = document.querySelector('#msg-toast');
        this.getConfig();
    }

    getConfig() {
        chrome.storage.sync.get((data) => {
            if(data.hasOwnProperty('apiHost') && data.apiHost) {
                HOST = data.apiHost;
                $('.passcan-api').val(HOST);
            }
            this.addListener();
            this.init();
        })
    }

    addListener() {
        $(document).on('click', '#toSetting', () => {
            this.renderSetting();
            document.querySelector('.panel-main').style.display = 'none';
            document.querySelector('.panel-setting').style.display = 'block';
        });
        $(document).on('click', '#backToMain', () => {
            document.querySelector('.panel-main').style.display = 'block';
            document.querySelector('.panel-setting').style.display = 'none';
        });
        $(document).on('click', '#loginButton', () => {
            this.login();
        });
        $(document).on('click', '#loginOut', () => {
            this.loginOut();
        });
        $(document).on('click', '#addToPasscan', () => {
            chrome.tabs.query({
                active: true,
                currentWindow: true,
                windowType: 'normal'
            }, (tabs) => {
                if(tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, {event: 'getFormValue'},(response) => {
                        chrome.runtime.sendMessage({event: 'addToPasscan', account: response.account, pass: response.pass},(res) => {
                        });
                    })
                }
            });
        });
        $(document).on('click', '#toPasscan', () => {
            chrome.runtime.sendMessage({event: 'toPasscan'},(response) => {
            });
        });
        $(document).on('click', '.edit-domain', function () {
            $(this).siblings('input').focus();
        });
        $(document).on('click', '#setHost', () => {
            let apiHost = $('#passcanHost').val();
            this.regApiHost(apiHost);
        });
        $(document).on('blur', '.passcan-api', (e) => {
            let apiHost = e.target.value;
            this.regApiHost(apiHost);
        });
    }

    regApiHost(apiHost) {
        if(apiHost && reg.test(apiHost)) {
            this.saveConfig(apiHost.replace(/\/$/,''));
        }else {
            this.snackbar.MaterialSnackbar.showSnackbar({
                message: `API 地址格式不正确`
            });
        }
    }

    saveConfig(apiHost) {
        chrome.storage.sync.get((data) => {
            if(data.hasOwnProperty('apiHost') && data.apiHost) {
                chrome.storage.sync.set({apiHost: apiHost}, () => {
                    HOST = apiHost;
                    if($('.curApi').length > 0) {
                        $('.curApi').html(`当前API地址:<p>${apiHost}</p>`);
                    }
                });
            }else {
                chrome.storage.sync.set({apiHost: apiHost}, () => {
                    HOST = apiHost;
                    $('.passcan-api').val(apiHost);
                    $('.panel-config').hide();
                    $('.panel-main').show();
                    $('.curApi').html(`当前API地址:<p>${apiHost}</p>`).show();
                });
            }
            chrome.tabs.query({
                active: true,
                currentWindow: true,
                windowType: 'normal'
            }, (tabs) => {
                if(tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, {event: 'updateAPI', apiHost: apiHost},(response) => {
                    })
                }
            });
            chrome.runtime.sendMessage({event: 'updateAPI', apiHost: apiHost}, (response) => {
            });
        })
    }

    init() {
        chrome.storage.sync.get((data) => {
            if(!(data.hasOwnProperty('apiHost') && data.apiHost)) {
                $('.panel-config').show();
                return;
            }
            if(data.hasOwnProperty('webToken') && data.webToken) {
                this.loginState = true;
                this.webToken = data.webToken;
                this.uname = data.hasOwnProperty('uname')?data.uname:'';
                this.uid = data.hasOwnProperty('uid')?data.uid:'';
                $('.panel-main').show();
                chrome.browserAction.setIcon({
                    path: 'icon3.png'
                }, () => {});
                chrome.browserAction.setPopup({
                    popup: 'popup.html'
                });
            }else {
                $('.panel-main').show();
                chrome.browserAction.setIcon({
                    path: 'icon1.png'
                }, () => {});
                chrome.browserAction.setPopup({
                    popup: 'popup_login.html'
                });
            }
        });
    }

    login() {
        window.open(`${HOST}/api/login`, '_blank', 'width=700, height=600, titlebar=0, menubar=0,directories=0');
    }

    loginOut() {
        $.get(`${HOST}/api/logout?api_token=${this.webToken}`)
            .then((data) => {
                if(data.code == 200) {
                    chrome.storage.sync.set({webToken: ''}, () => {
                    });
                    chrome.browserAction.setIcon({
                        path: 'icon1.png'
                    }, () => {});
                    chrome.browserAction.setPopup({
                        popup: 'popup_login.html'
                    });
                    setTimeout(() => {
                        window.close();
                    }, 800);
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    renderSetting() {
        $('.set-main .name span').text(this.uname);
    }
}
const popup = new Popup();