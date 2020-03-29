import find from 'lodash/find'
import without from 'lodash/without'

const KEYMAP = {
  enter: 13,
  esc: 27,
  space: 32,
  up: 38,
  down: 40,
}

const shortcuts = {
  singleKey: [
    { name: `enter`, key: KEYMAP.enter },
    { name: `esc`, key: KEYMAP.esc },
    { name: `space`, key: KEYMAP.space },
    { name: `up`, key: KEYMAP.up },
    { name: `down`, key: KEYMAP.down },
  ],
}

let instances = []

const emitShortcut = (name, event) => {
  instances.forEach(instance => {
    const { shortcuts } = instance.$options

    if (shortcuts && typeof shortcuts[name] === `function`) {
      shortcuts[name].call(instance, event)
    }
  })
}

const handleKeydownEvent = event => {
  const findAndEmit = (shortcutsCategory, event) => {
    const shortcut = find(shortcutsCategory, { key: event.which })

    if (shortcut) {
      emitShortcut(shortcut.name, event)
    }
  }

  if (event.metaKey && !event.altKey) {
    findAndEmit(shortcuts.withMeta, event)
  } else if (!event.altKey) {
    findAndEmit(shortcuts.singleKey, event)
  }
}

document.addEventListener(`keydown`, handleKeydownEvent)

export default {
  created () {
    instances.push(this)
  },
  destroyed () {
    instances = without(instances, this)
  },
}
