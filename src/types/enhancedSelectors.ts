import {SelectorType, StepType, ActionType, DataGeneratorType} from './formFiller'

/**
 * Types of available Testing Library selection methods
 */
export type QueryType = 'role' | 'label' | 'text' | 'testId' | 'css'

/**
 * Options for Testing Library selectors
 */
export interface QueryOptions {
  name?: string
  hidden?: boolean
  selected?: boolean
  checked?: boolean
  pressed?: boolean
  current?: boolean | string
  level?: number
  exact?: boolean // Add this property for text matching (exact vs contains)
  index?: number // Add this property for selecting which element to use when multiple matches are found
}

/**
 * Enhanced SelectorType with Testing Library selectors support
 * Maintains compatibility with existing type
 */
export interface EnhancedSelectorType extends SelectorType {
  queryType?: QueryType
  queryOptions?: QueryOptions
}

/**
 * Enhanced StepType with Testing Library selectors support
 * Maintains compatibility with existing type
 */
export interface EnhancedStepType extends StepType {
  queryType?: QueryType
  queryOptions?: QueryOptions
}
