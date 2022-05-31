import { NFT } from '@soda/soda-asset'
import { getChainId } from '@soda/soda-util'
import * as Api from './service/apis'

export const getOwnedTokens = async (params: {
  address: string
  chainId?: number
  contract?: string
  tokenId?: string
  offset?: number
  limit?: number
}): Promise<{
  total: number
  data: NFT[]
}> => {
  const { address, chainId: cid, contract, tokenId, offset, limit } = params
  let page: number
  if (offset && limit && limit > 0) page = Math.floor(offset / limit)
  const chainId = cid ? cid : await getChainId()

  const tokens = await Api.retrieveAssets({
    owner: address,
    collection: contract ? contract : '',
    offset,
    limit
  })
  // TODO: filter by input  contract or tokenId
  const res = { total: tokens.total, data: [] }

  for (const t of tokens.data) {
    res.data.push(Api.toToken(t, cid))
  }
  return res
}
