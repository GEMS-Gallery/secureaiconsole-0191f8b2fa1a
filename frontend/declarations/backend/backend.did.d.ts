import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'add_message' : ActorMethod<[string], undefined>,
  'clear_messages' : ActorMethod<[], undefined>,
  'get_messages' : ActorMethod<[], Array<string>>,
  'health_check' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
