import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'


export const useBreakpointsGlobal = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 430 })
  
  const isSM = breakpoints.greaterOrEqual('sm')
  const isMD = breakpoints.greaterOrEqual('md')
  const isLG = breakpoints.greaterOrEqual('lg')
  const isXL = breakpoints.greaterOrEqual('xl')
  const is2XL = breakpoints.greaterOrEqual('2xl')

  return { isSM, isMD, isLG, isXL, is2XL }
}