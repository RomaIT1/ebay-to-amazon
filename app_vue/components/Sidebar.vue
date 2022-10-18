<template>
    <aside 
        :class="['sidebar', isOpen ? 'active': '']" 
        ref="sidebar"
    >
        <div class="sidebar__inner">
            <ul class="sidebar__list list">
                <li class="list__item">
                    <a class="list__link" href="#">Config</a>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script>
export default {
    emits: ['clickToNowhere'],
    mounted(){
        document.addEventListener('click', this.documentClick)
    },
    methods: {
        documentClick(event){
            if (!this.isOpen) return

            const target = event.target
            const sidebar = this.$refs.sidebar

            if (sidebar !== target && !sidebar.contains(target)){
                this.$emit('clickToNowhere')
            }
        }
    },
    props: {
        isOpen: {
            require: true,
            type: Boolean,
        },
    },

}
</script>

<style>

</style>