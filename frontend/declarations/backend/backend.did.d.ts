import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'add_to_chat_history' : ActorMethod<[string], bigint>,
  'clear_chat_history' : ActorMethod<[], undefined>,
  'get_api_key_status' : ActorMethod<[], boolean>,
  'get_chat_history' : ActorMethod<[], Array<string>>,
  'set_api_key' : ActorMethod<[string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
