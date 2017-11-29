import { createMacro, MacroError } from 'babel-macros'
import getId from './get-id'

const configName = 'unique'

module.exports = createMacro(
  ({ references, state, babel, config = {} }) => {
    const t = babel.types
    Object.keys(references).forEach(key => {
      const thing = references[key]
      if (key === 'default') {
        thing.forEach(reference => {
          if (t.isCallExpression(reference.parentPath)) {
            if (reference.parentPath.node.arguments.length) {
              if (t.isStringLiteral(reference.parentPath.node.arguments[0])) {
                return reference.parentPath.replaceWith(
                  t.stringLiteral(
                    `${reference.parentPath.node.arguments[0].value}${getId(
                      state
                    )}`
                  )
                )
              } else {
                throw new MacroError(
                  'unique.macro only accepts a single string literal'
                )
              }
            } else {
              return reference.parentPath.replaceWith(
                t.stringLiteral(`${config.prefix || 'css-'}${getId(state)}`)
              )
            }
          } else {
            throw new MacroError('unique.macro can only be used as a function')
          }
        })
      } else {
        thing.forEach(reference => {
          throw new MacroError('unique.macro only has a default export')
        })
      }
    })
    references.default.forEach(reference => {})
  },
  { configName }
)
