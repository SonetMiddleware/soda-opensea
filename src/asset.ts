<<<<<<< HEAD
import {
  AssetType,
  Function,
  NFT,
  registerAssetService,
  TokenCache
} from '@soda/soda-asset'
import { getOwnedTokens } from './assetList'
import { getCollectionList, getCollectionTokenList } from './collection'
import { httpRequest } from '@soda/soda-util'
import * as Api from './service/apis'
=======
import { registerAssetService } from '@soda/soda-asset'
import {
  getChainId,
  getNFTSource,
  MessageTypes,
  sendMessage
} from '@soda/soda-core'

const MAINNET_CHAIN_ID = 1
const retrieveCollections = () => {}
>>>>>>> main

const actions = {
  1: [
    Function.getAssetInfo,
    Function.getBalance,
    Function.getRole,
    Function.getCollectionList,
    Function.getCollectionTokenList
  ],
  4: [
    Function.getAssetInfo,
    Function.getBalance,
    Function.getRole,
    Function.getCollectionList,
    Function.getCollectionTokenList
  ]
}

const getCapability = () => {
  return actions
}

const getAssetInfo = async (
  meta: TokenCache,
  paymentMeta?: any
): Promise<NFT> => {
  const { chainId, contract, tokenId } = meta
  const token = await Api.retrieveAsset(contract, tokenId)
  return {
    type: AssetType.NFT,
    chainId,
    contract,
    balance: 1,
    tokenId,
    source: token.image_url || token.image,
    meta: { type: 'image', storage: 'ipfs' }
  }
}

const init = () => {
  registerAssetService({
    name: 'opensea',
    meta: {
      getCapability,
      getAssetInfo,
      getOwnedTokens,
      getCollectionList,
      getCollectionTokenList
    }
  })
}

export default init
