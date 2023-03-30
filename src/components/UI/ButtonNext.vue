<template>
    <button @click="sendNext" :disabled="nextbtnDisabled">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'ButtonNext',
    emits:['next'],
    props: {
        nextbtnDisabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        sendNext() {
            this.$emit('next')
        }
    }
}
</script>

<style lang="scss" scoped></style>