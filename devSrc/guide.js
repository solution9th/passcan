/**
 * Created by zhengliuyang on 2018/8/21.
 */
import $ from 'jquery';

class Guide {
    constructor() {
        this.status = false;
        this.pageDidMount();
    }

    pageDidMount() {
        $(document).on('click', '#install', () => {
            if (!chrome.hasOwnProperty('webstore')) return;
            this.loading(true);
            let link = document.createElement('link');
            link.rel = 'chrome-webstore-item';
            link.href = 'https://chrome.google.com/webstore/detail/ilbddbbikgbfohimdbkegcminkeagpao';
            document.head.appendChild(link);
            chrome.webstore.install('https://chrome.google.com/webstore/detail/ilbddbbikgbfohimdbkegcminkeagpao', () => {
                console.log('安装成功');
                this.status = true;
                this.handleInstall();
            }, (e) => {
                console.log(e)
                console.log('安装失败');
                this.status = true;
                this.handleInstall();
            })
        });
        $(document).on('click', '#localInstall', () => {
            $('.local-guide-panel').hide();
            $('.local-install-panel').css('display', 'flex');
        })
    }

    handleInstall() {
        this.loading(false);
        if(this.status) {
            $('.guide-panel').hide();
            $('.install-panel').css('display', 'flex');
            $('.install-panel .step-1').hide();
            $('.install-panel .step-2').show();
        }else {
            $('.guide-panel').hide();
            $('.local-guide-panel').css('display', 'flex');
        }
    }


    loading(state) {
        if (state) {
            $('.guide-panel .logo').hide();
            $('.wait').show();
            $('#install').attr('disabled', 'disabled');
        } else {
            $('.guide-panel .logo').show();
            $('.wait').hide();
            $('#install').removeAttr('disabled');
        }
    }
}

const guide = new Guide();
