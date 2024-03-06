<template>
  <div class="image">
    <div class="image-container">
      <div class="image-bg"></div>
      <section
        id="home_logo"
        :class="{
          play: isMouseEnter,
        }"
        @mouseenter="isMouseEnter = true"
        @mouseleave="isMouseEnter = false"
      >
        <section class="logo-grey"></section>
        <section class="logo-black">
          <span></span>
        </section>
        <section class="logo-circle"></section>
        <section class="shadow"></section>
      </section>
    </div>
  </div>
</template>

<script setup>
const isMouseEnter = ref(false)
</script>

<style lang="scss" scoped>
*,
:before,
:after {
  box-sizing: border-box;
}
@keyframes play {
  40% {
    transform: translateY(20px);
  }
}
@keyframes play-shadow {
  40% {
    transform: scale(1);
  }
}
@keyframes logo-grey {
  0%,
  50%,
  to {
    transform: translateY(0) rotate(135deg);
  }

  25%,
  75% {
    transform: translateY(10%) rotate(135deg);
  }
}
@keyframes mid-split-left {
  0%,
  50%,
  to {
    transform: rotate(-8deg);
  }

  30%,
  80% {
    transform: rotate(1deg);
  }
}

@keyframes mid-split-right {
  0%,
  50%,
  to {
    transform: rotate(8deg);
  }

  30%,
  80% {
    transform: rotate(-1deg);
  }
}
@keyframes logo-black {
  0%,
  10%,
  90%,
  to {
    transform: translateY(0) rotate(45deg);
  }

  35% {
    transform: translate(10px, -10px) rotate(45deg);
  }

  40% {
    transform: translate(0) rotate(45deg);
  }

  50% {
    transform: translate(10px, 10px) rotate(45deg);
  }

  65% {
    transform: translate(0) rotate(45deg);
  }

  70% {
    transform: translate(10px, -10px) rotate(45deg);
  }

  75% {
    transform: translate(10px, 10px) rotate(45deg);
  }

  20%,
  30%,
  80% {
    transform: translateY(5px) rotate(45deg);
  }
}
@keyframes logo-circle {
  25% {
    transform: rotate(-60deg);
  }

  50% {
    transform: rotate(-90deg);
  }

  75% {
    transform: rotate(-30deg);
  }
}
.image {
  --vp-home-hero-image-background-image: linear-gradient(
    -45deg,
    #ff7707 50%,
    #809aff 50%
  );
  --vp-home-hero-image-filter: blur(40px);
  order: 1;
  margin: -76px -24px -48px;
  .image-container {
    position: relative;
    margin: 0 auto;
    width: 320px;
    height: 320px;
    .image-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      width: 192px;
      height: 192px;
      background-image: var(--vp-home-hero-image-background-image);
      filter: var(--vp-home-hero-image-filter);
      transform: translate(-50%, -50%);
    }
    #home_logo.play {
      --play-status: running;
    }
    #home_logo {
      top: 20%;
      scale: 1.5;
      position: relative;
      width: 150px;
      margin: 20px auto;
      --t: 3s;
      --play-status: pause;
      .logo-grey {
        width: 52px;
        height: 52px;
        position: relative;
        transform: rotate(135deg);
        margin: auto;
        animation: logo-grey var(--t) infinite
          cubic-bezier(0.68, -0.55, 0.265, 1.55) var(--play-status);
        overflow: hidden;
        &::before {
          left: 0;
          transform-origin: 100% 0;
          transform: rotate(8deg);
          animation: mid-split-right var(--t) infinite
            cubic-bezier(0.68, -0.55, 0.265, 1.55) var(--play-status);
          content: '';
          position: absolute;
          width: 52px;
          height: 26px;
          background-color: #999;
        }
        &::after {
          width: 26px !important;
          height: 52px !important;
          right: 0;
          transform-origin: 100% 0;
          transform: rotate(-8deg);
          animation: mid-split-left var(--t) infinite
            cubic-bezier(0.68, -0.55, 0.265, 1.55) var(--play-status);
          content: '';
          position: absolute;
          width: 52px;
          height: 26px;
          background-color: #999;
        }
      }
      .logo-black {
        width: 84px;
        height: 84px;
        background: #000;
        position: relative;
        transform: rotate(45deg);
        overflow: hidden;
        clip-path: polygon(
          33% 0,
          100% 0,
          100% 100%,
          0 100%,
          0 33%,
          33% 33%,
          33% 0
        );
        margin: -5px auto auto;
        animation: logo-black var(--t) infinite var(--play-status);
        span {
          position: absolute;
          top: 25%;
          left: 25%;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #fff 50%, #000 50%) 50% 0 / 10%
            20% repeat-y;
          transform: rotate(-45deg);
        }
        &::before {
          top: 25%;
          left: 10%;
          transform: rotate(-45deg);
          content: '';
          position: absolute;
          background-color: #fff;
          width: 6px;
          height: 100%;
        }
        &::after {
          top: -25%;
          right: 10%;
          transform: rotate(-45deg);
          content: '';
          position: absolute;
          background-color: #fff;
          width: 6px;
          height: 100%;
        }
      }
      .logo-circle {
        width: 100%;
        height: 130px;
        position: absolute;
        top: 0;
        left: 0;
        animation: logo-circle var(--t) infinite var(--play-status);
        &::after {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          background-color: #f80;
          border-radius: 50%;
          bottom: 0;
          left: 0;
          animation: play 1s infinite;
        }
      }
      .shadow {
        --un-shadow: var(--un-shadow-inset) 0 1px 3px 0
            var(--un-shadow-color, rgb(0 0 0 / 0.1)),
          var(--un-shadow-inset) 0 1px 2px -1px var(--un-shadow-color, rgb(0 0 0 /
                  0.1));
        box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow),
          var(--un-shadow);
        position: absolute;
        bottom: -30px;
        left: 0;
        width: 30px;
        height: 10px;
        border-radius: 50%;
        background: radial-gradient(#666, transparent 50%);
        animation: play-shadow 1s infinite;
        transform: scale(0.5);
      }
    }
  }
}
</style>
