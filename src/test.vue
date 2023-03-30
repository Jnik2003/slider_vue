🤖Геннадий ChatGPT4, [30.03.2023 17:45]
// слегка оптимизированный код для блокировки кнопок next/prev на время пролистывания
      setTimeout(() => {
        this.btnNextDisabled = false
      }, this.btnDisabledTime)

      const slider = this.$refs.slider
      const sliderItems = this.$refs['slider-items']

      const sliderWidth = slider.offsetWidth
      const sliderItemsWidth = sliderItems[0].offsetWidth

      const maxTransform = (sliderItemsWidth + this.sliderBodyGap) * (sliderItems.length - this.imgCount)

      const currentTransform = -parseInt(slider.style.transform.slice(11))

      if (currentTransform + (sliderWidth - this.sliderBodyGap) < maxTransform) {
        slider.style.transform = `translateX(-${maxTransform}px)`
        return
      }

      slider.style.transform = `translateX(-${currentTransform + ((sliderItemsWidth + this.sliderBodyGap) * jump)}px)`
      this.setActiveDots()
    },

    prev(...args) {
      let [, , jump] = args
      if (args[1] !== undefined) this.clearInt()
      jump === undefined ? jump = this.numbersOfImagesToSwitch : false

      this.btnPrevDisabled = true
      setTimeout(() => {
        this.btnPrevDisabled = false
      }, this.btnDisabledTime)

      const slider = this.$refs.slider
      const currentTransform = -parseInt(slider.style.transform.slice(11))

      if (currentTransform - ((slider.offsetWidth - this.sliderBodyGap) - (this.imgWidth + this.sliderBodyGap)) > 0) {
        slider.style.transform = `translateX(0)`
        return
      }

      slider.style.transform = `translateX(-${currentTransform - ((this.imgWidth + this.sliderBodyGap) * jump)}px)`
      this.setActiveDots()
    },

    setActiveDots() {
      const slider = this.$refs.slider
      const sliderItems = this.$refs['slider-items']

      const sliderWidth = slider.offsetWidth
      const sliderItemsWidth = sliderItems[0].offsetWidth

      const maxTransform = (sliderItemsWidth + this.sliderBodyGap) * (sliderItems.length - this.imgCount)

      const currentTransform = -parseInt(slider.style.transform.slice(11))

      const activeId = []

      for (let i = 0; i < sliderItems.length; i++) {
        const item = sliderItems[i]

        if ((currentTransform + sliderWidth) >= (item.offsetLeft + (item.offsetWidth / 2)) &&
          currentTransform + (sliderWidth - this.sliderBodyGap) <= (item.offsetLeft + (item.offsetWidth / 2))) {
          activeId.push(i)
        }
      }

      this.activeId = activeId
    },

    dotAction(ind) {
      const slider = this.$refs.slider
      const sliderItems = this.$refs['slider-items']

      const sliderItemsWidth = sliderItems[0].offsetWidth

      slider.style.transform = `translateX(-${(sliderItemsWidth + this.sliderBodyGap) * ind}px)`
      this.setActiveDots()
    },

    openModal(name) {
      this.imgNameToModal = name
      this.isModalVisible = true
    },

    clearInt() {
      clearInterval(autoInt)
    },

    updateWidth() {
      if (window.innerWidth < this.start.minWidth) {
        this.imgWidth = this.start.minWidth
      } else {
        this.imgWidth = this.start.imgWidth
      }
      this.imgCount = Math.min(this.start.imgCount, Math.floor(this.getImg.length / 2))
      this.setActiveDots()
    },

    autoSlide() {
      autoInt = setInterval(() => this.next(null, null, this.numbersOfImagesToSwitch), this.autoStartTimeout)
    }
  },

  mounted() {
    this.updateWidth()

    // автоматическая прокрутка
    if (this.autoStart) {
      this.autoSlide()
    }
  },

  destroyed() {
    window.removeEventListener('resize', this.updateWidth);
  }
}
</script>

🤖Геннадий ChatGPT4, [30.03.2023 17:45]
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Slider',
  data() {
    return {
      imgWidth: 250,
      imgCount: 3,
      sliderBodyGap: 30,
      activeId: [],
      btnNextDisabled: false,
      btnPrevDisabled: false,
      btnDisabledTime: 500,
      numbersOfImagesToSwitch: 1,
      isModalVisible: false,
      imgNameToModal: '',
      autoInt: null,
      autoStartTimeout: 3000,
      start: {
        imgWidth: 250,
        imgCount: 3
      }
    }
  },

  computed: {
    ...mapState(['sliderItems']),
    sliderWidth() {
      let documentWidth = document.documentElement.clientWidth

      return ((this.imgWidth + this.sliderBodyGap) * this.imgCount - this.sliderBodyGap) + 'px'
    }
  },

  watch: {
    'start.imgWidth': function () {
      this.imgWidth = this.start.imgWidth
      this.updateWidth()
    },
    'start.imgCount': function () {
      this.imgCount = this.start.imgCount
      this.updateWidth()
    }
  },

  methods: {
    next(...args) {
      let [, , jump] = args
      if (args[1] !== undefined) this.clearInt()
      jump === undefined ? jump = this.numbersOfImagesToSwitch : false
      this.btnNextDisabled = true
      this.$store.dispatch('next', jump)
        .then(() => {
          this.setActiveItems()
        })
      setTimeout(() => {
        this.btnNextDisabled = false
      }, this.btnDisabledTime)
    },
    prev(...args) {
      let [, , jump] = args
      if (args[1] !== undefined) this.clearInt()
      jump === undefined ? jump = this.numbersOfImagesToSwitch : false
      this.btnPrevDisabled = true
      this.$store.dispatch('prev', jump)
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

        this.imgCount = Math.floor(documentWidth / (this.imgWidth + this.sliderBodyGap))
        this.imgCount > this.start.imgCount ? this.imgCount = this.start.imgCount : false
        documentWidth <= this.start.imgWidth ? this.imgWidth = documentWidth * 0.95 : this.imgWidth = this.start.imgWidth
        this.imgCount > 1 ? this.sliderBodyGap = 10 : this.sliderBodyGap = 0

        this.setActiveItems()
      })
    },

    setActiveItems() {
      const items = document.querySelectorAll('.slider-item')
      items.forEach(item => {
        item.classList.remove('active')
      })
      this.activeId = []
      for (let i = this.numbersOfImagesToSwitch; i < this.imgCount + this.numbersOfImagesToSwitch; i++) {
        this.activeId.push(+items[i].dataset.ind)
      }
    },
    dotAction(ind) {
      let diff = ind - this.activeId[0]
      if (diff <= ind && diff > 0) {
        while (diff > 0) {
          setTimeout(() => {
            const jump = 1
            this.next(null, "left", jump)
          }, 0)
          diff--
        }
      }
      else {
        while (diff < 0) {
          setTimeout(() => {
            const jump = 1
            this.prev(null, "left", jump)
          }, 0)
          diff++
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