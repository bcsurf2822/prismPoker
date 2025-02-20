export const normalizeUser = (user) => {
  const normalized = {
    id: user._id ? user._id.toString() : user.id,
    username: user.username,
    email: user.email,
    accountBalance: user.accountBalance,
    bankBalance: user.bankBalance,
    avatar: user.avatar,
    lastLogin: user.lastLogin,
    activeGames: user.activeGames || [],
  };
  return normalized;
};