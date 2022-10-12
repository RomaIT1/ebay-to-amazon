function middleValueArray(list){
    let sumNumbers = 0

    list.forEach(num => {
        sumNumbers += num
    })

    const middleValue = sumNumbers / list.length

    return Math.round(middleValue)
}


class Detector {
    $video = null
    $message = null
    timeOutMessage = null

    volumePoint = []
    pixelPoint = []

    constructor(config){
        
    }

    init(){
        document.addEventListener('DOMContentLoaded', this.contentLoaded.bind(this))
    }

    contentLoaded(){
        //* Create window message
        this.$message = this.createMessage()

        //* Get YouTube video html element
        this.$video = document.querySelector('video')

        //* Get detector canvas
        this.$volumeCanvas = document.querySelector('.volume-detector__canvas')
        this.$framesCanvas = document.querySelector('.frames-detector__canvas')

        //* Prev volume value (default - 0)
        let prevVolumeValue = 0

        //* Audio API
        const audioCtx = new AudioContext()
        const src = audioCtx.createMediaElementSource(this.$video)
        const analyser = audioCtx.createAnalyser()

        analyser.connect(audioCtx.destination)
        src.connect(analyser)

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyser.getByteFrequencyData(dataArray)

        analyser.fftSize = 256

        let buffer_length = analyser.frequencyBinCount
        var data_array = new Uint8Array(buffer_length)

        //* Change volume video
        let renderFrame = () => {
            requestAnimationFrame(renderFrame)

            analyser.getByteFrequencyData(data_array)
            
            const currentVolumeValue = middleValueArray(data_array)
            
            this.volumePoint.push(currentVolumeValue)

            if (Math.abs(currentVolumeValue - prevVolumeValue) > 50 * ( Math.round(this.$video.volume * 10) / 10 )){
                this.visibleMessage()

                prevVolumeValue = currentVolumeValue
            }
        }

        renderFrame()

        //* Add listener
        this.$video.addEventListener('loadedmetadata', this.initSCD.bind(this))

        this.$video.addEventListener('scenechange', event => {
            this.visibleMessage()
        })

        this.$video.addEventListener('animalfound', event => {
            this.pixelPoint.push(event.detail.diff)
        })
    }
    initSCD(){
        let d = Scd(this.$video, {
            mode: 'PlaybackMode',
        })
        
        d.init()
        d.start()
    }

    createMessage(){
        const $message = document.createElement('div')

        $message.classList.add('ext-message')
        $message.insertAdjacentHTML('beforeend', /*html*/`
            <div class="info">
                Warning message
            </div>
            <div class="volume-detector">
                <canvas class="volume-detector__canvas"></canvas>
            </div>
            <div class="frames-detector">
                <canvas class="frames-detector__canvas"></canvas>
            </div>
        `)

        document.body.appendChild($message)
        
        return $message
    }

    //* Hidden message after time value
    hiddenMessage(time = 0){
        this.timeOutMessage = setTimeout(() => {
            this.$message.classList.remove('active')
        }, time)
    }

    //* Open message (active add class)
    visibleMessage(){
        clearTimeout(this.timeOutMessage)
        this.$message.classList.add('active')
        this.hiddenMessage(1500)
    }
}

function detector(config){
    return new Detector(config)
}


detector().init()