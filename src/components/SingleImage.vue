<template>
    <div class="slider-body__img">
        <img class="img" :style="imgStyle" :src="require(`@/assets/slider-img/${item.src}`)" :alt="item.text"
            @click="sendImgToModal(item.src)">
        <div class="slider-body__text">
            {{ item.text }}
        </div>

    </div>
</template>

<script>
export default {
    name: 'SingleImage',
    emits:['imgToModal'],
    props: {
        item: {
            type: Object,
            default: () => { }
        },
        imgWidth: {
            type: Number,
            default: 300
        },

    },
    computed: {
        imgStyle() {
            return {
                width: this.imgWidth + 'px',
            }
        },
    },
    methods: {
        sendImgToModal(img) {
            this.$emit('imgToModal', img)
        }
    }
}
</script>

<style lang="scss" scoped>
.img {
    object-fit: cover;
    aspect-ratio: 16/9;
    cursor: pointer;
}
</style>