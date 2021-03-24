const Webskt = window.WebSocket
const { kTeamityRaw, kTeamityUrl } = require('./symbols')
const { EventEmitter } = require('events')

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
    return this.$raw && this.$raw.readyState === Webskt.OPEN
  }

  get $disconnected () {
    return this.$raw && this.$raw.readyState === Webskt.CLOSED
  }

  // methods
  open () {
    if (this.$connected) return

    this[kTeamityRaw] = new Webskt(this.$url)
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

    const pkgLen = 1 + event.byteLength + 2 + body.byteLength
    const pkg = new Uint8Array(pkgLen)
    pkg.set([event.byteLength], 0)
    pkg.set(event, 1)
    pkg.set(
      [(body.byteLength >> 8) & 0xff, (body.byteLength >> 0) & 0xff],
      1 + event.byteLength
    )
    pkg.set(body, 1 + event.byteLength + 2)

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
      resolve(Uint8Array.from(data))
    }
  })
}

function _onMessage (msg) {
  try {
    const { data } = msg
    const decode = new TextDecoder()
    _toUint8Array(data).then(payload => {
      const { byteLength } = payload
      if (byteLength < 1) return

      let buf = payload.slice(0, 1)
      const tLen = buf[0]

      if (byteLength < 1 + tLen) return

      buf = payload.slice(1, 1 + tLen)
      const topic = decode.decode(buf)

      if (byteLength < 1 + tLen + 2) return

      buf = payload.slice(1 + tLen, 1 + tLen + 2)
      const pLen = (buf[0] << 8) | (buf[1] << 0)

      if (byteLength < 1 + tLen + 2 + pLen) return

      buf = payload.slice(1 + tLen + 2, 1 + tLen + 2 + pLen)
      const body = JSON.parse(decode.decode(buf))

      this.superEmit(topic, body)
    })
  } catch (e) {}
}

module.exports = function (opts) {
  return new Teamity(opts)
}
