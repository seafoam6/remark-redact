module.exports = redact

//█

function redact() {
  return transformer

  function transformer(tree, file) {
    // console.log(tree);

    const children = tree.children
    //console.log(children.length);
    const newKids = children.map((v, i, a) => {
      if (v.type === 'paragraph') {
        const p = v.children[0].value

        // check for /~
        const start = p.indexOf('/~')

        // check for ~/
        const end = p.indexOf('~/')

        // check for correct order
        if (start > 0 && end > 0 && start < end) {
          const split = p.split('/~')
          const split2 = split[1].split('~/')
          const toTransform = split2[0]
          const transformed = toTransform.replace(/[0-9a-z]/g, '█')

          v.children[0].value = split[0] + transformed + split2[1]
        }
        return v
      }
    })

    tree.children = newKids

    return tree
  }
}
