export const waitFor = (timeInMs: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeInMs);
  });
};
