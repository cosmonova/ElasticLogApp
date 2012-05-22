Function.prototype.bind = function() {
    if (arguments.length < 2 && arguments[0] === undefined) {
        return this;
    }
    var thisObj = this,
        args = Array.prototype.slice.call(arguments),
        obj = args.shift();
    return function() {
        return thisObj.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
    };
};
Function.bind = function() {
    var args = Array.prototype.slice.call(arguments);
    return Function.prototype.bind.apply(args.shift(), args);
}
function Gallery() {};
Gallery.prototype.imageSrcs = [
    "assets/js/gallery/polo1b-small.png",
    "assets/js/gallery/polo1.jpg",
    "assets/js/gallery/polo2b-small.png",
       "assets/js/gallery/polo2.jpg",
    "assets/js/gallery/polo3b-small.png",
       "assets/js/gallery/polo3.jpg",
    "assets/js/gallery/polo4b-small.png",
       "assets/js/gallery/polo4.jpg",
    "assets/js/gallery/polo5b-small.png",
      "assets/js/gallery/polo5.jpg",
    "assets/js/gallery/polo6b-small.png",
       "assets/js/gallery/polo6.jpg",
    "assets/js/gallery/polo7b-small.png",
       "assets/js/gallery/polo7.jpg",
    "assets/js/gallery/polo8b-small.png",
       "assets/js/gallery/polo8.jpg",
    "assets/js/gallery/polo9b-small.png",
       "assets/js/gallery/polo9.jpg",
    "assets/js/gallery/polo10b-small.png",
       "assets/js/gallery/polo10.jpg",
    "assets/js/gallery/polo11b-small.png",
       "assets/js/gallery/polo11.jpg",
    "assets/js/gallery/polo12b-small.png",
       "assets/js/gallery/polo12.jpg"
    ]
Gallery.prototype.init = function(elementSel, nextSel, prevSel, width, height) {
    var self = this;
    this._isClose = false;
    this._twice = false;
    this._demoHeight = height;
    this._demoWidth = width;
    this._elementSel = elementSel;
    this._nextSel = nextSel;
    this._prevSel = prevSel;
    var caro = document.querySelector('#carousel');
    var figures = caro.getElementsByTagName("figure"),
        iFigure;
    var navFragment = document.createDocumentFragment();
    var link = document.createElement("a");
    link.href = "#";
    link.className = "prev";
    link.appendChild(document.createTextNode("Prev"));
    navFragment.appendChild(link);
    link = document.createElement("a");
    link.href = "#";
    link.className = "next";
    link.appendChild(document.createTextNode("Next"));
    navFragment.appendChild(link);
    for (var i = 0, countI = figures.length, j = 0;
    (iFigure = figures[i]); i++) {
        var img = new Image();
        img.src = this.imageSrcs[j];
        iFigure.appendChild(img);
        img.className = "blur";
        j++;
        img = new Image();
        img.src = this.imageSrcs[j];
        iFigure.appendChild(img);
        img.className = "noBlur";
        j++;
        iFigure.appendChild(navFragment.cloneNode(true));
    }
    this._galleryDemoClickHandler = function() {
        var caro = document.querySelector('#carousel').className;
        if (self._isClose == true && self._twice == true && (caro == 'scatter' || caro == 'grid2d')) {
            var arr = document.querySelectorAll('#stage figure');
            var x = arr.length;
            for (var i = 0; i < x; i++) {
                if (arr[i].className == 'closeup') {
                    arr[i].style.zIndex = 5;
                    arr[i].addEventListener('webkitTransitionEnd', function() {
                        this.style.zIndex = '';
                        this.removeEventListener('webkitTransitionEnd', arguments.callee, false);
                    }, false);
                }
                arr[i].className = "";
            }
            self._isClose = false;
            self._twice = false;
            arr = null;
        }
        else if ((caro == 'scatter' || caro == 'grid2d') && self._isClose == true) {
            self._twice = true;
        }
    }
    document.querySelector('#gallery-demo').addEventListener('click', this._galleryDemoClickHandler, false);
    this.construct();
    this._shuffleButtonElement = document.querySelector('#shuffleButton');
    document.querySelector('#gallery-type').onchange = function() {
        window.gallery.trackInteraction(document.querySelector('#gallery-type').value);
        document.querySelector('#carousel').className = this.value;
        var figures = document.querySelectorAll('#stage figure');
        var i, j = figures.length;
        var shuffle = document.querySelector('#shuffleButton');
        if (this.value == 'scatter') {
            window.gallery.shuffle();
            if (shuffle) {
                shuffle.style.display = 'inline';
            }
            for (i = 0; i < j; i++) {
                figures[i].className = '';
            }
        }
        else {
            if (shuffle) {
                shuffle.style.display = 'none';
            }
            for (i = 0; i < j; i++) {
                figures[i].style.webkitTransform = '';
                figures[i].className = '';
            }
        }
        figures = null;
        shuffle = null;
        window.gallery.clearCloseUp();
    }
    if (this._shuffleButtonElement) {
        this._shuffleButtonElement.style.display = 'none';
        this._shuffleButtonElement.onclick = function() {
            self.shuffle();
            window.gallery.trackInteraction('Shuffle');
        }
    }
    if (AC.Detector.isiPad() || AC.Detector.isMobile()) {
        addClassName(document.querySelector('#gallery-demo'), 'ipad');
    }
    else {
        addClassName(document.querySelector('#gallery-demo'), 'notMobile');
    }
    if (!isTransform3DAvailable()) {
        var galType = document.querySelectorAll('#gallery-type option');
        var len = galType.length;
        for (var i = 0; i < len; i++) {
            if (galType[i].value == 'hori3d' || galType[i].value == 'vert3d') {
                document.querySelector('#gallery-type').removeChild(galType[i]);
            }
        }
        galType = null;
    }
    return this;
}
Gallery.prototype.construct = function() {
    this.setupListeners();
}
Gallery.prototype.didShow = function() {
    this.init('#stage figure', '.prev', '.next', '900', '601');
}
Gallery.prototype.willHide = function() {
    document.querySelector('#gallery-demo').removeEventListener('click', this._galleryDemoClickHandler, false);
    delete document.querySelector('#gallery-type').onchange;
    delete this._shuffleButtonElement.onclick;
    delete this._shuffleButtonElement;
    var prevs = document.querySelectorAll(this._prevSel);
    for (var i = 0; i < prevs.length; i++) {
        prevs[i].removeEventListener('click', this._prevHandler, false);
    }
    prevs = null;
    var nexts = document.querySelectorAll(this._nextSel);
    for (var i = 0; i < nexts.length; i++) {
        nexts[i].removeEventListener('click', this._nextHandler, false);
    }
    nexts = null;
    var elems = document.querySelectorAll(this._elementSel);
    for (var i = 0; i < elems.length; i++) {
        elems[i].removeEventListener('click', this._clickHandler, false);
    }
    elems = null;
    var caro = document.querySelector('#carousel');
    var images = caro.getElementsByTagName("figure"),
        image;
    for (var i = 0;
    (image = images[i]); i++) {
        image.parentNode.removeChild(image);
    }
}
Gallery.prototype.setupListeners = function() {
    var self = this;
    var scope = this,
        prevs = document.querySelectorAll(this._prevSel);
    this._prevHandler = function(event) {
        this.movePrev();
        event.stopPropagation();
        event.preventDefault();
    }.bind(this);
    for (var i = 0; i < prevs.length; i++) {
        prevs[i].addEventListener('click', this._prevHandler, false);
    }
    prevs = null;
    var nexts = document.querySelectorAll(this._nextSel);
    this._nextHandler = function(event) {
        this.moveNext();
        event.stopPropagation();
        event.preventDefault();
    }.bind(this);
    for (var i = 0; i < nexts.length; i++) {
        nexts[i].addEventListener('click', this._nextHandler, false);
    }
    nexts = null;
    this._clickHandler = function(event) {
        var arr = document.querySelectorAll(self._elementSel);
        if (event.currentTarget.parentNode.parentNode.className == 'grid2d' || event.currentTarget.parentNode.parentNode.className == 'scatter') {
            if (self._isClose != true) {
                for (var i = 0; i < arr.length; i++) {
                    if (event.currentTarget == arr[i]) {
                        arr[i].className = 'closeup';
                        window.gallery.trackInteraction('Closeup');
                    }
                    else {
                        arr[i].className = 'background';
                    }
                }
                self._isClose = true;
                self._twice = false;
            }
        }
        else {
            var caro = document.querySelector('#carousel').className;
            if (caro != 'grid2d' && caro != 'scatter') {
                var center = Math.floor(arr.length / 2);
                var j = 0;
                center = 7;
                while (event.currentTarget != arr[j++]) {}
                var diff = Math.abs(center - j);
                while (diff-- != 0) {
                    if (center > j) {
                        self.moveNext();
                    }
                    else {
                        self.movePrev();
                    }
                }
            }
        }
        arr = null;
    }
    var elems = document.querySelectorAll(this._elementSel);
    for (var i = 0; i < elems.length; i++) {
        elems[i].addEventListener('click', this._clickHandler, false);
    }
    elems = null;
}
Gallery.prototype.preloadImages = function() {
    var imgs = document.querySelectorAll('#stage figure img');
    var figures = document.querySelectorAll('#stage figure');
    var i, j = imgs.length;
    var arr = new Array(12);
    var arr2 = new Array(12);
    for (i = 0; i < j; i++) {
        arr[i] = new Image();
        arr2[i] = new Image();
        arr[i].src = imgs[i].src;
        var temp = imgs[i].src.replace(/.jpg/, 'b.png');
        arr2[i].src = temp;
    }
}
Gallery.prototype.movePrev = function() {
    var node = document.querySelector(this._elementSel);
    node.parentNode.appendChild(node);
    node = null;
    this.trackInteraction('Next');
};
Gallery.prototype.moveNext = function() {
    var nodeList = document.querySelectorAll(this._elementSel);
    var node = nodeList[nodeList.length - 1];
    nodeList[0].parentNode.insertBefore(node, nodeList[0]);
    nodeList = null;
    this.trackInteraction('Previous');
};
Gallery.prototype.setTransform = function(element, x, y, z, angle, scale) {
    var transform = "translate3d(" + (x - 80) + "px, " + (y - 80) + "px, " + z + "px)";
    transform += " rotate(" + angle + "deg) ";
    transform += " scale(" + scale + ")";
    transform += " translateZ(1000px)"
    element.style.webkitTransform = transform;
};
Gallery.prototype.shuffle = function() {
    var elements = document.querySelectorAll('#stage figure'),
        demoWidth = this._demoWidth,
        demoHeight = this._demoHeight,
        i, j = elements.length;
    for (i = 0; i < j; i++) {
        var xpos = 0.1 * demoWidth - 100 + Math.random() * (demoWidth - 330) * 0.8;
        var ypos = 0.1 * demoHeight - 50 + Math.random() * (demoHeight - 300) * 0.8;
        var angle = -45 + Math.random() * 90;
        var zex = Math.round(0 + Math.random() * 10);
        this.setTransform(elements[i], xpos, ypos, 0, angle, .5);
    }
}
Gallery.prototype.clearCloseUp = function() {
    this._isClose = false;
    this._twice = false;
}
Gallery.prototype.trackInteraction = function(clickName) {
    AC.Tracking.trackClick({
        prop3: AC.Tracking.pageName() + ' - ' + clickName
    }, this, 'o', AC.Tracking.pageName() + ' - ' + clickName);
}
Gallery.init = function() {
    window.gallery = (new Gallery);
    if (!window.isLoaded) {
        window.gallery.didShow();
    }
}
if (window.isLoaded) {
    Gallery.init();
}
else {
    window.addEventListener('load', Gallery.init, 'false');
}
