import { coalesceSpacing, calcExpression } from './calc-sizes'
import { Block, screenDefsByPrefix, classDefs, defaultScreenDef } from './class-parsing'
import { rem, literalExpr, px } from './expr'

describe(`coalesceSpacing`, () => {

  test(`ignores other spacing type`, () => {
    const actual = coalesceSpacing(
      'margin',
      [{ type: 'padding', side: 'both', value: rem(1) }]
    )
    expect(actual).toStrictEqual(
      literalExpr(px(0))
    )
  })

  test(`ignores consts`, () => {
    const actual = coalesceSpacing(
      'margin',
      [{ type: 'const', value: rem(1) }]
    )
    expect(actual).toStrictEqual(
      literalExpr(px(0))
    )
  })

  test(`overrides start`, () => {
    const actual = coalesceSpacing(
      'margin',
      [{ type: 'margin', side: 'start', value: rem(1) }]
    )
    expect(actual).toStrictEqual(
      literalExpr(rem(1))
    )
  })

  test(`overrides both`, () => {
    const actual = coalesceSpacing(
      'margin',
      [
        { type: 'margin', side: 'both', value: rem(1) },
      ]
    )
    expect(actual).toStrictEqual(
      literalExpr(rem(2))
    )
  })

  test(`overrides both and then end`, () => {
    const actual = coalesceSpacing(
      'margin',
      [
        { type: 'margin', side: 'both', value: rem(10) },
        { type: 'margin', side: 'end', value: rem(2) },
      ]
    )
    expect(actual).toStrictEqual(
      literalExpr(rem(12))
    )
  })
})

test(`generates expression for static width`, () => {
  const block = new Block()
  block.addClass(defaultScreenDef, classDefs['w-64'])
  const actual = calcExpression(block)
  expect(actual).toBe('(min-width:1280px) 320px,256px')
})

test(`generates expression for percentage width`, () => {
  const block = new Block()
  block.addClass(defaultScreenDef, classDefs['w-1/2'])
  const actual = calcExpression(block)
  expect(actual).toBe('50vw')
})

test(`generates media query for larger screen`, () => {
  const block = new Block()
  block.addClass(defaultScreenDef, classDefs['px-2'])
  block.addClass(screenDefsByPrefix.sm, classDefs['px-4'])
  const actual = calcExpression(block)
  expect(actual).toBe('(min-width:1280px) calc(100vw-40px),(min-width:640px) calc(100vw-32px),calc(100vw-16px)')
})

test(`doesn't generate a media query for screen with no classes`, () => {
  const block = new Block()
  block.addClass(defaultScreenDef, classDefs['px-4'])
  block.addClass(screenDefsByPrefix.sm)
  const actual = calcExpression(block)
  expect(actual).toBe('(min-width:1280px) calc(100vw-40px),calc(100vw-32px)')
})