<template>
  <canvas ref="cs" width="600" height="600" class="mx-auto w-[100%]" style="aspect-ratio: 1 / 1; pointer-events: none; user-select: none;"></canvas>
</template>

<script setup>
const props = defineProps(['source', 'view'])

const cs = ref()
const anim = ref()

const viewMC = {
  'info': 'idle_2_0',
  'idle': 'idle_2_0',
}

const character = ref({
  wing: null,
  circle: null,
  weapon: null,
  body: null,
  pet: null,
})

const characterActive = computed(() => {
  let active = 0
  for (const [type, equip] of Object.entries(character.value)) {
    if(!!equip) active++
  }
  return active
})

const init = () => {
  if(!!anim.value) cancelAnimationFrame(anim.value)
  const canvas = cs.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if(!props.source) return
  for (const [type, equip] of Object.entries(props.source)) {
    character.value[type] = {
      ...equip,
      currentFrame: 0,
      mc: null,
      image: null,
      json: null
    }
  }

  loadRes()
}

const loadRes = () => {
  let active = 0 
  for (const [type, equip] of Object.entries(character.value)) {
    if(!!equip){
      const mc = `${equip.res}_${viewMC[props.view]}`
      const path = `/character/${type}/${equip.res}/${mc}`

      character.value[type]['mc'] = mc
      character.value[type]['image'] = new Image()

      fetch(`${path}.json`)
      .then(res => res.json())
      .then(data => {
        character.value[type]['json'] = data
        character.value[type]['image'].src = `${path}.png`
        character.value[type]['image'].onload = () => {
          active++
          if(active == characterActive.value) runAnimation()
        }
      })
    }
  }
}

const drawAnimation = () => {
  const canvas = cs.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const [type, equip] of Object.entries(character.value)) {
    if(!!equip){
      const frames = equip.json.mc[`${equip.mc}`].frames
      const resMap = equip.json.res

      const frame = frames[equip.currentFrame]
      const res = resMap[frame.res]

      const offsetX = canvas.width / 2 + equip.offset[props.view].x
      const offsetY = canvas.height / 2 + equip.offset[props.view].y

      const scale = parseFloat(equip.offset[props.view].scale["$numberDecimal"])

      ctx.save()
      ctx.translate(offsetX + frame.x * scale, offsetY + frame.y * scale)
      ctx.scale(scale, scale)

      ctx.drawImage(
        equip.image,
        res.x, res.y, res.w, res.h,
        0, 0,
        res.w, res.h
      )

      ctx.restore()
      character.value[type]['currentFrame'] = (equip.currentFrame + 1) % frames.length
    }
  }
}

const runAnimation = () => {
  let lastTime = 0
  const interval = 1000 / 10
  function animate(time) {
    if (time - lastTime >= interval) {
      drawAnimation()
      lastTime = time
    }
    anim.value = requestAnimationFrame(animate)
  }
  anim.value = requestAnimationFrame(animate)
}

watch(() => props.source, init)
watch(() => props.view, init)
onMounted(() => init())
onBeforeUnmount(() => {
  if(!!anim.value) cancelAnimationFrame(anim.value)
})
</script>