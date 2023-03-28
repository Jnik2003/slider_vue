<template>
    <div class="modal" @click="closeModal">
        <div class="modal__body">
            <img class="img" :src="require(`@/assets/slider-img/${imgNameToModal}`)" :alt="imgNameToModal">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ModalComp',
    props:{
        isModalVisible:{
            type: Boolean,
            default: false
        },
        imgNameToModal:{
            type: String
        }
        
    },
    methods:{
        closeModal(){
            this.$emit('update:isModalVisible', false)
        }
    }
}
</script>

<style lang="scss" scoped>
.modal {
 
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal__body{
    display: flex;
    flex-direction: column;
    max-width: 70%;
    background-color: bisque;
    padding: 20px;
    overflow: hidden;
    position: relative;
}
.img {
    object-fit: cover;
    aspect-ratio: 16/9;
    cursor: pointer;
}
</style>