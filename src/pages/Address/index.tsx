import queryString from 'query-string'
import React, { useEffect, useState, ReactNode } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Loading from '../../components/Loading'
import AddressHashCard from '../../components/Card/HashCard'
import Error from '../../components/Error'
import Content from '../../components/Content'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import { PageActions, AppActions } from '../../contexts/actions'
import { getAddress, getTipBlockNumber } from '../../service/app/address'
import { PageParams, LOADING_WAITING_TIME, BLOCK_POLLING_TIME } from '../../utils/const'
import i18n from '../../utils/i18n'
import { parsePageNumber, adaptMobileEllipsis, adaptPCEllipsis } from '../../utils/string'
import {
  AddressContentPanel,
  AddressLockScriptController,
  AddressTitleOverviewPanel,
  AddressLockScriptPanel,
  AddressLockScriptItemPanel,
} from './styled'
import { AddressTransactions, AddressAssetComp } from './AddressComp'
import browserHistory from '../../routes/history'
import { useTimeoutWithUnmount } from '../../utils/hook'
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import { isMainnet } from '../../utils/chain'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { localeNumberString, parseEpochNumber } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { Tooltip } from 'antd'
import CopyTooltipText from '../../components/Text/CopyTooltipText'
import { parseSimpleDateNoSecond } from '../../utils/date'
import { matchCodeHash } from '../../utils/util'
import HashTag from '../../components/HashTag'

const lockScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

const addressContent = (address: string) => {
  if (!address) {
    return i18n.t('address.unable_decode_address')
  }
  if (isMobile()) {
    return adaptMobileEllipsis(address, 10)
  }
  const addressHash = adaptPCEllipsis(address, 13, 50)
  if (addressHash.includes('...')) {
    return (
      <Tooltip placement="top" title={<CopyTooltipText content={address} />}>
        <span>{addressHash}</span>
      </Tooltip>
    )
  }
  return addressHash
}

const AddressLockScriptItem = ({ title, children }: { title: string; children?: ReactNode }) => {
  return (
    <AddressLockScriptItemPanel>
      <div className="address_lock_script__title">
        <span>{title}</span>
      </div>
      <div className="address_lock_script__content">{children}</div>
    </AddressLockScriptItemPanel>
  )
}

const AddressLockScript = ({ script }: { script: State.Script }) => {
  const contractHashTag = matchCodeHash(script.codeHash)
  return (
    <AddressLockScriptPanel>
      <AddressLockScriptItem title={i18n.t('address.code_hash')}>
        <div className="address__lock__script_code_hash">
          <span>{script.codeHash}</span>
          {contractHashTag && <HashTag content={contractHashTag.tag} />}
        </div>
      </AddressLockScriptItem>
      <AddressLockScriptItem title={i18n.t('address.args')}>
        <span>{script.args}</span>
      </AddressLockScriptItem>
      <AddressLockScriptItem title={i18n.t('address.hash_type')}>
        <code>{script.hashType}</code>
      </AddressLockScriptItem>
    </AddressLockScriptPanel>
  )
}

const getAddressInfo = (addressState: State.AddressState) => {
  const {
    address: { liveCellsCount, minedBlocksCount, type, addressHash, lockInfo },
  } = addressState
  const items: OverviewItemData[] = [
    {
      title: i18n.t('address.live_cells'),
      content: localeNumberString(liveCellsCount),
    },
    {
      title: i18n.t('address.block_mined'),
      content: localeNumberString(minedBlocksCount),
    },
  ]

  if (type === 'LockHash') {
    items.push({
      title: i18n.t('address.address'),
      content: addressContent(addressHash),
    })
  }
  if (lockInfo && lockInfo.epochNumber !== '0' && lockInfo.estimatedUnlockTime !== '0') {
    const estimate = Number(lockInfo.estimatedUnlockTime) > new Date().getTime() ? i18n.t('address.estimated') : ''
    items.push({
      title: i18n.t('address.lock_until'),
      content: `${parseEpochNumber(lockInfo.epochNumber)} ${i18n.t(
        'address.epoch',
      )} (${estimate} ${parseSimpleDateNoSecond(lockInfo.estimatedUnlockTime)})`,
    })
  }
  return items
}

const AddressTitleOverview = () => {
  const [showLock, setShowLock] = useState<boolean>(false)
  const {
    addressState,
    addressState: {
      address: { lockScript = undefined },
    },
  } = useAppState()
  return (
    <AddressTitleOverviewPanel>
      <div className="address__title__separate" />
      <OverviewCard items={getAddressInfo(addressState)} hideShadow={true}>
        <AddressLockScriptController
          role="button"
          tabIndex={0}
          onKeyUp={() => {}}
          onClick={() => setShowLock(!showLock)}
        >
          <div>{i18n.t('address.lock_script')}</div>
          <img alt="lock script" src={lockScriptIcon(showLock)} />
        </AddressLockScriptController>
        {showLock && lockScript && <AddressLockScript script={lockScript} />}
      </OverviewCard>
    </AddressTitleOverviewPanel>
  )
}

const AddressAssetCompState = () => {
  const { addressState, app } = useAppState()
  switch (addressState.addressStatus) {
    case 'Error':
      return <Error />
    case 'OK':
      return <AddressAssetComp />
    case 'None':
    default:
      return <Loading show={app.loading} />
  }
}

const AddressStateTransactions = ({
  currentPage,
  pageSize,
  address,
}: {
  currentPage: number
  pageSize: number
  address: string
}) => {
  const { addressState, app } = useAppState()
  switch (addressState.transactionsStatus) {
    case 'Error':
      return <Error />
    case 'OK':
      return <AddressTransactions currentPage={currentPage} pageSize={pageSize} address={address} />
    case 'None':
    default:
      return <Loading show={app.secondLoading} />
  }
}

export const Address = () => {
  const dispatch = useDispatch()
  const { search } = useLocation()
  const { address } = useParams<{ address: string }>()
  const parsed = queryString.parse(search)
  const { addressState } = useAppState()

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)

  useEffect(() => {
    getTipBlockNumber(dispatch)
    const listener = setInterval(() => {
      getTipBlockNumber(dispatch)
    }, BLOCK_POLLING_TIME)
    return () => {
      if (listener) {
        clearInterval(listener)
      }
    }
  }, [dispatch])

  useEffect(() => {
    if (pageSize > PageParams.MaxPageSize) {
      browserHistory.replace(`/address/${address}?page=${currentPage}&size=${PageParams.MaxPageSize}`)
    }
    getAddress(address, currentPage, pageSize, dispatch)
  }, [address, currentPage, pageSize, dispatch])

  useTimeoutWithUnmount(
    () => {
      dispatch({
        type: AppActions.UpdateLoading,
        payload: {
          loading: true,
        },
      })
      dispatch({
        type: AppActions.UpdateSecondLoading,
        payload: {
          secondLoading: true,
        },
      })
    },
    () => {
      dispatch({
        type: PageActions.UpdateAddressStatus,
        payload: {
          addressStatus: 'None',
        },
      })
      dispatch({
        type: PageActions.UpdateAddressTransactionsStatus,
        payload: {
          transactionsStatus: 'None',
        },
      })
    },
    LOADING_WAITING_TIME,
  )

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressHashCard
          title={addressState.address.type === 'LockHash' ? i18n.t('address.lock_hash') : i18n.t('address.address')}
          hash={address}
          specialAddress={addressState.address.isSpecial ? addressState.address.specialAddress : ''}
          children={<AddressTitleOverview />}
        />
        <AddressAssetCompState />
        <AddressStateTransactions currentPage={currentPage} pageSize={pageSize} address={address} />
      </AddressContentPanel>
    </Content>
  )
}

export default Address
