export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'addToChatHistory' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'clearChatHistory' : IDL.Func([], [], []),
    'getChatHistory' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'isApiKeySet' : IDL.Func([], [IDL.Bool], ['query']),
    'setApiKey' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
