function middleValueArray(list){
    let sumNumbers = 0

    list.forEach(num => {
        sumNumbers += num
    })

    const middleValue = sumNumbers / list.length

    return Math.round(middleValue)
}

function lastElementArray(list){
    return list[list.length - 1]
}

function lineDrawCanvas(ctx, list){
    for (let [x, y] of list){
        ctx.lineTo(x, y)
    }
}


class Detector {
    $video = null
    $message = null
    timeOutMessage = null

    volumeCanvasProp = {
        point: [],
    }
    framesCanvasProp = {
        point: [],
    }

    constructor(config){
        
    }

    //* Init Detector plugin
    init(){
        document.addEventListener('DOMContentLoaded', this.contentLoaded.bind(this))
    }

    //* Method run if document loaded
    contentLoaded(){
        //* Create window message
        this.$message = this.createMessage()

        //* Get YouTube video html element
        this.$video = document.querySelector('video')

        //* Get detector canvas
        this.canvasInit()

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

        //* Add listener
        this.$video.addEventListener('loadedmetadata', this.initSCD.bind(this))

        this.$video.addEventListener('scenechange', event => {
            this.visibleMessage()
        })

        //* count iteration animalfound event
        let countAnimalFound = 0

        //* Set frames video
        this.$video.addEventListener('animalfound', event => {
            analyser.getByteFrequencyData(data_array)
            
            const currentVolumeValue = middleValueArray(data_array)
            const currentFrameValue = event.detail.diff

            if (Math.abs(currentVolumeValue - prevVolumeValue) > 50 * ( Math.round(this.$video.volume * 10) / 10 )){
                this.visibleMessage()

                prevVolumeValue = currentVolumeValue
            }

            // Add point chart
            this.framesCanvasProp.point.push([countAnimalFound, this.framesCanvasProp.height - 1 - currentFrameValue])
            this.volumeCanvasProp.point.push([countAnimalFound, this.volumeCanvasProp.height - 1 - currentVolumeValue])
            
            this.drawChart(countAnimalFound)

            countAnimalFound += 10
        })
    }
    
    drawChart(count){
        this.volumeCanvasProp.context.clearRect(0, 0, this.volumeCanvasProp.width, this.volumeCanvasProp.height)
        this.framesCanvasProp.context.clearRect(0, 0, this.framesCanvasProp.width, this.framesCanvasProp.height)
        
        
        this.framesCanvasProp.context.beginPath()
        
        lineDrawCanvas(this.framesCanvasProp.context, this.framesCanvasProp.point)

        this.framesCanvasProp.context.strokeStyle = '#ff0000'
        this.framesCanvasProp.context.lineWidth = 4
        this.framesCanvasProp.context.stroke()
        this.framesCanvasProp.context.closePath()


        this.volumeCanvasProp.context.beginPath()

        lineDrawCanvas(this.volumeCanvasProp.context, this.volumeCanvasProp.point)

        this.volumeCanvasProp.context.strokeStyle = '#ff0000'
        this.volumeCanvasProp.context.lineWidth = 4
        this.volumeCanvasProp.context.stroke()
        this.volumeCanvasProp.context.closePath()
    }

    //* Canvas init
    canvasInit(){
        // Get canvas node
        this.framesCanvasProp.$el = document.querySelector('.frames-detector__canvas')
        this.volumeCanvasProp.$el = document.querySelector('.volume-detector__canvas')
        
        // Set size frame canvas
        this.framesCanvasProp.width = 600
        this.framesCanvasProp.height = 200

        // Set size volume canvas
        this.volumeCanvasProp.width = 600
        this.volumeCanvasProp.height = 200

        // Get context canvas
        this.framesCanvasProp.context = this.framesCanvasProp.$el.getContext('2d')
        this.volumeCanvasProp.context = this.volumeCanvasProp.$el.getContext('2d')

        // Set size node canvas
        this.framesCanvasProp.$el.style.width = this.framesCanvasProp.width / 2 + 'px'
        this.framesCanvasProp.$el.style.height = this.framesCanvasProp.height / 2 + 'px'

        this.volumeCanvasProp.$el.style.width = this.volumeCanvasProp.width / 2 + 'px'
        this.volumeCanvasProp.$el.style.height = this.volumeCanvasProp.height / 2 + 'px'

        // Set size chart canvas
        this.framesCanvasProp.$el.width = this.framesCanvasProp.width
        this.framesCanvasProp.$el.height = this.framesCanvasProp.height

        this.volumeCanvasProp.$el.width = this.volumeCanvasProp.width
        this.volumeCanvasProp.$el.height = this.volumeCanvasProp.height
    }

    //* Init SCD lib
    initSCD(){
        let d = Scd(this.$video, {
            mode: 'PlaybackMode',
        })
        
        d.init()
        d.start()
    }

    //* Create message node
    createMessage(){
        const $message = document.createElement('div')

        $message.classList.add('ext-message')
        $message.insertAdjacentHTML('beforeend', /*html*/`
            <div class="title">
                Warning message
            </div>
            <div class="volume-detector detector">
                <div class="volume-detector__label ext-message__label">Change Volume</div>
                <canvas class="volume-detector__canvas"></canvas>
            </div>
            <div class="frames-detector detector">
            <div class="frames-detector__label ext-message__label">Change Frames</div>
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

function $(config){
    return new Detector(config)
}


$().init()