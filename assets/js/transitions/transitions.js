Transitions = {
    init: function() {
        this._transitionList = document.getElementById('transition-list');
        this._transitionDemo = document.getElementById('transitions-demo');
        this._watchAgain = document.getElementById('watchAgain');
        this._image = 0;
        this._image2 = 1;
        this._imageSourceRoot = 'assets/js/transitions/';
        this._poster = document.getElementById('poster');
        this._requiresPerspective = ['cube', 'rotatein', 'horizontalflip', 'multiflip', 'unfold', 'iris'];
        if (AC.Detector.isiPad() || AC.Detector.isiPhone()) {
            this._requiresPerspective.push('toss');
        }
        this._requiresAnimationStarted = 'unfoldin1 unfoldin2 unfoldin3 slidein';
        this._requiresAnimationEnded = 'unfoldout2';
        this._ignoreAnimationEnds = 'rotate1 multiflip1 multiflip2 multiflip3 unfoldout1 unfoldout2 unfoldin1 unfoldin2 slideout';
        this._needCoreGraphics = ['tCube', 'tRotatein', 'tHorizontalflip', 'tMultiflip', 'tUnfold'];
        this._hideFancyAnimations();
        this._transitionList.addEventListener('click', this.setTransition.bind(this), false);
        this._transitionDemo.addEventListener('webkitAnimationStart', this._demoAnimationDidStart.bind(this), false);
        this._transitionDemo.addEventListener('webkitAnimationEnd', this._demoAnimationDidEnd.bind(this), false);
        this._watchAgain.addEventListener('click', this.watchTransitionAgain.bind(this), false);
        var preloads = ['circle-mask.png', 'showcase_transitions_001.jpg', 'showcase_transitions_002.jpg', 'showcase_transitions_003.jpg', 'showcase_transitions_004.jpg', 'showcase_transitions_005.jpg', 'showcase_transitions_006.jpg', 'showcase_transitions_007.jpg', 'showcase_transitions_008.jpg', 'showcase_transitions_009.jpg'];
        this._preloadImages(preloads);
    },
    didShow: function() {
        this.init();
    },
    willHide: function() {
        this._transitionList.removeEventListener('click', this.setTransition.bind(this), false);
        delete this._transitionList;
        delete this._poster;
    },
    _swapImages: function(demo) {
        var direction = 1;
        var incoming = demo.getElementsByClassName('incoming');
        var outgoing = demo.getElementsByClassName('outgoing');
        var gallery = ['showcase_transitions_001.jpg', 'showcase_transitions_002.jpg', 'showcase_transitions_003.jpg', 'showcase_transitions_004.jpg', 'showcase_transitions_005.jpg', 'showcase_transitions_006.jpg', 'showcase_transitions_007.jpg', 'showcase_transitions_008.jpg', 'showcase_transitions_009.jpg'];
        this._image = (this._image == 8) ? 0 : this._image + direction;
        this._image2 = (this._image2 == 8) ? 0 : this._image + 1;
        for (var i = 0; i < incoming.length; i++) {
            var incomingImage = incoming[i].getElementsByTagName('img');
            for (var n = 0; n < incomingImage.length; n++) {
                incomingImage[n].src = this._imageSourceRoot + gallery[this._image2];
            }
        }
        for (var i = 0; i < outgoing.length; i++) {
            var outgoingImage = outgoing[i].getElementsByTagName('img');
            for (var n = 0; n < outgoingImage.length; n++) {
                outgoingImage[n].src = this._imageSourceRoot + gallery[this._image];
            }
        }
        this._poster.firstChild.src = this._imageSourceRoot + gallery[this._image2];
    },
    _preloadImages: function(images) {
        var preloaded = [],
            loaded = [],
            amount = images.length;
        for (var i = amount - 1; i >= 0; i--) {
            preloaded[i] = new Image();
            preloaded[i].src = 'assets/js/transitions/' + images[i];
            preloaded[i].observe('load', function(loaded, i) {
                loaded[i] = true;
                if (loaded.length == amount) {
                    this._transitionList.style.opacity = 1;
                }
            }.bind(this, loaded, i))
        };
        preloaded = null;
    },
    _demoAnimationDidStart: function(event) {
        if (this._requiresAnimationStarted.indexOf(event.animationName) > -1) {
            this._transitionDemo.className += ' started';
        }
    },
    _demoAnimationDidEnd: function(event) {
        if (this._ignoreAnimationEnds.indexOf(event.animationName) == -1) {
            removeClassName(this._poster, 'inactive');
            removeClassName(this._transitionList, 'active');
            removeClassName(this._transitionDemo, 'perspective');
            removeClassName(this._demo, 'active');
            removeClassName(this._watchAgain, 'active');
            this._demo = null;
            this._active = false;
            addClassName(this._watchAgain, ' loaded');
        } else if (this._requiresAnimationEnded.indexOf(event.animationName) > -1) {
            this._transitionDemo.className += ' ended';
        }
    },
    _hideFancyAnimations: function() {
        if (!isTransform3DAvailable()) {
            for (var i = this._needCoreGraphics.length - 1; i >= 0; i--) {
                document.getElementById(this._needCoreGraphics[i]).remove();
            }
        }
    },
    watchTransitionAgain: function(e) {
        e.preventDefault();
        this.setTransitionForId(this._selectedTransition);
    },
    setTransition: function(e) {
        e.preventDefault();
        this._selectedTransition = e.target.id;
        this.setTransitionForId(this._selectedTransition);
    },
    setTransitionForId: function(selectedTransition) {
        if (this._active) return;
        removeClassName(this._transitionDemo, 'started');
        removeClassName(this._transitionDemo, 'ended');
        this._active = true;
        this._selectedTransition = selectedTransition;
        var demoFromSelectedTransition = this._selectedTransition.substr(1).toLowerCase();
        var demo = document.getElementById(demoFromSelectedTransition);
        if (demo) {
            addClassName(this._transitionList, 'active');
            addClassName(this._watchAgain, 'active');
            addClassName(demo, 'active');
            addClassName(this._poster, 'inactive');
            if (this._requiresPerspective.indexOf(demo.id) >= 0) {
                addClassName(this._transitionDemo, 'perspective');
            }
            this._swapImages(demo);
            this._demo = demo;
            AC.Tracking.trackClick({
                prop3: AC.Tracking.pageName() + ' - ' + demo.id
            }, this, 'o', AC.Tracking.pageName() + ' - ' + demo.id);
        }
    }
}
if (!window.isLoaded) {
    window.addEventListener("load", function() {
        Transitions.didShow();
    }, false);
}
