import { defineStore } from 'pinia'

export const useSocketStore = defineStore('socket', () => {
  const online : Ref<number> = ref(0)

  const slideModal = ref(false)

  const tab : Ref<string | null> = ref('chat-global')

  const chat : Ref<any> = ref({
    global: {
      new: 0,
      push: {
        update: 0,
        data: null
      },
      del: {
        update: 0,
        data: null
      }
    },
    guild: {
      new: 0,
      push: {
        update: 0,
        data: null
      },
      del: {
        update: 0,
        data: null
      }
    },
    single: {
      new: 0,
      now: null,
      push: {
        update: 0,
        data: null
      }
    },
    game: {
      new: 0,
      now: null
    }
  })

  const notify : Ref<any> = ref({
    global: {
      new: 0,
      push: {
        update: 0,
        data: null
      }
    },
    single: {
      new: 0,
      push: {
        update: 0,
        data: null
      }
    }
  })

  function setSlideModal (data : boolean) {
    slideModal.value = data
  }

  function changeTab (data: string) {
    tab.value = data
  }

  function changeChatData (key: string, data : any) {
    chat.value[key] = Object.assign(chat.value[key], data)
  }

  function changeNotifyData (key: string, data : any) {
    notify.value[key] = Object.assign(notify.value[key], data)
  }
  
  function updateOnline (data : number) {
    online.value = data
  }

  return { 
    slideModal, setSlideModal,
    online, updateOnline,
    tab, changeTab,
    chat, changeChatData,
    notify, changeNotifyData
  }
})