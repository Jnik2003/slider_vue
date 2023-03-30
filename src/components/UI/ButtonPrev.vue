<template>
    <button @click="sendPrev" :disabled="prevbtnDisabled">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'ButtonPrev',
    emits:['prev'],
    props: {
        prevbtnDisabled: {
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