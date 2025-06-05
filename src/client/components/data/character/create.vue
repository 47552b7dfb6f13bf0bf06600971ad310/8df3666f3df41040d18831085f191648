<template>
  <UiFlex class="gap-4 mb-2" items="start">
    <UTabs v-model="tab" :items="[
      { slot: 'body', label: 'Trang phục' },
      { slot: 'wing', label: 'Cánh' },
      { slot: 'weapon', label: 'Vũ khí' },
      { slot: 'pet', label: 'Thú cưng' },
      { slot: 'circle', label: 'Vòng tròn' }
    ]">
      <template #[`${key}`] v-for="(equip, key) in character">
        <div class="p-4">
          <UFormGroup label="Chọn Res">
            <UiFlex class="gap-2" v-if="key == 'body'">
              <USelectMenu v-model="select.body.boy" :options="data.body.boy" class="grow" placeholder="Chọn vật liệu" />
              <USelectMenu v-model="select.body.girl" :options="data.body.girl" class="grow" placeholder="Chọn vật liệu" />
            </UiFlex>

            <USelectMenu v-else v-model="select[key]" :options="data[key]" placeholder="Chọn vật liệu" />
          </UFormGroup>

          <div v-if="!!character[key]">
            <UFormGroup label="Tên">
              <UInput v-model="character[key].name" />
            </UFormGroup>

            <UFormGroup label="Mô tả">
              <UInput v-model="character[key].description" />
            </UFormGroup>

            <UFormGroup label="Lực chiến">
              <UInput v-model="character[key].power" type="number" />
            </UFormGroup>

            <UFormGroup label="Offset Idle">
              <UiFlex class="gap-2">
                <UInput v-model="character[key].offset.idle.x" type="number" class="grow" />
                <UInput v-model="character[key].offset.idle.y" type="number" class="grow" />
                <UInput v-model="character[key].offset.idle.scale" type="number" class="grow"/>
              </UiFlex>
            </UFormGroup>

            <UFormGroup label="Offset Info">
              <UiFlex class="gap-2">
                <UInput v-model="character[key].offset.info.x" type="number" class="grow" />
                <UInput v-model="character[key].offset.info.y" type="number" class="grow" />
                <UInput v-model="character[key].offset.info.scale" type="number" class="grow" />
              </UiFlex>
            </UFormGroup>
          </div>

          <UiFlex justify="end">
            <UButton @click="add(key)">Thêm</UButton>
          </UiFlex>
        </div>
      </template>
    </UTabs>
    
    <div>
      <canvas ref="cs" width="600" height="600" class="bg-gray rounded-2xl border-gray mx-auto w-[600px] h-[600px]" style="transform: scale(0.5); margin-top: -150px;"></canvas>
      <canvas ref="cs2" width="600" height="600" class="bg-gray rounded-2xl border-gray mx-auto w-[600px] h-[600px]" style="transform: scale(0.5); margin-top: -300px;"></canvas>
    </div>
  </UiFlex>

  <div v-for="(data, key) in list" class="my-2">
    <UiText>{{ key }}</UiText>
    <div>{{ data }}</div>
  </div>
</template>


<script setup>
const cs = ref()
const cs2 = ref()

const myAnimIdle = ref()
const myAnimInfo = ref()

const tab = ref(0)
const tabFormat = {
  0: 'body',
  1: 'wing',
  2: 'weapon',
  3: 'pet',
  4: 'circle'
}

const data = ref({
  "body": {
    "boy": [
      "101001", "101002", "101003",
      "101004", "101005", "101006",
      "101007", "101008", "101009",
      "101010", "101011", "101012",
      "101013", "101014", "101015",
      "101016", "101017", "101018",
      "101019", "101020", "101021",
      "101022", "101023", "101024",
      "101025", "101026", "101027",
      "101028", "101029", "101030",
      "101031"
    ],
    "girl": [
      "101101", "101102", "101103",
      "101104", "101105", "101106",
      "101107", "101108", "101109",
      "101110", "101111", "101112",
      "101113", "101114", "101115",
      "101116", "101117", "101118",
      "101119", "101120", "101121",
      "101122", "101123", "101124",
      "101125", "101126", "101127",
      "101128", "101129", "101130",
      "101131"
    ]
  },
  "circle": [
    "10001", "10002", "10003", "10004", "10005", "10006"
  ],
  "pet": [
    "201001", "201002", "201003",
    "201004", "201005", "201006",
    "201007", "201008", "201009",
    "201010", "201011", "201012",
    "201013", "201014", "201015",
    "201016", "201017", "201018",
    "201019", "201020", "201021",
    "201022", "201023"
  ],
  "weapon": [
    "102000", "102001", "102002", "102003", "102004",
    "102005", "102006", "102007", "102008", "102009",
    "102010", "102011", "102012", "102013", "102014",
    "102015", "102016", "102017", "102019", "102020",
    "102022", "102023", "102024", "102025", "102026",
    "102027", "102028", "102029", "102030", "102031",
    "102032", "102033", "102034", "102035", "102036",
    "102037", "102038", "102100", "102101", "102102",
    "102103", "102104", "102105", "102106", "102107",
    "102108", "102109", "102110", "102111", "102112",
    "102113", "102114", "102115", "102116", "102117",
    "102119", "102120", "102122", "102123", "102124",
    "102125", "102126", "102127", "102128", "102129",
    "102130", "102131", "102132", "102133", "102134",
    "102135", "102136", "102137", "102138"
  ],
  "wing": [
    "104001", "104002", "104003", "104004",
    "104005", "104006", "104007", "104008",
    "104009", "104010", "104011", "104012",
    "104013", "104014", "104015", "104016",
    "104017", "104018", "104019", "104020",
    "104021", "105001", "105002", "105003",
    "105004", "105005", "105006", "105007",
    "105008", "105009", "105010", "105011",
    "105012", "105013", "105014", "105015",
    "105016"
  ]
})

const list = ref({
  wing: [],
  circle: [],
  weapon: [],
  body: [],
  pet: [],
})

// Select
const select = ref({
  body: {
    boy: null,
    girl: null
  },
  circle: null,
  pet: null,
  weapon: null,
  wing: null,
})
watch(() => select.value.body.boy, (val) => !!val && setCharacter(val, 'body-boy'))
watch(() => select.value.body.girl, (val) => !!val && setCharacter(val, 'body-girl'))
watch(() => select.value.wing, (val) => !!val && setCharacter(val, 'wing'))
watch(() => select.value.weapon, (val) => !!val && setCharacter(val, 'weapon'))
watch(() => select.value.circle, (val) => !!val && setCharacter(val, 'circle'))
watch(() => select.value.pet, (val) => !!val && setCharacter(val, 'pet'))

// Character
const characterUpdate = ref(0)
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

const cache = ref({
  wing: null,
  circle: null,
  weapon: null,
  body: null,
  pet: null,
})

const setCharacterData = (res, type, sex = 0) => ({
  name: res,
  description: res,
  type: type,
  sex: sex,
  res: res,
  power: 0,
  offset: {
    info: {
      x: 0,
      y: 0,
      scale: 1,
    },
    idle: {
      x: 0,
      y: 0,
      scale: 1
    }
  },
  currentFrameInfo: 0,
  currentFrameIdle: 0,
  mc: null,
  image: null,
  json: null
})

const setCharacter = (res, type) => {
  if(type == 'body-boy') character.value.body = setCharacterData(res, 'body', 1)
  else if(type == 'body-girl') character.value.body = setCharacterData(res, 'body', 2)
  else character.value[type] = setCharacterData(res, type)
  characterUpdate.value = characterUpdate.value + 1
}

watch(() => characterUpdate.value, () => loadResIdle())

// Add
const add = (key) => {
  const equip = character.value[key]
  if(!equip) return
  
  const m = JSON.parse(JSON.stringify(equip))
  delete m['currentFrameInfo']
  delete m['currentFrameIdle']
  delete m['mc']
  delete m['image']
  delete m['json']
  list.value[key].push(m)
  cache.value[key] = m['offset']
}

// Load Res
const loadResIdle = () => {
  if(!!myAnimIdle.value) cancelAnimationFrame(myAnimIdle.value)
  const canvas = cs.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let active = 0 
  for (const [type, equip] of Object.entries(character.value)) {
    if(!!equip){
      const mc = `${equip.res}_idle_2_0`
      const path = `/character/${type}/${equip.res}/${mc}`

      character.value[type]['mc'] = mc
      character.value[type]['image'] = new Image()
      !!cache.value[type] && (character.value[type]['offset']['info'] = cache.value[type]['info'])
      !!cache.value[type] && (character.value[type]['offset']['idle'] = cache.value[type]['idle'])

      fetch(`${path}.json`)
      .then(res => res.json())
      .then(data => {
        character.value[type]['json'] = data
        character.value[type]['image'].src = `${path}.png`
        character.value[type]['image'].onload = () => {
          active++
          runAnimationInfo()
          if(active == characterActive.value) runAnimationIdle()
        }
      })
    }
  }
}

// Run Anim
const drawAnimationIdle = () => {
  const canvas = cs.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const [type, equip] of Object.entries(character.value)) {
    if(!!equip){
      const frames = equip.json.mc[`${equip.mc}`].frames
      const resMap = equip.json.res

      const frame = frames[equip.currentFrameIdle]
      const res = resMap[frame.res]

      const offsetX = canvas.width / 2 + equip.offset['idle'].x
      const offsetY = canvas.height / 2 + equip.offset['idle'].y

      const scale = equip.offset['idle'].scale || 1

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
      character.value[type]['currentFrameIdle'] = (equip.currentFrameIdle + 1) % frames.length
    }
  }
}

const drawAnimationInfo = () => {
  const canvas = cs2.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const type = tabFormat[tab.value]
  const equip = character.value[type]
  if(!!equip){
    const frames = equip.json.mc[`${equip.mc}`].frames
    const resMap = equip.json.res

    const frame = frames[equip.currentFrameInfo]
    const res = resMap[frame.res]

    const offsetX = canvas.width / 2 + equip.offset['info'].x
    const offsetY = canvas.height / 2 + equip.offset['info'].y

    const scale = equip.offset['info'].scale || 1

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
    character.value[type]['currentFrameInfo'] = (equip.currentFrameInfo + 1) % frames.length
  }
}


const runAnimationIdle = () => {
  let lastTime = 0
  const interval = 1000 / 10
  function animate(time) {
    if (time - lastTime >= interval) {
      drawAnimationIdle()
      lastTime = time
    }
    myAnimIdle.value = requestAnimationFrame(animate)
  }
  myAnimIdle.value = requestAnimationFrame(animate)
}

const runAnimationInfo = () => {
  if(!!myAnimInfo.value) cancelAnimationFrame(myAnimInfo.value)
  const canvas = cs2.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let lastTime = 0
  const interval = 1000 / 10
  function animate(time) {
    if (time - lastTime >= interval) {
      drawAnimationInfo()
      lastTime = time
    }
    myAnimInfo.value = requestAnimationFrame(animate)
  }
  myAnimInfo.value = requestAnimationFrame(animate)
}
</script>