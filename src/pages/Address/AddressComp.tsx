import React from 'react'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import { useAppState } from '../../contexts/providers/index'
import i18n from '../../utils/i18n'
import { localeNumberString, parseUDTAmount } from '../../utils/number'
import { shannonToCkb } from '../../utils/util'
import {
  AddressTransactionsPagination,
  AddressTransactionsPanel,
  AddressUDTAssetsPanel,
  AddressUDTItemPanel,
} from './styled'
import browserHistory from '../../routes/history'
import DecimalCapacity from '../../components/DecimalCapacity'
import TitleCard from '../../components/Card/TitleCard'
import CKBTokenIcon from '../../assets/ckb_token_icon.png'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import { isMobile } from '../../utils/screen'

const addressAssetInfo = (address: State.Address) => {
  const items = [
    {
      icon: CKBTokenIcon,
      title: i18n.t('common.ckb_unit'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.balance))} hideUnit />,
    },
    {
      title: i18n.t('address.dao_deposit'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.daoDeposit))} />,
      isAsset: true,
    },
    {
      title: '',
      content: '',
    },
    {
      title: i18n.t('address.compensation'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.interest))} />,
      isAsset: true,
    },
  ] as OverviewItemData[]
  if (isMobile()) items.splice(2, 1)
  return items
}

const AddressUDTItem = ({ udtAccount }: { udtAccount: State.UDTAccount }) => {
  const { decimal, symbol, amount, iconFile, typeHash } = udtAccount
  return (
    <AddressUDTItemPanel href={`/sudt/${typeHash}`}>
      <img className="address__udt__item__icon" src={iconFile ? iconFile : SUDTTokenIcon} alt="udt icon" />
      <div className="address__udt__item__info">
        <span>{symbol}</span>
        <span>{parseUDTAmount(amount, decimal)}</span>
      </div>
    </AddressUDTItemPanel>
  )
}

const AddressTransactionsTitle = ({ count }: { count: number }) => {
  return <TitleCard title={`${i18n.t('transaction.transactions')}(${localeNumberString(count)})`} />
}

export const AddressAssetComp = () => {
  const {
    addressState: {
      address,
      address: { udtAccounts },
    },
  } = useAppState()

  return (
    <OverviewCard items={addressAssetInfo(address)} titleCard={<TitleCard title={i18n.t('address.assets')} />}>
      <AddressUDTAssetsPanel>
        <span>{i18n.t('address.user_define_token')}</span>
        <div className="address__udt__assets__grid">
          {udtAccounts.map(udt => {
            return <AddressUDTItem udtAccount={udt} />
          })}
        </div>
      </AddressUDTAssetsPanel>
    </OverviewCard>
  )
}

export const AddressTransactions = ({
  currentPage,
  pageSize,
  address,
}: {
  currentPage: number
  pageSize: number
  address: string
}) => {
  const {
    addressState: {
      transactions = [],
      total,
      address: { addressHash, transactionsCount },
    },
    app: { tipBlockNumber },
  } = useAppState()

  const totalPages = Math.ceil(total / pageSize)

  const onChange = (page: number) => {
    browserHistory.replace(`/address/${address}?page=${page}&size=${pageSize}`)
  }

  return (
    <>
      <AddressTransactionsPanel>
        {transactions.map((transaction: State.Transaction, index: number) => {
          return (
            transaction && (
              <TransactionItem
                address={addressHash}
                transaction={transaction}
                confirmation={tipBlockNumber - transaction.blockNumber + 1}
                key={transaction.transactionHash}
                titleCard={index === 0 ? <AddressTransactionsTitle count={transactionsCount} /> : null}
                isLastItem={index === transactions.length - 1}
              />
            )
          )
        })}
      </AddressTransactionsPanel>
      {totalPages > 1 && (
        <AddressTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </AddressTransactionsPagination>
      )}
    </>
  )
}

export default {
  AddressAssetComp,
  AddressTransactions,
}
