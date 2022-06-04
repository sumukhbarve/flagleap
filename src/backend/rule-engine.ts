/*
Convention: Variable names `a` & `b` are respectively used herein
for the first and second operands of a (simple) binary operation.
*/

import type { ZOperatorEnum, ZRule, ZTraits } from '../shared/z-models'
import { _ } from 'monoduck'

/// ////////////////////////////////////////////////////////////////////////////
// Operators: //////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// If an operator is not applicable, it should return null.
type OpFn = (a: number | string, b: number | string) => boolean | null

const bothNums = (...arr: [unknown, unknown]): boolean => _.all(arr, _.numberIs)
const bothStrs = (...arr: [unknown, unknown]): boolean => _.all(arr, _.stringIs)

const opMap: Record<ZOperatorEnum, OpFn> = {
  $eq: function (a: number | string, b: number | string) {
    if (bothNums(a, b) || bothStrs(a, b)) { return a === b }
    return null
  },
  $gt: function (a: number | string, b: number | string) {
    if (bothNums(a, b) || bothStrs(a, b)) { return a > b }
    return null
  },
  $gte: function (a: number | string, b: number | string) {
    if (bothNums(a, b) || bothStrs(a, b)) { return a >= b }
    return null
  },
  $lt: function (a: number | string, b: number | string) {
    if (bothNums(a, b) || bothStrs(a, b)) { return a < b }
    return null
  },
  $lte: function (a: number | string, b: number | string) {
    if (bothNums(a, b) || bothStrs(a, b)) { return a <= b }
    return null
  },
  $in: function (a: number | string, b: number | string) {
    return String(b).includes(String(a))
  },
  $contains: function (a: number | string, b: number | string) {
    return String(a).includes(String(b))
  },
  $startswith: function (a: string | number, b: string | number) {
    return String(a).startsWith(String(b))
  },
  $endswith: function (a: string | number, b: string | number) {
    return String(a).endsWith(String(b))
  },
  $divisibleby: function (a: string | number, b: string | number) {
    if (bothNums(a, b)) { return Number(a) % Number(b) === 0 }
    return null
  }
}

/// ////////////////////////////////////////////////////////////////////////////
// Rule Matching: //////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

const parseNumIfPossible = function (str: string): number | string {
  const num = Number(str)
  return Number.isNaN(num) ? str : num
}

// Checks if a rule matches against given traits.
// Performs operator application _and_ negation handling.
const checkRuleMatch = function (rule: ZRule, traits: ZTraits): boolean {
  const a = traits[rule.lhs_operand_key] ?? null
  if (_.nullIs(a)) { return false }
  const b = parseNumIfPossible(rule.rhs_operand_value)
  const opFn = opMap[rule.operator]
  const opOutput = opFn(a, b)
  if (_.nullIs(opOutput)) { return false }
  // Only if rule is applicable, negate output if appropriate:
  return (rule.negated === 1) ? !opOutput : opOutput
}

const ruleMatcher = function (rules: ZRule[], traits: ZTraits): ZRule | null {
  return rules.find(rule => checkRuleMatch(rule, traits)) ?? null
}

export { ruleMatcher }
