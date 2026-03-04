export function useLenis() {
  const { $lenis } = useNuxtApp()
  return $lenis as import('lenis').default | undefined
}
