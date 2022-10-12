class Detector {
    $video = null
    $message = null
    timeOutMessage = null

    constructor(config){
        
    }

    init(){
        document.addEventListener('DOMContentLoaded', this.contentLoaded.bind(this))
    }

    middleValueArray(list){
        let sumNumbers = 0

        list.forEach(num => {
            sumNumbers += num
        })

        const middleValue = sumNumbers / list.length

        return Math.round(middleValue)
    }

    contentLoaded(){
        this.$message = this.createMessage()

        this.$video = document.querySelector('video')

        let prevVolumeValue = 0

        const audioCtx = new AudioContext()
        const src = audioCtx.createMediaElementSource(this.$video)
        const analyser = audioCtx.createAnalyser()

        analyser.connect(audioCtx.destination)
        src.connect(analyser)

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyser.getByteFrequencyData(dataArray)

        // Change volume video
        let renderFrame = () => {
            requestAnimationFrame(renderFrame)

            analyser.getByteFrequencyData(data_array)
            
            const currentVolumeValue = this.middleValueArray(data_array)

            console.log(currentVolumeValue)
            if (Math.abs(currentVolumeValue - prevVolumeValue) > 30 * this.$video.volume){
                this.$message.textContent = 'Change audio frames'
                this.visibleMessage()

                prevVolumeValue = currentVolumeValue
            }
        }

        // src.connect(analyser)
        analyser.fftSize = 256

        let buffer_length = analyser.frequencyBinCount
        var data_array = new Uint8Array(buffer_length)

        renderFrame()

        this.$video.addEventListener('loadedmetadata', this.initSCD.bind(this))

        this.$video.addEventListener('scenechange', event => {
            this.$message.textContent = 'Change video frames'
            this.visibleMessage()
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
        document.querySelector('#content').appendChild($message)
        
        return $message
    }

    hiddenMessage(time = 0){
        this.timeOutMessage = setTimeout(() => {
            this.$message.classList.remove('active')
        }, time)
    }

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