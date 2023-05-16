class CustomCursor {

    constructor() {
        this._noCursor = ['label', 'input', 'textarea', 'select', 'iframe', '.blob-item'];
        this._cursor = document.querySelector("[data-cursor]"),
            this._onPointerMove = this._onPointerMove.bind(this),
            this._onPointerLeave = this._onPointerLeave.bind(this),
            this.init()
    }

    _onPointerLeave() {
        this._cursor.classList.add("is-hidden")
    }

    _onPointerMove(e) {
        let isTarget = false;

        for (let i=0; i < this._noCursor.length; i++) {
            if (e.target.closest(this._noCursor[i])) {
                isTarget = true;
            }
        }

        if (isTarget || "touch" === e.pointerType) {
            this._cursor.classList.add("is-hidden");
        } else {
            this._cursor.classList.remove("is-hidden");
            this._cursor.style.transform = `translate3D(${e.clientX}px, ${e.clientY}px, 0)`;

            this._videoCursor(e);
            this._audioCursor(e);
            this._inverseCursor(e);
            this._sliderCursor(e);
            this._blockInverse(e);
        }

    }

    _videoCursor(e) {
        if (e.target.closest("video")) {
            if (e.target.muted) {
                this._cursor.classList.add('mute');
                this._cursor.classList.remove('unmute');
            } else {
                this._cursor.classList.add('unmute');
                this._cursor.classList.remove('mute');
            }

        } else {
            this._cursor.classList.remove('mute');
            this._cursor.classList.remove('unmute');
        }
    }

    _audioCursor(e) {
        if (e.target.closest(".audio") && e.target.tagName !== 'AUDIO') {
            if (e.target.closest(".audio").querySelector("audio").paused) {
                this._cursor.classList.add('play');
                this._cursor.classList.remove('pause');
            } else {
                this._cursor.classList.add('pause');
                this._cursor.classList.remove('play');
            }

        } else {
            this._cursor.classList.remove('play');
            this._cursor.classList.remove('pause');
        }
    }

    _sliderCursor(e) {
        e.target.closest(".slider-item") ? this._cursor.classList.add('controls') : this._cursor.classList.remove('controls');
    }

    _inverseCursor(e) {
        e.target.closest(".inverse") ? this._cursor.classList.add('inverse') : this._cursor.classList.remove('inverse');
    }

    _blockInverse(e) {
        e.target.closest(".block-inverse") ? this._cursor.classList.add('cursor-inverse') : this._cursor.classList.remove('cursor-inverse');
    }

    init() {
        this._cursor && (document.body.addEventListener("pointermove", this._onPointerMove),
            document.body.addEventListener("pointerleave", this._onPointerLeave))
    }

}

new CustomCursor()


class VideoSound {
    constructor() {
        this._videos = document.querySelectorAll("video");
        this.init();
    }

    _changeSound(e) {
        this.muted = !this.muted;
        new CustomCursor()._videoCursor(e);
    }

    init() {
        this._videos.forEach(video => {
            video.addEventListener("click", this._changeSound)
        })
    }
}

new VideoSound()

class AudioPlayPause {
    constructor() {
        this._audioBlock = document.querySelectorAll(".audio");
        this.init();
    }

    _changePlayPause(e) {
        this._audio = this.querySelector("audio");

        this._audio.paused ? this._audio.play() : this._audio.pause();
        new CustomCursor()._audioCursor(e);
    }

    init() {
        this._audioBlock.forEach(audio => {
            audio.addEventListener("click", this._changePlayPause)
        })
    }
}

new AudioPlayPause()

class BlobItem {

    constructor() {
        this._blobLinks = document.querySelectorAll(".blob-item"),

            this._blob = null,
            this._activeLink = null,
            this._sizeCoefficientCurrent = null,
            this._baseDelayCurrent = null,
            this._timer = null,

            this._top = 0.1,
            this._left = 0.1,
            this._baseDelay = .8,
            this._touchEvent = !1,
            this._baseTheme = "#74F864",
            this._cursorSize = 20,
            this._cursorOffset = this._cursorSize / 2,
            this._onLinkMouseenter = this._onLinkMouseenter.bind(this),
            this._onLinkMouseleave = this._onLinkMouseleave.bind(this),
            this._onTouchStart = this._onTouchStart.bind(this),
            this._sizeCoefficient = 7;

        this.init()
    }

    _setParamBlob(e, leftOffset, topOffset) {
        var height = this._activeLink.getBoundingClientRect().height,
            width = this._activeLink.getBoundingClientRect().width,
            maxSize = Math.max(height, width);
        this._blob = e.target.querySelector('.blob-effect');

        this._blob.style.backgroundColor = this._activeLink.dataset.theme || this._baseTheme;
        this._blob.style.borderColor     = this._activeLink.dataset.theme || this._baseTheme;
        this._blob.style.left            = `${leftOffset}px`;
        this._blob.style.top             = `${topOffset}px`;
        this._blob.style.transform       = `scale(${maxSize / this._sizeCoefficientCurrent})`;
        this._blob.style.transition      = `transform ${this._baseDelayCurrent}s ease-in-out`;
        this._blob.style.borderRadius    = `${this._generateBorderRadius()}`;
    }


    _onTouchStart() {
        var e = this;
        this._touchEvent = !0,
            clearTimeout(this._timer),
            this._timer = setTimeout((function () {
                    e._touchEvent = !1
                }
            ), 500)
    }

    _generateBorderRadius() {
        return this._getRandomCorner(4) + '/ ' + this._getRandomCorner(4);
    }

    _getRandomCorner(counter) {
        let corner = '';
        for (let i = 0; i < counter; i++) {
            corner += `${Math.floor(40 * Math.random() + 80)}% `
        }
        return corner
    }

    init() {
        var e = this;
        this._blobLinks.length && this._blobLinks.forEach((function (el) {
                el.addEventListener("mouseenter", e._onLinkMouseenter),
                    el.addEventListener("mouseleave", e._onLinkMouseleave),
                    document.body.addEventListener("touchstart", e._onTouchStart)
            }
        ))
    }

    _onLinkMouseenter(e) {
        if (!this._touchEvent) {
            this._activeLink = e.target.closest(".blob-item");
            this._sizeCoefficientCurrent = this._activeLink.hasAttribute("data-scale-slow") ? this._sizeCoefficient / 2 : this._sizeCoefficient;
            this._baseDelayCurrent = this._activeLink.dataset.delay ? +this._activeLink.dataset.delay : this._baseDelay;

            let leftOffset = e.clientX - this._activeLink.getBoundingClientRect().left - this._cursorOffset,
                topOffset = e.clientY - this._activeLink.getBoundingClientRect().top - this._cursorOffset;
            this._setParamBlob(e, leftOffset, topOffset)
        }
    }

    _onLinkMouseleave(e) {
        if (!this._touchEvent) {

            let leftOffset = e.clientX - this._activeLink.getBoundingClientRect().left - this._cursorOffset,
                topOffset = e.clientY - this._activeLink.getBoundingClientRect().top - this._cursorOffset;

            this._blob.style.left = `${leftOffset}px`;
            this._blob.style.top = `${topOffset}px`;
            this._blob.style.borderRadius = `${this._generateBorderRadius()}`;
            this._blob.style.transition = `left ${this._left}s ease, top ${this._top}s ease, transform ${this._baseDelayCurrent}s ease`;
            this._blob.style.transform = "scale(0.01)";
        }
    }
}

new BlobItem();


class Scroll {
    constructor() {
        SmoothScroll({
            // Время скролла 400 = 0.4 секунды
            animationTime : 800,
            // Размер шага в пикселях
            stepSize : 75,

            // Дополнительные настройки:

            // Ускорение
            accelerationDelta : 30,
            // Максимальное ускорение
            accelerationMax : 2,

            // Поддержка клавиатуры
            keyboardSupport : true,
            // Шаг скролла стрелками на клавиатуре в пикселях
            arrowScroll : 50,

            // Pulse (less tweakable)
            // ratio of "tail" to "acceleration"
            pulseAlgorithm : true,
            pulseScale : 4,
            pulseNormalize : 1,

            // Поддержка тачпада
            touchpadSupport : true,
        })
    }
}

new Scroll();