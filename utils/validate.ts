//정규식

export const validateEmail = (email: string) => {
  const regex = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9]+(\.)?[0-9?A-z0-9?]+@[o]+(\.)+[s][h][i][n][h][a][n]+(\.)+[a][c]+(\.)+[k][r]$/;
  return regex.test(email);
};
// 공백 제거 함수
export const removeWhitespace = (text: string) => {
  const regex = /\s/g;
  return text.replace(regex, '');
}