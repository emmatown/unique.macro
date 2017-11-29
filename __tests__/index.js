import cases from 'jest-in-case'

const babel = require('babel-core')

const tester = opts => {
  expect(
    babel.transform(opts.code, {
      filename: __filename,
      babelrc: false,
      plugins: [require('babel-macros')]
    }).code
  ).toMatchSnapshot()
}

cases('unique.macro', tester, {
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
})
