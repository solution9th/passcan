/**
 * Created by zhengliuyang on 2018/7/25.
 */
const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAFIGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTgtMDctMjdUMTQ6MTg6MjkrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTA3LTI3VDE1OjU1OjE1KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTA3LTI3VDE1OjU1OjE1KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU0ZmExNzNjLTk2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';
const keyIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADFElEQVRoQ+2YS0wTURSG/zNtCe58xBfWKcjSjUtduEKFTogPVupCBY0LH2mrxODOnRoMMwUSE2N8LFBZqkkLARIXJsbEndEVgp0SxKgxriTtdI4pCinSx0zntg1hur3/+e/5/nM7vR3CKv/QKu8fLkCtJ+hOwJ2AwwTcI+QwQMfl7gQcR+jQYG1MoGVwZpPP4KMEswNAM5j8RJxmYJqYphmYIsZw7Ir8zmGgtsuLTkAZnA2wYfQAfJZAvlLuDJ5g8twcCfknSmlFrRcEUKL6EWZ+RqB6u5sx4248Il+wW1eOPi+AEk2EwKSVY7hYw4AWD8sRJx5WalcAKFqinUEvCM5vqtWAWAZwcEBv8BmYBGGdFXorGpN4/0go8NqKthzNMoCgpg8RcLIco0I1DAzHw/JxkZ65XksAhwbmmryZ1JTojZhhUF39ztjFLXOivbN+SwBBTb9KwJ3im/AcmzjvNX1vsjpDSu8jCfcA2laJ5op5xsLyQu9LAIqaGAPRgSJH4ZvhwZ6xy/JsrqZV/bzdQ/QBoA3VhFgBENT0Scr+yhb4mMRnRkKBx/mW26KJ0xLTo9oCqHqaCN5CTXgM7+aX3Q3f86239yV3mBLP1BZAS6SKXReKAQT7Z/xkmsmaAihq4hOIdhVsgtAVC8kP860rUb0TjAc1BQhqiXECtRRugn9mmHePRhq/5Gr+Hh/zfe2/xKreTYTeEo/RrwDOsVT31ptiznjTewHcB2hrNdPP7rXyKdSvN5OJSdGNMHg+5fX4Jy75fxTzVjSdrTz3/9csu0ooqv4EhBNiIbg3Fg5cK+UpBKBN/dIoIf1R1GXOavpZOCEAWaM2TT8sAc9LJWZlncG34+FAjxWtMIB/EBEJ6LOyccGrByP+e32m41Vn07wVH6EACxBqskOC+RREdVYayNUw81D8l3wKN8i0WiscYOFcDs4GYBjXGdxl9U+9ybg1GgmMW218UVcRgEXz1r7kRpJwrJKvVSoKYDfNaurXxpu5aiZqdy93AnYTE613JyA6Ubt+7gTsJiZa705AdKJ2/Vb9BP4AaaooQMIVwOMAAAAASUVORK5CYII=';
let HOST = '';
class Content {
    constructor() {
        this.account;
        this.pass;
        this.accountIcon;
        this.passIcon;
        this.accountRect;
        this.passRect;
        this.dataStorage = [];
        this.getConfig();
    }

    getConfig() {
        chrome.storage.sync.get((data) => {
            if(data.hasOwnProperty('apiHost') && data.apiHost) {
                HOST = data.apiHost;
                this.pageDidMount();
            }
        })
    }

    isVisible(elem) {
        return elem.offsetWidth> 0 && elem.offsetHeight> 0;
    }

    randomString(len) {
        len = len || 32;
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    clearFillIcon() {
        let icons = document.querySelectorAll('.passcan-autofill');
        for(let i = 0; i < icons.length; i ++) {
            document.body.removeChild(icons[i]);
        }
        this.account = null;
        this.pass = null;
        this.accountIcon = null;
        this.passIcon = null;
        this.accountRect = null;
        this.passRect = null;
    }

    findInput() {
        let passwordInput = document.querySelector('input[type="password"]');
        let textInputItem = document.querySelectorAll('input[type="text"]');
        let textInput = null;
        for(let i = 0; i < textInputItem.length; i ++) {
            if(typeof textInputItem[i].getAttribute('disabled') !== 'string' && typeof textInputItem[i].getAttribute('readonly') !== 'string' && this.isVisible(textInputItem[i])) {
                textInput = textInputItem[i];
                break;
            }
        }
        if(passwordInput && typeof passwordInput.getAttribute('disabled') !== 'string' && typeof passwordInput.getAttribute('readonly') !== 'string' && this.isVisible(passwordInput)) {
            if(this.pass != passwordInput) {
                this.pass = passwordInput;
                passwordInput.setAttribute('autocomplete', 'off');
                passwordInput.dataset.passcaninput = 'password';
            }
            this.addFillIcon(passwordInput, 'pass');
            if(textInput) {
                if(this.account != textInput) {
                    this.account = textInput;
                    textInput.setAttribute('autocomplete', 'off');
                    textInput.dataset.passcaninput = 'text';
                }
                this.addFillIcon(textInput, 'account');
            }
        }else {
            if(this.accountIcon || this.passIcon) {
                this.clearFillIcon();
            }
        }
    }

    addFillIcon(el, type) {
        let iconWidth = 16;
        let iconHeight = 16;
        let elRect = el.getBoundingClientRect();
        let curIcon,curRect;
        if(type == 'pass') {
            curIcon = this.passIcon;
            curRect = this.passRect;
        }else if(type == 'account') {
            curIcon = this.accountIcon;
            curRect = this.accountRect;
        }
        if(curIcon) {
            if(elRect.left == curRect.left && elRect.width == curRect.width && elRect.top == curRect.top && elRect.height == curRect.height) {
                return;
            }
            // console.log('in change Icon');
            curIcon.style.left = `${elRect.left + (elRect.width - iconWidth - elRect.width * 0.02)}px`;
            curIcon.style.top = `${elRect.top + (elRect.height - iconHeight) / 2}px`;
            if(type == 'pass') {
                this.passRect = elRect;
            }else if(type == 'account'){
                this.accountRect = elRect;
            }
            return;
        }
        // console.log('in add Icon');
        let img = document.createElement('IMG');
        let uniqueId = `passcanFill-${this.randomString(8)}`;
        img.src = icon;
        img.className = 'passcan-autofill';
        img.id = uniqueId;
        img.style.left = `${elRect.left + (elRect.width - iconWidth - elRect.width * 0.02)}px`;
        img.style.top = `${elRect.top + (elRect.height - iconHeight) / 2}px`;
        document.body.appendChild(img);
        let iconEl = document.querySelector(`#${uniqueId}`);
        this.addIconEvent(iconEl);
        if(type == 'pass') {
            this.passIcon = iconEl;
            this.passRect = elRect;
        }else if(type == 'account'){
            this.accountIcon = iconEl;
            this.accountRect = elRect;
        }
    }

    getSuggest() {
        let promise = new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({event: 'getSuggest', host: window.location.origin},(response) => {
                // console.log(response);
                if(response.status == 200) {
                    return resolve(response.data);
                }
                reject(response);
            });
        });
        return promise;
    }

    addPassMenu(el, e) {
        this.dataStorage = [];
        let elRect = el.getBoundingClientRect();
        let div = document.createElement('div');
        div.id = 'passcanDialog';
        div.style.right = `${window.innerWidth - elRect.left - elRect.width}px`;
        div.style.top = `${elRect.top + elRect.height + 10}px`;
        div.innerHTML = ``;
        document.body.appendChild(div);
        let promise = this.getSuggest();
        promise.then((data) => {
            this.dataStorage = data;
            let str = ``;
            data.map((d, k) => {
                str += `<div class="row hasRipple" data-key="${k}">
                        <img src="${keyIcon}"><span>${d.uname}</span>
                        <span class="ripple"></span>
                    </div>`
            });
            if(!str) {
                str = `<div class="tip">找不到此网址的网站。 您可以登录此网站以保存凭据</div>`;
            }
            document.getElementById('passcanDialog').innerHTML = str;
        }).catch((data) => {
            if(data.status == 501) {
                document.getElementById('passcanDialog').innerHTML = `<div class="tip">尚未登录。 您可以登录后获取此网站已保存的凭据</div><button class="lg-btn">登 录</button>`;
            }else {
                document.getElementById('passcanDialog').innerHTML = `<div class="tip">找不到此网址的网站。 您可以登录此网站以保存凭据</div>`;
            }
        })
    }

    login() {
        window.open(`${HOST}/api/login`, '_blank', 'width=700, height=600, titlebar=0, menubar=0,directories=0');
    }

    addIconEvent(el) {
        el.addEventListener('click', (e) => {
            if(!document.querySelector('#passcanDialog')) {
                setTimeout(() => {
                    this.addPassMenu(el, e);
                });
            }
            e.preventDefault();
        })
    }

    hasParent(el, id) {
        if(!el) return false;
        if(el.nodeType == 9) {
            return false;
        }
        let elId = el.id;
        let elNodeName = el.nodeName;
        if(elNodeName == 'BODY') {
            return false;
        }else {
            if(!elId || elId !== id) {
                return this.hasParent(el.parentNode, id);
            }else if(elId == id) {
                return true;
            }
        }
    }

    hasChild(parentNode, childNode) {
        if (parentNode.contains) {
            return parentNode != childNode && parentNode.contains(childNode);
        } else {
            return !!(parentNode.compareDocumentPosition(childNode) & 16);
        }
    }

    closeDialog() {
        let dialog = document.querySelector('#passcanDialog');
        document.body.removeChild(dialog);
    }

    fireOnchange(e) {
        try {
            let ev = e.ownerDocument.createEvent("Events");
            if (ev.initEvent("change", true, true), e.dispatchEvent(ev), (ev = e.ownerDocument.createEvent("Events")).initEvent("input", true, true), e.dispatchEvent(ev), void 0 !== ischrome && ischrome && "function" == typeof e.onkeyup) {
                n && (ev.keyCode = 8);
                e.onkeyup(ev)
            }
        } catch (e) {
        }
    }

    getQuery() {
        let search = location.search || '';
        search = search.substr(1, search.length - 1);
        let arr = search.split('&');
        let args = {};
        if(arr.length > 0) {
            arr.map((data) => {
                let a = data.split('=');
                args[a[0]] = a[1];
            })
        }
        return args;
    }

    getCookie() {
        let cookie = document.cookie;
        let arr = cookie.split(';');
        let co = {};
        arr.map((d) => {
            let a = d.split('=');
            co[a[0]] = a[1];
        });
        return co;
    }

    pageDidMount() {
        let args = this.getQuery();
        if(args.hasOwnProperty('from') && args.from == 'passcan') {
            let apiToken = args.api_token;
            if(apiToken) {
                chrome.runtime.sendMessage({event: 'login', data: apiToken}, (response) => {
                });
                window.close();
            }
        }else {
            document.addEventListener('click', (e) => {
                if(e.target.className == 'lg-btn') {
                    this.login();
                    this.closeDialog();
                }
                if(this.hasParent(e.target, 'passcanDialog')) {
                    if(e.target.className.indexOf('hasRipple') > -1 || (e.target.parentNode.className || '').indexOf('hasRipple') > -1) {
                        let ele = e.target;
                        if(e.target.parentNode.className.indexOf('hasRipple') > -1) {
                            ele = e.target.parentNode;
                        }
                        let posX = ele.getBoundingClientRect().left,
                            posY = ele.getBoundingClientRect().top,
                            buttonWidth = ele.getBoundingClientRect().width,
                            buttonHeight = ele.getBoundingClientRect().height;
                        if (buttonWidth >= buttonHeight) {
                            buttonHeight = buttonWidth;
                        } else {
                            buttonWidth = buttonHeight;
                        }
                        let x = e.clientX - posX - buttonWidth / 2;
                        let y = e.clientY - posY - buttonHeight / 2;
                        ele.childNodes[4].style.cssText = `width: ${buttonWidth}px;height: ${buttonHeight}px;top: ${y}px;left: ${x}px`;
                        ele.childNodes[4].className = 'ripple rippleEffect';
                        setTimeout(() => {
                            ele.childNodes[4].className = 'ripple';
                            let key = ele.dataset.key;
                            let userName = this.dataStorage[key].uname;
                            let password = this.dataStorage[key].pwd;
                            this.account.focus();
                            this.account.value = userName;
                            this.fireOnchange(this.account);
                            this.pass.focus();
                            this.pass.value = password;
                            this.fireOnchange(this.pass);
                            this.closeDialog();
                        }, 250);
                    }
                }else {
                    if(document.querySelector('#passcanDialog')) {
                        this.closeDialog();
                    }
                }
            });
            let timer = null;
            let observer = new MutationObserver((mutations) => {
                mutations.map((m) => {
                    if(m.type == 'attributes') {
                        if (m.target.getAttribute(m.attributeName) !== m.oldValue) {
                            clearTimeout(timer);
                            timer = setTimeout(() => {
                                if(document.querySelectorAll('input').length > 0) {
                                    this.findInput();
                                }else {
                                    this.clearFillIcon();
                                }
                            }, 100);
                        }
                    }
                })
            });
            observer.observe(document.body, {
                childList: true,
                attributes: true,
                characterData: true,
                subtree: true,
                attributeOldValue: true
            });
            this.findInput();
            window.addEventListener('resize',(e) => {
                this.findInput();
            });
        }

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            let event = request.event;
            switch (event) {
                case 'updateAPI':
                    let apiHost = request.apiHost;
                    HOST = apiHost;
                    break;
                case 'getFormValue':
                    let account = this.account.value || '';
                    let pass = this.pass.value || '';
                    sendResponse({account: account, pass: pass});
                    break;
            }
        });
    }
}

const con = new Content();