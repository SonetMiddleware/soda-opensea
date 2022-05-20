import { registerMarketPlace } from '@soda/soda-mp-sdk'
import assetInit from './asset'
const sell = async () => {}
const auction = async () => {}
const cancel = async () => {}
const buy = async () => {}
const withdraw = async () => {}

const initialize = () => {
  assetInit()
  registerMarketPlace({
    name: 'opensea',
    meta: {
      urlPattern: 'https://opensea',
      itemPattern: 'detail/{id}',
      sellFunc: sell,
      auctionFunc: auction,
      cancelFunc: cancel,
      withdrawFunc: withdraw
    }
  })
}

export { sell, auction, buy, cancel, withdraw }
export default initialize
