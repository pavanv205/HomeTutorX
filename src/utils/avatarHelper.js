export const getAvatarStyle = (name) => {
  const palettes = [
    'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/40 dark:border-red-900/30',
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/30',
    'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/30',
    'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/40 dark:border-amber-900/30',
    'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200/40 dark:border-green-900/30',
    'bg-[#783e19]/5 dark:bg-[#783e19]/30 text-[#783e19] dark:text-[#d2b48c] border border-[#783e19]/20 dark:border-[#783e19]/40',
    'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/40 dark:border-orange-900/30',
    'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 border border-yellow-200/40 dark:border-yellow-900/30'
  ];
  if (!name) return palettes[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palettes.length;
  return palettes[index];
};
