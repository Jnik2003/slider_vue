<template>
  <div class="container">
    <section>
      <!-- вся анимация за счет flip-list  -->
      <div class="slider" :style="sliderStyle" ref="slider">

        <div class="btns">
          <ButtonPrev :btnPrevDisabled="btnPrevDisabled" @prev="prev" class="btn btn-next">
            <ArrowLeft />
          </ButtonPrev>

          <ButtonNext :btnNextDisabled="btnNextDisabled" @next="next" class="btn btn-next">
            <ArrowRight />
          </ButtonNext>
        </div>

        <transition-group name="flip-list" tag="div" class="slider-body" :style="sliderBodyStyle">
          <div v-for="item in getImg" :key="item.id" ref="slider-items" class="slider-item" :data-ind="item.id">
            <SingleImage :item="item" :imgWidth="imgWidth" />
          </div>
        </transition-group>

        <div class="dots" v-if="showDots">
          <div v-for="item, ind in getImg" :key="ind" class="dot-item" :class="{ ['active-dot']: activeId.includes(ind) }"
            @click="dotAction(ind)">
          </div>
        </div>


      </div>



    </section>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      // параметры при загрузке страницы
      start: {
        //ширина картинки
        imgWidth: 200,
        // кол-во отображаемых картинок
        imgCount: 5,
        // минимальная ширина картинки (для смартфона преимущественно)
        minWidth: 250
      },
      // -------------------------------
      // кол-во прокручиваемых картинок по нажатию кнопок next prev
      numbersOfImagesToSwitch: 2,
      // gap slider-body
      sliderBodyGap: 10,
      // сколько заблокированы кнопки next prev msec
      btnDisabledTime: 300,
      btnNextDisabled: false,
      btnPrevDisabled: false,

      // Эти imgWidth и imgCount не исправлять, они меняются динамически
      //ширина картинки
      imgWidth: 0,
      // кол-во отображаемых картинок
      imgCount: 0,

      // показывать ли доты
      showDots: true,
      // для подкрашивания активных дотов, здесь индексы активных дотов
      activeId: [],

    }
  },
  created() {
    window.addEventListener('resize', this.updateWidth);
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
        // сдвиг для того чтобы не было эффекта "пустой картинки" когда с начала массива вырезается количество одновременно прокручиваемых картинок(т.е. сдвиг влево на 1, 2 , 3 в зависимости от условий)
        transform: `translate(-${(this.imgWidth + this.sliderBodyGap) * this.numbersOfImagesToSwitch}px)`,
      }
    },
    getImg() {
      return this.$store.getters.getImages
    }
  },

  methods: {
    // принимает параметр из функции dotAction. Если параметра нет, то перескакивает на число картинок определенное в this.numbersOfImagesToSwitch. Но, если управление дотами - то на одну картинку
    next(dots = this.numbersOfImagesToSwitch) {
      this.btnNextDisabled = true
      this.$store.dispatch('next', dots)
        .then(() => {
          this.setActiveItems()
        })
      setTimeout(() => {
        this.btnNextDisabled = false
      }, this.btnDisabledTime)
    },
    prev(dots = this.numbersOfImagesToSwitch) {
      this.btnPrevDisabled = true
      this.$store.dispatch('prev', dots)
        .then(() => {
          this.setActiveItems()
        })
      setTimeout(() => {
        this.btnPrevDisabled = false
      }, this.btnDisabledTime)
    },
    updateWidth() {
      this.$nextTick(() => {
        let documentWidth = document.documentElement.clientWidth

        let imgVisibleCount = Math.floor(documentWidth / (this.imgWidth + this.sliderBodyGap))

        if (imgVisibleCount <= this.start.imgCount && imgVisibleCount > 0) {
          this.imgCount = Math.floor(documentWidth / (this.imgWidth + this.sliderBodyGap))
        }

        this.imgCount === 1 ?
          this.sliderBodyGap = 0 :
          this.sliderBodyGap = 10

        this.setActiveItems()
      })


    },

    // если картинки в поле зрения положим их индексы в массив activeId (для дотов)
    setActiveItems() {
      const items = document.querySelectorAll('.slider-item')
      items.forEach(item => {
        item.classList.remove('active')
      })
      this.activeId = []
      for (let i = this.numbersOfImagesToSwitch; i < this.imgCount + this.numbersOfImagesToSwitch; i++) {
        // items[i].classList.add('active')
        this.activeId.push(+items[i].dataset.ind)

      }
    },
    // при клике по дотам
    dotAction(ind) {
      let diff = ind - this.activeId[0]
      if (diff <= ind && diff > 0) {
        while (diff > 0) {
          setTimeout(() => {
            // из дотов передаем параметр 1 чтобы по логике dotAction(ind) за одну итерацию переход на одну картинку
            this.next(1)
          }, 0)
          diff--
        }
      }
      else {
        while (diff < 0) {
          setTimeout(() => {
            this.prev(1)
          }, 0)
          diff++
        }
      }
    }
  },

  mounted() {
    this.activeId = []

    this.imgWidth = this.start.imgWidth
    this.imgCount = this.start.imgCount

    this.$nextTick(() => {
      this.updateWidth()
    })

    // для избежания некрасивого эффекта при первой загрузки слайдера
    this.$refs['slider-items'].forEach(item => {
      item.style.opacity = 0
    })

    setTimeout(() => {
      this.$refs['slider-items'].forEach(item => {
        item.style.opacity = 1
      })
    }, 500)
    this.setActiveItems()
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

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.slider {
  // width: 900px;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid lime;
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
  // width: inherit;
  width: 100%;
  // border: 1px solid greenyellow;
  display: inline-flex;
  // justify-content: center;
  flex-wrap: nowrap;
  // transition: .3s;
  margin: 0 auto;
  transform: translateX(-310px);
}

.slider-body__img {
  // padding: 10px;
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
