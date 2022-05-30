import { registerMarketPlace } from '@soda/soda-mp-sdk'
import { NFT } from '@soda/soda-asset'

const getItemPage = async (params: { token: NFT }) => {
  const { token } = params
  let baseUri = ''
  switch (token.chainId) {
    case 1:
      baseUri = 'https://opensea.io/assets/ethereum'
      break
    case 4:
      baseUri = 'https://testnets.opensea.io/assets/rinkeby'
      break
    case 80001:
      baseUri = 'https://testnets.opensea.io/assets/mumbai'
      break
  }
  return !baseUri ? '' : `${baseUri}/${token.contract}/${token.tokenId}`
}
const getHost = async (params: { chainId?: number }) => {
  const { chainId } = params
  let baseUri = ''
  switch (chainId) {
    case 4:
    case 80001:
      baseUri = 'https://testnets.opensea.io'
      break
    case 1:
    default:
      baseUri = 'https://opensea.io'
      break
  }
  return baseUri
}

const sell = async () => {}
const auction = async () => {}
const cancel = async () => {}
const buy = async () => {}
const withdraw = async () => {}

const init = () => {
  registerMarketPlace({
    name: 'opensea',
    meta: {
      getItemPage,
      getHost
    }
  })
}

export default init
