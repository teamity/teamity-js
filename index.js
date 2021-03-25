const { kTeamityRaw, kTeamityUrl } = require('./symbols')
const { default: EventEmitter } = require('EventEmitter')

const WebSkt = window.WebSocket
const pkgSplit = '\n'

class Teamity extends EventEmitter {
  constructor (url) {
    super()
    this[kTeamityUrl] = url
  }

  get $url () {
    return this[kTeamityUrl]
  }

  get $raw () {
    return this[kTeamityRaw]
  }

  // properties
  get $connected () {
    return this.$raw && this.$raw.readyState === WebSkt.OPEN
  }

  get $disconnected () {
    return this.$raw && this.$raw.readyState === WebSkt.CLOSED
  }

  // methods
  open () {
    if (this.$connected) return

    this[kTeamityRaw] = new WebSkt(this.$url)
    this.$raw.onopen = super.emit.bind(this, 'connect')
    this.$raw.onerror = super.emit.bind(this, 'error')
    this.$raw.onclose = super.emit.bind(this, 'disconnect')
    this.$raw.onmessage = _onMessage.bind(this)
  }

  emit (event, body) {
    const encode = new TextEncoder()
    if (!(event instanceof Uint8Array)) {
      if (typeof event !== 'string') {
        event = event.toString()
      }

      event = encode.encode(event)
    }

    if (!(body instanceof Uint8Array)) {
      if (typeof body !== 'string') {
        body = JSON.stringify(body)
      }

      body = encode.encode(body)
    }

    const split = encode.encode(pkgSplit)
    const pkgLen = event.byteLength + split.byteLength + body.byteLength
    const pkg = new Uint8Array(pkgLen)

    let offset = 0
    pkg.set(event, offset)
    offset += event.byteLength
    pkg.set(split, offset)
    offset += split.byteLength
    pkg.set(body, offset)

    this.$raw.send(pkg)
  }

  close () {
    this.$raw.close()
  }

  request (event, body) {
    return new Promise((resolve, reject) => {
      this.once(event, payload => {
        resolve(payload)
      })
      this.emit(event, body)
    })
  }

  superEmit (...args) {
    super.emit(...args)
  }

  // events
  // connect
  // disconnect
  // error
}

function _toUint8Array (data) {
  return new Promise((resolve, reject) => {
    if (data.arrayBuffer) {
      data.arrayBuffer().then(buffer => {
        resolve(new Uint8Array(buffer))
      })
    } else {
      reject(new Error('data format error'))
    }
  })
}

function _onMessage (msg) {
  try {
    const { data } = msg
    const decode = new TextDecoder()
    _toUint8Array(data).then(payload => {
      const pkgIdx = payload.findIndex(v => {
        return String.fromCharCode(v) === pkgSplit
      })

      if (pkgIdx < 0) {
        return
      }

      const topic = payload.slice(0, pkgIdx)
      const body = payload.slice(pkgIdx + pkgSplit.length)

      this.superEmit(decode.decode(topic), JSON.parse(decode.decode(body)))
    })
  } catch (e) {}
}

module.exports = function (opts) {
  return new Teamity(opts)
}
