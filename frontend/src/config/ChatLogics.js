export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id || // ako sender sledece poruke nije isti kao sender trenutne poruke
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId // poruka je od drugog usera, a ne ulogovanog usera
  );
};
//////////  #14l, 22 min
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId && // sender poruke se razlikuje od ulogovanog usera
    messages[messages.length - 1].sender._id // poruka postoji
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => { // koristi se u MyChats.js i SingleChat.js
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => { // koristi se u SingleChat.js
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
