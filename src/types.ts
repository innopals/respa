import { Action } from 'redux';

export type CompiledAction = {
  ACTION_TYPE: string,
  toString: () => string,
  success: string,
  error: string,
} & ((...args: any[]) => Promise<any>) & string;

export interface ActionDefinition extends Action {
  payload?: any,
  promise?: Promise<any>

}
export interface EnhancedActionDefinition extends ActionDefinition {
  type: string,
  dispatcher: any
}

// export type ActionDefinition = (
//   {
//     payload?: any,
//     promise: Promise<any>
//   } | {
//     payload: any,
//     promise?: Promise<any>
//   }
// );
// export type EnhancedActionDefinition = ActionDefinition & {
//   type: string,
//   dispatcher: any
// } & Action;


export type ActionCreator = (...args: any[]) => ActionDefinition;
