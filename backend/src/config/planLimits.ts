export const planLimits = {
  free: {
    blogsPerMonth: 2,
    wordsPerMonth: 3000,
  },
  pro: {
    blogsPerMonth: 50,
    wordsPerMonth: 100000,
  },
  enterprise: {
    blogsPerMonth: Infinity,
    wordsPerMonth: Infinity,
  },
} as const;
