import { Block, defaultScreenDef, classDefs, screenDefsByPrefix } from "./block-model"
import { getLogicalWidths } from "./logical-widths"
import { getBlockWidths } from "./block-widths"

test(`returns array of viewport widths if no applicable classes`, () => {
  const block = new Block()
  const sizes = getBlockWidths(block)
  const actual = getLogicalWidths(sizes)
  expect(actual).toStrictEqual([
    { width: 640, screen: defaultScreenDef },
    { width: 768, screen: screenDefsByPrefix.sm },
    { width: 1024, screen: screenDefsByPrefix.md },
    { width: 1280, screen: screenDefsByPrefix.lg },
    { width: 3840, screen: screenDefsByPrefix.xl },
  ])
})

test(`returns percentage of viewport`, () => {
  const block = new Block()
  block.addClass(defaultScreenDef, classDefs['w-1/4'])
  const sizes = getBlockWidths(block)
  const actual = getLogicalWidths(sizes)
  expect(actual).toStrictEqual([
    { width: 160, screen: defaultScreenDef },
    { width: 192, screen: screenDefsByPrefix.sm },
    { width: 256, screen: screenDefsByPrefix.md },
    { width: 320, screen: screenDefsByPrefix.lg },
    { width: 960, screen: screenDefsByPrefix.xl },
  ])
})

test(`returns fixed width`, () => {
  const block = new Block()
  block.addClass(defaultScreenDef, classDefs['w-64'])
  const sizes = getBlockWidths(block)
  const actual = getLogicalWidths(sizes)
  expect(actual).toStrictEqual([
    { width: 256, screen: defaultScreenDef },
    { width: 320, screen: screenDefsByPrefix.xl },
  ])
})

test(`returns max width for min expr`, () => {
  const block = new Block()
  block.addClass(defaultScreenDef, classDefs['max-w-2xl'])
  const sizes = getBlockWidths(block)
  const actual = getLogicalWidths(sizes)
  expect(actual).toStrictEqual([
    { width: 640, screen: defaultScreenDef },
    { width: 672, screen: screenDefsByPrefix.sm },
    { width: 840, screen: screenDefsByPrefix.xl },
  ])
})