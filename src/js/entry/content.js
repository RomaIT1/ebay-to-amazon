function middleValueArray(list){
    let sumNumbers = 0

    list.forEach(num => {
        sumNumbers += Math.abs(num)
    })

    const middleValue = sumNumbers / list.length

    return Math.round(middleValue)
}

function lastElementArray(list){
    return list[list.length - 1]
}

function renderModel(ctx, data, options = {}){
    ctx.strokeStyle = options.color
    ctx.lineWidth = 4

    ctx.beginPath()

    var x = 0

    for (let i = 0; i < data.length; i++ ) {
        let y = data[i]

        ctx.lineTo(x, y)

        x+=5
    }

    ctx.stroke()
    ctx.closePath()
}


class Detector {
    $video = null
    $message = null
    timeOutMessage = null

    graphCanvasProp = {
        $el: null,
        context: null,
        width: null,
        height: null,
    }

    volumeGraphProp = {
        point: [],
    }
    framesGraphProp = {
        point: [],
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

        analyser.smoothingTimeConstant = 0;
        analyser.fftSize = 256

        const bufferLength = analyser.frequencyBinCount

        const dataArray = new Uint8Array(bufferLength)

        analyser.getByteTimeDomainData(dataArray)

        //* Add listener
        this.$video.addEventListener('loadedmetadata', this.initSCD.bind(this))

        this.$video.addEventListener('scenechange', event => {
            console.log('laskflaskfaslkf')
            this.visibleMessage()
        })

        //* Set frames video
        this.$video.addEventListener('medianFound', event => {
            // analyser.getByteTimeDomainData(dataArray)
            analyser.getByteFrequencyData(dataArray)
            
            // const currentVolumeValue = Math.abs(middleValueArray(dataArray) - 128)

            let currentVolumeValue = 0;

            dataArray.forEach((db_value)=>{
                currentVolumeValue += db_value;
            })

            currentVolumeValue = currentVolumeValue / 255 / bufferLength;

            
            const currentFrameValue = event.detail.diff
            console.log(currentFrameValue)
            
            if ( currentVolumeValue > prevVolumeValue ) {
                var volume_diff = currentVolumeValue - prevVolumeValue;
            } else {
                var volume_diff = 0;
            }

            prevVolumeValue = currentVolumeValue

            // if (Math.abs(currentVolumeValue - prevVolumeValue) > Math.round(30 * (this.$video.volume) )){
            //     this.visibleMessage()
            // }

            // Add point chart
            this.framesGraphProp.point.push(this.graphCanvasProp.height - 3 - currentFrameValue)
            this.volumeGraphProp.point.push(this.graphCanvasProp.height - 3 - volume_diff * this.graphCanvasProp.height)
            
            this.framesGraphProp.point = this.framesGraphProp.point.slice(-100)
            this.volumeGraphProp.point = this.volumeGraphProp.point.slice(-100)

            this.drawChart()
        })
    }
    
    drawChart(){
        this.graphCanvasProp.context.clearRect(0, 0, this.graphCanvasProp.width, this.graphCanvasProp.height)

        renderModel(this.graphCanvasProp.context, this.framesGraphProp.point, {color: '#c62828'})
        renderModel(this.graphCanvasProp.context, this.volumeGraphProp.point, {color: '#1a237e'})
    }

    //* Canvas init
    canvasInit(){
        this.graphCanvasProp.$el = document.querySelector('#graph-canvas')
        this.graphCanvasProp.context = this.graphCanvasProp.$el.getContext('2d')
        this.graphCanvasProp.width = 600
        this.graphCanvasProp.height = 200

        // Set size node canvas
        this.graphCanvasProp.$el.style.width = this.graphCanvasProp.width / 2 + 'px'
        this.graphCanvasProp.$el.style.height = this.graphCanvasProp.height / 2 + 'px'

        // Set size chart canvas
        this.graphCanvasProp.$el.width = this.graphCanvasProp.width
        this.graphCanvasProp.$el.height = this.graphCanvasProp.height
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
            <div class="ext-message__title title">
                Warning message
            </div>
            <div class="ext-message__graph graph">
                <div class="graph__label">Change graph</div>
                <canvas class="graph__canvas" id="graph-canvas"></canvas>
            </div>
        <div class="ext-message__info info">
            <ul class="info__list list">
                <li class="list__item">
                    red: <span class="frames-color">frames</span>
                </li>
                <li class="list__item">
                    blue: <span class="volume-color">volume</span>
                </li>
            </ul>
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