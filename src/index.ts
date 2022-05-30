export * from './mp'
export * from './asset'

import AssetInit from './asset'
import MarketInit from './mp'

const init = () => {
  AssetInit()
  MarketInit()
}

export default init
