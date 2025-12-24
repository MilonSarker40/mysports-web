export function isRobiNumber(msisdn: string): boolean {
  if (!msisdn) return false

  const normalized = msisdn.replace(/[\s+-]/g, '')

  const robiRegex = /^(88018\d{8}|018\d{8}|18\d{8})$/

  return robiRegex.test(normalized)
}
