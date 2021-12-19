async function getApiKeyHash (): Promise<string> {
  const textEncoder = new TextEncoder()
  const apiKeyBytes = textEncoder.encode(API_KEY)

  const apiKeyHash = await crypto.subtle.digest('SHA-256', apiKeyBytes)

  return bufferToHex(apiKeyHash.slice(0, 1))
}

function bufferToHex (buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export { getApiKeyHash }
