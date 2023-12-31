/* https://docs.safe.global/safe-core-api/available-services */
type SafeUrls = Record<string, Record<"name" | "url", string>>;

export const SAFE_SERVICE_URLS: SafeUrls = {
  '100': {
    name: 'gnosis',
    url: 'https://safe-transaction-gnosis-chain.safe.global/'
  },
  '137': {
    name: 'polygon',
    url: 'https://safe-transaction-polygon.safe.global/'
  },
  '5': {
    name: 'goerli',
    url: 'https://safe-transaction-goerli.safe.global/'
  }
}