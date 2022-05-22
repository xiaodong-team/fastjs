// noinspection JSUnresolvedFunction

/*
* Fastjs Javascript Frame
*
* About this frame:
*   Version:v1.0.11
*   Author:XiaoDong Team-XiaoDong (xiaodong@indouyin.cn)
*   Contact-Us: xiaodong@indouyin.cn
*   Follow-Us: https://leetcode-cn.com/u/dy_xiaodong/
*              https://juejin.cn/user/3540872450829720/
*
* Frame license:
*   MIT License
*/

const FASTJS_CONFIG = {
    "version": "1.0.11",
    "newVersionCheck": true,
    "css": {
        "autoInstall": true,
        "url": "default"
    },
    "error": {
        "output": {
            "smallErrorOutput": true,
            "errorOutput": true,
            "seriousErrorOutput": true,
            "crashErrorOutput": "always on"
        },
        "ajax": {
            "urlNotSecurity": true,
            "checkTimeout": true
        },
        "other": {
            "outOfRange": true
        }
    },
    "log": {
        "fastjsInstallLog": true,
        "ajaxLog": true
    },
    "compiler": {
        "qualityInspection": true
    }
}

class app {
    constructor(appname, config) {
        this.appname = appname
        this.config = config
        return this;
    }

    push(selecter) {
        let $dom = document.querySelector(selecter)
        let appname = this.appname;
        let config = this.config;
        if ($dom.gethtml().search("{{ %s }}".replace("%s", appname)) !== -1) {
            $dom.html($dom.gethtml().replaceAll("{{ %s }}".replace("%s", appname), "<span fastjs-appname=\"%s\"></span>".replace("%s", appname)))
            $dom = $dom.querySelectorAll("*[fastjs-appname=\"%s\"]".replace("%s", appname))[0]
            config = Object.entries(config)
            fastjs.foreach(config, "as data", () => {
                // noinspection JSUnresolvedVariable
                if (typeof data[1] == "object") {
                    // noinspection JSUnresolvedVariable
                    data[1] = Object.entries(data[1]);
                    // noinspection JSUnresolvedVariable
                    fastjs.foreach(data[1], "as datadata", () => {
                        // noinspection JSUnresolvedVariable
                        $dom[data[0]][datadata[0]] = datadata[1];
                    })
                } else {
                    // noinspection JSUnresolvedVariable
                    $dom[data[0]] = data[1]
                }
            })
            $dom.attr("type", "fastjs-app")
            // noinspection JSUnresolvedFunction
            if (this.config.setup) {
                // noinspection JSUnresolvedFunction
                this.config.setup()
            }
            return $dom;
        }
    }
}

/*
 * What Can It Do?
 * This function can create a html element.
 *
 * How To Use?
 * 1.dom->tagname: The html dom tagname.Default value is div.
 *              exp: div
 *              exp: span
 * 2.dom->element: ID or Classname.
 *              exp: #id
 *              exp: .class
 *              exp: .class class2
 *
 * exp: let $dom = new dom("div", ".text")
 *      $("body").domAddEnd(dom)
 * exp: let $dom = new dom("div", "#id")
 *      $("body").domAddEnd(dom)
 */

class dom {
    constructor(tagname, element) {
        if (!tagname) {
            tagname = "div";
        }
        this.htmlDom = document.createElement(tagname);
        if (element != null && element.length > 1) {
            if (element[0] === ".") {
                this.htmlDom.className = element.substr(1);
            }
            if (element[0] === "#") {
                this.htmlDom.id = element.substr(1);
            }
        }
        return this.htmlDom;
    }
}

/*
 * What Can It Do?
 * This function create and send a ajax request.
 *
 * How To Use?
 * 1.ajax->url: The url need to send a request.
 *              exp: "https://fastjs.com.cn/hi.php"
 * 2.ajax->data: The data need to send.
 *              exp: null
 *              exp: [["username","123"],["password","aeh$%?3y9dc"]]
 * 3.ajax->callback: Javascript callback function.
 *              exp: ($result, $status)=>{console.log($result)}
 *              exp: null
 * 4.ajax->timeout: Request time out,In milliseconds,Default value is 5000.
 *              exp: null
 *              exp: 5000
 * 5.ajax->datatype: Request give back datatype,Default value is "auto"
 *              exp: null
 *              exp: "auto"
 *              exp: "text"
 *              exp: "json"
 *
 * exp: $ajax = new ajax("https://fastjs.com.cn/hi.php")
 *      $ajax.callback = ($result, $status)=>{
 *           console.log($result)
 *           console.log($status)
 *      }
 *      $ajax.get()
 * exp: $ajax = new ajax()
 *      $ajax.url = "https://fastjs.com.cn/hi.php"
 *      $ajax.callback = ($result, $status)=>{
 *           console.log($result)
 *           console.log($status)
 *      }
 *      $ajax.get()
 * exp: $ajax = new ajax()
 *      $ajax.url = "login.php"
 *      $ajax.data = [["username","admin"],["password","12345"]]
 *      $ajax.callback = result =>{
 *           console.log(result)
 *      }
 *      $ajax.post()
 */

// noinspection JSUnresolvedVariable
class ajax {
    constructor(url, data, callback, timeout, datatype) {
        this.url = url;
        this.data = data;
        this.callback = callback;
        if (!datatype) {
            this.datatype = "auto";
        } else if (datatype === "json") {
            this.datatype = "json";
        } else if (datatype === "text") {
            this.datatype = "text";
        } else {
            fastjs.throwError("[Fastjs] Error at ajax: Unknown data type")
            this.datatype = "auto";
        }

        if (this.timeout == null) {
            this.timeout = 5000;
        } else if (typeof timeout == "number") {
            if (FASTJS_CONFIG.error.ajax.checkTimeout) {
                if (100 < this.timeout && this.timeout <= 1000) {
                    fastjs.throwSmallError("[Fastjs] SmallError at ajax: this.timeout is a little bit small, it maybe will make a bad experience")
                } else if (0 < this.timeout && this.timeout <= 100) {
                    fastjs.throwError("[Fastjs] Error at ajax: this.timeout is too small, it will make a bad experience!")
                } else if (this.timeout === 0) {
                    fastjs.throwSeriousError("[Fastjs] SeriousError at ajax: this.timeout is too small, it will let ajax can't run!")
                    this.timeout = 1;
                }
            }
            this.timeout = timeout
        } else {
            fastjs.throwSeriousError("[Fastjs] SeriousError at ajax: Unknown timeout given")
            this.timeout = 5000;
        }

        if (!url) {
            this.url = null;
        }

        if (!data) {
            this.data = null;
        }

        if (!callback) {
            this.callback = null;
        }
    }

    // noinspection HttpUrlsUsage
    post() {
        if (this.timeout == null) {
            this.timeout = 5000;
        } else if (typeof this.timeout == "number") {
            if (FASTJS_CONFIG.error.ajax.checkTimeout) {
                if (100 < this.timeout && this.timeout <= 1000) {
                    fastjs.throwSmallError("[Fastjs] SmallError at ajax: this.timeout is a little bit small, it maybe will make a bad experience")
                } else if (0 < this.timeout && this.timeout <= 100) {
                    fastjs.throwError("[Fastjs] Error at ajax: this.timeout is too small, it will make a bad experience!")
                } else if (this.timeout === 0) {
                    fastjs.throwSeriousError("[Fastjs] SeriousError at ajax: this.timeout is too small, it will let ajax can't run!")
                    this.timeout = 1;
                }
            }
        }

        // FASTJS-ERROR
        if (!this.url || this.url.length < 1) {
            throw "[Fastjs] CrashError at ajax: Null data given"
        }

        // FASTJS-ERROR :: urlNotSecurity
        if (this.url.search("http://") !== -1) {
            fastjs.throwSmallError("[Fastjs] SmallError at ajax: The url given is not secure")
        }

        this.xhr = new XMLHttpRequest();

        let postdata = "";

        if (this.data != null) {
            postdata = this.data[0][0] + "=" + this.data[0][1];
            for (let i = 1; i <= this.data.length - 1; i++) {
                postdata = postdata + "&" + this.data[i][0] + "=" + this.data[i][1];
            }
        }

        if (this.datatype === "auto" || this.datatype === "text") {
            this.xhr.responseType = "text";
        } else {
            this.xhr.responseType = "json";
        }
        this.xhr.timeout = this.timeout;

        this.xhr.sendTimeout = setTimeout(() => {
            if (FASTJS_CONFIG.log.ajaxLog) {
                console.log("[Fastjs ajax] ajaxRequest to url %s is failed".replace("%s", this.url))
            }
            if (this.callback && typeof this.callback == "function") {
                this.callback("!failed", this.xhr.readyState)
            }
            this.result = "!failed";
        }, this.xhr.timeout)

        this.xhr.open("post", this.url);
        this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        this.xhr.onload = () => {
            clearTimeout(this.xhr.sendTimeout)
            let response = this.xhr.response;
            if (this.datatype === "auto") {
                try {
                    response = JSON.parse(response);
                } catch (e) {
                }
            }
            this.result = response;
            this.status = this.xhr.status;
            if (FASTJS_CONFIG.log.ajaxLog) {
                console.log("[Fastjs ajax] ajaxRequest to url %s is success".replace("%s", this.url))
            }
            if (this.callback && typeof this.callback == "function") {
                this.callback(response, 200)
            } else {
                if (FASTJS_CONFIG.log.ajaxLog) {
                    console.log("[Fastjs ajax] ajaxRequest to url %s is failed".replace("%s", this.url))
                }
                if (this.callback && typeof this.callback == "function") {
                    this.callback("!failed", this.xhr.readyState)
                }
                this.result = "!failed";
            }
        }

        this.xhr.send(postdata)

        return true;
    }

    get() {
        if (this.timeout == null) {
            this.timeout = 5000;
        } else if (typeof this.timeout == "number") {
            if (FASTJS_CONFIG.error.ajax.checkTimeout) {
                if (100 < this.timeout && this.timeout <= 1000) {
                    fastjs.throwSmallError("[Fastjs] SmallError at ajax: this.timeout is a little bit small, it maybe will make a bad experience")
                } else if (0 < this.timeout && this.timeout <= 100) {
                    fastjs.throwError("[Fastjs] Error at ajax: this.timeout is too small, it will make a bad experience!")
                } else if (this.timeout === 0) {
                    fastjs.throwSeriousError("[Fastjs] SeriousError at ajax: this.timeout is too small, it will let ajax can't run!")
                    this.timeout = 1;
                }
            }
        }

        if (!this.url || this.url.length < 1) {
            throw "[Fastjs] CrashError at ajax: Null data given"
        }

        if (this.url.search("https://") === -1) {
            fastjs.throwSmallError("[Fastjs] SmallError at ajax: The url given is not secure")
        }

        let url = this.url

        this.xhr = new XMLHttpRequest();

        if (this.data != null) {
            let urldata = "?" + this.data[0][0] + "=" + this.data[0][1];
            for (let i = 1; i <= this.data.length - 1; i++) {
                urldata = urldata + "&" + this.data[i][0] + "=" + this.data[i][1];
            }
            url = url + urldata;
        }

        if (this.datatype === "auto" || this.datatype === "text") {
            this.xhr.responseType = "text";
        } else {
            this.xhr.responseType = "json";
        }

        this.xhr.open("get", url);
        this.xhr.timeout = this.timeout;

        this.xhr.sendTimeout = setTimeout(() => {
            if (FASTJS_CONFIG.log.ajaxLog) {
                console.log("[Fastjs ajax] ajaxRequest to url %s is failed".replace("%s", this.url))
            }
            if (this.callback && typeof this.callback == "function") {
                this.callback("!failed", this.xhr.readyState)
            }
            this.result = "!failed";
        }, this.xhr.timeout)

        this.xhr.onload = () => {
            clearTimeout(this.xhr.sendTimeout)
            if (this.xhr.status === 200) {
                let response = this.xhr.response;
                if (this.datatype === "auto") {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {
                    }
                }
                this.result = response;
                this.status = this.xhr.status;
                if (FASTJS_CONFIG.log.ajaxLog) {
                    console.log("[Fastjs ajax] ajaxRequest to url %s is success".replace("%s", this.url))
                }
                if (this.callback && typeof this.callback == "function") {
                    this.callback(response, 200)
                }
            } else {
                if (FASTJS_CONFIG.log.ajaxLog) {
                    console.log("[Fastjs ajax] ajaxRequest to url %s is failed".replace("%s", this.url))
                }
                if (this.callback && typeof this.callback == "function") {
                    this.callback("!failed", this.xhr.readyState)
                }
                this.result = "!failed";
            }
        }

        this.xhr.send()

        return true;
    }
}

// noinspection DuplicatedCode,JSUnresolvedVariable
class fastjs {
    static setup() {
        /*
         * 1.You don't need to use this function.
         * 2.Frame need this function to run normally,if you don't know how does it work,please DON'T edit it.
         */
        window.js = fastjs;
        String.prototype.push = function ($strings) {
            let str = this
            if (typeof $strings === "string") {
                str = str.replaceAll("%s%", $strings)
            } else if (typeof $strings === "object") {
                // str foreach
                $strings.forEach((e, key) => {
                    if (key >= $strings.length) {
                        e = $strings[$strings.length - 1]
                        if (FASTJS_CONFIG.error.other.outOfRange) {
                            fastjs.throwSmallError("[Fastjs] Fastjs.String.setup: List out of range")
                        }
                    }
                    str = str.replace("%s%", e)
                })
            }
            return str;
        }
        Element.prototype.attr = function ($name, $value) {
            return fastjs.attr($name, $value, this);
        }
        Element.prototype.event_click = function ($event) {
            return fastjs.on($event, this, "onclick");
        }
        Element.prototype.event_blur = function ($event) {
            return fastjs.on($event, this, "onblur");
        }
        Element.prototype.event_focus = function ($event) {
            return fastjs.on($event, this, "onfocus");
        }
        Element.prototype.event_change = function ($event) {
            return fastjs.on($event, this, "onchange");
        }
        Element.prototype.event_input = function ($event) {
            return fastjs.on($event, this, "oninput");
        }
        Element.prototype.event_keyup = function ($event) {
            return fastjs.on($event, this, "onkeyup");
        }
        Element.prototype.event_keydown = function ($event) {
            return fastjs.on($event, this, "onkeydown");
        }
        Element.prototype.domAddEnd = function ($domadd) {
            return fastjs.domAddEnd($domadd, this);
        }
        Element.prototype.html = function ($html) {
            return this.innerHTML = $html;
        }
        Element.prototype.text = function ($text) {
            return this.innerText = $text;
        }
        Element.prototype.gethtml = function () {
            return this.innerHTML;
        }
        Element.prototype.gettext = function () {
            return this.innerText;
        }
        Element.prototype.next = function (selecter) {
            return fastjs.dom(selecter, this)
        }
        Element.prototype.then = function (callback) {
            if (callback === "string") {
                eval(callback)
            } else {
                callback(this)
            }
            return this
        }
        Array.prototype.add = function ($index, $key) {
            if (!$key && $key !== 0) {
                this.push($index)
            } else {
                if (this.length - 1 > $key) {
                    throw "[Fastjs] Fastjs.array.add.crashError: key is out of range"
                } else if ($key < 0) {
                    throw "[Fastjs] Fastjs.array.add.crashError: key is out of range"
                }
            }
            this.splice($key, 0, $index)
            return this;
        }
        Array.prototype.delete = function ($key, $num) {
            if (!$num) {
                if ($num === 0) {
                    fastjs.throwSmallError("[Fastjs code review] Method calls that could have been ignored: when $num == 0, you don't need to use function delete()")
                    return false;
                }
                $num = 1;
            }
            this.splice($key, $num)
            return this;
        }
        Array.prototype.resort = function () {
            let arr = this
            arr.sort()
            arr.reverse()
            return arr;
        }
        Array.prototype.sort()
        // Fastjs Dom Selecter Setup
        window.$ = function dom($selecter) {
            return fastjs.dom($selecter);
        }
        // noinspection JSValidateTypes
        this.createdom = {
            html: function createdom_html(tagname) {
                return fastjs.createdom_html(tagname);
            },
            carouselImg: function carouselImg(imgUrl, width, height, changeTime, transitionTime, position_x, position_y) {
                return fastjs.createdom_carouselImg(imgUrl, width, height, changeTime, transitionTime, position_x, position_y);
            }
        }
        if (FASTJS_CONFIG.css.autoInstall) {
            var fastjs_css_install
            fastjs_css_install = this.createdom.html('link');
            fastjs_css_install.href = FASTJS_CONFIG.css.url === "default" ? 'https://fastjs.com.cn/download/v%s/fastjs-%s.css'.replaceAll("%s", FASTJS_CONFIG.version) : FASTJS_CONFIG.css.url
            fastjs_css_install.rel = 'stylesheet';
            fastjs_css_install.type = 'text/css';
            $("head").domAddEnd(fastjs_css_install);
        }

        if (FASTJS_CONFIG.log.fastjsInstallLog) {
            console.log("Fastjs v%s already install successfully!".replaceAll("%s", FASTJS_CONFIG.version));
        }
    }

    static throwSmallError($text) {
        if (FASTJS_CONFIG.error.output.smallErrorOutput) {
            console.warn($text);
        }
    }

    static throwError($text) {
        if (FASTJS_CONFIG.error.output.errorOutput) {
            console.warn($text);
        }
    }

    static throwSeriousError($text) {
        if (FASTJS_CONFIG.error.output.seriousErrorOutput) {
            console.error($text);
        }
    }

    static domAdd($dom, $place, $where) {
        /*
         * 1.You don't need to use this function.
         * 2.Frame need this function to run normally,if you don't know how does it work,please DON'T edit it.
         */

        if ($where === "end") {
            $place.appendChild($dom)
        }
        if ($dom.fastjs_domType != null) {
            if ($dom.fastjs_domType === "fastjs::carousel-img") {
                this.foreach($dom.fastjs_urllist, "as $url=>$key", () => {
                    let child = this.createdom.html("div");
                    child.style.backgroundImage = "url(%s)".replace("%s", $url);
                    if ($dom.fastjs_position_x) {
                        child.style.backgroundPositionX = $dom.fastjs_position_x;
                    }
                    if ($dom.fastjs_position_y) {
                        child.style.backgroundPositionY = $dom.fastjs_position_y;
                    }
                    child.style.opacity = "0";
                    $dom.domAddEnd(child);
                    child.attr("playid", $key + 1)
                    child.attr("typeof", "carousel-img")
                    child.attr("show", "hide");
                })
                $dom.fastjs_change = function fastjs_change(playid) {
                    fastjs.carouselImg_change(playid, $dom);
                };
                $dom.childNodes[0].attr("show", "show");
                $dom.childNodes[0].style.opacity = "1";
                $dom.fastjs_intervalId = setInterval(() => {
                    fastjs.carouselImg_update($dom);
                }, $dom.fastjs_changeTime)
            }
        }
    }

    static domAddEnd($domadd, $place) {
        /*
         * What Can It Do?
         * This function can add a html element in a html element ending place, many fastjs html components RELY on this function,
         * if you use self contained js function (like:appendChild, insertBefore...), It maybe will let fastjs html components unable to work normally.
         *
         * How To Use?
         * 1.domAddEnd->domadd: The html element need to add.
         * 2.domAddEnd->place: You DO NOT NEED to give this parameter.
         *
         * exp: let carousel = fastjs.createdom.carouselImg(["https://img.xbase.ltd/background-1.jpg", "https://img.xbase.ltd/background-2.jpg"], "100%", 900, 10000, 1600, "70%", "50%");
         *      $("body").domAddEnd(carousel)
         * exp: let add = fastjs.createdom.html("div")
         *      $("body").domAddEnd(add)
         */

        return this.domAdd($domadd, $place, "end");
    }

    static createdom_html(tagname) {
        /*
         * What Can It Do?
         * This function can create a html element
         *
         * How To Use?
         * 1.domAddEnd->tagname: The html element tagname.
         *              exp: div
         *              exp: a
         */

        // noinspection UnnecessaryLocalVariableJS
        let dom = document.createElement(tagname);
        return dom;
    }

    static createdom_carouselImg(imgUrl, width, height, changeTime, transitionTime, position_x, position_y) {
        /*
         * What Can It Do?
         * This function can create a carouselImg very fastly.
         *
         * How To Use?
         * 1.createdom_carouselImg->imgUrl: The carouseImg(can use mp4,gif,svg...).
         *              exp: ["url", "url"]
         *              exp: "url"
         * 2.createdom_carouselImg->width: The width of img.Default value is "100%"
         *              exp: "100%"
         *              exp: "100px"
         *              exp: null
         * 3.createdom_carouselImg->height: The height of img.Default value is "100%"
         *              exp: "100%"
         *              exp: "100px"
         *              exp: null
         * 4.createdom_carouselImg->changeTime: The time between pictures automatically switch.Default value is 5000,Unit = ms.
         *              exp: 5000
         *              exp: null
         * 5.createdom_carouselImg->transitionTime: The time of every picture gradient effect.Default value is 1600,Unit = ms.
         *              exp: 1000
         *              exp: null
         * 6.createdom_carouselImg->position_x: The show area of img(can use mp4,gif,svg...).Default value is "auto".
         *              exp: "50%"
         *              exp: "null"
         * 7.createdom_carouselImg->position_y: The show area of img(can use mp4,gif,svg...).Default value is "auto".
         *              exp: "50%"
         *              exp: "null"
         *
         * exp: let carousel = fastjs.createdom.carouselImg(["https://img.xbase.ltd/background-1.jpg", "https://img.xbase.ltd/background-2.jpg"], "100%", 900, 10000, 1600, "70%", "50%");
         *      $("body").domAddEnd(carousel)
         * exp: let carousel = fastjs.createdom.carouselImg(["https://img.xbase.ltd/background-1.jpg", "https://img.xbase.ltd/background-2.jpg"]);
         *      $("body").domAddEnd(carousel)
         */
        if (!width) {
            width = "100%";
        }
        if (!height) {
            height = "100%";
        }
        if (!imgUrl) {
            throw "[Fastjs] Fastjs.createdom_carouselImg.error: imgUrl can't be null!";
        }
        if (typeof imgUrl == "string") {
            imgUrl = [imgUrl];
        }
        if (!changeTime) {
            changeTime = 5000;
        }
        if (!transitionTime) {
            transitionTime = 1600;
        }
        if (typeof width == "number") {
            width += "px";
        }
        if (typeof height == "number") {
            height += "px";
        }
        if (!position_x) {
            position_x = "auto";
        }
        if (!position_y) {
            position_y = "auto";
        }
        if (typeof position_x == "number") {
            position_x += "px";
        }
        if (typeof position_y == "number") {
            position_y += "px";
        }
        let dom = document.createElement("fastjs-carousel")
        dom.fastjs_domType = "fastjs::carousel-img";
        dom.fastjs_changeTime = changeTime;
        dom.fastjs_transitionType = "gradual";
        dom.fastjs_urllist = imgUrl;
        dom.fastjs_transitionTime = transitionTime;
        dom.fastjs_intervalId = null;
        dom.fastjs_timeoutId = null;
        dom.fastjs_playid = 1;
        dom.style.width = width;
        dom.style.height = height;
        dom.fastjs_position_x = position_x;
        dom.fastjs_position_y = position_y;
        dom.innerHTML = null;
        dom.className = "fastjs-carousel";
        return dom;
    }

    static carouselImg_change($newPlayid, $dom) {
        /*
         * What Can It Do?
         * This function can change carouselImg manually.
         *
         * How To Use?
         * 1.carouselImg_change->newPlayid: The playid of img need to change(Playid start with 1 increase progressively.)
         *                       exp: 1
         *                       exp: 2
         * 2.carouselImg_change->dom: You DO NOT NEED to give this parameter.
         */

        clearTimeout($dom.fastjs_timeoutId);
        clearInterval($dom.fastjs_intervalId);
        let $child = $dom.fastjs_playid - 2
        if ($child < 0) {
            $child = $dom.childNodes.length - 1;
        }
        $dom.childNodes[$child].attr("show", "hide")
        fastjs.carouselImg_update($dom, $newPlayid);
        $dom.fastjs_intervalId = setInterval(() => {
            fastjs.carouselImg_update($dom);
        }, $dom.fastjs_changeTime)
    }

    static carouselImg_update($dom, $newPlayid) {
        /*
         * 1.You don't need to use this function.
         * 2.carouselImg need this function to run normally,if you don't know how does it work,please DON'T edit it.
         */

        if ($dom.tagName !== "FASTJS-CAROUSEL") {
            throw "[Fastjs] Fastjs.carouselImg_update.error: unknown dom tagName!"
        }
        if (!$newPlayid) {
            $newPlayid = $dom.fastjs_playid + 1;
        }
        if ($newPlayid > $dom.childNodes.length) {
            $newPlayid = 1;
        }
        let $playid = $dom.fastjs_playid - 1
        $dom.fastjs_playid = $newPlayid;
        $newPlayid--;
        $dom.childNodes[$playid].style.transition = $dom.fastjs_transitionTime
        $dom.childNodes[$newPlayid].style.transition = $dom.fastjs_transitionTime
        $dom.childNodes[$playid].style.opacity = "0";
        $dom.fastjs_timeoutId = setTimeout(() => {
            $dom.childNodes[$playid].attr("show", "hide");
            $dom.childNodes[$newPlayid].attr("show", "show");
            setTimeout(() => {
                $dom.childNodes[$newPlayid].style.opacity = "1";
            }, 10)
        }, $dom.fastjs_transitionTime - 300)
    }

    static dom($selecter, $element) {
        /*
         * What Can It Do?
         * This function can supersede "document.getElementBy...", let you get the dom elements faster
         *
         * How To Use?
         *
         * 1.dom->selecter: The querySelector, very same with css selector
         *        exp: ".className"
         *        exp: "#id"
         *        exp: ".className[type=button]"
         *        exp: "body"
         *        exp: "div"
         *
         * exp: fastjs.dom("body").innerHTML="Hello World!"
         * exp: js.dom("body").innerHTML="Hello World!"
         * exp: $("body").innerHTML="Hello World!" [recommend]
         */

        if (!$element) {
            $element = document;
        }

        let selecter = [];
        let string = [];
        for (let i = 0; i < $selecter.length; i++) {
            string.push($selecter[i]);
        }
        let selecting = false
        let selecting_option = null
        let selecting_name = ""
        string.forEach((e) => {
            if (e === "." || e === "#" || e === "?") {
                if (selecting) {
                    selecter.push(
                        {
                            type: selecting_option,
                            index: selecting_name
                        }
                    )
                }
                selecting_name = ""
                selecting = true
                if (e === ".") {
                    selecting_option = "class"
                } else if (e === "#") {
                    selecting_option = "id"
                } else {
                    selecting_option = "tag"
                }
                selecting_name += e;
            } else {
                selecting_name += e;
            }
        })
        selecter.push(
            {
                type: selecting_option,
                index: selecting_name
            }
        )
        let result = null
        selecter.forEach((e, key) => {
            if (e.type === "tag" && e.index[0] === "?") {
                e.index = e.index.slice(1);
            }
            if (key !== selecter.length - 1) {
                if (!key) {
                    result = $element.querySelector(e.index)
                } else {
                    result = result.querySelector(e.index)
                }
            } else {
                if (e.type === "id" || e.index === "body" || e.index === "html" || e.index === "head") {
                    if (result) {
                        result = result.querySelector(e.index)
                    } else {
                        result = $element.querySelector(e.index)
                    }
                } else {
                    if (result) {
                        result = result.querySelectorAll(e.index)
                    } else {
                        result = $element.querySelectorAll(e.index)
                    }
                }
            }
        })
        return result
    }

    static on($event, $dom, $name) {
        /*
         * How To Use?
         *
         * 1.onclick->event: The querySelector, very same with css selector
         *        exp: ".className"
         *        exp: "#id"
         *        exp: ".className[type=button]"
         *        exp: "body"
         *        exp: "div"
         * 2.onclick->dom: You DO NOT NEED to give this parameter.
         *
         * exp: fastjs.dom("body").event_click("console.log('Hello World!')")
         * exp: js.dom("body").event_click(()=>{console.log(1+1))})
         * exp: $("body").event_click(["console.log('h')",()=>{console.log("i")},"console.log('!')"])
         */
        if (typeof $event == "function") {
            $dom[$name] = () => {
                // lambada to keep functionly
                $event();
            }
        } else if (typeof $event == "string") {
            $dom[$name] = () => {
                // lambada to keep functionly
                eval($event);
            }
        } else {
            if (!$event) {
                return false;
            }
            if ($event === "" || $event.length === 0) {
                return false;
            }
            $dom[$name] = () => {
                this.foreach($event, "as $function", () => {
                    if (typeof $function == "function") {
                        // noinspection JSUnresolvedFunction
                        $function()
                    } else {
                        eval($function)
                    }
                })
            }
        }
        return true;
    }

    static attr($name, $value, $dom) {
        /*
         * What Can It Do?
         * This function can operate att dom attribute easily, integrate delete,get,set in one function.
         *
         * How To Use?
         *
         * 1.attr->name: The name of Attribute
         *         exp: "type"
         *         exp: "name"
         *         exp: "id"
         * 2.attr->value: If attr->value is false,than it will return the value of Attribute.If attr->value is null,than it will delete the Attribute.Or else,it will set Attribute value.
         *         exp: false
         *         exp: null
         *         exp: "button"
         * 3.attr->dom: You DO NOT NEED to give this parameter.
         *
         * exp: fastjs.dom("#submit").attr("type", "button")
         * result: Attribute: type="button"
         * exp: js.dom("#submit").attr("type", false)
         * result: Attribute: type="button"
         *         Return: "button"
         * exp: $("#submit").attr("type", null)
         * result: Attribute: type=null
         */

        if (!$dom) {
            return false;
        }
        if (typeof $value == "number") {
            $value += "";
        }
        if (!$value && typeof ($value) == "boolean") {
            return $dom.getAttribute($name);
        } else if (typeof ($value) != "string") {
            if (!$dom.getAttribute($name)) {
                return false;
            }
            $dom.removeAttribute($name)
            return true;
        } else {
            $dom.setAttribute($name, $value)
            return true;
        }
    }

    static foreach($array, $condition, $javascript) {
        /*
         * What Can It Do?
         * This function can help you to traversal array easier,
         * Traversal array like php.
         *
         * How To Use?
         *
         * 1.foreach->array: Give a array.
         *            exp: [1,2,3]
         *            exp: $array
         * 2.foreach->condition: Give a condition that contain array and name of variables after each traversal.
         *            exp: " as value"
         *            exp: " as $value"
         *            exp: "= $value"
         *            exp: "as $value=>$key" [recommend]
         *            exp: "as value=>key" [recommend]
         *            WRONG exp: "AS value=>key"
         *            WRONG exp: "as value= >key"
         *            WRONG exp: "a s value=>key"
         *            WRONG exp: "as value>key"
         * 3.foreach->javascript: The javascript after every traversal.
         *            exp: ()=>{console.log($value)}
         *            exp: function (){console.log(key)}
         *
         * exp: var$array = ["hello"," ","world!"]
         *      fastjs.foreach($array, " as value", ()=>{
         *          $("body").innerHTML=$("body").innerHTML+value
         *      })
         * result: hello world!
         * exp: $result = 0
         *      js.foreach([3,1,3,4], "=$value", ()=>{
         *          $result = $result + $value
         *      })
         *      console.log($result)
         * result: 11
         */

        // Read condition
        let $operator_read = false;
        let $tovar_read_start = false;
        let $tovar_read = false;
        let $tovar = "";
        let $key_needle = false;
        let $key_start = false;
        let $key_name = null
        for (let $time = 0; $time <= $condition.length - 1; $time++) {
            if (!$operator_read) {
                if ($condition[$time] === "a") {
                    $operator_read = "as";
                    $time++;
                }
                if ($condition[$time] === "=") {
                    $operator_read = true;
                    $time++;
                }
            }
            if ($operator_read) {
                // noinspection JSIncompatibleTypesComparison
                if ($operator_read === "as") {
                    $operator_read = true;
                } else if (!$tovar_read_start) {
                    if ($condition[$time] === "=") {
                        $tovar_read_start = true;
                    } else if ($condition[$time] !== " ") {
                        $tovar += $condition[$time];
                    }
                } else if (!$tovar_read) {
                    if ($key_needle) {
                        if (!$key_start) {
                            if ($condition[$time] !== " ") {
                                $key_name = $condition[$time];
                                $key_start = true;
                            }
                        } else {
                            if ($condition[$time] !== " ") {
                                $key_name += $condition[$time];
                            }
                        }
                    } else {
                        if ($condition[$time] === ">") {
                            $key_needle = true;
                        }
                    }
                }
            }
        }
        // End
        if (!$array) {
            throw "[Fastjs] Fastjs.foreach.error: empty array!Check is using a 'let' to defined the array,if yes,please use 'var' to defined!";
        }
        if (typeof $array != "object") {
            throw "[Fastjs] Fastjs.foreach.error: unknown type!";
        }
        let lg = $array.length;
        if (!lg) {
            throw "[Fastjs] Fastjs.foreach.error: empty array!";
        }
        let $key;
        for (let $place = 0; $place <= lg - 1; $place++) {
            window[$tovar] = $array[$place];
            if ($key_needle) {
                $key = $place
                window[$key_name] = $key
            } else {
                $key = null
            }
            $javascript()
        }
        return true;
    }


    // noinspection JSUnusedLocalSymbols
    static urlget(url, data, callback, datatype) {
        console.log("[Fastjs quality inspection] fastjs.urlget is not support after v1.0.11")
    }


    // noinspection JSUnusedLocalSymbols
    static urlpost(url, data, callback, datatype) {
        console.log("[Fastjs quality inspection] fastjs.urlpost is not support after v1.0.11")
    }

    static copy(data) {
        /*
        * How To Use?
        *
        * 1.copy->data: The text that need to copy to user device,it can be a string or int.
        *
        * Becareful!
        * 1.This function maybe will refuse by browser if it is not trigger by user's mouse/keyboard event.
        *
        * exp: <a href="javascript:void(0);" onclick="fastjs.copy('12345')">Click to copy</a>
        * exp: <a href="javascript:fastjs.copy('abcde')">Click to copy</a>
        */

        var oInput = document.createElement('input');
        oInput.value = data;
        document.body.appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        oInput.remove();
    }

    static md5($text) {
        /*
        * How To Use?
        *
        * 1.md5->text: The text need to encrypt.
        *
        * Becareful!
        * 1.If you don't know how does it work CLEARLY,please DON'T edit it.
        */

        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        function G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        function H(x, y, z) {
            return (x ^ y ^ z);
        }

        function I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function FF(a, b, c, d, x, s, ac) {
            // noinspection JSSuspiciousNameCombination
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }

        function GG(a, b, c, d, x, s, ac) {
            // noinspection JSSuspiciousNameCombination
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }

        function HH(a, b, c, d, x, s, ac) {
            // noinspection JSSuspiciousNameCombination
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }

        function II(a, b, c, d, x, s, ac) {
            // noinspection JSSuspiciousNameCombination
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }

        function ConvertToWordArray(sMessage) {
            var lWordCount;
            var lMessageLength = sMessage.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (sMessage.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        }

        function WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        }

        var x;
        var k, AA, BB, CC, DD, a, b, c, d
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        x = ConvertToWordArray($text);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }
        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
        return temp.toLowerCase();
    }

    static getcookie(cookie) {
        /*
        * How To Use?
        *
        * 1.getcookie->cookie: The cookie name need to get.
        *
        * exp: fastjs.getcookie("userid")
        * exp: getcookie("loginid")
        */

        var name = cookie + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    static setcookie(name, value, sec, domain) {
        /*
        * How To Use?
        *
        * 1.getcookie->name: The cookie name.
        * 2.getcookie->value: The value of cookie.
        * 3.getcookie->sec: The time cookie expire(second).
        * 4.getcookie->domain: The domain cookie saved.
        */

        let d = new Date();
        d.setTime(d.getTime() + (sec * 1000));
        if (domain !== "") {
            domain = "domain=" + domain
        }
        // noinspection JSUnresolvedFunction
        document.cookie = name + "=" + value + ";expires=" + d.toGMTString() + ";path=/;" + domain;
    }

    static reload() {
        console.log("[Fastjs quality inspection] fastjs.reload is only recommend for developer test")
        fastjs.setup()
    }
}

function getcookie(cookie) {
    var name = cookie + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
}

function setcookie(name, value, sec, domain) {
    let d = new Date();
    d.setTime(d.getTime() + (sec * 1000));
    if (domain !== "") {
        domain = "domain=" + domain
    }
    // noinspection JSUnresolvedFunction
    document.cookie = name + "=" + value + ";expires=" + d.toGMTString() + ";path=/;" + domain;
}

fastjs.setup();