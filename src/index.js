function plugin ({beginMarker = '/~', endMarker = '~/', replacer = '█'} = {}) {
  function locator (value, fromIndex) {
    return value.indexOf(beginMarker, fromIndex)
  }

  function inlineTokenizer (eat, value, silent) {
    const keepBegin = value.indexOf(beginMarker)
    const keepEnd = value.indexOf(endMarker)
    if (keepBegin !== 0 || keepEnd === -1) return

    /* istanbul ignore if - never used (yet) */
    if (silent) return true

    const toBlackout = value.substring(beginMarker.length, keepEnd)
    const blackedOut = toBlackout.replace(/[0-9a-zA-Z]/g, replacer)

    return eat(beginMarker + toBlackout + endMarker)({
      type: 'redacted',
      value: blackedOut,
      data: {blackedOut},
    })
  }
  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.redacted = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'redacted')

  const Compiler = this.Compiler
  if (Compiler) {
    const visitors = Compiler.prototype.visitors
    if (!visitors) return
    visitors.redacted = node => {
      return node.data.blackedOut
    };
  }
}

module.exports = plugin
