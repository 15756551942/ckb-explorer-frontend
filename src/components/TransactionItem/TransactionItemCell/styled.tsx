import styled from 'styled-components'

export const TransactionCellPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;

  background: ${({ highLight = false }: { highLight?: boolean }) => (highLight ? '' : '#f5f5f5')};

  @media (min-width: 750px) {
    height: 20px;
  }

  @media (max-width: 750px) {
    justify-content: normal;
    align-items: flex-start;
    flex-direction: column;
    margin-top: 10px;
  }

  .transaction__cell_address {
    color: ${({ highLight = false, theme }: { highLight?: boolean; theme: any }) =>
      highLight ? `${theme.primary}` : '#000000'};

    font-weight: 500;
    height: 20px;
    display: flex;
    align-items: center;

    @media (max-width: 750px) {
      height: 16px;
    }

    a {
      color: ${({ theme }: { theme: any }) => `${theme.primary}`};
    }

    a:hover {
      color: ${({ theme }: { theme: any }) => `${theme.primary}`};
    }

    .nervos__dao__withdraw_icon {
      margin-left: 5px;
      width: 16px;
      height: auto;
      cursor: pointer;
      @media (max-width: 750px) {
        width: 12px;
        height: auto;
      }
    }
  }

  .transaction__cell_withdraw {
    display: flex;
    align-items: center;
    margin-top: 2px;
  }

  .transaction__cell_dao {
    color: ${({ highLight = false, theme }: { highLight?: boolean; theme: any }) =>
      highLight ? `${theme.primary}` : '#000000'};
  }
`

export const TransactionCellCapacity = styled.div`
  color: #000000;
  margin-left: 15px;
  display: flex;
  max-height: 40px;
  align-items: center;

  @media (max-width: 750px) {
    margin-left: 0px;
    margin-top: 5px;
    height: 16px;
    width: ${({ isOutput = false }: { isOutput?: boolean }) => (isOutput ? '100%' : '100%')};
    justify-content: ${({ isOutput }: { isOutput?: boolean }) => (isOutput ? 'flex-end' : 'space-between')};
    padding-right: ${({ isOutput }: { isOutput?: boolean }) => (isOutput ? '0px' : '28px')};
  }

  > span {
    margin-left: 5px;
  }
`

export const CellbasePanel = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  position: relative;
  width: 100%;
  margin-top: 20px;

  @media (max-width: 750px) {
    margin-top: 10px;
    height: 16px;
  }

  .cellbase__content {
    color: #000000;
    margin-right: 10px;
  }

  a {
    font-weight: 500;
    color: ${props => props.theme.primary};
  }

  a:hover {
    color: ${props => props.theme.primary};
  }

  .cellbase__help {
    margin-left: 10px;
    transform: translateY(2px);

    &:focus {
      outline: 0;
    }
  }

  .cellbase__help__icon {
    width: 18px;
    height: 18px;
    margin-left: 5px;

    @media (max-width: 750px) {
      width: 16px;
      height: 16px;
    }
  }
`

export const WithdrawInfoPanel = styled.div`
  > p {
    font-size: 16px;
    font-weight: 600;
    width: 100%;
    text-align: center;
    margin-bottom: 16px;

    @media (max-width: 750px) {
      font-size: 11px;
      margin-bottom: 8px;
    }
  }

  > div {
    margin: 10px;
    display: flex;

    @media (max-width: 750px) {
      margin: 5px;
    }

    .withdraw__info_title {
      font-size: 14px;
      font-weight: 450;
      width: ${({ width }: { width: string }) => {
        switch (width) {
          case 'long':
            return '240px'
          case 'medium':
            return '190px'
          default:
            return '80px'
        }
      }};

      @media (max-width: 750px) {
        font-size: 10px;
        width: ${({ width }: { width: string }) => {
          switch (width) {
            case 'long':
              return '160px'
            case 'medium':
              return '130px'
            default:
              return '60px'
          }
        }};
      }

      @media (max-width: 375px) {
        font-size: 9px;
        width: ${({ width }: { width: string }) => {
          switch (width) {
            case 'long':
              return '145px'
            case 'medium':
              return '115px'
            default:
              return '65px'
          }
        }};
      }
    }

    .withdraw__info_content {
      font-size: 14px;

      @media (max-width: 750px) {
        font-size: 10px;
      }

      @media (max-width: 375px) {
        font-size: 9px;
      }
    }

    a {
      color: ${({ theme }: { theme: any }) => theme.primary};
    }

    a:hover {
      color: ${({ theme }: { theme: any }) => `${theme.primary}`};
    }
  }
`
