class Detector {
    $video = null
    $message = null

    constructor(config){
        
    }

    init(){
        document.addEventListener('DOMContentLoaded', this.contentLoaded.bind(this))
    }

    contentLoaded(){
        this.$message = this.createMessage()
        this.$video = document.querySelector('video')

        this.$video.addEventListener('loadedmetadata', this.initSCD.bind(this))

        this.$video.addEventListener('scenechange', event => {
            this.changeFrames()
        })
    }
    initSCD(){
        let d = Scd(this.$video, {
            mode: 'PlaybackMode',
        })
        
        d.init()
        d.start()
    }

    changeFrames(){
        this.visibleMessage()
    }

    createMessage(){
        const $message = document.createElement('div')

        $message.classList.add('ext-message')
        $message.insertAdjacentHTML('beforeend', /*html*/`
            <span>Warning message</span>
        `)
        document.querySelector('#content').appendChild($message)
        
        return $message
    }

    hiddenMessage(time = 0){
        setTimeout(() => {
            this.$message.classList.remove('active')
        }, time)
    }

    visibleMessage(){
        this.$message.classList.add('active')
        this.hiddenMessage(3000)
    }
}

function detector(config){
    return new Detector(config)
}


detector().init()