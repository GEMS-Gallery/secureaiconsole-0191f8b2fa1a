export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'add_message' : IDL.Func([IDL.Text], [], []),
    'clear_messages' : IDL.Func([], [], []),
    'get_messages' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'health_check' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
