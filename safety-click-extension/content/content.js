// (async () => {

    const LIST_IGNORE_CHECK = [
        'www.facebook.com',
      //  'www.youtube.com',
        'mail.google.com',
        'www.google.com',
        'translate.google.com',
        'ogs.google.com',
        'developer.mozilla.org',
        'play.google.com',
        'www.bing.com'
    ]

    const FOOTER_NAME = '© 04-2021 LinhVan - Safety click Extension'

    const TAG_A_EVENT = [
        'click',
        'dbclick',
        'mousedown',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'mousewheel',
        'onwheel'
    ]

    chrome.storage.sync.get(['key'], function (result) {
        console.log('Value currently is ' + result.key);
    });

    let setTimeOutShowUpModal = null;

    let isPreventBodyclick = false;

    let previousLink = null;

    $(document).off("cut copy paste", "**");

    let intervalCheckDom = setInterval(() => {
        if (document.readyState === 'complete') { // The page is fully loaded }
            recreateNode(document.body, false)
            clearInterval(intervalCheckDom)
            isPreventBodyclick = true
        }
    }, 500)

    $(document).mouseover(function (e) {
        // Not check tag on trusted host
        if (LIST_IGNORE_CHECK.includes(window.location.hostname)) {
            return
        }
        /**
         * TODO check tag type is tag a or video => split to class TagA, TagVideo then use Factory Pattern
         */
        let currentElement = e.target
        if (e && currentElement.tagName === "A") {
            if (!currentElement.href && !currentElement.getAttribute("href-tmp-13123123")
                || /^(\s*javascript:|#)/i.test(currentElement.href)
                || /^(\s*javascript:|#)/i.test(currentElement.getAttribute("href-tmp-13123123"))) {
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
            //  console.log('href', href)

            let value = currentElement.text || currentElement.getAttribute("title") || 'Can not get name';
            if (previousLink == value) {
                if (setTimeOutShowUpModal) {
                    clearTimeout(setTimeOutShowUpModal)
                }
                setTimeOutShowUpModal = setTimeout(() => $('#modal-page-131203123').css({ display: 'none' }), 1500)
            } else {
                previousLink = value
                // build modal
                createModalUI({ href, value })
                calPositionModalWithPointer(e, null)
                // clear all event in currentElement
                //  recreateNode(currentElement, false)
            }
            //TODO with video tag
            // not allow  to directly click on tag video
        } else if (e && currentElement.tagName === "VIDEO" || currentElement.tagName === "IFRAME") {
            console.log("is video")
            if (currentElement.tagName === "IFRAME") {
                console.log("is video IFRAME")
                let videoElementInIframe = findVideoInIframe(e.target)
                videoElementInIframe && createModalUI({ href: 'video', value: 'video', element: videoElementInIframe, isVideo: true })
                videoElementInIframe && calPositionModalWithPointer(currentElement.parentElement, null)
            } else {
                createModalUI({ href: 'video', value: 'video', element: e, isVideo: true })
                calPositionModalWithPointer(e, null)
            }
        } else {
            let currentElement = e.target
            while (currentElement && currentElement.parentElement) {
                let parentElement = currentElement.parentElement;
                if (parentElement.tagName === "A") {

                    if (!parentElement.href && !parentElement.getAttribute("href-tmp-13123123")
                        || /^(\s*javascript:|#)/i.test(parentElement.href)
                        || /^(\s*javascript:|#)/i.test(parentElement.getAttribute("href-tmp-13123123"))) {
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

                    //console.log('href1', href)
                    let value = parentElement.getAttribute("title") || parentElement.text.trim() || 'Can not get name';
                    if (previousLink == value) {
                        if (setTimeOutShowUpModal) {
                            clearTimeout(setTimeOutShowUpModal)
                        }
                        setTimeOutShowUpModal = setTimeout(() => $('#modal-page-131203123').css({ display: 'none' }), 1500)
                    } else {
                        previousLink = value
                        // build modal
                        createModalUI({ href, value })
                        calPositionModalWithPointer(parentElement, e)
                        // clear all event in currentElement
                        //    recreateNode(parentElement, false)
                    }

                    break;
                    // TODO check video
                } else if (parentElement.tagName === "VIDEO" || parentElement.tagName === "IFRAME") {
                    console.log("is parentElement video")
                    if (parentElement.tagName === "IFRAME") {
                        let videoElementInIframe = findVideoInIframe(parentElement)
                        videoElementInIframe && createModalUI({ href: 'video', value: 'video', element: e, isVideo: true })
                        videoElementInIframe && calPositionModalWithPointer(videoElementInIframe, null)
                    } else {
                        createModalUI({ href: 'video', value: 'video', element: e, isVideo: true })
                        calPositionModalWithPointer(parentElement, e)
                    }
                }
                currentElement = parentElement
            }
        }
    })
    //})

    /**
     * TODO split class to check, refactoring
     */
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
                minWidth: '260px',
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

        /**
         * i dont know why but restrict using tag p because calulate height in js wrong
         */
        let content
        if (isPreventBodyclick) {
            content = `<div style='padding:4px;width:270px;'>
                <div class='show-link-content' title="click to show more link" id='show-value-link'>
                    <span><b><i>Title</i></b>: 
                        <span style='cursor:pointer;color:blue;'>${data.value}</span></span>
                </div>

                <div style='display:none;margin-top:2px;word-break:break-word;' id='show-more-link'>
                    <span><b><i>Link</i></b>: 
                        <a style='cursor:pointer;color:blue;' target='_self' href='${data.href}'>${data.href}</a></span>
                </div>

                <div style="height:10px"></div>
                <div style='display:inline-block;'>
                    <button type="button" class="btn btn-primary btn-xs" id='curr-tab'>current tab</button>
                    <span style='width:10px'></span>
                    <button type="button" class="btn btn-info btn-xs" id='new-tab'>new tab</button>
                    <span style='width:10px'></span>
                    <button type="button" class="btn btn-warning btn-xs" id='watch-video'>watch video</button>
                    <span style='width:10px'></span>
                    <button type="button" class="btn btn-alert btn-xs" id='delete-ads'>delete ads</button>
                </div>
            </div>`
        } else {
            content = `<div style='padding:5px;'>
                        <div style='word-wrap: break-word;'>
                            <span><b>Extension have analysis links done yet.</b></span> 
                        </div>
                        <div style="height:5px"></div>
                        <div class="modal-footer-trans">
                            <span><i>${FOOTER_NAME}</i></span>
                        </div>
                    </div>`
        }

        const importCss = `<style>
                                @import "${urlCssContent}";
                                @import "${urlCssBoostrap}";
                            </style>`;
        shadow.innerHTML = `${importCss}${content}`;

        // click button x on corner right of modal
        shadow.querySelector('#new-tab') && shadow.querySelector('#new-tab').addEventListener('click', e => handleClickModal(e, data.href, "_blank"), false);

        shadow.querySelector('#curr-tab') && shadow.querySelector('#curr-tab').addEventListener('click', e => handleClickModal(e, data.href, "_self"), false);

        shadow.querySelector('#delete-ads') && shadow.querySelector('#delete-ads').addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.cancelBubble = true;
        }, false);

        shadow.querySelector('#show-value-link') && shadow.querySelector('#show-value-link').addEventListener('click', e => {
            shadow.querySelector('#show-more-link').style.display = 'block';
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, false);

        if (data.isVideo) {
            shadow.querySelector('#watch-video') && shadow.querySelector('#watch-video').addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                data.element.play()
            }, false);
        }

    }

    handleClickModal = (e, href, type) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        window.open(encodeURI(href), type);
    }

    /**
     * TODO Should use class to check
     */
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
            marginBottom = parseFloat(style.marginBottom),
            marginTop = parseFloat(style.marginTop),

            borderTop = parseFloat(style.borderTopWidth),
            borderBottom = parseFloat(style.borderBottomWidth)
            borderLeft = parseFloat(style.borderLeftWidth),
            borderRight = parseFloat(style.borderRightWidth);

        let modalStyle = document.getElementById('modal-page-131203123').currentStyle
            || window.getComputedStyle(document.getElementById('modal-page-131203123'), null),

            paddingModalLeft = parseFloat(modalStyle.getPropertyValue('padding-left')),
            paddingModalRight = parseFloat(modalStyle.getPropertyValue('padding-right')),
            paddingModalTop = parseFloat(modalStyle.getPropertyValue('padding-top')),
            paddingModalBottom = parseFloat(modalStyle.getPropertyValue('padding-bottom')),

            marginModalLeft = parseFloat(modalStyle.getPropertyValue('margin-left')),
            marginModalRight = parseFloat(modalStyle.getPropertyValue('margin-right')),
            marginModalTop = parseFloat(modalStyle.getPropertyValue('margin-top')),
            marginModalBottom = parseFloat(modalStyle.getPropertyValue('margin-bottom')),

            borderModalLeft = parseFloat(modalStyle.getPropertyValue('border-left')),
            borderModalRight = parseFloat(modalStyle.getPropertyValue('border-right')),
            borderModalTop = parseFloat(modalStyle.getPropertyValue('border-top')),
            borderModalBottom = parseFloat(modalStyle.getPropertyValue('border-bottom'));

        // content width fix in element 
        const modalRealWidth = modalPosition.width > 270 ? 270 : modalPosition.width
        const modalRealHeight = modalPosition.height > 79 ? modalPosition.height : modalPosition.height - 19

        //  console.log('padding', paddingTop, paddingBottom, borderTop, borderBottom
        //   , 'padding modal', paddingModalLeft, paddingModalRight)

        const VIEW_PORT_HEIGHT = $(window).height()
        const VIEW_PORT_WIDTH = $(window).width();

        console.log('modalPosition', paddingLeft)
        // calculate position on modal
        // bottom position
        if (offsetPosEl.top < modalRealHeight) {
            console.log('run here')
            $('#modal-page-131203123').css({
                left: offsetPosEl.x + offsetPosEl.width / 2 - modalRealWidth / 2,
                top: offsetPosEl.y + offsetPosEl.height - borderBottom - paddingBottom
            });
        }

        // TODO need re check
        // top position (above with element)
        if (offsetPosEl.top > modalRealHeight) {
            console.log('run here1')
            $('#modal-page-131203123').css({
                left: offsetPosEl.x + offsetPosEl.width / 2 - modalRealWidth / 2,
                top: offsetPosEl.y - modalRealHeight + paddingTop + borderTop
            });
        }

        // right position
        if (offsetPosEl.left < modalRealWidth) {
            console.log('run here2')
            $('#modal-page-131203123').css({
                left: offsetPosEl.x + offsetPosEl.width - paddingLeft,
                top: offsetPosEl.y + offsetPosEl.height / 2 - modalRealHeight / 2
            });
        }

        // TODO need re check
        // left position (right with element)
        if ((VIEW_PORT_WIDTH - offsetPosEl.right) < modalRealWidth) {
            console.log('run here3', offsetPosEl, modalPosition)
            $('#modal-page-131203123').css({
                left: offsetPosEl.x - modalRealWidth + paddingLeft,
                top: offsetPosEl.y + offsetPosEl.height / 2 - modalRealHeight / 2
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

    /**
     * TODO detect Ads, should use class 
     */
    detectAds = () => {

    }

    recreateNode = (el, withChildren) => {
        if (!el) {
            return
        }
        if (withChildren) {
            el.parentNode.replaceChild(el.cloneNode(true), el);
        } else {
            let newEl = el.cloneNode(false);
            while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
            el.parentNode.replaceChild(newEl, el);
        }
    }

    /**
     * 
     */
    getChildNodes = currentNode => {
        if (!currentNode) {
            return
        }
        let nodeArr = []
        let getChildELements = (currentNode, level = 1) => {
            nodeArr.push({ level: level, node: currentNode })
            if (currentNode.hasChildNodes()) {
                for (let ind = 0; ind < currentNode.childNodes.length; ind++) {
                    let childNode = currentNode.childNodes[ind]
                    if (isNotBlack(childNode.innerHTML)) {
                        getChildELements(childNode, level + 1)
                    }
                }
            }
        }
        getChildELements(currentNode)
        return nodeArr
    }

    getPostionChildNodes = (currentNode) => {
        let nodeArr = getChildNodes(currentNode)
        let positionNodeArr = []
        for (let node of nodeArr) {
            positionNodeArr.push({ level: node.level, boundingClientRect: node.node.getBoundingClientRect() })
        }
        return positionNodeArr
    }

    isNotNullOrUndefined = val => val != undefined && val != null

    isNotBlack = val => isNotNullOrUndefined(val) && (val + '').trim() != ''

    console.log("chrome'", chrome)
    //chrome.tabs.onCreated.addListener((e) => console.log('open new tab'))

    findVideoInIframe = iframeElement => {
        if (!iframeElement) {
            return
        }
        iframeElement.contentWindow.postMessage('data', '*')
        const document = iframeElement.contentWindow.document;
        return document.getElementsByTagName("video")[0] || null
    }
//})