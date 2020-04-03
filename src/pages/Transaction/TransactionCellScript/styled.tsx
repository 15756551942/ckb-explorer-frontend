import styled from 'styled-components'

export const TransactionDetailContainer = styled.div`
  .transaction__detail__separate {
    width: auto;
    height: 1px;
    background: #eaeaea;
    margin-top: -3px;
  }
`

export const TransactionDetailItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  color: ${(props: { selected?: boolean }) => (props.selected ? '#000000' : 'rgba(0, 0, 0, 0.6)')};
  font-weight: 600;
  align-items: center;
  @media (max-width: 750px) {
    margin-top: 5px;
  }
  &:after {
    content: '';
    background: ${(props: { theme: any }) => `${props.theme.primary}`};
    width: calc(100% - 4px);
    margin-top: 17px;
    height: 5px;
    display: ${(props: { theme: any; selected: boolean }) => (props.selected ? 'block' : 'none')};
  }
`

export const TransactionDetailLock = styled(TransactionDetailItem)``

export const TransactionDetailType = styled(TransactionDetailItem)`
  margin-left: 90px;
  @media (max-width: 750px) {
    margin-left: 20px;
  }
`

export const TransactionDetailData = styled(TransactionDetailItem)`
  margin-left: 90px;
  @media (max-width: 750px) {
    margin-left: 20px;
  }
`

export const TransactionCellDetailPanel = styled.div`
  width: 100%;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  .transaction__detail__modal__close {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 17px;
    > img {
      cursor: pointer;
      width: 16px;
      height: 16px;
    }
    @media (max-width: 750px) {
      padding-bottom: 15px;
      > img {
        width: 12px;
        height: 12px;
      }
    }
  }
`

export const TransactionDetailPanel = styled.div`
  width: 100%;
  margin-top: 20px;
  @media (max-width: 750px) {
    margin-top: 10px;
  }
  .transaction__detail_content {
    border: none;
    width: 100%;
    text-align: left;
    min-height: 120px;
    max-height: 250px;
    overflow-y: auto;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    word-break: break-all;
    padding: 20px 6px;
    margin-top: 5px;
    font-size: 16px;
    color: #888888;
    font-weight: bold;
    background-color: #f9f9f9;
    border-radius: 6px;
    @media (max-width: 750px) {
      font-size: 10px;
      border-radius: 3px;
      padding: 10px;
    }
  }
  .transaction__detail_copy {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    width: 100%;
    @media (max-width: 750px) {
      margin-top: 10px;
    }
  }
  .transaction__detail_loading {
    padding: 20px 0;
    @media (max-width: 750px) {
      padding: 10px 0;
    }
  }
`

export const TransactionDetailCopyButton = styled.div`
  margin: auto;
  cursor: pointer;
  width: 150px;
  height: 40px;
  background: ${props => props.theme.primary};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  > div {
    color: white;
    font-size: 20px;
  }
  > img {
    width: 24px;
    height: 24px;
  }
  @media (max-width: 750px) {
    width: 75px;
    height: 20px;
    padding: 0 10px;
    > div {
      font-size: 12px;
    }
    > img {
      width: 14px;
      height: 14px;
    }
  }
`
