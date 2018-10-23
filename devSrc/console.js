/**
 * Created by zhengliuyang on 2018/7/31.
 */
import $ from 'jquery';
import Swiper from 'swiper';
let HOST = '';
class Console {
    constructor() {
        this.loginState = false;
        this.webToken = '';
        this.uname = '';
        this.uid = '';
        this.editMode = true;
        this.permissionType = 'read';
        this.itemKeyword = '';
        this.webItem = [];
        this.currentInfo = {};
        this.delInfo = {};
        this.addInfo = {};
        this.sourceType = 'user';
        this.filterKeyword = '';
        this.allGroup = [];
        this.allRole = [];
        this.itemFilter = false;
        this.allUser = [];
        this.checkedData = [];
        this.shareChecked = [];
        this.dialogMode = 'edit';
        this.swiper = null;
        this.dialog = document.querySelector('.panel-dialog');
        this.delDialog = document.querySelector('.delete-dialog');
        this.snackbar = document.querySelector('#msg-toast');
        this.addPanel = $('.add-panel');
        this.getConfig();
    }

    getConfig() {
        chrome.storage.sync.get((data) => {
            if(data.hasOwnProperty('apiHost') && data.apiHost) {
                HOST = data.apiHost;
                this.checkState();
            }
        })
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
                    });
                }
            }).catch((error) => {
            console.log(error);
        });
    }

    getQueryString(key) {
        let qs = location.search.substr(1),
            args = {},
            items = qs.length ? qs.split("&") : [],
            item = null,
            len = items.length;

        for(let i = 0; i < len; i++) {
            item = items[i].split("=");
            let name = decodeURIComponent(item[0]),
                value = decodeURIComponent(item[1]);
            if(name) {
                args[name] = value;
            }
        }
        if (args.hasOwnProperty(key)) {
            return args[key]
        } else {
            return '';
        }
    }

    initPage() {
        let action = this.getQueryString('action');
        let url = this.getQueryString('url');
        if(action && action == 'add') {
            if(url) {
                let account = this.getQueryString('n') || '';
                let pass = this.getQueryString('p') || '';
                setTimeout(() => {
                    $('.form-base-info #site').val(url).parent().addClass('is-dirty');
                    $('.form-base-info #username').val(account).parent().addClass('is-dirty');
                    $('.form-base-info #password').val(pass).parent().addClass('is-dirty');
                }, 250);
            }
            $('.add-new-button').click();
        }
        if(location.protocol != 'chrome-extension:') {
            $('.toInstall').css('display', 'flex');
        }
    }

    checkState() {
        chrome.storage.sync.get((data) => {
            console.log(data);
            if(data.hasOwnProperty('webToken') && data.webToken) {
                this.loginState = true;
                this.webToken = data.webToken;
                this.uname = data.hasOwnProperty('uname')?data.uname:'';
                this.uid = data.hasOwnProperty('uid')?data.uid:'';
                this.addListener();
                this.initPage();
                this.getWebItem();
            }else {
                alert('尚未登录,请先去登录');
                window.close();
            }
        });
    }

    p1Loading(state) {
        this.loading = state;
        if(state) {
            $('#p1').show();
        }else {
            $('#p1').hide();
        }
    }

    p2Loading(state) {
        this.loading = state;
        if(state) {
            $('#p2').show();
        }else {
            $('#p2').hide();
        }
    }

    loadingState(state) {
        if(state) {
            $('.loading').addClass('loading-show');
        }else {
            $('.loading').removeClass('loading-show');
        }
    }

    getAllUser() {
        this.p2Loading(true);
        $.get(`${HOST}/api/users?api_token=${this.webToken}`, (res) => {
            this.p2Loading();
            if(res.code == 200) {
                this.allUser = res.data || [];
                this.renderUserItem();
            }
        })
    }

    getAllGroup() {
        this.p2Loading(true);
        $.get(`${HOST}/api/groups?api_token=${this.webToken}`, (res) => {
            this.p2Loading();
            if(res.code == 200) {
                this.allGroup = res.data || [];
            }
        })
    }

    getAllRole() {
        this.p2Loading(true);
        $.get(`${HOST}/api/roles?api_token=${this.webToken}`, (res) => {
            this.p2Loading();
            if(res.code == 200) {
                this.allRole = res.data || [];
            }
        })
    }

    renderUserItem() {
        let keyword = this.filterKeyword;
        let type = this.sourceType;
        let source = [];
        if(type == 'user') {
            source = this.allUser;
        }else if(type == 'group') {
            source = this.allGroup;
        }else if(type == 'role') {
            source = this.allRole;
        }
        let str = ``;
        (source || []).map((data, k) => {
            let checked = false;
            let disable = false;
            if(type == 'user') {
                if(data.fullname.indexOf(keyword) == -1 && data.email.indexOf(keyword) == -1) {
                    return;
                }
                this.checkedData.map((d) => {
                    if(data.uid == d.typeid) {
                        if(this.permissionType == 'read') {
                            if(d.rule == 1) {
                                checked = true;
                            }else {
                                disable = true;
                            }
                        }
                        if(this.permissionType == 'admin') {
                            if(d.rule == 2) {
                                checked = true;
                            }else {
                                disable = true;
                            }
                        }
                    }
                });
                str += `<li>
                        <label data-key="${k}" class="aucheck mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="aucheck-${k}">
                            <input type="checkbox" id="aucheck-${k}" class="mdl-checkbox__input" value="${data.uid}" ${checked?'checked':''} ${disable?'disabled':''}>
                            <span class="mdl-checkbox__label">${data.fullname}</span>
                        </label>
                        <div class="u">${data.email}</div>
                    </li>`;
            }else if(type == 'group') {
                if(data.name.indexOf(keyword) == -1 && data.description.indexOf(keyword) == -1) {
                    return;
                }
                this.checkedData.map((d) => {
                    if(data.id == d.typeid) {
                        if(this.permissionType == 'read') {
                            if(d.rule == 1) {
                                checked = true;
                            }else {
                                disable = true;
                            }
                        }
                        if(this.permissionType == 'admin') {
                            if(d.rule == 2) {
                                checked = true;
                            }else {
                                disable = true;
                            }
                        }
                    }
                });
                str += `<li>
                        <label data-key="${k}" data-type="group" class="aucheck mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="aucheck-${k}">
                            <input type="checkbox" id="aucheck-${k}" class="mdl-checkbox__input" value="${data.id}" ${checked?'checked':''} ${disable?'disabled':''}>
                            <span class="mdl-checkbox__label">${data.name}</span>
                        </label>
                        <div class="u">${data.description}</div>
                    </li>`;
            }else if(type == 'role') {
                if(data.name.indexOf(keyword) == -1 && data.description.indexOf(keyword) == -1) {
                    return;
                }
                this.checkedData.map((d) => {
                    if(data.id == d.typeid) {
                        if(this.permissionType == 'read') {
                            if(d.rule == 1) {
                                checked = true;
                            }else {
                                disable = true;
                            }
                        }
                        if(this.permissionType == 'admin') {
                            if(d.rule == 2) {
                                checked = true;
                            }else {
                                disable = true;
                            }
                        }
                    }
                });
                str += `<li>
                        <label data-key="${k}" data-type="role" class="aucheck mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="aucheck-${k}">
                            <input type="checkbox" id="aucheck-${k}" class="mdl-checkbox__input" value="${data.id}" ${checked?'checked':''} ${disable?'disabled':''}>
                            <span class="mdl-checkbox__label">${data.name}</span>
                        </label>
                        <div class="u">${data.description}</div>
                    </li>`;
            }

        });
        $('.allu-its').html(str);
        componentHandler.upgradeElements(document.querySelectorAll('.allu-its li'));
    }

    addListener() {
        let dialog = this.dialog,
            that = this;
        $( document ).ajaxError(function( event, request, settings ) {
            that.loadingState();
            that.snackbar.MaterialSnackbar.showSnackbar({
                message: `API请求失败`
            });
        });
        $(document).on('click', '.add-new-button', function () {
            that.addInfo = {};
            that.currentInfo = {};
            that.dialogMode = 'add';
            that.checkedData = [];
            that.shareChecked = [];
            that.dialogOpen();
        });
        $(document).on('click', '.open-dialog', function (e) {
            let action = $(this).attr('data-action');
            let index = $(this).parent().attr('data-key');
            let webData = that.webItem[index];
            let webId = webData.web_id;
            let rule = webData.rule;
            that.editMode = rule == 2?true:false;
            that.openAction = action;
            that.getWebInfo(webId);
            that.dialogMode = 'edit';
        });
        $(document).on('click', '.toInstall', function () {
            let path = `${location.origin}/guide.html`;
            window.open(path);
        });
        $(document).on('click', '.del-dialog', function (e) {
            let index = $(this).parent().attr('data-key');
            that.delInfo = that.webItem[index];
            if(that.delInfo.rule == 1) {
                that.snackbar.MaterialSnackbar.showSnackbar({
                    message: `您没有该条站点的删除权限`,
                });
                return;
            }
            $('.delete-dialog .title').text(`是否删除${that.delInfo.web.url}?`);
            that.delDialogOpen();
        });
        $(document).on('click', '.dialog-cancel', function () {
            that.dialogClose();
        });
        $(document).on('click', '.dialog-confirm', function () {
            if(that.editMode) {
                that.save();
            }else {
                that.dialogClose();
            }
        });
        $(document).on('click', '.del-dialog-cancel', function () {
            that.delDialogClose();
        });
        $(document).on('click', '.del-dialog-confirm', function () {
            that.delDialogClose();
            that.delWebSite();
        });
        $(document).on('click', '.tab-hd .mdl-button', function () {
            let index = $(this).index();
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
            if(index == 1) {
                that.permissionType = 'read';
            }else if(index == 2) {
                that.permissionType = 'admin';
            }
            that.renderSharedUser();
            that.getSwiper().slideTo(index);
        });
        $(document).on('click', '#addButton', function () {
            if(!that.editMode) return;
            that.addPanelShow();
        });
        $(document).on('click', '#addButton2', function () {
            if(!that.editMode) return;
            that.addPanelShow();
        });
        $(document).on('click', '.adu-cancel', function () {
            that.addPanelClose();
        });
        $(document).on('click', '.adu-confirm', function () {
            that.userSave();
        });
        $(document).on('click', '.add .remove', function () {
            let newCheckedData = [];
            if(that.permissionType == 'read') {
                that.checkedData.map((data, k) => {
                    let fg = true;
                    that.shareChecked.map((s, j) => {
                        if(data.typeid == s.typeid && data.rule == 1) {
                            that.shareChecked.splice(j, 1);
                            fg = false;
                        }
                    });
                    if(fg) {
                        newCheckedData.push(data);
                    }
                })
            }else {
                that.checkedData.map((data, k) => {
                    let fg = true;
                    that.shareChecked.map((s, j) => {
                        if(data.typeid == s.typeid && data.rule == 2) {
                            that.shareChecked.splice(j, 1);
                            fg = false;
                        }
                    });
                    if(fg) {
                        newCheckedData.push(data);
                    }
                })
            }
            that.checkedData = newCheckedData;
            that.renderSharedUser();
            that.handleRemoveBtn();
        });
        $(document).on('mouseup', '.aucheck', function (e) {
            e.stopPropagation();
            if(!that.editMode) return;
            setTimeout(() => {
                let checked = $(this).find('input')[0].checked;
                let key = $(this).attr('data-key');
                let data = {};
                if(that.sourceType == 'user') {
                    data.typeid = that.allUser[key].uid;
                    data.typename = that.allUser[key].fullname;
                    data.type = 1;
                }else if(that.sourceType == 'group') {
                    data.typeid = that.allGroup[key].id;
                    data.typename = that.allGroup[key].name;
                    data.type = 2;
                }else if(that.sourceType == 'role') {
                    data.typeid = that.allRole[key].id;
                    data.typename = that.allRole[key].name;
                    data.type = 3;
                }
                if(checked) {
                    if(that.permissionType == 'read') {
                        data.rule = 1;
                    }else {
                        data.rule = 2;
                    }
                    that.addChecked(data);
                }else {
                    that.removeChecked(data);
                }
            })
        });
        $(document).on('input', '.filter-webitem', function (e) {
            let keyword = e.target.value;
            that.itemKeyword = keyword;
            that.renderWebItem();
        });
        $(document).on('mouseup', '.u-its label', function (e) {
            e.stopPropagation();
            if(!that.editMode) return;
            setTimeout(() => {
                let checked = $(this).find('input')[0].checked;
                let key = $(this).attr('data-key');
                let user = that.checkedData[key];
                if(checked) {
                    let hasAdd = false;
                    that.shareChecked.map((d, k) => {
                        if(d.typeid == user.typeid) {
                            hasAdd = true;
                        }
                    });
                    if(!hasAdd) {
                        that.shareChecked.push(user);
                    }
                }else {
                    that.shareChecked.map((d, k) => {
                        if(d.typeid == user.typeid) {
                            that.shareChecked.splice(k, 1);
                        }
                    });
                }
                that.handleRemoveBtn();
            })
        });
        $(document).on('mouseup', '.filterType-menu li', function (e) {
            if(!that.editMode) return;
            let type = $(this).attr('data-type');
            that.sourceType = type;
            let map = {user: '用户', group: '组', role: '角色'};
            $('.search-source').val('');
            that.filterKeyword = '';
            that.renderUserItem();
            $('#filterType').text(map[type]);
        });
        $(document).on('input', '.search-source', function (e) {
            if(!that.editMode) return;
            let keyword = e.target.value;
            that.filterKeyword = keyword;
            that.renderUserItem();
        });
        $(document).on('click', '.remove-added', function () {
            if(!that.editMode) return;
            let key = $(this).attr('data-key');
            let data = that.checkedData[key];
            console.log(data)
            if(!data) return;
            that.removeChecked(data);
            that.renderUserItem();
        });
        $(document).on('mouseup', '.filter-item', function (e) {
            e.stopPropagation();
            setTimeout(() => {
                let checked = $(this).find('input')[0].checked;
                that.itemFilter = checked;
                that.getWebItem();
            })
        });
        $(document).on('click', '.loginout', function () {
            that.loginOut();
        });
        $(document).on('click', '.togglePass', function (e) {
            let input = $('#password');
            let type = input.attr('type');
            if(type == 'text') {
                input.attr('type', 'password');
            }else {
                input.attr('type', 'text');
            }
        });
        $(document).on('click', '.toggleRowPass', function (e) {
            let input = $(this).siblings('input');
            let type = input.attr('type');
            if(type == 'text') {
                input.attr('type', 'password');
            }else {
                input.attr('type', 'text');
            }
        });
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            let event = request.event;
            switch (event) {
                case 'updateAPI':
                    let apiHost = request.apiHost;
                    HOST = apiHost;
                    break;
            }
        });
    }

    handleRemoveBtn() {
        let panel = null;
        let checkLength = 0;
        if(this.permissionType == 'read') {
            panel = $('.read-panel');
            this.shareChecked.map((d) => {
                if(d.rule == 1) {
                    checkLength ++;
                }
            })
        }else {
            panel = $('.admin-panel');
            this.shareChecked.map((d) => {
                if (d.rule == 2) {
                    checkLength ++;
                }
            })
        }
        if(checkLength > 0) {
            panel.find('.add .remove').css('display', 'flex');
        }else {
            panel.find('.add .remove').hide();
        }
    }

    delWebSite() {
        let webId = this.delInfo.web_id;
        if(!webId) return;
        this.loadingState(true);
        $.post({
            url: `${HOST}/api/web/${webId}?api_token=${this.webToken}`,
            type: 'DELETE',
            data: {},
        },(res) => {
            this.loadingState();
            if(res.code == 200) {
                this.snackbar.MaterialSnackbar.showSnackbar({
                    message: `删除成功`
                });
                this.getWebItem();
            } else {
                this.snackbar.MaterialSnackbar.showSnackbar({
                    message: `删除失败, ${res.msg}`
                });
            }
        });
    }

    userSave() {
        let webId = this.currentInfo.id;
        this.checkedData.map((data, k) => {
            data.web_id = webId;
        });
        this.renderSharedUser();
        this.addPanelClose();
    }

    addChecked(data) {
        let hasAdded = false;
        this.checkedData.map((d) => {
            if(d.typeid == data.typeid) {
                hasAdded = true;
            }
        });
        if(!hasAdded) {
            this.checkedData.push(data);
        }
        this.renderCheckedUser();
    }

    removeChecked(data) {
        this.checkedData.map((d, k) => {
            console.log(d, data)
            if(d.typeid == data.typeid) {
                this.checkedData.splice(k, 1);
            }
        });
        this.renderCheckedUser();
    }

    renderCheckedUser() {
        let str = ``;
        (this.checkedData || []).map((data, k) => {
            if(this.permissionType == 'read') {
                if(data.rule == 2) {
                    return
                }
            }else if(this.permissionType == 'admin') {
                if(data.rule == 1) {
                    return
                }
            }
            let icon = `icon-yonghu`;
            if(data.type == 2) {
                icon = `icon-jiaosezu`;
            }else if(data.type == 3) {
                icon = `icon-role`;
            }
            str += `<li>
                        <div class="n"><i class="iconfont ${icon}"></i>${data.typename}</div>
                        <button class="remove-added mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect" data-key="${k}"  data-id="${data.typeid}">
                            <i class="iconfont icon-shanchu"></i>
                        </button>
                    </li>`;
        });
        $('.adu-its').html(str);
        $('.ad-nm span').text(this.checkedData.length)
    }

    renderBaseInfo() {
        if(this.dialogMode == 'add') {
            let addInfo = this.addInfo;
            $('.form-base-info #site').val(addInfo.url || '');
            $('.form-base-info #username').val(addInfo.username || '');
            $('.form-base-info #password').val(addInfo.password || '');
            $('.form-base-info #remark').val(addInfo.remark || '');
            $('.form-base-info .is-dirty').removeClass('is-dirty');
            $('.dialog-title').text('添加新站点');
        }else {
            let currentInfo = this.currentInfo;
            $('.form-base-info #site').val(currentInfo.url || '');
            $('.form-base-info #username').val(currentInfo.username || '');
            $('.form-base-info #password').val(currentInfo.password || '');
            $('.form-base-info #remark').val(currentInfo.remark || '');
            $('.form-base-info .mdl-textfield').addClass('is-dirty');
            $('.dialog-title').text(currentInfo.url || '');
            if(!this.editMode) {
                $('.form-base-info #site').attr('disabled', 'disabled');
                $('.form-base-info #username').attr('disabled', 'disabled');
                $('.form-base-info #password').attr('disabled', 'disabled');
                $('.form-base-info #remark').attr('disabled', 'disabled');
                $('.share .add').hide();
            }
            this.renderSharedUser();
        }
    }

    collectionForm() {
        if(this.dialogMode == 'add') {
            let url = $('.form-base-info #site').val();
            let username = $('.form-base-info #username').val();
            let password = $('.form-base-info #password').val();
            let remark = $('.form-base-info #remark').val();
            this.addInfo = {
                url: url,
                username: username,
                password: password,
                remark: remark,
            }
        }
    }

    getWebItem() {
        this.loadingState(true);
        let url = `${HOST}/api/web?api_token=${this.webToken}`;
        if(this.itemFilter) {
            url = `${HOST}/api/share?api_token=${this.webToken}`
        }
        $.get(url, (res) => {
            this.loadingState();
            if(res.code == 200) {
                this.webItem = res.data;
                if(!this.itemFilter) {
                    this.saveToStorage(res.data);
                }
                this.renderWebItem();
            }else {
                this.snackbar.MaterialSnackbar.showSnackbar({
                    message: `获取数据失败, ${res.msg}`
                });
            }
        })
    }

    saveToStorage(source) {
        let store = {};
        source.map((data) => {
            if(data.web) {
                let url = data.web.url;
                if(!/\/$/.test(url)) {
                    url = `${url}/`;
                }
                let host = url.match(/^http(s)?:\/\/(.*?)\//)[0];
                if(host) {
                    host = host.replace(/\/$/,'');
                }
                if(store.hasOwnProperty(host)) {
                    let val = store[host];
                    val.push({
                        uname: data.web.username,
                        pwd: data.web.password,
                    });
                    store[host] = val;
                }else {
                    store[host] = [{
                        uname: data.web.username,
                        pwd: data.web.password,
                    }]
                }
            }
        });
        chrome.storage.sync.set({webItem: JSON.stringify(store)}, () => {
        });
        console.log(store)
    }

    getWebInfo(id) {
        this.loadingState(true);
        $.get(`${HOST}/api/web/${id}?api_token=${this.webToken}`, (res) => {
            this.loadingState();
            if(res.code == 200) {
                this.currentInfo = res.data[0];
                let checkedData = [];
                (res.data[0].rule || []).map((d) => {
                    checkedData.push({
                        type: d.type,
                        typeid: d.typeid,
                        typename: d.typename,
                        rule: d.rule,
                    })
                });
                this.checkedData = checkedData;
                if($('dialog').attr('open')) {
                    return;
                }
                this.dialogOpen();
            }else {
                this.snackbar.MaterialSnackbar.showSnackbar({
                    message: `获取信息失败, ${res.msg}`
                });
            }
        })
    }

    addWebSite() {
        this.loadingState(true);
        this.checkedData.map((data) => {
            delete data.web_id;
        });
        this.addInfo.data = JSON.stringify(this.checkedData.concat());
        $.post(`${HOST}/api/web?api_token=${this.webToken}`, this.addInfo, (res) => {
            this.loadingState();
            if(res.code == 200) {
                this.snackbar.MaterialSnackbar.showSnackbar({
                    message: '添加成功!'
                });
                this.dialogClose();
                this.getWebItem();
            }else {
                this.snackbar.MaterialSnackbar.showSnackbar({
                    message: `添加失败, ${res.msg}`
                });
            }
        })
    }

    save() {
        if(this.loading) return;
        if(this.dialogMode == 'add') {
            this.collectionForm();
            this.addWebSite();
        }else {
            let submit = this.checkedData.concat();
            let webId = this.currentInfo.id;
            this.p2Loading(true);
            $.post({
                url: `${HOST}/api/rule/${webId}?api_token=${this.webToken}`,
                type: 'PUT',
                data: {data: JSON.stringify(submit)},
            },(res) => {
                this.p2Loading();
                if(res.code == 200) {
                    this.dialogClose();
                } else {

                }
            });
        }
    }

    addPanelShow() {
        this.getAllUser();
        this.getAllGroup();
        this.getAllRole();
        this.renderCheckedUser();
        this.addPanel.show();
    }

    addPanelClose() {
        this.addPanel.hide();
    }

    initDialog() {
        this.shareChecked = [];
        this.handleRemoveBtn();
        this.renderBaseInfo();
    }

    dialogOpen() {
        this.dialog.showModal();
        this.getSwiper();
        if(this.openAction == 'permission-s') {
            $($('.tab-hd .mdl-button')[1]).click();
        }else if(this.openAction == 'permission-c'){
            $($('.tab-hd .mdl-button')[2]).click();
        }
        this.initDialog();
    }

    dialogClose() {
        this.dialog.close();
        this.getSwiper().slideTo(0);
        this.openAction = '';
        $('.tab-hd .active').removeClass('active');
        $($('.tab-hd .mdl-button')[0]).addClass('active');
    }

    delDialogOpen() {
        this.delDialog.showModal();
    }

    delDialogClose() {
        this.delDialog.close();
    }

    getSwiper() {
        if(!this.swiper) {
            this.swiper = new Swiper('.swiper-container', {
                direction: 'horizontal',
                initialSlide: 0,
                autoHeight: true,
                allowTouchMove: false,
            });
        }
        return this.swiper;
    }

    renderWebItem() {
        let str = ``;
        let itemKeyword = this.itemKeyword;
        (this.webItem || []).map((data, k) => {
            data = data.web;
            if(!data) return;
            let display = 'flex';
            let url = data.url;
            if(url.indexOf(itemKeyword) == -1 && data.username.indexOf(itemKeyword) == -1) {
                display = 'none';
            }
            if(!/\/$/.test(url)) {
                url = `${url}/`;
            }
            let host = url.match(/^http(s)?:\/\/(.*?)\//)[0];
            if(host) {
                host = host.replace(/\/$/,'');
            }
            str += `<div class="tr" style="display: ${display}">
                    <div class="td" style="width: 24.5%">
                        <div class="icon">
                            <img src="${data.favicon == 'NULL'?'https://www.google.com/images/branding/product/ico/googleg_lodp.ico':data.favicon}">
                        </div>
                        <a class="span" href="${data.url}" target="_blank" title="${data.url}">${host}</a>
                    </div>
                    <div class="td" style="width: 22.5%"><span>${data.username}</span></div>
                    <div class="td" style="width: 20.5%"><span>${data.remark}</span></div>
                    <div class="td" style="width: 10%"><span>${data.sharenum}</span></div>
                    <div class="td" style="width: 22.5%">
                        <div class="pass">
                            <input type="password" disabled value="${data.password}">
                            <button class="toggleRowPass mdl-button mdl-js-ripple-effect mdl-js-button mdl-button--icon">
                                <i class="iconfont icon-visibility-button"></i>
                            </button>
                        </div>
                        <button id="menu-lower-right-${k}" class="action-menu-button row-action mdl-button mdl-js-ripple-effect mdl-js-button mdl-button--icon">
                            <i class="iconfont icon-show-more-button-wit"></i>
                        </button>
                        <ul class="action-menu mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
                            for="menu-lower-right-${k}" data-key="${k}">
                            <li class="mdl-menu__item open-dialog" data-action="info">详情</li>
                            <li class="mdl-menu__item open-dialog" data-action="permission-s">查看权限</li>
                            <li class="mdl-menu__item open-dialog" data-action="permission-c">管理权限</li>
                            <li class="mdl-menu__item del-dialog">删除</li>
                        </ul>
                    </div>
                </div>`
        });
        $('.hb').html(str);
        componentHandler.upgradeElements($('.hb').get());
    }

    renderSharedUser() {
        let str = ``;
        (this.checkedData || []).map((data, k) => {
            let id = '';
            if(this.permissionType == 'read') {
                if(data.rule == 2) {
                    return
                }
                id = `ucheck-${k}`;
            }else if(this.permissionType == 'admin') {
                if(data.rule == 1) {
                    return
                }
                id = `ucheck-admin-${k}`;
            }
            let label = `<label data-key="${k}" class="">
                        <span class="mdl-checkbox__label">${data.typename}</span>
                    </label>`;
            if(this.editMode) {
                label = `<label data-key="${k}" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="${id}">
                        <input type="checkbox" id="${id}" class="mdl-checkbox__input">
                        <span class="mdl-checkbox__label">${data.typename}</span>
                    </label>`
            }
            str += `<li>
                    ${label}
                    <div class="u">${data.typeid}</div>
                </li>`
        });
        if(this.permissionType == 'read') {
            $('.rd-u-its').html(str);
        }else {
            $('.ad-u-its').html(str);
        }
        if(this.editMode) {
            componentHandler.upgradeElements(document.querySelectorAll('.u-its li'));
        }
    }
}

const cs = new Console();
