import tester from 'babel-plugin-tester'

tester({
  plugin: require('babel-macros'),
  snapshot: true,
  tests: {
    basic: {
      code: `import unique from 'unique.macro'
      const uniqueClass = unique()`
    },
    'with commonjs': {
      code: `const unique = require('unique.macro')
      const uniqueClass = unique()`
    },
    'custom prefix': {
      code: `import unique from 'unique.macro'
      const uniqueSomething = unique('something-')`
    }
  }
})
