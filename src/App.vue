<template>
  <div class="slider-container">

    <div class="slider" :style="sliderStyle" ref="slider">

      <div class="btns">
        <ButtonPrev :prevbtnDisabled="prevbtnDisabled" @prev="prev" class="btn btn-next" @click="clearInt()">
          <ArrowLeft />
        </ButtonPrev>

        <ButtonNext :nextbtnDisabled="nextbtnDisabled" @next="next" class="btn btn-next" @click="clearInt()">
          <ArrowRight />
        </ButtonNext>
      </div>

      <transition-group name="flip-list" tag="div" class="slider-body" :style="sliderBodyStyle">
        <div v-for="item in getImg" :key="item.id" ref="slider-items" class="slider-item" :data-ind="item.id"
          v-touch:swipe.left="next" v-touch:swipe.right="prev">
          <SingleImage :item="item" :imgWidth="imgWidth" @imgToModal="openModal" />
        </div>
      </transition-group>

      <div class="dots" v-if="showDots">
        <div v-for="item, ind in getImg" :key="ind" class="dot-item" :class="{ ['active-dot']: activeId.includes(ind) }"
          @click="dotAction(ind), clearInt()">
        </div>
      </div>
    </div>

    <ModalComp v-if="isModalVisible" v-model:isModalVisible="isModalVisible" :imgNameToModal="imgNameToModal">
    </ModalComp>



  </div>
</template>

<script>
let autoInt = 0

export default {
  name: 'App',
  data() {
    return {
      // настраиваемые параметры +++++++++++++

      // параметры применяются при загрузке страницы
      start: {
        //ширина картинки
        imgWidth: 300,
        // кол-во отображаемых картинок (не более "всего картинок" - numbersOfImagesToSwitch * 2)
        imgCount: 4,
        // минимальная ширина картинки (для смартфона преимущественно)
        minWidth: 250
      },
      // кол-во прокручиваемых картинок по нажатию кнопок next prev
      numbersOfImagesToSwitch: 1,
      // автопрокрутка
      autoStart: true,
      // таймаут автопрокрутки в ms
      autoStartTimeout: 1500,
      // gap slider-body
      sliderBodyGap: 10,
      // сколько заблокированы кнопки next prev в msec пока идет пролистывание
      btnDisabledTime: 300,
      // показывать ли доты
      showDots: true,

      // +++++++++++++++++++++++++++++++++

      nextbtnDisabled: false,
      prevbtnDisabled: false,

      // Эти параметры не исправлять, они меняются динамически
      //ширина картинки
      imgWidth: 0,
      // кол-во отображаемых картинок
      imgCount: 0,
      // ------------------

      // для подкрашивания активных дотов, здесь будут индексы активных дотов
      activeId: [],
      // модальное окно
      isModalVisible: false,
      // имя файла картинки переданное в модальное окно
      imgNameToModal: ''
      // -------------------------------------
    }
  },
  created() {
    window.addEventListener('resize', this.updateWidth);
  },
  destroyed() {
    window.removeEventListener('resize', this.updateWidth);
  },

  computed: {
    sliderStyle() {
      return {
        width: this.imgWidth * this.imgCount + this.sliderBodyGap + 'px',
      }
    },

    sliderBodyStyle() {
      return {
        gap: this.sliderBodyGap + 'px',
        transform: `translate(-${(this.imgWidth + this.sliderBodyGap) * this.numbersOfImagesToSwitch}px)`,
      }
    },
    getImg() {
      return this.$store.getters.getImages
    }
  },

  methods: {

    switchImages(jump, direction, args) {
      if (args[1] !== undefined) this.clearInt()
      this[direction + 'btnDisabled'] = true

      this.$store.dispatch(direction, jump)
        .then(() => {
          this.setActiveItems()
        })
      setTimeout(() => {
        this[direction + 'btnDisabled'] = false
      }, this.btnDisabledTime)
    },

    next(...args) {
      const [, , jump] = args
      const jumpValue = jump === undefined ? this.numbersOfImagesToSwitch : jump
      this.switchImages(jumpValue, 'next', args)
    },

    prev(...args) {
      const [, , jump] = args
      const jumpValue = jump === undefined ? this.numbersOfImagesToSwitch : jump
      this.switchImages(jumpValue, 'prev', args)
    },

    updateWidth() {
      let documentWidth = document.documentElement.clientWidth

      this.imgCount = Math.floor(documentWidth / (this.imgWidth + this.sliderBodyGap))
      if (this.imgCount > this.start.imgCount) {
        this.imgCount = this.start.imgCount
      }
      if (documentWidth <= this.start.imgWidth) {
        this.imgWidth = documentWidth * 0.95
      } else {
        this.imgWidth = this.start.imgWidth
      }
      this.sliderBodyGap = this.imgCount > 1 ? 10 : 0

      this.setActiveItems()
    },

    setActiveItems() {
      const items = document.querySelectorAll('.slider-item')

      this.activeId = []
      for (let i = this.numbersOfImagesToSwitch; i < this.imgCount + this.numbersOfImagesToSwitch; i++) {
        this.activeId.push(+items[i].dataset.ind)
      }
    },

    dotAction(ind) {
      let diff = ind - this.activeId[0]
      if (diff <= ind && diff > 0) {
        const jump = 1;
        for (let i = 0; i < diff; i++) {
          setTimeout(() => {
            this.next(null, "left", jump)
          }, 0)
        }
      } else if (diff < 0) {
        const jump = 1;
        for (let i = diff; i < 0; i++) {
          setTimeout(() => {
            this.prev(null, "left", jump)
          }, 0)
        }
      }
    },
    openModal(img) {
      this.clearInt()
      this.isModalVisible = true
      this.imgNameToModal = img
    },
    autoStartSlider() {
      autoInt = setInterval(() => {
        this.next()
      }, this.autoStartTimeout)
    },
    clearInt() {
      clearInterval(autoInt)
    }
  },

  mounted() {
    this.activeId = []

    this.imgWidth = this.start.imgWidth
    this.imgCount = this.start.imgCount

    this.$nextTick(() => {
      this.updateWidth()
    })

    this.$refs['slider-items'].forEach(item => {
      item.style.opacity = 0
    })

    setTimeout(() => {
      this.$refs['slider-items'].forEach(item => {
        item.style.opacity = 1
      })
    }, 500)
    this.setActiveItems()

    this.autoStart ? this.autoStartSlider() : false
  }
}
</script>

<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;
}

#app-slider {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.slider-container {
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.slider {
  overflow: hidden;
  margin: 0 auto;
}

.btns {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  gap: 10px;
}

.btn {
  width: 40px;
  height: 40px;
  transition: .3s;
  background: #333333;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background-color: #e21414;
}

.btn[disabled] {
  background-color: grey;
}

.arrow {
  color: rgb(224, 224, 224);
  font-size: 30px;
  transition: .3s;
}



.slider-item {
  opacity: 1;
}


.slider-body {
  width: 100%;
  display: inline-flex;
  flex-wrap: nowrap;
  margin: 0 auto;
  transform: translateX(-310px);
}

.flip-list-move {
  transition: transform .5s ease;
}

.dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin: 10px 0;
}

.dot-item {
  width: 15px;
  height: 15px;
  background-color: #bebebe;
  cursor: pointer;
}

.active-dot {
  background-color: #e21414;
  transition: .5s;
}
</style>
