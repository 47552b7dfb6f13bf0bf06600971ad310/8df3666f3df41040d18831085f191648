export const useCollab = () => {
  const runtimeConfig = useRuntimeConfig()

  function getCode() : string | null {
    return runtimeConfig.public.collab || null
  }

  return { getCode }
}