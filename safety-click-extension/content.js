//(async () => {

const LIST_IGNORE_CHECK = [
    'www.facebook.com',
    'www.youtube.com',
    'mail.google.com',
    'www.google.com',
    'translate.google.com',
    'ogs.google.com',
    'developer.mozilla.org',
    'play.google.com'
]

chrome.storage.sync.get(['key'], function (result) {
    console.log('Value currently is ' + result.key);
});

let setTimeOutShowUpModal = null;

let previousLink = null;

$(document).off("cut copy paste", "**");

$(document).ready(function (e) {
    recreateNode(document.getElementsByTagName("body")[0]);
});

$(document).mouseover(function (e) {

    if (LIST_IGNORE_CHECK.includes(window.location.hostname)) {
        return
    }

    let currentElement = e.target
    if (e && currentElement.tagName === "A") {
        if (!currentElement.href && !currentElement.getAttribute("href-tmp-13123123")
            || /^\s*javascript:/i.test(currentElement.href) || /^\s*javascript:/i.test(currentElement.getAttribute("href-tmp-13123123"))) {
            return
        }

        if ($('#modal-page-131203123') && $('#modal-page-131203123').length > 0) {
            $('#modal-page-131203123').css("display", "block");
        }
        let href
        if (currentElement.href) {
            currentElement.setAttribute("href-tmp-13123123", currentElement.href)
            href = currentElement.href
            currentElement.removeAttribute("href");
            currentElement.style.cursor = 'pointer'
        } else {
            href = currentElement.getAttribute("href-tmp-13123123");
        }
        console.log('href', href)

        let value = currentElement.text || currentElement.getAttribute("title") || 'Can not get name';
        if (previousLink == value) {
            if (setTimeOutShowUpModal) {
                clearTimeout(setTimeOutShowUpModal)
            }
            setTimeOutShowUpModal = setTimeout(() => $('#modal-page-131203123').css({ display: 'none' }), 1500)
        } else {
            previousLink = value
            createModalUI({ href, value })
            calPositionModalWithPointer(e, null)
        }
    } else {
        let currentElement = e.target
        while (currentElement && currentElement.parentElement) {
            let parentElement = currentElement.parentElement;
            if (parentElement.tagName === "A") {

                if (!parentElement.href && !parentElement.getAttribute("href-tmp-13123123")
                    || /^\s*javascript:/i.test(parentElement.href) || /^\s*javascript:/i.test(parentElement.getAttribute("href-tmp-13123123"))) {
                    return
                }

                if ($('#modal-page-131203123') && $('#modal-page-131203123').length > 0) {
                    $('#modal-page-131203123').css("display", "block");
                }
                let href
                if (parentElement.href) {
                    let att = document.createAttribute("href-tmp-13123123");
                    att.value = parentElement.href;
                    href = parentElement.href
                    parentElement.removeAttribute("href");
                    parentElement.setAttributeNode(att)
                    currentElement.style.cursor = 'pointer'
                } else {
                    href = parentElement.getAttribute("href-tmp-13123123");
                }

                console.log('href1', href)
                let value = parentElement.getAttribute("title") || parentElement.text.trim() || 'Can not get name';
                if (previousLink == value) {
                    if (setTimeOutShowUpModal) {
                        clearTimeout(setTimeOutShowUpModal)
                    }
                    setTimeOutShowUpModal = setTimeout(() => $('#modal-page-131203123').css({ display: 'none' }), 1500)
                } else {
                    previousLink = value
                    createModalUI({ href, value })
                    calPositionModalWithPointer(parentElement, e)
                }

                break;
            }
            currentElement = parentElement
        }
    }
})
//})

createModalUI = data => {
    if ($('#modal-page-131203123') && $('#modal-page-131203123').length > 0) {
        document.getElementById('modal-page-131203123').innerHTML = ''
        if (document.getElementById('popup-modal-click-safety')) {
            document.getElementById('popup-modal-click-safety').shadowRoot.innerHTML = ''
        }
    } else {
        $('body').append('<div id="modal-page-131203123"></div>');
        $('#modal-page-131203123').addClass('popup-trans');
        $('#modal-page-131203123').css({
            position: 'absolute',
            minWidth: '200px',
            maxWidth: '400px',
            height: 'auto',
            background: 'white',
            border: '1px solid rgba(0,0,0,.2)',
            borderRadius: '6px',
            boxShadow: '0 2px 7px rgba(0,0,0,.2)',
            zIndex: 100000
        });
    }

    const shadowDOM = '<div id="popup-modal-click-safety"></div>';
    $('#modal-page-131203123').append(shadowDOM);

    const urlCssContent = chrome.extension.getURL("/css/content.css");
    const urlCssBoostrap = chrome.extension.getURL("/assets/css/bootstrap.min.css");

    const shadow = document.querySelector('#popup-modal-click-safety').attachShadow({
        mode: 'open'
    });

    let content = `<div style='padding:5px;'>
      <div style='word-wrap: break-word;'>
         <p><b>Link</b>: <a style='cursor:pointer;' href='${data.href}' target='_self'>${data.value}</a></p> 
      </div>
      <div style='display:flex;'>
         <button type="button" id='curr-tab'>current tab</button>
         <span style='width:9px'></span>
         <button type="button" id='new-tab'>new tab</button>
         <span style='width:9px'></span>
         <button type="button" id='delete-ad'>delete ads</button>
      </div>
    </div>`

    const importCss = `<style>
                            @import "${urlCssContent}";
                            @import "${urlCssBoostrap}";
                        </style>`;
    shadow.innerHTML = `${importCss}${content}`;

    // click button x on corner right of modal
    shadow.querySelector('#new-tab').addEventListener('click', e => handleClickModal(e, data.href, "_blank"), false);
    shadow.querySelector('#curr-tab').addEventListener('click', e => handleClickModal(e, data.href, "_self"), false);
    shadow.querySelector('#delete-ad').addEventListener('click', e => {
        
    }, false);

    // document.addEventListener('click', function (event) {
    //     if(event.target.id != 'popup-modal-click-safety'){
    //         event.preventDefault();
    //         event.stopPropagation();
    //     }
    //     console.log('dâta', event.target.id)
    // }, true);
}

handleClickModal = (e, href, type) => {
    window.open(encodeURI(href), type);
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.cancelBubble = true;
}

calPositionModalWithPointer = (currentElement, event) => {
    let pointerPosition = null
    if (currentElement.target) {
        pointerPosition = { x: currentElement.pageX, y: currentElement.pageY }
    } else {
        pointerPosition = { x: event.pageX, y: event.pageY }
    }
    let element = currentElement.target ? currentElement.target : currentElement
    let offsetPosEl = offset(element)
    let modalPosition = document.getElementById('modal-page-131203123').getBoundingClientRect()

    if (setTimeOutShowUpModal) {
        clearTimeout(setTimeOutShowUpModal)
    }

    let style = element.currentStyle || window.getComputedStyle(element),
        paddingTop = parseFloat(style.paddingTop),
        paddingBottom = parseFloat(style.paddingBottom),
        paddingRight = parseFloat(style.paddingRight),
        paddingLeft = parseFloat(style.paddingLeft),
        marginLeft = parseFloat(style.marginLeft),
        marginRight = parseFloat(style.marginRight),
        borderTop = parseFloat(style.borderTopWidth),
        borderBottom = parseFloat(style.borderBottomWidth);

    let modalStyle = document.getElementById('modal-page-131203123').currentStyle
        || window.getComputedStyle(document.getElementById('modal-page-131203123'), null),
        paddingModalLeft = parseFloat(modalStyle.getPropertyValue('padding-left')),
        paddingModalRight = parseFloat(modalStyle.getPropertyValue('padding-right'))

    //  console.log('padding', paddingTop, paddingBottom, borderTop, borderBottom
    //   , 'padding modal', paddingModalLeft, paddingModalRight)

    const VIEW_PORT_HEIGHT = $(window).height()
    const VIEW_PORT_WIDTH = $(window).width();

    console.log('data', element.getBoundingClientRect())

    // calculate position on modal
    if (offsetPosEl.top < modalPosition.height) {
        console.log('run here')
        $('#modal-page-131203123').css({
            left: offsetPosEl.x + offsetPosEl.width / 2 - modalPosition.width / 2,
            top: offsetPosEl.y + offsetPosEl.height - borderBottom - paddingBottom
        });
    }

    if (offsetPosEl.top > modalPosition.height) {
        console.log('run here1')
        $('#modal-page-131203123').css({
            left: offsetPosEl.x + offsetPosEl.width / 2 - modalPosition.width / 2,
            top: offsetPosEl.y - modalPosition.height + paddingTop + borderTop + 10
        });
    }

    if (offsetPosEl.left < modalPosition.width) {
        console.log('run here2')
        $('#modal-page-131203123').css({
            left: offsetPosEl.x + offsetPosEl.width,
            top: offsetPosEl.y + offsetPosEl.height / 2 - modalPosition.height / 2
        });
    }

    if ((VIEW_PORT_WIDTH - offsetPosEl.right) < modalPosition.width) {
        console.log('run here3', modalPosition)
        $('#modal-page-131203123').css({
            left: offsetPosEl.x - modalPosition.width,
            top: offsetPosEl.y + offsetPosEl.height / 2 - modalPosition.height / 2
        });
    }
    setTimeOutShowUpModal = setTimeout(() => $('#modal-page-131203123').css({ display: 'none' }), 1500)
    $('#modal-page-131203123').mouseover(e => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (setTimeOutShowUpModal) {
            clearTimeout(setTimeOutShowUpModal)
        }
    })

    $('#modal-page-131203123').mouseleave(e => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setTimeOutShowUpModal = setTimeout(() => $('#modal-page-131203123').css({ display: 'none' }), 1500)
    })
}

let offset = el => {
    let rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //   let doc = document.documentElement;
    //  let left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    //  let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    return {
        x: rect.left + scrollLeft, y: rect.top + scrollTop,
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        width: rect.width,
        left: rect.left,
        right: rect.right,
        top: rect.top
    }
}

detectAds = () => {

}


recreateNode = (el, withChildren) => {
    if (withChildren) {
        el.parentNode.replaceChild(el.cloneNode(true), el);
    }
    else {
        var newEl = el.cloneNode(false);
        while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
        el.parentNode.replaceChild(newEl, el);
    }
}

console.log("chrome'", chrome)
//chrome.tabs.onCreated.addListener((e) => console.log('open new tab'))