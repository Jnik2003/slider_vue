<template>
    <div class="slider-body__img">
        <img class="img" :style="imgStyle" :src="require(`@/assets/slider-img/${item.src}`)" alt="item.text">
        <div class="slider-body__text">
            {{ item.text }}
        </div>

    </div>
</template>

<script>
export default {
    name: 'SingleImage',
    props: {
        item: {
            type: Object,
            default: () => { }
        },
        imgWidth: {
            type: Number,
            default: 300
        }
    },
    computed: {
        imgStyle() {
            return {
                width: this.imgWidth + 'px'
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.img {
    object-fit: cover;
    aspect-ratio: 16/9;
}
</style>