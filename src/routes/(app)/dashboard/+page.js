export const ssr = false;

export async function load({ parent }) {
  // Wait for parent layout to finish loading (auth initialization)
  await parent();
  
  return {};
}