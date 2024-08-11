/**
 * Generate a random 6 digit number
 * @returns {number} - Random 6 digit number
 */

const getRandomSmsCode = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export { getRandomSmsCode };
