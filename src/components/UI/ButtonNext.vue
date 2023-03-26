<template>
    <button @click="sendNext" :disabled="btnNextDisabled">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'ButtonNext',
    props: {
        btnNextDisabled: {
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