<script>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Detector from './components/Detector.vue'

import Util from "chromane/js/Util.js"

export default {
    data(){
        return {
            isOpenSidebar: false,
        }
    },
    mounted(){
        // window.util = new Util()
        // window.parent_wrap = window.util.create_window_wrap(window, window.parent)
        // window.util.create_window_api({
        //     test: ()=> {console.log("testing"); }
        // })
    },
    methods: {
        closeSidebar(){
            this.isOpenSidebar = false
        },
        openSidebar(){
            this.isOpenSidebar = true

            // window.parent_wrap.exec("send_message_to_tabs", {text:'sdf'})
            //     .then(res => {
            //         console.log(res)
            //     })
        }
    },
    components: {
        Header,
        Sidebar,
        Detector,
    },
}
</script>

<template>
    <div id="app">
        <Header
            @clickMenu="openSidebar"
        ></Header>
        <main class="main">
            <Detector></Detector>
            <Sidebar 
                :isOpen="isOpenSidebar"
                @clickToNowhere="closeSidebar"
            ></Sidebar>
        </main>
    </div>
</template>

<style>
@import url('./styles//reset.css');
@import url('./styles/fonts.css');
@import url('./styles/base.css');

@import url('./styles/components/header.css');
@import url('./styles/components/sidebar.css');
</style>