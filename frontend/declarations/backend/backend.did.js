export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'add_to_chat_history' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'clear_chat_history' : IDL.Func([], [], []),
    'get_api_key_status' : IDL.Func([], [IDL.Bool], ['query']),
    'get_chat_history' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'set_api_key' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
