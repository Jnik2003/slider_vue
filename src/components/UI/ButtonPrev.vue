<template>
    <button @click="sendPrev" :disabled="btnPrevDisabled">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'ButtonPrev',
    emits:['prev', 'click'],
    props: {
        btnPrevDisabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        sendPrev() {
            this.$emit('prev')
        }
    }
}
</script>

<style lang="scss" scoped></style>